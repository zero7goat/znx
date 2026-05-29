import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { useState, useEffect } from 'react';

export default function ParallaxBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Check for screen width less than 1024px or touch-event support
      setIsMobile(window.innerWidth < 1024 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll();
  
  // Smooth scroll progress
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 45,
    damping: 25,
    restDelta: 0.001
  });

  // Unique parallax speeds for an organic feel
  const yHanging = useTransform(smoothProgress, [0, 1], [0, -100]);
  const yMonstera = useTransform(smoothProgress, [0, 1], [0, -280]);
  const yPalmLeft = useTransform(smoothProgress, [0, 1], [0, -180]);
  const yFernRight = useTransform(smoothProgress, [0, 1], [0, 150]);

  // Use static 0 representation on mobile/touch screen devices to bypass scroll calculations
  const yHangingVal = isMobile ? 0 : yHanging;
  const yMonsteraVal = isMobile ? 0 : yMonstera;
  const yPalmLeftVal = isMobile ? 0 : yPalmLeft;
  const yFernRightVal = isMobile ? 0 : yFernRight;

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-transparent">
      {/* 
        Ultra-soft Organic Plant Shadows. 
        Using high-blur filters and low-opacity dark moss / charcoal fills 
        to realistically simulate sunlight casting plant silhouettes on a white gallery wall. 
      */}

      {/* Warm beige lighting gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-clay/[0.04] via-transparent to-beige/[0.1] mix-blend-normal" />

      {/* 1. Hanging Vine Shadow (Top Left Corner) */}
      <motion.div
        style={{ 
          y: yHangingVal, 
          filter: isMobile ? 'none' : 'blur(16px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        className="absolute top-0 left-0 w-[300px] md:w-[450px] opacity-[0.035] select-none pointer-events-none md:opacity-[0.045]"
      >
        <svg viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-clay">
          {/* Main hanging vine threads */}
          <path d="M100 0 Q120 180 80 400" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 0 Q180 250 140 500" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M120 0 Q60 150 40 320" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

          {/* Hanging leaf shapes along vines */}
          <path d="M100 80 C60 80 40 110 80 130 C120 120 110 90 100 80 Z" fill="currentColor" />
          <path d="M115 150 C160 150 170 180 130 195 C100 180 105 160 115 150 Z" fill="currentColor" />
          <path d="M92 220 C50 210 35 240 70 260 C100 240 100 230 92 220 Z" fill="currentColor" />
          <path d="M152 280 C190 290 180 320 145 330 C120 310 130 290 152 280 Z" fill="currentColor" />
          <path d="M85 340 C45 340 40 370 75 385 C100 370 95 350 85 340 Z" fill="currentColor" />
          <path d="M140 390 C180 400 170 430 135 440 C110 420 120 400 140 390 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {/* 2. Monstera Deliciosa Shadow (Mid-Right Edge) */}
      <motion.div
        style={{ 
          y: yMonsteraVal, 
          filter: isMobile ? 'none' : 'blur(18px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        className="absolute top-[28%] right-0 translate-x-[20%] w-[400px] md:w-[600px] opacity-[0.025] select-none pointer-events-none md:opacity-[0.035]"
      >
        <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-clay">
          {/* Main Monstera Leaf Stems */}
          <path d="M250 480 Q210 300 150 200" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
          
          {/* Broad leaves with characteristic monstera cutouts */}
          {/* Leaf 1 (Main top leaf) */}
          <path d="M150 200 C180 100 280 50 350 120 C420 180 380 320 250 360 C180 320 120 280 150 200 Z" fill="currentColor" />
          {/* Monstera slit simulations made via holes or overlaid cut shapes inside shadow */}
          <path d="M165 240 Q100 180 80 110 C120 110 180 150 200 190 Z" fill="currentColor" />
          <path d="M220 330 Q320 320 390 250 C380 190 320 190 280 220 Z" fill="currentColor" />
          <path d="M180 290 Q280 100 300 80 C320 120 280 200 240 260 Z" fill="currentColor" />
        </svg>
      </motion.div>

      {/* 3. Soft Palm Leaf Shadow (Lower-Left Edge) */}
      <motion.div
        style={{ 
          y: yPalmLeftVal, 
          filter: isMobile ? 'none' : 'blur(20px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        className="absolute top-[52%] left-0 -translate-x-[25%] w-[450px] md:w-[650px] opacity-[0.028] select-none pointer-events-none md:opacity-[0.038]"
      >
        <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-clay">
          {/* Elegant sweeping palm central arch */}
          <path d="M0 600 Q300 450 500 150" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
          
          {/* Radiating thin linear palm fronds (extremely graceful) */}
          <path d="M150 490 Q50 350 40 200" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M200 460 Q100 300 80 140" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M250 420 Q150 250 130 90" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M300 370 Q210 200 200 50" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M350 320 Q280 160 280 20" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M400 260 Q360 120 370 0" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
          
          <path d="M100 520 Q20 420 30 300" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
          <path d="M50 550 Q0 480 0 380" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* 4. Elegant Single Branch Shadow (Bottom Right Corner) */}
      <motion.div
        style={{ 
          y: yFernRightVal, 
          filter: isMobile ? 'none' : 'blur(16px)',
          transform: 'translate3d(0, 0, 0)',
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
        className="absolute bottom-0 right-0 translate-x-[15%] translate-y-[10%] w-[320px] md:w-[500px] opacity-[0.03] select-none pointer-events-none md:opacity-[0.04]"
      >
        <svg viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-clay">
          {/* Stem */}
          <path d="M400 500 Q200 350 100 100" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          
          {/* Alternating soft leaflets */}
          <path d="M180 220 Q100 180 50 150" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
          <path d="M210 260 Q130 220 80 190" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
          <path d="M250 300 Q170 260 120 230" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
          <path d="M290 350 Q220 310 160 280" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M340 400 Q270 360 210 330" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
          <path d="M380 460 Q310 420 250 390" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />

          <path d="M140 170 Q70 140 20 110" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
          <path d="M110 120 Q50 90 0 60" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </motion.div>

      {/* Noise overlay for subtle photographic texture (highly premium) */}
      <div className="absolute inset-0 noise opacity-[0.015] mix-blend-multiply" />
      <div className="absolute inset-0 vignette opacity-[0.15]" />
    </div>
  );
}
