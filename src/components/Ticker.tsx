import React from 'react';
import { motion } from 'motion/react';

const tickerItems = [
  { prefix: "Motion ", highlight: "Designing" },
  { prefix: "A", highlight: "I" },
  { prefix: "Script", highlight: "writing" },
  { prefix: "Sound ", highlight: "Design" },
  { prefix: "Color ", highlight: "Grading" },
];

export default function Ticker() {
  return (
    <div className="w-full bg-transparent py-8 sm:py-12 overflow-hidden select-none relative z-10">
      <div className="flex w-max">
        {/* Seamless Track 1 */}
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 22,
          }}
        >
          {tickerItems.map((item, index) => (
            <div key={`track1-${index}`} className="flex items-center">
              <span className="text-4xl sm:text-6xl md:text-7xl font-display tracking-tighter uppercase font-black select-none">
                {/* Hollow/Outline Prefix part for gorgeous high-contrast pairing */}
                <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] sm:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)] mr-4 select-none">
                  {item.prefix}
                </span>
                {/* Highlight part in premium topic copper colors */}
                <span className="text-[#fb5d30] font-black select-none">
                  {item.highlight}
                </span>
              </span>
              
              {/* Ultra-premium blinking red recording dot */}
              <span className="mx-10 sm:mx-16 flex h-3 w-3 sm:h-4 sm:w-4 relative flex-shrink-0 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-red-600 shadow-[0_0_14px_#ef4444] animate-pulse"></span>
              </span>
            </div>
          ))}
        </motion.div>

        {/* Seamless Track 2 (Identical mirror for perfect loop) */}
        <motion.div
          className="flex items-center whitespace-nowrap"
          aria-hidden="true"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 22,
          }}
        >
          {tickerItems.map((item, index) => (
            <div key={`track2-${index}`} className="flex items-center">
              <span className="text-4xl sm:text-6xl md:text-7xl font-display tracking-tighter uppercase font-black select-none">
                {/* Hollow/Outline Prefix part for gorgeous high-contrast pairing */}
                <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.4)] sm:[-webkit-text-stroke:1.5px_rgba(255,255,255,0.4)] mr-4 select-none">
                  {item.prefix}
                </span>
                {/* Highlight part in premium topic copper colors */}
                <span className="text-[#fb5d30] font-black select-none">
                  {item.highlight}
                </span>
              </span>
              
              {/* Ultra-premium blinking red recording dot */}
              <span className="mx-10 sm:mx-16 flex h-3 w-3 sm:h-4 sm:w-4 relative flex-shrink-0 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-red-600 shadow-[0_0_14px_#ef4444] animate-pulse"></span>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
