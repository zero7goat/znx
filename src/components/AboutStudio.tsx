import { motion } from 'motion/react';
import { Sparkles, Award, Globe, ShieldCheck } from 'lucide-react';

export default function AboutStudio() {
  const stats = [
    { label: 'DELIVERED MONUMENTS', value: '48+' },
    { label: 'GLOBAL CLIENTELE', value: '14 COUNTRIES' },
    { label: 'CLIENT RETENTION', value: '98%' },
    { label: 'AVERAGE FPS', value: '60 FPS STABLE' },
  ];

  return (
    <section id="about" className="relative bg-[#0d0d0d] text-white py-32 px-6 sm:px-12 md:px-16 border-t border-slate-900 select-none">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Title */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-mono-tech tracking-[0.25em] text-slate-400 uppercase">
            04 — Studio Philosophy
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
          <div className="lg:col-span-7">
            <h2 className="text-3xl sm:text-5xl font-instrument font-normal tracking-tight text-white leading-tight">
              WE BELIEVE THE WEB IS AN UNEXPLORED CANVAS FOR ARCHITECTURAL BEAUTY.
            </h2>
          </div>

          <div className="lg:col-span-5 text-slate-400 text-sm font-sans leading-relaxed flex flex-col gap-4">
            <p>
              Founded in 2024, Studio Minimal bridges the gap between high-end editorial graphic design and modern full-stack web software engineering.
            </p>
            <p>
              We eliminate low-effort templates, bloated frameworks, and generic SaaS patterns to build custom visual monuments uniquely tailored for visionary brands.
            </p>
          </div>
        </div>

        {/* Studio Stats Grid with Clean Minimalism Corner Ticks */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative p-6 sm:p-8 bg-slate-950/60 border border-slate-800 rounded-xl flex flex-col justify-between"
            >
              {/* Corner tick marks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-slate-600" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-slate-600" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-slate-600" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-600" />

              <span className="text-3xl sm:text-4xl lg:text-5xl font-bodoni font-bold text-white mb-2">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-xs font-mono-tech text-slate-400 uppercase tracking-widest">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Accolades & Badges */}
        <div className="mt-20 pt-12 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-400 text-xs font-mono-tech tracking-widest uppercase">
          <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg border border-slate-800">
            <Award className="w-5 h-5 text-amber-400" />
            <span>AWWWARDS SITE OF THE DAY</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg border border-slate-800">
            <Globe className="w-5 h-5 text-blue-400" />
            <span>GLOBAL DISTRIBUTED ATELIER</span>
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-900/30 rounded-lg border border-slate-800">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>ENTERPRISE GRADE ARCHITECTURE</span>
          </div>
        </div>
      </div>
    </section>
  );
}
