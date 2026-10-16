import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { ServiceItem } from '../types';

const SERVICES: ServiceItem[] = [
  {
    id: 's1',
    number: '01',
    title: 'DESIGN ENGINEERING',
    description: 'Pixel-perfect digital architecture with tailored typography systems, mathematical layout ratios, and responsive UI foundations.',
    capabilities: ['React 19 Architecture', 'Design Systems', 'WCAG AA Accessibility', 'Full-Stack Integration'],
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 's2',
    number: '02',
    title: 'MOTION PHYSICS',
    description: 'Heavy inertia scroll dynamics, fluid gesture controls, and spring-based UI animations that feel responsive and tactile.',
    capabilities: ['Lenis Smooth Scroll', 'Motion Physics', 'Custom Cursor Systems', 'Spring Motion'],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 's3',
    number: '03',
    title: 'CREATIVE DIRECTION',
    description: 'Editorial typographic visual identities that elevate brands from standard SaaS templates into memorable visual monuments.',
    capabilities: ['Brand Identity', 'Custom Typography Pairing', 'Art Direction', 'Editorial Copywriting'],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 's4',
    number: '04',
    title: 'SPATIAL 3D & SHADERS',
    description: 'Interactive WebGL, custom GLSL shaders, and 3D asset integration engineered for maximum performance across mobile & desktop.',
    capabilities: ['Three.js & WebGL', 'Custom GLSL Shaders', '3D Product Showcases', 'GPU Acceleration'],
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
  },
];

interface ServicesSectionProps {
  onOpenContact: () => void;
}

export default function ServicesSection({ onOpenContact }: ServicesSectionProps) {
  const [activeService, setActiveService] = useState<string>('s1');

  const selectedItem = SERVICES.find((s) => s.id === activeService) || SERVICES[0];

  return (
    <section id="services" className="relative bg-[#070707] text-white py-32 px-6 sm:px-12 md:px-16 border-t border-slate-900 select-none">
      <div className="max-w-7xl mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono-tech tracking-[0.25em] text-white/70 uppercase">
                03 — Core Capabilities
              </span>
            </div>
            <h2 className="text-4xl sm:text-6xl font-bodoni font-bold tracking-tight text-white">
              STUDIO SERVICES
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-mono-tech text-white/70 max-w-md uppercase tracking-wider">
            ELEVATING WEB PRODUCTS WITH UNCOMPROMISING PRECISION, LUXURY SCROLL DYNAMICS, AND EDITORIAL CRAFT.
          </p>
        </div>

        {/* Services Accordion & Live Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Service Accordion List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {SERVICES.map((service) => {
              const isActive = service.id === activeService;
              return (
                <motion.div
                  key={service.id}
                  onClick={() => setActiveService(service.id)}
                  className={`p-6 sm:p-8 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-slate-900/80 border-slate-600 shadow-2xl'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono-tech text-red-500 font-bold">
                        {service.number}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-syne font-bold text-white">
                        {service.title}
                      </h3>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 transition-transform duration-300 ${
                        isActive ? 'rotate-90 text-red-500' : 'text-slate-500'
                      }`}
                    />
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-slate-800"
                    >
                      <p className="text-sm font-sans text-slate-300 leading-relaxed mb-6">
                        {service.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.capabilities.map((cap) => (
                          <div key={cap} className="flex items-center gap-2 text-xs font-mono-tech text-slate-400">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
                            <span>{cap}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenContact();
                        }}
                        className="mt-6 text-xs font-mono-tech font-bold text-red-400 hover:text-white uppercase tracking-widest flex items-center gap-2 group"
                      >
                        <span>INQUIRE ABOUT THIS SERVICE</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Right Live Visual Preview Card */}
          <div className="lg:col-span-5 sticky top-28">
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group"
            >
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

              <div className="absolute bottom-8 left-8 right-8 text-white">
                <span className="text-xs font-mono-tech text-red-500 uppercase tracking-widest block mb-2">
                  MODULE {selectedItem.number}
                </span>
                <h4 className="text-2xl font-syne font-bold mb-2">
                  {selectedItem.title}
                </h4>
                <p className="text-xs text-slate-300 font-sans line-clamp-3">
                  {selectedItem.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
