import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { NavTab } from '../types';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';

interface ServicesPageProps {
  onBackToHome?: () => void;
  onSelectTab?: (tab: NavTab) => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
}

/** Component that flips its children upwards on hover with ultra-smooth cubic-bezier easing */
function FlipBlock({
  children,
  className = "",
  hoverColorClass = "",
}: {
  children: React.ReactNode;
  className?: string;
  hoverColorClass?: string;
}) {
  return (
    <span className={`relative inline-block overflow-hidden h-[1.2em] leading-none align-middle ${className}`}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 whitespace-nowrap will-change-transform">
        <span className="flex items-center gap-1.5 h-[1.2em] leading-none font-medium">
          {children}
        </span>
        <span className={`flex items-center gap-1.5 h-[1.2em] leading-none font-medium ${hoverColorClass}`}>
          {children}
        </span>
      </span>
    </span>
  );
}

interface ServiceCategory {
  id: string;
  title: string;
  align: 'left' | 'right';
  subtitle: string;
  description: string;
  image: string;
  capabilities: string[];
}

const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'branding',
    title: 'Branding',
    align: 'left',
    subtitle: 'Brand Strategy',
    description:
      'Branding shapes how a company is recognized. Through strategy, design, and visual systems, we create identities that communicate the right message and stay consistent across every platform.',
    image:
      'https://i.pinimg.com/1200x/2b/89/1f/2b891f6e5c20c30901939bd83d7d5e77.jpg',
    capabilities: [
      'Brand Identity',
      'Logo Design',
      'Brand Guidelines',
      'Visual Direction',
      'Graphic Design',
      'Marketing Assets',
      'Packaging & Merchandise Design',
    ],
  },
  {
    id: 'uxui',
    title: 'UX/UI Design',
    align: 'right',
    subtitle: 'Digital Experience',
    description:
      'UX/UI design creates digital experiences that are easy to understand, enjoyable to use, and aligned with business goals. We design interfaces that balance user needs with a strong visual identity.',
    image:
      'https://i.pinimg.com/736x/0c/8e/1c/0c8e1c3cca5be58498a8df4106c4bc9c.jpg',
    capabilities: [
      'User Research',
      'User Flows',
      'Wireframes',
      'Interface Design',
      'Design Systems',
      'Prototyping',
      'Responsive Design',
    ],
  },
  {
    id: 'webdev',
    title: 'Web Development',
    align: 'left',
    subtitle: 'Engineering & Build',
    description:
      'Web development turns designs into fast, reliable, and functional websites. We build digital platforms that represent brands, engage users, and perform smoothly.',
    image:
      'https://i.pinimg.com/1200x/df/79/aa/df79aaf64ed99b6f53270093ecab1aca.jpg',
    capabilities: [
      'Website Development',
      'Landing Pages',
      'Front-End Development',
      'Interactive Websites',
      'CMS Integration',
      'Performance Optimization',
      'Website Maintenance',
    ],
  },
  {
    id: 'motion3d',
    title: '3D / Motion',
    align: 'right',
    subtitle: 'Motion & Visuals',
    description:
      'Motion brings ideas to life through animation, visuals, and storytelling. We create engaging content that helps brands explain products, showcase ideas, and capture attention.',
    image:
      'https://i.pinimg.com/736x/b9/fb/e1/b9fbe1f7212bc95491709d5b919515c4.jpg',
    capabilities: [
      'Motion Graphics',
      'SaaS Explainer Videos',
      '3D Product Visualization',
      'Product Animations',
      'Video Editing',
      'Brand Animations',
      'Social Media Content',
    ],
  },
];

