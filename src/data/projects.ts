// Portfolio projects shown on the Works page and their detail pages (#/works/<slug>).
// Data carried over from the original Works page; slugs are derived from the (unique) titles.

export interface Project {
  id: number;
  /** Stable URL identifier: #/works/<slug> */
  slug: string;
  title: string;
  /** Discipline line shown with the title */
  category: string;
  /** Type of work, used by the Works filter */
  type: string;
  /** Industry, used by the Works filter */
  domain: string;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'luella',
    title: 'Luella',
    category: 'Brand Identity & Product Design',
    type: 'Brand Identity',
    domain: 'Finance',
    image: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
  },
  {
    id: 2,
    slug: 'quantum-resilience',
    title: 'Quantum Resilience',
    category: 'Digital Architecture & UI',
    type: 'UI/UX',
    domain: 'Technology',
    image: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
  },
  {
    id: 3,
    slug: 'soundcloud-worldwide',
    title: 'SoundCloud Worldwide',
    category: 'Global Brand Campaign',
    type: 'Campaigns',
    domain: 'Entertainment',
    image: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
  },
  {
    id: 4,
    slug: 'spatial-environment',
    title: 'Spatial Environment',
    category: '3D Motion & Real Estate',
    type: 'Motion & Film',
    domain: 'Real Estate',
    image: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
  },
  {
    id: 5,
    slug: 'macbook-editorial',
    title: 'MacBook Editorial',
    category: 'Design Systems & Craft',
    type: 'Websites',
    domain: 'Consumer Brands',
    image: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
  },
  {
    id: 6,
    slug: 'services-hero',
    title: 'Services Hero',
    category: 'Cinematography & Health',
    type: 'Motion & Film',
    domain: 'Health',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 7,
    slug: 'monochrome-editorial',
    title: 'Monochrome Editorial',
    category: 'High Fashion & Direction',
    type: 'Brand Identity',
    domain: 'Consumer Brands',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 8,
    slug: 'overlay-eye-emblem',
    title: 'Overlay Eye Emblem',
    category: 'Conceptual Illustration',
    type: 'Illustration',
    domain: 'Professional Services',
    image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 9,
    slug: 'cursor-motion-lab',
    title: 'Cursor Motion Lab',
    category: 'Interactive SaaS Experiences',
    type: 'Digital Experiences',
    domain: 'SaaS',
    image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 10,
    slug: 'golden-luxury-card',
    title: 'Golden Luxury Card',
    category: 'Fintech & Mobile Apps',
    type: 'Mobile Apps',
    domain: 'Finance',
    image: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
  },
  {
    id: 11,
    slug: 'telehealth-portal',
    title: 'Telehealth Portal',
    category: 'Health Product Design',
    type: 'Mobile Apps',
    domain: 'Health',
    image: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
  },
  {
    id: 12,
    slug: 'global-music-culture',
    title: 'Global Music Culture',
    category: 'Audio Brand Direction',
    type: 'Brand Identity',
    domain: 'Entertainment',
    image: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
  },
  {
    id: 13,
    slug: 'architectural-rendering',
    title: 'Architectural Rendering',
    category: '3D Spatial Visualization',
    type: 'Digital Experiences',
    domain: 'Real Estate',
    image: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
  },
  {
    id: 14,
    slug: 'luxury-design-system',
    title: 'Luxury Design System',
    category: 'System Architecture & UI',
    type: 'UI/UX',
    domain: 'SaaS',
    image: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
  },
  {
    id: 15,
    slug: 'cinematic-lighting',
    title: 'Cinematic Lighting',
    category: 'Motion Visuals & Tech',
    type: 'Motion & Film',
    domain: 'Technology',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 16,
    slug: 'minimalist-portfolio',
    title: 'Minimalist Portfolio',
    category: 'Digital Editorial & Web',
    type: 'Websites',
    domain: 'Professional Services',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 17,
    slug: 'consumer-health-system',
    title: 'Consumer Health System',
    category: 'Product Branding & Health',
    type: 'Brand Identity',
    domain: 'Health',
    image: 'https://i.pinimg.com/736x/92/63/90/926390824a8074def2ae2007ca3a313e.jpg',
  },
  {
    id: 18,
    slug: 'quantum-enterprise-ui',
    title: 'Quantum Enterprise UI',
    category: 'SaaS Architecture & Tech',
    type: 'Websites',
    domain: 'SaaS',
    image: 'https://i.pinimg.com/736x/d7/19/ba/d719bab654730c30c30bfd9a900ced9c.jpg',
  },
  {
    id: 19,
    slug: 'multimedia-campaign',
    title: 'Multimedia Campaign',
    category: 'Creative Direction & Brands',
    type: 'Campaigns',
    domain: 'Consumer Brands',
    image: 'https://i.pinimg.com/736x/9d/5d/5e/9d5d5ee8ab3092ef3357824732ab003d.jpg',
  },
  {
    id: 20,
    slug: 'real-estate-spatial',
    title: 'Real Estate Spatial',
    category: 'Spatial Illustration & Motion',
    type: 'Illustration',
    domain: 'Real Estate',
    image: 'https://i.pinimg.com/736x/82/bc/ca/82bccaa66d035a2229c81ee06d0f017e.jpg',
  },
  {
    id: 21,
    slug: 'high-contrast-ui-kit',
    title: 'High-Contrast UI Kit',
    category: 'Craft Systems & Technology',
    type: 'UI/UX',
    domain: 'Technology',
    image: 'https://i.pinimg.com/736x/b7/ff/28/b7ff287558a5dade48776e7aef2278b3.jpg',
  },
  {
    id: 22,
    slug: 'healthcare-rebranding',
    title: 'Healthcare Rebranding',
    category: 'Digital Experiences & Archive',
    type: 'Digital Experiences',
    domain: 'Health',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
  },
];

/** Filter options, in display order; every entry is used by at least one project */
export const PROJECT_TYPES = ['Websites', 'UI/UX', 'Motion & Film', 'Mobile Apps', 'Campaigns', 'Illustration', 'Digital Experiences', 'Brand Identity'];
export const PROJECT_DOMAINS = ['Professional Services', 'Health', 'Real Estate', 'Consumer Brands', 'Entertainment', 'SaaS', 'Technology', 'Finance'];

export const getProjectBySlug = (slug: string) => PROJECTS.find((project) => project.slug === slug);
