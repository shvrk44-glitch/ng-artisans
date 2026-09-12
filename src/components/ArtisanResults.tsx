import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, CheckCircle2, Star, MapPin, Clock, Filter, AlertCircle, Sparkles, ChevronRight, MessageSquare, ArrowUpDown } from 'lucide-react';
import { Artisan, ProfessionCategory } from '../types';
import { ScoredArtisan } from '../utils/matching';
import { CATEGORIES, SUPPORTED_LOCATIONS } from '../data/categories';

interface ArtisanResultsProps {
  scoredArtisans: ScoredArtisan[];
  selectedCategory: ProfessionCategory | 'all';
  onSelectCategory: (category: ProfessionCategory | 'all') => void;
  selectedSubService?: string;
  onSelectSubService?: (sub: string) => void;
  selectedLocation: string;
  onSelectLocation: (loc: string) => void;
  urgentOnly: boolean;
  onToggleUrgentOnly: (val: boolean) => void;
  verifiedOnly: boolean;
  onToggleVerifiedOnly: (val: boolean) => void;
  availableOnly: boolean;
  onToggleAvailableOnly: (val: boolean) => void;
  onCallArtisan: (artisan: Artisan) => void;
  onRequestArtisan: (artisan: Artisan) => void;
  onViewProfile: (artisan: Artisan) => void;
}

