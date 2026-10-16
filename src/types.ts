export interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  videoUrl?: string;
  description: string;
  tags: string[];
}

export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  description: string;
  capabilities: string[];
  image: string;
}

export type NavTab = 'work' | 'services' | 'about' | 'contact';
