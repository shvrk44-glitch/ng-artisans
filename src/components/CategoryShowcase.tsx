import React from 'react';
import { Wrench, Zap, HardHat, ArrowRight, Check } from 'lucide-react';
import { ProfessionCategory } from '../types';
import { CATEGORIES } from '../data/categories';

interface CategoryShowcaseProps {
  onSelectCategory: (category: ProfessionCategory) => void;
  onSelectSubService: (category: ProfessionCategory, subService: string) => void;
  onOpenProjectModal?: () => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({
  onSelectCategory,
  onSelectSubService,
  onOpenProjectModal
}) => {
  return (
    <section className="py-12 sm:py-16 bg-neutral-50 border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            CORE PROFESSIONS
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950">
            Dedicated categories. Real skilled hands.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-neutral-600">
            Every professional on our network is organized by verified trade skill, ensuring you get someone qualified for your specific technical issue.
          </p>
        </div>

        {/* 3 Strong Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* 1. Plumbers */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col hover:border-neutral-300 transition-all group">
            <div className="relative h-48 overflow-hidden bg-neutral-900">
              <img
                src={CATEGORIES.plumbing.bannerImage}
                alt="Plumbing services"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs">
                  <Wrench className="w-3.5 h-3.5" />
                  PLUMBERS
                </span>
                <span className="text-[11px] text-white/90 font-medium">9 Sub-services</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-neutral-900">
                  {CATEGORIES.plumbing.name}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">
                  {CATEGORIES.plumbing.tagline}
                </p>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {CATEGORIES.plumbing.description}
                </p>

                {/* Sub-services pills */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold text-neutral-500 block mb-2">Common requests:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.plumbing.subServices.slice(0, 6).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => onSelectSubService('plumbing', sub)}
                        className="text-[11px] px-2 py-0.5 bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 rounded-md transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                <button
                  id="category-cta-plumbing"
                  onClick={() => onSelectCategory('plumbing')}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs group-hover:bg-amber-500 group-hover:text-neutral-950"
                >
                  <span>{CATEGORIES.plumbing.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 2. Electricians */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col hover:border-neutral-300 transition-all group">
            <div className="relative h-48 overflow-hidden bg-neutral-900">
              <img
                src={CATEGORIES.electrical.bannerImage}
                alt="Electrical work"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                  ELECTRICIANS
                </span>
                <span className="text-[11px] text-white/90 font-medium">9 Sub-services</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-neutral-900">
                  {CATEGORIES.electrical.name}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">
                  {CATEGORIES.electrical.tagline}
                </p>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {CATEGORIES.electrical.description}
                </p>

                {/* Sub-services pills */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold text-neutral-500 block mb-2">Common requests:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.electrical.subServices.slice(0, 6).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => onSelectSubService('electrical', sub)}
                        className="text-[11px] px-2 py-0.5 bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 rounded-md transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100">
                <button
                  id="category-cta-electrical"
                  onClick={() => onSelectCategory('electrical')}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs group-hover:bg-amber-500 group-hover:text-neutral-950"
                >
                  <span>{CATEGORIES.electrical.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Building & Construction */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col hover:border-neutral-300 transition-all group">
            <div className="relative h-48 overflow-hidden bg-neutral-900">
              <img
                src={CATEGORIES.construction.bannerImage}
                alt="Building and construction site"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 font-bold text-xs shadow-xs">
                  <HardHat className="w-3.5 h-3.5" />
                  BUILDING & CONSTRUCTION
                </span>
                <span className="text-[11px] text-white/90 font-medium">11 Sub-services</span>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold font-display text-neutral-900">
                  {CATEGORIES.construction.name}
                </h3>
                <p className="text-xs text-amber-700 font-semibold mt-0.5">
                  {CATEGORIES.construction.tagline}
                </p>
                <p className="mt-2.5 text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {CATEGORIES.construction.description}
                </p>

                {/* Sub-services pills */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold text-neutral-500 block mb-2">Common requests:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.construction.subServices.slice(0, 6).map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => onSelectSubService('construction', sub)}
                        className="text-[11px] px-2 py-0.5 bg-neutral-100 hover:bg-amber-100 text-neutral-700 hover:text-amber-900 rounded-md transition-colors"
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 space-y-2">
                <button
                  id="category-cta-construction"
                  onClick={() => onSelectCategory('construction')}
                  className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs group-hover:bg-amber-500 group-hover:text-neutral-950 cursor-pointer"
                >
                  <span>{CATEGORIES.construction.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onOpenProjectModal && (
                  <button
                    type="button"
                    onClick={onOpenProjectModal}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Start Multi-Trade Project</span>
                    <span className="text-[10px] text-amber-700 font-normal">(Mason, POP, Tiling)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
