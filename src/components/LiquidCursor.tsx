import { useEffect, useRef } from 'react';
import { MAX_LIQUID_STAMPS, liquidField } from '../utils/liquidField';
import { LiquidFilter, OFF, createLiquidFilter, makeBlobMap, tintValues } from '../utils/liquidFilter';
import { isLiquidEligible, liquidDecision } from '../utils/liquidCapability';

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
 * Filters come from a small pool built up front, because a new filter's blob images load asynchronously
 * and building one mid-stroke hitches. A block keeps its filter briefly after the wake leaves it, since
 * applying a filter re-rasterises the whole block. The loop updates at most about 80 times a second, so
 * high-refresh screens get an even rhythm instead of whatever the GPU manages.
 *
 * Whether this runs at all is decided on the intro screen (utils/liquidCapability).
 *
 * Targets are elements marked `data-liquid`; tall ones are split into their child blocks so filtered
 * surfaces stay about viewport-sized. The SVG has no size and filters never affect hit testing, so
 * clicks, selection, scrolling and rail dragging are untouched.
 */

const MAX_STAMPS = MAX_LIQUID_STAMPS;
const LIFE_MS = 1100; // a stamp's full life; the water is still well before this
const DECAY_MS = 300; // envelope time constant
const WAVE_MS = 800; // period of the back-and-forth of the water
const FADE_IN_MS = 90; // stamps ease in, so nothing appears abruptly
const DISPLACEMENT = 14; // filter scale: content moves at most half of this (7px); a slow stroke ~3px
const CURL = 0.35; // sideways share of the motion, from the path's turning
const POOL_START = 3; // filters built up front; enough for the blocks a wake usually overlaps
const POOL_MAX = 8;
const HOLD_MS = 400; // how long a block keeps its filter after the wake leaves it
const MIN_FRAME_MS = 12; // about 80 updates a second at most
const SLOW_FRAME = 25; // ms; a sustained run of these switches the effect off
const SLOW_SHARE = 30; // of 60 frames

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

interface Applied {
  filter: LiquidFilter;
  lastHit: number;
  ownFilter: string; // the element's own inline filter, restored afterwards
}

export default function LiquidCursor() {
  const defsRef = useRef<SVGDefsElement>(null);

  useEffect(() => {
    let teardown: (() => void) | null = null;
    let allowed = false; // the intro screen's verdict, then the frame-time guard for the rest of the session

    const setup = () => {
      const defs = defsRef.current;
      const mapUrl = defs ? makeBlobMap() : null;
      if (!defs || !mapUrl) return null;

      const stamps: Stamp[] = [];
      const applied = new Map<HTMLElement, Applied>();
      const pool: LiquidFilter[] = [];
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
      let lastRenderT = 0;
      let slowFrames = 0;
      let measuredFrames = 0;
      let windingDown = false; // the guard tripped: no new stamps, the water settles, then teardown

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

      const addFilter = () => {
        const filter = createLiquidFilter(`znx-liquid-${filterCount++}`, mapUrl, DISPLACEMENT);
        defs.appendChild(filter.node);
        return filter;
      };
      for (let i = 0; i < POOL_START; i++) pool.push(addFilter());

      const release = (el: HTMLElement, a: Applied) => {
        el.style.filter = a.ownFilter;
        applied.delete(el);
        pool.push(a.filter);
      };

      const releaseAll = () => applied.forEach((a, el) => release(el, a));

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
          let a = applied.get(el);
          if (!hit.length && (!a || !rect || now - a.lastHit > HOLD_MS)) {
            if (a) release(el, a);
            return;
          }
          if (!a) {
            const filter = pool.pop() ?? (filterCount < POOL_MAX ? addFilter() : null);
            if (!filter) return; // the wake is over more blocks than the pool; the rest stay undistorted
            a = { filter, lastHit: now, ownFilter: el.style.filter };
            applied.set(el, a);
            el.style.filter = `${a.ownFilter} url(#${filter.id})`.trim();
          }
          if (hit.length) a.lastHit = now;
          a.filter.slots.forEach((slot, i) => {
            const s = hit[i];
            if (!s || !rect) {
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
        });

        return stamps.length > 0;
      };

      const loop = (now: number) => {
        // High-refresh screens: keep an even rhythm rather than rewriting the filters on every refresh
        if (now - lastRenderT < MIN_FRAME_MS) {
          frame = requestAnimationFrame(loop);
          return;
        }

        // Frame-time guard: if filtered frames stay slow on this machine, stop for the session rather
        // than making scrolling and video janky (the intro screen's check catches most of these earlier)
        if (lastRenderT && !windingDown) {
          const dt = now - lastRenderT;
          if (dt < 250) {
            // gaps over 250ms are a hidden/throttled tab, not rendering cost
            measuredFrames++;
            if (dt > SLOW_FRAME) slowFrames++;
            if (measuredFrames >= 60) {
              if (slowFrames > SLOW_SHARE) {
                windingDown = true;
                console.info('[ZNX] Liquid cursor disabled: frames too slow on this device.');
              }
              measuredFrames = slowFrames = 0;
            }
          }
        }
        lastRenderT = now;

        if (render(now)) {
          frame = requestAnimationFrame(loop);
        } else {
          frame = 0;
          lastRenderT = 0;
          liquidField.count = 0;
          releaseAll();
          if (windingDown) {
            allowed = false;
            evaluate();
          }
        }
      };

      const wake = () => {
        if (frame) return;
        // Waking up: pick up the current blocks (the route may have changed)
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
          // the filter samples whole pixels, so a steep bend drops columns and breaks thin text apart: wide
          // stamps and a modest shift keep the gradient low enough that letters bend without fragmenting
          radius: Math.min(200, 120 + speed * 40),
          born: now,
          sx: 0,
          sy: 0,
        };
        if (stamps.length >= MAX_STAMPS) {
          // Spacing keeps the pool from filling at a sustained speed, but a sudden flick outruns it.
          // Reuse the oldest stamp only once it has faded: dropping a strong one is a visible jump
          if (now - stamps[0].born < LIFE_MS * 0.5) return;
          stamps.shift();
        }
        stamps.push(stamp);
      };

      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse' || windingDown) return;
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
        lastRenderT = 0;
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
      teardown = allowed && isLiquidEligible() ? setup() : null;
    };
    let unmounted = false;
    liquidDecision.then((ok) => {
      if (unmounted) return;
      allowed = ok;
      evaluate();
    });
    queries.forEach((q) => q.addEventListener('change', evaluate));

    return () => {
      unmounted = true;
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