export default function ServicesPage({
  onBackToHome,
  onSelectTab,
  onOpenContact,
  onOpenPrivacy,
}: ServicesPageProps) {
  // Check for target service section in URL hash or query on mount
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/[?&]service=([^&]+)/) || hash.match(/#service-(.+)/) || hash.match(/#([a-z0-9]+)$/);
    if (match && match[1] && match[1] !== 'services') {
      const targetId = match[1];
      const positionTarget = () => {
        const el = document.getElementById(targetId) || document.getElementById(`service-${targetId}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          const targetY = rect.top + window.pageYOffset - 80;
          window.scrollTo(0, targetY);
        }
      };

      positionTarget();
      requestAnimationFrame(positionTarget);
      const timer = setTimeout(positionTarget, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <div className="min-h-screen text-white font-sans select-none flex flex-col justify-between overflow-x-hidden relative">
      {/* Transparent over the site's black background, so the fixed snow-particle canvas shows throughout */}
      <style>{`
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor-blink {
          animation: cursorBlink 0.8s step-end infinite;
        }
      `}</style>

      {/* 1. TOP HEADER */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between bg-transparent relative z-40">
        
        {/* Left: ZNX Logo replacing back arrow */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (onBackToHome) onBackToHome();
          }}
          className="group flex items-center select-none cursor-pointer"
          aria-label="ZNX Studio Home"
          title="Back to Home"
        >
          <img
            src="/Logo.png"
            alt="ZNX Studio Logo"
            referrerPolicy="no-referrer"
            onError={(e) => {
              const target = e.currentTarget;
              if (target.src.endsWith('/Logo.png')) {
                target.src = '/images/Logo.png';
              } else if (target.src.endsWith('/images/Logo.png')) {
                target.src = '/Logo.avif';
              } else if (target.src.endsWith('/images/Logo.avif')) {
                target.src = '/images/Logo.avif';
              }
            }}
            className="h-8 sm:h-9 md:h-10 w-auto object-contain brightness-0 invert group-hover:opacity-85 transition-opacity"
          />
        </a>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenContact}
            className="group text-[11px] sm:text-xs font-medium tracking-widest uppercase text-white flex items-center gap-1 cursor-pointer"
          >
            <FlipBlock>
              <span>LET'S TALK</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
            </FlipBlock>
          </button>
        </div>

      </header>

      {/* 2. SERVICES SHOWCASE BLOCKS (first section after the header) */}
      <section className="w-full max-w-[1400px] mx-auto px-6 sm:px-12 md:px-16 pt-8 sm:pt-12 pb-24 sm:pb-36 flex flex-col gap-24 sm:gap-32">
        {SERVICES_DATA.map((service) => {
          const isRightAligned = service.align === 'right';

          return (
            <ScrollReveal
              key={service.id}
              yOffset={35}
              duration={0.95}
              className="w-full flex flex-col scroll-mt-24 sm:scroll-mt-32"
            >
              <div id={service.id}>
              
              {/* Clean Translucent Black and Gray Gradient Title */}
              <div className={`w-full mb-3 sm:mb-5 text-center ${isRightAligned ? 'sm:text-right' : 'sm:text-left'}`}>
                <h3
                  className="inline-block text-[2.5rem] sm:text-7xl md:text-8xl lg:text-[8.5rem] font-syne font-bold bg-gradient-to-r from-white via-neutral-300 to-neutral-600 bg-clip-text text-transparent tracking-tight leading-[1.05] pb-[0.08em] select-none text-center"
                  style={{
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {service.title}
                </h3>
              </div>

              {/* Two-Column Card Grid with minimal border radius & no borders */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
                
                {/* IMAGE CARD */}
                <div
                  className={`lg:col-span-6 min-h-[380px] sm:min-h-[480px] md:min-h-[540px] rounded-sm overflow-hidden bg-neutral-900 border-none shadow-md relative ${
                    isRightAligned ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                </div>

                {/* GREY DETAILS CARD */}
                <div
                  className={`lg:col-span-6 bg-white/[0.03] border border-white/10 rounded-sm p-6 sm:p-10 md:p-12 flex flex-col justify-between ${
                    isRightAligned ? 'lg:order-1' : 'lg:order-2'
                  }`}
                >
                  {/* Top Right Explanatory Paragraph */}
                  <div className="w-full flex justify-center sm:justify-end mb-8 sm:mb-12">
                    <p className="text-sm text-neutral-400 leading-relaxed font-sans max-w-md text-center sm:text-left">
                      {service.description}
                    </p>
                  </div>

                  {/* Subtitle Header with Dot Grid Icon */}
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <div className="grid grid-cols-3 gap-1 w-5 h-5 text-[#ef4444]">
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                      <span className="w-1 h-1 rounded-full bg-current" />
                    </div>

                    <h4 className="text-xl sm:text-2xl md:text-3xl font-sans font-medium text-white tracking-tight">
                      {service.subtitle}
                    </h4>
                  </div>

                  {/* Capabilities List */}
                  <div className="flex flex-col border-t border-white/10 divide-y divide-white/10">
                    {service.capabilities.map((cap, i) => (
                      <div
                        key={i}
                        className="py-3.5 sm:py-4.5 flex items-center justify-between group cursor-pointer transition-all duration-300"
                      >
                        <span className="text-sm sm:text-base text-neutral-300 font-sans font-normal group-hover:text-white transition-colors">
                          {cap}
                        </span>
                        
                        <div className="text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-[color,transform] duration-300">
                          <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            </div>
          </ScrollReveal>
          );
        })}
      </section>

      {/* 6. CTA BANNER SECTION (MATCHES ABOUT PAGE CTA) */}
      <section className="px-4 md:px-12 lg:px-16 max-w-7xl mx-auto py-16">
        <ScrollReveal yOffset={35} duration={0.9}>
          <div className="bg-[#0c0c0c] border border-white/10 rounded-2xl p-8 sm:p-14 md:p-16 text-center relative overflow-hidden shadow-md shadow-black/20">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-syne font-bold text-white max-w-3xl mx-auto leading-tight">
              Ready to push boundaries together?
            </h2>

            <p className="font-bodoni italic text-lg sm:text-2xl text-neutral-300 max-w-2xl mx-auto mt-4">
              Let's build an iconic digital presence for your brand.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-mono-tech font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer"
              >
                <span>START A PROJECT</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSelectTab?.('work')}
                className="w-full sm:w-auto border border-white/20 bg-white/[0.03] text-white px-8 py-3.5 rounded-full font-mono-tech font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
              >
                VIEW WORKS
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. FOOTER */}
      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenServices={() => onSelectTab?.('services')}
        onOpenWorks={() => onSelectTab?.('work')}
        onNavigateToHome={onBackToHome}
      />

    </div>
  );
}
