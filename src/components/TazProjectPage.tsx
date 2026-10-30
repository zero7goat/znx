import { ReactNode } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  FileLock,
  FileSpreadsheet,
  Fingerprint,
  FolderTree,
  KeyRound,
  NotebookPen,
  WifiOff,
  Folder,
  Lock,
} from 'lucide-react';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import SubpageHeader from './SubpageHeader';
import { Project } from '../data/projects';

interface TazProjectPageProps {
  project: Project;
  onBackToHome: () => void;
  onBackToWorks: () => void;
  onOpenContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenServices?: () => void;
  onOpenAbout?: () => void;
}

// TAZ palette: near-black / charcoal surfaces with a restrained acid-lime accent
const LIME = '#C6FF5E';

// Capabilities exactly as described in the product brief (no extra claims)
const FEATURES: { icon: ReactNode; title: string; text: string }[] = [
  { icon: <KeyRound className="h-5 w-5" />, title: 'Password management', text: 'Keep account passwords in one organised vault instead of scattered across apps and documents.' },
  { icon: <NotebookPen className="h-5 w-5" />, title: 'Private notes', text: 'Write personal notes and keep them alongside the rest of your private information.' },
  { icon: <FileLock className="h-5 w-5" />, title: 'File storage', text: 'Store files in the vault, next to the passwords and notes they belong with.' },
  { icon: <FolderTree className="h-5 w-5" />, title: 'Custom folders', text: 'Create your own folders and organise entries the way you think about them.' },
  { icon: <Fingerprint className="h-5 w-5" />, title: 'Biometric authentication', text: 'Unlock with biometrics on devices that support it.' },
  { icon: <FileSpreadsheet className="h-5 w-5" />, title: 'Excel backup & export', text: 'Export your vault to an Excel file to keep a backup or take your data elsewhere.' },
  { icon: <WifiOff className="h-5 w-5" />, title: 'Offline access', text: 'Information stored locally stays available without an internet connection.' },
];

const PRINCIPLES = [
  { title: 'Privacy', text: 'Local-first by design: your vault lives on your device and is built around offline use.' },
  { title: 'Organisation', text: 'Passwords, notes and files sit together, grouped in folders you define.' },
  { title: 'Simplicity', text: 'A straightforward interface that keeps the essentials close and the noise out.' },
  { title: 'Control', text: 'Biometric access where supported, and Excel export so a copy of your data is always within reach.' },
];

