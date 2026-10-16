export interface ParallaxOptions {
  maxRotateDeg?: number; // Default: 6.0
  maxTranslatePx?: number; // Default: 18.0
  perspectivePx?: number; // Default: 1000
  damping?: number; // Default: 0.08
  selector?: string; // Default: '.parallax-bg-wrapper'
}

/**
 * Smooth 3D Perspective Mouse-Parallax Utility.
 * Applies GPU-accelerated 3D transform rotation & translation offset
 * driven by mouse cursor position with spring/lerp dampening.
 */
export function initMouseParallax(options: ParallaxOptions = {}): () => void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Detect mobile / touch screens - bypass effect for performance
  const isTouchDevice =
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    window.innerWidth <= 1024 ||
    !window.matchMedia('(hover: hover)').matches;

  if (isTouchDevice) {
    return () => {};
  }

  const maxRotateDeg = options.maxRotateDeg ?? 6.0;
  const maxTranslatePx = options.maxTranslatePx ?? 18.0;
  const perspectivePx = options.perspectivePx ?? 1000;
  const damping = options.damping ?? 0.08;
  const selector = options.selector ?? '.parallax-bg-wrapper';

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animFrameId: number | null = null;
  let isPointerActive = false;

  const onPointerMove = (e: PointerEvent) => {
    const windowWidth = window.innerWidth || 1000;
    const windowHeight = window.innerHeight || 800;

    // Range restriction: limit mouse hover effect up to the bottom of Featured Work section (#work)
    const workSection = document.getElementById('work');
    let isWithinRange = true;
    if (workSection) {
      const rect = workSection.getBoundingClientRect();
      if (rect.bottom < 0 || e.clientY > rect.bottom) {
        isWithinRange = false;
      }
    }

    if (!isWithinRange) {
      targetX = 0;
      targetY = 0;
    } else {
      targetX = (e.clientX - windowWidth / 2) / (windowWidth / 2);
      targetY = (e.clientY - windowHeight / 2) / (windowHeight / 2);

      targetX = Math.max(-1, Math.min(1, targetX));
      targetY = Math.max(-1, Math.min(1, targetY));
    }

    if (!isPointerActive) {
      isPointerActive = true;
      startLoop();
    }
  };

  const onPointerLeave = () => {
    targetX = 0;
    targetY = 0;
  };

  const updateTransforms = () => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (elements.length === 0) return;

    const rotY = currentX * maxRotateDeg;
    const rotX = -currentY * maxRotateDeg;
    const transX = currentX * -maxTranslatePx;
    const transY = currentY * -maxTranslatePx;

    const transformStr = `perspective(${perspectivePx}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0px)`;

    elements.forEach((el) => {
      if (el.style.willChange !== 'transform') {
        el.style.willChange = 'transform';
        el.style.transformStyle = 'preserve-3d';
        el.style.transition = 'none'; // Avoid CSS transition fighting requestAnimationFrame updates
      }
      el.style.transform = transformStr;
    });
  };

  const loop = () => {
    currentX += (targetX - currentX) * damping;
    currentY += (targetY - currentY) * damping;

    updateTransforms();

    const diffX = Math.abs(targetX - currentX);
    const diffY = Math.abs(targetY - currentY);

    if (isPointerActive || diffX > 0.001 || diffY > 0.001) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      animFrameId = null;
    }
  };

  const startLoop = () => {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(loop);
    }
  };

  // Passive event listener for high performance (120 FPS)
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('mouseleave', onPointerLeave, { passive: true });

  return () => {
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('mouseleave', onPointerLeave);

    if (animFrameId) {
      cancelAnimationFrame(animFrameId);
    }

    // Reset element styles
    const elements = document.querySelectorAll<HTMLElement>(selector);
    elements.forEach((el) => {
      el.style.willChange = '';
      el.style.transform = '';
      el.style.transformStyle = '';
      el.style.transition = '';
    });
  };
}
