import { MAX_LIQUID_STAMPS, liquidFalloff } from './liquidField';

/*
 * The SVG displacement filter behind the liquid cursor, shared by the cursor itself and by the device
 * capability check (which times this exact filter, so the check measures the real cost).
 */

const MAP_SIZE = 64;
const SVG_NS = 'http://www.w3.org/2000/svg';

// Colour matrix that replaces the blob's colour with a fixed displacement vector (r, g) and scales its
// alpha by the stamp's strength
export const tintValues = (r: string, g: string, a: string) => `0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 0.5 0 0 0 ${a} 0`;
export const OFF = tintValues('0.5', '0.5', '0');

/** Soft round blob: alpha holds the falloff, colour is set per stamp by a colour matrix. */
export function makeBlobMap() {
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

export interface LiquidSlot {
  image: SVGFEImageElement;
  tint: SVGFEColorMatrixElement;
  geo: string; // last written geometry / tint, to skip identical writes
  col: string;
}

export interface LiquidFilter {
  id: string;
  node: SVGFilterElement;
  slots: LiquidSlot[];
}

/** One filter: a flat grey flood plus one blob per stamp, merged, driving a displacement of the element. */
export function createLiquidFilter(id: string, mapUrl: string, scale: number): LiquidFilter {
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
  const slots: LiquidSlot[] = [];
  for (let i = 0; i < MAX_LIQUID_STAMPS; i++) {
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
  displace.setAttribute('scale', String(scale));
  displace.setAttribute('xChannelSelector', 'R');
  displace.setAttribute('yChannelSelector', 'G');
  filter.appendChild(displace);

  return { id, node: filter, slots };
}
