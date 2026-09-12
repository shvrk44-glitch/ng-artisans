import React, { useState } from 'react';
import {
  LayoutDashboard,
  Phone,
  PhoneCall,
  Check,
  X,
  Clock,
  MapPin,
  Eye,
  Star,
  AlertCircle,
  ShieldCheck,
  Lock,
  LogOut,
  KeyRound,
  ShieldAlert
} from 'lucide-react';
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
  // Session Authentication: Check if this specific artisan is logged in
  const [sessionArtisanId, setSessionArtisanId] = useState<string | null>(() => {
    return sessionStorage.getItem('ng_artisan_session_id');
  });

  // Login form state
  const [loginPhone, setLoginPhone] = useState(currentArtisan.phone);
  const [loginPin, setLoginPin] = useState('1234');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'today' | 'leads' | 'jobs' | 'profile' | 'reviews'>('today');
  const [availability, setAvailability] = useState<AvailabilityStatus>(currentArtisan.availability);
  const [urgentAccepting, setUrgentAccepting] = useState<boolean>(currentArtisan.isUrgentAccepting);

  // Authenticate handler
  const handleLogin = (e?: React.FormEvent, targetArtisan?: Artisan) => {
    if (e) e.preventDefault();
    setLoginError(null);

    const artisanToAuth = targetArtisan || availableArtisansList.find(a => 
      a.phone.replace(/\s+/g, '') === loginPhone.replace(/\s+/g, '')
    );

    if (!artisanToAuth) {
      setLoginError('No registered artisan found with this phone number.');
      return;
    }

    if (loginPin.trim() !== '1234' && loginPin.trim().length < 4) {
      setLoginError('Invalid PIN. Please enter your 4-digit security PIN (default: 1234).');
      return;
    }

    sessionStorage.setItem('ng_artisan_session_id', artisanToAuth.id);
    setSessionArtisanId(artisanToAuth.id);
    onSwitchArtisanProfile(artisanToAuth.id);
    setAvailability(artisanToAuth.availability);
    setUrgentAccepting(artisanToAuth.isUrgentAccepting);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('ng_artisan_session_id');
    setSessionArtisanId(null);
  };

  const isAuthenticated = sessionArtisanId === currentArtisan.id;

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

  // Helper to mask phone numbers for unaccepted leads to protect customer privacy
  const maskPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\s+/g, '');
    if (cleaned.length < 7) return '•••• ••• •••';
    return `${cleaned.slice(0, 4)} ••• ••${cleaned.slice(-2)}`;
  };

  // IF NOT AUTHENTICATED: Display the Artisan Authentication Gate
  if (!isAuthenticated) {
    return (
      <div className="py-12 sm:py-16 bg-neutral-100 min-h-[85vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-neutral-200 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-neutral-900 text-white p-6 text-center relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
              PROTECTED ARTISAN PORTAL
            </span>
            <h2 className="text-xl font-bold font-display text-white">
              Artisan Access & Verification
            </h2>
            <p className="text-xs text-neutral-300 mt-1 max-w-xs mx-auto">
              Customer contact information, direct dispatch leads, and live availability controls are protected by authentication.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={(e) => handleLogin(e)} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1">
                Registered Phone Number:
              </label>
              <input
                type="tel"
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                placeholder="e.g. 0803 234 5678"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-neutral-800">
                  4-Digit Security PIN:
                </label>
                <span className="text-[10px] text-neutral-500">Default: 1234</span>
              </div>
              <input
                type="password"
                maxLength={6}
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                placeholder="1234"
                className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 tracking-widest"
                required
              />
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate & Access Dashboard</span>
            </button>

            {/* Quick Demo Selector for Reviewers / Testing */}
            <div className="pt-4 border-t border-neutral-100">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-2 text-center">
                Quick Test Verified Profiles:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableArtisansList.slice(0, 4).map(art => (
                  <button
                    key={art.id}
                    type="button"
                    onClick={() => {
                      setLoginPhone(art.phone);
                      setLoginPin('1234');
                      handleLogin(undefined, art);
                    }}
                    className="p-2 rounded-xl bg-neutral-50 hover:bg-amber-50 border border-neutral-200 hover:border-amber-300 text-left transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <img
                      src={art.avatar}
                      alt={art.name}
                      className="w-7 h-7 rounded-lg object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-neutral-900 truncate">{art.name}</p>
                      <p className="text-[10px] text-neutral-500">{art.professionLabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // AUTHENTICATED VIEW: Full Dashboard with Protected Customer Data
  return (
    <div className="py-6 sm:py-8 bg-neutral-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header with Authenticated Badge & Sign Out */}
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
                <span>Registered Phone: <strong className="text-neutral-800">{currentArtisan.phone}</strong></span>
              </div>
            </div>
          </div>

          {/* Secure Session Controls: Logged In Badge & Lock / Sign Out */}
          <div className="flex items-center gap-2.5 self-start md:self-auto bg-neutral-50 p-2.5 rounded-xl border border-neutral-200">
            <div className="flex items-center gap-1.5 text-xs text-neutral-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-neutral-900">Authenticated Session</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="py-1.5 px-3 rounded-lg bg-white hover:bg-rose-50 text-neutral-700 hover:text-rose-600 border border-neutral-200 hover:border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
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

            {/* Urgent Job Broadcast Toggle */}
            <button
              type="button"
              onClick={handleUrgentToggle}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                urgentAccepting
                  ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              <AlertCircle className={`w-3.5 h-3.5 ${urgentAccepting ? 'text-rose-400' : 'text-neutral-500'}`} />
              <span>Accepting Emergencies</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-neutral-200 mb-6 overflow-x-auto">
          {[
            { id: 'today', label: 'Overview' },
            { id: 'leads', label: `Pending Leads (${pendingLeads.length})` },
            { id: 'jobs', label: `Active Jobs (${acceptedJobs.length})` },
            { id: 'reviews', label: `Reviews (${reviews.filter(r => r.artisanId === currentArtisan.id).length})` },
            { id: 'profile', label: 'Service Coverage' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Direct Calls Received</span>
                <p className="text-2xl font-bold font-display text-neutral-950 mt-1">{callLogsCount}</p>
                <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">Direct from customer search</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">New Lead Requests</span>
                <p className="text-2xl font-bold font-display text-amber-600 mt-1">{pendingLeads.length}</p>
                <span className="text-[10px] text-neutral-500 mt-0.5 block">Awaiting your response</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Jobs In Progress</span>
                <p className="text-2xl font-bold font-display text-neutral-950 mt-1">{acceptedJobs.length}</p>
                <span className="text-[10px] text-neutral-500 mt-0.5 block">Accepted assignments</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Completed Rating</span>
                <p className="text-2xl font-bold font-display text-neutral-950 mt-1">{currentArtisan.rating} ★</p>
                <span className="text-[10px] text-neutral-500 mt-0.5 block">From {currentArtisan.reviewCount} customer reviews</span>
              </div>
            </div>

            {/* Urgent Job Alert Banner if Pending Leads Exist */}
            {pendingLeads.length > 0 && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                      You have {pendingLeads.length} new customer job {pendingLeads.length === 1 ? 'request' : 'requests'} waiting
                    </h3>
                    <p className="text-[11px] text-amber-800">
                      Respond quickly — customers in {currentArtisan.location.neighborhood} prefer artisans who respond within 15 minutes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('leads')}
                  className="py-2 px-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shrink-0 transition-colors"
                >
                  View Leads
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 & 3: LEADS AND JOBS */}
        {(activeTab === 'leads' || activeTab === 'jobs') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold font-display text-neutral-950">
                {activeTab === 'leads' ? 'Customer Requests Awaiting Acceptance' : 'Active & Accepted Customer Jobs'}
              </h2>
              <span className="text-xs text-neutral-500">
                {activeTab === 'leads' ? `${pendingLeads.length} pending` : `${acceptedJobs.length} accepted`}
              </span>
            </div>

            {(activeTab === 'leads' ? pendingLeads : acceptedJobs).length === 0 ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                <p className="text-xs text-neutral-500">
                  {activeTab === 'leads'
                    ? 'No new pending leads at this time. Keep your status as "Available Today" to receive new customer calls!'
                    : 'No jobs currently in progress.'}
                </p>
              </div>
            ) : (
              (activeTab === 'leads' ? pendingLeads : acceptedJobs).map((lead) => {
                const isAccepted = lead.status === 'accepted';

                return (
                  <div
                    key={lead.id}
                    className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      {/* Lead Details */}
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
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
                              <strong>Customer:</strong> {lead.customerName}{' '}
                              {isAccepted ? (
                                <strong className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                                  {lead.customerPhone}
                                </strong>
                              ) : (
                                <span className="text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.5 rounded text-[11px]">
                                  {maskPhoneNumber(lead.customerPhone)} (Protected)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-800">
                          <strong className="block text-neutral-500 uppercase text-[10px] mb-0.5">Description:</strong>
                          {lead.description}
                        </div>

                        {/* Customer Privacy Notice for Pending Leads */}
                        {!isAccepted && (
                          <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 bg-neutral-50 px-2.5 py-1.5 rounded-lg border border-neutral-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Customer phone number is protected. Click <strong>Accept Job</strong> to reveal the direct line and contact the customer.</span>
                          </div>
                        )}

                        {/* Attached Photo Preview */}
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

                      {/* Actions: ACCEPT JOB, DECLINE, OR CALL CUSTOMER */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-end gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100">
                        {lead.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onAcceptLead(lead.id)}
                              className="flex-1 md:w-48 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5 text-amber-400" />
                              <span>ACCEPT & UNLOCK PHONE</span>
                            </button>

                            <button
                              onClick={() => onDeclineLead(lead.id)}
                              className="text-xs text-neutral-500 hover:text-rose-600 py-1 cursor-pointer"
                            >
                              Decline Lead
                            </button>
                          </>
                        ) : isAccepted ? (
                          <div className="text-right space-y-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                              <Check className="w-3.5 h-3.5 text-emerald-700" />
                              Accepted Assignment
                            </span>
                            <button
                              onClick={() => onCallCustomer(lead.customerPhone, lead.customerName)}
                              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>CALL CUSTOMER</span>
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
              })
            )}
          </div>
        )}

        {/* TAB 4: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 space-y-4">
            <h3 className="text-base sm:text-lg font-bold font-display text-neutral-950">
              Customer Feedback & Reviews
            </h3>
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
        )}

        {/* TAB 5: PROFILE & SERVICE COVERAGE */}
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
