import { RefObject, useEffect } from 'react';

const DRAG_THRESHOLD_PX = 6;
const FRICTION = 0.92; // momentum decay per frame (~60fps)
const MIN_VELOCITY = 0.15; // px/ms below which momentum stops

/**
 * Real-time mouse drag-to-scroll for a horizontal overflow container.
 *
 * - Mouse only: touch/pen keep the browser's native scrolling and swiping.
 * - The rail follows the pointer on every move (scrollLeft is written directly, no React state).
 * - Pointer capture starts only once the drag passes a small threshold, so an ordinary click still
 *   reaches links inside the rail; a real drag swallows the click that would follow its release.
 * - Releasing glides on briefly with the drag velocity; any new input stops the glide.
 * - Adds `is-dragging` to the element while dragging (for the grabbing cursor / no text selection).
 */
export function useDragScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pointerId: number | null = null;
    let startX = 0;
    let startScroll = 0;
    let dragging = false;
    let suppressClick = false;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0; // px per ms, positive = content moving left (scrollLeft increasing)
    let glideFrame = 0;

    const stopGlide = () => {
      if (glideFrame) cancelAnimationFrame(glideFrame);
      glideFrame = 0;
    };

    const glide = () => {
      let prev = performance.now();
      const step = (now: number) => {
        const dt = Math.min(32, now - prev);
        prev = now;
        el.scrollLeft += velocity * dt;
        velocity *= Math.pow(FRICTION, dt / 16.7);
        const atEdge = el.scrollLeft <= 0 || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;
        glideFrame = Math.abs(velocity) > MIN_VELOCITY && !atEdge ? requestAnimationFrame(step) : 0;
      };
      glideFrame = requestAnimationFrame(step);
    };

    const endDrag = () => {
      if (pointerId !== null && el.hasPointerCapture?.(pointerId)) el.releasePointerCapture(pointerId);
      const wasDragging = dragging;
      pointerId = null;
      dragging = false;
      el.classList.remove('is-dragging');
      // The click that follows a release fires synchronously after pointerup; clear the guard right
      // after so it can never swallow a later, unrelated click (e.g. keyboard activation)
      if (suppressClick) window.setTimeout(() => (suppressClick = false), 0);
      if (wasDragging && performance.now() - lastT < 80 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        glide();
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      stopGlide();
      pointerId = e.pointerId;
      startX = lastX = e.clientX;
      lastT = performance.now();
      startScroll = el.scrollLeft;
      velocity = 0;
      dragging = false;
      suppressClick = false;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      const dx = e.clientX - startX;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_THRESHOLD_PX) return;
        dragging = true;
        suppressClick = true;
        try {
          el.setPointerCapture(e.pointerId); // keep receiving moves even when leaving the rail
        } catch {
          // pointer no longer active (e.g. released between events): dragging still works via bubbling
        }
        el.classList.add('is-dragging');
      }
      el.scrollLeft = startScroll - dx;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velocity = 0.8 * ((lastX - e.clientX) / dt) + 0.2 * velocity;
      lastX = e.clientX;
      lastT = now;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      endDrag();
    };

    // A drag must not "click" the card under the pointer when released
    const onClickCapture = (e: MouseEvent) => {
      if (suppressClick) {
        e.preventDefault();
        e.stopPropagation();
        suppressClick = false;
      }
    };

    // No native image/link ghost-dragging inside the rail
    const onDragStart = (e: DragEvent) => e.preventDefault();
    // Any other input takes over from the momentum glide
    const onWheel = () => stopGlide();
    const onBlur = () => {
      stopGlide();
      if (pointerId !== null) endDrag();
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('lostpointercapture', onPointerUp);
    el.addEventListener('click', onClickCapture, true);
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('wheel', onWheel, { passive: true });
    el.addEventListener('touchstart', onWheel, { passive: true });
    window.addEventListener('blur', onBlur);

    return () => {
      stopGlide();
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('lostpointercapture', onPointerUp);
      el.removeEventListener('click', onClickCapture, true);
      el.removeEventListener('dragstart', onDragStart);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onWheel);
      window.removeEventListener('blur', onBlur);
    };
  }, [ref]);
}
