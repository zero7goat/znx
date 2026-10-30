/**
 * The liquid cursor's current water field, shared with renderers that distort themselves instead of
 * going through the page's SVG displacement filter (the WebGL snow moves its particles with it in its
 * vertex shader, which is far cheaper than filtering its full-screen canvas).
 *
 * Written by LiquidCursor once per animation frame, read by ThreeWorld; plain mutable data, no React.
 */
export const MAX_LIQUID_STAMPS = 24;

export const liquidField = {
  /** Number of live stamps (0 = water is still) */
  count: 0,
  /** Per stamp: centre x, centre y (viewport px), content shift x, shift y (px at the stamp centre) */
  stamps: new Float32Array(MAX_LIQUID_STAMPS * 4),
  /** Per stamp: radius in px */
  radii: new Float32Array(MAX_LIQUID_STAMPS),
};

/**
 * Stamp falloff by normalised distance from the centre (0 centre, 1 edge). LiquidCursor bakes the same
 * curve into its displacement image and ThreeWorld applies it per particle, so both distort identically.
 */
export const liquidFalloff = (r: number) => {
  const t = Math.min(1, Math.max(0, (r - 0.8) / 0.2));
  return Math.exp(-r * r * 3.2) * (1 - t * t * (3 - 2 * t));
};
