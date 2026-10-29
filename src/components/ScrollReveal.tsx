import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  key?: React.Key;
  className?: string;
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

export default function ScrollReveal({
  children,
  className = '',
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect user prefers-reduced-motion setting
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
        setIsVisible(true);
        return;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else {
            if (!once) {
              setIsVisible(false);
            }
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

    return () => {
      observer.disconnect();
    };
  }, [once, threshold, rootMargin]);

  const totalDelay = Math.max(0, delay + staggerIndex * staggerStep);

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translate3d(0, 0, 0) scale(1)'
      : `translate3d(${xOffset}px, ${yOffset}px, 0) scale(${scale})`,
    transition: `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${totalDelay}s, opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${totalDelay}s`,
    // Only hint the compositor while the element is waiting to animate in
    willChange: isVisible ? 'auto' : 'transform, opacity',
  };

  if (inline) {
    return (
      <span ref={ref as any} className={`inline-block ${className}`} style={style}>
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
