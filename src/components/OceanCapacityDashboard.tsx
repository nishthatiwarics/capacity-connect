import React, { useState } from 'react';
import {
  Flame,
  Star,
  Award,
  BookOpen,
  Play,
  CheckCircle2,
  TrendingUp,
  Share2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Compass,
  Check,
  Trophy,
  Users,
  Clock,
  Layers,
  Search,
  ExternalLink,
  ShieldCheck,
  Waves,
  User
} from 'lucide-react';
import { Course, Station, Trainee } from '../types';
import { OceanQuoteCard } from './OceanQuoteCard';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import oceanHeroBanner from '../assets/images/ocean_hero_banner_1789233583380.jpg';

interface OceanCapacityDashboardProps {
  onStartCourse?: (courseId: string) => void;
  onOpenSkillTree?: () => void;
  onOpenQuizArena?: () => void;
  onOpenVideoPlayer?: (title: string, videoUrl: string) => void;
  onOpenProfile?: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
  userXP?: number;
  dailyStreak?: number;
  badgesCount?: number;
}

interface QuestItem {
  id: string;
  icon: 'lesson' | 'video' | 'quiz' | 'share';
  title: string;
  subtitle: string;
  progress: string;
  xpReward: number;
  completed: boolean;
}

interface RecommendedCourse {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  modulesCount: number;
  duration: string;
  thumbnail: string;
  accentColor: string;
  tagColor: string;
  isContinuing?: boolean;
}

const RECOMMENDED_COURSES: RecommendedCourse[] = [
  {
    id: 'ocean-sys-101',
    title: 'Introduction to Ocean Systems',
    level: 'Beginner',
    rating: 4.8,
    modulesCount: 6,
    duration: '2 hours',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=80',
    accentColor: 'from-emerald-500 to-teal-700',
    tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    isContinuing: true
  },
  {
    id: 'cyclone-early-warn',
    title: 'Tropical Cyclones and Early Warning',
    level: 'Intermediate',
    rating: 4.6,
    modulesCount: 8,
    duration: '3 hours',
    thumbnail: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=500&auto=format&fit=crop&q=80',
    accentColor: 'from-sky-500 to-indigo-700',
    tagColor: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'climate-indian-ocean',
    title: 'Climate Change in the Indian Ocean Region',
    level: 'Intermediate',
    rating: 4.7,
    modulesCount: 6,
    duration: '2.5 hours',
    thumbnail: 'https://images.unsplash.com/photo-1488188840666-e2308741a62f?w=500&auto=format&fit=crop&q=80',
    accentColor: 'from-cyan-500 to-blue-700',
    tagColor: 'bg-cyan-100 text-cyan-800 border-cyan-200'
  },
  {
    id: 'satellite-remote-sensing',
    title: 'Satellite Remote Sensing for Earth Observation',
    level: 'Advanced',
    rating: 4.9,
    modulesCount: 10,
    duration: '4 hours',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80',
    accentColor: 'from-blue-600 to-violet-800',
    tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  }
];

const SKILL_TREE_CATEGORIES = [
  'Oceanography',
  'Meteorology',
  'Climate Change',
  'Marine Ecosystems',
  'Geoinformatics',
  'Disaster Risk Reduction'
];

