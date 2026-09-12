import { ProfessionCategory } from '../types';

export interface CategoryInfo {
  id: ProfessionCategory;
  name: string;
  tagline: string;
  description: string;
  ctaText: string;
  iconName: string;
  subServices: string[];
  bannerImage: string;
}

export const CATEGORIES: Record<ProfessionCategory, CategoryInfo> = {
  plumbing: {
    id: 'plumbing',
    name: 'Plumbers',
    tagline: 'Water systems, pipe repairs & emergency leaks',
    description: 'Fix leaks, blocked pipes, water systems and plumbing installations.',
    ctaText: 'Find a Plumber',
    iconName: 'Wrench',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    subServices: [
      'leaking pipes',
      'blocked drains',
      'toilet repairs',
      'water installation',
      'pump installation',
      'tank installation',
      'bathroom plumbing',
      'pipe replacement',
      'emergency plumbing'
    ]
  },
  electrical: {
    id: 'electrical',
    name: 'Electricians',
    tagline: 'Faults, wiring, generators & solar inverters',
    description: 'Electrical repairs, wiring, installations and troubleshooting.',
    ctaText: 'Find an Electrician',
    iconName: 'Zap',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    subServices: [
      'electrical faults',
      'wiring',
      'socket installation',
      'lighting',
      'generator wiring',
      'inverter installation',
      'electrical maintenance',
      'troubleshooting',
      'new installations'
    ]
  },
  construction: {
    id: 'construction',
    name: 'Building & Construction',
    tagline: 'Masons, tilers, POP ceilings, carpentry & renovations',
    description: 'Connect with skilled professionals for construction, repairs, finishing and renovation work.',
    ctaText: 'Find a Professional',
    iconName: 'HardHat',
    bannerImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=800&q=80',
    subServices: [
      'masonry',
      'tiling',
      'painting',
      'roofing',
      'POP/ceiling',
      'plastering',
      'flooring',
      'carpentry',
      'block work',
      'renovations',
      'general construction'
    ]
  }
};

export const SUPPORTED_LOCATIONS = [
  { city: 'Abuja (FCT)', neighborhoods: ['Wuse', 'Gwarinpa', 'Maitama', 'Jabi', 'Utako', 'Apo', 'Kubwa', 'Lokogoma', 'Asokoro', 'Lugbe', 'Central Area'] },
  { city: 'Lagos', neighborhoods: ['Ikeja', 'Lekki Phase 1', 'Victoria Island', 'Yaba', 'Surulere', 'Maryland', 'Magodo', 'Ikoyi', 'Ajah', 'Ogudu'] }
];

export const POPULAR_SEARCH_PRESETS = [
  { label: 'Leaking pipe near me', query: 'leaking pipes', category: 'plumbing' },
  { label: 'Electrician in Wuse', query: 'electrician in Wuse', category: 'electrical', location: 'Wuse' },
  { label: 'Tiler in Gwarinpa', query: 'tiler in Gwarinpa', category: 'construction', location: 'Gwarinpa' },
  { label: 'Generator wiring & inverter', query: 'generator wiring', category: 'electrical' },
  { label: 'POP / Ceiling installer', query: 'POP/ceiling', category: 'construction' },
  { label: 'Urgent burst pipe', query: 'emergency plumbing', category: 'plumbing', urgent: true }
];
