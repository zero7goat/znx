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
  let pointerX = 0;
  let pointerY = 0;
  let pointerDirty = false;
  let isOffscreen = false;
  let elements: HTMLElement[] = [];
  let lastTransform = '';

  // The handler only records the pointer; layout reads and style writes happen once per frame
  const onPointerMove = (e: PointerEvent) => {
    pointerX = e.clientX;
    pointerY = e.clientY;
    pointerDirty = true;
    startLoop();
  };

  const onPointerLeave = () => {
    pointerDirty = false;
    targetX = 0;
    targetY = 0;
    startLoop();
  };

  const updateTarget = () => {
    const windowWidth = window.innerWidth || 1000;
    const windowHeight = window.innerHeight || 800;

    // Range restriction: limit mouse hover effect up to the bottom of Featured Work section (#work)
    const workSection = document.getElementById('work');
    let isWithinRange = true;
    if (workSection) {
      const rect = workSection.getBoundingClientRect();
      if (rect.bottom < 0 || pointerY > rect.bottom) {
        isWithinRange = false;
      }
    }

    // Nothing to tilt while the media is scrolled out of view (e.g. dragging the Work rail): writing
    // its transform every frame would only cost a style recalc and re-layerisation for no visible change
    const media = elements[0]?.getBoundingClientRect();
    isOffscreen = !media || media.bottom < 0 || media.top > windowHeight;

    if (!isWithinRange) {
      targetX = 0;
      targetY = 0;
    } else {
      targetX = Math.max(-1, Math.min(1, (pointerX - windowWidth / 2) / (windowWidth / 2)));
      targetY = Math.max(-1, Math.min(1, (pointerY - windowHeight / 2) / (windowHeight / 2)));
    }
  };

  const updateTransforms = () => {
    if (elements.length === 0) return;

    const rotY = currentX * maxRotateDeg;
    const rotX = -currentY * maxRotateDeg;
    const transX = currentX * -maxTranslatePx;
    const transY = currentY * -maxTranslatePx;

    const transformStr = `perspective(${perspectivePx}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0px)`;
    if (transformStr === lastTransform) return; // nothing visible changed this frame
    lastTransform = transformStr;

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
    if (pointerDirty) {
      pointerDirty = false;
      updateTarget();
    }
    if (isOffscreen) {
      animFrameId = null; // the next pointer move re-checks visibility
      return;
    }

    currentX += (targetX - currentX) * damping;
    currentY += (targetY - currentY) * damping;

    updateTransforms();

    // Stop once the tilt has caught up with the pointer; the next pointer move restarts it
    const diffX = Math.abs(targetX - currentX);
    const diffY = Math.abs(targetY - currentY);
    if (diffX > 0.001 || diffY > 0.001 || pointerDirty) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      animFrameId = null;
    }
  };

  const startLoop = () => {
    if (!animFrameId) {
      // Re-query on wake so remounted elements (page changes) are picked up, but never per frame
      elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
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
