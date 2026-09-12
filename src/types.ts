export type ProfessionCategory = 'plumbing' | 'electrical' | 'construction';

export interface SubServiceOption {
  id: string;
  name: string;
  category: ProfessionCategory;
  description: string;
}

export type AvailabilityStatus = 'available' | 'busy' | 'unavailable';

export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'suspended';

export interface VerificationDetails {
  idVerified: boolean;
  phoneVerified: boolean;
  tradeCertVerified: boolean;
  verifiedDate?: string;
  notes?: string;
}

export interface Review {
  id: string;
  artisanId: string;
  customerName: string;
  customerLocation: string;
  rating: number;
  date: string;
  serviceName: string;
  comment: string;
  jobVerified: boolean;
}

export interface Artisan {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  profession: ProfessionCategory;
  professionLabel: string;
  subServices: string[];
  location: {
    city: string;
    neighborhood: string;
    address?: string;
  };
  serviceAreas: string[];
  maxTravelRadiusKm: number;
  verificationStatus: VerificationStatus;
  verificationDetails: VerificationDetails;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  yearsOfExperience: number;
  phone: string;
  whatsapp?: string;
  bio: string;
  portfolioImages: string[];
  pricingGuidance: string;
  languages: string[];
  workingHours: string;
  isUrgentAccepting: boolean;
  availability: AvailabilityStatus;
  responseTimeText: string;
  featured?: boolean;
}

export interface CustomerJobRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  category: ProfessionCategory;
  subService: string;
  description: string;
  location: {
    city: string;
    neighborhood: string;
    address?: string;
  };
  urgency: 'urgent' | 'today' | 'tomorrow' | 'flexible';
  photoUrl?: string;
  createdAt: string;
  status: 'pending' | 'matched' | 'contacted' | 'accepted' | 'declined' | 'completed';
  assignedArtisanId?: string;
  artisanNotes?: string;
}

export interface ConstructionProject {
  id: string;
  customerName: string;
  customerPhone: string;
  projectType: string;
  location: {
    city: string;
    neighborhood: string;
  };
  description: string;
  budgetRange: string;
  timeline: string;
  requiredTrades: string[];
  createdAt: string;
  status: 'planning' | 'connecting' | 'active';
}

export interface CallLogEvent {
  id: string;
  artisanId: string;
  artisanName: string;
  timestamp: string;
  customerDevice: string;
}
