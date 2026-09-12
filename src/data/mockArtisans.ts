import { Artisan, Review, CustomerJobRequest } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    artisanId: 'art-1',
    customerName: 'Amina Bello',
    customerLocation: 'Wuse 2, Abuja',
    rating: 5,
    date: '3 days ago',
    serviceName: 'Bathroom pipe leak repair',
    comment: 'Musa arrived within 35 minutes of my call. He identified the burst PPR pipe under the washbasin and replaced the connector cleanly without breaking wall tiles unnecessarily. Fair pricing.',
    jobVerified: true
  },
  {
    id: 'rev-2',
    artisanId: 'art-1',
    customerName: 'Chidi Okafor',
    customerLocation: 'Gwarinpa Estate, Abuja',
    rating: 5,
    date: '2 weeks ago',
    serviceName: 'Overhead water tank & float switch installation',
    comment: 'Excellent work installing our 2000L tank and automatic float switch. No more water overflow. Clean and courteous.',
    jobVerified: true
  },
  {
    id: 'rev-3',
    artisanId: 'art-2',
    customerName: 'Engr. Babatunde Lawal',
    customerLocation: 'Utako, Abuja',
    rating: 5,
    date: '1 week ago',
    serviceName: 'Generator ATS changeover & conduit wiring',
    comment: 'Emmanuel is thorough with load calculations and earthing. Resolved persistent circuit breaker tripping that two other electricians could not diagnose.',
    jobVerified: true
  },
  {
    id: 'rev-4',
    artisanId: 'art-3',
    customerName: 'Grace Nwachukwu',
    customerLocation: 'Maitama, Abuja',
    rating: 5,
    date: '5 days ago',
    serviceName: 'Floor tiling (60x60 porcelain) & POP repair',
    comment: 'Sunday and his team tiled our living room and master bedroom. Perfect leveling, laser alignment, and zero hollow sound. Done within agreed timeline.',
    jobVerified: true
  },
  {
    id: 'rev-5',
    artisanId: 'art-4',
    customerName: 'Kayode Adeleke',
    customerLocation: 'Ikeja GRA, Lagos',
    rating: 4,
    date: '10 days ago',
    serviceName: 'Solar inverter system troubleshooting',
    comment: 'Quick to diagnose battery balancer fault. Explained everything clearly before replacing blown fuses.',
    jobVerified: true
  }
];

