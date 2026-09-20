import React from 'react';
import { 
  CloudLightning,
  Search,
  Lock,
  LogOut,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onRequestAdminClearance?: (targetRole: UserRole) => void;
  onLogoutToHomepage?: () => void;
  onOpenCrisisDrill: () => void;
  onOpenChat?: () => void;
  onToggleMobileMenu?: () => void;
  unreadChatCount?: number;
  activeSectionTitle?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  // Kept optional for backward compatibility if passed
  dailyStreak?: number;
  badgesCount?: number;
  currentXP?: number;
  userLevel?: number;
  onOpenProfile?: () => void;
  onOpenDemoAccounts?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onRequestAdminClearance,
  onLogoutToHomepage,
  onOpenCrisisDrill,
  onOpenChat,
  onToggleMobileMenu,
  unreadChatCount = 1,
  searchQuery = '',
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-40 liquid-glass-tray border-b border-white/80 dark:border-white/10 px-3 sm:px-6 lg:px-8 py-3 transition-colors shadow-sm text-slate-800 dark:text-slate-100">
      {/* MOBILE-ONLY TOP BAR (md:hidden) */}
      <div className="flex md:hidden items-center justify-between gap-2 pb-2.5 border-b border-white/40 dark:border-white/10 mb-2.5">
        <div className="flex items-center gap-2">
          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl liquid-glass-pill-frosted border border-sky-200/80 text-sky-800 dark:text-sky-200 active:scale-95 transition-all cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shrink-0"
            aria-label="Open mobile navigation menu"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-sky-700 dark:text-sky-300" />
          </button>

          {/* Mobile App Branding */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-50 to-sky-100 border border-sky-200 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 100" className="w-5 h-5 fill-slate-800" aria-label="Emblem">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="4" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
              </svg>
            </div>
            <div>
              <span className="text-xs font-black text-slate-950 dark:text-white block leading-tight">Capacity Connect</span>
              <span className="text-[10px] font-black text-slate-950 dark:text-sky-100 block leading-tight">IMD • MoES</span>
            </div>
          </div>
        </div>

        {/* Right Quick Mobile Icons */}
        <div className="flex items-center gap-2">
          {/* Chat Icon */}
          <button 
            type="button"
            onClick={onOpenChat}
            className="relative p-2 rounded-xl liquid-glass-pill-frosted border border-indigo-200/80 text-indigo-700 dark:text-indigo-300 min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-95 cursor-pointer"
            title="Faculty Chat"
          >
            <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            {unreadChatCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          {/* Drill Shortcut */}
          <button
            onClick={() => {
              sound.playAlert();
              onOpenCrisisDrill();
            }}
            className="p-2 rounded-xl liquid-glass-pill liquid-glass-pill-amber text-white min-w-[38px] min-h-[38px] flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
            title="Emergency Radar Crisis Drill"
          >
            <CloudLightning className="w-4 h-4 fill-white text-white" />
          </button>
        </div>
      </div>

      {/* MAIN HEADER ROW: Expanded Search Bar & Clean, Reduced Button Cluster */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
        
        {/* BIGGER, EXPANSIVE & PROMINENT SEARCH BAR */}
        <div className="relative flex-1 max-w-full md:max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <Search className="w-5 h-5 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 text-sky-600 pointer-events-none transition-colors" />
          <input
            type="text"
            placeholder="Search courses, Doppler radar simulations, forecasting skills, or SOPs..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-11 sm:pl-12 pr-12 sm:pr-20 py-2.5 sm:py-3 text-sm sm:text-base liquid-glass-input rounded-2xl focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 transition-all font-medium min-h-[46px] sm:min-h-[50px]"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange?.('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-1 bg-white/70 dark:bg-white/10 border border-white/60 dark:border-white/10 rounded-md text-[11px] font-mono font-bold text-slate-400 shadow-2xs pointer-events-none">
              <span>⌘K</span>
            </div>
          )}
        </div>

        {/* CLEAN, MINIMAL & VISIBLE ACTION BUTTONS (LESS IS MORE) */}
        <div className="flex items-center gap-2 sm:gap-2.5 justify-end shrink-0">
          
          {/* 1. Cockpit Role Switcher (Streamlined & Intuitive) */}
          <div className="flex items-center p-1 border border-white/60 dark:border-white/15 rounded-2xl text-xs font-bold liquid-glass-pill-frosted shadow-xs shrink-0 gap-1">
            {(['Trainee', 'Trainer', 'Admin'] as const).map((r) => {
              const isCurrent = currentRole === r;
              const isRestricted = 
                (currentRole === 'Trainee' && r !== 'Trainee') ||
                (currentRole === 'Trainer' && r !== 'Trainer');

              return (
                <button
                  key={r}
                  onClick={() => {
                    if (isRestricted) {
                      sound.playAlert();
                      if (onRequestAdminClearance) {
                        onRequestAdminClearance(r);
                      }
                      return;
                    }
                    sound.playBlip(650);
                    onRoleChange(r);
                  }}
                  title={
                    isCurrent
                      ? `Active: ${r}`
                      : isRestricted
                        ? r === 'Admin'
                          ? 'Restricted: Request DG Clearance'
                          : 'Restricted: Trainer clearance required'
                        : `Switch to ${r} Cockpit`
                  }
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                    isCurrent
                      ? currentRole === 'Admin'
                        ? 'liquid-glass-pill liquid-glass-pill-amber text-white font-black shadow-xs'
                        : 'liquid-glass-pill liquid-glass-pill-sky text-white font-black shadow-xs'
                      : isRestricted
                        ? 'text-slate-400 dark:text-slate-500 hover:text-amber-700'
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
                  }`}
                >
                  {isRestricted && <Lock className="w-3 h-3 opacity-60" />}
                  <span>{r}</span>
                  {currentRole === 'Admin' && isCurrent && (
                    <span className="text-[10px] text-white">★</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* 2. Faculty Chat Button */}
          <button 
            type="button"
            onClick={onOpenChat}
            title="Open Faculty Chat & Anonymous Feedback Lounge"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl liquid-glass-pill liquid-glass-pill-indigo text-white text-xs font-extrabold transition-all shadow-xs cursor-pointer active:scale-95 shrink-0 min-h-[38px]"
          >
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="hidden lg:inline whitespace-nowrap">Faculty Chat</span>
            {unreadChatCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            )}
          </button>

          {/* 3. Emergency Crisis Drill Button */}
          <button
            onClick={() => {
              sound.playAlert();
              onOpenCrisisDrill();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl liquid-glass-pill liquid-glass-pill-amber text-white text-xs font-extrabold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 min-h-[38px]"
            title="Launch Emergency Radar Crisis Drill"
          >
            <CloudLightning className="w-4 h-4 fill-white text-white" />
            <span className="hidden xl:inline whitespace-nowrap">Crisis Drill</span>
          </button>

          {/* 4. Exit / Return to Institutional Homepage */}
          {onLogoutToHomepage && (
            <button
              onClick={() => {
                sound.playBlip(500);
                onLogoutToHomepage();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl liquid-glass-pill liquid-glass-pill-frosted hover:border-rose-400 text-rose-700 dark:text-rose-400 text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer shrink-0 min-h-[38px]"
              title="Sign Out & Return to Institutional Homepage"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span className="hidden sm:inline whitespace-nowrap">Exit</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
