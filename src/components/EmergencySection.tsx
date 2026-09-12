import React from 'react';
import { AlertTriangle, Phone, Flame, Zap, Droplets, ArrowRight } from 'lucide-react';
import { ProfessionCategory } from '../types';

interface EmergencySectionProps {
  onFilterUrgent: (category?: ProfessionCategory, subService?: string) => void;
}

export const EmergencySection: React.FC<EmergencySectionProps> = ({ onFilterUrgent }) => {
  return (
    <section className="bg-neutral-950 text-white py-8 sm:py-10 border-y border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              NEED SOMEONE NOW?
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Find professionals currently accepting urgent jobs.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-neutral-400">
              Burst water pipe? Generator fault? Complete power loss? Connect directly with verified artisans on standby in your area.
            </p>
          </div>

          {/* Rapid 4 Emergency Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full lg:w-auto">
            <button
              id="emergency-burst-pipe-btn"
              onClick={() => onFilterUrgent('plumbing', 'emergency plumbing')}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/60 hover:bg-neutral-800/80 transition-all text-left group"
            >
              <Droplets className="w-5 h-5 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block text-neutral-200 group-hover:text-white">Burst Pipe / Leak</span>
              <span className="text-[10px] text-neutral-500">Water shutoff & repair</span>
            </button>

            <button
              id="emergency-power-fault-btn"
              onClick={() => onFilterUrgent('electrical', 'electrical faults')}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/60 hover:bg-neutral-800/80 transition-all text-left group"
            >
              <Zap className="w-5 h-5 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block text-neutral-200 group-hover:text-white">Power Fault</span>
              <span className="text-[10px] text-neutral-500">Short circuit & trips</span>
            </button>

            <button
              id="emergency-generator-btn"
              onClick={() => onFilterUrgent('electrical', 'generator wiring')}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/60 hover:bg-neutral-800/80 transition-all text-left group"
            >
              <Flame className="w-5 h-5 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block text-neutral-200 group-hover:text-white">Generator ATS</span>
              <span className="text-[10px] text-neutral-500">Changeover fault</span>
            </button>

            <button
              id="emergency-drainage-btn"
              onClick={() => onFilterUrgent('plumbing', 'blocked drains')}
              className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-rose-500/60 hover:bg-neutral-800/80 transition-all text-left group"
            >
              <AlertTriangle className="w-5 h-5 text-yellow-400 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-bold block text-neutral-200 group-hover:text-white">Blocked Drain</span>
              <span className="text-[10px] text-neutral-500">Overflow relief</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
