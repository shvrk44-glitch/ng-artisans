import React, { useState } from 'react';
import { UserCheck, PhoneCall, CheckCircle, Search, ShieldAlert, Award, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenJoinModal: () => void;
  onExploreArtisans: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({
  onOpenJoinModal,
  onExploreArtisans
}) => {
  const [activeTab, setActiveTab] = useState<'customer' | 'artisan'>('customer');

  return (
    <section className="py-14 sm:py-20 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toggle Switch */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              HOW IT WORKS
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
              Simple, direct connection. Zero guesswork.
            </h2>
            <p className="mt-1 text-sm text-neutral-600">
              No endless WhatsApp groups or waiting days for referrals.
            </p>
          </div>

          {/* Dual Toggle Pill */}
          <div className="inline-flex p-1 rounded-xl bg-neutral-100 border border-neutral-200 self-start sm:self-auto">
            <button
              id="how-it-works-customer-tab"
              onClick={() => setActiveTab('customer')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'customer'
                  ? 'bg-white text-neutral-900 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              For Customers (Hiring)
            </button>
            <button
              id="how-it-works-artisan-tab"
              onClick={() => setActiveTab('artisan')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'artisan'
                  ? 'bg-neutral-900 text-amber-400 shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              For Artisans (Getting Work)
            </button>
          </div>
        </div>

        {/* Customer View */}
        {activeTab === 'customer' ? (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                <div>
                  <span className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 font-bold text-sm flex items-center justify-center font-display mb-4">
                    01
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">Tell us what you need.</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Pick your problem category: plumbing, electrical or construction. Select the exact issue and your neighborhood.
                  </p>
                </div>
                <div className="mt-4 text-[11px] font-semibold text-neutral-400">
                  Takes less than 15 seconds
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                <div>
                  <span className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 font-bold text-sm flex items-center justify-center font-display mb-4">
                    02
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">Find matching professionals.</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Instantly view verified artisans serving your area, with real completed job counts, ratings, and current availability.
                  </p>
                </div>
                <div className="mt-4 text-[11px] font-semibold text-neutral-400">
                  Ranked by service & area relevance
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                <div>
                  <span className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 font-bold text-sm flex items-center justify-center font-display mb-4">
                    03
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">Call or request the job.</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Tap <strong className="text-neutral-900">CALL NOW</strong> to speak with the artisan directly on your phone, or submit a request with photos.
                  </p>
                </div>
                <div className="mt-4 text-[11px] font-semibold text-amber-700">
                  One tap to direct call
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
                <div>
                  <span className="w-9 h-9 rounded-xl bg-neutral-900 text-amber-400 font-bold text-sm flex items-center justify-center font-display mb-4">
                    04
                  </span>
                  <h3 className="text-base font-bold text-neutral-900 mb-2">Get the work done.</h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    Agree on diagnosis, scope and materials upfront. When done, leave a verified review to help others in your neighborhood.
                  </p>
                </div>
                <div className="mt-4 text-[11px] font-semibold text-emerald-700">
                  Reviews tied to real jobs
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={onExploreArtisans}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 text-white font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-xs"
              >
                <span>Find an Artisan Now</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        ) : (
          /* Artisan View */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Artisan Value Headline */}
            <div className="p-6 sm:p-8 rounded-2xl bg-neutral-950 text-white border border-neutral-800">
              <div className="max-w-2xl">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
                  ARTISAN VALUE PROPOSITION
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display leading-tight text-white">
                  STOP WAITING FOR REFERRALS.
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-300">
                  Your next customer could already be looking for you. Create your profile, show what you do, get discovered, get direct phone calls, and build a lasting reputation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center font-display mb-4">
                  01
                </span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Create your professional profile.</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Register with your trade name, trade experience, and photos of past installations or site work.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center font-display mb-4">
                  02
                </span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Set your skills and service area.</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Specify exactly what you do (e.g. PPR piping, ATS changeover, floor tiling) and which neighborhoods you cover.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center font-display mb-4">
                  03
                </span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Receive relevant customer opportunities.</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Get incoming phone calls and direct job requests with description and attached photos from local clients.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200">
                <span className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm flex items-center justify-center font-display mb-4">
                  04
                </span>
                <h4 className="text-base font-bold text-neutral-900 mb-2">Connect and get the job.</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  Call the customer back immediately, inspect the site, complete the work, and collect ratings on your profile.
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                id="how-it-works-join-btn"
                onClick={onOpenJoinModal}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-neutral-950 font-bold text-sm hover:bg-amber-400 transition-colors shadow-xs"
              >
                <span>Join as an Artisan (Free Profile)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
