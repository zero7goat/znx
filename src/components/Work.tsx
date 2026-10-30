import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PROJECTS } from '../data/projects';
import { useDragScroll } from '../utils/useDragScroll';

// TAZ (real product) plus the projects the homepage featured before, now linked to their pages
const FEATURED = PROJECTS.slice(0, 6);

interface WorkShowcaseProps {
  onOpenWorks?: () => void;
  onOpenProject: (slug: string) => void;
}

export default function WorkShowcase({ onOpenWorks, onOpenProject }: WorkShowcaseProps) {
  const railRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useDragScroll(railRef);

  // Enable/disable the arrow buttons at the rail ends (React bails out when the value is unchanged)
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const update = () => {
      setAtStart(rail.scrollLeft <= 2);
      setAtEnd(rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 2);
    };
    update();
    rail.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      rail.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const scrollByCard = (direction: 1 | -1) => {
    const rail = railRef.current;
    const card = rail?.querySelector('li');
    if (!rail || !card) return;
    const gap = parseFloat(getComputedStyle(rail).columnGap) || 0;
    rail.scrollBy({ left: direction * (card.getBoundingClientRect().width + gap), behavior: 'smooth' });
  };

  const arrowClass =
    'w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white active:scale-95 transition-[background-color,color,border-color,transform,opacity] duration-300 disabled:opacity-30 disabled:pointer-events-none';

  return (
    <section id="work" data-light="false" className="relative bg-[#0a0a0a] text-white py-24 sm:py-32 border-t border-white/10">
      {/* Heading row */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <ScrollReveal variant="mask" duration={1.1}>
            <span className="znx-eyebrow">Selected work</span>
          </ScrollReveal>
          <ScrollReveal variant="mask" duration={1.2} delay={0.08} className="mt-3">
            <h2 className="znx-heading text-white">Featured work</h2>
          </ScrollReveal>
        </div>

        <ScrollReveal yOffset={16} duration={1} delay={0.2} className="flex items-center gap-3">
          <button type="button" onClick={() => scrollByCard(-1)} disabled={atStart} aria-label="Scroll to previous projects" className={arrowClass}>
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => scrollByCard(1)} disabled={atEnd} aria-label="Scroll to next projects" className={arrowClass}>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => (onOpenWorks ? onOpenWorks() : (window.location.hash = '#/works'))} className="znx-btn znx-btn-primary ml-2">
            <span>View all work</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </ScrollReveal>
      </div>

      {/* Rail: native horizontal scroller (touch swipes, trackpads, wheel, keyboard), plus real-time mouse
          dragging via useDragScroll. Side padding lines the first card up with the content column. */}
      <ul
        ref={railRef}
        tabIndex={0}
        aria-label="Featured projects (scrolls horizontally)"
        className="znx-rail mt-10 sm:mt-14 flex gap-4 sm:gap-6 overflow-x-auto overscroll-x-contain pb-4 [--rail-pad:1.5rem] sm:[--rail-pad:2.5rem] lg:[--rail-pad:3rem] [@media(hover:none)]:snap-x [@media(hover:none)]:snap-mandatory"
        style={{
          paddingInline: 'max(var(--rail-pad), calc((100% - 80rem) / 2 + var(--rail-pad)))',
          scrollPaddingInline: 'max(var(--rail-pad), calc((100% - 80rem) / 2 + var(--rail-pad)))',
        }}
      >
        {FEATURED.map((project, idx) => (
          <li key={project.id} className="shrink-0 w-[80vw] sm:w-[54vw] lg:w-[34rem] snap-start">
            <ScrollReveal xOffset={70} yOffset={0} duration={1.2} staggerIndex={Math.min(idx, 3)} staggerStep={0.1}>
              <a
                href={`#/works/${project.slug}`}
                draggable={false}
                onClick={(e) => {
                  e.preventDefault();
                  onOpenProject(project.slug);
                }}
                className="group block rounded-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#111]">
                  <img
                    src={project.image}
                    alt=""
                    draggable={false}
                    referrerPolicy="no-referrer"
                    loading={idx < 3 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
                <div className="mt-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg sm:text-xl font-semibold tracking-tight text-white">{project.title}</h3>
                    <p className="mt-1 truncate text-sm text-neutral-400">{project.category}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 pt-1">
                    <span className="znx-label">{String(idx + 1).padStart(2, '0')}</span>
                    <ArrowUpRight className="h-4 w-4 text-neutral-500 transition-[color,transform] duration-300 group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>
            </ScrollReveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
