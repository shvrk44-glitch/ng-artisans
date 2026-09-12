import React, { useState } from 'react';
import { X, Camera, Upload, CheckCircle2, ArrowRight, ArrowLeft, MapPin, Phone, User, Calendar, AlertCircle } from 'lucide-react';
import { ProfessionCategory, Artisan, CustomerJobRequest } from '../types';
import { CATEGORIES, SUPPORTED_LOCATIONS } from '../data/categories';

interface RequestJobModalProps {
  initialArtisan?: Artisan | null;
  initialCategory?: ProfessionCategory;
  initialSubService?: string;
  onClose: () => void;
  onSubmitRequest: (request: Omit<CustomerJobRequest, 'id' | 'createdAt' | 'status'>) => void;
}

const SAMPLE_DEFECT_PHOTOS = [
  { label: 'Bathroom Pipe Leak', url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=600&q=80' },
  { label: 'Damaged Wall Tiles', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80' },
  { label: 'Electrical Tripping Box', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80' },
  { label: 'Water Pump / Tank', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80' }
];

export const RequestJobModal: React.FC<RequestJobModalProps> = ({
  initialArtisan,
  initialCategory = 'plumbing',
  initialSubService,
  onClose,
  onSubmitRequest
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [category, setCategory] = useState<ProfessionCategory>(
    initialArtisan ? initialArtisan.profession : initialCategory
  );
  const [subService, setSubService] = useState<string>(
    initialSubService || (initialArtisan?.subServices[0] || 'leaking pipes')
  );
  const [urgency, setUrgency] = useState<'urgent' | 'today' | 'tomorrow' | 'flexible'>('today');
  const [description, setDescription] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [photoPreview, setPhotoPreview] = useState<string>('');
  
  // Location and contact
  const [city, setCity] = useState<string>(initialArtisan?.location.city || 'Abuja (FCT)');
  const [neighborhood, setNeighborhood] = useState<string>(initialArtisan?.location.neighborhood || 'Wuse');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setPhotoUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!customerName.trim() || !customerPhone.trim() || !description.trim()) {
      setValidationError('Please provide your name, phone number and a brief job description.');
      return;
    }

    onSubmitRequest({
      customerName,
      customerPhone,
      category,
      subService,
      description,
      location: {
        city,
        neighborhood,
        address: streetAddress
      },
      urgency,
      photoUrl: photoPreview || photoUrl,
      assignedArtisanId: initialArtisan?.id
    });

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-neutral-900 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-400">
              {initialArtisan ? `REQUEST ${initialArtisan.name.toUpperCase()}` : 'SUBMIT A JOB REQUEST'}
            </span>
            <h3 className="text-base font-bold font-display text-white">
              {isSubmitted ? 'Request Dispatched' : `Step ${step} of 3: ${step === 1 ? 'Service & Urgency' : step === 2 ? 'Details & Photo' : 'Location & Phone'}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          /* Confirmation State */
          <div className="p-6 sm:p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold font-display text-neutral-900">Job Request Sent!</h4>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-sm mx-auto leading-relaxed">
                {initialArtisan
                  ? `Your request has been dispatched directly to ${initialArtisan.businessName}. They usually reply in under ${initialArtisan.responseTimeText.replace('Usually responds in under ', '')}.`
                  : 'Your request has been matched and sent to available verified artisans in your neighborhood.'}
              </p>
            </div>

            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-neutral-500">Service:</span>
                <span className="font-bold text-neutral-900">{subService} ({category})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Location:</span>
                <span className="font-bold text-neutral-900">{neighborhood}, {city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Preferred Time:</span>
                <span className="font-bold text-amber-700 uppercase">{urgency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Your Phone:</span>
                <span className="font-bold text-neutral-900">{customerPhone}</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              💡 The artisan will call you directly at <strong>{customerPhone}</strong> to confirm diagnosis and timing.
            </p>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
            >
              Done / Return to Platform
            </button>
          </div>
        ) : (
          /* Multi-step Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
            {/* STEP 1: Service & Urgency */}
            {step === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {!initialArtisan && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                      Trade Category:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['plumbing', 'electrical', 'construction'] as ProfessionCategory[]).map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setCategory(cat);
                            setSubService(CATEGORIES[cat].subServices[0]);
                          }}
                          className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                            category === cat
                              ? 'border-amber-500 bg-amber-50 text-amber-900 ring-2 ring-amber-500/20'
                              : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                          }`}
                        >
                          {cat.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    What needs fixing?
                  </label>
                  <select
                    value={subService}
                    onChange={(e) => setSubService(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-semibold text-neutral-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    {CATEGORIES[category].subServices.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
                    When do you need the artisan?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'urgent', label: '🚨 Urgent (Burst / Outage)' },
                      { id: 'today', label: '📅 Today' },
                      { id: 'tomorrow', label: '🌅 Tomorrow' },
                      { id: 'flexible', label: '🗓️ Flexible this week' }
                    ].map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUrgency(item.id as any)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          urgency === item.id
                            ? 'border-amber-500 bg-amber-50 text-amber-900'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <span>Continue to Details & Photos</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Description & Photo Upload */}
            {step === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                    Describe the issue in a few words:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Water is leaking under the kitchen sink flexi-hose. Shut off the valve but need it replaced."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Photo Attachment (Section 12: Photo-based job request) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Attach a photo (Optional, helps artisan prepare tools):
                  </label>
                  <p className="text-[11px] text-neutral-500 mb-2">
                    Upload from your device, drag & drop, or pick a sample defect:
                  </p>

                  <div className="space-y-3">
                    {/* File picker */}
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-neutral-300 rounded-xl bg-neutral-50 hover:bg-neutral-100 cursor-pointer transition-colors">
                      <Camera className="w-6 h-6 text-neutral-400 mb-1" />
                      <span className="text-xs font-bold text-neutral-700">Click to upload photo or drag & drop</span>
                      <span className="text-[10px] text-neutral-400">PNG, JPG up to 10MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    {/* Or quick sample preview picker */}
                    <div>
                      <span className="text-[10px] font-semibold text-neutral-500 block mb-1">Or choose a reference issue photo:</span>
                      <div className="grid grid-cols-4 gap-2">
                        {SAMPLE_DEFECT_PHOTOS.map((sample, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setPhotoPreview(sample.url);
                              setPhotoUrl(sample.url);
                            }}
                            className={`relative rounded-lg overflow-hidden border h-14 text-left transition-all ${
                              photoPreview === sample.url ? 'ring-2 ring-amber-500 border-amber-500' : 'border-neutral-200 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <img src={sample.url} alt={sample.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Preview box if selected */}
                    {photoPreview && (
                      <div className="flex items-center gap-3 p-2.5 bg-neutral-100 rounded-xl">
                        <img src={photoPreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-bold text-neutral-900 block truncate">Photo attached</span>
                          <span className="text-[10px] text-emerald-700 font-semibold">Artisan can see visual context</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPreview('');
                            setPhotoUrl('');
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-semibold"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!description.trim()) {
                        alert('Please describe what needs fixing.');
                        return;
                      }
                      setStep(3);
                    }}
                    className="flex-1 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <span>Continue to Location & Phone</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Location & Phone */}
            {step === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      City:
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Abuja (FCT)">Abuja (FCT)</option>
                      <option value="Lagos">Lagos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Neighborhood:
                    </label>
                    <select
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      {(city.includes('Abuja') ? SUPPORTED_LOCATIONS[0].neighborhoods : SUPPORTED_LOCATIONS[1].neighborhoods).map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Street Address / Estate / Landmark:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. House 14, 4th Avenue Gwarinpa Estate"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Your Full Name:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Fatima Adamu"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Your Phone Number (to receive call):
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 0803 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                {validationError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="py-3 px-4 rounded-xl border border-neutral-300 text-neutral-700 font-semibold text-xs hover:bg-neutral-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
                  >
                    <span>SUBMIT JOB REQUEST</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
