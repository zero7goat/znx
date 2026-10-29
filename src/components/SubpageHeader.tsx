import React from 'react';
import { ArrowUpRight } from 'lucide-react';

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

interface SubpageHeaderProps {
  onBackToHome: () => void;
  onOpenContact?: () => void;
}

/** Logo (back to home) + "Let's talk" bar used at the top of the Works and project pages */
export default function SubpageHeader({ onBackToHome, onOpenContact }: SubpageHeaderProps) {
  return (
    <header className="w-full px-4 sm:px-8 py-6 flex items-center justify-between bg-transparent relative z-40">
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onBackToHome();
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

      {onOpenContact ? (
        <button
          onClick={onOpenContact}
          className="group flex items-center gap-1.5 text-[12px] font-semibold tracking-wider uppercase py-1 px-1 transition-colors duration-500 text-white hover:text-white/75 cursor-pointer"
        >
          <FlipBlock hoverColorClass="text-white/70">
            <span>LET'S TALK</span>
            <ArrowUpRight className="w-4 h-4" />
          </FlipBlock>
        </button>
      ) : (
        <div className="w-10 sm:w-11" />
      )}
    </header>
  );
}
