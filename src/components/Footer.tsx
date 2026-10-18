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
  return (
    <footer className="w-full bg-[#0a0a0a] text-white select-none overflow-hidden border-t border-white/[0.08] relative z-40 isolation-isolate">
      <div className="w-full px-4 pt-10 pb-0 md:px-12 md:pt-20 lg:px-16 relative overflow-hidden flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Panel: Agency Statement */}
          <ScrollReveal yOffset={25} duration={0.9} className="md:col-span-6 space-y-3">
            <p className="text-lg sm:text-xl md:text-2xl lg:text-[1.8rem] leading-[1.25] font-light text-neutral-300 font-sans tracking-tight max-w-xl">
              <span className="font-syne font-extrabold text-white tracking-wide">ZNX</span> is an independent motion design agency and digital product studio.
            </p>
          </ScrollReveal>

          {/* Middle Panel: Navigation Link */}
          <ScrollReveal yOffset={25} duration={0.9} delay={0.1} className="md:col-span-3 space-y-3">
            <span className="text-[9px] font-mono-tech tracking-[0.25em] text-neutral-500 uppercase block font-semibold">
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
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer block text-left text-xs sm:text-sm font-sans font-normal"
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
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer block text-left text-xs sm:text-sm font-sans font-normal"
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
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer block text-left text-xs sm:text-sm font-sans font-normal"
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
                className="text-neutral-300 hover:text-white hover:translate-x-1 transition-all duration-300 cursor-pointer block text-left text-xs sm:text-sm font-sans font-normal"
              >
                Privacy Policy
              </button>
            </div>
          </ScrollReveal>

          {/* Right Panel: Social Pills Stacking */}
          <ScrollReveal yOffset={25} duration={0.9} delay={0.2} className="md:col-span-3 space-y-3">
            <span className="text-[9px] font-mono-tech tracking-[0.25em] text-neutral-500 uppercase block font-semibold">
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

        <div className="h-[20vw] sm:h-[15vw] md:h-[16vw] lg:h-[18vw] min-h-[75px]" />

        {/* Center-Bottom: ZNX Giant Letters */}
        <ScrollReveal yOffset={30} duration={1.1} className="absolute bottom-0 left-0 right-0 w-full overflow-hidden select-none pointer-events-none flex items-end justify-center h-[16vw] sm:h-[14vw] md:h-[15vw] min-h-[65px]">
          <h2 className="text-[27vw] sm:text-[26vw] md:text-[27vw] lg:text-[28vw] font-syne font-extrabold leading-none tracking-tighter text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-300 to-neutral-600 select-none block translate-y-[44%] sm:translate-y-[48%]">
            ZNX
          </h2>
        </ScrollReveal>
      </div>
    </footer>
  );
}
