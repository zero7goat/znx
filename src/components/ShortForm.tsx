import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// EDITABLE YOUTUBE LINKS FOR SHORTS
// EACH SHORT FORM VIDEO HAS A SEPARATE LINE IN THE CODE TO BE REPLACED WITH ANY YOUTUBE LINK BELOW:
const SHORTS_YOUTUBE_URL_1 = "https://youtube.com/shorts/2Ee8kZT6Ahc?feature=share";
const SHORTS_YOUTUBE_URL_2 = "https://youtube.com/shorts/aL6UxVzxmUo?feature=share";
const SHORTS_YOUTUBE_URL_3 = "https://youtube.com/shorts/2Ee8kZT6Ahc?feature=share";

const shorts = [
  { 
    id: 's1', 
    videoUrl: SHORTS_YOUTUBE_URL_1, 
    glowColor: 'rgba(29, 78, 216, 0.25)',
    localThumb: '/Images/thumbnail short form/short1.avif'
  },
  { 
    id: 's2', 
    videoUrl: SHORTS_YOUTUBE_URL_2, 
    glowColor: 'rgba(249, 115, 22, 0.25)',
    localThumb: '/Images/thumbnail short form/short2.avif'
  },
  { 
    id: 's3', 
    videoUrl: SHORTS_YOUTUBE_URL_3, 
    glowColor: 'rgba(217, 119, 6, 0.25)',
    localThumb: '/Images/thumbnail short form/short1.avif'
  }
];

interface ShortsVideoCardProps {
  short: typeof shorts[0];
  isCenter: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onSelect: () => void;
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
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

function getPlayableUrl(url: string) {
  if (url.startsWith('/videos/motion/')) {
    // Return high quality Cloudinary fallback if local video bundle is absent in production container
    return "https://res.cloudinary.com/dpppdovro/video/upload/v1779366491/Motion1_m98voa.mp4";
  }
  return url;
}

function ShortsVideoCard({ 
  short, 
  isCenter, 
  isPlaying, 
  onPlay, 
  onSelect 
}: ShortsVideoCardProps) {
  const videoId = getYouTubeId(short.videoUrl);
  const defaultThumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` 
    : 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=60&w=600&auto=format&fit=crop';

  const displayThumbnail = (short as any).localThumb || defaultThumbnailUrl;

  // Clean container when playing changes
  useEffect(() => {
    if (!isPlaying) {
      const targetContainer = document.getElementById(`shorts-player-container-${short.id}`);
      if (targetContainer) {
        targetContainer.innerHTML = '';
      }
    }
  }, [isPlaying, short.id]);

  return (
    <div 
      className="group absolute inset-0 w-full h-full bg-[#120e0c] select-none rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden font-sans"
      onClick={() => {
        if (!isCenter) {
          onSelect();
        } else if (!isPlaying) {
          onPlay();

          // Synchronously inject high performance iframe/video to delegate click activation token to iframe sandbox for unmuted layout autoplay!
          const targetContainer = document.getElementById(`shorts-player-container-${short.id}`);
          if (targetContainer) {
            targetContainer.innerHTML = '';
            if (isYouTubeUrl(short.videoUrl)) {
              const iframe = document.createElement('iframe');
              iframe.src = getYouTubeEmbedUrl(short.videoUrl, true);
              iframe.title = `Short ${short.id}`;
              iframe.frameBorder = "0";
              iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
              iframe.allowFullscreen = true;
              iframe.className = "w-full h-full object-cover bg-black rounded-[1.5rem] sm:rounded-[2rem]";
              targetContainer.appendChild(iframe);
            } else {
              const video = document.createElement('video');
              video.src = getPlayableUrl(short.videoUrl);
              video.autoplay = true;
              video.playsInline = true;
              video.controls = true;
              video.className = "w-full h-full object-cover bg-black rounded-[1.5rem] sm:rounded-[2rem]";
              targetContainer.appendChild(video);
            }
          }
        }
      }}
    >
      {/* Target Container - Always in DOM */}
      <div 
        id={`shorts-player-container-${short.id}`}
        className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isPlaying && isCenter ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
      />

      {/* Thumbnail Cover */}
      <div 
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-300 ${isPlaying && isCenter ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}
      >
        <img 
          src={displayThumbnail} 
          alt={`Short ${short.id}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
          onError={(e) => {
            // Fallback to hqdefault in case the custom local path has any load issues or YT maxres is missing
            if (videoId) {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }
          }}
        />
        <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />

        {isCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-10 sm:w-16 sm:h-11 flex items-center justify-center transition-all duration-500 transform group-hover:scale-110">
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
      </div>
    </div>
  );
}

interface ShortFormProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export default function ShortForm({ 
  activeVideoId, 
  setActiveVideoId 
}: ShortFormProps) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset playing state whenever active slide changes
  useEffect(() => {
    if (activeVideoId && ['s1', 's2', 's3'].includes(activeVideoId)) {
      setActiveVideoId(null);
    }
  }, [activeIndex]);

