export function smoothScrollTo(targetY: number, duration = 1200) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }

  const startY = window.scrollY;
  const distance = targetY - startY;
  if (Math.abs(distance) < 2) return;

  let startTime: number | null = null;

  // Smooth easeInOutCubic curve for cinematic gliding movement
  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  // Hand control straight back to the user if they scroll during the animation
  let cancelled = false;
  const cancel = () => {
    cancelled = true;
  };
  const stopListening = () => {
    window.removeEventListener('wheel', cancel);
    window.removeEventListener('touchstart', cancel);
    window.removeEventListener('keydown', cancel);
  };
  window.addEventListener('wheel', cancel, { passive: true });
  window.addEventListener('touchstart', cancel, { passive: true });
  window.addEventListener('keydown', cancel);

  const step = (currentTime: number) => {
    if (cancelled) {
      stopListening();
      return;
    }
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(step);
    } else {
      stopListening();
    }
  };

  requestAnimationFrame(step);
}

export function smoothScrollToElement(elementId: string, duration = 1200) {
  if (elementId === 'top') {
    smoothScrollTo(0, duration);
    return;
  }
  const el = document.getElementById(elementId);
  if (el) {
    const targetY = el.getBoundingClientRect().top + window.scrollY;
    smoothScrollTo(targetY, duration);
  }
}
