import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, X } from 'lucide-react';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import SubpageHeader from './SubpageHeader';
import { PROJECTS, PROJECT_DOMAINS, PROJECT_TYPES, Project } from '../data/projects';

interface WorksPageProps {
  onBackToHome: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenServices?: () => void;
  onOpenWorks?: () => void;
  onOpenAbout?: () => void;
  onOpenProject: (slug: string) => void;
}

const ALL = 'all';

// Remembered for the session so returning from a project page restores the same view
let lastFilters = { type: ALL, domain: ALL };

const matches = (project: Project, type: string, domain: string) =>
  (type === ALL || project.type === type) && (domain === ALL || project.domain === domain);

/** Compact native dropdown (used for Industry on desktop, and for both filters on mobile) */
function FilterSelect({
  label,
  value,
  allLabel,
  options,
  counts,
  onChange,
}: {
  label: string;
  value: string;
  allLabel: string;
  options: string[];
  counts: Record<string, number>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="relative flex min-w-0 flex-col gap-1.5">
      <span className="znx-label">{label}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-full border bg-[#121212] py-2.5 pl-4 pr-10 font-mono-tech text-xs uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
            value === ALL ? 'border-white/15 text-neutral-300' : 'border-white text-white'
          }`}
        >
          <option value={ALL}>{allLabel}</option>
          {options.map((option) => (
            <option key={option} value={option} disabled={counts[option] === 0 && option !== value}>
              {option} ({counts[option]})
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
      </span>
    </label>
  );
}

export default function WorksPage({
  onBackToHome,
  onOpenContact,
  onOpenPrivacy,
  onOpenServices,
  onOpenWorks,
  onOpenAbout,
  onOpenProject,
}: WorksPageProps) {
  const [selectedType, setSelectedType] = useState(lastFilters.type);
  const [selectedDomain, setSelectedDomain] = useState(lastFilters.domain);

  const updateFilters = (type: string, domain: string) => {
    lastFilters = { type, domain };
    setSelectedType(type);
    setSelectedDomain(domain);
  };

  const results = useMemo(
    () => PROJECTS.filter((project) => matches(project, selectedType, selectedDomain)),
    [selectedType, selectedDomain]
  );

  // Counts reflect the other active filter, so options that would show nothing are visible as (0)
  const typeCounts = useMemo(
    () => Object.fromEntries(PROJECT_TYPES.map((t) => [t, PROJECTS.filter((p) => matches(p, t, selectedDomain)).length])),
    [selectedDomain]
  );
  const domainCounts = useMemo(
    () => Object.fromEntries(PROJECT_DOMAINS.map((d) => [d, PROJECTS.filter((p) => matches(p, selectedType, d)).length])),
    [selectedType]
  );
  const allTypesCount = useMemo(() => PROJECTS.filter((p) => matches(p, ALL, selectedDomain)).length, [selectedDomain]);

  const isFiltered = selectedType !== ALL || selectedDomain !== ALL;
  const activeLabels = [selectedType, selectedDomain].filter((value) => value !== ALL);

  const chipClass = (isActive: boolean, isEmpty: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full border px-4 py-2 font-mono-tech text-[11px] uppercase tracking-wider transition-colors duration-300 ${
      isActive
        ? 'border-white bg-white text-black'
        : isEmpty
          ? 'border-white/10 text-neutral-600 cursor-not-allowed'
          : 'border-white/15 text-neutral-300 hover:border-white/50 hover:text-white cursor-pointer'
    }`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans select-none flex flex-col relative overflow-x-clip">
      <SubpageHeader onBackToHome={onBackToHome} onOpenContact={onOpenContact} />

      {/* 1. HERO */}
      <section className="w-full px-4 sm:px-8 pt-8 sm:pt-12 pb-8 sm:pb-12 flex flex-col items-center text-center">
        <ScrollReveal yOffset={20} duration={1}>
          <span className="znx-eyebrow mb-4">Selected Work</span>
        </ScrollReveal>
        <ScrollReveal yOffset={24} duration={1.1} delay={0.08}>
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[7.2rem] font-serif tracking-tight leading-[1.05] text-white font-normal max-w-6xl mx-auto">
            The work beh<span className="font-serif italic font-normal -mx-0.5">i</span>nd
            <br />
            the growth
          </h1>
        </ScrollReveal>
      </section>

      {/* 2. FILTERS: in normal flow above the grid, so they never cover cards or the footer */}
      <section aria-label="Filter projects" className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 md:px-8">
        <ScrollReveal yOffset={16} duration={0.9} delay={0.15}>
          {/* Desktop/tablet: every type of work visible as chips, industry as a compact dropdown */}
          <div className="hidden md:flex items-end justify-between gap-8 border-y border-white/10 py-5">
            <div className="flex min-w-0 flex-col gap-2.5">
              <span className="znx-label">Type of work</span>
              <div role="group" aria-label="Type of work" className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={selectedType === ALL}
                  onClick={() => updateFilters(ALL, selectedDomain)}
                  className={chipClass(selectedType === ALL, false)}
                >
                  All work <span className="opacity-60">{allTypesCount}</span>
                </button>
                {PROJECT_TYPES.map((type) => {
                  const isEmpty = typeCounts[type] === 0 && selectedType !== type;
                  return (
                    <button
                      key={type}
                      type="button"
                      aria-pressed={selectedType === type}
                      disabled={isEmpty}
                      onClick={() => updateFilters(type, selectedDomain)}
                      className={chipClass(selectedType === type, isEmpty)}
                    >
                      {type} <span className="opacity-60">{typeCounts[type]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="w-56 shrink-0">
              <FilterSelect
                label="Industry"
                value={selectedDomain}
                allLabel="All industries"
                options={PROJECT_DOMAINS}
                counts={domainCounts}
                onChange={(domain) => updateFilters(selectedType, domain)}
              />
            </div>
          </div>

          {/* Mobile: two compact dropdowns instead of a wall of chips */}
          <div className="grid grid-cols-2 gap-2 border-y border-white/10 py-4 md:hidden">
            <FilterSelect
              label="Type of work"
              value={selectedType}
              allLabel="All work"
              options={PROJECT_TYPES}
              counts={typeCounts}
              onChange={(type) => updateFilters(type, selectedDomain)}
            />
            <FilterSelect
              label="Industry"
              value={selectedDomain}
              allLabel="All industries"
              options={PROJECT_DOMAINS}
              counts={domainCounts}
              onChange={(domain) => updateFilters(selectedType, domain)}
            />
          </div>

          {/* Status: what is showing, and a one-tap way back to everything */}
          <div className="flex min-h-[2.75rem] items-center justify-between gap-4 py-3">
            <p className="znx-label" aria-live="polite">
              Showing {results.length} of {PROJECTS.length} projects
              {activeLabels.length > 0 && <span className="text-neutral-300"> · {activeLabels.join(' · ')}</span>}
            </p>
            {isFiltered && (
              <button
                type="button"
                onClick={() => updateFilters(ALL, ALL)}
                className="inline-flex shrink-0 items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-wider text-white hover:text-neutral-300 transition-colors cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Clear filters
              </button>
            )}
          </div>
        </ScrollReveal>
      </section>

      {/* 3. GRID: one result set fades out, the next fades in (opacity only; card boxes keep a fixed aspect
          ratio so heights never jump). mode="wait" also makes rapid filter changes resolve cleanly. */}
      <main className="w-full max-w-[1920px] mx-auto px-1 sm:px-2 md:px-3 pb-20 sm:pb-28 flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${selectedType}|${selectedDomain}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ opacity: 0, transition: { duration: 0.18, ease: 'easeIn' } }}
          >
            {results.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 md:gap-2.5">
                {results.map((project, idx) => (
                  <li key={project.id}>
                    <ScrollReveal staggerIndex={idx % 2} yOffset={30} duration={0.8}>
                      <a
                        href={`#/works/${project.slug}`}
                        onClick={(e) => {
                          e.preventDefault();
                          onOpenProject(project.slug);
                        }}
                        aria-label={`${project.title}: ${project.category}`}
                        className="relative group block w-full aspect-[16/10] sm:aspect-[16/10.2] rounded-md sm:rounded-lg"
                      >
                        {/* Image: on hover/focus the bottom edge crops up to reveal the caption (no zoom) */}
                        <div className="relative w-full h-full overflow-hidden rounded-md sm:rounded-lg bg-[#111] transition-[clip-path] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [clip-path:inset(0_0_0_0)] group-hover:[clip-path:inset(0_0_2.5rem_0)] group-focus-visible:[clip-path:inset(0_0_2.5rem_0)] [@media(hover:none)]:[clip-path:inset(0_0_2.5rem_0)]">
                          <img
                            src={project.image}
                            alt=""
                            referrerPolicy="no-referrer"
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center pointer-events-none select-none"
                          />
                        </div>

                        {/* Caption revealed beneath the cropped image */}
                        <div className="absolute bottom-0 inset-x-0 h-10 flex items-center justify-between gap-4 px-1.5 pb-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]">
                          <h3 className="truncate text-sm sm:text-base md:text-lg font-sans font-semibold text-white tracking-tight">
                            {project.title}
                          </h3>
                          <span className="hidden sm:block truncate text-xs sm:text-sm font-sans text-neutral-400">
                            {project.category}
                          </span>
                        </div>
                      </a>
                    </ScrollReveal>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center gap-5 rounded-lg border border-white/10 px-6 py-24 text-center">
                <p className="font-serif text-3xl sm:text-4xl text-white">No projects in this combination yet</p>
                <p className="max-w-md text-sm text-neutral-400">
                  Try another industry or type of work, or browse everything.
                </p>
                <button type="button" onClick={() => updateFilters(ALL, ALL)} className="znx-btn znx-btn-secondary">
                  Show all projects
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenServices={onOpenServices}
        onOpenWorks={onOpenWorks}
        onOpenAbout={onOpenAbout}
        onNavigateToHome={onBackToHome}
      />
    </div>
  );
}
