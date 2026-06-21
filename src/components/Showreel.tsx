import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// EDITABLE YOUTUBE LINK FOR SHOWREEL VIDEO
const SHOWREEL_YOUTUBE_URL = "https://youtu.be/hJwTbpZp8pM";

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeEmbedUrl(url: string, autoplay: boolean = true) {
  const videoId = getYouTubeId(url);
  if (!videoId) return url;
  // mute=0 to enable full sound output when clicked
  return `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=0&playsinline=1&controls=1&rel=0&modestbranding=1`;
}

function isYouTubeUrl(url: string) {
  return url.includes('youtube.com') || url.includes('youtu.be');
}

interface ShowreelProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export default function Showreel({ activeVideoId, setActiveVideoId }: ShowreelProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isPlaying = activeVideoId === 'showreel';

  const videoId = getYouTubeId(SHOWREEL_YOUTUBE_URL);
  const defaultThumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` 
    : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=60&w=1200&auto=format&fit=crop';

  const [thumbnailSrc, setThumbnailSrc] = useState("/Images/port.avif");

  // Reset play state if scrolled away from viewport
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && activeVideoId === 'showreel') {
        setActiveVideoId(null);
      }
    }, { threshold: 0.1 });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [activeVideoId, setActiveVideoId]);

  // Clean container when playing changes
  useEffect(() => {
    if (!isPlaying) {
      const targetContainer = document.getElementById('showreel-player-container');
      if (targetContainer) {
        targetContainer.innerHTML = '';
      }
    }
  }, [isPlaying]);

  return (
    <section 
      ref={sectionRef}
      id="showreel" 
      className="py-16 md:py-24 relative overflow-hidden bg-black text-[#ece3db] scroll-mt-24"
    >
      {/* Background aesthetics */}
      <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 pointer-events-none opacity-20 z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-stone-900/60 h-full w-full" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Clean Modern Section Heading directly above the video */}
        <div className="flex flex-col items-center text-center mb-8 sm:mb-10 w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#fb5d30] uppercase font-sans select-none">
            SHOWREEL
          </h2>
        </div>

        {/* Video Card Wrapper */}
        <div className="relative w-full max-w-[960px] flex justify-center mb-8 sm:mb-14 z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="group relative w-full aspect-[16/9] rounded-xl sm:rounded-2xl overflow-hidden border border-[#ece3db]/15 bg-[#120e0c]/90 shadow-[0_30px_90px_rgba(0,0,0,0.8)] focus-within:ring-2 focus-within:ring-[#ece3db]/30 cursor-pointer font-sans"
            onClick={() => {
              if (!isPlaying) {
                setActiveVideoId('showreel');
                
                // Synchronously inject high performance iframe/video to delegate click activation token to iframe sandbox for unmuted layout autoplay!
                const targetContainer = document.getElementById('showreel-player-container');
                if (targetContainer) {
                  targetContainer.innerHTML = '';
                  if (isYouTubeUrl(SHOWREEL_YOUTUBE_URL)) {
                    const iframe = document.createElement('iframe');
                    iframe.src = getYouTubeEmbedUrl(SHOWREEL_YOUTUBE_URL, true);
                    iframe.title = "Showreel YouTube Video";
                    iframe.frameBorder = "0";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                    iframe.allowFullscreen = true;
                    iframe.className = "w-full h-full object-cover bg-black";
                    targetContainer.appendChild(iframe);
                  } else {
                    const video = document.createElement('video');
                    video.src = SHOWREEL_YOUTUBE_URL;
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
            {/* The actual injected iframe/video player container */}
            <div 
              id="showreel-player-container"
              className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isPlaying ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}
            />

            {/* Cinematic overlay cover */}
            <div 
              className={`absolute inset-0 w-full h-full flex items-center justify-center transition-opacity duration-300 ${isPlaying ? 'opacity-0 pointer-events-none z-0' : 'opacity-100 z-10'}`}
            >
              <img 
                src={thumbnailSrc} 
                alt="Showreel Trailer"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover brightness-[0.75] hover:brightness-[0.9] transition-all duration-500 hover:scale-105"
                onError={() => {
                  if (thumbnailSrc !== defaultThumbnailUrl) {
                    setThumbnailSrc(defaultThumbnailUrl);
                  } else if (videoId) {
                    setThumbnailSrc(`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
                  }
                }}
              />
              <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
              
              {/* Perfect custom YT style play button - Turns fb5d30 on hover */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Removed group-hover:scale-110 to prevent play button zoom on hover */}
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
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
