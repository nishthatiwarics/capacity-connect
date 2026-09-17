import React from 'react';
import { 
  CloudLightning,
  Search,
  Flame,
  Star,
  Award,
  ChevronDown,
  UserCheck,
  User,
  Lock,
  ShieldCheck,
  LogOut,
  MessageSquare
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
  unreadChatCount?: number;
  activeSectionTitle?: string;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
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
  unreadChatCount = 1,
  searchQuery = '',
  onSearchChange,
  dailyStreak = 12,
  badgesCount = 8,
  currentXP = 2340,
  userLevel = 7,
  onOpenProfile,
  onOpenDemoAccounts
}) => {
  const roleDisplayMap: Record<UserRole, { name: string; title: string; avatar: string }> = {
    Admin: {
      name: 'Dr. M. Mohapatra',
      title: 'Director General',
      avatar: ''
    },
    Trainer: {
      name: 'Dr. Someshwar Rao',
      title: 'Lead Instructor',
      avatar: ''
    },
    Trainee: {
      name: 'Learner',
      title: '',
      avatar: ''
    },
    Faculty: {
      name: 'Prof. S. R. Raman',
      title: 'Senior Faculty',
      avatar: ''
    }
  };

  const user = roleDisplayMap[currentRole] || roleDisplayMap.Trainee;

  return (
    <header className="sticky top-0 z-40 bg-white/90 border-b border-sky-100/90 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors shadow-2xs text-slate-800">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Search Bar matching screenshot */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, radar simulations or skills..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50/80 border border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 focus:bg-white text-slate-900 placeholder:text-slate-400 transition-all font-medium"
          />
        </div>

        {/* Right Stats & Profile Pills */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          
          {/* 1. Streak Pill */}
          <div 
            onClick={onOpenProfile}
            title="Daily Learning Streak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer hover:bg-amber-100 transition-all shadow-2xs"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{dailyStreak}-day streak</span>
          </div>

          {/* 2. Badges Pill */}
          <div 
            onClick={onOpenProfile}
            title="Badges Earned"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold cursor-pointer hover:bg-sky-100 transition-all shadow-2xs"
          >
            <Star className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
            <span>{badgesCount} badges</span>
          </div>

          {/* 3. Level & XP Progress Pill */}
          <div 
            onClick={onOpenProfile}
            title="Learner Level & XP Progress"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold cursor-pointer hover:bg-slate-100 transition-all shadow-2xs"
          >
            <span className="font-extrabold text-slate-800">Level {userLevel}</span>
            <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentXP % 1000) / 10))}%` }}
              />
            </div>
            <span className="text-[11px] text-slate-500 font-mono font-bold">
              {currentXP.toLocaleString()}/3k XP
            </span>
          </div>

          {/* 4. User Profile Pill */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1 rounded-2xl border border-slate-200 hover:border-sky-300 bg-white cursor-pointer shadow-2xs transition-all text-slate-800"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-sky-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="text-left hidden lg:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user.name}
              </div>
              {user.title && user.title !== user.name ? (
                <div className="text-[10px] text-slate-500 font-medium">
                  {user.title}
                </div>
              ) : null}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* 5. Faculty Chat & Feedback Trigger Pill */}
          <button 
            type="button"
            onClick={onOpenChat}
            title="Open Trainee-Trainer Chat & Anonymous Lounge (Alt+C)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-xs font-bold cursor-pointer transition-all shadow-2xs active:scale-95"
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Chat & Feedback</span>
            {unreadChatCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          {/* Quick Role / Cockpit Switcher Dropdown */}
          <div className="flex items-center p-0.5 border border-slate-200 rounded-xl text-[11px] font-bold bg-slate-100">
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
                          ? 'Restricted: Learners cannot access Admin Dashboard without DG Clearance'
                          : 'Restricted: Only Admin can access trainer/trainee consoles'
                        : `Switch to ${r}`
                  }
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                    isCurrent
                      ? currentRole === 'Admin'
                        ? 'bg-amber-500 text-white font-extrabold shadow-2xs'
                        : 'bg-white text-slate-900 font-extrabold shadow-2xs'
                      : isRestricted
                        ? 'text-slate-400 hover:text-amber-600'
                        : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {isRestricted && <Lock className="w-2.5 h-2.5 opacity-70" />}
                  <span>{r}</span>
                  {currentRole === 'Admin' && isCurrent && (
                    <span className="text-[9px] font-mono text-white font-bold">★</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Drill Shortcut */}
          <button
            onClick={() => {
              sound.playAlert();
              onOpenCrisisDrill();
            }}
            className="p-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="Launch Emergency Radar Crisis Drill"
          >
            <CloudLightning className="w-4 h-4 fill-white text-white" />
          </button>

          {/* Logout / Return to Homepage */}
          {onLogoutToHomepage && (
            <button
              onClick={() => {
                sound.playBlip(500);
                onLogoutToHomepage();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold shadow-2xs transition-all active:scale-95 cursor-pointer shrink-0"
              title="Sign Out & Return to Institutional Homepage"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Homepage</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
