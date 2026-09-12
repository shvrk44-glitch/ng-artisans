import React from 'react';
import { Sparkles, ExternalLink, BookmarkCheck } from 'lucide-react';

interface GooglePreferredSourceBadgeProps {
  className?: string;
  variant?: 'compact' | 'card' | 'banner';
}

export const GooglePreferredSourceBadge: React.FC<GooglePreferredSourceBadgeProps> = ({
  className = '',
  variant = 'compact'
}) => {
  // Use user domain on GitHub Pages or custom domain
  const currentDomain = typeof window !== 'undefined' 
    ? window.location.hostname 
    : 'shvrk44-glitch.github.io';
  const googlePreferencesUrl = `https://www.google.com/preferences/source?q=${encodeURIComponent(currentDomain)}`;

  if (variant === 'banner') {
    return (
      <aside 
        aria-label="Google Preferred Source"
        className={`bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/40 border border-neutral-800 rounded-2xl p-4 sm:p-5 text-white ${className}`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
              {/* Google G icon styling */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  Google Preferred Source
                  <span className="text-[10px] uppercase tracking-wider font-extrabold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
                    AI Overviews & Discover
                  </span>
                </h4>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl">
                Add KraftFix to your trusted sources to see verified Nigerian plumbers, electricians, and construction trades prioritized in your Google AI Overviews.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Official Google button injection point */}
            <div google-add-preferred-source-btn data-theme="dark" data-lang="en"></div>

            {/* Direct fallback link that opens Google's preference manager */}
            <a
              href={googlePreferencesUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold text-xs transition-colors"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Add as Preferred Source</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </a>
          </div>
        </div>
      </aside>
    );
  }

  // Compact variant for Footer or sidebar
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span className="text-xs font-semibold text-neutral-300">Google Preferred Source</span>
      </div>

      {/* Official button container */}
      <div google-add-preferred-source-btn data-theme="dark" data-lang="en"></div>

      <a
        href={googlePreferencesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[11px] text-amber-400 hover:text-amber-300 font-medium transition-colors"
      >
        <Sparkles className="w-3 h-3" />
        <span>Prioritize in your Google AI Overviews</span>
        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
      </a>
    </div>
  );
};