  // Reset play state if scrolled away from viewport
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && activeVideoId && ['s1', 's2', 's3'].includes(activeVideoId)) {
        setActiveVideoId(null);
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [activeVideoId, setActiveVideoId]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : shorts.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < shorts.length - 1 ? prev + 1 : 0));
  };

  // Lag-free responsive calculations matching responsive CSS sizes precisely
  const getResponsiveConfig = () => {
    if (windowWidth < 640) {
      return { cardWidth: 180, gap: 16 };
    } else if (windowWidth < 768) {
      return { cardWidth: 220, gap: 20 };
    } else if (windowWidth < 1024) {
      return { cardWidth: 260, gap: 24 };
    } else {
      return { cardWidth: 300, gap: 24 };
    }
  };

  const { cardWidth, gap } = getResponsiveConfig();
  
  // Track offset to center active index card perfectly
  const trackX = (windowWidth / 2) - (cardWidth / 2) - activeIndex * (cardWidth + gap);

  return (
    <section 
      ref={sectionRef}
      id="shorts" 
      className="py-16 md:py-24 relative bg-[#090706] overflow-hidden"
    >
      {/* Backlight Ambient Glow reflecting the active cards */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full blur-[160px] opacity-25 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{ backgroundColor: shorts[activeIndex].glowColor }}
        />
      </div>

      <div className="w-full relative z-10">
        <div className="flex flex-col items-center text-center mb-8 sm:mb-12 gap-3">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#fb5d30] uppercase font-sans select-none"
          >
            Short Form
          </motion.h2>
        </div>

        {/* Cinematic Vertical Profile Track Slider */}
        <div 
          onContextMenu={(e) => e.preventDefault()} 
          className="relative select-none w-full h-[360px] sm:h-[480px] md:h-[580px] lg:h-[640px] flex items-center overflow-visible py-4"
        >
          {/* Flex Track container translating smoothly */}
          <motion.div
            className="absolute left-0 top-0 h-full flex items-center"
            style={{ gap }}
            animate={{ x: trackX }}
            transition={{
              type: "spring",
              stiffness: 110,
              damping: 24,
              mass: 0.8
            }}
          >
            {shorts.map((short, idx) => {
              const isCenter = idx === activeIndex;

              return (
                <motion.div
                  key={short.id}
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
                  className="relative h-full bg-[#120e0c] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden border border-[#ece3db]/10 shadow-[0_30px_70px_rgba(0,0,0,0.6)] cursor-pointer will-change-transform aspect-[9/16]"
                >
                  <ShortsVideoCard
                    short={short}
                    isCenter={isCenter}
                    isPlaying={activeVideoId === short.id}
                    onPlay={() => setActiveVideoId(short.id)}
                    onSelect={() => setActiveIndex(idx)}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Brighter Arrow controls */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 -translate-y-1/2 top-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fb5d30] border border-[#fb5d30] text-[#0c0a09] flex items-center justify-center hover:scale-110 hover:bg-[#ece3db] active:scale-95 transition-all shadow-2xl cursor-pointer"
            aria-label="Previous short"
          >
            <ChevronLeft size={16} className="stroke-[2.5]" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 -translate-y-1/2 top-1/2 z-40 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#fb5d30] border border-[#fb5d30] text-[#0c0a09] flex items-center justify-center hover:scale-110 hover:bg-[#ece3db] active:scale-95 transition-all shadow-2xl cursor-pointer"
            aria-label="Next short"
          >
            <ChevronRight size={16} className="stroke-[2.5]" />
          </button>
        </div>
      </div>
    </section>
  );
}
