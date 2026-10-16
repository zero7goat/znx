import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';

const VISIONARY_IMAGES = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
];

export default function VisionarySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Monitor the scroll progress of the Visionary section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Dynamically change frame index of the overlay image on scroll
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const rawIndex = Math.floor(latest * VISIONARY_IMAGES.length);
    const clampedIndex = Math.max(0, Math.min(VISIONARY_IMAGES.length - 1, rawIndex));
    if (clampedIndex !== currentImgIndex) {
      setCurrentImgIndex(clampedIndex);
    }
  });

  // 1. Line 1: VISIONARY LEAP
  // Initially behind the image (translateZ = -120px), comes forward to front (translateZ = 100px) around 0.15 - 0.4.
  const translateZ0 = useTransform(scrollYProgress, [0.0, 0.15, 0.35, 0.5], [-120, -120, 100, 100]);
  const scale0 = useTransform(scrollYProgress, [0.0, 0.15, 0.35, 0.5], [0.85, 0.85, 1.05, 1.05]);
  const opacity0 = useTransform(scrollYProgress, [0.0, 0.15, 0.3, 0.5], [0.3, 0.3, 1.0, 0.7]);
  const y0 = useTransform(scrollYProgress, [0.0, 0.15, 0.35], [30, 30, 0]);

  // 2. Line 2: TRAILBLAZING EFFECT
  // Comes forward around 0.3 - 0.55
  const translateZ1 = useTransform(scrollYProgress, [0.0, 0.3, 0.5, 0.65], [-120, -120, 100, 100]);
  const scale1 = useTransform(scrollYProgress, [0.0, 0.3, 0.5, 0.65], [0.85, 0.85, 1.05, 1.05]);
  const opacity1 = useTransform(scrollYProgress, [0.0, 0.3, 0.45, 0.65], [0.3, 0.3, 1.0, 0.7]);
  const y1 = useTransform(scrollYProgress, [0.0, 0.3, 0.5], [30, 30, 0]);

  // 3. Line 3: ECHOES OF MOTION
  // Comes forward around 0.45 - 0.7
  const translateZ2 = useTransform(scrollYProgress, [0.0, 0.45, 0.65, 0.8], [-120, -120, 100, 100]);
  const scale2 = useTransform(scrollYProgress, [0.0, 0.45, 0.65, 0.8], [0.85, 0.85, 1.05, 1.05]);
  const opacity2 = useTransform(scrollYProgress, [0.0, 0.45, 0.6, 0.8], [0.3, 0.3, 1.0, 0.7]);
  const y2 = useTransform(scrollYProgress, [0.0, 0.45, 0.65], [30, 30, 0]);

  // 4. Line 4: RISING STAR
  // Comes forward around 0.6 - 0.85
  const translateZ3 = useTransform(scrollYProgress, [0.0, 0.6, 0.8, 0.95], [-120, -120, 100, 100]);
  const scale3 = useTransform(scrollYProgress, [0.0, 0.6, 0.8, 0.95], [0.85, 0.85, 1.05, 1.05]);
  const opacity3 = useTransform(scrollYProgress, [0.0, 0.6, 0.75, 0.95], [0.3, 0.3, 1.0, 0.7]);
  const y3 = useTransform(scrollYProgress, [0.0, 0.6, 0.8], [30, 30, 0]);

  return (
    <section
      ref={containerRef}
      className="relative bg-black text-white py-24 sm:py-36 md:py-48 lg:py-56 px-3 sm:px-8 overflow-hidden select-none border-t border-slate-950 flex items-center justify-center"
    >
      {/* Container holding the stacked dynamic text & overlay image with 3D perspective */}
      <div 
        className="relative max-w-5xl w-full mx-auto flex flex-col items-center justify-center text-center min-h-[300px] sm:min-h-[460px]"
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d'
        }}
      >
        
        {/* Stacked Gold Typography (With 3D transform layers mapping dynamically to scroll progress) */}
        <div 
          className="flex flex-col items-center justify-center space-y-2 sm:space-y-3 md:space-y-4 font-syne font-black tracking-tight leading-[0.95] text-[5vw] xs:text-2xl sm:text-4xl md:text-5xl lg:text-6.5xl uppercase w-full max-w-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          
          {/* Line 1 */}
          <motion.div
            style={{
              z: translateZ0,
              scale: scale0,
              opacity: opacity0,
              y: y0,
              transformStyle: 'preserve-3d',
            }}
            className="bg-gradient-to-r from-[#dca842] via-[#f7e092] to-[#b38226] bg-clip-text text-transparent whitespace-nowrap will-change-transform relative"
          >
            VISIONARY LEAP
          </motion.div>

          {/* Line 2 with 'UNIQUE' label */}
          <motion.div
            style={{
              z: translateZ1,
              scale: scale1,
              opacity: opacity1,
              y: y1,
              transformStyle: 'preserve-3d',
            }}
            className="relative bg-gradient-to-r from-[#dca842] via-[#f7e092] to-[#b38226] bg-clip-text text-transparent whitespace-nowrap will-change-transform"
          >
            TRAILBLAZING EFFECT
            <span 
              className="absolute -top-1.5 sm:-top-3.5 right-0 text-[7px] sm:text-[10px] font-mono-tech tracking-[0.2em] font-bold text-slate-300 uppercase not-sr-only"
              style={{ transform: 'translateZ(10px)' }}
            >
              UNIQUE
            </span>
          </motion.div>

          {/* Line 3 */}
          <motion.div
            style={{
              z: translateZ2,
              scale: scale2,
              opacity: opacity2,
              y: y2,
              transformStyle: 'preserve-3d',
            }}
            className="bg-gradient-to-r from-[#dca842] via-[#f7e092] to-[#b38226] bg-clip-text text-transparent whitespace-nowrap will-change-transform relative"
          >
            ECHOES OF MOTION
          </motion.div>

          {/* Line 4 with 'SOLID' label */}
          <motion.div
            style={{
              z: translateZ3,
              scale: scale3,
              opacity: opacity3,
              y: y3,
              transformStyle: 'preserve-3d',
            }}
            className="relative bg-gradient-to-r from-[#dca842] via-[#f7e092] to-[#b38226] bg-clip-text text-transparent whitespace-nowrap will-change-transform"
          >
            RISING STAR
            <span 
              className="absolute -bottom-2 sm:-bottom-4 left-0 text-[7px] sm:text-[10px] font-mono-tech tracking-[0.2em] font-bold text-slate-300 uppercase not-sr-only"
              style={{ transform: 'translateZ(10px)' }}
            >
              SOLID
            </span>
          </motion.div>

        </div>

        {/* Flat Center Image Overlay — Centered at z-index: 20 (Locked at translateZ = 0px in 3D space) */}
        <div 
          className="absolute w-24 xs:w-32 sm:w-48 md:w-56 lg:w-64 aspect-[4/5] rounded-none overflow-hidden shadow-2xl pointer-events-none bg-slate-950 border-none"
          style={{ 
            transform: 'translateZ(0px)',
            transformStyle: 'preserve-3d'
          }}
        >
          {VISIONARY_IMAGES.map((src, idx) => {
            const isCurrent = idx === currentImgIndex;
            return (
              <img
                key={src}
                src={src}
                alt={`Visionary image frame ${idx + 1}`}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center rounded-none border-none transition-opacity duration-700 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}
