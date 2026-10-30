import { useEffect, useRef } from 'react';
import { MAX_LIQUID_STAMPS, liquidField, liquidFalloff } from '../utils/liquidField';

/*
 * Desktop-only liquid cursor: the pointer behaves like a finger drawn through a water surface, and the
 * rendered page itself (headings, text, images, cards) bends with it.
 *
 * Model: as the pointer moves it lays a continuous wake of soft, overlapping "stamps" along its path
 * (spacing adapts to speed, so the wake is always one connected stroke, never separate circles). Each
 * stamp pushes the content along the direction of travel, then springs back and forth with a decaying
 * oscillation, with a slight sideways curl on turns. Because stamps along the trail have different
 * ages, the oscillations form elongated waves that travel behind the pointer and settle when it stops.
 * Speed scales the push and the wake's width; direction sets its orientation.
 *
 * Rendering: one SVG `feDisplacementMap` per content block the wake currently overlaps, applied with
 * CSS `filter: url(#…)`. The map is a flat grey flood plus the stamps (one soft blob image each, tinted
 * per frame with a colour matrix that encodes direction and strength), merged in a single feMerge. Per
 * frame the work is attribute writes only: no DOM rasterisation and no React state. When the water has
 * settled every filter is removed (idle text stays pixel-sharp) and the loop stops.
 *
 * The WebGL snow does not get a filter: it reads the same field (utils/liquidField) and displaces its
 * particles in its own vertex shader, which avoids a second full-screen filter pass.
 *
 * Targets are elements marked `data-liquid`; tall ones are split into their child blocks so filtered
 * surfaces stay about viewport-sized. The SVG has no size and filters never affect hit testing, so
 * clicks, selection, scrolling and rail dragging are untouched.
 */

const MAX_STAMPS = MAX_LIQUID_STAMPS;
const LIFE_MS = 1500; // a stamp's full life; the water is still well before this
const DECAY_MS = 420; // envelope time constant
const WAVE_MS = 900; // period of the back-and-forth of the water
const FADE_IN_MS = 90; // stamps ease in, so nothing appears abruptly
const DISPLACEMENT = 24; // filter scale: content moves at most half of this (12px); a slow stroke ~4px
const CURL = 0.35; // sideways share of the motion, from the path's turning
const MAP_SIZE = 64;

const isEligible = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  window.matchMedia('(min-width: 1024px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// SVG filters on HTML content are GPU-composited in Chromium; WebKit and Gecko either rasterise them on
// the CPU or render displacement on HTML unreliably, so they keep the plain (undistorted) page.
const isSupportedEngine = () => {
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  if (!brands?.some((b) => /Chromium/i.test(b.brand))) return false;
  // Without GPU acceleration the filter would run in software every frame
  const probe = document.createElement('canvas').getContext('webgl');
  probe?.getExtension('WEBGL_lose_context')?.loseContext();
  return !!probe;
};

/** Soft round blob: alpha holds the falloff, colour is set per stamp by a colour matrix. */
function makeBlobMap() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = MAP_SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  const image = ctx.createImageData(MAP_SIZE, MAP_SIZE);
  const half = MAP_SIZE / 2;
  for (let y = 0; y < MAP_SIZE; y++) {
    for (let x = 0; x < MAP_SIZE; x++) {
      const r = Math.hypot(x + 0.5 - half, y + 0.5 - half) / half;
      const p = (y * MAP_SIZE + x) * 4;
      image.data[p] = image.data[p + 1] = image.data[p + 2] = 255;
      image.data[p + 3] = r >= 1 ? 0 : Math.round(liquidFalloff(r) * 255);
    }
  }
  ctx.putImageData(image, 0, 0);
  return canvas.toDataURL('image/png');
}

const SVG_NS = 'http://www.w3.org/2000/svg';
// Colour matrix that replaces the blob's colour with a fixed displacement vector (r, g) and scales its
// alpha by the stamp's strength
const tintValues = (r: string, g: string, a: string) => `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 0.5 0 0 0 ${a} 0`;
const OFF = tintValues('0.5', '0.5', '0');

interface Stamp {
  x: number; // viewport px, fixed where it was laid down
  y: number;
  dx: number; // unit direction of travel
  dy: number;
  curl: number; // -1..1, from the path's turning
  strength: number; // 0..1, from speed
  radius: number; // px, from speed
  born: number;
  // Per frame: content shift at the centre, as a fraction of the maximum (|shift| <= 1)
  sx: number;
  sy: number;
}

interface Slot {
  image: SVGFEImageElement;
  tint: SVGFEColorMatrixElement;
  geo: string; // last written geometry / tint, to skip identical writes
  col: string;
}

