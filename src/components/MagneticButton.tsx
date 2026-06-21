import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
}

export default function MagneticButton({ 
  children, 
  className = "", 
  onClick,
  id 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  // Spring physics for premium smooth mechanical elastic feedback
  const springConfig = { stiffness: 150, damping: 15, mass: 0.8 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    const checkDesktop = () => {
      const desktopMedia = window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 1024;
      setIsDesktop(desktopMedia);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);

    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) {
      x.set(0);
      y.set(0);
      return;
    }
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;

    const dx = coords.x - buttonCenterX;
    const dy = coords.y - buttonCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Acticates within 60px of the button's boundary (using center + size offset)
    const buttonRadius = Math.max(rect.width, rect.height) / 2;
    const threshold = buttonRadius + 60; // 60px proximity from the edge

    if (distance < threshold) {
      // Magnetic pull: slide toward cursor but cap the distance multiplier to look neat and not jump
      const force = (threshold - distance) / threshold; // Strength 0 to 1
      const targetX = dx * force * 0.4;
      const targetY = dy * force * 0.4;
      x.set(targetX);
      y.set(targetY);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [coords, x, y]);

  return (
    <motion.div
      ref={buttonRef}
      id={id}
      style={{ x, y }}
      className={`inline-block will-change-transform ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
