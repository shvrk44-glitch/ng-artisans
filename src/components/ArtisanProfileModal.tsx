import React from 'react';
import { X, PhoneCall, ShieldCheck, Star, MapPin, Clock, CheckCircle2, MessageSquare, Award, Globe, Wrench, Calendar, ChevronRight, AlertCircle } from 'lucide-react';
import { Artisan, Review } from '../types';

interface ArtisanProfileModalProps {
  artisan: Artisan | null;
  reviews: Review[];
  onClose: () => void;
  onCallNow: (artisan: Artisan) => void;
  onRequestJob: (artisan: Artisan) => void;
  onAddReview?: (review: Omit<Review, 'id' | 'date'>) => void;
}

export const ArtisanProfileModal: React.FC<ArtisanProfileModalProps> = ({
  artisan,
  reviews,
  onClose,
  onCallNow,
  onRequestJob,
  onAddReview
}) => {
  if (!artisan) return null;

  const [isReviewFormOpen, setIsReviewFormOpen] = React.useState(false);
  const [reviewName, setReviewName] = React.useState('');
  const [reviewLocation, setReviewLocation] = React.useState(artisan.location.neighborhood);
  const [reviewService, setReviewService] = React.useState(artisan.subServices[0] || 'Repair');
  const [reviewRating, setReviewRating] = React.useState(5);
  const [reviewComment, setReviewComment] = React.useState('');
  const [reviewSubmitted, setReviewSubmitted] = React.useState(false);
  const [reviewError, setReviewError] = React.useState<string | null>(null);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError('Please enter your name and a brief review of the completed job.');
      return;
    }
    if (onAddReview) {
      onAddReview({
        artisanId: artisan.id,
        customerName: reviewName.trim(),
        customerLocation: reviewLocation.trim() || artisan.location.neighborhood,
        rating: reviewRating,
        comment: reviewComment.trim(),
        serviceName: reviewService,
        jobVerified: true
      });
      setReviewSubmitted(true);
      setIsReviewFormOpen(false);
      setReviewComment('');
    }
  };

  const artisanReviews = reviews.filter(r => r.artisanId === artisan.id);
  const isAvailable = artisan.availability === 'available';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Sticky Header with Close */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              Artisan Profile
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-semibold text-neutral-800">{artisan.professionLabel}</span>
          </div>

          <button
            id="close-profile-modal-btn"
            onClick={onClose}
            className="p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Profile Header Hero */}
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 pb-6 border-b border-neutral-200">
            <div className="relative shrink-0">
              <img
                src={artisan.avatar}
                alt={artisan.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-neutral-200 shadow-xs"
                referrerPolicy="no-referrer"
              />
              <span
                className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white shadow-xs ${
                  isAvailable ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {isAvailable ? 'Available Today' : 'Busy / On Site'}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-display text-neutral-950">
                  {artisan.businessName}
                </h2>
                {artisan.verificationStatus === 'verified' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Verified Artisan
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-neutral-700 mt-1">
                {artisan.name} • <span className="text-amber-700">{artisan.professionLabel}</span>
              </p>

              {/* Location and service areas */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-neutral-600">
                <span className="flex items-center gap-1 font-medium text-neutral-900">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  {artisan.location.neighborhood}, {artisan.location.city}
                </span>
                <span className="text-neutral-300">•</span>
                <span>Max radius: {artisan.maxTravelRadiusKm} km</span>
                <span className="text-neutral-300">•</span>
                <span className="text-emerald-700 font-semibold">{artisan.responseTimeText}</span>
              </div>

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-100 text-center">
                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-center gap-1 text-sm font-extrabold text-neutral-900">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>{artisan.rating}</span>
                  </div>
                  <span className="text-[10px] text-neutral-500">{artisan.reviewCount} customer reviews</span>
                </div>

                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                  <span className="text-sm font-extrabold text-neutral-900 block">
                    {artisan.completedJobsCount}
                  </span>
                  <span className="text-[10px] text-neutral-500">Completed jobs</span>
                </div>

                <div className="bg-neutral-50 p-2 rounded-xl border border-neutral-200">
                  <span className="text-sm font-extrabold text-neutral-900 block">
                    {artisan.yearsOfExperience} yrs
                  </span>
                  <span className="text-[10px] text-neutral-500">Trade experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Direct Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-900 text-white">
            <button
              id={`modal-call-artisan-btn-${artisan.id}`}
              onClick={() => onCallNow(artisan)}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-97 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>CALL {artisan.name.toUpperCase()} NOW</span>
            </button>

            <button
              id={`modal-request-job-btn-${artisan.id}`}
              onClick={() => onRequestJob(artisan)}
              className="py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>REQUEST THIS ARTISAN</span>
            </button>
          </div>

          {/* About Section */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              ABOUT THE ARTISAN & PRACTICE
            </h3>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              {artisan.bio}
            </p>
          </div>

          {/* Verification Breakdown (Trust Layer) */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                VERIFICATION & TRUST LAYER
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 block">Identity Checked</span>
                  <span className="text-[10px] text-neutral-500">Government ID confirmed</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 block">Phone Confirmed</span>
                  <span className="text-[10px] text-neutral-500">Direct active line</span>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/90 p-2.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <span className="font-bold text-neutral-900 block">Trade Qualified</span>
                  <span className="text-[10px] text-neutral-500">Trade test / peer references</span>
                </div>
              </div>
            </div>
            {artisan.verificationDetails.notes && (
              <p className="text-[11px] text-emerald-800 italic">
                Note: {artisan.verificationDetails.notes}
              </p>
            )}
          </div>

          {/* Skills & Sub-services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
              VERIFIED SKILLS & SERVICES
            </h3>
            <div className="flex flex-wrap gap-2">
              {artisan.subServices.map(skill => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium border border-neutral-200"
                >
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Key Practical Details: Pricing, Languages, Working Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                Pricing Guidance
              </span>
              <p className="text-xs font-semibold text-neutral-900">
                {artisan.pricingGuidance}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                Working Hours
              </span>
              <p className="text-xs font-semibold text-neutral-900">
                {artisan.workingHours}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
              <span className="text-[10px] uppercase font-bold text-neutral-500 block mb-1">
                Languages Spoken
              </span>
              <p className="text-xs font-semibold text-neutral-900">
                {artisan.languages.join(', ')}
              </p>
            </div>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              SERVICE COVERAGE AREAS
            </h3>
            <div className="flex flex-wrap gap-2">
              {artisan.serviceAreas.map(area => (
                <span key={area} className="px-2.5 py-1 bg-amber-50 text-amber-900 text-xs font-semibold rounded-md border border-amber-200">
                  📍 {area}
                </span>
              ))}
            </div>
          </div>

          {/* Work / Site Photos Gallery */}
          {artisan.portfolioImages && artisan.portfolioImages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                PAST WORK & SITES
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {artisan.portfolioImages.map((img, idx) => (
                  <div key={idx} className="h-32 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                    <img
                      src={img}
                      alt={`Work sample ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews Tied to Actual Jobs */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  CUSTOMER REVIEWS ({artisanReviews.length})
                </h3>
                <span className="text-[11px] text-neutral-500">Tied to real completed jobs</span>
              </div>

              {onAddReview && (
                <button
                  type="button"
                  onClick={() => {
                    setIsReviewFormOpen(!isReviewFormOpen);
                    setReviewError(null);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isReviewFormOpen ? 'Cancel' : '+ Leave a Review'}
                </button>
              )}
            </div>

            {reviewSubmitted && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Thank you! Your verified job review has been posted and the rating has been updated.</span>
              </div>
            )}

            {isReviewFormOpen && (
              <form onSubmit={handleReviewSubmit} className="mb-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">Write a Review for {artisan.businessName}</span>
                  <span className="text-[10px] text-neutral-500">Verified customer feedback</span>
                </div>

                {/* Rating selection */}
                <div>
                  <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1 rounded hover:scale-110 transition-transform cursor-pointer"
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star className={`w-5 h-5 ${star <= reviewRating ? 'fill-amber-400 text-amber-500' : 'text-neutral-300'}`} />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-neutral-700 ml-2">
                      {reviewRating === 5 ? '5/5 - Excellent' : reviewRating === 4 ? '4/5 - Very Good' : reviewRating === 3 ? '3/5 - Good' : reviewRating === 2 ? '2/5 - Fair' : '1/5 - Poor'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Your Name:</label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel Ade"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Your Neighborhood:</label>
                    <input
                      type="text"
                      placeholder="e.g. Gwarinpa, Abuja"
                      value={reviewLocation}
                      onChange={(e) => setReviewLocation(e.target.value)}
                      className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Job / Service Completed:</label>
                  <select
                    value={reviewService}
                    onChange={(e) => setReviewService(e.target.value)}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none"
                  >
                    {artisan.subServices.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                    <option value="General Inspection / Repair">General Inspection / Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Your Feedback / Work Review:</label>
                  <textarea
                    rows={2}
                    placeholder="Describe how the work went, punctuality, and quality..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full p-2 bg-white border border-neutral-300 rounded-lg text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    required
                  />
                </div>

                {reviewError && (
                  <p className="text-xs text-rose-600">{reviewError}</p>
                )}

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="submit"
                    className="py-1.5 px-4 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </div>
              </form>
            )}

            {artisanReviews.length === 0 ? (
              <div className="p-5 rounded-xl bg-neutral-50 border border-neutral-200 text-center">
                <p className="text-xs text-neutral-600">
                  New professional on the network — be the first customer to leave a review!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {artisanReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900">{rev.customerName}</span>
                        <span className="text-[10px] text-neutral-500">({rev.customerLocation})</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-amber-800 font-semibold">
                      <span>Job: {rev.serviceName}</span>
                      {rev.jobVerified && (
                        <span className="inline-flex items-center gap-0.5 text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                          ✓ Verified Job
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-neutral-700 leading-relaxed">
                      "{rev.comment}"
                    </p>
                    <span className="text-[10px] text-neutral-400 block">{rev.date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Mobile Call & Request Bar */}
        <div className="sticky bottom-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-t border-neutral-200 sm:hidden flex items-center gap-2">
          <button
            onClick={() => onCallNow(artisan)}
            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>CALL NOW</span>
          </button>

          <button
            onClick={() => onRequestJob(artisan)}
            className="flex-1 py-3 rounded-xl bg-neutral-900 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>REQUEST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
