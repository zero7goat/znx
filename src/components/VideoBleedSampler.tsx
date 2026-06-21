import React, { useEffect, useRef, useState } from 'react';

interface VideoBleedSamplerProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isFallback?: boolean;
}

export default function VideoBleedSampler({ videoRef, isFallback = false }: VideoBleedSamplerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFlares, setActiveFlares] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    
    // If it's a fallback (e.g. Vimeo iframe), we animate beautiful flowing ambient flares instead of canvas sampling
    if (isFallback) {
      setActiveFlares(true);
      return;
    }

    if (!video) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: false });
    if (!ctx) return;

    let animationFrameId: number;
    let lastFrameTime = 0;
    const fpsInterval = 1000 / 24; // Limit sampling to cinematic 24fps to conserve 100% CPU

    const sampleFrame = () => {
      const now = performance.now();
      const elapsed = now - lastFrameTime;

      if (elapsed >= fpsInterval) {
        lastFrameTime = now - (elapsed % fpsInterval);
        
        if (video.readyState >= 2) { // HAVE_CURRENT_DATA or higher
          try {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          } catch (e) {
            // Silence cross-origin exceptions seamlessly
          }
        }
      }

      if (!video.paused && !video.ended) {
        animationFrameId = requestAnimationFrame(sampleFrame);
      }
    };

    const handlePlay = () => {
      setActiveFlares(true);
      animationFrameId = requestAnimationFrame(sampleFrame);
    };

    const handlePause = () => {
      cancelAnimationFrame(animationFrameId);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('timeupdate', sampleFrame);

    // Initial trigger
    if (!video.paused) {
      handlePlay();
    } else {
      sampleFrame();
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('timeupdate', sampleFrame);
      cancelAnimationFrame(animationFrameId);
    };
  }, [videoRef, isFallback]);

  return (
    <div className="absolute inset-x-[-15%] inset-y-[-10%] w-[130%] h-[120%] pointer-events-none overflow-hidden z-0 select-none bg-black/60">
      {isFallback ? (
        // Premium ambient light leaks that drift organically on the margins for Vimeo
        <div className="absolute inset-0 flex items-center justify-center opacity-40">
          <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-clay/35 rounded-full filter blur-[140px] animate-pulse duration-7000" />
          <div className="absolute bottom-1/4 right-1/4 w-[50%] h-[50%] bg-[#fb5d30]/25 rounded-full filter blur-[150px] animate-pulse duration-10000 delay-1000" />
        </div>
      ) : (
        // Canvas real-time pixel stretch Projection
        <canvas
          ref={canvasRef}
          width={24}
          height={18}
          className="absolute inset-[5%] w-[90%] h-[90%] rounded-[10rem] filter blur-[140px] opacity-75 mix-blend-screen scale-125 transform-gpu"
        />
      )}
      
      {/* Soft cinematic vignette overlays */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80" />
    </div>
  );
}
