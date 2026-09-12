import React from 'react';
import { Wrench, PhoneCall, ShieldCheck, UserCheck, PlusCircle, AlertCircle, Briefcase, Menu, X, LayoutDashboard } from 'lucide-react';
import { ProfessionCategory } from '../types';

interface NavbarProps {
  currentView: 'home' | 'artisans' | 'artisan-dashboard';
  onNavigate: (view: 'home' | 'artisans' | 'artisan-dashboard') => void;
  selectedCategory?: ProfessionCategory | 'all';
  onSelectCategory?: (cat: ProfessionCategory | 'all') => void;
  onOpenJoinModal: () => void;
  onOpenProjectModal: () => void;
  onOpenEmergency: () => void;
  onNavigateSafety?: () => void;
  activeLeadsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  selectedCategory,
  onSelectCategory,
  onOpenJoinModal,
  onOpenProjectModal,
  onOpenEmergency,
  onNavigateSafety,
  activeLeadsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleSafetyClick = () => {
    if (onNavigateSafety) {
      onNavigateSafety();
    } else {
      if (currentView !== 'home') {
        onNavigate('home');
        setTimeout(() => {
          document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Value Hook */}
          <button
            id="nav-logo-button"
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-98 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-amber-400 flex items-center justify-center font-bold shadow-xs group-hover:bg-neutral-800 transition-colors">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-bold tracking-tight text-neutral-900 font-display flex items-center gap-1.5">
                ng-artisans
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                  Nigeria
                </span>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Supabase Live
                </span>
              </span>
              <p className="text-[11px] text-neutral-500 font-medium -mt-0.5 hidden xs:block">
                Find the right artisan. Call directly.
              </p>
            </div>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-find-artisan-btn"
              onClick={() => {
                onSelectCategory?.('all');
                onNavigate('artisans');
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'artisans' && selectedCategory === 'all'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Find an Artisan
            </button>
            <button
              id="nav-plumbers-btn"
              onClick={() => {
                onSelectCategory?.('plumbing');
                onNavigate('artisans');
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'artisans' && selectedCategory === 'plumbing'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Plumbers
            </button>
            <button
              id="nav-electricians-btn"
              onClick={() => {
                onSelectCategory?.('electrical');
                onNavigate('artisans');
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'artisans' && selectedCategory === 'electrical'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Electricians
            </button>
            <button
              id="nav-construction-btn"
              onClick={() => {
                onSelectCategory?.('construction');
                onNavigate('artisans');
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'artisans' && selectedCategory === 'construction'
                  ? 'bg-neutral-100 text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              Construction
            </button>
            <button
              id="nav-project-btn"
              onClick={onOpenProjectModal}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Start a Project
            </button>
            <button
              id="nav-safety-btn"
              onClick={handleSafetyClick}
              className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safety & Trust
            </button>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Urgent / Emergency trigger */}
            <button
              id="nav-emergency-trigger-btn"
              onClick={onOpenEmergency}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors cursor-pointer"
              title="Urgent repairs: burst pipes, electrical faults"
            >
              <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              Need Someone Now?
            </button>

            {/* Switch to Artisan Dashboard */}
            <button
              id="nav-artisan-dashboard-btn"
              onClick={() => onNavigate('artisan-dashboard')}
              className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                currentView === 'artisan-dashboard'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Artisan Portal</span>
              <span className="sm:hidden">Artisan</span>
              {activeLeadsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeLeadsCount}
                </span>
              )}
            </button>

            {/* Join as Artisan CTA */}
            <button
              id="nav-join-artisan-btn"
              onClick={onOpenJoinModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 transition-colors active:scale-97 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Join as an Artisan</span>
              <span className="sm:hidden">Join</span>
            </button>

            {/* Mobile Hamburger */}
            <button
              id="nav-mobile-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                onOpenEmergency();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 animate-pulse" />
              Need Someone Now?
            </button>
            <button
              onClick={() => {
                onNavigate('artisan-dashboard');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-600" />
              Artisan Portal
              {activeLeadsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[10px]">
                  {activeLeadsCount}
                </span>
              )}
            </button>
          </div>

          <div className="pt-2 border-t border-neutral-100 space-y-1">
            <button
              onClick={() => {
                onSelectCategory?.('all');
                onNavigate('artisans');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer"
            >
              🔍 Find an Artisan (All Categories)
            </button>
            <button
              onClick={() => {
                onSelectCategory?.('plumbing');
                onNavigate('artisans');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer"
            >
              🚰 Plumbers (Leaks, Drains, Water Tanks)
            </button>
            <button
              onClick={() => {
                onSelectCategory?.('electrical');
                onNavigate('artisans');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer"
            >
              ⚡ Electricians (Wiring, Inverters, Generators)
            </button>
            <button
              onClick={() => {
                onSelectCategory?.('construction');
                onNavigate('artisans');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 cursor-pointer"
            >
              🏗️ Building & Construction (Masons, Tiling, POP)
            </button>
            <button
              onClick={() => {
                onOpenProjectModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 flex items-center justify-between cursor-pointer"
            >
              <span>🔨 Start a Construction Project</span>
              <span className="text-[10px] uppercase font-bold bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-600">Multi-trade</span>
            </button>
            <button
              onClick={() => {
                handleSafetyClick();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-neutral-800 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Safety & Verification Standards
            </button>
          </div>

          <div className="pt-3 border-t border-neutral-100">
            <button
              onClick={() => {
                onOpenJoinModal();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-neutral-900 text-amber-400 font-semibold text-sm flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              Join as an Artisan (Get Discovered)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
