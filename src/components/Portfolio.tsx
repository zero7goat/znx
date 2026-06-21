import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const projects = [
  { 
    id: 'm1', 
    title: 'WORK 01', 
    videoUrl: 'https://youtu.be/9N30FXMxmIM',
    localThumb: '/Images/thumbnail for long form/thumb1.avif'
  },
  { 
    id: 'm2', 
    title: 'WORK 02', 
    videoUrl: 'https://youtu.be/-wGVpJEG_uI',
    localThumb: '/Images/thumbnail for long form/thumb2.avif'
  },
  { 
    id: 'm3', 
    title: 'WORK 03', 
    videoUrl: 'https://youtu.be/OJW4UCOkuEo',
    localThumb: '/Images/thumbnail for long form/thumb3.avif'
  },
];

interface PortfolioVideoCardProps {
  project: typeof projects[0];
  isCenter: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onSelect: () => void;
  onBehindTheEdit: () => void;
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeEmbedUrl(url: string, autoplay: boolean = true) {
  const videoId = getYouTubeId(url);
  if (!videoId) return url;
  // mute=0 for full audio play support
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=0&playsinline=1&controls=1&rel=0&modestbranding=1`;
}

function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

function PortfolioVideoCard({ 
  project, 
  isCenter, 
  isPlaying, 
  onPlay, 
  onSelect,
  onBehindTheEdit
 }: PortfolioVideoCardProps) {
  const videoId = getYouTubeId(project.videoUrl);
  const defaultThumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=60&w=800&auto=format&fit=crop';
  
  // Choose localThumb as the top priority
  const displayThumbnail = (project as any).localThumb || defaultThumbnailUrl;

  // Clean container when playing changes
  useEffect(() => {
    if (!isPlaying) {
      const targetContainer = document.getElementById(`portfolio-player-container-${project.id}`);
      if (targetContainer) {
        targetContainer.innerHTML = '';
      }
    }
  }, [isPlaying, project.id]);

  return (
    <div 
      className="group absolute inset-0 w-full h-full bg-[#181412] select-none rounded-[0.5rem] sm:rounded-[1rem] overflow-hidden font-sans"
      onClick={() => {
        if (!isCenter) {
          onSelect();
        }
      }}
    >
      {/* Target Container - Always in DOM */}
      <div 
        id={`portfolio-player-container-${project.id}`}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isPlaying && isCenter ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
      />

      {/* Thumbnail Cover */}
      <div 
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-300 ${isPlaying && isCenter ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}
        onClick={(e) => {
          if (isCenter && !isPlaying) {
            e.stopPropagation();
            onPlay();

            // Synchronously inject high performance iframe/video to delegate click activation token to iframe sandbox for unmuted layout autoplay!
            const targetContainer = document.getElementById(`portfolio-player-container-${project.id}`);
            if (targetContainer) {
              targetContainer.innerHTML = '';
              if (isYouTubeUrl(project.videoUrl)) {
                const iframe = document.createElement('iframe');
                iframe.src = getYouTubeEmbedUrl(project.videoUrl, true);
                iframe.title = project.title;
                iframe.frameBorder = "0";
                iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                iframe.allowFullscreen = true;
                iframe.className = "w-full h-full object-cover bg-black";
                targetContainer.appendChild(iframe);
              } else {
                const video = document.createElement('video');
                video.src = project.videoUrl;
                video.autoplay = true;
                video.playsInline = true;
                video.controls = true;
                video.className = "w-full h-full object-cover bg-black";
                targetContainer.appendChild(video);
              }
            }
          }
        }}
      >
        <img 
          src={displayThumbnail} 
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          onError={(e) => {
            // Fallback to hqdefault incase the custom local path has any load issues or YT maxres is missing
            if (videoId) {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
          }}
        />
        {/* We keep bg-black/10 constant on hover, do not make it darker as requested */}
        <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/10" />

        {/* Cinematic Minimal Center Play Icon Indicator */}
        {isCenter && !isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Removed group-hover:scale-110 so play button does not zoom on hover */}
            <div className="w-14 h-10 sm:w-16 sm:h-11 flex items-center justify-center transition-all duration-500 transform">
              <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 68 48">
                <path 
                  className="transition-colors duration-300 fill-black/80 group-hover:fill-[#fb5d30]"
                  d="M66.52,7.74c-0.78-2.93-3.09-5.24-6.02-6.02C55.21,1.07,34,1.07,34,1.07s-21.21,0-26.5,0.65C4.57,2.5,2.26,4.81,1.48,7.74 C0.83,13.04,0.83,24,0.83,24s0,10.96,0.65,16.26c0.78,2.93,3.09,5.24,6.02,6.02C12.79,46.93,34,46.93,34,46.93s21.21,0,26.5-0.65 c2.93-0.78,5.24-3.09,6.02-6.02C67.17,34.96,67.17,24,67.17,24S67.17,13.04,66.52,7.74z"
                />
                <polygon fill="white" points="27.32,33.02 45.02,24 27.32,14.98" />
              </svg>
            </div>
          </div>
        )}

        {/* Special Small 'Behind the Edit' Button popping up at bottom center on hover */}
        {isCenter && !isPlaying && (
          <div className="absolute inset-x-0 bottom-6 hidden lg:flex justify-center z-30 px-4 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onBehindTheEdit();
              }}
              className="pointer-events-auto bg-black/80 hover:bg-[#fb5d30] text-[#ece3db] hover:text-white border border-white/15 px-4 py-2.5 rounded-full text-[10px] tracking-widest uppercase font-black transition-all duration-300 transform opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 flex items-center gap-2 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] active:scale-95 cursor-pointer"
            >
              <span>Behind the Edit</span>
              <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface PortfolioProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
  onBehindTheEdit: (id: string) => void;
}

export default function Portfolio({ activeVideoId, setActiveVideoId, onBehindTheEdit }: PortfolioProps) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset play states whenever target slide changes to prevent multi-audio conflicts
  useEffect(() => {
    if (activeVideoId && ['m1', 'm2', 'm3'].includes(activeVideoId)) {
      setActiveVideoId(null);
    }
  }, [activeIndex]);

  // Reset play state if scrolled away from viewport or on scroll
  useEffect(() => {
    if (!activeVideoId || !['m1', 'm2', 'm3'].includes(activeVideoId)) return;

    const handleScroll = () => {
      setActiveVideoId(null);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        setActiveVideoId(null);
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [activeVideoId, setActiveVideoId]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));
  };

  // Lag-free responsive calculations
  const isMobile = windowWidth < 640;
  const cardWidth = isMobile ? windowWidth * 0.85 : Math.min(windowWidth * 0.65, 980);
  const gap = isMobile ? 16 : 24;
  
  // Pivot track offset to perfectly center the active card index
  const trackX = (windowWidth / 2) - (cardWidth / 2) - activeIndex * (cardWidth + gap);

  return (
    <section 
      ref={sectionRef}
      id="portfolio" 
      className="py-16 md:py-24 relative overflow-hidden bg-[#0c0a09]"
    >
      {/* Cinematic Ambient Atmosphere Blurs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[35%] h-[35%] bg-clay/[0.01] rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[45%] h-[45%] bg-orange-600/[0.03] rounded-full blur-[160px]" />
      </div>

      <div className="w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12 gap-3">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#fb5d30] uppercase font-sans select-none"
          >
            Long Form
          </motion.h2>
        </div>

        {/* Cinematic Unified Slide Track Container */}
        <div 
          onContextMenu={(e) => e.preventDefault()} 
          className="relative select-none w-full h-[200px] sm:h-[300px] md:h-[380px] lg:h-[460px] xl:h-[500px] flex items-center overflow-visible py-4"
        >
          {/* 
            Perfect horizontal scrolling track. 
            All calculation is pre-solved in high performance JS floats.
          */}
          <motion.div
            className="absolute left-0 top-0 h-full flex items-center will-change-transform transform-gpu"
            style={{ gap }}
            animate={{ x: trackX }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 24,
              mass: 0.8
            }}
          >
            {projects.map((project, idx) => {
              const isCenter = idx === activeIndex;

              return (
                <motion.div
                  key={project.id}
                  style={{ width: cardWidth }}
                  animate={{
                    scale: isCenter ? 1.0 : 0.88,
                    opacity: isCenter ? 1 : 0.65, // Partially visible side elements
                    filter: isCenter ? "grayscale(0%) brightness(100%)" : "grayscale(20%) brightness(65%)", // Visible gutters
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 100,
                    damping: 22,
                  }}
                  className="relative h-full bg-[#181412] rounded-[0.5rem] sm:rounded-[1rem] overflow-hidden border border-[#ece3db]/10 shadow-[0_25px_60px_rgba(0,0,0,0.65)] cursor-pointer will-change-transform aspect-[21/9]"
                >
                  <PortfolioVideoCard
                    project={project}
                    isCenter={isCenter}
                    isPlaying={activeVideoId === project.id}
                    onPlay={() => setActiveVideoId(project.id)}
                    onSelect={() => setActiveIndex(idx)}
                    onBehindTheEdit={() => onBehindTheEdit(project.id)}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* High-quality arrow controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 -translate-y-1/2 top-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fb5d30] border border-[#fb5d30] text-[#0c0a09] flex items-center justify-center hover:scale-110 hover:bg-[#ece3db] active:scale-95 transition-all shadow-2xl cursor-pointer"
            aria-label="Previous work"
          >
            <ChevronLeft size={16} className="stroke-[2.5]" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 -translate-y-1/2 top-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fb5d30] border border-[#fb5d30] text-[#0c0a09] flex items-center justify-center hover:scale-110 hover:bg-[#ece3db] active:scale-95 transition-all shadow-2xl cursor-pointer"
            aria-label="Next work"
          >
            <ChevronRight size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
