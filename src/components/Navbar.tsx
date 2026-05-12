import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Youtube, Instagram, Mail } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Portfolio', href: '#portfolio' },
  { name: 'Process', href: '#process' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu gpu-accel will-change-[padding,transform] ${
        scrolled ? 'py-4' : 'py-8'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className={`rounded-full px-8 py-3 flex items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-gpu backdrop-blur-2xl border shadow-2xl ${
          scrolled ? 'bg-black/40 border-white/20 shadow-black/20' : 'bg-black/20 border-white/10'
        }`}>
          <a href="#home" className="text-2xl font-black tracking-tighter hover:opacity-70 transition-all font-display group">
            ZNX<span className="text-apple-gold opacity-0 group-hover:opacity-100 transition-opacity">.</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.2em] font-bold text-white/40 hover:text-white transition-all duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <a href="https://www.instagram.com/theznx/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all duration-500">
              <Instagram size={18} strokeWidth={1.5} />
            </a>
            <a href="https://www.youtube.com/@znxshowreels" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-all duration-500">
              <Youtube size={18} strokeWidth={1.5} />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white/70 p-1 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
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
            className="fixed inset-0 z-[60] flex items-center justify-center p-6 md:hidden pointer-events-auto transform-gpu gpu-accel"
          >
            {/* Backdrop Blur */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-2xl"
              onClick={() => setIsOpen(false)}
            />
            
            <div className="glass-card w-full max-w-xs p-10 rounded-[3rem] flex flex-col items-center gap-10 relative z-10 border-white/10">
              <div className="flex flex-col items-center gap-6">
                {navLinks.map((link, index) => (
                  <motion.a 
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="text-2xl font-bold text-white/50 hover:text-white transition-all duration-300 tracking-tight"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              <div className="w-full h-px bg-white/5" />

              <div className="flex items-center gap-8">
                <motion.a 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                  href="https://www.instagram.com/theznx/" 
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/50 hover:text-apple-gold transition-all duration-500"
                >
                  <Instagram size={24} />
                </motion.a>
                <motion.a 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  href="https://www.youtube.com/@znxshowreels" 
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/50 hover:text-apple-gold transition-all duration-500"
                >
                  <Youtube size={24} />
                </motion.a>
                <motion.a 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  href="mailto:contactmeznx@gmail.com" 
                  className="w-12 h-12 rounded-2xl glass flex items-center justify-center text-white/50 hover:text-apple-gold transition-all duration-500"
                >
                  <Mail size={24} />
                </motion.a>
              </div>

              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors"
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