export const INITIAL_ARTISANS: Artisan[] = [
  {
    id: 'art-1',
    name: 'Musa Ibrahim',
    businessName: 'Musa Plumbing Services',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    profession: 'plumbing',
    professionLabel: 'Licensed Plumber & Pipe Specialist',
    subServices: [
      'leaking pipes',
      'blocked drains',
      'toilet repairs',
      'water installation',
      'pump installation',
      'tank installation',
      'emergency plumbing'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Wuse',
      address: 'Near Wuse Zone 4 Market'
    },
    serviceAreas: ['Wuse', 'Maitama', 'Utako', 'Gwarinpa', 'Jabi'],
    maxTravelRadiusKm: 18,
    verificationStatus: 'verified',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: true,
      verifiedDate: '2024-03-12',
      notes: 'National ID verified; Trade test certified by Federal Ministry of Labour; Physical workshop confirmed.'
    },
    rating: 4.8,
    reviewCount: 38,
    completedJobsCount: 127,
    yearsOfExperience: 9,
    phone: '+2348035552109',
    whatsapp: '+2348035552109',
    bio: 'Residential & commercial plumbing, water systems, pump installations and rapid emergency pipe leak repairs. Clean workmanship with guarantee on all joints.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Inspection/Call-out: ₦5,000 – ₦8,000 (deducted if hired). Pipe repairs from ₦8,000.',
    languages: ['English', 'Hausa', 'Pidgin'],
    workingHours: 'Mon – Sat: 7:30 AM – 7:00 PM (Emergency 24/7 for burst pipes)',
    isUrgentAccepting: true,
    availability: 'available',
    responseTimeText: 'Usually responds in under 15 mins',
    featured: true
  },
  {
    id: 'art-2',
    name: 'Emmanuel Eze',
    businessName: 'Eze Power Solutions & Electricals',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    profession: 'electrical',
    professionLabel: 'Master Electrician & Inverter Specialist',
    subServices: [
      'electrical faults',
      'wiring',
      'generator wiring',
      'inverter installation',
      'socket installation',
      'troubleshooting',
      'lighting'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Gwarinpa',
      address: '3rd Avenue, Gwarinpa Estate'
    },
    serviceAreas: ['Gwarinpa', 'Jabi', 'Utako', 'Kubwa', 'Wuse', 'Mabushi'],
    maxTravelRadiusKm: 22,
    verificationStatus: 'verified',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: true,
      verifiedDate: '2024-01-20',
      notes: 'NEMSA licensed electrical contractor; Phone & BVN verified.'
    },
    rating: 4.9,
    reviewCount: 42,
    completedJobsCount: 164,
    yearsOfExperience: 11,
    phone: '+2348024449811',
    whatsapp: '+2348024449811',
    bio: 'Specialist in electrical fault isolation, ATS automatic generator changeover, solar inverter wiring, and complete house conduit wiring. Safety first.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Inspection/Fault Diagnosis: ₦7,000. Inverter setup from ₦25,000.',
    languages: ['English', 'Igbo', 'Pidgin'],
    workingHours: 'Mon – Sat: 8:00 AM – 6:30 PM (Urgent electrical faults accepted)',
    isUrgentAccepting: true,
    availability: 'available',
    responseTimeText: 'Usually responds in under 10 mins',
    featured: true
  },
  {
    id: 'art-3',
    name: 'Sunday Adeleke',
    businessName: 'Adeleke Finishes & Construction Works',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    profession: 'construction',
    professionLabel: 'General Builder, Tiler & POP Specialist',
    subServices: [
      'tiling',
      'POP/ceiling',
      'masonry',
      'plastering',
      'block work',
      'renovations',
      'painting'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Jabi',
      address: 'Near Jabi Lake Mall'
    },
    serviceAreas: ['Jabi', 'Utako', 'Wuse', 'Maitama', 'Apo', 'Gwarinpa'],
    maxTravelRadiusKm: 25,
    verificationStatus: 'verified',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: true,
      verifiedDate: '2023-11-15',
      notes: 'Certified builder by Building Craftsmen Association; ID verified.'
    },
    rating: 4.8,
    reviewCount: 31,
    completedJobsCount: 89,
    yearsOfExperience: 14,
    phone: '+2348183337620',
    whatsapp: '+2348183337620',
    bio: 'Precision floor and wall tiling, suspended POP ceiling design, block work, plastering and building renovation. We work with site supervisors and private landlords.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Site inspection & BoQ measurement: ₦8,000. Tiling from ₦1,200/sqm.',
    languages: ['English', 'Yoruba', 'Pidgin'],
    workingHours: 'Mon – Sat: 7:00 AM – 6:00 PM',
    isUrgentAccepting: false,
    availability: 'available',
    responseTimeText: 'Responds within 30 mins',
    featured: true
  },
  {
    id: 'art-4',
    name: 'Bilikisu Usman',
    businessName: 'Apex Water & Sanitary Engineering',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    profession: 'plumbing',
    professionLabel: 'Sanitary Engineer & Commercial Plumber',
    subServices: [
      'bathroom plumbing',
      'water installation',
      'tank installation',
      'pump installation',
      'pipe replacement'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Maitama',
      address: 'Maitama District'
    },
    serviceAreas: ['Maitama', 'Asokoro', 'Wuse', 'Central Area'],
    maxTravelRadiusKm: 15,
    verificationStatus: 'verified',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: true,
      verifiedDate: '2024-02-18',
      notes: 'B.Eng Civil & Water Resources; Registered plumber contractor.'
    },
    rating: 4.9,
    reviewCount: 26,
    completedJobsCount: 74,
    yearsOfExperience: 8,
    phone: '+2348057771234',
    whatsapp: '+2348057771234',
    bio: 'Specialized in premium bathroom installations, pressure pump calibration, high-grade CPVC/PPR pipe routing, and multi-flat building water reticulation.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Diagnostic fee: ₦10,000. Full bathroom rough-in quote after inspection.',
    languages: ['English', 'Hausa'],
    workingHours: 'Mon – Fri: 8:00 AM – 6:00 PM',
    isUrgentAccepting: false,
    availability: 'busy',
    responseTimeText: 'Responds within 1 hour',
    featured: false
  },
  {
    id: 'art-5',
    name: 'Tariq Alabi',
    businessName: 'VoltCraft Industrial & Domestic Wiring',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    profession: 'electrical',
    professionLabel: 'Electrical Contractor & Surge Protection',
    subServices: [
      'electrical faults',
      'wiring',
      'lighting',
      'electrical maintenance',
      'troubleshooting',
      'new installations'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Utako',
      address: 'Utako District'
    },
    serviceAreas: ['Utako', 'Jabi', 'Wuse', 'Gwarinpa', 'Lokogoma'],
    maxTravelRadiusKm: 20,
    verificationStatus: 'verified',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: true,
      verifiedDate: '2024-04-05',
      notes: 'Government trade certified; Verified reference checks from 5 commercial sites.'
    },
    rating: 4.7,
    reviewCount: 22,
    completedJobsCount: 88,
    yearsOfExperience: 10,
    phone: '+2348098884321',
    whatsapp: '+2348098884321',
    bio: 'Domestic and commercial electrical systems. Specializes in distribution board upgrades, lightning arrestors, smart lighting and earth leakage trip rectification.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Site visit & inspection: ₦6,000. DB board re-wiring from ₦18,000.',
    languages: ['English', 'Yoruba', 'Pidgin'],
    workingHours: 'Mon – Sat: 8:00 AM – 7:00 PM (Accepts emergency power faults)',
    isUrgentAccepting: true,
    availability: 'available',
    responseTimeText: 'Usually responds in under 20 mins',
    featured: false
  },
  {
    id: 'art-6',
    name: 'Godwin Danjuma',
    businessName: 'Danjuma Masonry & Structural Repairs',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    profession: 'construction',
    professionLabel: 'Master Mason & Concrete Specialist',
    subServices: [
      'masonry',
      'block work',
      'plastering',
      'roofing',
      'general construction',
      'renovations'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Kubwa',
      address: 'Kubwa Phase 4'
    },
    serviceAreas: ['Kubwa', 'Gwarinpa', 'Dutse', 'Dei-Dei', 'Bwari'],
    maxTravelRadiusKm: 30,
    verificationStatus: 'verified',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: false,
      verifiedDate: '2024-02-10',
      notes: 'ID & Phone verified. 16 years trade experience confirmed by 3 local site managers.'
    },
    rating: 4.7,
    reviewCount: 19,
    completedJobsCount: 105,
    yearsOfExperience: 16,
    phone: '+2348131118970',
    whatsapp: '+2348131118970',
    bio: 'Solid 9-inch and 6-inch vibrated block laying, foundation beam casting, lintels, internal/external plastering and damp wall remediation.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Daily rate or per-block laying contract. Free initial phone consultation.',
    languages: ['English', 'Hausa', 'Pidgin'],
    workingHours: 'Mon – Sat: 7:00 AM – 5:30 PM',
    isUrgentAccepting: false,
    availability: 'available',
    responseTimeText: 'Responds in ~45 mins',
    featured: false
  },
  {
    id: 'art-7',
    name: 'Victor Kalu',
    businessName: 'Kalu Roof & Timber Craft',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    profession: 'construction',
    professionLabel: 'Roofing Carpenter & Timber Truss Specialist',
    subServices: [
      'roofing',
      'carpentry',
      'renovations',
      'general construction'
    ],
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Apo',
      address: 'Apo Mechanic & Building Village'
    },
    serviceAreas: ['Apo', 'Gudu', 'Lokogoma', 'Asokoro', 'Lugbe'],
    maxTravelRadiusKm: 25,
    verificationStatus: 'pending',
    verificationDetails: {
      idVerified: true,
      phoneVerified: true,
      tradeCertVerified: false,
      notes: 'Trade certificate currently under review by compliance team.'
    },
    rating: 4.6,
    reviewCount: 12,
    completedJobsCount: 47,
    yearsOfExperience: 7,
    phone: '+2348076663219',
    bio: 'Roof leak troubleshooting, stone-coated metal tile installation, hardwood roof carcass truss framing, and fascia board repairs.',
    portfolioImages: [
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80'
    ],
    pricingGuidance: 'Inspection fee: ₦5,000. Re-roofing estimates provided on site.',
    languages: ['English', 'Igbo', 'Pidgin'],
    workingHours: 'Mon – Sat: 7:30 AM – 6:00 PM',
    isUrgentAccepting: true,
    availability: 'available',
    responseTimeText: 'Usually responds in under 30 mins',
    featured: false
  }
];

