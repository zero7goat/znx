import React, { useState, useRef, useEffect, WheelEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ShowreelModal from './ShowreelModal';
import ScrollReveal from './ScrollReveal';
import { useCoverRecede } from '../utils/useCoverRecede';

interface WorkItem {
  id: string;
  title: string;
  metadata: string;
  client: string;
  category: string;
  year: string;
  description: string;
  image: string;
  videoUrl: string;
}

const WORKS: WorkItem[] = [
  {
    id: 'work-1',
    title: 'MACBOOK EDITORIAL MOCKUP',
    metadata: 'ARCHIVE 01 • DIGITAL EDITORIAL / MOCKUP',
    client: 'Alex Paliotta Studio',
    category: 'Digital Editorial',
    year: '2026',
    description: 'Clean architectural showcase featuring high-contrast digital devices, minimalist layouts, and luxury serif typography.',
    image: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 'work-2',
    title: 'CINEMATOGRAPHIC SILHOUETTE',
    metadata: 'ARCHIVE 02 • HIGH-FASHION / DIRECTION',
    client: 'Anton Visuals',
    category: 'Cinematography',
    year: '2026',
    description: 'High-contrast studio portraiture exploring deep shadows, atmospheric lighting, and architectural framing.',
    image: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 'work-3',
    title: 'EDITORIAL ARCHITECTURE',
    metadata: 'ARCHIVE 03 • SPATIAL DESIGN / BRANDING',
    client: 'Pinto Design Co.',
    category: 'Spatial Design',
    year: '2025',
    description: 'Minimalist structural showcase with high-contrast monochrome palettes and modern grid alignment.',
    image: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 'work-4',
    title: 'VANGUARD INTERFACE',
    metadata: 'ARCHIVE 04 • DIGITAL PLATFORM / UI',
    client: 'Patterson Interactive',
    category: 'Digital Platform',
    year: '2025',
    description: 'Next-generation digital experience engineered with high precision typography and sleek visual direction.',
    image: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 'work-5',
    title: 'CRAFTED UI SYSTEM',
    metadata: 'ARCHIVE 05 • DESIGN SYSTEM / CRAFT',
    client: '21st Studio',
    category: 'Design System',
    year: '2025',
    description: 'Bespoke UI design system featuring refined layout grids, subtle typography, and smooth interactive states.',
    image: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
];

interface WorkShowcaseProps {
  onOpenWorks?: () => void;
}

export default function WorkShowcase({ onOpenWorks }: WorkShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  // Pinned while the Services section slides over it
  const { markerRef, recedeStyle } = useCoverRecede();
  const [selectedVideo, setSelectedVideo] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Touch and drag swipe state
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingMouseRef = useRef(false);
  const dragStartXRef = useRef<number | null>(null);
  const wheelTimeout = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + WORKS.length) % WORKS.length);
  };

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % WORKS.length);
  };

  // Auto-play / auto-slide state
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Pause autoplay while hovered or while a video is playing
    if (isHovered || selectedVideo.isOpen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const interval = setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((prev) => (prev + 1) % WORKS.length);
    }, 5000); // Elegant, slow 5-second automatic progression
    return () => clearInterval(interval);
  }, [isHovered, selectedVideo.isOpen]);

  // Mobile Touch Handlers - NEVER block vertical scroll
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;

    // Only trigger if horizontal swipe is intentional and exceeds vertical movement
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX < 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    touchStartRef.current = null;
  };

  // Mouse drag handlers (Desktop only)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingMouseRef.current = true;
    dragStartXRef.current = e.clientX;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMouseRef.current || dragStartXRef.current === null) return;
    const diff = e.clientX - dragStartXRef.current;
    if (diff < -40) {
      nextSlide();
    } else if (diff > 40) {
      prevSlide();
    }
    isDraggingMouseRef.current = false;
    dragStartXRef.current = null;
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (wheelTimeout.current) return;
    if (Math.abs(e.deltaX) > 15 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 15 || (e.shiftKey && e.deltaY > 30)) {
        nextSlide();
      } else if (e.deltaX < -15 || (e.shiftKey && e.deltaY < -30)) {
        prevSlide();
      }
      wheelTimeout.current = setTimeout(() => {
        wheelTimeout.current = null;
      }, 300);
    }
  };

  const currentWork = WORKS[activeIndex];

  const getOffset = (index: number) => {
    const total = WORKS.length;
    let offset = (index - activeIndex) % total;
    if (offset > Math.floor(total / 2)) offset -= total;
    if (offset < -Math.floor(total / 2)) offset += total;
    return offset;
  };

  return (
    <>
    <section
      id="work"
      data-light="false"
      className="sticky top-0 [@media(max-height:700px)]:relative z-10 bg-[#0a0a0a] text-white min-h-svh flex flex-col justify-center pt-24 pb-10 sm:pt-28 sm:pb-14 px-4 sm:px-8 border-none overflow-hidden select-none shadow-[0_-40px_80px_rgba(0,0,0,0.55)]"
    >
      <motion.div style={recedeStyle} className="max-w-7xl mx-auto w-full">
        
        <ScrollReveal yOffset={25} duration={0.9}>
          {/* Eyebrow Tag - Exactly synced with Services WHAT I DO typography */}
          <span className="znx-eyebrow text-center mb-3">SELECTED WORK</span>

          {/* Main Section Header */}
          <h2 className="znx-heading text-white text-center mb-6 sm:mb-10">
            FEATURED WORK
          </h2>
        </ScrollReveal>

        {/* 3D Perspective Stage Showcase — Native pan-y preserved for frictionless mobile scrolling */}
        <div 
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={(e) => {
            handleMouseUp(e);
            setIsHovered(false);
          }}
          onMouseEnter={() => setIsHovered(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
          className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden h-[200px] sm:h-[280px] md:h-[340px] flex items-center justify-center my-2 py-4 cursor-grab active:cursor-grabbing select-none"
          style={{ perspective: '1200px', touchAction: 'pan-y' }}
        >
          {WORKS.map((work, index) => {
            const offset = getOffset(index);
            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;

            let x = '-50%';
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 0;

            if (offset === 0) {
              x = '-50%';
              rotateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 20;
            } else if (offset === 1) {
              x = '65%';
              rotateY = -14;
              scale = 0.92;
              opacity = 0.88;
              zIndex = 10;
            } else if (offset === -1) {
              x = '-165%';
              rotateY = 14;
              scale = 0.92;
              opacity = 0.88;
              zIndex = 10;
            } else if (offset > 1) {
              x = '220%';
              rotateY = -25;
              scale = 0.75;
              opacity = 0;
              zIndex = 0;
            } else {
              x = '-320%';
              rotateY = 25;
              scale = 0.75;
              opacity = 0;
              zIndex = 0;
            }

            return (
              <motion.div
                key={work.id}
                onClick={() => {
                  if (isLeft) prevSlide();
                  else if (isRight) nextSlide();
                  else {
                    setSelectedVideo({
                      isOpen: true,
                      url: work.videoUrl,
                      title: work.title,
                    });
                  }
                }}
                animate={{
                  x,
                  rotateY,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  zIndex,
                  transformOrigin: offset > 0 ? 'left center' : offset < 0 ? 'right center' : 'center center',
                }}
                className={`custom-hover-card group absolute left-1/2 top-1/2 -translate-y-1/2 w-[68vw] sm:w-[52vw] md:w-[44vw] max-w-[720px] aspect-[16/9] rounded-none overflow-hidden cursor-pointer transition-shadow duration-500 border-0 outline-none ring-0 ${
                  isCenter ? 'bg-transparent' : 'bg-transparent hover:opacity-100'
                }`}
              >
                <img
                  src={work.image}
                  alt={work.title}
                  referrerPolicy="no-referrer"
                  decoding="async"
                  draggable={false}
                  className="w-full h-full object-cover object-center pointer-events-none select-none rounded-none border-0 shadow-none outline-none ring-0"
                />

                {/* White Play Button Overlay - Clicking center card or play button plays video */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none z-10">
                  <div className="transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-110">
                    <svg 
                      className="w-10 h-10 sm:w-12 sm:h-12 fill-white stroke-white" 
                      viewBox="0 0 24 24"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    >
                      <path d="M8 5.5v13l10-6.5z" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Active project caption + pagination: prev · (counter, title, metadata) · next */}
        <div className="mx-auto mt-5 flex w-full max-w-2xl items-center justify-between gap-4">
          <button
            onClick={prevSlide}
            aria-label="Previous work"
            className="w-10 h-10 shrink-0 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white active:scale-95 transition-[background-color,color,border-color,transform] duration-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="relative min-h-[3.75rem] flex-1 text-center" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentWork.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-1.5"
              >
                <span className="znx-label">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(WORKS.length).padStart(2, '0')} · {currentWork.category} · {currentWork.year}
                </span>
                <span className="font-syne font-bold text-base sm:text-xl tracking-tight text-white leading-tight">
                  {currentWork.title}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={nextSlide}
            aria-label="Next work"
            className="w-10 h-10 shrink-0 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white active:scale-95 transition-[background-color,color,border-color,transform] duration-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* View All Works CTA */}
        <div className="flex justify-center mt-7">
          <button
            onClick={() => {
              if (onOpenWorks) {
                onOpenWorks();
              } else {
                window.location.hash = '#/works';
              }
            }}
            className="znx-btn znx-btn-primary"
          >
            <span>VIEW ALL WORKS</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Video Modal Player */}
      <ShowreelModal
        isOpen={selectedVideo.isOpen}
        onClose={() => setSelectedVideo((prev) => ({ ...prev, isOpen: false }))}
        videoUrl={selectedVideo.url}
        title={selectedVideo.title}
      />
    </section>
    {/* Marks where the next section starts; drives the recede while it covers this one */}
    <div ref={markerRef} aria-hidden="true" />
    </>
  );
}