export const OceanCapacityDashboard: React.FC<OceanCapacityDashboardProps> = ({
  onStartCourse,
  onOpenSkillTree,
  onOpenQuizArena,
  onOpenVideoPlayer,
  onOpenProfile,
  onAwardXP,
  userXP = 2340,
  dailyStreak = 12,
  badgesCount = 8
}) => {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('Oceanography');
  const [leaderboardTab, setLeaderboardTab] = useState<'All Users' | 'This Month' | 'Friends'>('All Users');

  const [quests, setQuests] = useState<QuestItem[]>([
    {
      id: 'quest-lesson',
      icon: 'lesson',
      title: 'Complete a lesson',
      subtitle: 'Finish any lesson today',
      progress: '0/1',
      xpReward: 50,
      completed: false
    },
    {
      id: 'quest-video',
      icon: 'video',
      title: 'Watch a field story',
      subtitle: 'Watch 1 video from Ocean India Series',
      progress: '0/1',
      xpReward: 30,
      completed: false
    },
    {
      id: 'quest-quiz',
      icon: 'quiz',
      title: 'Attempt a quiz',
      subtitle: 'Score 80% or higher in Quiz Arena',
      progress: '0/1',
      xpReward: 40,
      completed: false
    },
    {
      id: 'quest-share',
      icon: 'share',
      title: 'Share what you learned',
      subtitle: 'Post a reflection or research finding',
      progress: '0/1',
      xpReward: 20,
      completed: false
    }
  ]);

  const handleToggleQuest = (questId: string) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextState = !q.completed;
          if (nextState) {
            sound.playSuccess();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.7 }
            });
            onAwardXP?.(q.xpReward, `Completed quest: ${q.title}`);
          } else {
            sound.playBlip(500);
          }
          return {
            ...q,
            completed: nextState,
            progress: nextState ? '1/1' : '0/1'
          };
        }
        return q;
      })
    );
  };

  const handleCourseAction = (course: RecommendedCourse) => {
    sound.playBlip(800);
    if (onStartCourse) {
      onStartCourse(course.id);
    } else if (onOpenVideoPlayer) {
      onOpenVideoPlayer(course.title, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    }
  };

  const LEADERBOARD_USERS = [
    {
      rank: 1,
      name: 'Ananya Rao',
      xp: '5,420 XP',
      avatar: '',
      badgeColor: 'bg-amber-400 text-amber-950 ring-2 ring-amber-300'
    },
    {
      rank: 2,
      name: 'Rohan Verma',
      xp: '4,890 XP',
      avatar: '',
      badgeColor: 'bg-slate-300 text-slate-900 ring-2 ring-slate-200'
    },
    {
      rank: 3,
      name: 'Meera Iyer',
      xp: '4,320 XP',
      avatar: '',
      badgeColor: 'bg-amber-700 text-amber-100 ring-2 ring-amber-600/50'
    },
    {
      rank: 4,
      name: 'Learner',
      xp: `${userXP.toLocaleString()} XP`,
      avatar: '',
      isCurrentUser: true,
      badgeColor: 'bg-sky-100 text-sky-800'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Quote Card (Prompt request: add the quote at the top!) */}
      <OceanQuoteCard variant="banner" />

      {/* Main Grid: 2 Columns matching screenshot */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* =========================================================================
            LEFT / MAIN COLUMN (8 cols on XL)
        ========================================================================= */}
        <div className="xl:col-span-8 space-y-6">

          {/* Ocean Hero Banner matching reference image */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0ea5e9] text-white p-6 sm:p-8 lg:p-10 shadow-lg border border-sky-400/40">
            {/* Background image overlay */}
            <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none">
              <img 
                src={oceanHeroBanner} 
                alt="MoES Ocean Science Banner" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Gradient wash overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0369a1]/95 via-[#0284c7]/75 to-transparent pointer-events-none" />

            <div className="relative z-10 max-w-xl">
              {/* Category eyebrow */}
              <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase font-bold text-sky-200 mb-3 bg-white/15 px-3 py-1 rounded-full border border-white/25 backdrop-blur-sm">
                <span>LEARN</span>
                <span>•</span>
                <span>CONTRIBUTE</span>
                <span>•</span>
                <span>PROTECT</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans drop-shadow-sm">
                Build a Safer,<br />
                <span className="text-sky-200">Brighter Tomorrow</span>
              </h1>

              <p className="mt-3 text-sm sm:text-base text-sky-100 leading-relaxed max-w-lg font-normal">
                Gain skills. Earn recognition. Be part of a resilient India through ocean, atmosphere and earth system science.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => {
                    sound.playSuccess();
                    onStartCourse?.('ocean-sys-101');
                  }}
                  className="px-6 py-3 rounded-2xl bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    sound.playBlip(700);
                    onOpenSkillTree?.();
                  }}
                  className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold text-sm backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  Explore Skill Tree
                </button>
              </div>
            </div>

            {/* Right side floating slogan badge */}
            <div className="hidden md:flex absolute right-6 bottom-6 flex-col items-end text-right">
              <span className="text-xs font-serif italic text-amber-200 drop-shadow-sm">
                Healthy Oceans
              </span>
              <span className="text-xs font-serif italic text-sky-100 drop-shadow-sm">
                Resilient Coasts
              </span>
              <span className="text-sm font-serif italic font-bold text-white drop-shadow-md">
                Stronger India
              </span>
            </div>
          </div>

          {/* 4 Metrics Stats Row matching screenshot */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Card 1: Level */}
            <div 
              onClick={onOpenProfile}
              className="p-4 rounded-2xl bg-white/95 border border-sky-100 hover:border-sky-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group text-slate-900"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
                  <Waves className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">Level 7</span>
              </div>
              <div className="font-extrabold text-base text-slate-900">Level 7 Cadet</div>
              <div className="text-xs text-slate-500 font-medium">660 XP to Level 8</div>
              {/* Progress bar */}
              <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500" style={{ width: '78%' }} />
              </div>
              <div className="mt-1 text-[11px] text-slate-500 font-mono font-semibold text-right">2,340 / 3,000 XP</div>
            </div>

            {/* Card 2: Streak */}
            <div className="p-4 rounded-2xl bg-white/95 border border-amber-100 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all text-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Active</span>
              </div>
              <div className="font-extrabold text-base text-slate-900">{dailyStreak} Day Streak</div>
              <div className="text-xs text-slate-500 font-medium mt-1">Keep it up! ☀️ High Momentum</div>
            </div>

            {/* Card 3: Badges */}
            <div className="p-4 rounded-2xl bg-white/95 border border-blue-100 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all text-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">Earned</span>
              </div>
              <div className="font-extrabold text-base text-slate-900">{badgesCount} Badges Earned</div>
              <div className="text-xs text-slate-500 font-medium mt-1">3 new this month</div>
            </div>

            {/* Card 4: Global Rank */}
            <div className="p-4 rounded-2xl bg-white/95 border border-emerald-100 hover:border-emerald-300 shadow-2xs hover:shadow-xs transition-all text-slate-900">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Ranked</span>
              </div>
              <div className="font-extrabold text-base text-slate-900">Top 15%</div>
              <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <span>↑ 12 places this week</span>
              </div>
            </div>
          </div>

          {/* Recommended for You Section */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  Recommended for You
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Based on your interests in Oceanography, Radar Systems and Climate
                </p>
              </div>
              <button 
                onClick={() => onOpenSkillTree?.()}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {RECOMMENDED_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="rounded-2xl bg-white/95 border border-slate-200/80 hover:border-sky-300 shadow-2xs hover:shadow-md transition-all flex flex-col overflow-hidden group text-slate-900"
                >
                  {/* Thumbnail with overlay badges */}
                  <div className="relative h-32 w-full overflow-hidden bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Level Badge */}
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md shadow-2xs ${course.tagColor}`}>
                        {course.level}
                      </span>
                    </div>

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white px-1.5 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-0.5">
                      <span>{course.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-sky-700 transition-colors">
                        {course.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-2">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.modulesCount} modules</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{course.duration}</span>
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3.5 pt-2.5 border-t border-slate-100">
                      <button
                        onClick={() => handleCourseAction(course)}
                        className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs ${
                          course.isContinuing
                            ? 'bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold'
                            : 'bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-900 border border-slate-200'
                        }`}
                      >
                        <span>{course.isContinuing ? 'Continue' : 'Start Course'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Your Skill Tree section */}
          <div className="rounded-2xl bg-white/95 border border-slate-200/80 p-5 shadow-2xs space-y-3 text-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Your Skill Tree
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Explore learning paths across ocean, atmosphere, solid earth and more.
                </p>
              </div>
              <button
                onClick={() => onOpenSkillTree?.()}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 cursor-pointer bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                <span>View Full Tree</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Skill categories pill chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {SKILL_TREE_CATEGORIES.map((cat) => {
                const isSelected = selectedSkillCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      sound.playBlip(650);
                      setSelectedSkillCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-slate-900 text-white font-bold shadow-xs'
                        : 'bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 font-medium'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* =========================================================================
            RIGHT COLUMN (4 cols on XL)
        ========================================================================= */}
        <div className="xl:col-span-4 space-y-6">

          {/* 1. The Quote Card right here matching screenshot */}
          <OceanQuoteCard variant="card" />

          {/* 2. Today's Quests Card */}
          <div className="rounded-2xl bg-white/95 border border-slate-200/80 p-5 shadow-2xs space-y-4 text-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Today's Quests
              </h3>
              <button 
                onClick={onOpenQuizArena}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                View All
              </button>
            </div>

            <div className="space-y-2.5">
              {quests.map((quest) => (
                <div
                  key={quest.id}
                  onClick={() => handleToggleQuest(quest.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    quest.completed
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                      : 'bg-slate-50/70 hover:bg-sky-50/60 border-slate-200/80 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      quest.completed ? 'bg-emerald-500 text-white font-bold' : 'bg-white border border-slate-200 text-slate-700'
                    }`}>
                      {quest.completed ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : quest.icon === 'lesson' ? (
                        <BookOpen className="w-4 h-4 text-sky-600" />
                      ) : quest.icon === 'video' ? (
                        <Play className="w-4 h-4 fill-sky-500 text-sky-500" />
                      ) : quest.icon === 'quiz' ? (
                        <Sparkles className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Share2 className="w-4 h-4 text-indigo-500" />
                      )}
                    </div>
                    <div>
                      <div className={`text-xs font-bold leading-tight ${quest.completed ? 'line-through text-slate-400 font-normal' : 'text-slate-900'}`}>
                        {quest.title}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium leading-snug">
                        {quest.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-[11px] font-mono font-bold text-slate-500">
                      {quest.progress}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-600">
                      +{quest.xpReward} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Leaderboard Card */}
          <div className="rounded-2xl bg-white/95 border border-slate-200/80 p-5 shadow-2xs space-y-3.5 text-slate-900">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900">
                Cadet Leaderboard
              </h3>
              <button 
                onClick={onOpenProfile}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer bg-sky-50 px-2.5 py-1 rounded-xl border border-sky-200 hover:bg-sky-100 transition-colors"
              >
                View All
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/70 text-xs font-semibold">
              {(['All Users', 'This Month', 'Friends'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    sound.playBlip(600);
                    setLeaderboardTab(tab);
                  }}
                  className={`flex-1 py-1 text-center rounded-lg transition-all ${
                    leaderboardTab === tab
                      ? 'bg-white text-slate-900 font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* User List */}
            <div className="space-y-2">
              {LEADERBOARD_USERS.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-2 rounded-xl transition-all border ${
                    user.isCurrentUser
                      ? 'bg-sky-50 border-sky-300 text-slate-900 font-bold'
                      : 'hover:bg-slate-50 border-transparent text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Rank Indicator */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${user.badgeColor}`}>
                      {user.rank}
                    </div>
                    {/* Initials badge instead of profile logo */}
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-[10px] text-sky-700">
                      {user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className={`text-xs ${user.isCurrentUser ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                      {user.name} {user.isCurrentUser && '★ (You)'}
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-600">
                    {user.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. MoES Ocean Science Slogan Art Card */}
          <div className="rounded-2xl bg-gradient-to-br from-sky-50 via-white to-blue-50/70 border border-sky-200/80 p-4 text-center relative overflow-hidden shadow-2xs text-slate-800">
            <div className="text-xs font-serif italic text-slate-800 font-bold leading-relaxed">
              "Vigyan se Surakshit Samudra,<br />Samruddh Bharat"
            </div>
            <div className="text-[10px] uppercase font-mono tracking-wider text-sky-800 font-bold mt-1">
              Ministry of Earth Sciences • Government of India
            </div>
            {/* Visual ocean wave icon */}
            <div className="mt-2 flex justify-center text-sky-500">
              <Waves className="w-8 h-4" />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
