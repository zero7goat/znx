import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Youtube, Instagram, Mail } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Long Form', href: '#portfolio' },
  { name: 'Shorts', href: '#shorts' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: 'https://docs.google.com/forms/d/e/1FAIpQLSceJcC2G-DQ-h49F8xHImwfiD6JIgrORblfpbKqknZgOnMTSw/viewform?usp=header', isExternal: true },
  { name: 'Resume', href: '/Images/RESUME.avif', download: 'SUYOG_BC_Resume.avif' },
];

interface NavbarProps {
  onOpenResume: () => void;
  onSectionNavigate?: (targetId: string) => void;
}

export default function Navbar({ onOpenResume, onSectionNavigate }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: typeof navLinks[0]) => {
    if (link.name === 'Resume') {
      e.preventDefault();
      onOpenResume();
    } else if (link.href && link.href.startsWith('#')) {
      e.preventDefault();
      const targetId = link.href.slice(1);
      if (onSectionNavigate) {
        onSectionNavigate(targetId);
      } else {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out transform-gpu gpu-accel will-change-[padding,transform] ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between transition-all duration-500 ease-out transform-gpu backdrop-blur-3xl border border-[#ece3db]/15 bg-[#140b08]/85 shadow-[0_20px_40px_rgba(0,0,0,0.5)] relative"
        >
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              if (onSectionNavigate) {
                onSectionNavigate('home');
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className="text-xl sm:text-2xl font-black tracking-[0.14em] hover:opacity-85 transition-all text-white font-sans uppercase flex-shrink-0"
          >
            ZNX<span className="text-[#fb5d30]">.</span>
          </a>

          {/* Desktop Nav Link Items - Ultra-responsive font & gaps to prevent any cut off */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 flex-shrink-0">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                target={link.isExternal ? '_blank' : undefined}
                rel={link.isExternal ? 'noopener noreferrer' : undefined}
                className="text-[9px] xl:text-[10px] uppercase tracking-[0.15em] xl:tracking-[0.25em] font-black text-[#ece3db]/75 hover:text-white transition-all duration-300 relative group whitespace-nowrap"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 right-0 h-[1.5px] bg-[#fb5d30] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </a>
            ))}
          </div>

          <div className="flex items-center">
            {/* Mobile Nav Menu Button - Sleek toggle layout */}
            <button 
              className="text-[#ece3db]/70 p-2 hover:text-white transition-all lg:hidden cursor-pointer rounded-full border border-[#ece3db]/10 hover:border-white/20 bg-black/20 active:scale-90"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} className="text-[#fb5d30]" /> : <Menu size={20} />}
            </button>
          </div>

          {/* Elegant Floating Dropdown Menu attached below pill */}
          <AnimatePresence>
            {isOpen && (
              <>
                {/* Overlay backdrop inside container bounds */}
                <div 
                  className="fixed inset-0 bg-transparent z-40 lg:hidden"
                  onClick={() => setIsOpen(false)}
                />
                
                <motion.div
                  initial={{ opacity: 0, y: -12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute top-[125%] left-0 right-0 bg-[#0c0a09]/98 backdrop-blur-3xl border border-[#ece3db]/15 rounded-3xl p-5 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col gap-1 lg:hidden z-50 origin-top"
                >
                  {navLinks.map((link, index) => (
                    <motion.a 
                      key={link.name}
                      href={link.href}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      onClick={(e) => handleLinkClick(e, link)}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      className="text-xs font-black uppercase tracking-[0.15em] text-[#ece3db]/80 hover:text-white hover:bg-white/[0.04] py-3 px-4 rounded-2xl transition-all duration-200 block text-center border-b border-white/[0.02] last:border-0"
                    >
                      {link.name}
                    </motion.a>
                  ))}

                  {/* Dropdown footer with social links */}
                  <div className="pt-4 mt-2 border-t border-[#ece3db]/10 flex flex-col items-center gap-3">
                    <div className="flex gap-4">
                      <a 
                        href="https://www.instagram.com/theznx/" 
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#ece3db]/70 hover:text-white transition-colors"
                      >
                        <Instagram size={16} />
                      </a>
                      <a 
                        href="https://www.youtube.com/@znxshowreels" 
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#ece3db]/70 hover:text-white transition-colors"
                      >
                        <Youtube size={16} />
                      </a>
                      <a 
                        href="mailto:contactmeznx@gmail.com" 
                        className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-[#ece3db]/70 hover:text-white transition-colors"
                      >
                        <Mail size={16} />
                      </a>
                    </div>
                    <div className="text-[8px] font-mono tracking-widest text-[#ece3db]/30 uppercase">
                      © 2026 ZNX CREATIVE
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
