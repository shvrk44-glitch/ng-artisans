import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Shield, Upload, Camera, FileText, Wrench, MapPin, Phone, User, Clock, AlertTriangle } from 'lucide-react';
import { ProfessionCategory, Artisan } from '../types';
import { CATEGORIES, SUPPORTED_LOCATIONS } from '../data/categories';

interface ArtisanRegistrationModalProps {
  onClose: () => void;
  onRegisterSuccess: (newArtisan: Artisan) => void;
}

export const ArtisanRegistrationModal: React.FC<ArtisanRegistrationModalProps> = ({
  onClose,
  onRegisterSuccess
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Form states
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [profession, setProfession] = useState<ProfessionCategory>('plumbing');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [city, setCity] = useState('Abuja (FCT)');
  const [neighborhood, setNeighborhood] = useState('Wuse');
  const [address, setAddress] = useState('');
  const [serviceAreas, setServiceAreas] = useState<string[]>(['Wuse', 'Gwarinpa', 'Maitama']);
  const [maxRadius, setMaxRadius] = useState<number>(20);
  const [yearsExperience, setYearsExperience] = useState<number>(5);
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');
  const [portfolioPhotos, setPortfolioPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80'
  ]);
  const [idCardNumber, setIdCardNumber] = useState('');
  const [tradeCertName, setTradeCertName] = useState('');
  const [pricingGuidance, setPricingGuidance] = useState('Inspection fee: ₦5,000. Quotes based on job scope.');
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleServiceArea = (area: string) => {
    if (serviceAreas.includes(area)) {
      setServiceAreas(serviceAreas.filter(a => a !== area));
    } else {
      setServiceAreas([...serviceAreas, area]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newArtisan: Artisan = {
      id: `art-user-${Date.now()}`,
      name: name || 'Registered Professional',
      businessName: businessName || `${name} Services`,
      avatar: avatarUrl,
      profession,
      professionLabel: profession === 'plumbing' ? 'Plumber' : profession === 'electrical' ? 'Electrician' : 'Building Craftsman',
      subServices: selectedSkills.length > 0 ? selectedSkills : CATEGORIES[profession].subServices.slice(0, 3),
      location: {
        city,
        neighborhood,
        address
      },
      serviceAreas: serviceAreas.length > 0 ? serviceAreas : [neighborhood],
      maxTravelRadiusKm: maxRadius,
      verificationStatus: 'pending', // IMPORTANT: Starts under review!
      verificationDetails: {
        idVerified: false,
        phoneVerified: true,
        tradeCertVerified: false,
        notes: 'Profile submitted by artisan; documents currently under compliance review.'
      },
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      yearsOfExperience: Number(yearsExperience) || 3,
      phone: phone || '+2348000000000',
      whatsapp: whatsapp || phone,
      bio: bio || 'Professional skilled services, quality execution and prompt response.',
      portfolioImages: portfolioPhotos,
      pricingGuidance,
      languages: ['English', 'Pidgin'],
      workingHours: 'Mon – Sat: 8:00 AM – 6:00 PM',
      isUrgentAccepting: true,
      availability: 'available',
      responseTimeText: 'Responds within 30 mins'
    };

    onRegisterSuccess(newArtisan);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top Bar with Step Progress */}
        <div className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
              JOIN AS AN ARTISAN
            </span>
            <h3 className="text-sm sm:text-base font-bold font-display text-white">
              {isSubmitted ? 'Application Submitted' : `Step ${currentStep} of 10`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1">
          {isSubmitted ? (
            /* Review State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8 animate-spin" />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold inline-block mb-2">
                  STATUS: PENDING VERIFICATION
                </span>
                <h4 className="text-2xl font-bold font-display text-neutral-950">
                  Your profile is under review.
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{name || 'Artisan'}</strong>. To maintain high trust in our community, we do not automatically display unverified badges. Our compliance team verifies your national ID and contact details within 24 hours.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Registered Name:</span>
                  <span className="font-bold text-neutral-900">{businessName || name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Trade Category:</span>
                  <span className="font-bold text-neutral-900 capitalize">{profession}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Primary Area:</span>
                  <span className="font-bold text-neutral-900">{neighborhood}, {city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Phone for Leads:</span>
                  <span className="font-bold text-neutral-900">{phone}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-amber-400 font-bold text-xs"
                >
                  View My Artisan Dashboard →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* STEP 1: Name / Business Name */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 1</span>
                    <h4 className="text-lg font-bold text-neutral-900">What is your name and trade business?</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Customers will see this name on search results and when calling.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Your Full Personal Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Musa Ibrahim"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Business or Trading Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Musa Plumbing & Drainage Works"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Profession */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 2</span>
                    <h4 className="text-lg font-bold text-neutral-900">What is your primary trade?</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Choose the trade category where you have certified expertise.</p>
                  </div>

                  <div className="space-y-2.5">
                    {(['plumbing', 'electrical', 'construction'] as ProfessionCategory[]).map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setProfession(cat)}
                        className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                          profession === cat
                            ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-500/20 shadow-xs'
                            : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-sm text-neutral-900 block capitalize">
                            {CATEGORIES[cat].name}
                          </span>
                          <span className="text-xs text-neutral-500">{CATEGORIES[cat].tagline}</span>
                        </div>
                        {profession === cat && (
                          <CheckCircle2 className="w-5 h-5 text-amber-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Skills selection */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 3</span>
                    <h4 className="text-lg font-bold text-neutral-900">Which specific skills do you offer?</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Select only skills you are equipped to perform professionally.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES[profession].subServices.map(skill => {
                      const isChecked = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          type="button"
                          onClick={() => toggleSkill(skill)}
                          className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center justify-between transition-all ${
                            isChecked
                              ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                              : 'border-neutral-200 text-neutral-700 bg-neutral-50 hover:bg-neutral-100'
                          }`}
                        >
                          <span>{skill}</span>
                          {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 4: Location & Service Area */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 4</span>
                    <h4 className="text-lg font-bold text-neutral-900">Where is your workshop or base?</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">We match you with customers in your coverage radius.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        City:
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none"
                      >
                        <option value="Abuja (FCT)">Abuja (FCT)</option>
                        <option value="Lagos">Lagos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                        Base Neighborhood:
                      </label>
                      <select
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none"
                      >
                        {(city.includes('Abuja') ? SUPPORTED_LOCATIONS[0].neighborhoods : SUPPORTED_LOCATIONS[1].neighborhoods).map(n => (
                          <option key={n} value={n}>{n}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Max Travel Radius (km):
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="5"
                      value={maxRadius}
                      onChange={(e) => setMaxRadius(Number(e.target.value))}
                      className="w-full accent-amber-500"
                    />
                    <div className="flex justify-between text-xs text-neutral-500 font-semibold">
                      <span>5 km (Local)</span>
                      <span className="text-neutral-900 font-bold">{maxRadius} km radius</span>
                      <span>40 km (Wider City)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Experience */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 5</span>
                    <h4 className="text-lg font-bold text-neutral-900">Years of experience & background</h4>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Years working in trade:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="40"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(Number(e.target.value))}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Brief Bio / Summary of Work:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Master plumber with 9 years fixing residential PPR pipes, borehole pumps, sanitary fixtures, and emergency water leaks in Abuja."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 6: Phone & Contact */}
              {currentStep === 6 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 6</span>
                    <h4 className="text-lg font-bold text-neutral-900">Direct Phone Contact</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">This number will receive direct phone calls when a customer taps CALL NOW.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Primary Phone Number (Active):
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0803 555 2109"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      WhatsApp Number (Optional):
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0803 555 2109"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              )}

              {/* STEP 7: Profile Photo */}
              {currentStep === 7 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 7</span>
                    <h4 className="text-lg font-bold text-neutral-900">Profile Photo</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">A clear face photo helps build immediate customer trust.</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-neutral-300"
                    />
                    <div className="flex-1 space-y-2">
                      <span className="text-xs text-neutral-600 font-medium block">
                        Default professional avatar selected or enter URL:
                      </span>
                      <input
                        type="text"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 8: Portfolio Photos */}
              {currentStep === 8 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 8</span>
                    <h4 className="text-lg font-bold text-neutral-900">Photos of Past Work</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Showcase real work on sites, pipes, cables, or tiles.</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {portfolioPhotos.map((url, idx) => (
                      <div key={idx} className="h-24 rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100">
                        <img src={url} alt={`Work ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-neutral-500 italic">
                    Sample verified work photos included. You can add more site photos in your Artisan Dashboard anytime.
                  </p>
                </div>
              )}

              {/* STEP 9: Verification Documents */}
              {currentStep === 9 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 9</span>
                    <h4 className="text-lg font-bold text-neutral-900">Verification Documents</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">For ID and trade certification check.</p>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <span className="font-bold block">Why we check documents:</span>
                    <p>We confirm that customers get real, accountable artisans. Unverified profiles do not receive the "Verified" badge.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      National ID (NIN) / Voter's Card Number:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 11-digit NIN or ID number"
                      value={idCardNumber}
                      onChange={(e) => setIdCardNumber(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                      Trade Association or Certification (Optional):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Federal Ministry of Labour Trade Test 1, 2, 3 / NEMSA"
                      value={tradeCertName}
                      onChange={(e) => setTradeCertName(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 10: Review & Submit */}
              {currentStep === 10 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase">Step 10</span>
                    <h4 className="text-lg font-bold text-neutral-900">Review & Submit Application</h4>
                    <p className="text-xs text-neutral-500 mt-0.5">Check your profile details before submitting for review.</p>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Business / Name:</span>
                      <span className="font-bold text-neutral-900">{businessName || name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Trade:</span>
                      <span className="font-bold text-neutral-900 uppercase">{profession}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Selected Skills:</span>
                      <span className="font-bold text-neutral-900">
                        {selectedSkills.length > 0 ? selectedSkills.join(', ') : 'All general'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Location:</span>
                      <span className="font-bold text-neutral-900">{neighborhood}, {city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Phone:</span>
                      <span className="font-bold text-neutral-900">{phone || 'Not provided'}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-relaxed">
                    By submitting, you agree to respond professionally to calls from local clients and provide fair, transparent pricing before commencing physical work.
                  </p>
                </div>
              )}

              {/* Validation error display */}
              {validationError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      setCurrentStep(currentStep - 1);
                    }}
                    className="py-2.5 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back
                  </button>
                ) : <div />}

                {currentStep < 10 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      if (currentStep === 1 && !name.trim()) {
                        setValidationError('Please enter your full name before continuing.');
                        return;
                      }
                      if (currentStep === 6 && !phone.trim()) {
                        setValidationError('Please provide your active phone number for receiving client calls.');
                        return;
                      }
                      setCurrentStep(currentStep + 1);
                    }}
                    className="py-2.5 px-5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <span>Submit for Review</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
