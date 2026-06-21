import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface HeroProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export default function Hero({ activeVideoId, setActiveVideoId }: HeroProps) {
  const displacementRef = useRef<any>(null);
  const turbulenceRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoverActiveRef = useRef(false);
  const currentScaleRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;

      // Linear Interpolation (LERP) for an incredibly smooth springy scaling curve!
      // Scale is 48 when hovered, 0 when released
      const targetScale = hoverActiveRef.current ? 48 : 0;
      currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.12;

      // Increment wave cycle organically for fluid swirl
      timeRef.current += 0.045;

      // Direct-DOM updates to completely avoid React re-renders and preserve massive CPU capacity
      if (displacementRef.current) {
        displacementRef.current.setAttribute('scale', currentScaleRef.current.toFixed(3));
      }

      if (turbulenceRef.current) {
        const baseFreqX = 0.015 + Math.sin(timeRef.current * 0.5) * 0.006;
        const baseFreqY = 0.02 + Math.cos(timeRef.current * 0.45) * 0.006;
        turbulenceRef.current.setAttribute('baseFrequency', `${baseFreqX} ${baseFreqY}`);
      }

      animationFrameRef.current = requestAnimationFrame(tick);
    };

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <section 
      id="home" 
      className="relative min-h-[92vh] sm:min-h-screen flex flex-col items-center justify-center pt-28 pb-20 select-none overflow-hidden bg-[#0c0a09]"
    >
      {/* Immersive Astronaut Background Image exactly per Mockup Specifications */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/Images/astronaut.avif" 
          alt="Cinematic Portrait" 
          className="w-full h-full object-cover object-center scale-105"
          referrerPolicy="no-referrer"
        />
        {/* Soft cinematic color grading overlays to blend edges perfectly */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0807] via-[#0c0a09]/10 to-[#0c0a09]/40" />
        <div className="absolute inset-0 bg-radial-vignette opacity-50" />
      </div>

      {/* Embedded High-Performance Fluid SVG Displacement Filter with expanded boundary to prevent clipping */}
      <svg className="absolute w-0 h-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <defs>
          <filter id="liquid-dist-hero" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence 
              ref={turbulenceRef}
              type="fractalNoise" 
              baseFrequency="0.012 0.018" 
              numOctaves="3" 
              result="noise" 
            />
            <feDisplacementMap 
              ref={displacementRef}
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* Main Content Overlay placed beautifully on top */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center gap-12 sm:gap-14 text-center">
        
        {/* Cinematic Bold Header Typography aligned specifically for premium balance */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="flex flex-col items-center gap-4 max-w-5xl"
        >
          <h1 
            className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.1] uppercase font-sans cursor-default select-none py-4 px-6 transition-all duration-300"
          >
            I turn ideas into
            <br />
            <span className="text-white/95">experiences people </span>
            <span className="text-[#bf846b] opacity-90 italic lowercase font-serif px-1 font-medium select-none bg-clip-text text-transparent bg-gradient-to-r from-[#d97706] via-[#fb5d30] to-[#f97316]">
              feel
            </span>
          </h1>
        </motion.div>

      </div>
    </section>
  );
}
