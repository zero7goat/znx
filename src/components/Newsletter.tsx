import ScrollReveal from './ScrollReveal';

interface ProjectInquiryProps {
  onOpenContact?: () => void;
}

export default function Newsletter({ onOpenContact }: ProjectInquiryProps) {
  return (
    <section id="newsletter" className="relative w-full bg-[#0a0a0a] text-white py-24 sm:py-32 md:py-36 px-6 sm:px-10 lg:px-12 overflow-hidden select-none isolate">
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
        <div className="max-w-2xl">
          <ScrollReveal variant="mask" duration={1.1}>
            <span className="znx-eyebrow">Let's create together</span>
          </ScrollReveal>
          {/* Each line rises from behind its own edge, one after the other */}
          <h2 className="znx-heading text-white mt-4">
            <ScrollReveal variant="mask" duration={1.25} delay={0.08}>Have a project</ScrollReveal>
            <ScrollReveal variant="mask" duration={1.25} delay={0.2}>in mind?</ScrollReveal>
          </h2>
        </div>

        {/* Right Side: GET IN TOUCH button */}
        <ScrollReveal
          xOffset={30}
          yOffset={0}
          duration={1.1}
          delay={0.35}
          className="w-full md:w-auto self-end md:self-center pt-6 md:pt-0"
        >
          <button
            type="button"
            onClick={() => onOpenContact?.()}
            className="group flex items-center gap-4 cursor-pointer"
          >
            <span className="flex items-center gap-2.5 pb-1 border-b border-white/25 group-hover:border-white transition-colors duration-500">
              <span className="text-white text-sm font-semibold">
                →
              </span>
              <span className="text-white text-sm sm:text-base font-semibold tracking-tight whitespace-nowrap">
                Get in touch
              </span>
            </span>
          </button>
        </ScrollReveal>

      </div>
    </section>
  );
}
