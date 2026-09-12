import React from 'react';
import { ShieldCheck, Phone, CheckCircle2, UserCheck, AlertTriangle, FileCheck2, Search } from 'lucide-react';
import { GooglePreferredSourceBadge } from './GooglePreferredSourceBadge';

export const TrustSection: React.FC = () => {
  return (
    <section id="trust-section" className="py-12 sm:py-16 bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>AUTHENTIC LOCAL VERIFICATION</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-950">
            How We Verify Skilled Artisans
          </h2>
          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
            Finding a reliable artisan shouldn't depend on unverified WhatsApp groups or strangers on the street. We do not use empty "100% safe" marketing claims; every badge is backed by a 4-step compliance procedure.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-bold text-neutral-900">National ID Verification</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We verify national identification (NIN, voter's card, or driver's license) to confirm genuine identity and personal accountability.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Direct Phone Confirmation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every phone number is verified via direct call testing so that when you press "Call Now", a live, active professional answers.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Trade Test & Association Checks</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We check trade qualification certificates (Federal Ministry of Labour Trade Test 1-3, NEMSA electrical licenses) and trade guild standing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Job-Tied Customer Reviews</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Reviews cannot be bought or submitted anonymously. Ratings are linked directly to actual customer calls and service requests.
            </p>
          </div>
        </div>

        {/* Verification Status Explainer Box (Section 26) */}
        <div className="mt-8 p-5 sm:p-6 bg-neutral-900 text-white rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              TRANSPARENT BADGING SYSTEM
            </span>
            <span className="text-[11px] text-neutral-400">
              Profiles that fail our safety checks are never published.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700">
              <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] font-bold block w-fit mb-1.5">
                VERIFIED
              </span>
              <p className="text-neutral-300 text-[11px]">ID, phone, and trade qualification confirmed.</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700">
              <span className="px-2 py-0.5 rounded bg-amber-900 text-amber-300 text-[10px] font-bold block w-fit mb-1.5">
                UNDER REVIEW
              </span>
              <p className="text-neutral-300 text-[11px]">New artisan application waiting for document check.</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700">
              <span className="px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 text-[10px] font-bold block w-fit mb-1.5">
                REJECTED
              </span>
              <p className="text-neutral-300 text-[11px]">Incomplete documentation or unverifiable credentials.</p>
            </div>

            <div className="p-3 rounded-xl bg-neutral-800 border border-neutral-700">
              <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold block w-fit mb-1.5">
                SUSPENDED
              </span>
              <p className="text-neutral-300 text-[11px]">Immediate removal if customer complaint verified.</p>
            </div>
          </div>
        </div>

        {/* Google Preferred Source & AI Overviews Integration */}
        <GooglePreferredSourceBadge variant="banner" className="mt-8" />
      </div>
    </section>
  );
};
