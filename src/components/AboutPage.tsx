import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import Footer from './Footer';

interface AboutPageProps {
  onBackToHome: (targetSection?: string) => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenServices?: () => void;
  onOpenWorks?: () => void;
}

const BRAND_LOGOS = [
  {
    name: 'SoundCloud',
    category: 'Audio Platform',
    icon: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M11.56 8.87V17h8.76c1.48 0 2.68-1.2 2.68-2.68 0-1.48-1.2-2.68-2.68-2.68-.21 0-.41.03-.61.08C19.26 9.39 17.2 8 14.81 8c-.68 0-1.33.12-1.92.35-.38-.28-.83-.48-1.33-.48zM1.8 13.5c0 .38.07.74.2 1.07l.02.04h.01c.28.7.83 1.25 1.53 1.53.33.13.69.2 1.07.2h.17v-5.68h-.17c-.38 0-.74.07-1.07.2-.7.28-1.25.83-1.53 1.53-.13.33-.2.69-.2 1.07zm3.17 2.84h.01v-8.52h-.01c-.38 0-.74.07-1.07.2-.7.28-1.25.83-1.53 1.53-.13.33-.2.69-.2 1.07v1.88c0 .38.07.74.2 1.07.28.7.83 1.25 1.53 1.53.33.13.69.2 1.07.2zm3.17 0h.01V6.99h-.01c-.38 0-.74.07-1.07.2-.7.28-1.25.83-1.53 1.53-.13.33-.2.69-.2 1.07v5.42c0 .38.07.74.2 1.07.28.7.83 1.25 1.53 1.53.33.13.69.2 1.07.2z"/>
      </svg>
    )
  },
  {
    name: 'LUELLA',
    category: 'Luxury Brand',
    icon: (
      <span className="font-bodoni font-bold text-lg tracking-widest uppercase border border-current px-2 py-0.5 rounded leading-none">
        L
      </span>
    )
  },
  {
    name: 'QUANTUM',
    category: 'SaaS Platform',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
      </svg>
    )
  },
  {
    name: 'SPATIAL LABS',
    category: '3D Studio',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )
  },
  {
    name: 'HYPERION',
    category: 'Fintech Protocol',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <polygon points="12 2 2 22 22 22" />
        <line x1="12" y1="9" x2="12" y2="17" />
      </svg>
    )
  },
  {
    name: 'ZENITH',
    category: 'Real Estate Architecture',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    )
  },
  {
    name: 'APEX ROBOTICS',
    category: 'AI & Autonomous Tech',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
      </svg>
    )
  },
  {
    name: 'OBSIDIAN',
    category: 'Cinematic Media',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
      </svg>
    )
  },
  {
    name: 'VANCE & CO',
    category: 'Editorial Identity',
    icon: (
      <span className="font-syne font-black text-lg tracking-tighter">
        V&C
      </span>
    )
  },
  {
    name: 'KAGE LABS',
    category: 'Interactive WebGL',
    icon: (
      <svg className="w-6 h-6 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    )
  }
];

const FAQ_ITEMS = [
  {
    number: '01',
    question: 'What kind of work do you do?',
    answer: 'I work across branding, motion design, and web development, helping bring ideas to life through visuals and digital experiences.'
  },
  {
    number: '02',
    question: 'Who do you work with?',
    answer: 'I work with brands, startups, creators, and people with ideas worth building. If the project feels right, I\'m open to exploring it.'
  },
  {
    number: '03',
    question: 'How does a project usually start?',
    answer: 'It starts with a conversation. We discuss your idea, what you\'re trying to achieve, and what makes sense for the project before moving into the actual work.'
  },
  {
    number: '04',
    question: 'How do I get started?',
    answer: 'Just reach out through the contact form or email me with a little about your project. I\'ll get back to you, and we can take it from there.'
  }
];

/** Component that flips its children upwards on hover with ultra-smooth cubic-bezier easing */
function FlipBlock({
  children,
  className = "",
  hoverColorClass = ""
}: {
  children: React.ReactNode;
  className?: string;
  hoverColorClass?: string;
}) {
  return (
    <span className={`relative inline-block overflow-hidden h-[1.2em] leading-none align-middle ${className}`}>
      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 whitespace-nowrap will-change-transform">
        <span className="flex items-center gap-1.5 h-[1.2em] leading-none font-semibold">
          {children}
        </span>
        <span className={`flex items-center gap-1.5 h-[1.2em] leading-none font-semibold ${hoverColorClass}`}>
          {children}
        </span>
      </span>
    </span>
  );
}

