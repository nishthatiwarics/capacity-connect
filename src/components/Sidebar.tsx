import React from 'react';
import { 
  Home,
  GitFork,
  BookOpen, 
  Target,
  Trophy,
  Award,
  User,
  PlayCircle,
  HelpCircle,
  Sparkles,
  Compass,
  LogOut,
  MessageSquare
} from 'lucide-react';
import hachiwareTeacherGuide from '../assets/images/hachiware_teacher_guide_1789296571776.jpg';

export type NavSection = 
  | 'home'
  | 'skill-tree'
  | 'courses'
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  onOpenGuide,
  onStartTour,
  onOpenHelp,
  onOpenFeatures,
  onOpenChat,
  onLogoutToHomepage
}) => {
  const navItems = [
    { id: 'home' as const, label: 'Home', icon: Home, matchKeys: ['home', 'dashboard'] },
    { id: 'skill-tree' as const, label: 'Skill Tree', icon: GitFork, matchKeys: ['skill-tree', 'trainees'] },
    { id: 'courses' as const, label: 'Courses', icon: BookOpen, matchKeys: ['courses'] },
    { id: 'quests' as const, label: 'Quests', icon: Target, matchKeys: ['quests'] },
    { id: 'leaderboard' as const, label: 'Leaderboard', icon: Trophy, matchKeys: ['leaderboard'] },
    { id: 'badges' as const, label: 'Badges', icon: Award, matchKeys: ['badges'] },
    { id: 'profile' as const, label: 'Profile', icon: User, matchKeys: ['profile'] },
  ];

  return (
    <aside className="w-64 lg:w-72 shrink-0 bg-white/90 backdrop-blur-md border-r border-sky-100/90 text-slate-800 flex flex-col justify-between p-4 lg:p-5 min-h-screen sticky top-0 shadow-xs z-30">
      <div>
        {/* Brand Header matching screenshot: MoES Government of India + Capacity Connect */}
        <div className="mb-6 px-2 flex items-center gap-3">
          {/* Emblem mark */}
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-50 via-sky-50 to-blue-100 border border-sky-200 flex items-center justify-center shrink-0 shadow-2xs">
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-slate-800" aria-label="Emblem of India">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="3.5" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="#d97706" strokeWidth="3" />
              <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M23 77 L77 23" stroke="#0284c7" strokeWidth="2" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight flex items-center gap-1.5">
              <span>Capacity Connect</span>
            </h1>
            <p className="text-xs text-sky-800 font-bold leading-tight mt-0.5">
              Ministry of Earth Sciences<br />
              <span className="text-slate-500 font-semibold">Government of India • IMD</span>
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchKeys.includes(activeNav);
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-sky-50/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Chat with Faculty & Anonymous Lounge trigger */}
          {onOpenChat && (
            <button
              type="button"
              onClick={onOpenChat}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold text-indigo-800 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/80 transition-all cursor-pointer shadow-2xs mt-2"
              title="Open Chat with Faculty, Anonymous Lounge & Feedback"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Faculty Chat</span>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-purple-200/80 text-purple-900 font-bold">
                Anonymous
              </span>
            </button>
          )}

          {/* Quick Return to Landing Portal */}
          {onLogoutToHomepage && (
            <button
              onClick={onLogoutToHomepage}
              className="w-full mt-3 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-700 hover:text-rose-900 hover:bg-rose-50 transition-all cursor-pointer border border-rose-200 bg-rose-50/60 shadow-2xs"
              title="Return to Institutional Homepage"
            >
              <LogOut className="w-4 h-4 text-rose-600" />
              <span>Institutional Homepage</span>
            </button>
          )}
        </nav>
      </div>

      {/* Hachiware Chiikawa Teacher Guide Section in Sidebar */}
      <div className="mt-6 pt-4 border-t border-slate-200/80 relative">
        {/* Speech Bubble */}
        <div className="relative bg-white border border-sky-200 rounded-2xl p-3 text-left shadow-2xs mb-2 text-slate-800">
          <p className="text-xs font-bold text-slate-800 leading-snug">
            <span className="font-extrabold text-sky-700">Yah! I'm Hachiware Sensei! 🐱</span><br />
            Let's master Doppler radar nowcasting together! Nanto ka nareー!
          </p>
          {/* Bubble tail pointing down */}
          <div className="absolute -bottom-1.5 left-10 w-3 h-3 bg-white border-b border-r border-sky-200 rotate-45" />
        </div>

        {/* Hachiware Teacher Guide Illustration */}
        <div className="relative w-full h-34 rounded-2xl overflow-hidden mb-3 bg-sky-50 flex items-center justify-center border border-sky-200 shadow-2xs group">
          <img
            src={hachiwareTeacherGuide}
            alt="Blue Hachiware Chiikawa Teacher Guide with glasses and pointer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Hachiware Action Links */}
        <div className="space-y-1 text-xs">
          <button
            onClick={() => {
              if (onStartTour) onStartTour();
              else onOpenGuide();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-sky-50 flex items-center gap-2 transition-all font-semibold cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Take interactive tour</span>
          </button>

          <button
            onClick={() => {
              if (onOpenFeatures) onOpenFeatures();
              else onOpenGuide();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-sky-50 flex items-center gap-2 transition-all font-semibold cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-blue-600" />
            <span>Explore features</span>
          </button>

          <button
            onClick={() => {
              if (onOpenHelp) onOpenHelp();
              else onOpenGuide();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-slate-700 hover:text-sky-900 hover:bg-sky-50 flex items-center gap-2 transition-all font-semibold cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Need assistance?</span>
          </button>
        </div>

        {/* Note at bottom */}
        <div className="mt-3 text-center">
          <p className="text-[11px] font-mono font-bold text-sky-800">
            Same Oceans Brighter Tomorrows ~ Hachiware
          </p>
        </div>
      </div>
    </aside>
  );
};
