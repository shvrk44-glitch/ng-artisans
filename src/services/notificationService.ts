/**
 * Notification Service for ng-artisans
 * Dispatches real-time alerts whenever a customer requests a job, an artisan registers,
 * or a construction project inquiry is submitted.
 *
 * Supports:
 * - Direct Zapier Catch Hook dispatch
 * - Pre-formatted email bodies so phone numbers and details always display effortlessly
 */

import { CustomerJobRequest, Artisan, ConstructionProject, Review } from '../types';

const DEFAULT_ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/28820895/4d4ytj7/';
const NOTIFICATION_WEBHOOK_URL =
  import.meta.env.VITE_NOTIFICATION_WEBHOOK_URL || DEFAULT_ZAPIER_WEBHOOK_URL;
const ADMIN_EMAIL = 'shvrk44@gmail.com';

interface NotificationPayload {
  eventType: 'JOB_REQUEST' | 'ARTISAN_REGISTRATION' | 'CONSTRUCTION_PROJECT' | 'REVIEW';
  title: string;
  summary: string;
  message: string;
  email_body: string;
  body: string;
  details: Record<string, any>;
  recipientEmail: string;
  timestamp: string;
  [key: string]: any;
}

/**
 * Dispatch a notification payload to an external webhook if configured
 */
export async function sendAdminNotification(payload: NotificationPayload): Promise<boolean> {
  if (NOTIFICATION_WEBHOOK_URL) {
    try {
      await fetch(NOTIFICATION_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      return true;
    } catch (err) {
      console.warn('Notification webhook dispatch error:', err);
    }
  }

  console.info(`[ADMIN NOTIFICATION -> ${ADMIN_EMAIL}]:`, payload.title, payload.details);
  return true;
}

/**
 * Notify admin of new customer job request
 */
export async function notifyNewJobRequest(job: CustomerJobRequest): Promise<void> {
  const isUrgent = job.urgency === 'urgent';
  const phone = job.customerPhone;
  const locationText = `${job.location.neighborhood}, ${job.location.city}`;
  
  const formattedBody = [
    `🚨 NEW JOB REQUEST ON NG-ARTISANS`,
    `--------------------------------------`,
    `CUSTOMER NAME: ${job.customerName}`,
    `PHONE NUMBER:  ${phone}`,
    `SERVICE:       ${job.category.toUpperCase()} (${job.subService})`,
    `URGENCY:       ${job.urgency.toUpperCase()}`,
    `LOCATION:      ${locationText}`,
    job.location.address ? `ADDRESS:       ${job.location.address}` : '',
    `--------------------------------------`,
    `PROBLEM DESCRIPTION:`,
    job.description,
    `--------------------------------------`,
    `👉 Call customer directly at: ${phone}`
  ].filter(Boolean).join('\n');

  await sendAdminNotification({
    eventType: 'JOB_REQUEST',
    title: `${isUrgent ? '🚨 URGENT ' : '📋 '}New Job Request: ${job.category.toUpperCase()} (${job.subService})`,
    summary: `${job.customerName} - Phone: ${phone} - Location: ${locationText}`,
    message: formattedBody,
    email_body: formattedBody,
    body: formattedBody,
    customer_name: job.customerName,
    customer_phone: phone,
    phone: phone,
    phone_number: phone,
    contact_phone: phone,
    service_category: job.category,
    sub_service: job.subService,
    urgency_level: job.urgency,
    location_city: job.location.city,
    location_neighborhood: job.location.neighborhood,
    full_address: locationText,
    job_description: job.description,
    job_id: job.id,
    details: {
      customerName: job.customerName,
      customerPhone: phone,
      category: job.category,
      subService: job.subService,
      location: locationText,
      urgency: job.urgency,
      description: job.description,
      jobId: job.id
    },
    recipientEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });
}

/**
 * Notify admin of new artisan registration application
 */
export async function notifyNewArtisanRegistration(artisan: Artisan): Promise<void> {
  const phone = artisan.phone;
  const locationText = `${artisan.location.neighborhood}, ${artisan.location.city}`;
  
  const formattedBody = [
    `👷 NEW ARTISAN REGISTRATION`,
    `--------------------------------------`,
    `ARTISAN NAME:  ${artisan.name}`,
    `BUSINESS NAME: ${artisan.businessName || 'N/A'}`,
    `TRADE/PROFESSION: ${artisan.professionLabel}`,
    `PHONE NUMBER:  ${phone}`,
    `EXPERIENCE:    ${artisan.yearsOfExperience} years`,
    `LOCATION:      ${locationText}`,
    `--------------------------------------`,
    `👉 Contact artisan at: ${phone}`
  ].join('\n');

  await sendAdminNotification({
    eventType: 'ARTISAN_REGISTRATION',
    title: `👷 New Artisan Registration: ${artisan.businessName || artisan.name}`,
    summary: `${artisan.name} applied as ${artisan.professionLabel} - Phone: ${phone}`,
    message: formattedBody,
    email_body: formattedBody,
    body: formattedBody,
    artisan_name: artisan.name,
    business_name: artisan.businessName,
    profession: artisan.profession,
    profession_label: artisan.professionLabel,
    phone: phone,
    artisan_phone: phone,
    years_of_experience: artisan.yearsOfExperience,
    location_city: artisan.location.city,
    location_neighborhood: artisan.location.neighborhood,
    verification_status: artisan.verificationStatus,
    details: {
      name: artisan.name,
      businessName: artisan.businessName,
      profession: artisan.profession,
      phone: phone,
      yearsOfExperience: artisan.yearsOfExperience,
      city: artisan.location.city,
      neighborhood: artisan.location.neighborhood,
      verificationStatus: artisan.verificationStatus,
      artisanId: artisan.id
    },
    recipientEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });
}

/**
 * Notify admin of new construction project request
 */
export async function notifyNewConstructionProject(project: ConstructionProject): Promise<void> {
  const phone = project.customerPhone;
  const locationText = `${project.location.neighborhood}, ${project.location.city}`;
  
  const formattedBody = [
    `🏗️ NEW CONSTRUCTION PROJECT INQUIRY`,
    `--------------------------------------`,
    `CLIENT NAME:  ${project.customerName}`,
    `PHONE NUMBER: ${phone}`,
    `PROJECT TYPE: ${project.projectType}`,
    `BUDGET RANGE: ${project.budgetRange}`,
    `TIMELINE:     ${project.timeline}`,
    `TRADES:       ${project.requiredTrades.join(', ')}`,
    `LOCATION:     ${locationText}`,
    `--------------------------------------`,
    `SCOPE OF WORK:`,
    project.description,
    `--------------------------------------`,
    `👉 Call client at: ${phone}`
  ].join('\n');

  await sendAdminNotification({
    eventType: 'CONSTRUCTION_PROJECT',
    title: `🏗️ New Construction Project: ${project.projectType}`,
    summary: `${project.customerName} - Budget: ${project.budgetRange} - Phone: ${phone}`,
    message: formattedBody,
    email_body: formattedBody,
    body: formattedBody,
    customer_name: project.customerName,
    customer_phone: phone,
    phone: phone,
    project_type: project.projectType,
    budget_range: project.budgetRange,
    timeline: project.timeline,
    required_trades: project.requiredTrades.join(', '),
    location: locationText,
    description: project.description,
    details: {
      customerName: project.customerName,
      customerPhone: phone,
      projectType: project.projectType,
      budget: project.budgetRange,
      timeline: project.timeline,
      tradesRequired: project.requiredTrades,
      location: locationText,
      description: project.description
    },
    recipientEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });
}

/**
 * Notify admin of customer review
 */
export async function notifyNewReview(review: Review): Promise<void> {
  const formattedBody = [
    `⭐ NEW REVIEW RECEIVED`,
    `--------------------------------------`,
    `CUSTOMER: ${review.customerName}`,
    `RATING:   ${review.rating} / 5 Stars`,
    `SERVICE:  ${review.serviceName}`,
    `COMMENT:  ${review.comment}`
  ].join('\n');

  await sendAdminNotification({
    eventType: 'REVIEW',
    title: `⭐ New Review: ${review.rating}/5 stars for ${review.serviceName}`,
    summary: `${review.customerName} left a ${review.rating}-star review.`,
    message: formattedBody,
    email_body: formattedBody,
    body: formattedBody,
    customer_name: review.customerName,
    rating: review.rating,
    service_name: review.serviceName,
    comment: review.comment,
    details: {
      customerName: review.customerName,
      rating: review.rating,
      serviceName: review.serviceName,
      comment: review.comment,
      artisanId: review.artisanId
    },
    recipientEmail: ADMIN_EMAIL,
    timestamp: new Date().toISOString()
  });
}
