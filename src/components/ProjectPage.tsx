import { ArrowLeft, ArrowRight } from 'lucide-react';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import SubpageHeader from './SubpageHeader';
import { PROJECTS, getProjectBySlug } from '../data/projects';

interface ProjectPageProps {
  slug: string;
  onBackToHome: () => void;
  onBackToWorks: () => void;
  onOpenProject: (slug: string) => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenServices?: () => void;
  onOpenAbout?: () => void;
}

/** Detail page for one portfolio project (#/works/<slug>). Shows only the data the project actually has. */
export default function ProjectPage({
  slug,
  onBackToHome,
  onBackToWorks,
  onOpenProject,
  onOpenContact,
  onOpenPrivacy,
  onOpenServices,
  onOpenAbout,
}: ProjectPageProps) {
  const project = getProjectBySlug(slug);
  const index = project ? PROJECTS.indexOf(project) : -1;
  const previous = index >= 0 ? PROJECTS[(index - 1 + PROJECTS.length) % PROJECTS.length] : undefined;
  const next = index >= 0 ? PROJECTS[(index + 1) % PROJECTS.length] : undefined;

  const backLink = (
    <a
      href="#/works"
      onClick={(e) => {
        e.preventDefault();
        onBackToWorks();
      }}
      className="group inline-flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-widest text-neutral-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
      All work
    </a>
  );

  const footer = (
    <Footer
      onOpenPrivacy={onOpenPrivacy}
      onOpenServices={onOpenServices}
      onOpenWorks={onBackToWorks}
      onOpenAbout={onOpenAbout}
      onNavigateToHome={onBackToHome}
    />
  );

  if (!project || !previous || !next) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col">
        <SubpageHeader onBackToHome={onBackToHome} onOpenContact={onOpenContact} />
        <main className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-32 text-center">
          <span className="znx-eyebrow">Project not found</span>
          <h1 className="znx-heading text-white">This project doesn't exist</h1>
          <p className="max-w-md text-neutral-400">The link may be outdated. Browse the full portfolio instead.</p>
          <button type="button" onClick={onBackToWorks} className="znx-btn znx-btn-primary">
            View all work
            <ArrowRight className="h-4 w-4" />
          </button>
        </main>
        {footer}
      </div>
    );
  }

  const facts = [
    { label: 'Type of work', value: project.type },
    { label: 'Industry', value: project.domain },
    { label: 'Discipline', value: project.category },
    { label: 'Project', value: `${String(index + 1).padStart(2, '0')} / ${String(PROJECTS.length).padStart(2, '0')}` },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col overflow-x-clip">
      <SubpageHeader onBackToHome={onBackToHome} onOpenContact={onOpenContact} />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-6 sm:pt-10 pb-20 sm:pb-28">
        {/* Title block */}
        <ScrollReveal yOffset={16} duration={0.8}>{backLink}</ScrollReveal>

        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-8">
            <ScrollReveal yOffset={20} duration={0.9} delay={0.05}>
              <span className="znx-eyebrow mb-4">{project.type}</span>
            </ScrollReveal>
            <ScrollReveal yOffset={24} duration={1} delay={0.1}>
              <h1 className="font-serif font-normal text-white tracking-tight leading-[1.02] text-[clamp(3rem,1.5rem+6vw,7.5rem)] [text-wrap:balance]">
                {project.title}
              </h1>
            </ScrollReveal>
            <ScrollReveal yOffset={20} duration={0.9} delay={0.15}>
              <p className="mt-4 text-lg sm:text-2xl text-neutral-300">{project.category}</p>
            </ScrollReveal>
          </div>

          {/* Project facts */}
          <ScrollReveal yOffset={20} duration={0.9} delay={0.2} className="lg:col-span-4">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-5">
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-1.5">
                  <dt className="znx-label">{fact.label}</dt>
                  <dd className="text-sm sm:text-base text-white">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>

        {/* Lead image */}
        <ScrollReveal yOffset={30} duration={1} delay={0.15} className="mt-10 sm:mt-14">
          <div className="relative w-full aspect-[16/10] max-h-[85svh] overflow-hidden rounded-lg bg-[#111]">
            <img
              src={project.image}
              alt={`${project.title}: ${project.category}`}
              referrerPolicy="no-referrer"
              fetchPriority="high"
              decoding="async"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          </div>
        </ScrollReveal>

        {/* Previous / next */}
        <nav aria-label="More projects" className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-2.5">
          {[
            { label: 'Previous project', item: previous, icon: <ArrowLeft className="h-4 w-4" /> },
            { label: 'Next project', item: next, icon: <ArrowRight className="h-4 w-4" /> },
          ].map(({ label, item, icon }) => (
            <a
              key={label}
              href={`#/works/${item.slug}`}
              onClick={(e) => {
                e.preventDefault();
                onOpenProject(item.slug);
              }}
              className="group relative flex items-end overflow-hidden rounded-lg aspect-[16/7] bg-[#111]"
            >
              <img
                src={item.image}
                alt=""
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover opacity-50 transition-opacity duration-500 group-hover:opacity-70 group-focus-visible:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative flex w-full items-end justify-between gap-4 p-5 sm:p-6">
                <div className="min-w-0">
                  <span className="znx-label text-neutral-300">{label}</span>
                  <p className="mt-1 truncate font-syne font-bold text-xl sm:text-2xl tracking-tight text-white">{item.title}</p>
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                  {icon}
                </span>
              </div>
            </a>
          ))}
        </nav>

        <div className="mt-10 flex justify-center">{backLink}</div>
      </main>

      {footer}
    </div>
  );
}
