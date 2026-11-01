import { MAX_LIQUID_STAMPS } from './liquidField';
import { createLiquidFilter, makeBlobMap, tintValues } from './liquidFilter';

/*
 * Decides, once per page load and during the intro screen, whether this device runs the liquid cursor.
 *
 * 1. Requirements: desktop pointer, wide screen, no reduced motion, Chromium (other engines render
 *    displacement on HTML on the CPU or unreliably). Failing these is not "low end", the effect simply
 *    does not apply, so nothing is measured.
 * 2. Hardware floor: software rendering, or too few cores / too little memory.
 * 3. Benchmark: the real filter on the full-size intro screen, driven like a heavy stroke, doubled for
 *    headroom because the live page also composites images, the snow and scrolling content. Visually
 *    nothing happens: the displacement is at most half a pixel.
 *
 * LiquidCursor waits on `liquidDecision`, and keeps its own frame-time guard for what no start-up test
 * can see (thermal throttling, other apps taking the GPU later).
 */

const MIN_CORES = 4;
const MIN_MEMORY_GB = 4;
const SOFTWARE_GPU = /swiftshader|llvmpipe|software|basic render/i;

const SETTLE_MS = 300; // applying the filter costs a few slow frames; not what is being measured
const MEASURE_MS = 800;
const ATTEMPTS = 2; // start-up work can spoil one run; a device that is really too slow fails both
const MIN_FRAMES = 12;
const GIVE_UP_MS = 2500; // no frames at all counts as a failure
const MAX_MEDIAN_MS = 22; // ~45fps with the doubled load
const MAX_SLOW_SHARE = 0.1; // share of frames allowed to miss a 60Hz refresh
const SLOW_FRAME_MS = 25;

type Decision = { ok: boolean; reason: string };

let resolveDecision: (ok: boolean) => void = () => {};
let started = false;

/** Resolves once the check has run; the cursor stays off until then. */
export const liquidDecision = new Promise<boolean>((resolve) => {
  resolveDecision = resolve;
});

export const isLiquidEligible = () =>
  window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
  window.matchMedia('(min-width: 1024px)').matches &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const isChromium = () => {
  const brands = (navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } }).userAgentData?.brands;
  return !!brands?.some((b) => /Chromium/i.test(b.brand));
};

/** Reason the device is below the floor, or '' when it can be benchmarked. */
function hardwareFloor() {
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (nav.connection?.saveData) return 'data saver';
  if ((nav.hardwareConcurrency || 0) < MIN_CORES) return `${nav.hardwareConcurrency || 'unknown'} CPU threads`;
  if (nav.deviceMemory !== undefined && nav.deviceMemory < MIN_MEMORY_GB) return `${nav.deviceMemory}GB memory`;

  // Refuses software renderers outright; the renderer name catches the ones that slip through
  const gl = document.createElement('canvas').getContext('webgl', { failIfMajorPerformanceCaveat: true });
  if (!gl) return 'no hardware WebGL';
  const info = gl.getExtension('WEBGL_debug_renderer_info');
  const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : '';
  gl.getExtension('WEBGL_lose_context')?.loseContext();
  return SOFTWARE_GPU.test(renderer) ? `software GPU (${renderer})` : '';
}

const whenVisible = () =>
  new Promise<void>((resolve) => {
    if (!document.hidden) return resolve();
    const onChange = () => {
      if (document.hidden) return;
      document.removeEventListener('visibilitychange', onChange);
      resolve();
    };
    document.addEventListener('visibilitychange', onChange);
  });

