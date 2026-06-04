import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Youtube, Instagram, Mail, Sun, Moon } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Long Form', href: '#portfolio' },
  { name: 'Shorts', href: '#shorts' },
  { name: 'About', href: '#about' },
  { name: 'Process', href: '#process' },
  { name: 'Contact', href: '#contact' },
  { name: 'Resume', href: '/Images/RESUME.avif', download: 'SUYOG_BC_Resume.avif' },
];

interface NavbarProps {
  onOpenResume: () => void;
}

export default function Navbar({ onOpenResume }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, name: string) => {
    if (name === 'Resume') {
      e.preventDefault();
      onOpenResume();
    }
    setIsOpen(false);
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu gpu-accel will-change-[padding,transform] ${
        scrolled ? 'py-4' : 'py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div 
          className="rounded-full px-6 sm:px-8 py-2.5 sm:py-3.5 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu backdrop-blur-3xl border border-[#ece3db]/10 bg-[#321d15]/50 shadow-[0_15px_35px_rgba(26,13,8,0.35)]"
        >
          <a href="#home" className="text-xl sm:text-2xl font-black tracking-[0.14em] hover:opacity-85 transition-all text-white font-sans uppercase">
            ZNX<span className="text-[#ece3db]">.</span>
          </a>

          {/* Desktop Nav Link Items */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.filter(l => l.name !== 'Contact').map((link) => (
              <a 
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.name)}
                className="text-[10px] uppercase tracking-[0.25em] font-black text-[#ece3db]/70 hover:text-white transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-[-4px] left-0 right-0 h-[1.5px] bg-[#fb5d30] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#contact"
              className="bg-white text-black font-extrabold text-[11px] sm:text-[12px] px-6 sm:px-8 py-2 sm:py-2.5 rounded-full hover:bg-[#ece3db] active:scale-95 transition-all shadow-[0_10px_25px_rgba(255,255,255,0.08)] tracking-wider"
            >
              Contact
            </a>

            {/* Mobile Nav Menu Button */}
            <button 
              className="text-[#ece3db]/70 p-1 hover:text-white transition-colors lg:hidden"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 lg:hidden pointer-events-auto transform-gpu gpu-accel"
          >
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-3xl"
              onClick={() => setIsOpen(false)}
            />
            
            <div 
              className="bg-[#241510]/95 w-full max-w-xs p-10 rounded-[3rem] flex flex-col items-center gap-10 relative z-10 border border-[#ece3db]/10 shadow-2xl"
            >
              <div className="flex flex-col items-center gap-6">
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-xl font-bold text-[#ece3db]/75 hover:text-white transition-all duration-300 tracking-wider"
                    onClick={(e) => handleLinkClick(e, link.name)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="w-full h-px bg-[#ece3db]/10" />

              <div className="flex items-center gap-8">
                <motion.a 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  href="https://www.instagram.com/theznx/" 
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ece3db]/70 hover:text-white transition-all duration-500"
                >
                  <Instagram size={22} />
                </motion.a>
                <motion.a 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  href="https://www.youtube.com/@znxshowreels" 
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ece3db]/70 hover:text-white transition-all duration-500"
                >
                  <Youtube size={22} />
                </motion.a>
                <motion.a 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  href="mailto:contactmeznx@gmail.com" 
                  className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#ece3db]/70 hover:text-white transition-all duration-500"
                >
                  <Mail size={22} />
                </motion.a>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
