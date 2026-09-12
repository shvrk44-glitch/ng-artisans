import React, { useState } from 'react';
import { Wrench, Zap, HardHat, MapPin, Search, PhoneCall, ChevronRight, CheckCircle2, Crosshair, Sparkles, ArrowRight } from 'lucide-react';
import { ProfessionCategory } from '../types';
import { CATEGORIES, SUPPORTED_LOCATIONS, POPULAR_SEARCH_PRESETS } from '../data/categories';
import { parseNaturalSearch } from '../utils/matching';

interface HeroProblemSolverProps {
  onSearch: (params: {
    category?: ProfessionCategory | 'all';
    subService?: string;
    location?: string;
    query?: string;
    urgentOnly?: boolean;
  }) => void;
  onOpenJoinModal: () => void;
  availableArtisansCount: number;
}

export const HeroProblemSolver: React.FC<HeroProblemSolverProps> = ({
  onSearch,
  onOpenJoinModal,
  availableArtisansCount
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProfessionCategory>('plumbing');
  const [selectedSubService, setSelectedSubService] = useState<string>('leaking pipes');
  const [selectedLocation, setSelectedLocation] = useState<string>('Wuse');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [naturalQuery, setNaturalQuery] = useState<string>('');
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);

  const activeCategoryData = CATEGORIES[selectedCategory];

  const handleCategorySelect = (cat: ProfessionCategory) => {
    setSelectedCategory(cat);
    // select first sub-service of that category by default
    setSelectedSubService(CATEGORIES[cat].subServices[0]);
  };

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          // Simulation of neighborhood resolution in Abuja/Lagos
          setSelectedLocation('Gwarinpa');
          setCustomLocation('Gwarinpa Estate, Abuja');
          setIsDetectingLocation(false);
        },
        () => {
          // Fallback gracefully without error
          setSelectedLocation('Wuse');
          setCustomLocation('Wuse Zone 4, Abuja');
          setIsDetectingLocation(false);
        },
        { timeout: 4000 }
      );
    } else {
      setSelectedLocation('Wuse');
      setIsDetectingLocation(false);
    }
  };

  const handleDirectSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (naturalQuery.trim()) {
      const parsed = parseNaturalSearch(naturalQuery);
      onSearch({
        category: parsed.category || selectedCategory,
        subService: parsed.subService || selectedSubService,
        location: parsed.location || customLocation || selectedLocation,
        query: naturalQuery.trim(),
        urgentOnly: isUrgent || parsed.isUrgent
      });
    } else {
      onSearch({
        category: selectedCategory,
        subService: selectedSubService,
        location: customLocation || selectedLocation,
        urgentOnly: isUrgent
      });
    }
  };

  const handleApplyPreset = (preset: typeof POPULAR_SEARCH_PRESETS[0]) => {
    const parsed = parseNaturalSearch(preset.query);
    setSelectedCategory(preset.category as ProfessionCategory);
    if (parsed.subService) setSelectedSubService(parsed.subService);
    if (preset.location) setSelectedLocation(preset.location);
    if (preset.urgent) setIsUrgent(true);

    onSearch({
      category: preset.category as ProfessionCategory,
      subService: parsed.subService || preset.query,
      location: preset.location || selectedLocation,
      query: preset.query,
      urgentOnly: preset.urgent || false
    });
  };

  return (
    <section className="relative overflow-hidden bg-white border-b border-neutral-200 pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pb-20">
      {/* Subtle geometric pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust & Value Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local Skilled Services Discovery & Connection</span>
            <span className="text-neutral-400">•</span>
            <span className="text-neutral-600 font-normal">Abuja & Lagos</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-xs text-neutral-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Verified Identity & Trade Checks
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
              Direct Phone Call
            </span>
          </div>
        </div>

        {/* Hero Title & Promise */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-950 font-display leading-[1.12]">
            NEED AN ARTISAN?
            <span className="block text-amber-600 mt-1">
              GET THE RIGHT ONE ON THE LINE.
            </span>
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
            Find plumbers, electricians and construction professionals for jobs around you — and connect directly with the person who can get the work done.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('problem-action-box');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm font-semibold hover:bg-neutral-800 transition-colors shadow-xs"
            >
              Find an Artisan
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
            <button
              onClick={onOpenJoinModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-neutral-300 text-neutral-800 text-sm font-semibold hover:bg-neutral-50 transition-colors"
            >
              Join as an Artisan
            </button>
          </div>
        </div>

        {/* Interactive Action Hub: WHAT DO YOU NEED HELP WITH? */}
        <div
          id="problem-action-box"
          className="bg-white rounded-2xl border-2 border-neutral-900 shadow-xl overflow-hidden"
        >
          {/* Top Bar of Hub */}
          <div className="bg-neutral-900 text-white px-5 py-3.5 sm:px-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                STEP 1 OF 3
              </span>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                WHAT DO YOU NEED HELP WITH?
              </h2>
            </div>
            <div className="text-xs text-neutral-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{availableArtisansCount} verified professionals active in your zone</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-7 space-y-6">
            {/* 1. Category Selection Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2.5">
                Select Trade Category:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Plumbing Card */}
                <button
                  id="category-tab-plumbing"
                  type="button"
                  onClick={() => handleCategorySelect('plumbing')}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    selectedCategory === 'plumbing'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    selectedCategory === 'plumbing' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">PLUMBING</span>
                      {selectedCategory === 'plumbing' && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      Leaks, blocked pipes, pumps & tanks
                    </p>
                  </div>
                </button>

                {/* Electrical Card */}
                <button
                  id="category-tab-electrical"
                  type="button"
                  onClick={() => handleCategorySelect('electrical')}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    selectedCategory === 'electrical'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    selectedCategory === 'electrical' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">ELECTRICAL</span>
                      {selectedCategory === 'electrical' && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      Faults, wiring, generators & inverters
                    </p>
                  </div>
                </button>

                {/* Building & Construction Card */}
                <button
                  id="category-tab-construction"
                  type="button"
                  onClick={() => handleCategorySelect('construction')}
                  className={`flex items-start gap-3.5 p-3.5 rounded-xl border text-left transition-all ${
                    selectedCategory === 'construction'
                      ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-neutral-200 bg-neutral-50/50 hover:bg-neutral-50 hover:border-neutral-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${
                    selectedCategory === 'construction' ? 'bg-amber-500 text-neutral-950' : 'bg-neutral-200 text-neutral-700'
                  }`}>
                    <HardHat className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900">CONSTRUCTION</span>
                      {selectedCategory === 'construction' && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                      Masonry, tiling, POP, roofing & woodwork
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Specific Sub-Services Cloud */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Select Specific Issue or Work:
                </label>
                <span className="text-[11px] text-neutral-500">
                  Showing {activeCategoryData.subServices.length} sub-services
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCategoryData.subServices.map(service => {
                  const isSelected = selectedSubService === service;
                  return (
                    <button
                      key={service}
                      id={`subservice-chip-${service.replace(/\s+/g, '-').replace(/\//g, '-')}`}
                      type="button"
                      onClick={() => setSelectedSubService(service)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-neutral-900 text-white shadow-xs scale-102 ring-1 ring-neutral-900'
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
                      }`}
                    >
                      {service}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Location First Selector & Urgency */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-neutral-100">
              {/* Location Selector */}
              <div className="md:col-span-8 space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
                  <span>WHERE DO YOU NEED THE JOB?</span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    disabled={isDetectingLocation}
                    className="text-amber-700 hover:text-amber-800 text-[11px] font-semibold flex items-center gap-1 normal-case"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                    {isDetectingLocation ? 'Locating...' : 'Use current location'}
                  </button>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-neutral-400" />
                    <select
                      id="hero-neighborhood-select"
                      aria-label="Select neighborhood in Abuja or Lagos"
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setCustomLocation('');
                      }}
                      className="w-full pl-9 pr-8 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    >
                      <optgroup label="Abuja (FCT)">
                        {SUPPORTED_LOCATIONS[0].neighborhoods.map(n => (
                          <option key={n} value={n}>{n}, Abuja</option>
                        ))}
                      </optgroup>
                      <optgroup label="Lagos">
                        {SUPPORTED_LOCATIONS[1].neighborhoods.map(n => (
                          <option key={n} value={n}>{n}, Lagos</option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <input
                    id="hero-custom-address-input"
                    type="text"
                    placeholder="Or enter street/estate (e.g. 4th Ave, Gwarinpa)"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Urgency Switch */}
              <div className="md:col-span-4 flex flex-col justify-end">
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                  TIMING / URGENCY
                </label>
                <button
                  id="hero-urgency-toggle"
                  type="button"
                  onClick={() => setIsUrgent(!isUrgent)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs font-semibold transition-colors ${
                    isUrgent
                      ? 'bg-rose-50 border-rose-300 text-rose-800'
                      : 'bg-neutral-50 border-neutral-300 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-rose-600 animate-ping' : 'bg-neutral-400'}`} />
                    {isUrgent ? 'Urgent / Emergency Job' : 'Standard / Flexible'}
                  </span>
                  <span className="text-[11px] underline">
                    {isUrgent ? 'Active' : 'Turn on'}
                  </span>
                </button>
              </div>
            </div>

            {/* Natural Query Input (Alternative Search) */}
            <div className="pt-2 border-t border-neutral-100">
              <form onSubmit={handleDirectSearch} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-400" />
                  <input
                    id="hero-natural-query-input"
                    type="text"
                    placeholder="Or search natural intent: e.g. 'electrician in Wuse', 'tiler near me', 'leaking sink'"
                    value={naturalQuery}
                    onChange={(e) => setNaturalQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-300 rounded-xl text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                {/* Primary CTA button */}
                <button
                  id="hero-find-professionals-btn"
                  type="button"
                  onClick={() => handleDirectSearch()}
                  className="sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
                >
                  <Search className="w-4 h-4" />
                  <span>FIND AVAILABLE PROFESSIONALS</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </form>

              {/* Natural Presets Pills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                <span className="font-semibold text-neutral-600">Quick searches:</span>
                {POPULAR_SEARCH_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="px-2 py-0.5 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4 Steps Micro-Strip */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <span className="text-amber-600 font-bold text-xs">01</span>
            <p className="text-xs font-bold text-neutral-800 mt-0.5">What do you need?</p>
            <p className="text-[11px] text-neutral-500">Select plumbing, electrical or building</p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <span className="text-amber-600 font-bold text-xs">02</span>
            <p className="text-xs font-bold text-neutral-800 mt-0.5">Where are you?</p>
            <p className="text-[11px] text-neutral-500">Area & neighborhood matching</p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <span className="text-amber-600 font-bold text-xs">03</span>
            <p className="text-xs font-bold text-neutral-800 mt-0.5">Find available artisans</p>
            <p className="text-[11px] text-neutral-500">Verified status & ratings</p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
            <span className="text-amber-600 font-bold text-xs">04</span>
            <p className="text-xs font-bold text-neutral-800 mt-0.5">Call directly or request</p>
            <p className="text-[11px] text-neutral-500">One tap on mobile, get it fixed</p>
          </div>
        </div>
      </div>
    </section>
  );
};
