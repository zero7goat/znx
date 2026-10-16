import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronDown, ChevronUp, ArrowUpRight, Youtube, Linkedin, Instagram } from 'lucide-react';
import Footer from './Footer';
import ShowreelModal from './ShowreelModal';

interface WorksPageProps {
  onBackToHome: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenServices?: () => void;
  onOpenWorks?: () => void;
}

/** Component that flips its children upwards on hover with ultra-smooth cubic-bezier easing */
function FlipBlock({
  children,
  className = "",
  hoverColorClass = ""
}: {
  children: React.ReactNode;
  className?: string;
  hoverColorClass?: string;
}) {
  return (
    <span className={`relative inline-block overflow-hidden h-[1.2em] leading-none align-middle ${className}`}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 whitespace-nowrap will-change-transform">
        <span className="flex items-center gap-1.5 h-[1.2em] leading-none font-semibold">
          {children}
        </span>
        <span className={`flex items-center gap-1.5 h-[1.2em] leading-none font-semibold ${hoverColorClass}`}>
          {children}
        </span>
      </span>
    </span>
  );
}

const WORK_TYPES = [
  'Everything',
  'Websites',
  'UI/UX',
  'Motion & Film',
  'Mobile Apps',
  'Campaigns',
  'Illustration',
  'Digital Experiences',
  'Brand Identity',
];

const WORK_DOMAINS = [
  'Anything',
  'Professional Services',
  'Health',
  'Real Estate',
  'Consumer Brands',
  'Entertainment',
  'SaaS',
  'Technology',
  'Finance',
];

interface WorkItem {
  id: number;
  title: string;
  category: string;
  type: string;
  domain: string;
  src: string;
  fallback: string;
  videoUrl: string;
}

