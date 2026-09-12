import { Artisan, ProfessionCategory } from '../types';

export interface SearchCriteria {
  query?: string;
  category?: ProfessionCategory | 'all';
  subService?: string;
  location?: string;
  urgentOnly?: boolean;
  verifiedOnly?: boolean;
  availableOnly?: boolean;
}

export interface ScoredArtisan {
  artisan: Artisan;
  score: number;
  matchReasons: string[];
}

export function searchAndRankArtisans(
  artisans: Artisan[],
  criteria: SearchCriteria
): ScoredArtisan[] {
  const queryLower = (criteria.query || '').trim().toLowerCase();
  const locationLower = (criteria.location || '').trim().toLowerCase();
  const subServiceLower = (criteria.subService || '').trim().toLowerCase();

  return artisans
    .map(artisan => {
      let score = 0;
      const matchReasons: string[] = [];

      // Category check
      if (criteria.category && criteria.category !== 'all') {
        if (artisan.profession === criteria.category) {
          score += 40;
          matchReasons.push(`Matches ${artisan.profession}`);
        } else {
          return null; // Must match category if specified
        }
      }

      // Sub-service match
      if (subServiceLower) {
        const hasSubService = artisan.subServices.some(s =>
          s.toLowerCase().includes(subServiceLower) || subServiceLower.includes(s.toLowerCase())
        );
        if (hasSubService) {
          score += 35;
          matchReasons.push(`Expert in "${criteria.subService}"`);
        }
      }

      // Location match
      if (locationLower) {
        const directLocation = artisan.location.neighborhood.toLowerCase().includes(locationLower) ||
          artisan.location.city.toLowerCase().includes(locationLower);
        const inServiceAreas = artisan.serviceAreas.some(area =>
          area.toLowerCase().includes(locationLower) || locationLower.includes(area.toLowerCase())
        );

        if (directLocation) {
          score += 30;
          matchReasons.push(`Based in ${artisan.location.neighborhood}`);
        } else if (inServiceAreas) {
          score += 25;
          matchReasons.push(`Servicing ${criteria.location}`);
        } else {
          // If a location was explicitly searched and they don't cover it
          score -= 20;
        }
      }

      // Natural language query match
      if (queryLower) {
        let queryMatches = false;
        if (artisan.name.toLowerCase().includes(queryLower) || artisan.businessName.toLowerCase().includes(queryLower)) {
          score += 25;
          queryMatches = true;
        }
        if (artisan.professionLabel.toLowerCase().includes(queryLower) || artisan.profession.toLowerCase().includes(queryLower)) {
          score += 20;
          queryMatches = true;
        }
        const matchedSkills = artisan.subServices.filter(s => s.toLowerCase().includes(queryLower));
        if (matchedSkills.length > 0) {
          score += 25;
          matchReasons.push(`Offers ${matchedSkills[0]}`);
          queryMatches = true;
        }
        if (artisan.serviceAreas.some(a => a.toLowerCase().includes(queryLower))) {
          score += 15;
          matchReasons.push(`Covers ${queryLower}`);
          queryMatches = true;
        }
        if (!queryMatches && !criteria.category && !criteria.subService && !criteria.location) {
          score -= 10;
        }
      }

      // Urgent job requirement
      if (criteria.urgentOnly) {
        if (artisan.isUrgentAccepting && artisan.availability === 'available') {
          score += 25;
          matchReasons.push('Available for emergency response');
        } else {
          return null; // Exclude if urgent filter is active and not accepting
        }
      }

      // Availability score
      if (artisan.availability === 'available') {
        score += 20;
        matchReasons.push('Available today');
      } else if (artisan.availability === 'busy') {
        score += 5;
        if (criteria.availableOnly) return null;
      } else {
        if (criteria.availableOnly) return null;
      }

      // Verification score
      if (artisan.verificationStatus === 'verified') {
        score += 15;
        matchReasons.push('Identity & skills verified');
      } else if (criteria.verifiedOnly) {
        return null;
      }

      // Completed jobs & rating weight
      score += Math.min(15, artisan.completedJobsCount / 10);
      score += (artisan.rating - 4.0) * 10;

      return {
        artisan,
        score: Math.round(score),
        matchReasons: matchReasons.slice(0, 3)
      };
    })
    .filter((item): item is ScoredArtisan => item !== null)
    .sort((a, b) => b.score - a.score);
}

export function parseNaturalSearch(text: string): {
  category?: ProfessionCategory;
  subService?: string;
  location?: string;
  isUrgent?: boolean;
} {
  const lower = text.toLowerCase();
  const result: {
    category?: ProfessionCategory;
    subService?: string;
    location?: string;
    isUrgent?: boolean;
  } = {};

  if (lower.includes('urgent') || lower.includes('emergency') || lower.includes('burst') || lower.includes('now')) {
    result.isUrgent = true;
  }

  // Check categories
  if (lower.includes('plumb') || lower.includes('pipe') || lower.includes('leak') || lower.includes('drain') || lower.includes('water') || lower.includes('sink') || lower.includes('toilet')) {
    result.category = 'plumbing';
  } else if (lower.includes('electr') || lower.includes('wire') || lower.includes('power') || lower.includes('inverter') || lower.includes('generator') || lower.includes('light') || lower.includes('socket')) {
    result.category = 'electrical';
  } else if (lower.includes('build') || lower.includes('construct') || lower.includes('tile') || lower.includes('mason') || lower.includes('pop') || lower.includes('roof') || lower.includes('plaster') || lower.includes('carpenter') || lower.includes('renovat')) {
    result.category = 'construction';
  }

  // Check sub-services
  const commonSubServices = [
    'leaking pipes', 'blocked drains', 'toilet repairs', 'pump installation', 'tank installation',
    'electrical faults', 'generator wiring', 'inverter installation', 'wiring', 'lighting',
    'masonry', 'tiling', 'pop/ceiling', 'roofing', 'carpentry', 'painting', 'plastering'
  ];
  for (const s of commonSubServices) {
    if (lower.includes(s) || (s === 'pop/ceiling' && (lower.includes('pop') || lower.includes('ceiling')))) {
      result.subService = s;
      break;
    }
  }

  // Check neighborhoods
  const knownLocations = [
    'wuse', 'gwarinpa', 'maitama', 'jabi', 'utako', 'apo', 'kubwa', 'lokogoma', 'asokoro', 'lugbe',
    'ikeja', 'lekki', 'victoria island', 'yaba', 'surulere', 'maryland', 'magodo'
  ];
  for (const loc of knownLocations) {
    if (lower.includes(loc)) {
      result.location = loc.charAt(0).toUpperCase() + loc.slice(1);
      break;
    }
  }

  return result;
}
