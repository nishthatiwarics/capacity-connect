import React from 'react';
import { 
  CloudLightning,
  Search,
  Flame,
  Star,
  Award,
  ChevronDown,
  UserCheck,
  User
} from 'lucide-react';
import { UserRole } from '../types';
import { sound } from '../utils/audio';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenCrisisDrill: () => void;
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
  onOpenCrisisDrill,
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
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
    },
    Trainer: {
      name: 'Dr. Someshwar Rao',
      title: 'Lead Instructor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    Trainee: {
      name: 'Learner',
      title: '',
      avatar: ''
    },
    Faculty: {
      name: 'Prof. S. R. Raman',
      title: 'Senior Faculty',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    }
  };

  const user = roleDisplayMap[currentRole] || roleDisplayMap.Trainee;

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/80 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 transition-colors shadow-2xs">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        
        {/* Search Bar matching screenshot */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, skills or topics..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 text-slate-800 placeholder:text-slate-400 transition-all font-medium"
          />
        </div>

        {/* Right Stats & Profile Pills matching screenshot */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto justify-end">
          
          {/* 1. Streak Pill */}
          <div 
            onClick={onOpenProfile}
            title="Daily Learning Streak"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs font-bold cursor-pointer hover:bg-amber-100/80 transition-all shadow-2xs"
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{dailyStreak}-day streak</span>
          </div>

          {/* 2. Badges Pill */}
          <div 
            onClick={onOpenProfile}
            title="Badges Earned"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-sky-50/80 border border-sky-200/80 text-sky-800 text-xs font-bold cursor-pointer hover:bg-sky-100/80 transition-all shadow-2xs"
          >
            <Star className="w-3.5 h-3.5 fill-sky-500 text-sky-500" />
            <span>{badgesCount} badges</span>
          </div>

          {/* 3. Level & XP Progress Pill */}
          <div 
            onClick={onOpenProfile}
            title="Learner Level & XP Progress"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs font-semibold cursor-pointer hover:bg-slate-100 transition-all shadow-2xs"
          >
            <span className="font-bold text-slate-900">Level {userLevel}</span>
            <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-sky-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentXP % 1000) / 10))}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              {currentXP.toLocaleString()}/3,000 XP
            </span>
          </div>

          {/* 4. User Profile Pill */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white cursor-pointer shadow-2xs transition-all"
          >
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
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

          {/* Quick Role / Cockpit Switcher Dropdown */}
          <div className="flex items-center p-0.5 border border-slate-200 rounded-xl text-[11px] font-semibold bg-slate-50">
            {(['Trainee', 'Trainer', 'Admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  sound.playBlip(650);
                  onRoleChange(r);
                }}
                className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  currentRole === r
                    ? 'bg-[#ea580c] text-white font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Drill Shortcut */}
          <button
            onClick={() => {
              sound.playAlert();
              onOpenCrisisDrill();
            }}
            className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
            title="Launch Emergency Radar Crisis Drill"
          >
            <CloudLightning className="w-4 h-4 text-amber-300" />
          </button>
        </div>

      </div>
    </header>
  );
};
