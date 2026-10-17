import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroScreenProps {
  onComplete: () => void;
}

const ASSETS_TO_PRELOAD = [
  '/images/smallimg.avif',
  '/images/small img.avif',
  '/images/bigimg.avif',
  '/images/roselogo.png',
  '/images/Logo.png',
  '/images/work1.jpg',
  '/images/work2.jpg',
  '/images/work3.jpg',
  '/images/work4.jpg',
  '/images/work5.jpg',
  '/images/services hero.avif',
  '/images/hero.avif',
  '/images/eye.avif',
  // Services Page Specific Images
  'https://i.pinimg.com/1200x/2b/89/1f/2b891f6e5c20c30901939bd83d7d5e77.jpg',
  'https://i.pinimg.com/736x/0c/8e/1c/0c8e1c3cca5be58498a8df4106c4bc9c.jpg',
  'https://i.pinimg.com/1200x/df/79/aa/df79aaf64ed99b6f53270093ecab1aca.jpg',
  'https://i.pinimg.com/736x/b9/fb/e1/b9fbe1f7212bc95491709d5b919515c4.jpg',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80',
  // Home & Other Showcase Images
  'https://i.pinimg.com/1200x/ac/64/cc/ac64ccb69f913d9bc4fe99dad224472f.jpg',
  'https://i.pinimg.com/736x/35/41/e2/3541e2cf3038cf0e1bbf5054b548dd1b.jpg',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
  'https://i.pinimg.com/736x/c1/ff/14/c1ff1494be63f5e778c1c8f778790976.jpg',
  'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
  'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
  'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
  'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
  'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
  '/abtsection.mp4'
];

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const loadedCountRef = useRef(0);

  useEffect(() => {
    let active = true;
    const totalAssets = ASSETS_TO_PRELOAD.length;

    const incrementProgress = () => {
      if (!active) return;
      loadedCountRef.current += 1;
      const currentProgress = Math.min(100, (loadedCountRef.current / totalAssets) * 100);
      setProgress(currentProgress);

      if (loadedCountRef.current >= totalAssets) {
        // All assets loaded! Smoothly transition out after a brief moment of completion
        setTimeout(() => {
          if (active) {
            setIsExiting(true);
            setTimeout(onComplete, 800); // smooth exit
          }
        }, 500);
      }
    };

    // Preload each asset
    ASSETS_TO_PRELOAD.forEach((src) => {
      if (src.endsWith('.mp4')) {
        // Preload video via fetch
        fetch(src, { method: 'GET', mode: 'no-cors' })
          .then(() => {
            incrementProgress();
          })
          .catch(() => {
            // Fallback: don't block on errors
            incrementProgress();
          });
      } else {
        // Preload image
        const img = new Image();
        img.src = src;
        img.onload = incrementProgress;
        img.onerror = incrementProgress;
      }
    });

    // Failsafe timeout: Force complete loading after maximum 2.8 seconds to guarantee quick site access
    const failsafeTimer = setTimeout(() => {
      if (active && loadedCountRef.current < totalAssets) {
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 600);
        }, 200);
      }
    }, 2800);

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
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999999] bg-[#EBE8E0] text-black flex items-center justify-center select-none font-sans overflow-hidden"
        >
          {/* Centered text: loading... all small letters */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[14px] sm:text-[16px] font-mono-tech tracking-[0.25em] text-black/80 animate-pulse">
              loading...
            </span>
          </div>

          {/* Loading black bar at the very bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-slate-300/30 overflow-hidden">
            <motion.div
              className="h-full bg-black"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'easeInOut', duration: 0.2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