/** Small mono label, lime-tinted for TAZ */
function TazLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono-tech text-[11px] uppercase tracking-[0.2em] ${className}`} style={{ color: LIME }}>
      {children}
    </span>
  );
}

function IllustrativeNote() {
  return (
    <p className="mt-3 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-neutral-500">
      Illustrative interface — not a product screenshot
    </p>
  );
}

/** Illustrative vault interface (CSS composition, only shows capabilities from the brief) */
function VaultIllustration() {
  const folders = [
    { name: 'All items', active: true },
    { name: 'Passwords' },
    { name: 'Notes' },
    { name: 'Files' },
  ];
  const custom = ['Personal', 'Work'];
  const items = [
    { icon: <KeyRound className="h-4 w-4" />, title: 'Email account', meta: '••••••••••••', kind: 'Password' },
    { icon: <KeyRound className="h-4 w-4" />, title: 'Online banking', meta: '••••••••••', kind: 'Password' },
    { icon: <NotebookPen className="h-4 w-4" />, title: 'Home Wi-Fi details', meta: 'Note', kind: 'Note' },
    { icon: <FileLock className="h-4 w-4" />, title: 'Passport scan.pdf', meta: 'File', kind: 'File' },
    { icon: <NotebookPen className="h-4 w-4" />, title: 'Recovery codes', meta: 'Note', kind: 'Note' },
  ];

  return (
    <div aria-hidden="true" className="overflow-hidden rounded-xl border border-white/10 bg-[#111214] text-left shadow-2xl shadow-black/50">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <span className="font-syne text-sm font-bold tracking-tight text-white">TAZ</span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-neutral-300">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: LIME }} />
          Unlocked
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[11rem_1fr]">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col gap-1 border-r border-white/[0.07] p-3">
          {folders.map((folder) => (
            <span
              key={folder.name}
              className={`rounded-md px-2.5 py-1.5 text-xs ${folder.active ? 'bg-white/[0.06] text-white' : 'text-neutral-400'}`}
            >
              {folder.name}
            </span>
          ))}
          <span className="mt-3 px-2.5 font-mono-tech text-[9px] uppercase tracking-[0.2em] text-neutral-500">Folders</span>
          {custom.map((name) => (
            <span key={name} className="flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-neutral-400">
              <Folder className="h-3.5 w-3.5" />
              {name}
            </span>
          ))}
        </div>

        {/* Item list */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <span className="text-sm font-semibold text-white">All items</span>
            <span className="font-mono-tech text-[10px] uppercase tracking-wider text-neutral-500">{items.length} entries</span>
          </div>
          <ul className="px-2 pb-2">
            {items.map((item, idx) => (
              <li
                key={item.title}
                className={`flex items-center gap-3 rounded-lg px-2 py-2.5 ${idx === 0 ? 'bg-white/[0.04]' : ''}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-white/10 text-neutral-300">
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] text-white">{item.title}</span>
                  <span className="block truncate font-mono-tech text-[11px] text-neutral-500">{item.meta}</span>
                </span>
                <span className="hidden md:block font-mono-tech text-[10px] uppercase tracking-wider text-neutral-500">{item.kind}</span>
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.07] px-4 py-3">
            <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-neutral-500">
              <WifiOff className="h-3.5 w-3.5" />
              Stored on this device
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 font-mono-tech text-[10px] uppercase tracking-wider text-neutral-300">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              Export to Excel
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Illustrative biometric unlock state */
function UnlockIllustration() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col items-center justify-center gap-5 rounded-xl border border-white/10 bg-[#111214] px-6 py-12 text-center">
      <span className="font-syne text-2xl font-bold tracking-tight text-white">TAZ</span>
      <span
        className="flex h-20 w-20 items-center justify-center rounded-full border"
        style={{ borderColor: `${LIME}66`, color: LIME }}
      >
        <Fingerprint className="h-9 w-9" />
      </span>
      <span className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-white">Unlock your vault</span>
        <span className="text-xs text-neutral-500">Use biometrics to continue</span>
      </span>
      <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-wider text-neutral-500">
        <Lock className="h-3.5 w-3.5" />
        Vault locked
      </span>
    </div>
  );
}

