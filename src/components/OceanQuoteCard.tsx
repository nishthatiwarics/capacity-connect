import React, { useState } from 'react';
import { Quote, Sparkles, Waves, Volume2, Share2, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface OceanQuoteCardProps {
  variant?: 'banner' | 'card';
  className?: string;
}

const QUOTES = [
  {
    quote: "Our oceans are not just resources, they are our shared responsibility.",
    author: "Ministry of Earth Sciences",
    subtext: "Government of India • Ocean & Climate Mission",
  },
  {
    quote: "Vigyan se Surakshit Samudra, Samruddh Bharat — Science for Safe Oceans & a Prosperous Nation.",
    author: "Ministry of Earth Sciences",
    subtext: "Deep Ocean Mission & Coastal Resilience Initiative",
  },
  {
    quote: "Understanding our atmosphere and oceans is understanding the heartbeat of our planet.",
    author: "India Meteorological Department",
    subtext: "Capacity Building & Forecaster Network",
  }
];

export const OceanQuoteCard: React.FC<OceanQuoteCardProps> = ({ variant = 'card', className = '' }) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const current = QUOTES[quoteIndex];

  const handleNextQuote = () => {
    sound.playBlip(750);
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const handleCopyQuote = () => {
    navigator.clipboard?.writeText(`"${current.quote}" — ${current.author}`);
    setCopied(true);
    sound.playSuccess();
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'banner') {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-500/10 via-sky-500/10 to-blue-500/15 border border-pink-200/60 backdrop-blur-md p-4 sm:p-5 shadow-xs ${className}`}>
        {/* Decorative background waves */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 pointer-events-none text-sky-500">
          <Waves className="w-full h-full" />
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Quote className="w-5 h-5 fill-white/30" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-medium text-slate-800 tracking-tight leading-snug">
                "{current.quote}"
              </p>
              <p className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span>— {current.author}</span>
                <span className="text-slate-400 hidden md:inline">• {current.subtext}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
            <button
              onClick={handleCopyQuote}
              title="Copy quote"
              className="p-1.5 rounded-lg border border-slate-200/80 hover:border-pink-300 bg-white/80 hover:bg-white text-slate-600 hover:text-pink-600 transition-all text-xs flex items-center gap-1 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="text-[11px] font-medium">{copied ? 'Copied' : 'Share'}</span>
            </button>
            <button
              onClick={handleNextQuote}
              title="Next quote"
              className="px-2.5 py-1.5 rounded-lg border border-slate-200/80 hover:border-sky-300 bg-white/80 hover:bg-white text-slate-600 hover:text-sky-700 transition-all text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Next</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default card format matching screenshot top right
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white/90 border border-pink-200/70 shadow-xs p-5 transition-all hover:shadow-md ${className}`}>
      {/* Decorative sun & wave illustration motif matching screenshot */}
      <div className="absolute top-2 right-2 w-28 h-28 pointer-events-none opacity-90">
        <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
          {/* Sun with rays */}
          <circle cx="95" cy="25" r="14" fill="#FDE047" fillOpacity="0.8" />
          <path d="M95 5V9M95 41V45M75 25H79M111 25H115M81 11L84 14M106 36L109 39M81 39L84 36M106 14L109 11" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" />
          {/* Ocean whale tail & waves */}
          <path d="M30 95 C 45 80, 65 85, 80 75 C 95 65, 105 85, 115 80" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M15 105 C 35 90, 60 100, 85 92 C 100 87, 110 98, 120 95" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
          {/* Whale silhouette */}
          <path d="M70 76 C 75 70, 82 66, 90 70 C 86 64, 88 56, 96 52 C 86 54, 82 62, 78 66 C 74 62, 68 62, 64 68 C 66 73, 68 75, 70 76 Z" fill="#0369A1" fillOpacity="0.85" />
        </svg>
      </div>

      {/* Big quotes icon */}
      <div className="text-3xl font-serif text-pink-500 font-bold leading-none select-none mb-1">
        “
      </div>

      <p className="text-slate-800 text-sm font-medium leading-relaxed pr-8 relative z-10">
        "{current.quote}"
      </p>

      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 relative z-10">
        <span className="text-xs font-semibold text-slate-500 tracking-tight">
          — {current.author}
        </span>
        <button
          onClick={handleNextQuote}
          className="text-[11px] font-medium text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
        >
          <Sparkles className="w-3 h-3 text-amber-500" />
          <span>Inspire</span>
        </button>
      </div>
    </div>
  );
};
