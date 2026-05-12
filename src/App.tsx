import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import Loader from './components/Loader';
import ParallaxBackground from './components/ParallaxBackground';

export default function App() {
  const { scrollYProgress } = useScroll();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

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
              className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-apple-gold/20 via-apple-gold to-apple-gold/20 z-[60] origin-left"
              style={{ scaleX }}
            />

            <Navbar />
            
            <main>
              <Hero activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
              <About />
              <Portfolio activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
              <Process />
              <Contact />
            </main>

            <ScrollToTop />

            <footer className="py-16 border-t border-white/5 relative bg-black/20">
              <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="space-y-4">
                    <div className="text-3xl font-bold tracking-tighter text-gradient">ZNX</div>
                    <p className="text-white/30 text-[13px] max-w-xs font-medium">
                      Cinematic visual storytelling and high-end motion design for brands and creators.
                    </p>
                  </div>
                  
                  <div className="flex flex-col items-center md:items-end gap-6">
                    <div className="flex gap-8 text-[13px] font-bold tracking-widest uppercase text-white/30">
                      <a href="#portfolio" className="hover:text-apple-gold transition-colors">Works</a>
                      <a href="#about" className="hover:text-apple-gold transition-colors">Story</a>
                      <a href="#contact" className="hover:text-apple-gold transition-colors">Contact</a>
                    </div>
                    <div className="text-white/20 text-[11px] font-medium tracking-wide">
                      © {new Date().getFullYear()} ZNX EDITING • ALL RIGHTS RESERVED
                    </div>
                  </div>
                </div>
              </div>
            </footer>

            <ParallaxBackground />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
