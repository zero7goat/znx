import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowLeft, ArrowUpRight, ShieldCheck, ArrowRight } from 'lucide-react';
import Footer from './Footer';
import Newsletter from './Newsletter';
import ScrollReveal from './ScrollReveal';

interface PrivacyPolicyPageProps {
  onBackToHome: (section?: string) => void;
  onOpenContact?: () => void;
}

function SquareProjectButton({ onClick }: { onClick?: () => void }) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 300, mass: 0.1 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 2);
    mouseX.set(relX * 32);
    mouseY.set(relY * 32);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <button
      ref={btnRef}
      onClick={onClick}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 shrink-0 rounded-none bg-gradient-to-br from-[#FFF5EC] via-[#FFE2D1] to-[#FCE3D8] text-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden cursor-pointer select-none border-none outline-none focus:outline-none"
    >
      <motion.div
        style={{
          x: springX,
          y: springY,
        }}
        className="flex flex-col items-center justify-center gap-2 text-center pointer-events-none"
      >
        <span className="text-xs sm:text-sm font-mono-tech font-black uppercase tracking-widest leading-tight text-slate-950">
          START A<br />PROJECT
        </span>
        <ArrowRight className="w-5 h-5 text-slate-900" />
      </motion.div>
    </button>
  );
}

export default function PrivacyPolicyPage({
  onBackToHome,
  onOpenContact,
}: PrivacyPolicyPageProps) {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="min-h-screen bg-[#070707] text-slate-100 font-sans selection:bg-[#FF3B00] selection:text-white"
    >
      {/* Top Header */}
      <header className="w-full px-6 sm:px-12 py-6 flex items-center justify-between bg-transparent relative z-40 border-b border-slate-900/60">
        {/* Left: ZNX Logo replacing back arrow */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (onBackToHome) onBackToHome();
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

        {/* Center: Brand name */}
        <span className="text-xs font-mono-tech tracking-[0.25em] text-slate-400 uppercase hidden sm:block">
          ZNX STUDIO • LEGAL
        </span>

        {/* Right: Contact button */}
        {onOpenContact && (
          <button
            onClick={onOpenContact}
            className="group flex items-center gap-1.5 text-xs font-mono-tech tracking-wider uppercase text-slate-300 hover:text-white transition-colors focus:outline-none"
          >
            <span>LET'S TALK</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        )}
      </header>

      {/* Main Content Container */}
      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
        
        {/* Header Title Section */}
        <ScrollReveal yOffset={25} duration={0.9} className="mb-16 border-b border-slate-800/80 pb-12">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bodoni font-bold tracking-tight text-white uppercase mb-6">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm font-mono-tech text-slate-400 tracking-wide uppercase mb-6">
            Effective date: October 17, 2026
          </p>

          <p className="text-base sm:text-lg text-slate-300 font-sans font-light leading-relaxed max-w-3xl">
            This Privacy Policy explains how ZNX Studio collects, uses and protects personal data when you visit <span className="text-white font-normal underline underline-offset-4">studio-znx.com</span> (the "Site") or contact us. Please read it alongside our Cookie Preferences and Terms of Use.
          </p>
        </ScrollReveal>

        {/* Policy Body Content (No clickable links in explanations) */}
        <div className="space-y-16 text-slate-300 font-sans text-sm sm:text-base leading-relaxed">
          
          {/* 1. Who we are */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Who we are
            </h2>
            <p className="text-slate-300 leading-relaxed font-light">
              ZNX Studio Media LLC ("ZNX Studio," "we," "us") is the controller of personal data collected through the Site.
            </p>
            <p className="text-slate-300 leading-relaxed font-light">
              You can reach us about any privacy matter at{' '}
              <a href="mailto:contactmeznx@gmail.com" className="text-white font-mono-tech font-bold uppercase tracking-wider underline hover:text-slate-200 transition-colors">
                contactmeznx@gmail.com
              </a>.
            </p>
          </section>

          {/* 2. What we collect */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              What we collect
            </h2>

            <div className="space-y-4 font-light">
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white font-semibold">Analytics data.</strong> When you visit the Site, we use Google Analytics 4 (GA4) to understand how the Site is used. GA4 and its cookies may collect information such as the pages you view, how long you spend on them, your approximate location based on your IP address, your device and browser type, and how you arrived at the Site. We only collect this data when you have consented to analytics cookies.
              </p>

              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white font-semibold">Booking an introductory call.</strong> Introductory calls are booked through a third-party scheduling provider on its own platform and are subject to its privacy policy. We receive the information you choose to provide, such as your name, email address, and details about your project, so we can arrange and conduct the call.
              </p>

              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white font-semibold">Contacting us directly.</strong> If you contact us by email, we receive the information you choose to include in your message.
              </p>

              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white font-semibold">Technical and server data.</strong> Our hosting provider automatically logs standard technical information, such as IP addresses and request data, to help maintain the security, reliability, and proper operation of the Site.
              </p>
            </div>
          </section>

          {/* 3. How we use personal data */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              How we use personal data
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              We use the data described above to:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light text-slate-300">
              <li>measure and improve the performance of the Site and understand how people use it (analytics);</li>
              <li>respond to your enquiries and arrange and conduct introductory calls;</li>
              <li>maintain the security and reliability of the Site; and</li>
              <li>comply with our legal and regulatory obligations.</li>
            </ul>
          </section>

          {/* 4. Who We Share Data With */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Who We Share Data With
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              We do not sell your personal data. We only share it with service providers that help us operate and maintain the Site:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light text-slate-300">
              <li>
                <strong className="text-white font-semibold">Google (Google Analytics 4)</strong> processes Site usage data to help us understand how the Site is used.
              </li>
              <li>
                <strong className="text-white font-semibold">Webflow / our cloud hosting provider</strong> hosts the Site and processes technical and server data required to operate it.
              </li>
              <li>
                <strong className="text-white font-semibold">Our scheduling provider</strong> processes the information you provide when booking an introductory call through its platform.
              </li>
            </ul>
            <p className="text-slate-300 font-light leading-relaxed pt-2">
              We may also disclose personal data where required by law or when necessary to protect our legal rights.
            </p>
          </section>

          {/* 5. International Data Transfers */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              International Data Transfers
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              ZNX Studio is established in India. Some of the third-party service providers we use may be based outside India, which means your personal data may be transferred to and processed in other countries.
            </p>
            <p className="text-slate-300 font-light leading-relaxed">
              Where required by applicable law, we take reasonable steps to ensure that personal data transferred internationally is handled with appropriate safeguards and protections.
            </p>
          </section>

          {/* 6. How Long We Keep Data */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              How Long We Keep Data
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              Analytics data is retained for 14 months in GA4, after which it is deleted or aggregated. We keep enquiry and booking information for as long as necessary to respond to you and, where a project follows, for as long as needed to manage that relationship and meet any legal obligations. After that, the information is deleted or anonymised.
            </p>
          </section>

          {/* 7. Your Rights */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Your Rights
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              Depending on where you live, you may have certain rights regarding your personal data.
            </p>
            <p className="text-slate-300 font-light leading-relaxed">
              You may have the right to access the personal data we hold about you, request corrections to inaccurate information, request deletion of your data, or object to or restrict certain types of processing, where applicable under local law.
            </p>
            <p className="text-slate-300 font-light leading-relaxed">
              If you have provided consent for a particular use of your data, you may also withdraw that consent at any time.
            </p>
            <p className="text-slate-300 font-light leading-relaxed">
              To exercise any applicable rights or ask questions about how we handle your personal data, contact us at{' '}
              <a href="mailto:contactmeznx@gmail.com" className="text-white font-mono-tech font-bold uppercase tracking-wider underline hover:text-slate-200 transition-colors">
                contactmeznx@gmail.com
              </a>.
            </p>
            <p className="text-slate-300 font-light leading-relaxed">
              We will respond to your request within the timeframe required by applicable law.
            </p>
          </section>

          {/* 8. Children */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Children
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              The Site is not directed at children, and we do not knowingly collect personal data from anyone under the age of 16. If you believe that a child has provided us with personal data, please contact us and we will take appropriate steps to delete it.
            </p>
          </section>

          {/* 9. Security */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Security
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              We take reasonable technical and organisational measures to protect personal data from unauthorised access, misuse, loss, or disclosure. However, no method of transmission or storage is completely secure, so we cannot guarantee absolute security.
            </p>
          </section>

          {/* 10. Hosting */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Hosting
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              The Site is hosted by a third-party hosting provider. The provider may process technical and server data as necessary to host, maintain, and secure the Site.
            </p>
          </section>

          {/* 11. Changes to This Policy */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Changes to This Policy
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              We may update this Privacy Policy from time to time. When we make changes, we will update the date at the top of this page and, where a change is significant, take reasonable steps to notify you.
            </p>
          </section>

          {/* 12. Contact */}
          <section className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white tracking-tight">
              Contact
            </h2>
            <p className="text-slate-300 font-light leading-relaxed">
              For any questions about this Privacy Policy or your personal data, contact us at{' '}
              <a href="mailto:contactmeznx@gmail.com" className="text-white font-mono-tech font-bold uppercase tracking-wider underline hover:text-slate-200 transition-colors">
                contactmeznx@gmail.com
              </a>.
            </p>
          </section>

        </div>

        {/* Unified CTA Section: Newsletter Heading with the solid square button box */}
        <div className="mt-28 pt-16 border-t border-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-12">
          {/* Newsletter Heading */}
          <div className="space-y-4 max-w-2xl text-left">
            <span className="text-[11px] sm:text-[13px] font-mono-tech tracking-[0.25em] text-neutral-400 uppercase font-semibold">
              LET'S CREATE TOGETHER
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bodoni font-bold uppercase tracking-tight text-white leading-[1.05]">
              Have a project <br /> in mind?
            </h2>
          </div>

          {/* Solid square button box */}
          <SquareProjectButton onClick={onOpenContact} />
        </div>
      </main>

      {/* Main Page Footer component to maintain 1:1 identical footer design */}
      <Footer 
        onOpenPrivacy={() => onBackToHome('privacy')}
        onOpenServices={() => onBackToHome('services')}
        onOpenWorks={() => onBackToHome('work')}
        onNavigateToHome={onBackToHome}
      />
    </motion.div>
  );
}
