import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface ServiceItem {
  id: string;
  number: string;
  name: string;
}

interface MajorServicesSectionProps {
  onOpenServices?: (serviceId?: string) => void;
  onOpenWorks?: () => void;
}

const SERVICES: ServiceItem[] = [
  { id: 'branding', number: '(01)', name: 'Branding' },
  { id: 'uxui', number: '(02)', name: 'UX/UI Design' },
  { id: 'webdev', number: '(03)', name: 'Web & Development' },
  { id: 'motion3d', number: '(04)', name: '3D / Motion' },
];

export default function MajorServicesSection({ onOpenServices }: MajorServicesSectionProps) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkTouch = () => {
      const fineMouse = window.matchMedia('(pointer: fine)').matches && window.matchMedia('(hover: hover)').matches;
      const isMobile = window.innerWidth <= 1024 || !fineMouse;
      setIsTouchDevice(isMobile);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Desktop only: gentle automatic sequential highlighting with hover override
  useEffect(() => {
    if (isTouchDevice) return;
    if (hoveredIndex !== null) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isTouchDevice, hoveredIndex]);

  return (
    <section
      id="services"
      data-light="false"
      className="relative z-20 bg-[#05070a] text-white py-24 sm:py-32 px-6 sm:px-12 md:px-20 border-t border-white/10 shadow-[0_-40px_100px_rgba(0,0,0,0.95)] select-none flex items-center justify-center min-h-screen transform-gpu [backface-visibility:hidden]"
      style={{ color: '#ffffff', backgroundColor: '#05070a' }}
    >
      {/* Anchor for About navigation */}
      <div id="about" className="absolute -top-20 left-0 pointer-events-none opacity-0" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Column: Typography & Button */}
        <div className="lg:col-span-5 flex flex-col items-start text-left pt-2">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] sm:text-[13px] font-manrope tracking-[0.25em] uppercase font-bold block mb-1 text-red-500"
            style={{ color: '#ef4444' }}
          >
            WHAT I DO
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bodoni font-bold tracking-tight leading-none mt-3 mb-6 uppercase text-white"
            style={{ color: '#ffffff' }}
          >
            Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[16px] sm:text-[18px] leading-relaxed max-w-sm font-manrope tracking-normal text-white/90"
            style={{ color: '#ffffff' }}
          >
            From concept to final cut, I offer end-to-end creative solutions for brands, artists, and businesses looking to tell their story visually.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            className="mt-8"
          >
            <button
              onClick={() => {
                if (onOpenServices) {
                  onOpenServices();
                } else {
                  window.location.hash = '#/services';
                }
              }}
              className="group bg-white text-black px-10 py-4 rounded-none text-xs font-mono-tech font-bold tracking-[0.2em] uppercase flex items-center gap-2.5 shadow-xl hover:bg-neutral-200 active:scale-95 transition-all cursor-pointer"
            >
              <span className="text-black font-bold">VIEW ALL SERVICES</span>
              <ArrowRight className="w-4 h-4 text-black transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Right Column: Stacked Services List */}
        <div className="lg:col-span-7 w-full border-t border-white/10">
          {SERVICES.map((service, idx) => {
            const isHighlighted = !isTouchDevice && (
              hoveredIndex !== null
                ? hoveredIndex === idx
                : activeIndex === idx
            );

            return (
              <motion.div
                key={service.id}
                onClick={() => {
                  if (onOpenServices) {
                    onOpenServices(service.id);
                  } else {
                    window.location.hash = `#/services?service=${service.id}`;
                  }
                }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                onMouseEnter={() => !isTouchDevice && setHoveredIndex(idx)}
                onMouseLeave={() => !isTouchDevice && setHoveredIndex(null)}
                className="group relative py-7 sm:py-9 border-b border-white/10 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {/* Bottom-to-Top Glass Slide Fill Layer (desktop only) */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 bg-white/[0.1] pointer-events-none transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] z-0 ${
                    isHighlighted
                      ? 'translate-y-0'
                      : 'translate-y-full'
                  }`}
                />

                <div className="relative z-10 flex items-center justify-center gap-4 text-center w-full">
                  {/* Number tag e.g. (01) */}
                  <span
                    style={{ color: '#ffffff', opacity: isHighlighted ? 1 : 0.65 }}
                    className="text-[11px] sm:text-[13px] font-manrope font-bold tracking-widest transition-opacity duration-300 text-white"
                  >
                    {service.number}
                  </span>

                  {/* Service Title - Clean Sharp White Text, Stationary, No Zooming */}
                  <span
                    style={{ color: '#ffffff' }}
                    className="text-[22px] sm:text-[28px] md:text-[32px] font-manrope font-bold tracking-tight leading-tight block text-white"
                  >
                    {service.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
