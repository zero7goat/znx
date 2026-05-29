import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { playMechanicalClick } from '../utils/audioSynth';

export default function CustomCursor() {
  const [hoveredType, setHoveredType] = useState<string | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // High-performance spring interpolation for inertia trailing
  const springConfig = { damping: 35, stiffness: 380, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const checkDesktop = () => {
      const desktopMedia = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;
      setIsDesktop(desktopMedia);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    // Keep the system cursor visible per user request
    document.body.style.cursor = 'default';
    document.documentElement.style.cursor = 'default';
    return () => {
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;
    // Ensure mouse hover is supported on current user agent
    if (!window.matchMedia('(hover: hover)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!visible) setVisible(true);
    };

    const handleMouseLeaveWindow = () => {
      setVisible(false);
    };

    const handleMouseEnterWindow = () => {
      setVisible(true);
    };

    // Deep element scanner for hover detection
    let activeElem: HTMLElement | null = null;
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactiveEl = target.closest('a, button, [role="button"], input, select, textarea, .glass-card, [data-cursor]') as HTMLElement | null;
      activeElem = interactiveEl;
      
      if (interactiveEl) {
        const customCursor = interactiveEl.getAttribute('data-cursor');
        if (customCursor) {
          setHoveredType(customCursor);
          const label = interactiveEl.getAttribute('data-cursor-label');
          setHoveredLabel(label);
        } else {
          setHoveredType('link');
          setHoveredLabel(null);
        }
      } else {
        setHoveredType(null);
        setHoveredLabel(null);
      }
    };

    const handleWindowClick = () => {
      if (activeElem) {
        playMechanicalClick();
        // Immediately refresh attributes inside the active frame context to feel instant
        setTimeout(() => {
          if (activeElem) {
            const label = activeElem.getAttribute('data-cursor-label');
            const customCursor = activeElem.getAttribute('data-cursor');
            if (label !== null) setHoveredLabel(label);
            if (customCursor !== null) setHoveredType(customCursor);
          }
        }, 8);
      }
    };

    const handleCursorLabelUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.label) {
        setHoveredLabel(customEvent.detail.label);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('click', handleWindowClick);
    window.addEventListener('cursor-label-update', handleCursorLabelUpdate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('cursor-label-update', handleCursorLabelUpdate);
    };
  }, [visible, mouseX, mouseY]);

  if (!isDesktop) return null;
  if (!visible) return null;

  return (
    <>
      {/* Outer follow-focus cursor ring (using selective blending modes for ultimate organic look) */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center border border-[#ece3db]/40 bg-[#ece3db]/10"
        animate={{
          width: hoveredType ? (hoveredType === 'view' || hoveredType === 'play' ? '88px' : '52px') : '32px',
          height: hoveredType ? (hoveredType === 'view' || hoveredType === 'play' ? '88px' : '52px') : '32px',
          backgroundColor: hoveredType === 'view' 
            ? 'rgba(236, 227, 219, 0.95)' 
            : (hoveredType === 'play' ? 'rgba(236, 227, 219, 0.06)' : 'rgba(236, 227, 219, 0.05)'),
          borderColor: hoveredType === 'view' 
            ? 'rgba(236, 227, 219, 1)' 
            : (hoveredType === 'play' ? 'rgba(236, 227, 219, 0.75)' : 'rgba(236, 227, 219, 0.35)'),
          borderRadius: '50%'
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
      >
        {hoveredLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`text-[9px] font-black tracking-[0.25em] font-mono leading-none pt-0.5 ${
              hoveredType === 'view' ? 'text-[#0c0a09]' : 'text-[#ece3db]'
            }`}
          >
            {hoveredLabel}
          </motion.span>
        )}
      </motion.div>

      {/* Inner accurate vector point */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-[#ece3db] pointer-events-none z-[10000]"
        animate={{
          scale: hoveredType ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