/** Illustrative folder organisation view */
function FoldersIllustration() {
  const groups = [
    { name: 'Personal', counts: '6 passwords · 3 notes · 2 files' },
    { name: 'Work', counts: '9 passwords · 1 note' },
    { name: 'Home', counts: '2 notes · 4 files' },
  ];
  return (
    <div aria-hidden="true" className="flex h-full flex-col rounded-xl border border-white/10 bg-[#111214] p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-white">Folders</span>
        <span className="font-mono-tech text-[10px] uppercase tracking-wider" style={{ color: LIME }}>+ New folder</span>
      </div>
      <ul className="mt-4 flex flex-col gap-2">
        {groups.map((group) => (
          <li key={group.name} className="flex items-center gap-3 rounded-lg border border-white/[0.07] px-3 py-3">
            <Folder className="h-4 w-4 text-neutral-300" />
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] text-white">{group.name}</span>
              <span className="block truncate font-mono-tech text-[11px] text-neutral-500">{group.counts}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Bespoke case-study page for TAZ, served from the standard project route (#/works/taz) */
export default function TazProjectPage({
  project,
  onBackToHome,
  onBackToWorks,
  onOpenContact,
  onOpenPrivacy,
  onOpenServices,
  onOpenAbout,
}: TazProjectPageProps) {
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

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-white font-sans flex flex-col overflow-x-clip selection:bg-[#C6FF5E] selection:text-black">
      <SubpageHeader onBackToHome={onBackToHome} onOpenContact={onOpenContact} />

      <main className="flex-1">
        {/* 1. HERO */}
        <section className="relative">
          {/* Subtle vault grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
          <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-8 pt-6 sm:pt-10 pb-16 sm:pb-24">
            <ScrollReveal yOffset={16} duration={0.8}>{backLink}</ScrollReveal>

            <div className="mt-10 sm:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              <div className="lg:col-span-5">
                <ScrollReveal yOffset={20} duration={0.9} delay={0.05}>
                  <TazLabel>ZNX product · {project.category}</TazLabel>
                </ScrollReveal>
                <ScrollReveal yOffset={24} duration={1} delay={0.1}>
                  <h1 className="mt-5 font-syne font-extrabold leading-[0.9] tracking-[-0.04em] text-white text-[clamp(5rem,3rem+9vw,10rem)]">
                    {project.title}
                  </h1>
                </ScrollReveal>
                <ScrollReveal yOffset={20} duration={0.9} delay={0.15}>
                  <p className="mt-6 text-2xl sm:text-3xl font-semibold tracking-tight text-white [text-wrap:balance]">
                    Private by design. <span className="text-neutral-400">Yours by default.</span>
                  </p>
                  <p className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-neutral-300">
                    TAZ is a personal digital vault designed to bring essential private information into one secure,
                    organized space. It brings passwords, private notes, and files together in an interface built around
                    control, simplicity, and offline accessibility.
                  </p>
                </ScrollReveal>
                <ScrollReveal yOffset={16} duration={0.9} delay={0.2}>
                  <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6">
                    {[
                      { label: 'Product', value: 'Personal vault' },
                      { label: 'Approach', value: 'Local-first, offline' },
                      { label: 'Keeps', value: 'Passwords, notes, files' },
                      { label: 'Built by', value: 'ZNX' },
                    ].map((fact) => (
                      <div key={fact.label} className="flex flex-col gap-1.5">
                        <dt className="znx-label">{fact.label}</dt>
                        <dd className="text-sm sm:text-base text-white">{fact.value}</dd>
                      </div>
                    ))}
                  </dl>
                </ScrollReveal>
              </div>

              <div className="lg:col-span-7">
                <ScrollReveal yOffset={30} duration={1.1} delay={0.15}>
                  <VaultIllustration />
                  <IllustrativeNote />
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>

        {/* 2. OVERVIEW */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-4 sm:px-8 py-16 sm:py-24 lg:grid-cols-12 lg:gap-14">
            <ScrollReveal yOffset={20} duration={0.9} className="lg:col-span-5">
              <TazLabel>Overview</TazLabel>
              <h2 className="mt-4 font-syne text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                Your information. Your control.
              </h2>
            </ScrollReveal>
            <ScrollReveal yOffset={20} duration={0.9} delay={0.08} className="lg:col-span-7 lg:pt-2">
              <p className="text-lg sm:text-2xl leading-relaxed text-neutral-300 [text-wrap:pretty]">
                Personal information ends up scattered across apps, folders, and documents. TAZ brings it together in one
                place, combining a straightforward interface with security-focused access and flexible organization.
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* 3. FEATURES */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 py-16 sm:py-24">
            <ScrollReveal yOffset={20} duration={0.9}>
              <TazLabel>Features</TazLabel>
              <h2 className="mt-4 max-w-2xl font-syne text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                Everything private, in one vault.
              </h2>
            </ScrollReveal>

            {/* Hairline grid: 1px gaps over a border-coloured background */}
            <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, idx) => (
                <li key={feature.title} className="bg-[#0b0b0c]">
                  <ScrollReveal yOffset={16} duration={0.8} staggerIndex={idx % 4} className="flex h-full flex-col gap-5 p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white">
                        {feature.icon}
                      </span>
                      <span className="font-mono-tech text-[11px] tracking-widest text-neutral-600">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold tracking-tight text-white">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-400">{feature.text}</p>
                    </div>
                  </ScrollReveal>
                </li>
              ))}
              {/* Eighth cell keeps the 2- and 4-column grids even, carrying the tagline instead of an empty box */}
              <li className="hidden bg-[#0b0b0c] sm:flex items-end p-7">
                <p className="font-syne text-xl font-bold leading-tight tracking-tight" style={{ color: LIME }}>
                  Private by design.
                  <br />
                  Yours by default.
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* 4. DESIGN PHILOSOPHY */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 py-16 sm:py-24">
            <ScrollReveal yOffset={20} duration={0.9}>
              <TazLabel>Design philosophy</TazLabel>
              <h2 className="mt-4 max-w-2xl font-syne text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                Built around four principles.
              </h2>
            </ScrollReveal>
            <ol className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {PRINCIPLES.map((principle, idx) => (
                <li key={principle.title}>
                  <ScrollReveal yOffset={16} duration={0.8} staggerIndex={idx} className="border-t border-white/10 pt-5">
                    <div className="h-px w-10 -mt-5 mb-5" style={{ backgroundColor: LIME }} />
                    <span className="font-mono-tech text-[11px] tracking-widest text-neutral-500">
                      ({String(idx + 1).padStart(2, '0')})
                    </span>
                    <h3 className="mt-3 font-syne text-2xl font-bold tracking-tight text-white">{principle.title}</h3>
                    <p className="mt-3 text-sm sm:text-base leading-relaxed text-neutral-400">{principle.text}</p>
                  </ScrollReveal>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. PRODUCT SHOWCASE (illustrative until real screenshots are supplied) */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-8 py-16 sm:py-24">
            <ScrollReveal yOffset={20} duration={0.9}>
              <TazLabel>Product showcase</TazLabel>
              <h2 className="mt-4 max-w-2xl font-syne text-3xl sm:text-5xl font-bold tracking-tight text-white leading-[1.05]">
                Unlock, organise, find.
              </h2>
            </ScrollReveal>
            <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-12">
              <ScrollReveal yOffset={24} duration={1} className="lg:col-span-4">
                <UnlockIllustration />
              </ScrollReveal>
              <ScrollReveal yOffset={24} duration={1} delay={0.08} className="lg:col-span-8">
                <FoldersIllustration />
              </ScrollReveal>
            </div>
            <IllustrativeNote />
          </div>
        </section>

        {/* 6. BUILT BY ZNX */}
        <section className="border-t border-white/[0.08]">
          <div className="mx-auto flex w-full max-w-[1400px] flex-col items-start gap-8 px-4 sm:px-8 py-16 sm:py-24 lg:flex-row lg:items-end lg:justify-between">
            <ScrollReveal yOffset={20} duration={0.9}>
              <span className="znx-eyebrow">Built by ZNX</span>
              <h2 className="znx-heading mt-4 text-white">Designed &amp; developed in-house</h2>
              <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-neutral-300">
                TAZ is a ZNX product, designed and developed by the studio.
              </p>
            </ScrollReveal>
            <ScrollReveal yOffset={20} duration={0.9} delay={0.08} className="flex flex-wrap gap-3">
              <button type="button" onClick={onBackToWorks} className="znx-btn znx-btn-primary">
                <ArrowLeft className="h-4 w-4" />
                Back to all work
              </button>
              {onOpenContact && (
                <button type="button" onClick={onOpenContact} className="znx-btn znx-btn-secondary">
                  Start a project
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer
        onOpenPrivacy={onOpenPrivacy}
        onOpenServices={onOpenServices}
        onOpenWorks={onBackToWorks}
        onOpenAbout={onOpenAbout}
        onNavigateToHome={onBackToHome}
      />
    </div>
  );
}
