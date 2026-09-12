import { supabase } from '../lib/supabase';
import { Artisan, CustomerJobRequest, Review, ConstructionProject, AvailabilityStatus } from '../types';
import { INITIAL_ARTISANS, INITIAL_REVIEWS } from '../data/mockArtisans';
import {
  notifyNewJobRequest,
  notifyNewArtisanRegistration,
  notifyNewConstructionProject,
  notifyNewReview
} from './notificationService';

export interface DatabaseConnectionStatus {
  connected: boolean;
  tableExists: boolean;
  message: string;
}

// Client-side cooldown against submission spam (minimum 5 seconds between consecutive form submissions)
let lastSubmissionTime = 0;
function enforceSubmissionCooldown(): boolean {
  const now = Date.now();
  if (now - lastSubmissionTime < 4000) {
    console.warn('[Security] Submission cooldown active. Please wait a few seconds before submitting again.');
    return false;
  }
  lastSubmissionTime = now;
  return true;
}

/**
 * Fetch registered artisans from Supabase with limit to prevent unbounded memory growth.
 * Defaults to 50 records per page.
 */
export async function fetchArtisans(limit: number = 50): Promise<Artisan[]> {
  try {
    const { data, error } = await supabase
      .from('artisans')
      .select('*')
      .order('rating', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return INITIAL_ARTISANS;
    }

    // Map Supabase snake_case to frontend camelCase
    return data.map((row: any) => ({
      id: row.id,
      name: row.name || '',
      businessName: row.business_name || row.name || '',
      avatar: row.avatar || '',
      profession: row.profession,
      professionLabel: row.profession_label || row.profession,
      subServices: Array.isArray(row.sub_services) ? row.sub_services : [],
      location: typeof row.location === 'object' && row.location !== null
        ? row.location
        : { city: 'Abuja (FCT)', neighborhood: 'Central' },
      serviceAreas: Array.isArray(row.service_areas) ? row.service_areas : [],
      maxTravelRadiusKm: Number(row.max_travel_radius_km) || 25,
      verificationStatus: row.verification_status || 'pending',
      verificationDetails: typeof row.verification_details === 'object' && row.verification_details !== null
        ? row.verification_details
        : { idVerified: false, phoneVerified: true, tradeCertVerified: false },
      rating: Number(row.rating) || 5.0,
      reviewCount: Number(row.review_count) || 0,
      completedJobsCount: Number(row.completed_jobs_count) || 0,
      yearsOfExperience: Number(row.years_of_experience) || 3,
      phone: row.phone || '',
      whatsapp: row.whatsapp || row.phone || '',
      bio: row.bio || '',
      portfolioImages: Array.isArray(row.portfolio_images) ? row.portfolio_images : [],
      pricingGuidance: row.pricing_guidance || 'Custom quote per scope',
      languages: Array.isArray(row.languages) ? row.languages : ['English'],
      workingHours: row.working_hours || 'Mon - Sat: 8:00 AM - 6:00 PM',
      isUrgentAccepting: Boolean(row.is_urgent_accepting),
      availability: row.availability || 'available',
      responseTimeText: row.response_time_text || 'Responds within 30 mins',
      featured: Boolean(row.featured)
    }));
  } catch (err) {
    console.warn('Could not load from Supabase artisans table, using initial data:', err);
    return INITIAL_ARTISANS;
  }
}

/**
 * Fetch reviews from Supabase with safe query limit.
 */
export async function fetchReviews(limit: number = 100): Promise<Review[]> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data || data.length === 0) {
      return INITIAL_REVIEWS;
    }

    return data.map((row: any) => ({
      id: row.id,
      artisanId: row.artisan_id,
      customerName: row.customer_name,
      customerLocation: row.customer_location,
      rating: Number(row.rating),
      date: row.date || 'Recently',
      serviceName: row.service_name,
      comment: row.comment,
      jobVerified: Boolean(row.job_verified)
    }));
  } catch {
    return INITIAL_REVIEWS;
  }
}

/**
 * Fetch customer job requests from Supabase with pagination & optional artisan filter
 */
export async function fetchJobRequests(limit: number = 50, artisanId?: string): Promise<CustomerJobRequest[]> {
  try {
    let query = supabase
      .from('customer_job_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (artisanId) {
      query = query.or(`assigned_artisan_id.eq.${artisanId},assigned_artisan_id.is.null`);
    }

    const { data, error } = await query;

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      customerName: row.customer_name,
      customerPhone: row.customer_phone,
      category: row.category,
      subService: row.sub_service,
      description: row.description,
      location: row.location || { city: 'Nigeria', neighborhood: 'Local Area' },
      urgency: row.urgency || 'today',
      photoUrl: row.photo_url,
      createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Today',
      status: row.status || 'pending',
      assignedArtisanId: row.assigned_artisan_id
    }));
  } catch {
    return [];
  }
}

