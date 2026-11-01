import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collectPageImages, preloadImage } from '../utils/assetPreloader';
import { checkLiquidCapability } from '../utils/liquidCapability';

interface IntroScreenProps {
  /** The current page has mounted behind the intro, so its assets can be read from the DOM */
  pageMounted: boolean;
  /** This page shows the WebGL snow, whose code then counts as an asset */
  usesSnow: boolean;
  onComplete: () => void;
}

// Slow connections still get in: whatever hasn't arrived by then keeps loading on the page itself
const ASSET_TIMEOUT_MS = 9000;
const FONT_WEIGHTS = ['400 1em Inter', '600 1em Inter', '700 1em Inter'];
// The bar's last stretch is the device check, which runs once the page is loaded and idle
const ASSETS_SHARE = 90;

const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export default function IntroScreen({ pageMounted, usesSnow, onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const defsRef = useRef<SVGDefsElement>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const startedRef = useRef(false);

  useEffect(() => {
    if (!pageMounted || startedRef.current) return;
    startedRef.current = true;

    // Real progress: one step per file, and the total grows as the page's images are discovered
    let total = 0;
    let done = 0;
    const track = <T,>(task: Promise<T>) => {
      total++;
      const settle = () => {
        done++;
        setProgress(Math.round((done / total) * ASSETS_SHARE));
      };
      task.then(settle, settle);
      return task;
    };

    const loadAssets = async () => {
      const code: Promise<unknown>[] = [track(import('../utils/clothSimulation'))];
      if (usesSnow) code.push(track(import('./ThreeWorld')));
      const fonts = 'fonts' in document ? FONT_WEIGHTS.map((font) => track(document.fonts.load(font))) : [];
      await Promise.allSettled([...code, ...fonts]);

      // Lazy sections have rendered by now, so every image they use is in the DOM
      await nextFrame();
      await nextFrame();
      await Promise.allSettled(collectPageImages().map((src) => track(preloadImage(src))));
    };

    const run = async () => {
      await Promise.race([loadAssets(), new Promise((resolve) => setTimeout(resolve, ASSET_TIMEOUT_MS))]);
      setProgress(ASSETS_SHARE);
      if (rootRef.current && innerRef.current && defsRef.current) {
        await checkLiquidCapability(rootRef.current, innerRef.current, defsRef.current);
      }
      setProgress(100);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onCompleteRef.current(), 600);
      }, 200);
    };
    run();
  }, [pageMounted, usesSnow]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={rootRef}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[999999] bg-[#EBE8E0] text-black select-none font-sans overflow-hidden pointer-events-auto"
        >
          {/* The device check filters this surface and the root together, as real blocks stack up */}
          <div ref={innerRef} className="absolute inset-0 bg-[#EBE8E0] flex items-center justify-center">
            {/* Centered text: loading... all small letters */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[14px] sm:text-[16px] font-mono-tech tracking-[0.25em] text-black/80 animate-pulse">
                loading...
              </span>
            </div>
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

          <svg aria-hidden="true" focusable="false" width="0" height="0" className="absolute">
            <defs ref={defsRef} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
