import React from 'react';
import { motion } from 'motion/react';
import { Instagram, Youtube, Mail, Send, ExternalLink } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Create <span className="text-gradient">Something Epic</span></h2>
            <p className="text-white/60 text-lg mb-12">
              Ready to take your content to the next level? Fill out the form or reach out through social media. I'm always open to new projects and collaborations.
            </p>

            <div className="space-y-6">
              <a href="mailto:contactmeznx@gmail.com" className="glass p-6 rounded-3xl flex items-center gap-6 glass-hover group">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/50 group-hover:text-white transition-colors">
                  <Mail size={24} />
                </div>
                <div>
                  <div className="text-sm text-white/40 uppercase tracking-widest font-bold mb-1">Email Me</div>
                  <div className="text-lg font-medium">contactmeznx@gmail.com</div>
                </div>
              </a>

              <div className="flex gap-4">
                <a href="https://www.instagram.com/theznx/" target="_blank" rel="noopener noreferrer" className="glass flex-1 p-6 rounded-3xl flex items-center gap-4 glass-hover group">
                  <Instagram className="text-white/50 group-hover:text-neon-red transition-colors" />
                  <span className="font-medium">Instagram</span>
                </a>
                <a href="https://www.youtube.com/@Znxreal" target="_blank" rel="noopener noreferrer" className="glass flex-1 p-6 rounded-3xl flex items-center gap-4 glass-hover group">
                  <Youtube className="text-white/50 group-hover:text-neon-red transition-colors" />
                  <span className="font-medium">YouTube</span>
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              type: "spring",
              stiffness: 100,
              damping: 20,
              delay: 0.2
            }}
            className="glass p-8 md:p-12 rounded-[2.5rem] relative flex flex-col items-center justify-center text-center space-y-8 min-h-[400px]"
          >
            <div className="w-20 h-20 bg-neon-red/20 text-neon-red rounded-full flex items-center justify-center">
              <Send size={40} />
            </div>
            
            <div>
              <h3 className="text-3xl font-bold mb-4">Project Inquiry</h3>
              <p className="text-white/50 max-w-sm mx-auto">
                Please fill out the official inquiry form to provide details about your project. This helps me understand your vision and requirements better.
              </p>
            </div>

            <a 
              href="https://forms.gle/K1Ubq5zTfRgogpaC7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group relative px-12 py-5 rounded-2xl bg-gradient-to-r from-neon-red to-black text-white font-bold flex items-center gap-3 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
            >
              Launch Inquiry Form
              <ExternalLink size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
