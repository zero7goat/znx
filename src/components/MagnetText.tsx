import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'motion/react';

interface MagnetTextProps {
  text: string;
  className?: string;
  letterClassName?: string;
  delayOffset?: number;
}

export default function MagnetText({ text, className = "", letterClassName = "", delayOffset = 0 }: MagnetTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if desktop user (has hover capability, fine pointer, wide viewport)
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

  const words = text.split(" ");

  return (
    <div ref={containerRef} className={`inline-flex flex-wrap ${className}`}>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex mr-[0.25em] last:mr-0 select-none">
          {word.split("").map((char, cIdx) => (
            <MagnetLetter
              key={cIdx}
              char={char}
              mouseCoords={coords}
              className={letterClassName}
              index={wIdx * 10 + cIdx}
              delayOffset={delayOffset}
              isDesktop={isDesktop}
            />
          ))}
        </span>
      ))}
    </div>
  );
}

function MagnetLetter({ 
  char, 
  mouseCoords, 
  className, 
  index,
  delayOffset,
  isDesktop
}: { 
  key?: any;
  char: string; 
  mouseCoords: { x: number; y: number }; 
  className: string;
  index: number;
  delayOffset: number;
  isDesktop: boolean;
}) {
  const letterRef = useRef<HTMLSpanElement>(null);
  
  // High fidelity spring configuration for ultra-liquid reactive bounce
  const springConfig = { stiffness: 140, damping: 11, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    if (!isDesktop || !letterRef.current) {
      x.set(0);
      y.set(0);
      return;
    }
    const rect = letterRef.current.getBoundingClientRect();
    const letterX = rect.left + rect.width / 2;
    const letterY = rect.top + rect.height / 2;

    const dx = mouseCoords.x - letterX;
    const dy = mouseCoords.y - letterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Increase pull radius slightly for better proximity engagement
    const pullRadius = 150; 

    if (distance < pullRadius) {
      const force = (pullRadius - distance) / pullRadius; // Strength from 0 to 1
      const pct = force * force; // Quadratic exponential curve
      
      // Increased force multiplier significantly to look highly liquid and fluid!
      const targetX = dx * pct * 0.85; 
      const targetY = dy * pct * 0.85;
      x.set(targetX);
      y.set(targetY);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [mouseCoords, x, y, isDesktop]);

  return (
    <motion.span
      ref={letterRef}
      initial={{ opacity: 0, y: 40, filter: 'blur(5px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ 
        duration: 1.2, 
        ease: [0.16, 1, 0.3, 1], 
        delay: delayOffset + (index * 0.03) 
      }}
      style={{ x, y, display: 'inline-block' }}
      className={`will-change-transform origin-center ${className}`}
    >
      {char}
    </motion.span>
  );
}