export const ArtisanResults: React.FC<ArtisanResultsProps> = ({
  scoredArtisans,
  selectedCategory,
  onSelectCategory,
  selectedSubService,
  onSelectSubService,
  selectedLocation,
  onSelectLocation,
  urgentOnly,
  onToggleUrgentOnly,
  verifiedOnly,
  onToggleVerifiedOnly,
  availableOnly,
  onToggleAvailableOnly,
  onCallArtisan,
  onRequestArtisan,
  onViewProfile
}) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <section id="artisan-results-section" className="py-8 sm:py-12 bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Results Header & Context */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <span>MATCH QUALITY SEARCH</span>
              <span>•</span>
              <span>{scoredArtisans.length} verified match{scoredArtisans.length === 1 ? '' : 'es'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-950">
              {selectedCategory === 'all'
                ? 'Available Artisans'
                : selectedCategory === 'plumbing'
                ? 'Plumbing Specialists'
                : selectedCategory === 'electrical'
                ? 'Electricians & Technicians'
                : 'Building & Construction Craftsmen'}
              {selectedLocation ? ` in ${selectedLocation}` : ''}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1">
              Ranked by trade skills match, location service area, real completed jobs, and availability.
            </p>
          </div>

          {/* Quick filter toggle on mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex-1 py-2 px-3 bg-white border border-neutral-300 rounded-lg text-xs font-semibold text-neutral-800 flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Filter className="w-3.5 h-3.5 text-neutral-600" />
              {showMobileFilters ? 'Hide Filters' : 'Refine Filters & Area'}
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className={`bg-white rounded-xl border border-neutral-200 p-4 mb-6 shadow-xs ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Profession
              </label>
              <select
                id="filter-category-select"
                aria-label="Filter by profession category"
                value={selectedCategory}
                onChange={(e) => onSelectCategory(e.target.value as ProfessionCategory | 'all')}
                className="w-full text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-lg py-2 px-2.5 text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="all">All Trade Categories</option>
                <option value="plumbing">🚰 Plumbers</option>
                <option value="electrical">⚡ Electricians</option>
                <option value="construction">🏗️ Building & Construction</option>
              </select>
            </div>

            {/* Neighborhood / Area Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Area / Neighborhood
              </label>
              <select
                id="filter-location-select"
                aria-label="Filter by neighborhood or area"
                value={selectedLocation}
                onChange={(e) => onSelectLocation(e.target.value)}
                className="w-full text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-lg py-2 px-2.5 text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">All Service Areas (Abuja & Lagos)</option>
                <optgroup label="Abuja (FCT)">
                  {SUPPORTED_LOCATIONS[0].neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}, Abuja</option>
                  ))}
                </optgroup>
                <optgroup label="Lagos">
                  {SUPPORTED_LOCATIONS[1].neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}, Lagos</option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Subservice Filter if category selected */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                Specific Work / Skill
              </label>
              <select
                id="filter-subservice-select"
                aria-label="Filter by specific sub-service or skill"
                value={selectedSubService || ''}
                onChange={(e) => onSelectSubService?.(e.target.value)}
                className="w-full text-xs font-semibold bg-neutral-50 border border-neutral-300 rounded-lg py-2 px-2.5 text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="">Any sub-service</option>
                {selectedCategory !== 'all' && CATEGORIES[selectedCategory as ProfessionCategory]?.subServices.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
                {selectedCategory === 'all' && (
                  <>
                    <optgroup label="Plumbing">
                      {CATEGORIES.plumbing.subServices.slice(0, 4).map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                    <optgroup label="Electrical">
                      {CATEGORIES.electrical.subServices.slice(0, 4).map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                    <optgroup label="Construction">
                      {CATEGORIES.construction.subServices.slice(0, 4).map(s => <option key={s} value={s}>{s}</option>)}
                    </optgroup>
                  </>
                )}
              </select>
            </div>

            {/* Quick toggles */}
            <div className="flex flex-col justify-end">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  id="filter-urgent-toggle"
                  onClick={() => onToggleUrgentOnly(!urgentOnly)}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-[11px] font-bold transition-colors border flex items-center justify-center gap-1 ${
                    urgentOnly
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${urgentOnly ? 'bg-rose-600 animate-ping' : 'bg-neutral-400'}`} />
                  Urgent Only
                </button>

                <button
                  type="button"
                  id="filter-verified-toggle"
                  onClick={() => onToggleVerifiedOnly(!verifiedOnly)}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-[11px] font-bold transition-colors border flex items-center justify-center gap-1 ${
                    verifiedOnly
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified
                </button>
              </div>
            </div>
          </div>

          {/* Active chips row */}
          {(selectedCategory !== 'all' || selectedLocation || selectedSubService || urgentOnly || verifiedOnly) && (
            <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-neutral-500 text-[11px] font-semibold">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold">
                  {selectedCategory.toUpperCase()}
                  <button onClick={() => onSelectCategory('all')} className="hover:text-red-700">×</button>
                </span>
              )}
              {selectedLocation && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800 text-xs font-semibold">
                  📍 {selectedLocation}
                  <button onClick={() => onSelectLocation('')} className="hover:text-red-700">×</button>
                </span>
              )}
              {selectedSubService && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800 text-xs font-semibold">
                  🔧 {selectedSubService}
                  <button onClick={() => onSelectSubService?.('')} className="hover:text-red-700">×</button>
                </span>
              )}
              {urgentOnly && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-900 text-xs font-semibold">
                  🚨 Urgent Ready
                  <button onClick={() => onToggleUrgentOnly(false)} className="hover:text-red-700">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectLocation('');
                  onSelectSubService?.('');
                  onToggleUrgentOnly(false);
                  onToggleVerifiedOnly(false);
                }}
                className="text-xs text-neutral-500 hover:text-neutral-900 underline ml-2"
              >
                Reset all
              </button>
            </div>
          )}
        </div>

        {/* Results Grid */}
        {scoredArtisans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200 p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900">No exact artisan match in this area</h3>
            <p className="text-xs sm:text-sm text-neutral-600 mt-1.5 leading-relaxed">
              We did not find professionals matching all criteria in {selectedLocation || 'this zone'}. Try broadening your area or resetting specific filters.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  onSelectLocation('');
                  onSelectSubService?.('');
                  onToggleUrgentOnly(false);
                }}
                className="px-4 py-2 rounded-lg bg-neutral-900 text-white font-semibold text-xs hover:bg-neutral-800"
              >
                Show All Available Artisans
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {scoredArtisans.map(({ artisan, score, matchReasons }) => {
              const isAvailable = artisan.availability === 'available';
              const isVerified = artisan.verificationStatus === 'verified';

              return (
                <div
                  key={artisan.id}
                  id={`artisan-card-${artisan.id}`}
                  className="bg-white rounded-2xl border border-neutral-200 shadow-xs hover:border-neutral-300 hover:shadow-md transition-all p-4 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: Avatar & Information Hierarchy */}
                    <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                      {/* Avatar with status indicator */}
                      <div className="relative shrink-0">
                        <img
                          src={artisan.avatar}
                          alt={artisan.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-neutral-200 bg-neutral-100"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                        <span
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          title={isAvailable ? 'Available today' : 'Busy / On site'}
                        />
                      </div>

                      {/* Main Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            onClick={() => onViewProfile(artisan)}
                            className="text-base sm:text-lg font-bold font-display text-neutral-950 hover:text-amber-600 cursor-pointer truncate"
                          >
                            {artisan.businessName}
                          </h3>

                          {/* Verified Badge with explanation */}
                          {isVerified ? (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200"
                              title="Verified identity and trade skills inspection"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600 text-[11px] font-medium border border-neutral-200">
                              Under Review
                            </span>
                          )}

                          {artisan.isUrgentAccepting && isAvailable && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold">
                              🚨 Urgent Ready
                            </span>
                          )}
                        </div>

                        {/* Person Name & Profession */}
                        <p className="text-xs sm:text-sm font-semibold text-neutral-700 mt-0.5">
                          {artisan.name} • <span className="text-amber-800">{artisan.professionLabel}</span>
                        </p>

                        {/* Location and Distance/Service Area */}
                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-neutral-500">
                          <span className="flex items-center gap-1 font-medium text-neutral-700">
                            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                            {artisan.location.neighborhood} / {artisan.location.city}
                          </span>
                          <span className="text-neutral-300">•</span>
                          <span>Serves: {artisan.serviceAreas.slice(0, 3).join(', ')}</span>
                          <span className="text-neutral-300">•</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {artisan.responseTimeText}
                          </span>
                        </div>

                        {/* Ratings and Real Jobs */}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-900 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            <span>{artisan.rating}</span>
                            <span className="text-neutral-400 font-normal">({artisan.reviewCount} reviews)</span>
                          </div>

                          <span className="font-bold text-neutral-800">
                            {artisan.completedJobsCount} completed jobs
                          </span>

                          <span className="text-neutral-400 font-normal">
                            {artisan.yearsOfExperience} yrs in trade
                          </span>
                        </div>

                        {/* Bio snippet */}
                        <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                          "{artisan.bio}"
                        </p>

                        {/* Skills / Sub-services tags */}
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {artisan.subServices.slice(0, 5).map(skill => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded text-[11px] font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {artisan.subServices.length > 5 && (
                            <span className="px-1.5 py-0.5 text-neutral-400 text-[11px]">
                              +{artisan.subServices.length - 5} more
                            </span>
                          )}
                        </div>

                        {/* Match reasons explanation strip */}
                        {matchReasons && matchReasons.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Why recommended:
                            </span>
                            {matchReasons.map(reason => (
                              <span key={reason} className="bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded font-medium">
                                ✓ {reason}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions Cluster (High-conversion Call Now is dominant) */}
                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-neutral-100 sm:w-48 shrink-0">
                      {/* Price guidance pill */}
                      <div className="text-left sm:text-right hidden sm:block">
                        <span className="text-[10px] text-neutral-500 block uppercase font-bold">Pricing guidance</span>
                        <span className="text-xs font-semibold text-neutral-800">{artisan.pricingGuidance.split('.')[0]}</span>
                      </div>

                      {/* Primary Action: CALL NOW */}
                      <button
                        id={`call-now-btn-${artisan.id}`}
                        onClick={() => onCallArtisan(artisan)}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-97 cursor-pointer"
                      >
                        <PhoneCall className="w-4 h-4 animate-bounce" />
                        <span>CALL NOW</span>
                      </button>

                      {/* Secondary: REQUEST JOB */}
                      <button
                        id={`request-job-btn-${artisan.id}`}
                        onClick={() => onRequestArtisan(artisan)}
                        className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        <span>Request Job</span>
                      </button>

                      {/* Tertiary: View Profile */}
                      <button
                        onClick={() => onViewProfile(artisan)}
                        className="text-xs text-neutral-600 hover:text-neutral-950 font-medium py-1 text-center w-full"
                      >
                        View Full Profile →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
