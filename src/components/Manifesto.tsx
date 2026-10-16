import { useRef, useEffect } from 'react';

interface ManifestoProps {
  onOpenContact?: () => void;
}

export default function AboutVideoSection({ onOpenContact }: ManifestoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Robust, guaranteed autoplay triggers across all strict browsers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Crucial programmatic overrides to bypass Chrome/Safari autoplay blockages
    video.muted = true;
    video.defaultMuted = true;
    // Ensure loop is false so the 'ended' event fires natively
    video.loop = false;

    const playVideo = () => {
      video.play().catch((err) => {
        console.log("Autoplay blocked/waiting for interaction:", err);
      });
    };

    // Attempt playback immediately
    playVideo();

    // Event-based triggers to play as soon as data buffers
    video.addEventListener('canplay', playVideo);
    video.addEventListener('loadeddata', playVideo);

    // Dynamic user interaction fallback (plays the instant user scrolls or taps)
    const handleUserInteraction = () => {
      playVideo();
      cleanupInteractionListeners();
    };

    const cleanupInteractionListeners = () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('touchstart', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };

    window.addEventListener('click', handleUserInteraction, { passive: true });
    window.addEventListener('touchstart', handleUserInteraction, { passive: true });
    window.addEventListener('scroll', handleUserInteraction, { passive: true });

    return () => {
      video.removeEventListener('canplay', playVideo);
      video.removeEventListener('loadeddata', playVideo);
      cleanupInteractionListeners();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Custom cycle: Stop at end frame for exactly 2 seconds, then reset and replay
  const handleVideoEnded = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play().catch((err) => {
          console.log("Playback retry failed on cycle:", err);
        });
      }
    }, 2000); // 2 seconds gap at the end frame
  };

  return (
    <section
      id="about"
      className="relative w-full bg-transparent overflow-hidden select-none pointer-events-none border-t border-b border-white/[0.06] flex items-center justify-center py-2 sm:py-4 md:py-6"
    >
      {/* Background Poster Loader / Fallback Gradients */}
      <div className="absolute inset-0 bg-[#070707] z-0" />

      {/* Cinematic Film Grain Overlay */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Dark Subtle Scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-10 pointer-events-none" />

      {/* Optimized HTML5 Video Element (Capped slightly more to reduce vertical height and keep it extremely compact) */}
      <div className="w-full max-w-lg sm:max-w-2xl md:max-w-3xl lg:max-w-[850px] mx-auto px-4 sm:px-6 relative z-0 flex items-center justify-center">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          className="w-full h-auto block rounded-none border-none select-none pointer-events-none relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
          style={{ filter: 'brightness(0.95) contrast(1.02)' }}
        >
          <source src="/abtsection.mp4" type="video/mp4" />
          <source src="/images/abtsection.mp4" type="video/mp4" />
          <p className="text-white text-xs p-4">Your browser does not support HTML5 video.</p>
        </video>
      </div>
    </section>
  );
}
