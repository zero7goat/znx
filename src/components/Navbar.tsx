import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, X, ArrowRight } from 'lucide-react';
import { NavTab } from '../types';
import { smoothScrollToElement } from '../utils/smoothScroll';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenContact: () => void;
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
        <span className="flex items-center gap-1.5 h-[1.2em] leading-none">
          {children}
        </span>
        <span className={`flex items-center gap-1.5 h-[1.2em] leading-none ${hoverColorClass}`}>
          {children}
        </span>
      </span>
    </span>
  );
}

// Mobile drawer motion: unhurried but still responsive (~0.55s open, ~0.45s close)
const DRAWER_EASE = [0.22, 1, 0.36, 1] as const;
const mobileDrawerVariants = {
  closed: {
    y: '-100%',
    transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] as const, staggerChildren: 0.02, staggerDirection: -1 },
  },
  open: {
    y: 0,
    transition: { duration: 0.55, ease: DRAWER_EASE, delayChildren: 0.15, staggerChildren: 0.05 },
  },
};
const mobileItemVariants = {
  closed: { opacity: 0, y: -10, transition: { duration: 0.18, ease: 'easeIn' as const } },
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: DRAWER_EASE } },
};

export default function Navbar({ activeTab, onSelectTab, onOpenContact }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 220;
      if (window.scrollY > scrollThreshold) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Escape closes whichever menu is open; the mobile sheet also locks page scroll
  useEffect(() => {
    if (!isOpen && !isMobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.documentElement.style.overflow;
    if (isMobileMenuOpen) document.documentElement.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [isOpen, isMobileMenuOpen]);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const tabs: { id: NavTab; label: string }[] = [
    { id: 'work', label: 'WORKS' },
    { id: 'services', label: 'SERVICES' },
    { id: 'about', label: 'ABOUT' },
  ];

  const handleTabClick = (tabId: NavTab) => {
    setIsOpen(false);
    setIsMobileMenuOpen(false);
    onSelectTab(tabId);
  };

  const navMode = !isScrolled ? 'hero' : !isOpen ? 'circle' : 'expanded';

  return (
    <>
      {/* MOBILE CIRCULAR TOGGLE BUTTON: the three lines morph into an X (CSS transforms) */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] sm:hidden pointer-events-auto select-none">
        <button
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen}
          style={{ touchAction: 'manipulation' }}
          className="relative w-12 h-12 rounded-full bg-black/95 text-white border border-white/20 cursor-pointer shadow-lg shadow-black/60 active:scale-90 transition-transform duration-200"
        >
          <span
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 h-[1.5px] w-5 -ml-2.5 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isMobileMenuOpen ? 'translate-y-0 rotate-45' : '-translate-y-[6px]'
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 h-[1.5px] w-3.5 -ml-[7px] rounded-full bg-white transition-[opacity,transform] duration-300 ease-out ${
              isMobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100'
            }`}
          />
          <span
            aria-hidden="true"
            className={`absolute left-1/2 top-1/2 h-[1.5px] w-5 -ml-2.5 rounded-full bg-white transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              isMobileMenuOpen ? 'translate-y-0 -rotate-45' : 'translate-y-[6px]'
            }`}
          />
        </button>
      </div>

      {/* MOBILE DRAWER & BACKDROP: panel slides down, then its rows fade in with a short stagger;
          closing reverses (rows out first, then the panel). Transform/opacity only. */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop (solid dim, no blur) */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } }}
              exit={{ opacity: 0, transition: { duration: 0.4, ease: 'easeIn', delay: 0.05 } }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/75 sm:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-drawer"
              variants={mobileDrawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 left-0 right-0 w-full z-[95] bg-[#0c0c0c] text-white flex flex-col p-5 rounded-none border-b border-white/10 shadow-2xl sm:hidden select-none"
            >
              {/* Top Header inside Popup (White ZNX Logo Image) */}
              <motion.div variants={mobileItemVariants} className="flex items-center justify-between border-b border-white/10 pb-3">
                <img
                  src="/Logo.png"
                  alt="ZNX Studio Logo"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.endsWith('/Logo.png')) {
                      target.src = '/images/Logo.png';
                    } else if (target.src.endsWith('/images/Logo.png')) {
                      target.src = '/Logo.avif';
                    } else if (target.src.endsWith('/images/Logo.avif')) {
                      target.src = '/images/Logo.avif';
                    }
                  }}
                  className="h-5 w-auto object-contain brightness-0 invert"
                />
                <span className="text-[9px] font-mono-tech text-neutral-400 uppercase tracking-[0.2em]">
                  MENU
                </span>
              </motion.div>

              {/* Navigation Options List */}
              <div className="flex flex-col gap-2 py-4">
                {tabs.map((tab, idx) => (
                  <motion.button
                    key={tab.id}
                    variants={mobileItemVariants}
                    onClick={() => handleTabClick(tab.id)}
                    style={{ touchAction: 'manipulation' }}
                    className="text-left text-base font-sans font-semibold tracking-wide text-neutral-200 hover:text-white uppercase flex items-center justify-between border-b border-white/[0.04] py-2 transition-colors active:text-white"
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] font-mono-tech text-neutral-500 font-normal">
                      0{idx + 1}
                    </span>
                  </motion.button>
                ))}

                <motion.a
                  variants={mobileItemVariants}
                  href="#/privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsMobileMenuOpen(false);
                    window.location.hash = '#/privacy';
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className="text-left text-xs font-sans font-medium tracking-wider text-neutral-400 hover:text-white uppercase py-2 transition-colors"
                >
                  PRIVACY POLICY
                </motion.a>
              </div>

              {/* Bottom Actions & Contact */}
              <motion.div variants={mobileItemVariants} className="flex flex-col gap-3 pt-3 border-t border-white/10">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenContact();
                  }}
                  style={{ touchAction: 'manipulation' }}
                  className="znx-btn znx-btn-primary w-full"
                >
                  <span>LET'S TALK</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <div className="flex justify-between items-center text-[9px] font-mono-tech text-neutral-400 uppercase tracking-widest px-0.5">
                  <span>INQUIRIES</span>
                  <a href="mailto:contactmeznx@gmail.com" className="text-neutral-200 underline underline-offset-2">
                    contactmeznx@gmail.com
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP FLOATING NAVBAR (sm:flex) */}
      <header className="hidden sm:block fixed top-6 sm:top-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
        <div ref={navRef} className="relative flex items-center justify-center">
          <motion.nav
            layout
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1]
            }}
            onClick={() => {
              if (navMode === 'circle') {
                setIsOpen(true);
              }
            }}
            // In circle mode the whole pill acts as the "open menu" button (keyboard too)
            role={navMode === 'circle' ? 'button' : undefined}
            tabIndex={navMode === 'circle' ? 0 : undefined}
            aria-label={navMode === 'circle' ? 'Open navigation menu' : undefined}
            onKeyDown={(e) => {
              if (navMode === 'circle' && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                setIsOpen(true);
              }
            }}
            className={`relative bg-black/90 text-white rounded-full shadow-md shadow-black/30 border border-white/10 flex items-center justify-center overflow-hidden ${
              navMode === 'circle'
                ? 'w-12 h-12 p-0 cursor-pointer'
                : 'px-6 py-2.5 sm:px-8 sm:py-3 h-12'
            }`}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {navMode === 'circle' ? (
                /* Circle Mode: 3 horizontal lines */
                <motion.div
                  key="circle-mode"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center justify-center gap-1.5 w-full h-full"
                  aria-label="Open Navigation Menu"
                >
                  <span className="w-5 h-[1.5px] bg-white rounded-full" />
                  <span className="w-3.5 h-[1.5px] bg-white rounded-full" />
                  <span className="w-5 h-[1.5px] bg-white rounded-full" />
                </motion.div>
              ) : navMode === 'hero' ? (
                /* Hero Mode: WORK, SERVICES, ABOUT */
                <motion.div
                  key="hero-mode"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-6 sm:gap-8 whitespace-nowrap"
                >
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabClick(tab.id);
                        }}
                        className={`group relative text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 py-1 ${
                          isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <FlipBlock hoverColorClass="text-white font-bold">{tab.label}</FlipBlock>
                      </button>
                    );
                  })}
                </motion.div>
              ) : (
                /* Expanded Mode: WORK, SERVICES, ABOUT, LET'S TALK, CLOSE */
                <motion.div
                  key="expanded-mode"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-6 sm:gap-8 whitespace-nowrap"
                >
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabClick(tab.id);
                        }}
                        className={`group relative text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 py-1 ${
                          isActive ? 'text-white font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        <FlipBlock hoverColorClass="text-white font-bold">{tab.label}</FlipBlock>
                      </button>
                    );
                  })}

                  <div className="w-[1px] h-4 bg-white/20" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                      onOpenContact();
                    }}
                    className="group flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase py-1 text-white hover:text-neutral-300 transition-colors"
                  >
                    <FlipBlock hoverColorClass="text-neutral-300">
                      <span>LET'S TALK</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </FlipBlock>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsOpen(false);
                    }}
                    className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </div>
      </header>
    </>
  );
}
