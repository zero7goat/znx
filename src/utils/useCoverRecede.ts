import { useRef } from 'react';
import { useReducedMotion, useScroll, useTransform } from 'motion/react';

/**
 * Scroll-linked "recede" for a sticky section while the next section slides over it.
 *
 * Render `<div ref={markerRef} aria-hidden="true" />` directly after the sticky section.
 * The marker is not sticky, so it sits exactly where the covering section starts:
 * progress runs from when that edge enters the viewport bottom until it reaches the top.
 * (Tracking the sticky element itself is unreliable because its box stays pinned.)
 * Returns motion style values (transform + opacity only, so it stays on the compositor).
 */
export function useCoverRecede() {
  const markerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: markerRef, offset: ['start end', 'start start'] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return { markerRef, recedeStyle: reduceMotion ? {} : { scale, opacity } };
}