/** Word-by-word scroll illumination component where each word transitions smoothly from gray to white as user scrolls down */
function ScrollRevealParagraph({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");

  return (
    <div ref={containerRef} className="pt-4 mt-2">
      <p className="flex flex-wrap text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-syne font-semibold leading-[1.35] tracking-tight gap-x-3 gap-y-2">
        {words.map((word, idx) => {
          const start = idx / words.length;
          const end = Math.min(1, (idx + 1) / words.length);

          return (
            <ScrollWord
              key={idx}
              isInitiallyVisible={idx < 4}
              word={word}
              progress={scrollYProgress}
              range={[start, end]}
            />
          );
        })}
      </p>
    </div>
  );
}

function ScrollWord({
  isInitiallyVisible,
  word,
  progress,
  range,
}: {
  isInitiallyVisible?: boolean;
  key?: React.Key;
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [isInitiallyVisible ? 1 : 0, 1]);
  const color = useTransform(progress, range, [isInitiallyVisible ? "#ffffff" : "#181818", "#ffffff"]);

  return (
    <motion.span
      style={{ color, opacity }}
      className="inline-block transition-colors duration-200"
    >
      {word}
    </motion.span>
  );
}

export default function AboutPage({
  onBackToHome,
  onOpenContact,
  onOpenPrivacy,
  onOpenServices,
  onOpenWorks,
}: AboutPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Always scroll to top when mounting About Page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleStartProject = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      window.open('https://calendly.com/contactmeznx/project-call', '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black relative overflow-x-hidden">
      {/* CSS Keyframe Animation for Infinite Smooth Marquee */}
      <style>{`
        @keyframes marqueeRightToLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-brand-marquee {
          display: flex;
          width: max-content;
          animation: marqueeRightToLeft 65s linear infinite;
          will-change: transform;
        }
        .animate-brand-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Top Header Bar - Matches Home page exact style with logo and FlipBlock Let's Talk button, no line on top */}
      <div className="absolute top-0 left-0 right-0 z-40 px-6 py-6 sm:px-12 flex items-center justify-between pointer-events-auto">
        {/* Logo replacing Back to Home */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onBackToHome();
          }}
          className="group flex items-center select-none cursor-pointer"
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

        {/* Let's Talk Button on Top Right matching Home page */}
        <button
          onClick={handleStartProject}
          className="group flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase py-1 px-1 transition-colors duration-500 text-white hover:text-white/75 cursor-pointer"
        >
          <FlipBlock hoverColorClass="text-white/70">
            <span>LET'S TALK</span>
            <ArrowUpRight className="w-4 h-4" />
          </FlipBlock>
        </button>
      </div>

      {/* Main Container Spacer */}
      <div className="pt-24 sm:pt-32" />

      {/* Word-by-Word Scroll Reveal Paragraph Section (Placed ABOVE About Me Section) */}
      <section className="px-4 md:px-12 lg:px-16 max-w-7xl mx-auto pt-4 pb-12">
        <ScrollRevealParagraph
          text="Every idea starts somewhere. We’re here to take those ideas, explore what they could become, and turn them into something worth remembering. From design to digital experiences, we believe the little details make all the difference."
        />
      </section>

      {/* About Me Section - Introduction */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="px-4 md:px-12 lg:px-16 max-w-7xl mx-auto pt-12 sm:pt-16 pb-16 sm:pb-20 bg-[#0a0a0a] relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Portrait Image Container with Scattered ZNX Graphic */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex justify-center lg:justify-start"
          >
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Image box: preserving natural original image aspect ratio, no cropping or zooming */}
              <div className="rounded-2xl overflow-hidden bg-neutral-950 relative shadow-2xl pointer-events-auto select-none">
                <img
                  src="/images/1221.avif"
                  alt="Founder"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src.includes('/images/1221.avif')) {
                      target.src = '/1221.avif';
                    } else if (target.src.includes('/1221.avif')) {
                      target.src = 'images/1221.avif';
                    }
                  }}
                  className="w-full h-auto object-contain pointer-events-none rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none rounded-2xl" />
              </div>

              {/* Scattered ZNX Typographic Graphic Overlapping Bottom Edge */}
              <div className="absolute -bottom-6 -left-3 sm:-bottom-8 sm:-left-5 flex items-baseline z-20 pointer-events-none select-none">
                <span className="font-syne font-black text-6xl sm:text-7xl md:text-8xl text-white tracking-tighter inline-block transform -rotate-[16deg] translate-y-1 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]">
                  Z
                </span>
                <span className="font-syne font-black text-6xl sm:text-7xl md:text-8xl text-white tracking-tighter inline-block transform rotate-[12deg] -translate-x-3 -translate-y-2 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]">
                  N
                </span>
                <span className="font-syne font-black text-6xl sm:text-7xl md:text-8xl text-white tracking-tighter inline-block transform -rotate-[8deg] -translate-x-6 translate-y-3 drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]">
                  X
                </span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Introduce Text with Smooth Scroll Triggered Animations */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-8 pt-8 lg:pt-0">
            {/* Top Tag: ABOUT ME (07) in RED (#ef4444) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-2"
            >
              <span className="text-xs sm:text-sm font-sans tracking-widest uppercase text-[#ef4444] font-semibold">
                About Me
              </span>
            </motion.div>

            {/* Headline: LET ME INTRODUCE YOU */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bodoni font-medium uppercase tracking-tight text-white leading-[1.05]"
            >
              LET ME<br />INTRODUCE YOU
            </motion.h2>

            {/* Mono / Tech Body Paragraphs */}
            <div className="space-y-6 pt-2 font-mono text-sm sm:text-base md:text-lg text-neutral-300 leading-relaxed max-w-xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                I'm a creator who never wanted to be limited to just one thing.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-white font-medium"
              >
                So I built a space for everything I do.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                ZNX brings design, motion, and technology together to create work that feels different. This is only the beginning.
              </motion.p>
            </div>

            {/* Bottom Signature Mark: Smaller, elegant cursive handwritten font style */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="pt-2 flex items-center justify-start"
            >
              <span className="font-['Alex_Brush',cursive] text-2xl sm:text-3xl text-neutral-200 tracking-wide font-normal">
                Suyog Ballu
              </span>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Infinite Moving Logo Marquee (Clients / Brand Logos - No top/bottom divider lines) */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-12 sm:py-16 overflow-hidden relative bg-[#0a0a0a]"
      >
        {/* Soft, deep side-fades on both left and right for butter-smooth transition */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-28 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-28 sm:w-48 md:w-64 lg:w-80 bg-gradient-to-l from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent z-20" />

        {/* Marquee Loop Track */}
        <div className="w-full overflow-hidden cursor-pointer select-none py-4">
          <div className="animate-brand-marquee flex items-center gap-12 sm:gap-20 md:gap-28 lg:gap-36">
            {/* Triplicated List for Completely Seamless Infinite Scrolling */}
            {[...BRAND_LOGOS, ...BRAND_LOGOS, ...BRAND_LOGOS].map((brand, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 sm:gap-4 shrink-0 opacity-80 cursor-pointer"
              >
                <div className="text-neutral-300">
                  {brand.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-syne font-bold text-base sm:text-lg md:text-xl tracking-tight text-neutral-200">
                    {brand.name}
                  </span>
                  <span className="font-mono-tech text-[10px] sm:text-xs text-neutral-500 tracking-wider uppercase">
                    {brand.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* FAQ Section - FAQ text is WHITE, questions are WHITE, numbers are RED (#ef4444), answers expand & collapse slow and smooth */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="py-20 sm:py-28 px-6 sm:px-12 md:px-20 bg-[#0a0a0a] text-white relative z-10 select-none"
      >
        <div className="max-w-6xl mx-auto">
          {/* Giant FAQ Title in crisp, ultra-high resolution Syne Black typography */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-syne font-black uppercase tracking-tight text-white text-center mb-12 sm:mb-16 leading-none antialiased select-none"
          >
            FAQ
          </motion.h2>

          {/* FAQ Accordion List */}
          <div className="border-t border-white/20">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.number}
                  className="border-b border-white/20"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full py-6 sm:py-8 flex items-start sm:items-center justify-between text-left gap-6 group cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-start sm:items-center gap-6 sm:gap-12 flex-1">
                      {/* Numbers in RED (#ef4444) */}
                      <span className="font-mono text-base sm:text-lg text-[#ef4444] font-bold min-w-[2.5rem]">
                        {item.number}
                      </span>
                      {/* Questions in WHITE */}
                      <span className="font-sans text-lg sm:text-2xl font-medium text-white tracking-tight group-hover:text-neutral-300 transition-colors">
                        {item.question}
                      </span>
                    </div>
                    {/* Arrow Icon */}
                    <span className="text-xl sm:text-2xl text-white font-bold shrink-0 transition-transform duration-300">
                      {isOpen ? '↑' : '↓'}
                    </span>
                  </button>

                  {/* 100% glitch-free CSS Grid template-rows transition for slow & buttery opening AND closing */}
                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden pl-[3.5rem] sm:pl-[5.5rem] pr-6 pb-6 sm:pb-8">
                      <p className="font-sans text-sm sm:text-base text-neutral-300 max-w-3xl leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>



      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="px-4 md:px-12 lg:px-16 max-w-7xl mx-auto py-16"
      >
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
              onClick={handleStartProject}
              className="w-full sm:w-auto bg-white text-black px-8 py-3.5 rounded-full font-mono-tech font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all cursor-pointer"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (onOpenWorks) {
                  onOpenWorks();
                } else {
                  window.location.hash = '#/works';
                }
              }}
              className="w-full sm:w-auto border border-white/20 bg-white/[0.03] text-white px-8 py-3.5 rounded-full font-mono-tech font-semibold text-xs uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
            >
              VIEW WORKS
            </button>
          </div>
        </div>
      </motion.section>

      {/* Global Footer Component */}
      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenServices={onOpenServices}
        onOpenWorks={onOpenWorks}
        onNavigateToHome={onBackToHome}
      />
    </div>
  );
}
