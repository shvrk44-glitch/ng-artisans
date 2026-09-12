import React from 'react';
import { PhoneCall, ShieldCheck, X, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Artisan } from '../types';

interface CallModalProps {
  artisan: Artisan | null;
  onClose: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ artisan, onClose }) => {
  if (!artisan) return null;

  const handleDial = () => {
    window.location.href = `tel:${artisan.phone}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-7 text-center space-y-5 animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Avatar & Calling Badge */}
        <div className="relative inline-block mx-auto mt-2">
          <img
            src={artisan.avatar}
            alt={artisan.name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-neutral-200"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
            <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
          </div>
        </div>

        <div>
          <span className="text-[11px] font-bold text-emerald-700 tracking-wider uppercase block mb-1">
            DIRECT ARTISAN LINE
          </span>
          <h3 className="text-xl font-bold font-display text-neutral-950">
            Call {artisan.name}
          </h3>
          <p className="text-xs text-neutral-600 mt-0.5">
            {artisan.businessName} • {artisan.professionLabel} ({artisan.location.neighborhood})
          </p>
          <p className="text-sm font-extrabold text-neutral-900 mt-2 font-mono bg-neutral-100 py-1.5 px-3 rounded-lg inline-block">
            {artisan.phone}
          </p>
        </div>

        {/* Essential Customer Guidance Box */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-left text-xs text-neutral-800 space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>Customer Safety & Pricing Tip</span>
          </div>
          <ul className="space-y-1 text-[11px] text-neutral-700 leading-relaxed list-disc list-inside">
            <li>Ask if they are available right now to inspect the issue.</li>
            <li>Confirm the initial inspection or transport fee: <strong>{artisan.pricingGuidance.split('.')[0]}</strong>.</li>
            <li>Always agree on final labor & materials before commencement.</li>
          </ul>
        </div>

        {/* Primary Launch Dial Button */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleDial}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-97 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4 animate-pulse" />
            <span>TAP TO LAUNCH PHONE DIALER</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 text-xs font-semibold text-neutral-500 hover:text-neutral-800"
          >
            Cancel / Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
