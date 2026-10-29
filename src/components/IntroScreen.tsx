import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { preloadImages, preloadFonts, CRITICAL_ROUTE_ASSETS } from '../utils/assetPreloader';

interface IntroScreenProps {
  onComplete: () => void;
}

// Only block on what the homepage shows first; other routes preload when navigated to
const ASSETS_TO_PRELOAD = CRITICAL_ROUTE_ASSETS.home;

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    let active = true;

    // Parallel preloading of critical route images + document.fonts.ready
    const totalAssets = ASSETS_TO_PRELOAD.length;

    const incrementProgress = () => {
      if (!active) return;
      loadedCountRef.current += 1;
      const currentProgress = Math.min(100, Math.round((loadedCountRef.current / totalAssets) * 100));
      setProgress(currentProgress);

      if (loadedCountRef.current >= totalAssets) {
        setTimeout(() => {
          if (active) {
            setIsExiting(true);
            setTimeout(onComplete, 600);
          }
        }, 300);
      }
    };

    // Preload all critical images
    ASSETS_TO_PRELOAD.forEach((src) => {
      const img = new Image();
      img.src = src;

      const finish = () => incrementProgress();

      if (img.complete) {
        finish();
      } else if (typeof img.decode === 'function') {
        img.decode().then(finish).catch(() => {
          img.onload = finish;
          img.onerror = finish;
        });
      } else {
        img.onload = finish;
        img.onerror = finish;
      }
    });

    // Also wait for web fonts
    preloadFonts(1500).catch(() => {});

    // Failsafe timeout: max 2.2s so user is never stuck
    const failsafeTimer = setTimeout(() => {
      if (active && loadedCountRef.current < totalAssets) {
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 500);
        }, 150);
      }
    }, 2200);

    return () => {
      active = false;
      clearTimeout(failsafeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999999] bg-[#EBE8E0] text-black flex items-center justify-center select-none font-sans overflow-hidden pointer-events-auto"
        >
          {/* Centered text: loading... all small letters */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[14px] sm:text-[16px] font-mono-tech tracking-[0.25em] text-black/80 animate-pulse">
              loading...
            </span>
          </div>

          {/* Loading black bar at the very bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-neutral-300/30 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: 0.15 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
