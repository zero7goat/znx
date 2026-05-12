import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['Motion', 'Cinematic', 'Social Media'];

// VIDEO CONFIGURATION: Add your video filenames here in the respective categories
// Place your video files in public/videos/[category]/
const projectData: Record<string, Array<{id: string, title: string, video: string, thumbnail: string}>> = {
  'Motion': [
    { id: 'm1', title: 'Motion Graphic 1', video: 'znxmotion1.mp4', thumbnail: 'uma.jpeg' },
    { id: 'm2', title: 'Motion Graphic 2', video: 'znxmotion2.mp4', thumbnail: 'uma.jpeg' },
    { id: 'm3', title: 'Motion Graphic 3', video: 'znxmotion3.mp4', thumbnail: 'uma.jpeg' },
  ],
  'Cinematic': [
    { id: 'c1', title: 'Cinematic Edit 1', video: 'znxcine1.mp4', thumbnail: 'uma.jpeg' },
    { id: 'c2', title: 'Cinematic Edit 2', video: 'znxcine2.mp4', thumbnail: 'uma.jpeg' },
    { id: 'c3', title: 'Cinematic Edit 3', video: 'znxcine3.mp4', thumbnail: 'uma.jpeg' },
  ],
  'Social Media': [
    { id: 's1', title: 'Social Media Ad 1', video: 'znxsocial1.mp4', thumbnail: 'uma.jpeg' },
    { id: 's2', title: 'Social Media Ad 2', video: 'znxsocial2.mp4', thumbnail: 'uma.jpeg' },
    { id: 's3', title: 'Social Media Ad 3', video: 'znxsocial3.mp4', thumbnail: 'uma.jpeg' },
  ]
};

const projects = Object.entries(projectData).flatMap(([cat, items]) => 
  items.map(item => ({
    ...item,
    category: cat,
    videoUrl: `/videos/${cat.toLowerCase().replace(' ', '_')}/${item.video}`,
    thumbnailUrl: `/${item.thumbnail}`
  }))
);

export default function Portfolio({ activeVideoId, setActiveVideoId }: { activeVideoId: string | null, setActiveVideoId: (id: string | null) => void }) {
  const [filter, setFilter] = useState('Motion');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredProjects = projects.filter(p => p.category === filter);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="portfolio" className="py-24 md:py-32 relative bg-black">
      {/* Background Ambience */}
      <div className="absolute inset-0">
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-apple-gold/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-white/2 rounded-full blur-[150px] pointer-events-none" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        <div className="flex flex-col gap-10 md:gap-16 mb-12 md:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-10">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white uppercase leading-[1.2] overflow-visible"
              >
                My <span className="text-gradient">Work</span>
              </motion.h2>

            <motion.div 
              className="flex flex-wrap gap-2 p-1 bg-white/[0.02] backdrop-blur-3xl rounded-xl border border-white/10 self-start md:self-auto"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 md:px-6 py-2.5 rounded-lg text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative z-10 ${
                    filter === cat ? 'text-black' : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  {filter === cat && (
                    <motion.div 
                      layoutId="activeFilter"
                      className="absolute inset-0 bg-apple-gold rounded-lg -z-10 shadow-[0_5px_20px_rgba(212,175,55,0.3)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {cat}
                </button>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dynamic Layout: Grid for Desktop, Slider for Mobile */}
        <div className="relative group/portfolio">
          {isMobile ? (
            <div className="relative">
              <div 
                ref={scrollRef}
                className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-12 no-scrollbar px-1 -mx-1"
              >
                <AnimatePresence mode="wait">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="flex-shrink-0 w-[85vw] aspect-video snap-center bg-zinc-900/50 rounded-[2rem] overflow-hidden relative border border-white/5 shadow-2xl transition-transform active:scale-95 transform-gpu"
                      onClick={() => setActiveVideoId(project.id)}
                    >
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.title} 
                        loading="lazy"
                        className="w-full h-full object-cover opacity-60 brightness-75 transition-opacity duration-700" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Navigation Arrows for Mobile */}
              <div className="flex justify-between items-center px-4 mt-[-40px] relative z-20">
                <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  <ChevronLeft size={24} />
                </button>
                <div className="flex justify-center gap-1.5">
                  {filteredProjects.map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/10" />
                  ))}
                </div>
                <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full glass border border-white/10 flex items-center justify-center text-white active:scale-90 transition-transform"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-3xl gpu-accel">
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1], delay: index * 0.02 }}
                    className="group relative aspect-video overflow-hidden cursor-pointer bg-zinc-900/30 rounded-[2rem] border border-white/5 active:scale-95 transition-transform will-change-transform transform-gpu hover:border-white/20"
                    onClick={() => setActiveVideoId(project.id)}
                  >
                    <img 
                      src={project.thumbnailUrl} 
                      alt={project.title} 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-50 brightness-75 group-hover:opacity-80 transition-all duration-700" 
                    />
                    
                    {/* Centered Play Button (Static) */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 transition-transform group-hover:scale-110 duration-500">
                      <div className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/50 group-hover:text-white group-hover:bg-white/20 transition-all duration-500">
                        <Play size={24} fill="currentColor" className="ml-1" />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-100" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* Mobile Swipe Hint removed - replaced by arrows */}
        </div>
      </div>

      {/* Full Video Modal */}
      <AnimatePresence>
        {activeVideoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          >
            <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={() => setActiveVideoId(null)} />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_150px_rgba(212,175,55,0.1)] border border-white/5"
            >
              {(() => {
                const project = projects.find(p => p.id === activeVideoId);
                if (!project) return null;

                return (
                  <video
                    src={project.videoUrl}
                    controls
                    autoPlay
                    onContextMenu={(e) => e.preventDefault()}
                    controlsList="nodownload nofullscreen noremoteplayback"
                    className="w-full h-full object-contain"
                  />
                );
              })()}
              <button 
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all z-50"
                onClick={() => setActiveVideoId(null)}
              >
                <X size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

