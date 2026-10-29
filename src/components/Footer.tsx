import { useEffect, useRef, useState } from 'react';
import { Youtube, Instagram, Linkedin } from 'lucide-react';
import { smoothScrollTo } from '../utils/smoothScroll';
import ScrollReveal from './ScrollReveal';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenServices?: () => void;
  onOpenWorks?: () => void;
  onOpenAbout?: () => void;
  onNavigateToHome?: (section?: string) => void;
}

export default function Footer({
  onOpenPrivacy,
  onOpenServices,
  onOpenWorks,
  onOpenAbout,
  onNavigateToHome,
}: FooterProps = {}) {
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const [isWordmarkVisible, setIsWordmarkVisible] = useState(false);

  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsWordmarkVisible(true);
      return;
    }
    // No negative rootMargin: the wrapper sits at the very bottom of the page, so shrinking the
    // root (as the generic reveal does) could leave it permanently "outside" on short screens
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsWordmarkVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="w-full bg-[#0a0a0a] text-white select-none overflow-hidden border-t border-white/[0.08] relative z-40 isolate">
      <div className="w-full px-4 pt-14 pb-0 sm:px-8 md:px-12 md:pt-20 lg:px-16 relative flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Panel: Agency Statement */}
          <ScrollReveal yOffset={25} duration={0.9} className="md:col-span-6 space-y-3">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-[1.8rem] leading-[1.25] font-light text-neutral-300 font-sans tracking-tight max-w-xl">
              <span className="font-syne font-extrabold text-white tracking-wide">ZNX</span> is an independent motion design agency and digital product studio.
            </p>
          </ScrollReveal>

          {/* Middle Panel: Navigation Link */}
          <ScrollReveal yOffset={25} duration={0.9} delay={0.1} className="md:col-span-3 space-y-3">
            <span className="znx-label block">
              EXPLORE
            </span>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  if (onOpenWorks) {
                    onOpenWorks();
                  } else {
                    window.location.hash = '#/works';
                  }
                }}
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-[color,transform] duration-300 cursor-pointer block text-left text-sm font-sans font-normal py-0.5"
              >
                Works
              </button>
              <button
                onClick={() => {
                  if (onOpenServices) {
                    onOpenServices();
                  } else {
                    window.location.hash = '#/services';
                  }
                }}
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-[color,transform] duration-300 cursor-pointer block text-left text-sm font-sans font-normal py-0.5"
              >
                Services
              </button>
              <button
                onClick={() => {
                  if (onOpenAbout) {
                    onOpenAbout();
                  } else {
                    window.location.hash = '#/about';
                  }
                }}
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-[color,transform] duration-300 cursor-pointer block text-left text-sm font-sans font-normal py-0.5"
              >
                About
              </button>
              <button
                onClick={() => {
                  if (onOpenPrivacy) {
                    onOpenPrivacy();
                  } else {
                    window.location.hash = '#/privacy';
                  }
                }}
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-[color,transform] duration-300 cursor-pointer block text-left text-sm font-sans font-normal py-0.5"
              >
                Privacy Policy
              </button>
            </div>
          </ScrollReveal>

          {/* Right Panel: Social Pills Stacking */}
          <ScrollReveal yOffset={25} duration={0.9} delay={0.2} className="md:col-span-3 space-y-3">
            <span className="znx-label block">
              FOLLOW US
            </span>
            <div className="flex flex-row sm:flex-col gap-3 sm:gap-2.5 flex-wrap">
              <a
                href="https://www.youtube.com/@znxmotions"
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 bg-white/[0.02] hover:bg-white hover:border-white rounded-full flex items-center justify-center sm:justify-start gap-2.5 p-2.5 sm:px-4 sm:py-2 text-[11px] text-neutral-300 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform hover:-translate-y-0.5 hover:shadow-[0_8px_25px_-5px_rgba(255,255,255,0.2)] active:scale-95 font-sans tracking-wide cursor-pointer"
                title="YouTube"
              >
                <Youtube className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-neutral-400 group-hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="hidden sm:inline group-hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">@znxmotions</span>
              </a>
              <a
                href="https://www.instagram.com/theznx/"
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 bg-white/[0.02] hover:bg-white hover:border-white rounded-full flex items-center justify-center sm:justify-start gap-2.5 p-2.5 sm:px-4 sm:py-2 text-[11px] text-neutral-300 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform hover:-translate-y-0.5 hover:shadow-[0_8px_25px_-5px_rgba(255,255,255,0.2)] active:scale-95 font-sans tracking-wide cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-neutral-400 group-hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="hidden sm:inline group-hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">@theznx</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group border border-white/10 bg-white/[0.02] hover:bg-white hover:border-white rounded-full flex items-center justify-center sm:justify-start gap-2.5 p-2.5 sm:px-4 sm:py-2 text-[11px] text-neutral-300 hover:text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform hover:-translate-y-0.5 hover:shadow-[0_8px_25px_-5px_rgba(255,255,255,0.2)] active:scale-95 font-sans tracking-wide cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 sm:w-3 sm:h-3 text-neutral-400 group-hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]" />
                <span className="hidden sm:inline group-hover:text-black transition-colors duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">@znxagency</span>
              </a>
            </div>
          </ScrollReveal>
        </div>

        {/* Giant ZNX wordmark: full-bleed, sized in vw so it spans the width at every breakpoint.
            The footer edge deliberately crops the lower half of the letters: with line-height 1, Syne's
            baseline sits at 0.825em and its cap height is 0.64em, so a -0.47em bottom margin leaves just
            over the top half visible (em-based, so the crop is identical on every screen).
            Reveal: the word rises from behind that edge. The observer watches the unclipped, untransformed
            wrapper, not the moving text, so it reliably fires the first time the footer is reached. */}
        <div
          ref={wordmarkRef}
          aria-hidden="true"
          className="-mx-4 sm:-mx-8 md:-mx-12 lg:-mx-16 mt-14 sm:mt-20 overflow-hidden select-none pointer-events-none"
        >
          <span
            className="block text-center font-syne font-extrabold leading-none tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-600 whitespace-nowrap transition-[transform,opacity] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{
              fontSize: 'clamp(4.5rem, 27vw, 30rem)',
              marginBottom: '-0.47em',
              transform: isWordmarkVisible ? 'translateY(0)' : 'translateY(55%)',
              opacity: isWordmarkVisible ? 1 : 0,
            }}
          >
            ZNX
          </span>
        </div>
      </div>
    </footer>
  );
}
