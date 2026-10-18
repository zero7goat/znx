import ScrollReveal from './ScrollReveal';

interface ProjectInquiryProps {
  onOpenContact?: () => void;
}

export default function Newsletter({ onOpenContact }: ProjectInquiryProps) {
  return (
    <section id="newsletter" className="relative z-30 w-full bg-[#05070a] text-white py-20 sm:py-28 md:py-36 px-6 sm:px-12 md:px-20 overflow-hidden select-none isolation-isolate">
      {/* Background Graphic resembling majestic forest / rocky surface */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-55 mix-blend-luminosity pointer-events-none transform-none transition-none"
        style={{ 
          backgroundImage: `url('https://i.pinimg.com/736x/35/41/e2/3541e2cf3038cf0e1bbf5054b548dd1b.jpg')`,
          filter: 'brightness(0.35) contrast(1.25)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
        
        {/* Left Side: Typography */}
        <ScrollReveal yOffset={25} duration={0.95} className="space-y-4 max-w-2xl">
          <p className="text-[11px] sm:text-[13px] font-manrope tracking-[0.25em] text-neutral-400 uppercase font-semibold">
            LET'S CREATE TOGETHER
          </p>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bodoni font-bold uppercase tracking-tight text-white leading-[1.05]">
            Have a project <br /> in mind?
          </h2>
        </ScrollReveal>

        {/* Right Side: GET IN TOUCH button */}
        <ScrollReveal
          xOffset={30}
          yOffset={0}
          duration={0.95}
          delay={0.1}
          className="w-full md:w-auto self-end md:self-center pt-6 md:pt-0"
        >
          <div 
            onClick={() => onOpenContact?.()}
            className="group flex items-center gap-4 cursor-pointer"
          >
            <div className="flex items-center gap-2.5 pb-1 border-b border-white/25 group-hover:border-white transition-colors duration-500">
              <span className="text-white text-xs sm:text-sm font-semibold font-manrope uppercase">
                →
              </span>
              <span className="text-white text-xs sm:text-sm font-semibold tracking-[0.15em] font-manrope uppercase whitespace-nowrap">
                GET IN TOUCH
              </span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
