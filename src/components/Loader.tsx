import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

interface LoaderProps {
  onComplete?: () => void;
  key?: string;
}

export default function Loader({ onComplete }: LoaderProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay prevented or failed, using fallback transition:", err);
      });
    }

    // Safety timeout to transition to the website even if the video fails to load, is blocked, or stalls
    const safetyTimeout = setTimeout(() => {
      if (onComplete) onComplete();
    }, 8000); // 8 seconds maximum safety duration

    return () => clearTimeout(safetyTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
      className="fixed inset-0 z-[100] bg-[#0c0a09] flex items-center justify-center overflow-hidden select-none pointer-events-none"
    >
      <video
        ref={videoRef}
        src="/INTRO.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        className="w-full h-full object-cover pointer-events-none select-none"
        style={{ pointerEvents: 'none' }}
      />
    </motion.div>
  );
}

