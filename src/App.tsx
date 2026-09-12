import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroProblemSolver } from './components/HeroProblemSolver';
import { CategoryShowcase } from './components/CategoryShowcase';
import { EmergencySection } from './components/EmergencySection';
import { HowItWorks } from './components/HowItWorks';
import { ArtisanResults } from './components/ArtisanResults';
import { ArtisanProfileModal } from './components/ArtisanProfileModal';
import { RequestJobModal } from './components/RequestJobModal';
import { ArtisanRegistrationModal } from './components/ArtisanRegistrationModal';
import { ConstructionProjectModal } from './components/ConstructionProjectModal';
import { CallModal } from './components/CallModal';
import { TrustSection } from './components/TrustSection';
import { ArtisanDashboard } from './components/ArtisanDashboard';
import { Footer } from './components/Footer';

import { Artisan, ProfessionCategory, CustomerJobRequest, Review, ConstructionProject, AvailabilityStatus } from './types';
import { INITIAL_ARTISANS, INITIAL_REVIEWS } from './data/mockArtisans';
import { searchAndRankArtisans, parseNaturalSearch } from './utils/matching';
import {
  fetchArtisans,
  fetchReviews,
  fetchJobRequests,
  submitJobRequest,
  registerArtisan,
  submitReview,
  submitConstructionProject,
  updateArtisanAvailability,
  updateJobRequestStatus
} from './services/supabaseService';

// Sample initial leads for the Artisan Dashboard demonstration (Section 16)
const INITIAL_LEADS: CustomerJobRequest[] = [
  {
    id: 'lead-1',
    customerName: 'Amina Bello',
    customerPhone: '0802 341 9901',
    category: 'plumbing',
    subService: 'leaking pipes',
    description: 'PPR pipe leaking actively under master bathroom sink. Valve shut off temporarily, need replacement urgently.',
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Gwarinpa',
      address: 'House 18, 3rd Avenue'
    },
    urgency: 'urgent',
    photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80',
    createdAt: '12 mins ago',
    status: 'pending',
    assignedArtisanId: 'art-1'
  },
  {
    id: 'lead-2',
    customerName: 'Engr. David Okon',
    customerPhone: '0803 712 8844',
    category: 'electrical',
    subService: 'tripping breakers',
    description: 'Main distribution board trips immediately the borehole pump or AC is turned on. Need load inspection and breaker replacement.',
    location: {
      city: 'Abuja (FCT)',
      neighborhood: 'Wuse',
      address: 'Zone 4, off Herbert Macaulay Way'
    },
    urgency: 'today',
    photoUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
    createdAt: '45 mins ago',
    status: 'pending',
    assignedArtisanId: 'art-2'
  },
  {
    id: 'lead-3',
    customerName: 'Chiamaka N.',
    customerPhone: '0818 450 1209',
    category: 'construction',
    subService: 'wall and floor tiling',
    description: 'Guest toilet floor tiling needs complete stripping and replacement with 60x60 vitrified tiles. Approx 14 sqm.',
    location: {
      city: 'Lagos',
      neighborhood: 'Lekki Phase 1',
      address: 'Admiralty Way'
    },
    urgency: 'flexible',
    photoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
    createdAt: '2 hours ago',
    status: 'pending',
    assignedArtisanId: 'art-3'
  }
];

