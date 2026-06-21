import { motion } from 'motion/react';
import React from 'react';
import Ticker from './Ticker';

const stats = [
  { label: 'YEARS OF EXPERIENCE', value: '4+' },
  { label: 'COMPLETED PROJECTS', value: '50+' },
  { label: 'HAPPY CLIENTS', value: '20+' },
];

interface AboutProps {
  onOpenResume?: () => void;
}

export default function About({ onOpenResume }: AboutProps) {
  return (
    <section id="about" className="pt-24 pb-16 md:pt-32 md:pb-20 relative overflow-hidden bg-black text-[#ece3db] scroll-mt-24">
      {/* Editorial Vertical Grid Lines in the background */}
      <div className="absolute inset-0 grid grid-cols-6 sm:grid-cols-12 pointer-events-none opacity-20 z-0">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="border-r border-stone-900 h-full w-full" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Heading */}
          <div className="lg:col-span-4">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter text-white uppercase select-none"
            >
              About Me
            </motion.h2>
          </div>

          {/* Right Column: Bio Content and Stats */}
          <div className="lg:col-span-8 space-y-12 sm:space-y-16">
            
            {/* Bio Paragraphs */}
            <div className="space-y-6 md:space-y-8">
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-xl sm:text-2xl md:text-3xl font-light text-stone-200 leading-snug sm:leading-normal"
              >
                As a passionate <span className="font-extrabold text-white text-gradient">motion designer</span> and storyteller, I focus on creating impactful visual narratives shaped by creativity, technology, and precision.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-base text-stone-400 font-medium leading-relaxed max-w-3xl"
              >
                My mission is to craft stories that move people and elevate brands. Every project is an opportunity to push creative boundaries. Whether it's a commercial, digital campaign, or motion design piece, I bring energy, precision, and a relentless focus on delivering exceptional results.
              </motion.p>
            </div>

            {/* Stats Showcase exactly matching the overlap reference design */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10 border-t border-stone-900">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center md:items-start text-center md:text-left select-none relative group"
                >
                  {/* Reduced in size, rendered entirely in White with a premium pulse/breath animation */}
                  <div className="mb-3 select-none">
                    <motion.div
                      animate={{
                        scale: [1, 1.04, 1],
                        textShadow: [
                          "0 0 0px rgba(255,255,255,0)",
                          "0 0 16px rgba(255,255,255,0.35)",
                          "0 0 0px rgba(255,255,255,0)"
                        ]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.4
                      }}
                      className="text-4xl sm:text-5xl md:text-6xl font-black font-display text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-colors"
                    >
                      {stat.value}
                    </motion.div>
                  </div>

                  {/* High contrast, scannable structural subtitle label underneath */}
                  <div className="text-[10px] sm:text-[11px] font-black tracking-[0.2em] text-[#ece3db]/65 group-hover:text-[#fb5d30] transition-colors uppercase select-none">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Optional Resume Button aligned with the reference styling */}
            {onOpenResume && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.6 }}
                className="pt-4 flex justify-start"
              >
                <button
                  onClick={onOpenResume}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white transition-all text-xs font-black uppercase tracking-[0.2em] cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
                  Get Resume
                </button>
              </motion.div>
            )}

          </div>

        </div>
      </div>

      {/* Infinite Seamless Horizontal Ticker inserted right into the same background flow */}
      <div className="relative z-10 w-full border-t border-stone-900/45 pt-4">
        <Ticker />
      </div>
    </section>
  );
}
