import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Workflow, 
  RotateCcw,
  Zap,
  Award
} from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  category: 'Long Form';
  videoUrl: string;
  localThumb: string;
  shortDescription: string;
  overview: string;
  stats: {
    duration: string;
    revisions: string;
    software: string;
    completionTime: string;
  };
}

const PROJECT_DATABASE: Record<string, ProjectData> = {
  m1: {
    id: 'm1',
    title: 'Work 01 - ElevenLabs Flow',
    category: 'Long Form',
    videoUrl: 'https://youtu.be/9N30FXMxmIM',
    localThumb: '/Images/thumbnail for long form/thumb1.avif',
    shortDescription: 'This project was created to highlight the Flow feature from ElevenLabs in a way that feels quick, clear, and engaging. The focus was on keeping the pacing tight, using motion graphics to support the message, and making every second count without overwhelming the viewer.',
    overview: '',
    stats: {
      duration: '22s',
      revisions: '3 Passes',
      software: 'After Effects & Illustrator',
      completionTime: '8 Hours'
    }
  },
  m2: {
    id: 'm2',
    title: 'Work 02 - Aroya',
    category: 'Long Form',
    videoUrl: 'https://youtu.be/-wGVpJEG_uI',
    localThumb: '/Images/thumbnail for long form/thumb2.avif',
    shortDescription: 'Aroya is a self-initiated concept created to explore how a modern health and fitness app could be presented through motion design. The goal was to combine clean UI animations, smooth transitions, and clear visual storytelling to showcase the app features in a way that feels polished and easy to follow.',
    overview: '',
    stats: {
      duration: '21s',
      revisions: '1 Pass',
      software: 'After Effects & Illustrator',
      completionTime: '5 Hours'
    }
  },
  m3: {
    id: 'm3',
    title: 'Work 03 - ZNX Music',
    category: 'Long Form',
    videoUrl: 'https://youtu.be/OJW4UCOkuEo',
    localThumb: '/Images/thumbnail for long form/thumb3.avif',
    shortDescription: 'This project focuses on presenting an AI music generation feature in a way that is quick, engaging, and easy to understand. The edit was built around matching visuals, motion graphics, and pacing with different moods to demonstrate how creators can generate music that fits any type of content, from cinematic videos to social media clips.',
    overview: '',
    stats: {
      duration: '35s',
      revisions: '4 Passes',
      software: 'Premiere Pro, After Effects & Illustrator',
      completionTime: '3 Days'
    }
  }
};

