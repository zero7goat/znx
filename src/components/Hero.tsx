import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'motion/react';
import { Play, ArrowRight, X, Volume2, VolumeX } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface HeroProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export default function Hero({ activeVideoId, setActiveVideoId }: HeroProps) {
  const containerRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [hasHoverSupport, setHasHoverSupport] = useState(false);

  useEffect(() => {
    setHasHoverSupport(window.matchMedia('(hover: hover)').matches);
  }, []);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 40, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.02]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const videoUrl = '/videos/motion/znxmotion1.mp4';

  return (
    <section ref={containerRef} id="home" className="relative min-h-[90vh] flex items-center justify-center pt-56 pb-32 md:pt-64 lg:pt-50">
      {/* Cinematic Background Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[5%] left-[10%] w-[50%] h-[50%] bg-apple-gold/[0.08] rounded-full blur-[140px] animate-pulse-slow" />
        <div className="absolute bottom-[5%] right-[10%] w-[50%] h-[50%] bg-apple-amber/[0.04] rounded-full blur-[140px] animate-pulse-slow delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], [0, -50]), opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
          className="text-center lg:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1], delay: 0.6 }}
            className="text-6xl md:text-8xl lg:text-[clamp(64px,10vw,120px)] font-black tracking-tighter mb-8 leading-[1.2] lg:leading-[1.1] uppercase overflow-visible gpu-accel will-change-transform"
          >
            <span className="block opacity-20">PREMIUM</span>
            <span className="text-gradient block">EDITING</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg text-white/40 mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium px-2"
          >
            Elevating visual storytelling through high-end motion design and cinematic editing. 
            By <span className="text-white/70">Suyog BC</span>.
          </motion.p>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6">
            <a 
              href="#portfolio" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-black text-sm font-bold flex items-center justify-center gap-2 hover:opacity-85 transition-all duration-500 transform active:scale-[0.98] shadow-xl shadow-white/5"
            >
              View Work <ArrowRight size={18} strokeWidth={2.5} />
            </a>
            <a 
              href="#contact" 
              className="w-full sm:w-auto px-10 py-5 rounded-2xl glass text-sm font-bold flex items-center justify-center gap-2 transition-all duration-500 hover:bg-white/[0.08] active:scale-[0.98]"
            >
              Contact
            </a>
          </div>
        </motion.div>

        <motion.div
          style={{ y, scale }}
          initial={{ opacity: 0, scale: 0.95, rotateX: 15 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1], delay: 0.5 }}
          className="relative perspective-2000"
        >
          <div 
            className={`relative z-10 glass rounded-[2.5rem] p-2 md:p-3 aspect-video overflow-hidden shadow-2xl shadow-black/60 gpu-accel transform-gpu will-change-transform ${hasHoverSupport ? 'cursor-none' : 'cursor-pointer'}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onClick={toggleMute}
          >
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onContextMenu={(e) => e.preventDefault()}
              controlsList="nodownload"
              className="w-full h-full object-cover rounded-[1.8rem] opacity-90 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            />

            {/* Custom Interactive Cursor */}
            <AnimatePresence>
              {isHovering && hasHoverSupport && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  style={{ 
                    left: cursorX,
                    top: cursorY,
                    translateX: '-50%',
                    translateY: '-50%'
                  }}
                  className="absolute pointer-events-none z-50 flex flex-col items-center justify-center gap-1 group"
                >
                  <div className="bg-white/90 backdrop-blur-md rounded-full p-4 shadow-2xl border border-white/20 flex items-center justify-center">
                    {isMuted ? (
                      <VolumeX size={20} className="text-black" />
                    ) : (
                      <Volume2 size={20} className="text-black" />
                    )}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white bg-black/60 px-3 py-1 rounded-full backdrop-blur-md shadow-lg border border-white/5">
                    {isMuted ? "Unmute" : "Mute"}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Ambient reflections/accents */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/[0.02] glass rounded-full blur-2xl -z-10" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/[0.01] glass rounded-full blur-xl -z-10" />
        </motion.div>
      </div>
    </section>
  );
}
