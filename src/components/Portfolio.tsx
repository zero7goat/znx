import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X, ExternalLink } from 'lucide-react';

const categories = ['All', 'Cinematic', 'Gaming', 'Motion Graphics', 'Social Media'];

const projects = [
  {
    id: 'p1',
    title: 'The Finals Montage',
    category: 'Gaming',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Finals.png',
    description: 'High-octane montage with custom transitions and sync-heavy editing.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'p2',
    title: 'Flow Style',
    category: 'Cinematic',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Flow%20style.jpg',
    description: 'A moody, atmospheric exploration of urban nightlife with custom color grading.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'p3',
    title: 'Futuristic UI Design',
    category: 'Motion Graphics',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Ui.jpg',
    description: 'Advanced motion graphics for a sci-fi interface concept.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'p4',
    title: 'The Creator Podcast',
    category: 'Social Media',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/podcast.jpg',
    description: 'Dynamic multi-cam editing with engaging captions and visual hooks.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'p5',
    title: 'Call of Duty Highlights',
    category: 'Gaming',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Call%20of%20Duty.jpg',
    description: 'Sync-heavy gameplay edit with 3D tracking and custom VFX.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'p6',
    title: 'Music Video',
    category: 'Cinematic',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Music%20Video.jpg',
    description: 'High-end car cinematography with immersive sound design.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
  {
    id: 'p7',
    title: 'Modern Architecture Documentary',
    category: 'Social Media',
    thumbnail: 'https://raw.githubusercontent.com/zero7goat/imgs/refs/heads/main/Documentary.jpg',
    description: 'Clean, minimalist storytelling for a documentary series.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
  },
];

interface PortfolioProps {
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
}

export default function Portfolio({ activeVideoId, setActiveVideoId }: PortfolioProps) {
  const [filter, setFilter] = useState('All');

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  const handlePlay = (id: string) => {
    setActiveVideoId(activeVideoId === id ? null : id);
  };

  return (
    <section id="portfolio" className="py-24 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured <span className="text-gradient">Work</span></h2>
            <p className="text-white/50 max-w-md">A collection of my best edits, ranging from cinematic storytelling to high-energy gaming montages.</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilter(cat);
                  setActiveVideoId(null); // Stop video when filtering
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  filter === cat 
                    ? 'bg-white text-black' 
                    : 'glass text-white/60 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative glass rounded-3xl overflow-hidden aspect-video cursor-pointer"
                onClick={() => handlePlay(project.id)}
              >
                <AnimatePresence mode="wait">
                  {activeVideoId === project.id ? (
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
                        src={`${project.videoUrl}?autoplay=1`}
                        title={project.title}
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
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Overlay - Always visible on mobile, hover on desktop */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 md:p-6">
                        <div className="flex items-center justify-between mb-1.5 md:mb-2">
                          <span className="text-[10px] md:text-[10px] uppercase tracking-widest text-neon-red font-bold">{project.category}</span>
                          <div className="flex gap-2">
                            <div className="w-8 h-8 md:w-8 md:h-8 rounded-full glass flex items-center justify-center text-white">
                              <Play size={14} fill="white" className="md:w-[14px] md:h-[14px]" />
                            </div>
                          </div>
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-1">{project.title}</h3>
                        <p className="text-xs md:text-sm text-white/70 line-clamp-2 md:line-clamp-2">{project.description}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