/** Runs the real filter over `surfaces` and returns the frame times. */
function timeFilter(surfaces: HTMLElement[], defs: SVGDefsElement, mapUrl: string) {
  const filters = surfaces.map((_, i) => createLiquidFilter(`znx-liquid-test-${i}`, mapUrl, 1));
  filters.forEach((f) => defs.appendChild(f.node));
  const owners = surfaces.map((el) => el.style.filter);
  const width = window.innerWidth;
  const height = window.innerHeight;

  return new Promise<number[]>((resolve) => {
    const frames: number[] = [];
    const startT = performance.now();
    let lastT = 0;
    let raf = 0;
    const finish = () => {
      cancelAnimationFrame(raf);
      clearTimeout(giveUp);
      surfaces.forEach((el, i) => (el.style.filter = owners[i]));
      filters.forEach((f) => f.node.remove());
      resolve(frames);
    };
    const giveUp = setTimeout(finish, GIVE_UP_MS);
    const tick = (now: number) => {
      const t = now - startT;
      // Every stamp moves every frame, the worst the live cursor ever asks for
      filters.forEach((f) =>
        f.slots.forEach((slot, i) => {
          const a = (i / MAX_LIQUID_STAMPS) * Math.PI * 2 + t / 180;
          const radius = 200;
          slot.image.setAttribute('x', (width / 2 + Math.cos(a) * width * 0.3 - radius).toFixed(1));
          slot.image.setAttribute('y', (height / 2 + Math.sin(a) * height * 0.3 - radius).toFixed(1));
          slot.image.setAttribute('width', String(radius * 2));
          slot.image.setAttribute('height', String(radius * 2));
          slot.tint.setAttribute('values', tintValues((0.5 + Math.cos(a) * 0.5).toFixed(3), (0.5 + Math.sin(a) * 0.5).toFixed(3), '0.8'));
        })
      );
      if (lastT && t > SETTLE_MS) frames.push(now - lastT);
      lastT = now;
      if (t >= SETTLE_MS + MEASURE_MS) return finish();
      raf = requestAnimationFrame(tick);
    };
    surfaces.forEach((el, i) => (el.style.filter = `${owners[i]} url(#${filters[i].id})`.trim()));
    raf = requestAnimationFrame(tick);
  });
}

const whenIdle = () =>
  new Promise<void>((resolve) => {
    if ('requestIdleCallback' in window) requestIdleCallback(() => resolve(), { timeout: 600 });
    else setTimeout(resolve, 200);
  });

async function benchmark(outer: HTMLElement, inner: HTMLElement, defs: SVGDefsElement): Promise<Decision> {
  const mapUrl = makeBlobMap();
  if (!mapUrl) return { ok: false, reason: 'no 2D canvas' };
  let result: Decision = { ok: false, reason: 'not measured' };
  for (let attempt = 0; attempt < ATTEMPTS && !result.ok; attempt++) {
    await whenVisible();
    await whenIdle();
    const frames = await timeFilter([outer, inner], defs, mapUrl);
    if (frames.length < MIN_FRAMES) {
      result = { ok: false, reason: `only ${frames.length} frames rendered` };
      continue;
    }
    const sorted = [...frames].sort((a, b) => a - b);
    const medianMs = +sorted[sorted.length >> 1].toFixed(1);
    const slowShare = frames.filter((f) => f > SLOW_FRAME_MS).length / frames.length;
    result = {
      ok: medianMs <= MAX_MEDIAN_MS && slowShare <= MAX_SLOW_SHARE,
      reason: `median ${medianMs}ms, ${Math.round(slowShare * 100)}% slow frames`,
    };
  }
  return result;
}

/**
 * Runs the check on the intro screen. `outer` and `inner` are two nested full-size elements, which is what
 * doubles the filter load; both are left exactly as they were.
 */
export async function checkLiquidCapability(outer: HTMLElement, inner: HTMLElement, defs: SVGDefsElement) {
  if (started) return liquidDecision;
  started = true;

  let decision: Decision;
  if (!isLiquidEligible() || !isChromium()) {
    decision = { ok: false, reason: 'not applicable on this device or browser' };
  } else {
    const floor = hardwareFloor();
    decision = floor ? { ok: false, reason: floor } : await benchmark(outer, inner, defs);
  }

  document.documentElement.dataset.liquid = decision.ok ? 'on' : 'off';
  console.info(`[ZNX] Liquid cursor ${decision.ok ? 'on' : 'off'}: ${decision.reason}.`);
  resolveDecision(decision.ok);
  return decision.ok;
}
