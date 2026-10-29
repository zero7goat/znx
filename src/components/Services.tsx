import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface ServiceItem {
  id: string;
  number: string;
  name: string;
  subtitle: string;
}

interface MajorServicesSectionProps {
  onOpenServices?: (serviceId?: string) => void;
  onOpenWorks?: () => void;
}

// Subtitles mirror the headings used on the Services page
const SERVICES: ServiceItem[] = [
  { id: 'branding', number: '(01)', name: 'Branding', subtitle: 'Brand Strategy' },
  { id: 'uxui', number: '(02)', name: 'UX/UI Design', subtitle: 'Digital Experience' },
  { id: 'webdev', number: '(03)', name: 'Web & Development', subtitle: 'Engineering & Build' },
  { id: 'motion3d', number: '(04)', name: '3D / Motion', subtitle: 'Motion & Visuals' },
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      if (document.hidden) return;
      setActiveIndex((prev) => (prev + 1) % SERVICES.length);
    }, 2800);

    return () => clearInterval(interval);
  }, [isTouchDevice, hoveredIndex]);

  const openService = (serviceId?: string) => {
    if (onOpenServices) {
      onOpenServices(serviceId);
    } else {
      window.location.hash = serviceId ? `#/services?service=${serviceId}` : '#/services';
    }
  };

  return (
    <section
      id="services"
      data-light="false"
      className="relative z-20 bg-[#0a0a0a] text-white py-24 sm:py-32 px-6 sm:px-12 md:px-20 border-t border-white/10 shadow-[0_-40px_80px_rgba(0,0,0,0.55)] select-none flex items-center justify-center min-h-screen"
    >
      {/* Anchor for About navigation */}
      <div id="about" className="absolute -top-20 left-0 pointer-events-none opacity-0" />

      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

        {/* Left Column: Typography & Button */}
        <div className="lg:col-span-5 flex flex-col items-start text-left">
          <ScrollReveal yOffset={25} duration={0.9}>
            <span className="znx-eyebrow mb-3">WHAT I DO</span>

            <h2 className="znx-heading text-white mb-6">Services</h2>

            <p className="text-base sm:text-lg leading-relaxed max-w-sm text-neutral-300">
              From concept to final cut, I offer end-to-end creative solutions for brands, artists, and businesses looking to tell their story visually.
            </p>

            <div className="mt-8">
              <button onClick={() => openService()} className="znx-btn znx-btn-primary">
                <span>VIEW ALL SERVICES</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Column: Editorial services list */}
        <ul className="lg:col-span-7 w-full border-t border-white/10">
          {SERVICES.map((service, idx) => {
            const isHighlighted = !isTouchDevice && (
              hoveredIndex !== null
                ? hoveredIndex === idx
                : activeIndex === idx
            );

            return (
              <li key={service.id} className="border-b border-white/10">
                <ScrollReveal yOffset={15} duration={0.7} staggerIndex={idx}>
                  <button
                    type="button"
                    onClick={() => openService(service.id)}
                    onMouseEnter={() => !isTouchDevice && setHoveredIndex(idx)}
                    onMouseLeave={() => !isTouchDevice && setHoveredIndex(null)}
                    className="group relative w-full py-6 sm:py-8 px-2 sm:px-4 flex items-center gap-4 sm:gap-6 text-left overflow-hidden cursor-pointer"
                  >
                    {/* Bottom-to-top fill layer (desktop highlight) */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 bg-white/[0.06] pointer-events-none transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isHighlighted ? 'translate-y-0' : 'translate-y-full'
                      }`}
                    />

                    <span
                      className={`relative font-mono-tech text-[11px] sm:text-xs tracking-widest transition-colors duration-300 ${
                        isHighlighted ? 'text-[#ef4444]' : 'text-neutral-500'
                      }`}
                    >
                      {service.number}
                    </span>

                    <span className="relative flex-1 min-w-0 flex flex-col gap-2">
                      <span className="font-syne font-bold text-[1.5rem] sm:text-[2rem] md:text-[2.25rem] tracking-tight leading-none text-white">
                        {service.name}
                      </span>
                      <span className="znx-label">{service.subtitle}</span>
                    </span>

                    <ArrowUpRight
                      className={`relative w-5 h-5 shrink-0 transition-[transform,opacity,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isHighlighted
                          ? 'opacity-100 translate-x-0 text-white'
                          : 'opacity-40 -translate-x-1 text-neutral-500 group-active:opacity-100'
                      }`}
                    />
                  </button>
                </ScrollReveal>
              </li>
            );
          })}
        </ul>

      </div>
    </section>
  );
}
