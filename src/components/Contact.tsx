import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Youtube, Mail, Send, ExternalLink } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="gpu-accel">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.23, 1, 0.32, 1] }}
              className="text-4xl sm:text-5xl md:text-[72px] font-black mb-8 leading-[1.2] tracking-tighter uppercase overflow-visible"
            >
              LET'S CRAFT <br /><span className="text-gradient">THE VISION.</span>
            </motion.h2>
            <p className="text-base text-white/30 mb-12 max-w-md leading-relaxed font-medium uppercase tracking-widest text-[11px]">
              Ready to elevate your digital presence? reach out for high-end cinematic collaborations.
            </p>

            <div className="space-y-6">
              <a href="mailto:contactmeznx@gmail.com" className="glass-card p-8 rounded-[2rem] flex items-center gap-6 group hover:translate-y-[-4px]">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center text-white/40 group-hover:bg-white/[0.08] group-hover:text-white transition-all duration-700 ease-[0.23,1,0.32,1]">
                  <Mail size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="text-[10px] text-white/30 uppercase tracking-[0.2em] font-bold mb-1">Direct Message</div>
                  <div className="text-lg font-semibold text-white/80">contactmeznx@gmail.com</div>
                </div>
              </a>

              <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                <a href="https://www.instagram.com/theznx/" target="_blank" rel="noopener noreferrer" className="glass-card flex-1 p-6 md:p-8 rounded-[2rem] flex items-center justify-center sm:justify-start gap-4 group">
                  <Instagram size={20} className="text-white/40 group-hover:text-apple-gold transition-all duration-500" />
                  <span className="font-bold text-sm text-white/40 group-hover:text-white transition-all duration-500">Instagram</span>
                </a>
                <a href="https://www.youtube.com/@znxshowreels" target="_blank" rel="noopener noreferrer" className="glass-card flex-1 p-6 md:p-8 rounded-[2rem] flex items-center justify-center sm:justify-start gap-4 group">
                  <Youtube size={20} className="text-white/40 group-hover:text-apple-gold transition-all duration-500" />
                  <span className="font-bold text-sm text-white/40 group-hover:text-white transition-all duration-500">YouTube</span>
                </a>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 1,
              ease: [0.23, 1, 0.32, 1],
              delay: 0.2
            }}
            className="glass-card p-8 md:p-16 rounded-[3rem] relative flex flex-col items-center justify-center text-center space-y-8 md:space-y-10 min-h-[400px] md:min-h-[450px] gpu-accel will-change-transform"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-apple-gold/10 text-apple-gold rounded-full flex items-center justify-center border border-apple-gold/20">
              <Send className="w-10 h-10 md:w-11 md:h-11" strokeWidth={1.5} />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">Project Inquiry</h3>
              <p className="text-[15px] md:text-base text-white/30 max-w-xs mx-auto leading-relaxed font-medium px-4 md:px-0">
                Provide the essential details about your project. I usually respond within 24 hours.
              </p>
            </div>

            <a 
              href="https://forms.gle/K1Ubq5zTfRgogpaC7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 rounded-2xl bg-white text-black text-sm font-bold flex items-center justify-center gap-3 hover:opacity-85 transition-all duration-500 shadow-2xl shadow-white/5 active:scale-[0.98]"
            >
              Launch Inquiry Form
              <ExternalLink size={18} strokeWidth={2.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <div className="pt-4 text-xs text-white/30 uppercase tracking-widest font-bold">
              Secure Google Form Integration
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
