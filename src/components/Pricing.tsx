import { ArrowUpRight, Check } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

interface PricingProps {
  onOpenContact: () => void;
}

interface Plan {
  name: string;
  price: string;
  /** Small line under the price */
  terms: string;
  summary: string;
  features: string[];
  recommended?: boolean;
}

// Fixed-scope website packages (INR). Scope is deliberately bounded: no "unlimited" anything.
const PLANS: Plan[] = [
  {
    name: 'Launch',
    price: '₹12,999',
    terms: 'One-time',
    summary: 'A sharp one-page site that puts your brand online and turns visitors into enquiries.',
    features: [
      'Single-page site, up to 5 sections',
      'Responsive on mobile, tablet and desktop',
      'Enquiry form or WhatsApp button',
      'Basic on-page SEO',
      '2 rounds of revisions',
      '15 days of post-launch support',
    ],
  },
  {
    name: 'Studio',
    price: '₹24,999',
    terms: 'One-time',
    summary: 'A complete multi-page website, designed around your brand and built to be found.',
    features: [
      'Up to 6 pages',
      'Custom design based on your brand',
      'Subtle motion and interactions',
      'Enquiry form with email notifications',
      'On-page SEO and Google Analytics setup',
      '3 rounds of revisions',
      '30 days of post-launch support',
    ],
    recommended: true,
  },
  {
    name: 'Signature',
    price: '₹44,999',
    terms: 'Onwards · starting price',
    summary: 'For brands that need more depth: custom art direction, richer motion and content you can manage.',
    features: [
      'Up to 12 pages',
      'Custom art direction and design system',
      'Advanced animations and interactions',
      'CMS for a blog, projects or news',
      'Setup of one integration, e.g. booking or newsletter',
      '4 rounds of revisions',
      '60 days of post-launch support',
    ],
  },
];

export default function Pricing({ onOpenContact }: PricingProps) {
  return (
    <section
      id="pricing"
      data-light="false"
      className="relative bg-[#0a0a0a] text-white py-24 sm:py-32 px-6 sm:px-10 lg:px-12 border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-end">
          <div className="lg:col-span-7">
            <ScrollReveal variant="mask" duration={1.1}>
              <span className="znx-eyebrow">Pricing</span>
            </ScrollReveal>
            <ScrollReveal variant="mask" duration={1.2} delay={0.08} className="mt-3">
              <h2 className="znx-heading text-white">Pick your starting point</h2>
            </ScrollReveal>
          </div>
          <ScrollReveal yOffset={20} duration={1.1} delay={0.18} className="lg:col-span-5">
            <p className="text-base sm:text-lg leading-relaxed text-neutral-300 max-w-md">
              Fixed starting prices for website projects. Design and development are included in every plan, handled
              end to end by ZNX.
            </p>
          </ScrollReveal>
        </div>

        {/* Plans */}
        <ul className="mt-14 sm:mt-16 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-5 max-w-xl lg:max-w-none mx-auto">
          {PLANS.map((plan, idx) => (
            <li key={plan.name} className="flex">
              <ScrollReveal yOffset={40} scale={0.98} duration={1.2} staggerIndex={idx} staggerStep={0.12} className="flex w-full">
                <article
                  aria-label={`${plan.name} plan`}
                  className={`relative flex w-full flex-col rounded-2xl border p-7 sm:p-8 lg:p-7 xl:p-8 transition-colors duration-500 ${
                    plan.recommended
                      ? 'border-white/40 bg-white/[0.05]'
                      : 'border-white/10 bg-white/[0.015] hover:border-white/20'
                  }`}
                >
                  {/* Name + recommended marker */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">{plan.name}</h3>
                    {plan.recommended && (
                      <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] uppercase tracking-[0.2em] text-[#ef4444]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#ef4444]" />
                        Recommended
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mt-6">
                    <p className="text-[2.75rem] sm:text-5xl lg:text-[2.75rem] xl:text-5xl font-semibold tracking-[-0.04em] leading-none text-white">
                      {plan.price}
                    </p>
                    <p className="znx-label mt-2">{plan.terms}</p>
                  </div>

                  <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-neutral-300">{plan.summary}</p>

                  <div className="my-6 h-px w-full bg-white/10" />

                  {/* Features */}
                  <ul className="flex flex-col gap-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm leading-snug text-neutral-200">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${plan.recommended ? 'text-[#ef4444]' : 'text-neutral-500'}`}
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA: opens the existing project-call booking; pinned to the card bottom so all three align */}
                  <div className="mt-auto pt-8">
                  <button
                    type="button"
                    onClick={onOpenContact}
                    className={`znx-btn w-full ${
                      plan.recommended ? 'znx-btn-primary' : 'znx-btn-secondary'
                    }`}
                    aria-label={`Book a call about the ${plan.name} plan`}
                  >
                    <span>Book a call</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                  </div>
                </article>
              </ScrollReveal>
            </li>
          ))}
        </ul>

        {/* Pricing notes */}
        <ScrollReveal yOffset={20} duration={0.9} delay={0.1}>
          <div className="mt-10 sm:mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-start lg:justify-between">
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-neutral-400 max-w-2xl">
              <li>Domain, hosting and paid third-party services (premium fonts, plugins, payment gateways) are billed separately, where needed.</li>
              <li>Larger custom functionality, such as e-commerce, user accounts or custom integrations, is quoted separately after a short call.</li>
            </ul>
            <button
              type="button"
              onClick={onOpenContact}
              className="group inline-flex shrink-0 items-center gap-2 self-start font-mono-tech text-[11px] uppercase tracking-widest text-white"
            >
              <span className="znx-link-underline">Not sure which fits? Let's talk</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
