import React, { useState } from 'react';
import { X, HardHat, CheckCircle2, ArrowRight, Upload, Calendar, DollarSign, MapPin, Phone, User, Building2 } from 'lucide-react';
import { ConstructionProject } from '../types';
import { SUPPORTED_LOCATIONS } from '../data/categories';

interface ConstructionProjectModalProps {
  onClose: () => void;
  onSubmitProject: (project: ConstructionProject) => void;
}

const PROJECT_TYPES = [
  'Full Flat / House Renovation',
  'New Building Work / Extension',
  'POP Suspended Ceiling & Lighting',
  'Complete Floor & Wall Tiling',
  'Roof Carcass & Covering Replacement',
  'Plumbing & Sanitary Overhaul',
  'Commercial / Office Fit-out'
];

const TRADE_OPTIONS = [
  { id: 'mason', label: 'Mason / Block Layer' },
  { id: 'plumber', label: 'Sanitary Plumber' },
  { id: 'electrician', label: 'Licensed Electrician' },
  { id: 'tiler', label: 'Floor & Wall Tiler' },
  { id: 'pop', label: 'POP / Ceiling Designer' },
  { id: 'carpenter', label: 'Roof / Timber Carpenter' },
  { id: 'painter', label: 'Professional Painter' }
];

const BUDGET_RANGES = [
  '₦300,000 – ₦1,000,000',
  '₦1,000,000 – ₦3,000,000',
  '₦3,000,000 – ₦10,000,000',
  '₦10,000,000+'
];

export const ConstructionProjectModal: React.FC<ConstructionProjectModalProps> = ({
  onClose,
  onSubmitProject
}) => {
  const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
  const [city, setCity] = useState('Abuja (FCT)');
  const [neighborhood, setNeighborhood] = useState('Maitama');
  const [description, setDescription] = useState('');
  const [budgetRange, setBudgetRange] = useState(BUDGET_RANGES[1]);
  const [timeline, setTimeline] = useState('Within 2–4 weeks');
  const [requiredTrades, setRequiredTrades] = useState<string[]>(['mason', 'tiler', 'electrician']);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const toggleTrade = (id: string) => {
    if (requiredTrades.includes(id)) {
      setRequiredTrades(requiredTrades.filter(t => t !== id));
    } else {
      setRequiredTrades([...requiredTrades, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    if (!customerName.trim() || !customerPhone.trim() || !description.trim()) {
      setValidationError('Please provide your name, phone number, and project scope.');
      return;
    }

    const project: ConstructionProject = {
      id: `proj-${Date.now()}`,
      customerName,
      customerPhone,
      projectType,
      location: { city, neighborhood },
      description,
      budgetRange,
      timeline,
      requiredTrades,
      createdAt: 'Just now',
      status: 'connecting'
    };

    onSubmitProject(project);
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 bg-neutral-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <HardHat className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block">
                MULTI-TRADE PROJECT
              </span>
              <h3 className="text-base font-bold font-display text-white">
                Start a Building or Renovation Project
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 sm:p-7 flex-1">
          {isSubmitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold font-display text-neutral-950">
                Project Scope Dispatched!
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>. We have matched your <strong>{projectType}</strong> project in <strong>{neighborhood}</strong> with our verified building specialists and lead craftsmen.
              </p>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-left text-xs max-w-md mx-auto space-y-2">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Required Trades:</span>
                  <span className="font-bold text-neutral-900">{requiredTrades.join(', ').toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Budget Range:</span>
                  <span className="font-bold text-neutral-900">{budgetRange}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Timeline:</span>
                  <span className="font-bold text-neutral-900">{timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Site Contact:</span>
                  <span className="font-bold text-neutral-900">{customerPhone}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs"
                >
                  Close / View Results
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  1. Project Type:
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm font-semibold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {PROJECT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Required Trades */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                  2. Select Required Trades:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TRADE_OPTIONS.map(trade => {
                    const isChecked = requiredTrades.includes(trade.id);
                    return (
                      <button
                        key={trade.id}
                        type="button"
                        onClick={() => toggleTrade(trade.id)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          isChecked
                            ? 'border-amber-500 bg-amber-50 text-amber-950 ring-1 ring-amber-500'
                            : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        ✓ {trade.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    City:
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900"
                  >
                    <option value="Abuja (FCT)">Abuja (FCT)</option>
                    <option value="Lagos">Lagos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Site Neighborhood:
                  </label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900"
                  >
                    {(city.includes('Abuja') ? SUPPORTED_LOCATIONS[0].neighborhoods : SUPPORTED_LOCATIONS[1].neighborhoods).map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                  3. Project Scope & Site Description:
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. 4-bedroom duplex renovation in Maitama. Need floor tiling throughout (320 sqm), complete bathroom plumbing re-piping, and decorative POP ceilings."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Estimated Budget Range:
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900"
                  >
                    {BUDGET_RANGES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Desired Timeline:
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900"
                  >
                    <option value="Immediate (This week)">Immediate (This week)</option>
                    <option value="Within 2–4 weeks">Within 2–4 weeks</option>
                    <option value="Within 1–2 months">Within 1–2 months</option>
                    <option value="Flexible planning">Flexible planning</option>
                  </select>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Your Name:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Arch. Kenneth Obi"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1">
                    Your Phone Number:
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0803 987 6543"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm text-neutral-900 focus:outline-none"
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

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm"
                >
                  <HardHat className="w-4 h-4" />
                  <span>MATCH WITH CONSTRUCTION SPECIALISTS</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
