import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Cpu } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

const stats = [
  { label: 'Projects Done', value: 53, suffix: '+' },
  { label: 'Happy Clients', value: 15, suffix: '+' },
  { label: 'Years Exp', value: 4, suffix: '+' },
];

const tools = [
  'After Effects', 'Premiere Pro', 'Photoshop', 'Davinci Resolve', 'Cinema 4D'
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.5 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        const nextVal = Math.floor(start);
        setCount(prev => prev === nextVal ? prev : nextVal);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [hasStarted, value]);

  return <div ref={countRef}>{count}{suffix}</div>;
}

export default function About() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section id="about" className="pt-[165px] pb-32 relative scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center pt-0">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-12 text-center lg:text-left order-2 lg:order-1"
          >
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-black mb-6 overflow-visible leading-[1.2]"
              >
                The Art of <span className="text-gradient">ZNX</span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-white/40 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              >
                I'm Suyog BC, a passionate video editor and motion designer dedicated to pushing the boundaries of visual storytelling. With over 4 years of experience, I specialize in high-end cinematic edits.
              </motion.p>
              
              <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-lg mx-auto lg:mx-0">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + (index * 0.1) }}
                    className="glass-card p-3 md:p-5 rounded-3xl text-center"
                  >
                    <div className="text-lg md:text-2xl font-bold text-white/90">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[7px] md:text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="glass-card p-8 md:p-10 rounded-[2.5rem] space-y-6 text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-apple-gold/10 flex items-center justify-center text-apple-gold">
                <Cpu size={28} />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Tools & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {tools.map((tool, index) => (
                   <motion.span 
                     key={tool}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: 0.8 + (index * 0.05), duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                     className="text-[9px] px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/50 font-black uppercase tracking-[0.2em] hover:bg-white/[0.08] hover:text-white transition-all cursor-default"
                   >
                     {tool}
                   </motion.span>
                 ))}
              </div>
              <p className="text-sm text-white/30 leading-relaxed font-medium pt-2">
                Specializing in high-octane cinematic storytelling, dynamic motion design, and immersive sound architecture using industry-standard tools.
              </p>
            </motion.div>
          </motion.div>

          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
              className="relative flex flex-col items-center group perspective-2000"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Entire ID Assembly with Physics swing */}
              <motion.div
                style={{ 
                  originY: "0%", 
                  rotateX: isMobile ? 0 : rotateX,
                  rotateY: isMobile ? 0 : rotateY,
                }}
                animate={{ 
                  rotate: isMobile ? 0 : [-1.5, 1.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut"
                }}
                className="flex flex-col items-center relative z-20 transform-gpu"
              >
                {/* Lanyard Strap */}
                <div className="w-8 h-32 bg-[#151515] rounded-b-lg relative z-0 overflow-hidden shadow-2xl flex justify-center">
                  <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.02)_10px,rgba(255,255,255,0.02)_20px)]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-black text-apple-gold rotate-90 tracking-[0.3em] opacity-10 whitespace-nowrap">ZNX STUDIO</div>
                </div>

                {/* Metal Clip */}
                <div className="w-10 h-10 bg-gradient-to-br from-zinc-300 via-zinc-400 to-zinc-600 rounded-full flex items-center justify-center shadow-xl relative z-30 border border-white/20 -mt-2">
                  <div className="w-5 h-5 border-[3px] border-zinc-700/50 rounded-full" />
                  {/* Clip mechanism that connects to card */}
                  <div className="absolute -bottom-1 w-4 h-6 bg-gradient-to-b from-zinc-400 to-zinc-600 rounded-sm shadow-md" />
                  <div className="absolute -bottom-3 w-1 h-4 bg-zinc-600 rounded-full" />
                </div>

                {/* ID Card Image */}
                <div className="mt-[-8px] relative px-4 sm:px-0 z-20">
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-[#1a1a1a] rounded-full border border-white/10 z-20 flex items-center justify-center">
                    <div className="w-4 h-0.5 bg-zinc-800 rounded-full" />
                  </div>
                  <img 
                    src="/final id.png" 
                    alt="ZNX ID Card"
                    className="w-[min(340px,85vw)] h-auto rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] border border-white/5 relative z-10 gpu-accel"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-20" />
                  
                  <div className="absolute inset-x-8 -bottom-10 h-20 bg-black/60 blur-3xl -z-10 rounded-full" />
                </div>
              </motion.div>

              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-apple-gold/10 rounded-full blur-[100px] -z-10 group-hover:bg-apple-gold/20 transition-colors duration-1000" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
