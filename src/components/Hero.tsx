import React, { useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';

interface HeroSectionProps {
  onOpenShowreel?: () => void;
}

function FlipBlock({
  children,
  className = "",
  hoverColorClass = ""
}: {
  children: React.ReactNode;
  className?: string;
  hoverColorClass?: string;
}) {
  return (
    <span className={`relative inline-block overflow-hidden h-[1.2em] leading-none align-middle ${className}`}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 whitespace-nowrap will-change-transform">
        <span className="flex items-center gap-1.5 h-[1.2em] leading-none">
          {children}
        </span>
        <span className={`flex items-center gap-1.5 h-[1.2em] leading-none ${hoverColorClass}`}>
          {children}
        </span>
      </span>
    </span>
  );
}

export default function HeroSection({ onOpenShowreel }: HeroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);

  // Smooth spring motion values for play button follower
  const playXSpring = useSpring(xValue, { damping: 25, stiffness: 100, mass: 0.5 });
  const playYSpring = useSpring(yValue, { damping: 25, stiffness: 100, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024 && window.matchMedia('(pointer: fine)').matches;
    if (!isDesktop || isPlayingVideo) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const mouseXOffset = e.clientX - rect.left - rect.width / 2;
    const mouseYOffset = e.clientY - rect.top - rect.height / 2;
    
    xValue.set(mouseXOffset * 0.6);
    yValue.set(mouseYOffset * 0.6);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    xValue.set(0);
    yValue.set(0);
  };

  const handleMouseEnter = () => {
    const isDesktop = typeof window !== 'undefined' && window.innerWidth >= 1024 && window.matchMedia('(pointer: fine)').matches;
    if (isDesktop) {
      setIsHovered(true);
    }
  };

  const handleShowreelClick = () => {
    setIsPlayingVideo(true);
    if (onOpenShowreel) {
      onOpenShowreel();
    }
  };

  return (
    <section 
      id="hero" 
      data-light="false" 
      className="relative min-h-screen text-white flex flex-col justify-between pt-24 pb-12 px-6 sm:px-12 overflow-hidden select-none bg-transparent"
    >
      {/* Background Subtle Grid / Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px]" />

      {/* Ambient Breathing Lighting Glows (Static on mobile for maximum GPU performance) */}
      <div className="absolute top-[20%] left-[15%] w-96 h-96 rounded-full bg-amber-500/5 blur-[100px] pointer-events-none z-0 hidden sm:block" />
      <div className="absolute bottom-[30%] right-[10%] w-80 h-80 rounded-full bg-orange-500/5 blur-[90px] pointer-events-none z-0 hidden sm:block" />

      {/* Top Hero Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-6 sm:px-12 flex items-center justify-between pointer-events-auto">
        {/* Left Logo */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            smoothScrollTo(0, 950);
          }}
          className="group flex items-center select-none"
        >
          <img
            src="/Logo.png"
            alt="ZNX Studio Logo"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith('/Logo.png')) {
                target.src = '/images/Logo.png';
              } else if (target.src.endsWith('/images/Logo.png')) {
                target.src = '/Logo.avif';
              } else if (target.src.endsWith('/Logo.avif')) {
                target.src = '/images/Logo.avif';
              }
            }}
            className="h-8 sm:h-9 md:h-10 w-auto object-contain brightness-0 invert"
          />
        </a>

        {/* Right "Let's Talk" Button */}
        <a
          href="https://calendly.com/contactmeznx/project-call"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase py-1 px-1 transition-colors duration-500 text-white hover:text-white/75"
        >
          <FlipBlock hoverColorClass="text-white/70">
            <span>LET'S TALK</span>
            <ArrowUpRight className="w-4 h-4" />
          </FlipBlock>
        </a>
      </div>

      {/* Main Hero Content Container */}
      <div className="relative max-w-7xl mx-auto w-full flex-1 flex flex-col items-center justify-center my-auto py-12">
        <div className="relative w-full max-w-4xl flex flex-col items-center justify-center">
          
          {/* Big Static Background Typography Behind Showreel Image (Light gray, all caps, reduced opacity, zero animation lag) */}
          <div 
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-visible"
          >
            <span className="text-[17vw] sm:text-[14vw] md:text-[12vw] lg:text-[11.5rem] font-sans font-black tracking-wider uppercase text-neutral-300 opacity-25 select-none leading-none whitespace-nowrap">
              SHOWREEL
            </span>
          </div>

          {/* Central Media Container — Smooth 3D Perspective Mouse-Parallax for PC only (.parallax-bg-wrapper) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 160,
              damping: 18,
              mass: 0.4
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleShowreelClick}
            className="parallax-bg-wrapper custom-hover-card relative z-10 w-full max-w-xl sm:max-w-2xl aspect-[16/10] sm:aspect-[16/9] rounded-none border-none bg-black overflow-hidden shadow-2xl opacity-100 cursor-pointer transform-gpu"
          >
            {isPlayingVideo ? (
              /* Immediate 3D Autoplay YouTube Player */
              <div className="relative w-full h-full bg-black z-30">
                <iframe
                  src="https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1"
                  title="ZNX Studio Showreel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full border-none select-none pointer-events-auto rounded-none"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPlayingVideo(false);
                  }}
                  className="absolute top-3 right-3 z-40 bg-black/80 text-white hover:bg-white hover:text-black text-[10px] font-mono-tech tracking-widest uppercase px-3 py-1.5 transition-colors cursor-pointer border border-white/20"
                >
                  CLOSE ✕
                </button>
              </div>
            ) : (
              /* Static Media Image with Play Button */
              <>
                <img
                  src="https://i.pinimg.com/1200x/ac/64/cc/ac64ccb69f913d9bc4fe99dad224472f.jpg"
                  alt="Studio Showreel"
                  referrerPolicy="no-referrer"
                  loading="eager"
                  className="w-full h-full object-cover object-center select-none rounded-none border-none"
                />

                {/* Play Button Follower */}
                <motion.div 
                  style={{
                    x: playXSpring,
                    y: playYSpring,
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none z-20"
                >
                  <div 
                    className="transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-[0_10px_10px_rgba(0,0,0,0.4)]"
                    style={{ 
                      transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                    }}
                  >
                    <svg 
                      className="w-16 h-16 sm:w-20 sm:h-20 fill-white stroke-white" 
                      viewBox="0 0 24 24"
                      strokeWidth="4"
                      strokeLinejoin="round"
                    >
                      <path d="M8 5.5v13l10-6.5z" />
                    </svg>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Hero Bottom Navigation Hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="relative z-10 w-full flex flex-col items-center gap-2 text-center text-white/60"
      >
        <span className="text-[11px] font-mono-tech tracking-[0.25em] uppercase text-white/40">
          scroll down to explore
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-1 h-5 rounded-full bg-white/20 overflow-hidden"
        >
          <div className="w-full h-1/2 bg-white/70 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
