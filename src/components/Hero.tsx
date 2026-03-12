import { motion, AnimatePresence } from 'motion/react';
import { Play, ArrowRight, X } from 'lucide-react';

interface HeroProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export default function Hero({ activeVideoId, setActiveVideoId }: HeroProps) {
  const heroVideoId = 'hero-main';
  const youtubeUrl = 'https://www.youtube.com/embed/31ZSrj9R2Ps'; // Replace with actual showreel URL

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-neon-red/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-neon-dark-red/20 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1.5 rounded-full glass text-xs font-bold tracking-widest uppercase text-neon-red mb-6"
          >
            Professional Video Editor
          </motion.span>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none">
            ZNX <span className="text-gradient">EDITING</span>
          </h1>
          
          <p className="text-xl text-white/60 mb-8 max-w-lg leading-relaxed">
            Creating cinematic edits, motion graphics, and high-impact visual storytelling. 
            By <span className="text-white font-semibold">Suyog BC</span>.
          </p>

          <div className="flex flex-wrap gap-4">
            <a 
              href="#portfolio" 
              className="px-8 py-4 rounded-full bg-white text-black font-bold flex items-center gap-2 hover:scale-105 transition-transform"
            >
              View Portfolio <ArrowRight size={18} />
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-full glass font-bold flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              Hire Me
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <div 
            className="relative z-10 glass rounded-[2rem] p-4 aspect-video overflow-hidden group cursor-pointer"
            onClick={() => setActiveVideoId(activeVideoId === heroVideoId ? null : heroVideoId)}
          >
            <AnimatePresence mode="wait">
              {activeVideoId === heroVideoId ? (
                <motion.div
                  key="video"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20 bg-black"
                >
                  <iframe
                    width="100%"
                    height="100%"
                    src={`${youtubeUrl}?autoplay=1`}
                    title="ZNX Showreel"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <button 
                    className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full glass flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveVideoId(null);
                    }}
                  >
                    <X size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="thumbnail"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full w-full"
                >
                  <img 
                    src="https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/mainheader.jpg" 
                    alt="Showreel Preview" 
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <div className="w-20 h-20 rounded-full glass flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                      <Play fill="white" size={32} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Decorative glass elements */}
          <div className="absolute -top-6 -right-6 w-32 h-32 glass rounded-3xl -z-10 rotate-12" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 glass rounded-2xl -z-10 -rotate-12" />
        </motion.div>
      </div>
    </section>
  );
}
