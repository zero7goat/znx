import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Services from './components/Services';
import Process from './components/Process';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import { useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export default function App() {
  const { scrollYProgress } = useScroll();
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative">
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-red to-white z-[60] origin-left"
        style={{ scaleX }}
      />

      <Navbar />
      
      <main>
        <Hero activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
        <About />
        <Portfolio activeVideoId={activeVideoId} setActiveVideoId={setActiveVideoId} />
        <Services />
        <Process />
        <Contact />
      </main>

      <ScrollToTop />

      <footer className="py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-2xl font-bold tracking-tighter text-gradient">ZNX</div>
          <div className="text-white/40 text-sm">
            © {new Date().getFullYear()} ZNX Editing | contactmeznx@gmail.com
          </div>
          <div className="flex gap-6 text-white/40 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-neon-red/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-dark-red/10 rounded-full blur-[150px]" />
      </div>
    </div>
  );
}