export default function App() {
  // Navigation View: 'home' | 'artisans' | 'artisan-dashboard'
  const [currentView, setCurrentView] = useState<'home' | 'artisans' | 'artisan-dashboard'>('home');

  // Master State
  const [artisans, setArtisans] = useState<Artisan[]>(INITIAL_ARTISANS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [leads, setLeads] = useState<CustomerJobRequest[]>(INITIAL_LEADS);
  const [callLogsCount, setCallLogsCount] = useState<number>(14);

  // Active Artisan being simulated in Artisan Dashboard
  const [activeArtisanId, setActiveArtisanId] = useState<string>('art-1');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<ProfessionCategory | 'all'>('all');
  const [selectedSubService, setSelectedSubService] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [urgentOnly, setUrgentOnly] = useState<boolean>(false);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(false);
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);

  // Modal State
  const [profileModalArtisan, setProfileModalArtisan] = useState<Artisan | null>(null);
  const [callModalArtisan, setCallModalArtisan] = useState<Artisan | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [requestTargetArtisan, setRequestTargetArtisan] = useState<Artisan | null>(null);
  const [requestInitialCategory, setRequestInitialCategory] = useState<ProfessionCategory>('plumbing');
  const [requestInitialSubService, setRequestInitialSubService] = useState<string>('');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState<boolean>(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState<boolean>(false);

  // Toast feedback message
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Synchronize state with Supabase database on mount
  useEffect(() => {
    let isMounted = true;
    async function loadDataFromSupabase() {
      try {
        const [remoteArtisans, remoteReviews, remoteLeads] = await Promise.all([
          fetchArtisans(),
          fetchReviews(),
          fetchJobRequests()
        ]);

        if (isMounted) {
          if (remoteArtisans && remoteArtisans.length > 0) {
            setArtisans(remoteArtisans);
            setActiveArtisanId(remoteArtisans[0].id);
          }
          if (remoteReviews && remoteReviews.length > 0) {
            setReviews(remoteReviews);
          }
          if (remoteLeads && remoteLeads.length > 0) {
            setLeads(prev => [
              ...remoteLeads,
              ...prev.filter(p => !remoteLeads.some(r => r.id === p.id))
            ]);
          }
        }
      } catch (err) {
        console.warn('Could not sync with Supabase tables:', err);
      }
    }

    loadDataFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  // Ranking & Search Engine computation
  const scoredArtisans = useMemo(() => {
    return searchAndRankArtisans(artisans, {
      query: searchQuery,
      category: selectedCategory,
      subService: selectedSubService,
      location: selectedLocation,
      urgentOnly,
      verifiedOnly,
      availableOnly
    });
  }, [artisans, searchQuery, selectedCategory, selectedSubService, selectedLocation, urgentOnly, verifiedOnly, availableOnly]);

  // Handlers for Navigation & Search
  const handleNaturalSearch = (query: string, category: ProfessionCategory | 'all', location: string, isUrgent: boolean) => {
    setSearchQuery(query);
    setSelectedCategory(category);
    setSelectedLocation(location);
    setUrgentOnly(isUrgent);
    
    if (query) {
      const parsed = parseNaturalSearch(query);
      if (parsed.subService) {
        setSelectedSubService(parsed.subService);
      } else {
        setSelectedSubService('');
      }
    } else {
      setSelectedSubService('');
    }

    setCurrentView('artisans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ProfessionCategory | 'all') => {
    setSelectedCategory(cat);
    setSelectedSubService('');
    setCurrentView('artisans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerEmergency = (cat: ProfessionCategory, sub: string) => {
    setSelectedCategory(cat);
    setSelectedSubService(sub);
    setUrgentOnly(true);
    setCurrentView('artisans');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Artisan Actions
  const handleCallArtisan = (artisan: Artisan) => {
    setCallLogsCount(prev => prev + 1);
    setCallModalArtisan(artisan);
  };

  const handleOpenRequestModal = (artisan?: Artisan, cat?: ProfessionCategory, sub?: string) => {
    setRequestTargetArtisan(artisan || null);
    if (cat) setRequestInitialCategory(cat);
    if (sub) setRequestInitialSubService(sub);
    setIsRequestModalOpen(true);
  };

  const handleSubmitJobRequest = async (newReq: Omit<CustomerJobRequest, 'id' | 'createdAt' | 'status'>) => {
    const created: CustomerJobRequest = {
      ...newReq,
      id: `lead-${Date.now()}`,
      createdAt: 'Just now',
      status: 'pending'
    };

    setLeads(prev => [created, ...prev]);
    showToast(`Request sent! Assigned artisan notified.`);

    // Persist to Supabase in background
    submitJobRequest(created).catch(err => {
      console.warn('Could not save job request to Supabase:', err);
    });
  };

  const handleAddReview = async (newRev: Omit<Review, 'id' | 'date'>) => {
    const created: Review = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: 'Just now'
    };
    setReviews(prev => [created, ...prev]);

    setArtisans(prev => prev.map(a => {
      if (a.id === newRev.artisanId) {
        const artisanReviewsList = [...reviews.filter(r => r.artisanId === a.id), created];
        const newAvg = Number((artisanReviewsList.reduce((acc, r) => acc + r.rating, 0) / artisanReviewsList.length).toFixed(1));
        return {
          ...a,
          rating: newAvg,
          reviewCount: artisanReviewsList.length,
          completedJobsCount: a.completedJobsCount + 1
        };
      }
      return a;
    }));

    showToast(`Review submitted for ${created.serviceName}! Rating updated.`);

    // Persist to Supabase in background
    submitReview(created).catch(err => {
      console.warn('Could not save review to Supabase:', err);
    });
  };

  const handleRegisterSuccess = async (newArtisan: Artisan) => {
    setArtisans(prev => [newArtisan, ...prev]);
    setActiveArtisanId(newArtisan.id);
    showToast(`Profile created for ${newArtisan.businessName}! Status: Pending Verification.`);

    // Persist to Supabase in background
    registerArtisan(newArtisan).catch(err => {
      console.warn('Could not save artisan registration to Supabase:', err);
    });
  };

  const handleSubmitProject = async (project: ConstructionProject) => {
    showToast(`Construction project submitted! Matching lead artisans.`);

    // Persist to Supabase in background
    submitConstructionProject(project).catch(err => {
      console.warn('Could not save project to Supabase:', err);
    });
  };

  // Artisan Dashboard actions
  const currentActiveArtisan = artisans.find(a => a.id === activeArtisanId) || artisans[0];

  const handleUpdateAvailability = (status: AvailabilityStatus, urgentAccepting: boolean) => {
    setArtisans(prev => prev.map(a => {
      if (a.id === activeArtisanId) {
        return {
          ...a,
          availability: status,
          isUrgentAccepting: urgentAccepting
        };
      }
      return a;
    }));
    showToast(`Availability updated to ${status.toUpperCase()}`);

    if (activeArtisanId) {
      updateArtisanAvailability(activeArtisanId, status, urgentAccepting).catch(err => {
        console.warn('Could not update availability in Supabase:', err);
      });
    }
  };

  const handleAcceptLead = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'accepted' } : l));
    showToast('Lead accepted! Client contact ready for scheduling.');
    updateJobRequestStatus(leadId, 'accepted').catch(() => {});
  };

  const handleDeclineLead = (leadId: string) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: 'declined' } : l));
    showToast('Lead declined.');
    updateJobRequestStatus(leadId, 'declined').catch(() => {});
  };

  const handleCallCustomer = (phone: string, customerName: string) => {
    window.location.href = `tel:${phone}`;
    showToast(`Calling customer ${customerName}...`);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col selection:bg-amber-400 selection:text-neutral-950">
      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-20 right-4 z-50 bg-neutral-900 text-amber-400 px-4 py-3 rounded-2xl shadow-xl border border-neutral-700 text-xs font-bold animate-in slide-in-from-top-3 flex items-center gap-2">
          <span>🔔 {notification}</span>
        </div>
      )}

      {/* Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        onSelectCategory={handleSelectCategory}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
        onOpenEmergency={() => {
          setSelectedCategory('all');
          setUrgentOnly(true);
          setCurrentView('artisans');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          showToast('Filtered for verified artisans currently accepting urgent jobs');
        }}
      />

      {/* View 1: Customer Homepage */}
      {currentView === 'home' && (
        <main className="flex-1">
          {/* Hero with Natural Problem Search (What is broken?) */}
          <HeroProblemSolver
            onSearch={handleNaturalSearch}
            onSelectPreset={handleTriggerEmergency}
          />

          {/* Core Categories Showcase: Plumbers, Electricians, Construction */}
          <CategoryShowcase
            onSelectCategory={handleSelectCategory}
            onSelectSubService={(cat, sub) => {
              setSelectedCategory(cat);
              setSelectedSubService(sub);
              setCurrentView('artisans');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProjectModal={() => setIsProjectModalOpen(true)}
          />

          {/* Emergency Urgent Job Section */}
          <EmergencySection
            onFilterUrgent={(cat, sub) => {
              if (cat) setSelectedCategory(cat);
              if (sub) setSelectedSubService(sub);
              setUrgentOnly(true);
              setCurrentView('artisans');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* Curated Top Artisans Available Now */}
          <section className="py-12 bg-neutral-100 border-t border-neutral-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                <div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                    VERIFIED LOCAL SPECIALISTS
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-neutral-950">
                    Available Near You Today
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                    Direct phone lines to verified professionals. No middleman call centers.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setCurrentView('artisans');
                  }}
                  className="text-xs font-bold text-neutral-900 hover:text-amber-600 flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>View all {artisans.length} verified artisans →</span>
                </button>
              </div>

              {/* Scored Artisans Component Preview */}
              <div className="space-y-4">
                {scoredArtisans.slice(0, 3).map(({ artisan, matchReasons }) => (
                  <div
                    key={artisan.id}
                    className="bg-white rounded-2xl border border-neutral-200 p-4 sm:p-5 shadow-xs hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={artisan.avatar}
                        alt={artisan.name}
                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-neutral-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            onClick={() => setProfileModalArtisan(artisan)}
                            className="font-bold text-base text-neutral-950 hover:text-amber-600 cursor-pointer"
                          >
                            {artisan.businessName}
                          </h3>
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                            Verified
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-0.5">
                          {artisan.name} • {artisan.professionLabel} ({artisan.location.neighborhood})
                        </p>
                        <p className="text-[11px] text-neutral-500 mt-1">
                          ★ {artisan.rating} ({artisan.reviewCount} reviews) • {artisan.completedJobsCount} completed jobs • {artisan.responseTimeText}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:w-64">
                      <button
                        onClick={() => handleCallArtisan(artisan)}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <span>CALL NOW</span>
                      </button>

                      <button
                        onClick={() => setProfileModalArtisan(artisan)}
                        className="py-2.5 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs"
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Dual Perspective How It Works (Customer & Artisan) */}
          <HowItWorks
            onStartCustomerSearch={() => {
              setSelectedCategory('all');
              setCurrentView('artisans');
            }}
            onStartArtisanRegister={() => setIsRegisterModalOpen(true)}
          />

          {/* Trust & Safety Section (4-step verification & badging) */}
          <TrustSection />
        </main>
      )}

      {/* View 2: Search Results & Filterable Artisan Directory */}
      {currentView === 'artisans' && (
        <main className="flex-1">
          <ArtisanResults
            scoredArtisans={scoredArtisans}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedSubService={selectedSubService}
            onSelectSubService={setSelectedSubService}
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            urgentOnly={urgentOnly}
            onToggleUrgentOnly={setUrgentOnly}
            verifiedOnly={verifiedOnly}
            onToggleVerifiedOnly={setVerifiedOnly}
            availableOnly={availableOnly}
            onToggleAvailableOnly={setAvailableOnly}
            onCallArtisan={handleCallArtisan}
            onRequestArtisan={(art) => handleOpenRequestModal(art, art.profession, art.subServices[0])}
            onViewProfile={(art) => setProfileModalArtisan(art)}
          />
        </main>
      )}

      {/* View 3: Artisan Operational Dashboard */}
      {currentView === 'artisan-dashboard' && (
        <main className="flex-1">
          <ArtisanDashboard
            currentArtisan={currentActiveArtisan}
            leads={leads}
            callLogsCount={callLogsCount}
            reviews={reviews}
            onUpdateAvailability={handleUpdateAvailability}
            onAcceptLead={handleAcceptLead}
            onDeclineLead={handleDeclineLead}
            onCallCustomer={handleCallCustomer}
            onSwitchArtisanProfile={setActiveArtisanId}
            availableArtisansList={artisans}
          />
        </main>
      )}

      {/* Footer */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onOpenRegisterModal={() => setIsRegisterModalOpen(true)}
        onOpenProjectModal={() => setIsProjectModalOpen(true)}
      />

      {/* MODALS */}

      {/* 1. Artisan Profile Modal */}
      {profileModalArtisan && (
        <ArtisanProfileModal
          artisan={profileModalArtisan}
          reviews={reviews}
          onClose={() => setProfileModalArtisan(null)}
          onCallNow={(art) => {
            setProfileModalArtisan(null);
            handleCallArtisan(art);
          }}
          onRequestJob={(art) => {
            setProfileModalArtisan(null);
            handleOpenRequestModal(art, art.profession, art.subServices[0]);
          }}
          onAddReview={handleAddReview}
        />
      )}

      {/* 2. Direct Call Modal (tel: with customer safety tips) */}
      {callModalArtisan && (
        <CallModal
          artisan={callModalArtisan}
          onClose={() => setCallModalArtisan(null)}
        />
      )}

      {/* 3. Request Job Modal (Multi-step with defect photo upload) */}
      {isRequestModalOpen && (
        <RequestJobModal
          initialArtisan={requestTargetArtisan}
          initialCategory={requestInitialCategory}
          initialSubService={requestInitialSubService}
          onClose={() => setIsRequestModalOpen(false)}
          onSubmitRequest={handleSubmitJobRequest}
        />
      )}

      {/* 4. 10-Step Artisan Registration Modal */}
      {isRegisterModalOpen && (
        <ArtisanRegistrationModal
          onClose={() => setIsRegisterModalOpen(false)}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* 5. Construction & Building Project Modal */}
      {isProjectModalOpen && (
        <ConstructionProjectModal
          onClose={() => setIsProjectModalOpen(false)}
          onSubmitProject={handleSubmitProject}
        />
      )}
    </div>
  );
}
