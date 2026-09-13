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
  Compass
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
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  onOpenGuide,
  onStartTour,
  onOpenHelp,
  onOpenFeatures
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
    <aside className="w-64 lg:w-72 shrink-0 bg-white/95 border-r border-slate-200/80 flex flex-col justify-between p-4 lg:p-5 min-h-screen sticky top-0 shadow-2xs">
      <div>
        {/* Brand Header matching screenshot: MoES Government of India + Capacity Connect */}
        <div className="mb-6 px-2 flex items-center gap-3">
          {/* Emblem mark */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/10 via-sky-500/10 to-blue-500/20 border border-slate-200 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 100 100" className="w-7 h-7 fill-slate-800" aria-label="Emblem of India">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#0369a1" strokeWidth="3" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="#ea580c" strokeWidth="2.5" />
              <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M23 77 L77 23" stroke="#0284c7" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
              Capacity Connect
            </h1>
            <p className="text-[10px] text-slate-500 font-medium leading-tight">
              Ministry of Earth Sciences<br />
              <span className="text-slate-400">Government of India</span>
            </p>
          </div>
        </div>

        {/* Navigation Links matching screenshot */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.matchKeys.includes(activeNav);
            return (
              <button
                key={item.id}
                onClick={() => onSelectNav(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ea580c]/10 text-[#ea580c] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#ea580c]' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hachiware Chiikawa Teacher Guide Section in Sidebar */}
      <div className="mt-6 pt-4 border-t border-slate-200/70 relative">
        {/* Speech Bubble */}
        <div className="relative bg-white border border-sky-200/90 rounded-2xl p-3 text-left shadow-xs mb-2 text-slate-800">
          <p className="text-xs font-semibold text-slate-800 leading-snug">
            <span className="font-extrabold text-sky-700">Yah! I'm Hachiware Sensei! 🐱</span><br />
            Let's do our best studying radar and ocean capacity! Nanto ka nareー!
          </p>
          {/* Bubble tail pointing down */}
          <div className="absolute -bottom-2 left-10 w-3 h-3 bg-white border-b border-r border-sky-200 rotate-45" />
        </div>

        {/* Hachiware Teacher Guide Illustration */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden mb-3 bg-gradient-to-b from-sky-100/50 via-blue-50/40 to-pink-50/40 flex items-center justify-center border border-sky-200/80 shadow-xs group">
          <img
            src={hachiwareTeacherGuide}
            alt="Blue Hachiware Chiikawa Teacher Guide with glasses and pointer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Hachiware Action Links matching screenshot */}
        <div className="space-y-1 text-xs">
          <button
            onClick={() => {
              if (onStartTour) onStartTour();
              else onOpenGuide();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 flex items-center gap-2 transition-all font-medium cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Take a quick tour</span>
          </button>

          <button
            onClick={() => {
              if (onOpenFeatures) onOpenFeatures();
              else onOpenGuide();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 flex items-center gap-2 transition-all font-medium cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600" />
            <span>Explore features</span>
          </button>

          <button
            onClick={() => {
              if (onOpenHelp) onOpenHelp();
              else onOpenGuide();
            }}
            className="w-full text-left px-2 py-1.5 rounded-lg text-slate-600 hover:text-sky-700 hover:bg-sky-50 flex items-center gap-2 transition-all font-medium cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-pink-600" />
            <span>Need help?</span>
          </button>
        </div>

        {/* Handwritten note at bottom */}
        <div className="mt-3 text-center">
          <p className="text-[11px] font-serif italic text-slate-400">
            Same Oceans Brighter Tomorrows ~ Hachiware
          </p>
        </div>
      </div>
    </aside>
  );
};
