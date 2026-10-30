import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

type RevealVariant = 'rise' | 'mask' | 'clip';

interface ScrollRevealProps {
  children: React.ReactNode;
  key?: React.Key;
  className?: string;
  /**
   * rise (default): fade + translate (+ optional scale).
   * mask: content slides up from behind its own edge (for headings/lines; the wrapper clips).
   * clip: an upward clip-path unveil with a slight lift (for images and panels).
   */
  variant?: RevealVariant;
  delay?: number; // delay in seconds
  duration?: number; // duration in seconds (default: 0.9s for ultra-smooth motion)
  yOffset?: number; // y distance in px (default: 32px)
  xOffset?: number; // x distance in px
  scale?: number; // scale multiplier when hidden (e.g. 0.97)
  staggerIndex?: number; // multiplier for staggered lists (e.g. 0, 1, 2...)
  staggerStep?: number; // stagger step in seconds (default: 0.08s)
  once?: boolean; // if true (default), stays visible once entered; false makes it reversible
  threshold?: number; // IntersectionObserver threshold
  rootMargin?: string; // IntersectionObserver rootMargin
  inline?: boolean; // render as inline-block span if needed
}

const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Layout effect on the client (runs before paint), plain effect where there is no DOM
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

export default function ScrollReveal({
  children,
  className = '',
  variant = 'rise',
  delay = 0,
  duration = 0.9,
  yOffset = 32,
  xOffset = 0,
  scale = 1,
  staggerIndex = 0,
  staggerStep = 0.08,
  once = true,
  threshold = 0.08,
  rootMargin = '0px 0px -5% 0px',
  inline = false,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Visible by default: markup is readable even if no script/animation ever runs.
  // Elements are only hidden (before first paint) when they are actually about to animate.
  const [isVisible, setIsVisible] = useState(true);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || typeof IntersectionObserver === 'undefined') {
      return; // stay visible, no animation
    }

    setIsVisible(false);

    let raf1 = 0;
    let raf2 = 0;
    const rect = el.getBoundingClientRect();
    const inViewNow = rect.top < window.innerHeight && rect.bottom > 0;
    if (inViewNow) {
      // Already on screen: play the entrance on the next frames, without waiting for an observer
      raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setIsVisible(true));
      });
      if (once) {
        return () => {
          cancelAnimationFrame(raf1);
          cancelAnimationFrame(raf2);
        };
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        root: null,
        // For one-shot reveals, extend the observed area far above the viewport so content
        // that was jumped past (End key, anchors, back navigation, fast flicks) still reveals
        rootMargin: once ? ['99999px', ...rootMargin.split(' ').slice(1)].join(' ') : rootMargin,
        threshold,
      }
    );
    observer.observe(el);

    // Safety net: if the observer never reports (rare browser/embedding quirks), reveal anything that
    // is on screen or already scrolled past after a short wait, so content can't stay invisible
    const fallback = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) setIsVisible(true);
    }, 1500);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, [once, threshold, rootMargin]);

  const totalDelay = Math.max(0, delay + staggerIndex * staggerStep);
  const timing = `${duration}s ${EASE} ${totalDelay}s`;

  if (variant === 'mask') {
    // Outer element clips (and is what the observer watches, untransformed); inner content rises.
    // The small padding/negative margin keeps descenders from being clipped once revealed.
    const Outer = inline ? 'span' : 'div';
    return (
      <Outer
        ref={ref as React.Ref<HTMLDivElement>}
        className={`${inline ? 'inline-block' : 'block'} overflow-hidden pb-[0.12em] -mb-[0.12em] ${className}`}
      >
        <span
          className="block"
          style={{
            transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, 105%, 0)',
            transition: `transform ${timing}`,
            willChange: isVisible ? 'auto' : 'transform',
          }}
        >
          {children}
        </span>
      </Outer>
    );
  }

  if (variant === 'clip') {
    // The observer must watch an unclipped wrapper: IntersectionObserver honours the target's own
    // clip-path, so an element clipped to nothing would never report as visible.
    return (
      <div ref={ref} className={className}>
        <div
          style={{
            clipPath: isVisible ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
            transform: isVisible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${yOffset * 0.5}px, 0)`,
            transition: `clip-path ${timing}, transform ${timing}`,
            willChange: isVisible ? 'auto' : 'clip-path, transform',
          }}
        >
          {children}
        </div>
      </div>
    );
  }

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translate3d(0, 0, 0) scale(1)'
      : `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`,
    transition: `transform ${timing}, opacity ${timing}`,
    // Only hint the compositor while the element is waiting to animate in
    willChange: isVisible ? 'auto' : 'transform, opacity',
  };

  if (inline) {
    return (
      <span ref={ref as React.Ref<HTMLSpanElement>} className={`inline-block ${className}`} style={style}>
        {children}
      </span>
    );
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
