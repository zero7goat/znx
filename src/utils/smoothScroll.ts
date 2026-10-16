export function smoothScrollTo(targetY: number, duration = 1200) {
  if (typeof window !== 'undefined' && (window as any).lenis) {
    (window as any).lenis.scrollTo(targetY, {
      duration: duration / 1000,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
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

  const step = (currentTime: number) => {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, startY + distance * ease);

    if (timeElapsed < duration) {
      requestAnimationFrame(step);
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
