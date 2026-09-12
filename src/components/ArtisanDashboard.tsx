import React, { useState } from 'react';
import { LayoutDashboard, Phone, PhoneCall, Check, X, Clock, MapPin, Eye, Star, AlertCircle, ShieldCheck, Camera, Bell, CheckCircle2 } from 'lucide-react';
import { Artisan, CustomerJobRequest, AvailabilityStatus, Review } from '../types';

interface ArtisanDashboardProps {
  currentArtisan: Artisan;
  leads: CustomerJobRequest[];
  callLogsCount: number;
  reviews: Review[];
  onUpdateAvailability: (status: AvailabilityStatus, urgentAccepting: boolean) => void;
  onAcceptLead: (leadId: string) => void;
  onDeclineLead: (leadId: string) => void;
  onCallCustomer: (phone: string, customerName: string) => void;
  onSwitchArtisanProfile: (artisanId: string) => void;
  availableArtisansList: Artisan[];
}

export const ArtisanDashboard: React.FC<ArtisanDashboardProps> = ({
  currentArtisan,
  leads,
  callLogsCount,
  reviews,
  onUpdateAvailability,
  onAcceptLead,
  onDeclineLead,
  onCallCustomer,
  onSwitchArtisanProfile,
  availableArtisansList
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'leads' | 'jobs' | 'profile' | 'reviews'>('today');
  const [availability, setAvailability] = useState<AvailabilityStatus>(currentArtisan.availability);
  const [urgentAccepting, setUrgentAccepting] = useState<boolean>(currentArtisan.isUrgentAccepting);

  // Filter leads relevant to this artisan or unassigned in their category
  const relevantLeads = leads.filter(l => 
    !l.assignedArtisanId || l.assignedArtisanId === currentArtisan.id || l.category === currentArtisan.profession
  );

  const pendingLeads = relevantLeads.filter(l => l.status === 'pending');
  const acceptedJobs = relevantLeads.filter(l => l.status === 'accepted');

  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    setAvailability(newStatus);
    onUpdateAvailability(newStatus, urgentAccepting);
  };

  const handleUrgentToggle = () => {
    const nextUrgent = !urgentAccepting;
    setUrgentAccepting(nextUrgent);
    onUpdateAvailability(availability, nextUrgent);
  };

  return (
    <div className="py-6 sm:py-8 bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header & Artisan Persona Switcher */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-6 mb-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <img
              src={currentArtisan.avatar}
              alt={currentArtisan.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-neutral-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold font-display text-neutral-950">
                  {currentArtisan.businessName}
                </h1>
                {currentArtisan.verificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[11px] font-bold">
                    Under Review
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-600 mt-0.5">
                {currentArtisan.name} • <span className="font-semibold text-neutral-800">{currentArtisan.professionLabel}</span> ({currentArtisan.location.neighborhood})
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                <span>Direct Line: <strong className="text-neutral-800">{currentArtisan.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Persona Switcher for testing all professions */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-neutral-50 p-2 rounded-xl border border-neutral-200">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              Testing Profile:
            </span>
            <select
              aria-label="Switch testing profile"
              value={currentArtisan.id}
              onChange={(e) => onSwitchArtisanProfile(e.target.value)}
              className="text-xs font-semibold bg-white border border-neutral-300 rounded-lg py-1.5 px-2 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {availableArtisansList.map(art => (
                <option key={art.id} value={art.id}>
                  {art.name} ({art.profession.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Real-time Availability & Urgent Controls Bar (Section 17) */}
        <div className="bg-neutral-900 text-white rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block mb-1">
              CURRENT STATUS & BROADCAST
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Configure your live availability for local customers
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status Tri-toggle */}
            <div className="inline-flex p-1 bg-neutral-800 rounded-xl border border-neutral-700">
              <button
                type="button"
                onClick={() => handleStatusChange('available')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  availability === 'available'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Available Today
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('busy')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  availability === 'busy'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Busy (On Site)
              </button>

              <button
                type="button"
                onClick={() => handleStatusChange('unavailable')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  availability === 'unavailable'
                    ? 'bg-neutral-600 text-white shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
                Unavailable
              </button>
            </div>

            {/* Emergency Jobs Switch */}
            <button
              type="button"
              onClick={handleUrgentToggle}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                urgentAccepting
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <AlertCircle className={`w-3.5 h-3.5 ${urgentAccepting ? 'text-rose-400 animate-pulse' : ''}`} />
              <span>Accept Urgent Jobs: {urgentAccepting ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-6 border-b border-neutral-200">
          {[
            { id: 'today', label: 'TODAY OVERVIEW', icon: Clock },
            { id: 'leads', label: `NEW LEADS (${pendingLeads.length})`, icon: Bell, badge: pendingLeads.length },
            { id: 'jobs', label: `ACTIVE JOBS (${acceptedJobs.length})`, icon: CheckCircle2 },
            { id: 'reviews', label: `REVIEWS (${currentArtisan.reviewCount})`, icon: Star },
            { id: 'profile', label: 'PROFILE & AREAS', icon: MapPin }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  isActive
                    ? 'bg-neutral-900 text-amber-400 shadow-xs'
                    : 'bg-white text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 border border-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TODAY OVERVIEW */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Real Stats (No fake financial numbers, strictly as requested in Section 15!) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-500 uppercase block">
                  New Customer Leads
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display mt-1 block">
                  {pendingLeads.length}
                </span>
                <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
                  Awaiting your response
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-500 uppercase block">
                  Direct Phone Calls
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display mt-1 block">
                  {callLogsCount}
                </span>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
                  Customer "Call Now" taps
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-500 uppercase block">
                  Active & Accepted Jobs
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display mt-1 block">
                  {acceptedJobs.length}
                </span>
                <span className="text-[10px] text-neutral-500 font-semibold mt-1 block">
                  {currentArtisan.completedJobsCount} lifetime completed
                </span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[11px] font-bold text-neutral-500 uppercase block">
                  Customer Rating
                </span>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                  <span className="text-2xl sm:text-3xl font-extrabold text-neutral-950 font-display">
                    {currentArtisan.rating}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 font-semibold mt-1 block">
                  Based on {currentArtisan.reviewCount} reviews
                </span>
              </div>
            </div>

            {/* Quick action alert if leads pending */}
            {pendingLeads.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                      You have {pendingLeads.length} new customer opportunity!
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      Local customers in {currentArtisan.location.neighborhood} are waiting for your callback.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-amber-400 font-bold text-xs shrink-0"
                >
                  View Opportunities →
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEADS (Section 16: ARTISAN LEAD EXPERIENCE) */}
        {(activeTab === 'leads' || activeTab === 'today') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold font-display text-neutral-950">
                  Incoming Customer Requests
                </h3>
                <p className="text-xs text-neutral-500">
                  Inspect the customer request in seconds, view attached photo, and call directly.
                </p>
              </div>
              <span className="text-xs font-semibold text-neutral-500">
                {relevantLeads.length} total received
              </span>
            </div>

            {relevantLeads.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-neutral-200 text-center">
                <p className="text-xs text-neutral-500">
                  No incoming leads at this moment. Customers in {currentArtisan.location.neighborhood} will appear here when they submit requests.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {relevantLeads.map(lead => {
                  const isAccepted = lead.status === 'accepted';
                  const isDeclined = lead.status === 'declined';

                  return (
                    <div
                      key={lead.id}
                      className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
                        lead.status === 'pending'
                          ? 'border-amber-400 shadow-sm ring-1 ring-amber-400/20'
                          : isAccepted
                          ? 'border-emerald-300 bg-emerald-50/30'
                          : 'border-neutral-200 opacity-70'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        {/* Lead Details */}
                        <div className="space-y-3 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-neutral-900 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                              CUSTOMER REQUEST
                            </span>

                            <span className="text-xs font-bold text-neutral-900 capitalize">
                              Service: {lead.subService} ({lead.category})
                            </span>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              lead.urgency === 'urgent'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}>
                              Time: {lead.urgency}
                            </span>

                            <span className="text-[11px] text-neutral-400 ml-auto">
                              {lead.createdAt}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="flex items-center gap-1.5 text-neutral-700">
                              <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                              <span>
                                <strong>Location:</strong> {lead.location.neighborhood}, {lead.location.city}
                                {lead.location.address ? ` (${lead.location.address})` : ''}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-neutral-700">
                              <Phone className="w-3.5 h-3.5 text-neutral-400" />
                              <span>
                                <strong>Customer:</strong> {lead.customerName} ({lead.customerPhone})
                              </span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800">
                            <strong className="block text-neutral-500 uppercase text-[10px] mb-0.5">Description:</strong>
                            {lead.description}
                          </div>

                          {/* Attached Photo Preview (Section 12 & 16) */}
                          {lead.photoUrl && (
                            <div className="flex items-center gap-3 p-2 bg-neutral-50 rounded-xl border border-neutral-200">
                              <img
                                src={lead.photoUrl}
                                alt="Customer attached defect"
                                className="w-16 h-16 rounded-lg object-cover border border-neutral-300"
                              />
                              <div>
                                <span className="text-xs font-bold text-neutral-900 block">
                                  Customer Attached Defect Photo
                                </span>
                                <span className="text-[11px] text-neutral-500">
                                  Visual confirmation of the problem area
                                </span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions (Section 16: CALL CUSTOMER, ACCEPT JOB, DECLINE) */}
                        <div className="flex flex-row md:flex-col items-center md:items-end justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                          {lead.status === 'pending' ? (
                            <>
                              <button
                                onClick={() => onCallCustomer(lead.customerPhone, lead.customerName)}
                                className="flex-1 md:w-44 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <PhoneCall className="w-3.5 h-3.5" />
                                <span>CALL CUSTOMER</span>
                              </button>

                              <button
                                onClick={() => onAcceptLead(lead.id)}
                                className="flex-1 md:w-44 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5 text-amber-400" />
                                <span>ACCEPT JOB</span>
                              </button>

                              <button
                                onClick={() => onDeclineLead(lead.id)}
                                className="text-xs text-neutral-500 hover:text-rose-600 py-1"
                              >
                                Decline
                              </button>
                            </>
                          ) : isAccepted ? (
                            <div className="text-right">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                Accepted Job
                              </span>
                              <button
                                onClick={() => onCallCustomer(lead.customerPhone, lead.customerName)}
                                className="w-full py-2 px-3 rounded-lg bg-neutral-900 text-white text-xs font-semibold flex items-center justify-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-amber-400" />
                                Call Again
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs font-semibold text-neutral-400">
                              Declined
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JOBS */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold font-display text-neutral-950">
              Active & Completed Jobs
            </h3>
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 text-xs text-neutral-500 font-semibold">
                <span>CLIENT / JOB</span>
                <span>STATUS</span>
              </div>
              {acceptedJobs.length === 0 ? (
                <p className="text-xs text-neutral-500 text-center py-4">
                  No currently active jobs accepted from leads. Accept an incoming lead to track it here.
                </p>
              ) : (
                acceptedJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0 text-xs">
                    <div>
                      <span className="font-bold text-neutral-900 block">{job.customerName}</span>
                      <span className="text-neutral-500">{job.subService} • {job.location.neighborhood}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      In Progress
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-bold font-display text-neutral-950">
              Customer Reviews ({currentArtisan.reviewCount})
            </h3>
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
              <p className="text-xs text-neutral-500">
                All reviews on your profile are tied to actual completed jobs verified by our system.
              </p>
              <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
                <div>
                  <span className="text-xl font-bold font-display text-neutral-900">{currentArtisan.rating} / 5.0</span>
                  <p className="text-xs text-neutral-600">Great reputation in {currentArtisan.location.neighborhood}!</p>
                </div>
              </div>

              {/* List of customer reviews */}
              <div className="space-y-3 pt-2">
                {reviews.filter(r => r.artisanId === currentArtisan.id).length === 0 ? (
                  <p className="text-xs text-neutral-500 text-center py-4">No reviews recorded yet for this profile.</p>
                ) : (
                  reviews.filter(r => r.artisanId === currentArtisan.id).map(r => (
                    <div key={r.id} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">{r.customerName} ({r.customerLocation})</span>
                        <span className="text-amber-500 font-bold">★ {r.rating}.0</span>
                      </div>
                      <p className="text-neutral-700 italic">"{r.comment}"</p>
                      <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-1">
                        <span>Job: {r.serviceName}</span>
                        <span>{r.date}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE & AREAS */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold font-display text-neutral-950">
              Your Public Listing Settings
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Base Location</span>
                <p className="font-bold text-neutral-900">{currentArtisan.location.neighborhood}, {currentArtisan.location.city}</p>
                <p className="text-neutral-500">{currentArtisan.location.address}</p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Service Radius</span>
                <p className="font-bold text-neutral-900">{currentArtisan.maxTravelRadiusKm} km from base</p>
                <p className="text-neutral-500">Areas: {currentArtisan.serviceAreas.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
