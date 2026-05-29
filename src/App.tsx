import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Showreel from './components/Showreel';
import Portfolio from './components/Portfolio';
import ShortForm from './components/ShortForm';
import About from './components/About';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import ParallaxBackground from './components/ParallaxBackground';
import ResumeModal from './components/ResumeModal';
import CustomCursor from './components/CustomCursor';
import LiquidFilter from './components/LiquidFilter';
import WebGLLiquid from './components/WebGLLiquid';
import VideoBleedSampler from './components/VideoBleedSampler';

const ALL_MEDIA_ASSETS = [
  { id: 'm1', videoUrl: 'https://res.cloudinary.com/dpppdovro/video/upload/v1779366491/Motion1_m98voa.mp4' },
  { id: 'm2', videoUrl: 'https://res.cloudinary.com/dpppdovro/video/upload/v1779366491/Motion1_m98voa.mp4' },
  { id: 'm3', videoUrl: 'https://res.cloudinary.com/dpppdovro/video/upload/v1779366491/Motion1_m98voa.mp4' },
  { id: 's1', videoUrl: '/videos/motion/znxmotion1.mp4' },
  { id: 's2', videoUrl: '/videos/motion/znxmotion1.mp4' },
  { id: 's3', videoUrl: '/videos/motion/znxmotion1.mp4' },
];

export default function App() {
  const { scrollYProgress } = useScroll();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Lock document root to dark class forever
    document.documentElement.classList.add('dark');
  }, []);

  // Buttery-smooth, custom inertia-based scrolling with Lenis
  useEffect(() => {
    if (isLoading) return; // Wait until loading screen is finished

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Luxurious, smooth exponential ease out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.25, // Perfectly responsive speed
      touchMultiplier: 1.5,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [isLoading]);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const imageUrls = [
      '/Images/astronaut.avif',
      '/Images/thumbnail for long form/thumb1.avif',
      '/Images/thumbnail for long form/thumb2.avif',
      '/Images/thumbnail for long form/thumb3.avif',
      '/Images/thumbnail short form/toe1.png',
      '/Images/thumbnail short form/toe2.png',
      '/Images/thumbnail short form/toe3.png',
      '/Images/port.avif'
    ];

    let imagesLoaded = false;
    let timerDone = false;

    const checkFinished = () => {
      if (imagesLoaded && timerDone) {
        setIsLoading(false);
      }
    };

    // Minimum display time for loader to yield an incredibly elegant, premium cinematic introduction
    const timer = setTimeout(() => {
      timerDone = true;
      checkFinished();
    }, 2500);

    // Preload each image with modern Image instance caching
    const preloadPromises = imageUrls.map(url => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Graceful fallback if any image is missing/failing
      });
    });

    Promise.all(preloadPromises).then(() => {
      imagesLoaded = true;
      checkFinished();
    });

    return () => clearTimeout(timer);
  }, []);

  const activeMedia = ALL_MEDIA_ASSETS.find(item => item.id === activeVideoId);

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <Loader key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Progress Bar */}
            <motion.div 
              className="fixed top-0 left-0 right-0 h-[3px] bg-clay z-[60] origin-left"
              style={{ scaleX }}
            />

            <Navbar 
              onOpenResume={() => setIsResumeOpen(true)} 
            />
            
            <main>
              <Hero activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
              <Showreel activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
              <Portfolio activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
              <ShortForm activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
              <About onOpenResume={() => setIsResumeOpen(true)} />
            </main>

            <ScrollToTop />

            <ParallaxBackground />
            <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
            <CustomCursor />
            <LiquidFilter />
            <WebGLLiquid />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