export const INITIAL_LEADS: CustomerJobRequest[] = [
  {
    id: 'lead-101',
    customerName: 'Hauwa Mohammed',
    customerPhone: '+2348039994512',
    category: 'plumbing',
    subService: 'leaking pipes',
    description: 'Master bathroom flexi-hose under sink ruptured this morning. Water is turned off at main valve for now, need someone today.',
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Gwarinpa',
      address: '4th Avenue, near Setraco gate'
    },
    urgency: 'urgent',
    photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    createdAt: '25 mins ago',
    status: 'pending',
    assignedArtisanId: 'art-1'
  },
  {
    id: 'lead-102',
    customerName: 'Olumide Fashola',
    customerPhone: '+2348021118765',
    category: 'electrical',
    subService: 'generator wiring',
    description: 'Changeover switch from 6.5kVA generator to house distribution board is smoking and tripping. Need certified electrician.',
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Wuse',
      address: 'Zone 6, close to hospital'
    },
    urgency: 'urgent',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    createdAt: '1 hour ago',
    status: 'pending',
    assignedArtisanId: 'art-2'
  },
  {
    id: 'lead-103',
    customerName: 'Dr. Kabir Sani',
    customerPhone: '+2348123334455',
    category: 'construction',
    subService: 'tiling',
    description: 'Renovating 3 bedroom flat kitchen and balcony floor. Approx 65 sqm tiles already on site, need skilled tiler with laser level.',
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Jabi',
      address: 'Jabi Dapo close'
    },
    urgency: 'today',
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    createdAt: '2 hours ago',
    status: 'pending',
    assignedArtisanId: 'art-3'
  }
];