/**
 * Save new customer job request to Supabase
 */
export async function submitJobRequest(job: CustomerJobRequest): Promise<boolean> {
  if (!enforceSubmissionCooldown()) return false;

  try {
    const { error } = await supabase
      .from('customer_job_requests')
      .insert({
        id: job.id,
        customer_name: job.customerName,
        customer_phone: job.customerPhone,
        category: job.category,
        sub_service: job.subService,
        description: job.description,
        location: job.location,
        urgency: job.urgency,
        photo_url: job.photoUrl || null,
        status: job.status,
        assigned_artisan_id: job.assignedArtisanId || null
      });

    if (error) {
      console.warn('Supabase job insert error:', error.message);
      return false;
    }

    // Trigger notification to admin
    notifyNewJobRequest(job).catch(() => {});
    return true;
  } catch (err) {
    console.warn('Failed to insert job request to Supabase:', err);
    return false;
  }
}

/**
 * Save a new artisan registration to Supabase
 */
export async function registerArtisan(artisan: Artisan): Promise<boolean> {
  if (!enforceSubmissionCooldown()) return false;

  try {
    const { error } = await supabase
      .from('artisans')
      .insert({
        id: artisan.id,
        name: artisan.name,
        business_name: artisan.businessName,
        avatar: artisan.avatar,
        profession: artisan.profession,
        profession_label: artisan.professionLabel,
        sub_services: artisan.subServices,
        location: artisan.location,
        service_areas: artisan.serviceAreas,
        max_travel_radius_km: artisan.maxTravelRadiusKm,
        verification_status: artisan.verificationStatus,
        verification_details: artisan.verificationDetails,
        rating: artisan.rating,
        review_count: artisan.reviewCount,
        completed_jobs_count: artisan.completedJobsCount,
        years_of_experience: artisan.yearsOfExperience,
        phone: artisan.phone,
        whatsapp: artisan.whatsapp || artisan.phone,
        bio: artisan.bio,
        portfolio_images: artisan.portfolioImages,
        pricing_guidance: artisan.pricingGuidance,
        languages: artisan.languages,
        working_hours: artisan.workingHours,
        is_urgent_accepting: artisan.isUrgentAccepting,
        availability: artisan.availability,
        response_time_text: artisan.responseTimeText,
        featured: artisan.featured || false
      });

    if (error) {
      console.warn('Supabase artisan insert error:', error.message);
      return false;
    }

    // Trigger notification to admin
    notifyNewArtisanRegistration(artisan).catch(() => {});
    return true;
  } catch (err) {
    console.warn('Failed to register artisan to Supabase:', err);
    return false;
  }
}

/**
 * Save customer review to Supabase
 */
export async function submitReview(review: Review): Promise<boolean> {
  if (!enforceSubmissionCooldown()) return false;

  try {
    const { error } = await supabase
      .from('reviews')
      .insert({
        id: review.id,
        artisan_id: review.artisanId,
        customer_name: review.customerName,
        customer_location: review.customerLocation,
        rating: review.rating,
        date: review.date,
        service_name: review.serviceName,
        comment: review.comment,
        job_verified: review.jobVerified
      });

    if (error) {
      console.warn('Supabase review insert error:', error.message);
      return false;
    }

    // Trigger notification to admin
    notifyNewReview(review).catch(() => {});
    return true;
  } catch (err) {
    console.warn('Failed to submit review to Supabase:', err);
    return false;
  }
}

/**
 * Save construction project to Supabase
 */
export async function submitConstructionProject(project: ConstructionProject): Promise<boolean> {
  if (!enforceSubmissionCooldown()) return false;

  try {
    const { error } = await supabase
      .from('construction_projects')
      .insert({
        id: project.id,
        customer_name: project.customerName,
        customer_phone: project.customerPhone,
        project_type: project.projectType,
        location: project.location,
        description: project.description,
        budget_range: project.budgetRange,
        timeline: project.timeline,
        required_trades: project.requiredTrades,
        status: project.status
      });

    if (error) {
      console.warn('Supabase project insert error:', error.message);
      return false;
    }

    // Trigger notification to admin
    notifyNewConstructionProject(project).catch(() => {});
    return true;
  } catch (err) {
    console.warn('Failed to submit construction project to Supabase:', err);
    return false;
  }
}

/**
 * Update artisan live availability
 */
export async function updateArtisanAvailability(
  artisanId: string,
  availability: AvailabilityStatus,
  isUrgentAccepting: boolean
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('artisans')
      .update({
        availability,
        is_urgent_accepting: isUrgentAccepting
      })
      .eq('id', artisanId);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Update job request status (e.g., accepted, declined)
 */
export async function updateJobRequestStatus(
  jobId: string,
  status: CustomerJobRequest['status']
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('customer_job_requests')
      .update({ status })
      .eq('id', jobId);

    return !error;
  } catch {
    return false;
  }
}