interface TargetFilter {
  id: string;
  node: SVGFilterElement;
  slots: Slot[];
  applied: boolean;
  ownFilter: string; // the element's own inline filter, restored afterwards
}

export default function LiquidCursor() {
  const defsRef = useRef<SVGDefsElement>(null);

  useEffect(() => {
    let teardown: (() => void) | null = null;
    let disabled = false; // set by the frame-time guard for the rest of the session

    const setup = () => {
      const defs = defsRef.current;
      const mapUrl = defs && isSupportedEngine() ? makeBlobMap() : null;
      if (!defs || !mapUrl) return null;

      const stamps: Stamp[] = [];
      const filters = new Map<HTMLElement, TargetFilter>();
      let targets: HTMLElement[] = [];
      let frame = 0;
      let filterCount = 0;
      // Pointer tracking (pointer handlers only record; rendering happens in the rAF loop)
      let lastX = -1;
      let lastY = -1;
      let lastT = 0;
      let wakeX = 0; // where the last stamp was laid
      let wakeY = 0;
      let velX = 0; // smoothed velocity, px/ms
      let velY = 0;
      let dirX = 1;
      let dirY = 0;
      let curl = 0;
      let lastFrameT = 0;
      let slowFrames = 0;
      let measuredFrames = 0;

      // Tall blocks are split into children so each filtered surface stays roughly viewport-sized
      const collectTargets = () => {
        const out: HTMLElement[] = [];
        const visit = (el: HTMLElement, depth: number) => {
          if (el.offsetHeight === 0) return;
          const kids = Array.from(el.children).filter(
            (c): c is HTMLElement => c instanceof HTMLElement && c.offsetHeight > 0
          );
          if (depth < 3 && kids.length > 1 && el.offsetHeight > window.innerHeight * 1.5) {
            kids.forEach((kid) => visit(kid, depth + 1));
          } else {
            out.push(el);
          }
        };
        document.querySelectorAll<HTMLElement>('[data-liquid]').forEach((el) => visit(el, 0));
        return out;
      };

      const createFilter = (): TargetFilter => {
        const id = `znx-liquid-${filterCount++}`;
        const filter = document.createElementNS(SVG_NS, 'filter');
        filter.setAttribute('id', id);
        filter.setAttribute('x', '0');
        filter.setAttribute('y', '0');
        filter.setAttribute('width', '1');
        filter.setAttribute('height', '1');
        // sRGB keeps 128 grey as "no displacement" (linearRGB would shift the whole block)
        filter.setAttribute('color-interpolation-filters', 'sRGB');

        const flood = document.createElementNS(SVG_NS, 'feFlood');
        flood.setAttribute('flood-color', 'rgb(128,128,128)');
        flood.setAttribute('result', 'base');
        filter.appendChild(flood);

        const merge = document.createElementNS(SVG_NS, 'feMerge');
        merge.setAttribute('result', 'map');
        const baseNode = document.createElementNS(SVG_NS, 'feMergeNode');
        baseNode.setAttribute('in', 'base');
        merge.appendChild(baseNode);

        // Each stamp is a blob image plus a tint, both limited to the stamp's own square
        const slots: Slot[] = [];
        for (let i = 0; i < MAX_STAMPS; i++) {
          const image = document.createElementNS(SVG_NS, 'feImage');
          image.setAttribute('href', mapUrl);
          image.setAttribute('preserveAspectRatio', 'none');
          image.setAttribute('width', '0');
          image.setAttribute('height', '0');
          image.setAttribute('result', `b${i}`);
          const tint = document.createElementNS(SVG_NS, 'feColorMatrix');
          tint.setAttribute('in', `b${i}`);
          tint.setAttribute('type', 'matrix');
          tint.setAttribute('values', OFF);
          tint.setAttribute('result', `s${i}`);
          filter.append(image, tint);
          const node = document.createElementNS(SVG_NS, 'feMergeNode');
          node.setAttribute('in', `s${i}`);
          merge.appendChild(node);
          slots.push({ image, tint, geo: 'off', col: OFF });
        }
        filter.appendChild(merge);

        const displace = document.createElementNS(SVG_NS, 'feDisplacementMap');
        displace.setAttribute('in', 'SourceGraphic');
        displace.setAttribute('in2', 'map');
        displace.setAttribute('scale', String(DISPLACEMENT));
        displace.setAttribute('xChannelSelector', 'R');
        displace.setAttribute('yChannelSelector', 'G');
        filter.appendChild(displace);

        defs.appendChild(filter);
        return { id, node: filter, slots, applied: false, ownFilter: '' };
      };

      const release = (el: HTMLElement, f: TargetFilter) => {
        if (!f.applied) return;
        el.style.filter = f.ownFilter;
        f.applied = false;
      };

      const releaseAll = () => filters.forEach((f, el) => release(el, f));

      const publishField = (live: Stamp[]) => {
        const n = Math.min(live.length, MAX_STAMPS);
        for (let i = 0; i < n; i++) {
          const s = live[i];
          liquidField.stamps[i * 4] = s.x;
          liquidField.stamps[i * 4 + 1] = s.y;
          liquidField.stamps[i * 4 + 2] = s.sx * DISPLACEMENT * 0.5;
          liquidField.stamps[i * 4 + 3] = s.sy * DISPLACEMENT * 0.5;
          liquidField.radii[i] = s.radius;
        }
        liquidField.count = n;
      };

      const render = (now: number) => {
        // Advance the water: each stamp pushes along its direction, then oscillates and settles
        for (let i = stamps.length - 1; i >= 0; i--) {
          const s = stamps[i];
          const age = now - s.born;
          if (age >= LIFE_MS) {
            stamps.splice(i, 1);
            continue;
          }
          const fadeIn = Math.min(1, age / FADE_IN_MS);
          const envelope = Math.exp(-age / DECAY_MS) * fadeIn * fadeIn * (3 - 2 * fadeIn);
          const phase = (age / WAVE_MS) * Math.PI * 2;
          const along = Math.cos(phase);
          const side = s.curl * CURL * Math.sin(phase);
          const k = s.strength * envelope;
          // direction of travel + its perpendicular (-dy, dx)
          s.sx = (s.dx * along - s.dy * side) * k;
          s.sy = (s.dy * along + s.dx * side) * k;
        }
        publishField(stamps);

        // Read phase: every rect before any write, so the browser lays out at most once per frame
        const rects = targets.map((el) =>
          el.isConnected && el.closest('[data-liquid]') ? el.getBoundingClientRect() : null
        );

        // Write phase
        targets.forEach((el, t) => {
          const rect = rects[t];
          const hit = rect
            ? stamps.filter(
                (s) =>
                  s.x + s.radius > rect.left &&
                  s.x - s.radius < rect.right &&
                  s.y + s.radius > rect.top &&
                  s.y - s.radius < rect.bottom
              )
            : [];
          let f = filters.get(el);
          if (!rect || !hit.length) {
            if (f) release(el, f);
            return;
          }
          if (!f) {
            f = createFilter();
            filters.set(el, f);
          }
          f.slots.forEach((slot, i) => {
            const s = hit[i];
            if (!s) {
              if (slot.geo !== 'off') {
                slot.image.setAttribute('width', '0');
                slot.tint.setAttribute('values', OFF);
                slot.geo = 'off';
                slot.col = OFF;
              }
              return;
            }
            // Filter user space is the element's border box
            const size = (s.radius * 2).toFixed(1);
            const geo = `${(s.x - rect.left - s.radius).toFixed(1)},${(s.y - rect.top - s.radius).toFixed(1)},${size}`;
            if (geo !== slot.geo) {
              const [x, y] = geo.split(',');
              slot.image.setAttribute('x', x);
              slot.image.setAttribute('y', y);
              slot.image.setAttribute('width', size);
              slot.image.setAttribute('height', size);
              slot.geo = geo;
            }
            // feDisplacementMap samples *from* the encoded offset, so content moves opposite to it:
            // encode -shift to move the content along the shift
            const mag = Math.hypot(s.sx, s.sy);
            const ux = mag > 1e-4 ? -s.sx / mag : 0;
            const uy = mag > 1e-4 ? -s.sy / mag : 0;
            const col = tintValues((0.5 + 0.5 * ux).toFixed(3), (0.5 + 0.5 * uy).toFixed(3), Math.min(1, mag).toFixed(3));
            if (col !== slot.col) {
              slot.tint.setAttribute('values', col);
              slot.col = col;
            }
          });
          if (!f.applied) {
            f.ownFilter = el.style.filter;
            el.style.filter = `${f.ownFilter} url(#${f.id})`.trim();
            f.applied = true;
          }
        });

        return stamps.length > 0;
      };

      const loop = (now: number) => {
        // Frame-time guard: if the filtered frames are consistently slow on this machine, turn the
        // effect off for the session rather than making scrolling and video janky
        if (lastFrameT) {
          const dt = now - lastFrameT;
          if (dt < 250) {
            // gaps over 250ms are a hidden/throttled tab, not rendering cost
            measuredFrames++;
            if (dt > 34) slowFrames++;
            if (measuredFrames >= 60) {
              if (slowFrames > 30) {
                disabled = true;
                console.info('[ZNX] Liquid cursor disabled: frames too slow on this device.');
                evaluate();
                return;
              }
              measuredFrames = slowFrames = 0;
            }
          }
        }
        lastFrameT = now;

        if (render(now)) {
          frame = requestAnimationFrame(loop);
        } else {
          frame = 0;
          lastFrameT = 0;
          liquidField.count = 0;
          releaseAll();
        }
      };

      const wake = () => {
        if (frame) return;
        // Waking up: drop filters of blocks that left the page (route changes), so neither the SVG
        // nodes nor references to detached elements accumulate, then pick up the current blocks
        filters.forEach((f, el) => {
          if (el.isConnected) return;
          f.node.remove();
          filters.delete(el);
        });
        targets = collectTargets();
        frame = requestAnimationFrame(loop);
      };

      const layStamp = (x: number, y: number, speed: number, now: number) => {
        const stamp: Stamp = {
          x,
          y,
          dx: dirX,
          dy: dirY,
          curl,
          strength: Math.min(0.8, 0.35 + speed * 0.4),
          // wide, soft stamps keep the field gradient low: smooth bends, no tearing at text edges
          radius: Math.min(170, 85 + speed * 40),
          born: now,
          sx: 0,
          sy: 0,
        };
        if (stamps.length >= MAX_STAMPS) {
          // Spacing keeps the pool from filling at any sustained speed; if it does, reuse the oldest
          // (already the weakest) stamp rather than dropping a strong one
          stamps.shift();
        }
        stamps.push(stamp);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const now = performance.now();
        const x = e.clientX;
        const y = e.clientY;
        if (lastX < 0) {
          lastX = wakeX = x;
          lastY = wakeY = y;
          lastT = now;
          velX = velY = 0;
          return;
        }
        const dt = Math.max(1, now - lastT);
        // Smoothed velocity: direction changes turn the wake instead of snapping it
        velX += ((x - lastX) / dt - velX) * 0.35;
        velY += ((y - lastY) / dt - velY) * 0.35;
        lastX = x;
        lastY = y;
        lastT = now;

        const speed = Math.hypot(velX, velY);
        if (speed > 0.01) {
          const nx = velX / speed;
          const ny = velY / speed;
          // Turning direction (cross product) curls the water sideways, smoothed
          curl += (Math.max(-1, Math.min(1, (dirX * ny - dirY * nx) * 6)) - curl) * 0.2;
          dirX = nx;
          dirY = ny;
        }

        // Lay stamps along the path from the last one; spacing grows with speed so the pool never
        // fills at a sustained speed, and stamps always overlap into one continuous stroke
        const spacing = Math.max(10, Math.min(180, (speed * LIFE_MS) / MAX_STAMPS));
        let gx = x - wakeX;
        let gy = y - wakeY;
        let gap = Math.hypot(gx, gy);
        let laid = false;
        while (gap >= spacing) {
          wakeX += (gx / gap) * spacing;
          wakeY += (gy / gap) * spacing;
          layStamp(wakeX, wakeY, speed, now);
          laid = true;
          gx = x - wakeX;
          gy = y - wakeY;
          gap = Math.hypot(gx, gy);
        }
        if (laid) wake();
      };

      const onLeave = () => {
        lastX = lastY = -1;
      };

      // A hidden tab drops its water at once instead of finishing it on return
      const onVisibility = () => {
        if (!document.hidden) return;
        stamps.length = 0;
        liquidField.count = 0;
        cancelAnimationFrame(frame);
        frame = 0;
        lastFrameT = 0;
        releaseAll();
      };

      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        cancelAnimationFrame(frame);
        window.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('mouseleave', onLeave);
        document.removeEventListener('visibilitychange', onVisibility);
        liquidField.count = 0;
        releaseAll();
        filters.clear();
        defs.replaceChildren();
      };
    };

    // (Re)evaluate when the input type, width or motion preference changes
    const queries = [
      window.matchMedia('(hover: hover) and (pointer: fine)'),
      window.matchMedia('(min-width: 1024px)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    const evaluate = () => {
      teardown?.();
      teardown = !disabled && isEligible() ? setup() : null;
    };
    evaluate();
    queries.forEach((q) => q.addEventListener('change', evaluate));

    return () => {
      queries.forEach((q) => q.removeEventListener('change', evaluate));
      teardown?.();
    };
  }, []);

  return (
    <svg aria-hidden="true" focusable="false" width="0" height="0" className="pointer-events-none absolute">
      <defs ref={defsRef} />
    </svg>
  );
}
