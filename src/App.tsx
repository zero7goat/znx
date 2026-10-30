import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import IntroScreen from './components/IntroScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import Services from './components/Services';
import Pricing from './components/Pricing';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ContactDrawer from './components/ContactDrawer';
import LiquidCursor from './components/LiquidCursor';
import { NavTab } from './types';
import { smoothScrollToElement } from './utils/smoothScroll';
import { initMouseParallax } from './utils/parallaxPerspective';
import { preloadRouteAssets } from './utils/assetPreloader';

// Lazy-loaded routes and heavy WebGL components
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const WorksPage = lazy(() => import('./components/WorksPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ProjectPage = lazy(() => import('./components/ProjectPage'));
const ThreeWorld = lazy(() => import('./components/ThreeWorld'));

type Page = 'home' | 'works' | 'project' | 'services' | 'about' | 'privacy';

const PROJECT_HASH_PREFIX = '#/works/';
const projectSlugFromHash = (hash: string) =>
  hash.startsWith(PROJECT_HASH_PREFIX) ? decodeURIComponent(hash.slice(PROJECT_HASH_PREFIX.length).split(/[?#]/)[0]) : '';

const pageFromHash = (hash: string): Page => {
  if (projectSlugFromHash(hash)) return 'project';
  if (hash.startsWith('#/services') || hash.startsWith('#services-page')) return 'services';
  if (hash === '#/about' || hash === '#about') return 'about';
  if (hash === '#/privacy' || hash === '#privacy') return 'privacy';
  if (hash === '#/works' || hash === '#works') return 'works';
  return 'home';
};

/** Which nav item is active on each page (none on the homepage) */
const TAB_FOR_PAGE: Partial<Record<Page, NavTab>> = { works: 'work', project: 'work', services: 'services', about: 'about' };

/** Identifies a distinct screen, so moving between two projects counts as navigation */
const routeKey = (page: Page, slug: string) => (page === 'project' ? `project:${slug}` : page);

// Matches the veil fade-in duration below
const VEIL_MS = 350;
const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const nextFrame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const [projectSlug, setProjectSlug] = useState('');
  const pageRef = useRef<Page>('home');
  const routeRef = useRef('home');
  // Scroll position on the Works page, restored when coming back from a project
  const worksScrollRef = useRef(0);
  const isServicesPageOpen = page === 'services';
  const isAboutPageOpen = page === 'about';
  const isPrivacyPageOpen = page === 'privacy';
  const isWorksPageOpen = page === 'works';

  // Global preloader for all critical website images and lazy route chunks
  useEffect(() => {
    // Prefetch lazy route chunks in background for instant transition
    import('./components/ServicesPage');
    import('./components/WorksPage');
    import('./components/AboutPage');
    import('./components/PrivacyPolicyPage');
    import('./components/ProjectPage');

    preloadRouteAssets('home');
  }, []);

  // Direct loads / refreshes: open the page the URL points to (e.g. #/works/luella)
  const initialRouteHandled = useRef(false);
  useEffect(() => {
    if (initialRouteHandled.current) return;
    initialRouteHandled.current = true;
    const target = pageFromHash(window.location.hash);
    if (target !== 'home') navigate(target, null);
  }, []);

  // Single navigation path: fade the veil in, swap the page underneath it, reset scroll, fade out.
  // `hash` is null when the navigation came from a hashchange (the URL is already correct).
  const navigate = async (target: Page, hash: string | null, afterSwap?: () => void) => {
    setIsPageTransitioning(true);

    // Preload destination assets while the veil covers the page, and never swap before it's opaque
    await Promise.all([preloadRouteAssets(target), wait(VEIL_MS)]);

    const from = pageRef.current;
    if (from === 'works' && target === 'project') worksScrollRef.current = window.scrollY;
    const slug = projectSlugFromHash(hash ?? window.location.hash);

    pageRef.current = target;
    routeRef.current = routeKey(target, slug);
    if (hash !== null && window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setPage(target);
    if (target === 'project') setProjectSlug(slug);
    if (target !== 'home') setShowIntro(false);

    // Returning from a project to Works restores where the visitor was in the grid
    if (!afterSwap && target === 'works' && from === 'project') {
      const y = worksScrollRef.current;
      afterSwap = () => window.scrollTo(0, y);
    }

    // Let React commit the new page before touching scroll
    await nextFrame();
    await nextFrame();
    if (afterSwap) {
      afterSwap();
    } else {
      window.scrollTo(0, 0);
    }

    setIsPageTransitioning(false);
  };

  // Sync route with window location hash (browser back/forward, links that set the hash)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const target = pageFromHash(hash);
      if (routeKey(target, projectSlugFromHash(hash)) !== routeRef.current) {
        navigate(target, null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenServicesPage = (serviceId?: string) => {
    // ServicesPage reads ?service= from the hash on mount and positions itself on that section
    navigate(
      'services',
      serviceId ? `#/services?service=${serviceId}` : '#/services',
      serviceId ? () => {} : undefined
    );
  };

  const handleOpenWorksPage = () => navigate('works', '#/works');
  const handleOpenPrivacyPage = () => navigate('privacy', '#/privacy');
  const handleOpenAboutPage = () => navigate('about', '#/about');
  const handleOpenProject = (slug: string) => navigate('project', `${PROJECT_HASH_PREFIX}${encodeURIComponent(slug)}`);

  const handleBackToHome = (targetSection?: string) => {
    navigate(
      'home',
      targetSection ? `#${targetSection}` : '',
      targetSection ? () => smoothScrollToElement(targetSection, 800) : undefined
    );
  };

  const handleOpenContact = () => {
    window.open('https://calendly.com/contactmeznx/project-call', '_blank');
  };

  const handleSelectTab = (tab: NavTab) => {
    if (tab === 'work') {
      // Navigate directly to Works page instead of scrolling to works section
      handleOpenWorksPage();
    } else if (tab === 'services') {
      handleOpenServicesPage();
    } else if (tab === 'about') {
      handleOpenAboutPage();
    } else if (page !== 'home') {
      handleBackToHome(tab);
    } else {
      smoothScrollToElement(tab, 950);
    }
  };

  // Isolated Progressive Enhancements (Effect 1: WebGL Cloth Simulation, Effect 2: 3D Mouse Parallax)
  useEffect(() => {
    if (showIntro) return;

    // Effect 1: Interactive WebGL Cloth Simulation for homepage cards
    // (loaded on demand so three.js stays out of the initial bundle)
    let cleanupCloth = () => {};
    let cancelled = false;
    import('./utils/clothSimulation').then(({ initAllCardClothSimulations }) => {
      if (!cancelled) cleanupCloth = initAllCardClothSimulations('.custom-hover-card');
    });

    // Effect 2: Smooth 3D Perspective Mouse-Parallax for Showreel
    const cleanupParallax = initMouseParallax({
      selector: '.parallax-bg-wrapper',
      maxRotateDeg: 6.5,
      maxTranslatePx: 18.0,
      damping: 0.08,
    });

    return () => {
      cancelled = true;
      cleanupCloth();
      cleanupParallax();
    };
  }, [showIntro]);


  return (
    <div className={`min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-white selection:text-black relative`}>
      {/* Cinematic Film Grain Noise Overlay (Desktop only to prevent mobile scroll layer recomposition) */}
      <div 
        className="hidden sm:block fixed inset-0 z-[999999] pointer-events-none opacity-[0.022]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <AnimatePresence>
        {showIntro && (
          <IntroScreen onComplete={() => setShowIntro(false)} />
        )}
      </AnimatePresence>

      {/* Top-Level Page Transition Curtain */}
      <AnimatePresence mode="wait">
        {isPageTransitioning && (
          <motion.div
            key="page-transition-veil"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99999] bg-[#0a0a0a] flex flex-col items-center justify-center pointer-events-auto select-none"
          >
            <div className="flex flex-col items-center gap-4">
              <img
                src="/Logo.png"
                alt="ZNX Studio"
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
                className="h-9 w-auto brightness-0 invert"
              />
              <div className="w-16 h-[2px] bg-white/10 overflow-hidden rounded-full relative">
                <div className="w-full h-full bg-white animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Router */}
      {!isPrivacyPageOpen && (
        <Navbar
          activeTab={TAB_FOR_PAGE[page] ?? null}
          onSelectTab={handleSelectTab}
          onOpenContact={handleOpenContact}
        />
      )}

      {/* WebGL snow-particle backdrop: shared by Home and Services and kept mounted between them.
          On Services it stays visible for the whole page (fullPage). */}
      {(page === 'home' || isServicesPageOpen) && (
        <Suspense fallback={null}>
          <ThreeWorld fullPage={isServicesPageOpen} />
        </Suspense>
      )}

      {/* Page content: the liquid ripple (LiquidCursor) distorts blocks inside data-liquid elements */}
      <div data-liquid>
      <Suspense fallback={null}>
        {isPrivacyPageOpen ? (
          <PrivacyPolicyPage
            onBackToHome={() => handleBackToHome()}
            onOpenContact={handleOpenContact}
            onOpenServices={handleOpenServicesPage}
            onOpenWorks={handleOpenWorksPage}
            onOpenAbout={handleOpenAboutPage}
          />
        ) : isAboutPageOpen ? (
          <AboutPage
            onBackToHome={() => handleBackToHome()}
            onOpenContact={handleOpenContact}
            onOpenPrivacy={handleOpenPrivacyPage}
            onOpenServices={handleOpenServicesPage}
            onOpenWorks={handleOpenWorksPage}
          />
        ) : isWorksPageOpen ? (
          <WorksPage
            onBackToHome={() => handleBackToHome()}
            onOpenContact={handleOpenContact}
            onOpenPrivacy={handleOpenPrivacyPage}
            onOpenServices={handleOpenServicesPage}
            onOpenWorks={handleOpenWorksPage}
            onOpenAbout={handleOpenAboutPage}
            onOpenProject={handleOpenProject}
          />
        ) : page === 'project' ? (
          <ProjectPage
            key={projectSlug}
            slug={projectSlug}
            onBackToHome={() => handleBackToHome()}
            onBackToWorks={handleOpenWorksPage}
            onOpenProject={handleOpenProject}
            onOpenContact={handleOpenContact}
            onOpenPrivacy={handleOpenPrivacyPage}
            onOpenServices={handleOpenServicesPage}
            onOpenAbout={handleOpenAboutPage}
          />
        ) : isServicesPageOpen ? (
          <ServicesPage
            onBackToHome={() => handleBackToHome()}
            onSelectTab={handleSelectTab}
            onOpenContact={handleOpenContact}
            onOpenPrivacy={handleOpenPrivacyPage}
          />
        ) : (
          <>
            <main id="top">
              {/* Section 1: Hero */}
              <Hero introDone={!showIntro} />

              {/* Section 2: Work */}
              <Work onOpenWorks={handleOpenWorksPage} onOpenProject={handleOpenProject} />

              {/* Section 3: Services */}
              <Services onOpenServices={handleOpenServicesPage} onOpenWorks={handleOpenWorksPage} />

              {/* Section 4: Pricing */}
              <Pricing onOpenContact={handleOpenContact} />
            </main>

            {/* Newsletter & Footer */}
            <Newsletter onOpenContact={handleOpenContact} />
            <Footer
              onOpenPrivacy={handleOpenPrivacyPage}
              onOpenServices={handleOpenServicesPage}
              onOpenWorks={handleOpenWorksPage}
              onOpenAbout={handleOpenAboutPage}
              onNavigateToHome={handleBackToHome}
            />
          </>
        )}
      </Suspense>
      </div>

      {/* Desktop-only liquid ripple over the page content (no layer of its own; off on touch, small screens, reduced motion) */}
      <LiquidCursor />

      {/* Modals & Drawers */}
      <ContactDrawer
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