const PROJECT_KEYS = Object.keys(PROJECT_DATABASE);

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getYouTubeEmbedUrl(url: string) {
  const videoId = getYouTubeId(url);
  if (!videoId) return url;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&playsinline=1&controls=1&rel=0&modestbranding=1`;
}

interface ProjectBreakdownProps {
  projectId: string;
  onBack: () => void;
  onNavigateProject: (id: string) => void;
}

export default function ProjectBreakdown({ 
  projectId, 
  onBack, 
  onNavigateProject 
}: ProjectBreakdownProps) {
  const project = PROJECT_DATABASE[projectId] || PROJECT_DATABASE['m1'];
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLDivElement>(null);

  // Scroll to top on load or project change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setIsPlaying(false);
  }, [projectId]);

  // Navigate back or to next/prev
  const currentIndex = PROJECT_KEYS.indexOf(projectId);
  const prevId = PROJECT_KEYS[currentIndex > 0 ? currentIndex - 1 : PROJECT_KEYS.length - 1];
  const nextId = PROJECT_KEYS[currentIndex < PROJECT_KEYS.length - 1 ? currentIndex + 1 : 0];

  const handlePrevProject = () => {
    onNavigateProject(prevId);
  };

  const handleNextProject = () => {
    onNavigateProject(nextId);
  };

  // Smooth play/pause IntersectionObserver: Pauses video gracefully after it is fully off screen for 3 seconds
  useEffect(() => {
    if (!isPlaying) return;

    let pauseTimer: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Entirely out of viewport, start 3-second recovery timer before pausing
          if (!pauseTimer) {
            pauseTimer = setTimeout(() => {
              setIsPlaying(false);
            }, 3000);
          }
        } else {
          // Returned to viewport, cancel timer immediately
          if (pauseTimer) {
            clearTimeout(pauseTimer);
            pauseTimer = null;
          }
        }
      },
      { threshold: 0.0 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
      if (pauseTimer) clearTimeout(pauseTimer);
    };
  }, [isPlaying]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen text-[#ece3db] relative z-40 select-none pb-24 font-sans"
      onContextMenu={(e) => e.preventDefault()} // Block right-click to protect media resources
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 0px, rgba(251, 93, 48, 0.06), transparent 900px),
          linear-gradient(rgba(251, 93, 48, 0.01) 1px, transparent 1px),
          linear-gradient(90deg, rgba(251, 93, 48, 0.01) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 48px 48px, 48px 48px',
        backgroundColor: '#0c0a09',
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif'
      }}
    >
      {/* Top Header Controls Bar */}
      <div className="sticky top-0 z-50 w-full border-b border-[#ece3db]/10 bg-[#0c0a09]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-sm uppercase tracking-widest text-[#ece3db]/70 hover:text-[#fb5d30] transition-colors focus:outline-none cursor-pointer group font-sans font-medium"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Portfolio</span>
          </button>
          
          <div className="flex items-center gap-3" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 relative z-10">
        
        {/* Project Title Block (Not fully in Capital Letters; Sans-Serif font enforced) */}
        <div className="mb-12">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans mb-4"
            style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif' }}
          >
            {project.title}
          </h1>
          <p className="text-[#ece3db]/60 text-sm sm:text-base max-w-2xl font-sans font-medium">
            {project.shortDescription}
          </p>
        </div>

        {/* Video Embedding Area with Playcover - NO scale zoom and NO darken/opacity shift on hover */}
        <div className="mb-24" ref={videoRef}>
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#181412] border border-[#ece3db]/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] cursor-default group"
          >
            {isPlaying ? (
              <iframe
                src={getYouTubeEmbedUrl(project.videoUrl)}
                title={project.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full object-cover z-10 relative select-none pointer-events-auto"
                draggable={false}
              />
            ) : (
              <div 
                className="absolute inset-0 w-full h-full cursor-pointer z-10"
                onClick={() => setIsPlaying(true)}
              >
                <img 
                  src={project.localThumb} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none hover:scale-100 transition-transform duration-0"
                />
                
                {/* Fixed standard light overlay. Absolutely constant bg opacity on hover, strictly no darkening */}
                <div className="absolute inset-0 bg-black/15 transition-none" />
                
                {/* Exact customized YouTube styled play button - no hover zoom */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-10 sm:w-16 sm:h-11 flex items-center justify-center transition-all duration-300">
                    <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 68 48">
                      <path 
                        className="transition-colors duration-300 fill-black/80 group-hover:fill-[#fb5d30]"
                        d="M66.52,7.74c-0.78-2.93-3.09-5.24-6.02-6.02C55.21,1.07,34,1.07,34,1.07s-21.21,0-26.5,0.65C4.57,2.5,2.26,4.81,1.48,7.74 C0.83,13.04,0.83,24,0.83,24s0,10.96,0.65,16.26c0.78,2.93,3.09,5.24,6.02,6.02C12.79,46.93,34,46.93,34,46.93s21.21,0,26.5-0.65 c2.93-0.78,5.24-3.09,6.02-6.02C67.17,34.96,67.17,24,67.17,24S67.17,13.04,66.52,7.74z"
                      />
                      <polygon fill="white" points="27.32,33.02 45.02,24 27.32,14.98" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {/* Transparent click protect overlay */}
            <div className="absolute inset-0 bg-transparent pointer-events-none z-20" />
          </motion.div>
        </div>

        {/* Simplified "How it works" Section - Headings not in raw capitals, Inter/sans-serif enforced, no Heart symbol */}
        <div className="mb-28">
          <div className="text-center md:text-left mb-12">
            <h2 
              className="text-2xl sm:text-3xl font-bold tracking-tight text-[#fb5d30] flex items-center justify-center md:justify-start gap-3 font-sans"
              style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif' }}
            >
              <span className="text-white">How it works</span>
            </h2>
            <p className="text-sm text-[#ece3db]/60 mt-2 tracking-wide font-sans font-medium">
            The essentials—how long it took, what I used, and how many revisions it went through.
            </p>
          </div>



          {/* Precision Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* CARD 1: Duration */}
            <div className="bg-[#140b08]/30 border border-[#ece3db]/10 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fb5d30]/[0.01] rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#fb5d30] tracking-wider font-sans uppercase font-bold">Duration</span>
                <Clock className="w-4 h-4 text-[#fb5d30]/80" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight uppercase font-sans">
                {project.stats.duration}
              </div>
            </div>

            {/* CARD 2: Quality Passes */}
            <div className="bg-[#140b08]/30 border border-[#ece3db]/10 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fb5d30]/[0.01] rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#fb5d30] tracking-wider font-sans uppercase font-bold">Quality Passes</span>
                <Award className="w-4 h-4 text-[#fb5d30]/80" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight uppercase font-sans">
                {project.stats.revisions}
              </div>
            </div>

            {/* CARD 3: Softwares used - Dynamic, highly polished actual icon badge vectors matching the theme */}
            <div className="bg-[#140b08]/30 border border-[#ece3db]/10 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fb5d30]/[0.01] rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] text-[#fb5d30] tracking-wider font-sans uppercase font-bold">Softwares Used</span>
                <Workflow className="w-4 h-4 text-[#fb5d30]/80" />
              </div>
              
              <div className="flex items-center gap-3.5 my-3">
                {/* Adobe Premiere Pro (Pr) */}
                <div className="flex flex-col items-center gap-1 group/pr">
                  <img 
                    src="/Images/Icons/pr.avif" 
                    alt="Premiere Pro" 
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-md object-contain border border-[#ece3db]/10 bg-[#1b120f]/30 p-1"
                  />
                  <span className="text-[8px] font-medium text-[#ece3db]/50 font-sans">Premiere</span>
                </div>

                {/* Adobe After Effects (Ae) */}
                <div className="flex flex-col items-center gap-1 group/ae">
                  <img 
                    src="/Images/Icons/ae.avif" 
                    alt="After Effects" 
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-md object-contain border border-[#ece3db]/10 bg-[#1b120f]/30 p-1"
                  />
                  <span className="text-[8px] font-medium text-[#ece3db]/50 font-sans">After Effects</span>
                </div>

                {/* Adobe Illustrator (Ai) */}
                <div className="flex flex-col items-center gap-1 group/ai">
                  <img 
                    src="/Images/Icons/ai.avif" 
                    alt="Illustrator" 
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-md object-contain border border-[#ece3db]/10 bg-[#1b120f]/30 p-1"
                  />
                  <span className="text-[8px] font-medium text-[#ece3db]/50 font-sans">Illustrator</span>
                </div>
              </div>
            </div>

            {/* CARD 4: Delivery Speed */}
            <div className="bg-[#140b08]/30 border border-[#ece3db]/10 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#fb5d30]/[0.01] rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-[#fb5d30] tracking-wider font-sans uppercase font-bold">Delivery Speed</span>
                <Zap className="w-4 h-4 text-[#fb5d30]/80" />
              </div>
              <div className="text-3xl font-black text-white tracking-tight uppercase font-sans">
                {project.stats.completionTime}
              </div>
            </div>

          </div>
        </div>

        {/* Protection Blueprint Section with exact image aspect ratios (Script 9:16, Storyboard 16:9) */}
        <div className="mb-24 pt-16 border-t border-[#ece3db]/10">
          <div className="text-center md:text-left mb-10">
            <h2 
              className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 font-sans"
              style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, sans-serif' }}
            >
              Workflow
            </h2>
            <p className="text-sm text-[#ece3db]/60 font-sans font-medium max-w-2xl">
              A look at how the idea was planned before moving into animation and editing.
            </p>
          </div>

          {/* Side-by-side secure placeholder blocks - well-structured 2x2 grid so all look identical */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
            
            {/* Placeholder 1: Planning / Script */}
            <div className="flex flex-col gap-3">
              <div 
                className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#110907]/90 border border-[#ece3db]/10 select-none shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-default"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <img 
                  src="/Images/port.avif" 
                  alt="Workflow Step"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none filter brightness-95"
                />
                <div className="absolute inset-0 bg-transparent z-20 pointer-events-auto" />
              </div>
            </div>

            {/* Placeholder 2: Storyboarding */}
            <div className="flex flex-col gap-3">
              <div 
                className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#110907]/90 border border-[#ece3db]/10 select-none shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-default"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <img 
                  src="/Images/port.avif" 
                  alt="Workflow Step"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none filter brightness-95"
                />
                <div className="absolute inset-0 bg-transparent z-20 pointer-events-auto" />
              </div>
            </div>

            {/* Placeholder 3: Assets Used */}
            <div className="flex flex-col gap-3">
              <div 
                className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#110907]/90 border border-[#ece3db]/10 select-none shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-default"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <img 
                  src="/Images/port.avif" 
                  alt="Workflow Step"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none filter brightness-95"
                />
                <div className="absolute inset-0 bg-transparent z-20 pointer-events-auto" />
              </div>
            </div>

            {/* Placeholder 4: Illustrations */}
            <div className="flex flex-col gap-3">
              <div 
                className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#110907]/90 border border-[#ece3db]/10 select-none shadow-[0_20px_40px_rgba(0,0,0,0.4)] cursor-default"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <img 
                  src="/Images/port.avif" 
                  alt="Workflow Step"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none filter brightness-95"
                />
                <div className="absolute inset-0 bg-transparent z-20 pointer-events-auto" />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Navigation Buttons (Inter/sans-serif enforced, no hover scale jumps on buttons) */}
        <div className="border-t border-[#ece3db]/10 pt-16 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          <button 
            onClick={handlePrevProject}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#110907] border border-[#ece3db]/10 hover:border-[#fb5d30]/50 hover:bg-[#18100d] text-[#ece3db] px-8 py-4 rounded-xl text-sm uppercase tracking-widest font-bold transition-all cursor-pointer group font-sans"
          >
            <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1 text-[#fb5d30]" />
            <span>Prev Project</span>
          </button>

          <button 
            onClick={onBack}
            className="text-xs uppercase tracking-widest text-[#ece3db]/50 hover:text-[#fb5d30] transition-colors focus:outline-none cursor-pointer flex items-center gap-1.5 font-sans font-semibold"
          >
            <RotateCcw size={12} />
            <span>Back to Main Index</span>
          </button>

          <button 
            onClick={handleNextProject}
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#110907] border border-[#ece3db]/10 hover:border-[#fb5d30]/50 hover:bg-[#18100d] text-[#ece3db] px-8 py-4 rounded-xl text-sm uppercase tracking-widest font-bold transition-all cursor-pointer group font-sans"
          >
            <span>Next Project</span>
            <ChevronRight size={18} className="transition-transform group-hover:translate-x-1 text-[#fb5d30]" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}