const WORK_IMAGES: WorkItem[] = [
  {
    id: 1,
    title: 'Luella',
    category: 'Brand Identity & Product Design',
    type: 'Brand Identity',
    domain: 'Finance',
    src: '/images/work1.jpg',
    fallback: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 2,
    title: 'Quantum Resilience',
    category: 'Digital Architecture & UI',
    type: 'UI/UX',
    domain: 'Technology',
    src: '/images/work2.jpg',
    fallback: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 3,
    title: 'SoundCloud Worldwide',
    category: 'Global Brand Campaign',
    type: 'Campaigns',
    domain: 'Entertainment',
    src: '/images/work3.jpg',
    fallback: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 4,
    title: 'Spatial Environment',
    category: '3D Motion & Real Estate',
    type: 'Motion & Film',
    domain: 'Real Estate',
    src: '/images/work4.jpg',
    fallback: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 5,
    title: 'MacBook Editorial',
    category: 'Design Systems & Craft',
    type: 'Websites',
    domain: 'Consumer Brands',
    src: '/images/work5.jpg',
    fallback: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 6,
    title: 'Services Hero',
    category: 'Cinematography & Health',
    type: 'Motion & Film',
    domain: 'Health',
    src: '/images/services hero.avif',
    fallback: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 7,
    title: 'Monochrome Editorial',
    category: 'High Fashion & Direction',
    type: 'Brand Identity',
    domain: 'Consumer Brands',
    src: '/images/hero.avif',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 8,
    title: 'Overlay Eye Emblem',
    category: 'Conceptual Illustration',
    type: 'Illustration',
    domain: 'Professional Services',
    src: '/images/eye.avif',
    fallback: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 9,
    title: 'Cursor Motion Lab',
    category: 'Interactive SaaS Experiences',
    type: 'Digital Experiences',
    domain: 'SaaS',
    src: '/images/cursor.avif',
    fallback: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 10,
    title: 'Golden Luxury Card',
    category: 'Fintech & Mobile Apps',
    type: 'Mobile Apps',
    domain: 'Finance',
    src: '/images/work1.jpg',
    fallback: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 11,
    title: 'Telehealth Portal',
    category: 'Health Product Design',
    type: 'Mobile Apps',
    domain: 'Health',
    src: '/images/work2.jpg',
    fallback: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 12,
    title: 'Global Music Culture',
    category: 'Audio Brand Direction',
    type: 'Brand Identity',
    domain: 'Entertainment',
    src: '/images/work3.jpg',
    fallback: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 13,
    title: 'Architectural Rendering',
    category: '3D Spatial Visualization',
    type: 'Digital Experiences',
    domain: 'Real Estate',
    src: '/images/work4.jpg',
    fallback: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 14,
    title: 'Luxury Design System',
    category: 'System Architecture & UI',
    type: 'UI/UX',
    domain: 'SaaS',
    src: '/images/work5.jpg',
    fallback: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 15,
    title: 'Cinematic Lighting',
    category: 'Motion Visuals & Tech',
    type: 'Motion & Film',
    domain: 'Technology',
    src: '/images/services hero.avif',
    fallback: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 16,
    title: 'Minimalist Portfolio',
    category: 'Digital Editorial & Web',
    type: 'Websites',
    domain: 'Professional Services',
    src: '/images/hero.avif',
    fallback: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 17,
    title: 'Consumer Health System',
    category: 'Product Branding & Health',
    type: 'Brand Identity',
    domain: 'Health',
    src: '/images/work1.jpg',
    fallback: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 18,
    title: 'Quantum Enterprise UI',
    category: 'SaaS Architecture & Tech',
    type: 'Websites',
    domain: 'SaaS',
    src: '/images/work2.jpg',
    fallback: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 19,
    title: 'Multimedia Campaign',
    category: 'Creative Direction & Brands',
    type: 'Campaigns',
    domain: 'Consumer Brands',
    src: '/images/work3.jpg',
    fallback: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 20,
    title: 'Real Estate Spatial',
    category: 'Spatial Illustration & Motion',
    type: 'Illustration',
    domain: 'Real Estate',
    src: '/images/work4.jpg',
    fallback: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 21,
    title: 'High-Contrast UI Kit',
    category: 'Craft Systems & Technology',
    type: 'UI/UX',
    domain: 'Technology',
    src: '/images/work5.jpg',
    fallback: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
  {
    id: 22,
    title: 'Healthcare Rebranding',
    category: 'Digital Experiences & Archive',
    type: 'Digital Experiences',
    domain: 'Health',
    src: '/images/services hero.avif',
    fallback: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/mTx4bWhHkB4?autoplay=1&enablejsapi=1&rel=0&modestbranding=1&controls=1',
  },
];

export default function WorksPage({
  onBackToHome,
  onOpenContact,
  onOpenPrivacy,
  onOpenServices,
  onOpenWorks,
}: WorksPageProps) {
  const [selectedType, setSelectedType] = useState('Everything');
  const [selectedDomain, setSelectedDomain] = useState('Anything');
  const [selectedVideo, setSelectedVideo] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });
  
  // Track open dropdown popover: 'none' | 'type' | 'domain'
  const [activeDropdown, setActiveDropdown] = useState<'none' | 'type' | 'domain'>('none');

  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setActiveDropdown('none');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter items
  const filteredWorks = WORK_IMAGES.filter((item) => {
    const matchType =
      selectedType === 'Everything' || item.type.toLowerCase() === selectedType.toLowerCase();
    const matchDomain =
      selectedDomain === 'Anything' || item.domain.toLowerCase() === selectedDomain.toLowerCase();
    return matchType && matchDomain;
  });

  // Fallback if no exact combination
  const displayWorks = filteredWorks.length > 0
    ? filteredWorks
    : WORK_IMAGES.filter(
        (item) =>
          selectedType === 'Everything' ||
          item.type.toLowerCase() === selectedType.toLowerCase() ||
          selectedDomain === 'Anything' ||
          item.domain.toLowerCase() === selectedDomain.toLowerCase()
      );

  const toggleDropdown = (dropdown: 'type' | 'domain') => {
    if (activeDropdown === dropdown) {
      setActiveDropdown('none');
    } else {
      setActiveDropdown(dropdown);
    }
  };

  const isExpanded = activeDropdown !== 'none';

  return (
    <div className="min-h-screen bg-[#070707] text-white font-sans select-none flex flex-col justify-between relative overflow-x-hidden">
      
      {/* 1. TOP HEADER (STAYS AT THE TOP OF THE PAGE, SCROLLS NATURALLY, NO LOGO) */}
      <header className="w-full px-4 sm:px-8 py-6 flex items-center justify-between bg-transparent relative z-40">
        {/* Left: Back Button */}
        <button
          onClick={onBackToHome}
          className="group flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/10 backdrop-blur-md text-white transition-all duration-300 focus:outline-none shadow-sm hover:shadow hover:bg-white hover:text-black cursor-pointer"
          aria-label="Back to Home"
          title="Back to Home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
        </button>

        {/* Center: Empty spacer */}
        <div className="w-10 sm:w-11" />

        {/* Right: Contact CTA matching Home page style */}
        {onOpenContact ? (
          <button
            onClick={onOpenContact}
            className="group flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase py-1 px-1 transition-colors duration-500 text-white hover:text-white/75 cursor-pointer"
          >
            <FlipBlock hoverColorClass="text-white/70">
              <span>LET'S TALK</span>
              <ArrowUpRight className="w-4 h-4" />
            </FlipBlock>
          </button>
        ) : (
          <div className="w-10 sm:w-11" />
        )}
      </header>

      {/* 2. HERO SECTION */}
      <section className="w-full px-4 sm:px-8 pt-8 sm:pt-12 pb-6 sm:pb-8 flex flex-col items-center justify-center text-center relative min-h-[140px] sm:min-h-[180px]">
        
        {/* Dynamic Editorial Headline based on selected Filter with buttery crossfade */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${selectedType}-${selectedDomain}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center"
          >
            {selectedType === 'Everything' && selectedDomain === 'Anything' ? (
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-serif tracking-tight leading-[1.05] text-white font-normal max-w-6xl mx-auto">
                The work beh<span className="font-serif italic font-normal -mx-0.5">i</span>nd
                <br />
                the growth
              </h1>
            ) : (
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-serif tracking-tight leading-[1.05] text-white font-normal capitalize">
                  {selectedType}
                </h1>
                {selectedDomain !== 'Anything' && (
                  <p className="text-3xl sm:text-5xl md:text-6xl font-serif italic text-slate-400 font-normal mt-2">
                    for {selectedDomain}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 3. STICKY FILTER BAR WITH FLOATING POPUP BELOW (NO SHAPE MORPHING, STATIONARY PILL) */}
      <div
        ref={filterRef}
        className="sticky top-6 z-50 w-full flex flex-col items-center justify-start px-2 sm:px-4 mb-6 sm:mb-8 pointer-events-none"
      >
        {/* Fixed Pill Filter Bar - Completely stationary, clean dark background */}
        <div className="pointer-events-auto bg-[#181818] text-[10px] sm:text-xs font-mono-tech tracking-wider uppercase text-slate-300 shadow-2xl shadow-black/90 rounded-full py-2.5 sm:py-3.5 px-4 sm:px-8 flex items-center justify-center gap-2 sm:gap-6 whitespace-nowrap h-10 sm:h-12 outline-none select-none">
          {/* Type Filter Button */}
          <button
            onClick={() => toggleDropdown('type')}
            className={`flex items-center gap-1 sm:gap-2 hover:text-white transition-colors cursor-pointer outline-none focus:outline-none ${
              activeDropdown === 'type' ? 'text-white font-bold' : ''
            }`}
          >
            <span className="text-slate-400 font-normal">
              <span className="hidden sm:inline">TYPE OF WORK</span>
              <span className="sm:hidden">TYPE</span>
            </span>
            <span className="font-bold text-white uppercase">{selectedType}</span>
            {activeDropdown === 'type' ? (
              <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform duration-300" />
            )}
          </button>

          <span className="text-white/20 select-none">|</span>

          {/* Domain Filter Button */}
          <button
            onClick={() => toggleDropdown('domain')}
            className={`flex items-center gap-1 sm:gap-2 hover:text-white transition-colors cursor-pointer outline-none focus:outline-none ${
              activeDropdown === 'domain' ? 'text-white font-bold' : ''
            }`}
          >
            <span className="text-slate-400 font-normal">DOMAIN</span>
            <span className="font-bold text-white uppercase">{selectedDomain}</span>
            {activeDropdown === 'domain' ? (
              <ChevronUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white transition-transform duration-300" />
            ) : (
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 transition-transform duration-300" />
            )}
          </button>
        </div>

        {/* Floating Pop-Up Panel Directly Below Filter Bar - Glitch-Free Dark Panel */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto absolute top-14 w-[92vw] max-w-lg bg-[#181818] text-xs sm:text-sm font-mono-tech tracking-wider uppercase text-slate-300 rounded-2xl p-4 sm:p-5 shadow-2xl shadow-black/90 border border-white/10 outline-none ring-0 flex flex-col items-center gap-3 select-none overflow-hidden"
            >
              <div className="text-[10px] sm:text-xs text-slate-400/70 font-mono-tech tracking-widest uppercase mb-0.5">
                SELECT {activeDropdown === 'type' ? 'TYPE OF WORK' : 'DOMAIN'}
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={activeDropdown}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 px-2"
                >
                  {activeDropdown === 'type'
                    ? WORK_TYPES.map((type) => {
                        const isSelected = selectedType.toLowerCase() === type.toLowerCase();
                        return (
                          <button
                            key={type}
                            onClick={() => {
                              setSelectedType(type);
                              setActiveDropdown('none');
                            }}
                            className={`text-base sm:text-lg font-serif tracking-tight transition-all duration-300 cursor-pointer outline-none focus:outline-none border-0 ${
                              isSelected
                                ? 'text-white font-medium scale-105'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })
                    : WORK_DOMAINS.map((domain) => {
                        const isSelected = selectedDomain.toLowerCase() === domain.toLowerCase();
                        return (
                          <button
                            key={domain}
                            onClick={() => {
                              setSelectedDomain(domain);
                              setActiveDropdown('none');
                            }}
                            className={`text-base sm:text-lg font-serif tracking-tight transition-all duration-300 cursor-pointer outline-none focus:outline-none border-0 ${
                              isSelected
                                ? 'text-white font-medium scale-105'
                                : 'text-slate-400 hover:text-white'
                            }`}
                          >
                            {domain}
                          </button>
                        );
                      })}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 4. MAX-WIDTH FULL-BLEED GRID (NO FRAMES, ULTRA-WIDE IMAGES, TIGHTEST GAPS, HOVER COMPRESSION) */}
      <main className="w-full max-w-[1920px] mx-auto px-1 sm:px-2 md:px-3 pb-20 sm:pb-32 flex-1">
        
        {/* Results Counter if filtering */}
        {(selectedType !== 'Everything' || selectedDomain !== 'Anything') && (
          <div className="mb-4 text-center text-xs font-mono-tech tracking-widest text-slate-400 uppercase">
            SHOWING {displayWorks.length} WORKS FOR {selectedType.toUpperCase()}{' '}
            {selectedDomain !== 'Anything' ? `• ${selectedDomain.toUpperCase()}` : ''}
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5">
          <AnimatePresence mode="popLayout">
            {displayWorks.map((item, idx) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.15 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.75,
                  ease: [0.16, 1, 0.3, 1],
                  delay: (idx % 2) * 0.05,
                }}
                onClick={() => {
                  setSelectedVideo({
                    isOpen: true,
                    url: item.videoUrl,
                    title: item.title,
                  });
                }}
                className="relative group cursor-pointer w-full aspect-[16/10] sm:aspect-[16/10.2]"
              >
                {/* Image Container (Smoothly crops bottom edge without zooming or scaling the image) */}
                <div className="relative w-full h-full overflow-hidden rounded-md sm:rounded-lg bg-[#111] transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_2.25rem_0)] sm:group-hover:[clip-path:inset(0_0_2.5rem_0)]">
                  <img
                    src={item.src}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = item.fallback;
                    }}
                    className="w-full h-full object-cover object-center pointer-events-none select-none"
                  />

                  {/* White Play Button Overlay - Matching Showreel button styling */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none z-10">
                    <div className="transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-110">
                      <svg 
                        className="w-9 h-9 sm:w-11 sm:h-11 fill-white stroke-white" 
                        viewBox="0 0 24 24"
                        strokeWidth="3.5"
                        strokeLinejoin="round"
                      >
                        <path d="M8 5.5v13l10-6.5z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Bottom Info Bar Revealed Beneath Compressed Image (Title on Left, Category on Right) */}
                <div className="absolute bottom-0 inset-x-0 h-9 sm:h-10 flex items-center justify-between px-1.5 pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100">
                  <h3 className="text-sm sm:text-base md:text-lg font-sans font-semibold text-white tracking-tight">
                    {item.title}
                  </h3>
                  <span className="text-xs sm:text-sm font-sans text-slate-400 font-normal">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* 5. CTA BANNER SECTION */}
      <section className="w-full px-4 sm:px-8 pt-16 sm:pt-24 pb-12 sm:pb-16 max-w-[1700px] mx-auto">
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] bg-[#0c0c0c] overflow-hidden p-8 sm:p-12 md:p-16 min-h-[420px] sm:min-h-[480px] flex flex-col justify-between shadow-md shadow-black/20 group">
          {/* Grassy / Atmospheric Landscape Background Image on right */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80"
              alt="Landscape background"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-right sm:object-center opacity-35 mix-blend-luminosity"
            />
            {/* Gradient Overlay for seamless dark contrast on text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0c0c0c] via-[#0c0c0c]/80 to-transparent sm:w-3/4" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-[#0c0c0c]/40" />
          </div>

          {/* Top & Main Content */}
          <div className="relative z-10 flex flex-col items-start max-w-3xl">
            {/* Headline */}
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-serif text-white font-normal leading-[1.08] tracking-tight mb-8 sm:mb-10">
              Got a great idea you want to bring to life?
            </h2>

            {/* CTA Button */}
            <button
              onClick={onOpenContact}
              className="inline-flex items-center gap-2.5 bg-white hover:bg-slate-100 text-black font-sans font-semibold px-7 py-4 rounded-full text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] cursor-pointer group/btn shadow-md shadow-black/20"
            >
              <span>Book a call</span>
              <ArrowUpRight className="w-4 h-4 text-black group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
            </button>
          </div>

          {/* Bottom Social Links Bar */}
          <div className="relative z-10 border-t border-white/10 pt-6 sm:pt-8 mt-12 sm:mt-16 flex flex-row sm:grid sm:grid-cols-3 gap-6 sm:gap-4 text-xs font-mono-tech tracking-widest uppercase text-slate-300">
            <a
              href="https://youtube.com/@znxstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer w-fit"
            >
              <Youtube className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span className="hidden sm:inline">YOUTUBE</span>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer w-fit"
            >
              <Linkedin className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span className="hidden sm:inline">LINKEDIN</span>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer w-fit"
            >
              <Instagram className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400" />
              <span className="hidden sm:inline">INSTAGRAM</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenServices={onOpenServices}
        onOpenWorks={onOpenWorks}
        onNavigateToHome={onBackToHome}
      />

      {/* Video Modal Player */}
      <ShowreelModal
        isOpen={selectedVideo.isOpen}
        onClose={() => setSelectedVideo((prev) => ({ ...prev, isOpen: false }))}
        videoUrl={selectedVideo.url}
        title={selectedVideo.title}
      />
    </div>
  );
}
