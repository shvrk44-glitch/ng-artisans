import React from 'react';
import { PhoneCall, ShieldCheck, Wrench, HardHat, Zap, MapPin } from 'lucide-react';
import { ProfessionCategory } from '../types';
import { GooglePreferredSourceBadge } from './GooglePreferredSourceBadge';

interface FooterProps {
  onSelectCategory: (cat: ProfessionCategory | 'all') => void;
  onOpenRegisterModal: () => void;
  onOpenProjectModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenRegisterModal,
  onOpenProjectModal
}) => {
  return (
    <footer className="bg-neutral-950 text-white pt-12 pb-16 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Core Promise */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-neutral-950 font-black">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight font-display text-white">
                KRAFT<span className="text-amber-400">FIX</span>
              </span>
            </div>

            <p className="text-xs font-bold text-amber-400 tracking-wider uppercase">
              FIND THE RIGHT ARTISAN. CALL THEM WHEN YOU NEED THEM.
            </p>

            <p className="text-xs text-neutral-400 leading-relaxed">
              Nigeria's dedicated local skilled-services discovery platform. Eliminating unreliable WhatsApp referrals with verified, nearby plumbers, electricians, and construction craftsmen.
            </p>

            <div className="pt-2">
              <GooglePreferredSourceBadge variant="compact" />
            </div>
          </div>

          {/* Col 2: Core Trade Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Skilled Trades
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onSelectCategory('plumbing')}
                  className="hover:text-amber-400 text-left transition-colors"
                >
                  Plumbers (Pipes, pumps, toilets)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('electrical')}
                  className="hover:text-amber-400 text-left transition-colors"
                >
                  Electricians (Wiring, inverters, tripping)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory('construction')}
                  className="hover:text-amber-400 text-left transition-colors"
                >
                  Building & Masonry (Tiling, POP, blocks)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenProjectModal}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-left"
                >
                  + Multi-Trade Building Projects
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coverage Areas */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              Active Coverage
            </h4>
            <div className="text-xs text-neutral-400 space-y-1">
              <p className="font-semibold text-neutral-200">Abuja (FCT):</p>
              <p className="text-[11px] text-neutral-400">
                Wuse, Gwarinpa, Maitama, Jabi, Utako, Apo, Kubwa, Lokogoma, Asokoro, Lugbe
              </p>

              <p className="font-semibold text-neutral-200 pt-2">Lagos:</p>
              <p className="text-[11px] text-neutral-400">
                Lekki Phase 1, Ikeja, Victoria Island, Yaba, Surulere, Ikoyi, Magodo
              </p>
            </div>
          </div>

          {/* Col 4: For Skilled Artisans */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
              For Skilled Artisans
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Are you a qualified plumber, electrician, or builder? Get matched with real paying customers near your workshop.
            </p>
            <button
              onClick={onOpenRegisterModal}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Join as an Artisan</span>
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} KraftFix. Built for local speed, verification, and trusted craft.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Direct Call Network</span>
            <span>•</span>
            <span>Four-tier Verification</span>
            <span>•</span>
            <span>Zero Unsolicited Ads</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
