import { useEffect, useState, useRef, lazy, Suspense } from 'react';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'motion/react';
import IntroScreen from './components/IntroScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Work from './components/Work';
import Services from './components/Services';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ContactDrawer from './components/ContactDrawer';
import { NavTab } from './types';
import { smoothScrollToElement } from './utils/smoothScroll';
import { initAllCardClothSimulations } from './utils/clothSimulation';
import { initMouseParallax } from './utils/parallaxPerspective';

// Lazy-loaded routes and heavy WebGL components
const ServicesPage = lazy(() => import('./components/ServicesPage'));
const PrivacyPolicyPage = lazy(() => import('./components/PrivacyPolicyPage'));
const WorksPage = lazy(() => import('./components/WorksPage'));
const AboutPage = lazy(() => import('./components/AboutPage'));
const ThreeWorld = lazy(() => import('./components/ThreeWorld'));

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [activeTab, setActiveTab] = useState<NavTab>('work');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isServicesPageOpen, setIsServicesPageOpen] = useState(false);
  const [isAboutPageOpen, setIsAboutPageOpen] = useState(false);
  const [isPrivacyPageOpen, setIsPrivacyPageOpen] = useState(false);
  const [isWorksPageOpen, setIsWorksPageOpen] = useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  // Global preloader for all critical website images (including Services page assets)
  useEffect(() => {
    const imagesToPreload = [
      '/images/smallimg.avif',
      '/images/small img.avif',
      '/images/bigimg.avif',
      '/images/roselogo.png',
      '/images/Logo.png',
      'https://i.pinimg.com/1200x/2b/89/1f/2b891f6e5c20c30901939bd83d7d5e77.jpg',
      'https://i.pinimg.com/736x/0c/8e/1c/0c8e1c3cca5be58498a8df4106c4bc9c.jpg',
      'https://i.pinimg.com/1200x/df/79/aa/df79aaf64ed99b6f53270093ecab1aca.jpg',
      'https://i.pinimg.com/736x/b9/fb/e1/b9fbe1f7212bc95491709d5b919515c4.jpg',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1800&q=80',
      '/images/work1.jpg',
      '/images/work2.jpg',
      '/images/work3.jpg',
      '/images/work4.jpg',
      '/images/work5.jpg',
      '/images/services hero.avif',
      '/images/hero.avif',
      '/images/eye.avif',
      '/images/1221.avif',
      '/1221.avif',
    ];

    imagesToPreload.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Clear hash on first load to guarantee loading the homepage
  useEffect(() => {
    if (window.location.hash && window.location.hash !== '') {
      window.location.hash = '';
    }
  }, []);

  // Sync route with window location hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/services' || hash === '#services-page') {
        setIsServicesPageOpen(true);
        setIsAboutPageOpen(false);
        setIsPrivacyPageOpen(false);
        setIsWorksPageOpen(false);
        setActiveTab('services');
        setShowIntro(false);
      } else if (hash === '#/about' || hash === '#about') {
        setIsAboutPageOpen(true);
        setIsServicesPageOpen(false);
        setIsPrivacyPageOpen(false);
        setIsWorksPageOpen(false);
        setActiveTab('about');
        setShowIntro(false);
      } else if (hash === '#/privacy' || hash === '#privacy') {
        setIsPrivacyPageOpen(true);
        setIsAboutPageOpen(false);
        setIsServicesPageOpen(false);
        setIsWorksPageOpen(false);
        setShowIntro(false);
      } else if (hash === '#/works' || hash === '#works') {
        setIsWorksPageOpen(true);
        setIsAboutPageOpen(false);
        setIsServicesPageOpen(false);
        setIsPrivacyPageOpen(false);
        setActiveTab('work');
        setShowIntro(false);
      } else {
        setIsServicesPageOpen(false);
        setIsAboutPageOpen(false);
        setIsPrivacyPageOpen(false);
        setIsWorksPageOpen(false);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenServicesPage = () => {
    setIsPageTransitioning(true);
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    setTimeout(() => {
      setIsServicesPageOpen(true);
      setIsPrivacyPageOpen(false);
      setIsWorksPageOpen(false);
      setActiveTab('services');
      window.location.hash = '#/services';
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }, 400);

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 800);
  };

  const handleOpenWorksPage = () => {
    setIsPageTransitioning(true);
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    setTimeout(() => {
      setIsWorksPageOpen(true);
      setIsServicesPageOpen(false);
      setIsPrivacyPageOpen(false);
      setActiveTab('work');
      window.location.hash = '#/works';
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }, 400);

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 800);
  };

  const handleOpenPrivacyPage = () => {
    setIsPageTransitioning(true);
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    setTimeout(() => {
      setIsPrivacyPageOpen(true);
      setIsServicesPageOpen(false);
      setIsAboutPageOpen(false);
      setIsWorksPageOpen(false);
      window.location.hash = '#/privacy';
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }, 400);

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 800);
  };

  const handleOpenAboutPage = () => {
    setIsPageTransitioning(true);
    window.scrollTo(0, 0);
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    setTimeout(() => {
      setIsAboutPageOpen(true);
      setIsServicesPageOpen(false);
      setIsPrivacyPageOpen(false);
      setIsWorksPageOpen(false);
      setActiveTab('about');
      window.location.hash = '#/about';
      window.scrollTo(0, 0);
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }, 400);

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 800);
  };

  const handleBackToHome = (targetSection?: string) => {
    setIsPageTransitioning(true);
    setTimeout(() => {
      setIsServicesPageOpen(false);
      setIsAboutPageOpen(false);
      setIsPrivacyPageOpen(false);
      setIsWorksPageOpen(false);
      window.location.hash = targetSection ? `#${targetSection}` : '';

      requestAnimationFrame(() => {
        setTimeout(() => {
          if (targetSection) {
            smoothScrollToElement(targetSection, 800);
          } else {
            window.scrollTo(0, 0);
            if (lenisRef.current) {
              lenisRef.current.scrollTo(0, { immediate: true });
            }
          }
        }, 50);
      });
    }, 400);

    setTimeout(() => {
      setIsPageTransitioning(false);
    }, 850);
  };

  const handleOpenContact = () => {
    window.open('https://calendly.com/contactmeznx/project-call', '_blank');
  };

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'work') {
      // Navigate directly to Works page instead of scrolling to works section
      handleOpenWorksPage();
    } else if (tab === 'services') {
      handleOpenServicesPage();
    } else if (tab === 'about') {
      handleOpenAboutPage();
    } else {
      if (isServicesPageOpen || isWorksPageOpen || isPrivacyPageOpen || isAboutPageOpen) {
        handleBackToHome(tab);
      } else {
        smoothScrollToElement(tab, 950);
      }
    }
  };

  // Initialize Lenis smooth scroll globally across all pages and views
  useEffect(() => {
    if (showIntro) return;

    const lenis = new Lenis({
      lerp: 0.035, // Very heavy, ultra-smooth, slow momentum drag
      duration: 2.2, // Extended 2.2s slow gliding deceleration
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Natural exponential deceleration
      smoothWheel: true,
      wheelMultiplier: 0.55, // 0.55 multiplier makes mouse wheel movement noticeably slower, controlled, and heavy
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;
    (window as any).lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      if ((window as any).lenis === lenis) {
        delete (window as any).lenis;
      }
    };
  }, [showIntro]);

  // Isolated Progressive Enhancements (Effect 1: WebGL Cloth Simulation, Effect 2: 3D Mouse Parallax)
  useEffect(() => {
    if (showIntro) return;

    // Effect 1: Interactive WebGL Cloth Simulation for homepage cards
    const cleanupCloth = initAllCardClothSimulations('.custom-hover-card');

    // Effect 2: Smooth 3D Perspective Mouse-Parallax for Showreel
    const cleanupParallax = initMouseParallax({
      selector: '.parallax-bg-wrapper',
      maxRotateDeg: 6.5,
      maxTranslatePx: 18.0,
      damping: 0.08,
    });

    return () => {
      cleanupCloth();
      cleanupParallax();
    };
  }, [showIntro]);

  const isSubpageOpen = isPrivacyPageOpen || isWorksPageOpen || isServicesPageOpen;

  return (
    <div className={`min-h-screen ${isSubpageOpen ? 'bg-[#EBE8E1] text-slate-900' : 'bg-[#05070a] text-white'} font-sans selection:bg-slate-900 selection:text-white relative transition-colors duration-700`}>
      {/* Cinematic Film Grain Noise Overlay (Desktop only to prevent mobile scroll layer recomposition) */}
      <div 
        className="hidden sm:block fixed inset-0 z-[999999] pointer-events-none opacity-[0.022] mix-blend-overlay"
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
            className="fixed inset-0 z-[99999] bg-[#EBE8E1] flex flex-col items-center justify-center pointer-events-none select-none"
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
                className="h-9 w-auto brightness-0"
              />
              <div className="w-16 h-[2px] bg-slate-200 overflow-hidden rounded-full relative">
                <div className="w-full h-full bg-slate-900 animate-pulse" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Router */}
      {!isPrivacyPageOpen && (
        <Navbar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          onOpenContact={handleOpenContact}
        />
      )}

      <Suspense fallback={null}>
        {isPrivacyPageOpen ? (
          <PrivacyPolicyPage
            onBackToHome={() => handleBackToHome()}
            onOpenContact={handleOpenContact}
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
            {/* WebGL 3D Interactive Background Layer (Cinematic Kage experience translated to ZNX) */}
            <ThreeWorld />

            <main id="top">
              {/* Section 1: Hero */}
              <Hero />

              {/* Section 2: Work */}
              <Work onOpenWorks={handleOpenWorksPage} />

              {/* Section 3: Services */}
              <Services onOpenWorks={handleOpenWorksPage} />
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

      {/* Modals & Drawers */}
      <ContactDrawer
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}

