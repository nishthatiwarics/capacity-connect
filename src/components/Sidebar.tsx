import React from 'react';
import { 
  Home,
  LayoutDashboard,
  GitFork,
  BookOpen, 
  Target,
  Trophy,
  Award,
  User,
  Users,
  PlayCircle,
  HelpCircle,
  Sparkles,
  Compass,
  LogOut,
  MessageSquare,
  X,
  CloudSun,
  Flame,
  Star,
  ChevronRight
} from 'lucide-react';
import hachiwareTeacherGuide from '../assets/images/hachiware_teacher_guide_1789296571776.jpg';

export type NavSection = 
  | 'home'
  | 'learner-dashboard'
  | 'weather-bulletin'
  | 'skill-tree'
  | 'courses'
  | 'trainer-matching'
  | 'quests'
  | 'leaderboard'
  | 'badges'
  | 'profile'
  | 'dashboard'
  | 'trainees'
  | 'repository';

interface SidebarProps {
  activeNav: NavSection;
  onSelectNav: (nav: NavSection) => void;
  onOpenGuide: () => void;
  onStartTour?: () => void;
  onOpenHelp?: () => void;
  onOpenFeatures?: () => void;
  onOpenChat?: () => void;
  onLogoutToHomepage?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  // Learner Profile Props (Displayed on the left side)
  currentRole?: 'Trainee' | 'Trainer' | 'Admin' | 'Faculty';
  studentName?: string;
  studentStation?: string;
  studentAvatar?: string;
  dailyStreak?: number;
  badgesCount?: number;
  currentXP?: number;
  userLevel?: number;
  animalRank?: string;
  animalEmoji?: string;
  onOpenProfile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  onOpenGuide,
  onStartTour,
  onOpenHelp,
  onOpenFeatures,
  onOpenChat,
  onLogoutToHomepage,
  isOpenMobile = false,
  onCloseMobile,
  currentRole = 'Trainee',
  studentName = 'Julianne Moore',
  studentStation = 'Pune CTI',
  studentAvatar,
  dailyStreak = 12,
  badgesCount = 8,
  currentXP = 2340,
  userLevel = 7,
  animalRank = 'Cat Forecaster',
  animalEmoji = '🐱',
  onOpenProfile
}) => {
  // Streamlined, clean, highly visible navigation menu (removing redundant duplicate items)
  const navItems = [
    { id: 'home' as const, label: 'Home Dashboard', icon: Home, matchKeys: ['home', 'dashboard', 'learner-dashboard'] },
    { id: 'weather-bulletin' as const, label: 'Weather Bulletin', icon: CloudSun, matchKeys: ['weather-bulletin', 'weather'], badge: 'LIVE' },
    { id: 'courses' as const, label: 'Courses & Syllabi', icon: BookOpen, matchKeys: ['courses'] },
    { id: 'skill-tree' as const, label: 'Radar Skills & Labs', icon: GitFork, matchKeys: ['skill-tree', 'trainees'] },
    { id: 'trainer-matching' as const, label: 'Faculty Directory', icon: Users, matchKeys: ['trainer-matching'], badge: 'MAPPING' },
    { id: 'quests' as const, label: 'Quests & Arena', icon: Target, matchKeys: ['quests'] },
  ];

  const handleNavClick = (id: NavSection) => {
    onSelectNav(id);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const displayName = currentRole === 'Admin'
    ? 'Dr. M. Mohapatra'
    : currentRole === 'Trainer'
      ? 'Dr. Someshwar Rao'
      : studentName;

  const displayTitle = currentRole === 'Admin'
    ? 'Director General'
    : currentRole === 'Trainer'
      ? 'Lead Instructor'
      : 'Cadet Forecaster';

  const content = (
    <div className="flex flex-col justify-between h-full min-h-full">
      <div>
        {/* Brand Header: MoES Government of India + Capacity Connect */}
        <div className="mb-4 px-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Emblem mark */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-50 via-sky-50 to-blue-100 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
              <svg viewBox="0 0 100 100" className="w-7 h-7 fill-slate-800" aria-label="Emblem of India">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="3.5" />
                <circle cx="50" cy="50" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
                <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M23 77 L77 23" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-base tracking-tight text-slate-950 dark:text-white leading-tight flex items-center gap-1.5">
                <span>Capacity Connect</span>
              </h1>
              <p className="text-[11px] text-sky-950 dark:text-sky-200 font-black leading-tight mt-0.5">
                Ministry of Earth Sciences<br />
                <span className="text-slate-950 dark:text-white font-black">Govt of India • IMD</span>
              </p>
            </div>
          </div>

          {/* Close button inside mobile drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 min-w-[40px] min-h-[40px] flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* LEARNER PROFILE CARD ON THE LEFT SIDE */}
        <div 
          onClick={onOpenProfile}
          className="mb-4 p-3.5 rounded-2xl liquid-glass-card shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          title="Click to view full competency dossier, animal rank, and learning metrics"
        >
          <div className="absolute -top-10 -right-10 w-28 h-28 liquid-glass-bloom-cyan rounded-full pointer-events-none opacity-40" />

          {/* User Header */}
          <div className="flex items-center gap-2.5 relative z-10">
            <div className="relative shrink-0">
              {studentAvatar ? (
                <img src={studentAvatar} alt={displayName} className="w-10 h-10 rounded-xl object-cover border border-white/80 shadow-xs" />
              ) : (
                <div className="w-10 h-10 rounded-xl liquid-glass-pill liquid-glass-pill-sky text-white flex items-center justify-center font-black text-sm shadow-xs">
                  {displayName.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-xs font-black text-slate-900 dark:text-white truncate leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {displayName}
                </h3>
                <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300 border border-sky-300/40 shrink-0">
                  L{userLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                {displayTitle} • {studentStation}
              </p>
            </div>
          </div>

          {/* Rank Badge */}
          <div className="mt-2.5 flex items-center justify-between px-2.5 py-1.5 rounded-xl liquid-glass-pill-frosted border border-white/70 dark:border-white/10 text-xs relative z-10">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-sm shrink-0">{animalEmoji}</span>
              <span className="font-extrabold text-amber-800 dark:text-amber-300 text-[11px] truncate">{animalRank}</span>
            </div>
            <span className="text-[10px] font-bold text-sky-700 dark:text-sky-300 shrink-0 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
              Profile <ChevronRight className="w-3 h-3" />
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="mt-2 space-y-1 relative z-10">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
              <span className="font-bold text-slate-700 dark:text-slate-300">Level {userLevel}</span>
              <span className="text-sky-700 dark:text-sky-400 font-bold">{currentXP.toLocaleString()} / 3,000 XP</span>
            </div>
            <div className="w-full bg-slate-200/70 dark:bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((currentXP % 1000) / 10))}%` }}
              />
            </div>
          </div>

          {/* Streak and Badges summary pills */}
          <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-white/60 dark:border-white/10 text-[11px] relative z-10">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg liquid-glass-pill-frosted border border-amber-200/60 text-amber-900 dark:text-amber-200 font-bold">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
              <span className="truncate">{dailyStreak}d Streak</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg liquid-glass-pill-frosted border border-sky-200/60 text-sky-900 dark:text-sky-200 font-bold">
              <Star className="w-3.5 h-3.5 fill-sky-500 text-sky-500 shrink-0" />
              <span className="truncate">{badgesCount} Badges</span>
            </div>
          </div>
        </div>

        {/* Clean, Streamlined Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchKeys.includes(activeNav);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer min-h-[42px] ${
                  isActive
                    ? 'liquid-glass-pill liquid-glass-pill-sky text-white font-extrabold shadow-sm'
                    : 'text-slate-950 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-white/50 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-sky-600 dark:text-sky-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-black ${
                    isActive ? 'bg-white/20 text-white' : 'liquid-glass-pill liquid-glass-pill-emerald text-[10px]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Institutional Homepage link */}
          {onLogoutToHomepage && (
            <button
              onClick={() => {
                onLogoutToHomepage();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full mt-2 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 hover:border-rose-300 liquid-glass-pill-frosted transition-all cursor-pointer border border-white/60 dark:border-white/10 shadow-xs min-h-[40px]"
              title="Return to Institutional Homepage"
            >
              <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
              <span>Institutional Portal</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mascot Guide Section (Simplified & Clean) */}
      <div className="mt-4 pt-3 border-t border-white/60 dark:border-white/10 relative">
        <div className="p-3 rounded-2xl liquid-glass-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/80 dark:border-white/10 bg-white shadow-2xs">
            <img
              src={hachiwareTeacherGuide}
              alt="Hachiware Chiikawa Teacher Guide"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
              Hachiware Sensei
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
              Doppler Radar Mentor
            </p>
            <button
              onClick={() => {
                if (onStartTour) onStartTour();
                else onOpenGuide();
                if (onCloseMobile) onCloseMobile();
              }}
              className="mt-1 text-[11px] font-extrabold text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlayCircle className="w-3 h-3" />
              <span>Interactive Tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 lg:w-72 shrink-0 liquid-glass-tray border-r border-white/80 dark:border-white/10 text-slate-800 dark:text-slate-100 flex-col justify-between p-4 lg:p-5 min-h-screen sticky top-0 shadow-sm z-30">
        {content}
      </aside>

      {/* Mobile Slide-Out Drawer (Only when isOpenMobile is true) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <aside className="relative z-10 w-80 max-w-[85vw] liquid-glass-tray text-slate-800 dark:text-slate-100 p-4 sm:p-5 flex flex-col justify-between overflow-y-auto shadow-2xl animate-in slide-in-from-left duration-300 border-r border-white/80 dark:border-white/10">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
