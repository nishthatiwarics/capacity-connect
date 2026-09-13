import React, { useState } from 'react';
import { 
  Flame, 
  Zap, 
  Video, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  Radio, 
  Calendar, 
  TrendingUp, 
  Clock, 
  ShieldAlert, 
  HelpCircle,
  Share2,
  RefreshCw,
  Trophy,
  Star,
  Check,
  Play,
  User
} from 'lucide-react';
import { StudentProfileData, StudentAnimalRank } from '../types';
import { 
  ANIMAL_TIER_CONFIGS, 
  ORDERED_RANKS, 
  calculateStudentAnimalRank, 
  calculateProgressToNextRank,
  QUICK_METEOROLOGY_QUIZZES 
} from '../data/studentRankData';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface StudentProfileCardProps {
  profile: StudentProfileData;
  onUpdateProfile: (updated: StudentProfileData) => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onOpenVideoLecture?: () => void;
  onOpenQuizArena?: () => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  profile,
  onUpdateProfile,
  onAwardXP,
  onOpenVideoLecture,
  onOpenQuizArena,
}) => {
  const { isBright } = useTheme();

  // Active subview or tab within the profile
  const [profileTab, setProfileTab] = useState<'overview' | 'tiers' | 'quiz' | 'history'>('overview');

  // Interactive Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScoreFeedback, setQuizScoreFeedback] = useState<string | null>(null);

  // Current animal tier config
  const currentTierConfig = ANIMAL_TIER_CONFIGS[profile.currentAnimalRank];

  // Progress to next tier
  const progressInfo = calculateProgressToNextRank(
    profile.currentAnimalRank,
    profile.lecturesWatched,
    profile.quizzesDone,
    profile.quizAverageScore
  );

  // Quick Action: Mark a lecture as watched (increments streak & updates rank)
  const handleWatchLectureAction = () => {
    sound.playSuccess();
    const newLectures = profile.lecturesWatched + 1;
    const newStreak = profile.lectureStreakDays + 1;
    const newXP = profile.xp + 150;
    const newDaily = profile.dailyStreak + 1;
    const recalculatedRank = calculateStudentAnimalRank(newLectures, profile.quizzesDone, profile.quizAverageScore);

    const updated: StudentProfileData = {
      ...profile,
      lecturesWatched: newLectures,
      lectureStreakDays: newStreak,
      dailyStreak: newDaily,
      xp: newXP,
      totalStudyHours: Math.round((profile.totalStudyHours + 0.75) * 10) / 10,
      currentAnimalRank: recalculatedRank,
      weeklyStreakMap: profile.weeklyStreakMap.map((d, i) => 
        i === profile.weeklyStreakMap.length - 1 ? { ...d, watched: true, active: true } : d
      )
    };

    onUpdateProfile(updated);
    if (onAwardXP) onAwardXP(150, `Watched Free Doppler Lecture #${newLectures}`);

    if (recalculatedRank !== profile.currentAnimalRank) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      sound.playSuccess();
    }
  };

  // Quick Action: Handle Quiz Submission
  const handleQuizAnswer = (optionIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optionIdx);
    setIsAnswerSubmitted(true);

    const quiz = QUICK_METEOROLOGY_QUIZZES[currentQuizIndex];
    const isCorrect = optionIdx === quiz.correctIndex;

    if (isCorrect) {
      sound.playSuccess();
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      setQuizScoreFeedback('Correct! +180 XP awarded. Quiz streak advanced!');
      
      const newQuizzes = profile.quizzesDone + 1;
      const newQuizStreak = profile.quizStreakDays + 1;
      // recalculate rolling average score
      const newAvg = Math.min(100, Math.round(((profile.quizAverageScore * profile.quizzesDone) + 100) / newQuizzes));
      const recalculatedRank = calculateStudentAnimalRank(profile.lecturesWatched, newQuizzes, newAvg);

      const updated: StudentProfileData = {
        ...profile,
        quizzesDone: newQuizzes,
        quizStreakDays: newQuizStreak,
        quizAverageScore: newAvg,
        xp: profile.xp + 180,
        currentAnimalRank: recalculatedRank,
        weeklyStreakMap: profile.weeklyStreakMap.map((d, i) => 
          i === profile.weeklyStreakMap.length - 1 ? { ...d, quized: true, active: true } : d
        )
      };

      onUpdateProfile(updated);
      if (onAwardXP) onAwardXP(180, `Mastered Doppler Quiz: ${quiz.title}`);
    } else {
      sound.playAlert();
      setQuizScoreFeedback(`Incorrect. Review the technical explanation below.`);
      const newQuizzes = profile.quizzesDone + 1;
      const newAvg = Math.max(50, Math.round(((profile.quizAverageScore * profile.quizzesDone) + 40) / newQuizzes));
      const updated: StudentProfileData = {
        ...profile,
        quizzesDone: newQuizzes,
        quizAverageScore: newAvg,
        xp: profile.xp + 40
      };
      onUpdateProfile(updated);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setQuizScoreFeedback(null);
    setCurrentQuizIndex((prev) => (prev + 1) % QUICK_METEOROLOGY_QUIZZES.length);
    sound.playBlip(700);
  };

  // Instant Tier Simulator / Switcher (allows user/reviewer to instantly test all 4 tiers!)
  const handleSimulateTier = (rank: StudentAnimalRank) => {
    sound.playSuccess();
    const config = ANIMAL_TIER_CONFIGS[rank];
    const updated: StudentProfileData = {
      ...profile,
      currentAnimalRank: rank,
      lecturesWatched: Math.max(profile.lecturesWatched, config.minLectures),
      quizzesDone: Math.max(profile.quizzesDone, config.minQuizzes),
      quizAverageScore: Math.max(profile.quizAverageScore, config.minAvgScore)
    };
    onUpdateProfile(updated);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 } });
  };

  return (
    <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
      isBright 
        ? 'bg-white border-slate-200 shadow-xl' 
        : 'bg-[#09101f] border-slate-800 shadow-2xl'
    }`}>
      {/* Dynamic Forecaster Competency Rank Banner Header */}
      <div className={`relative p-6 sm:p-8 bg-gradient-to-r ${currentTierConfig.bgGradient} text-white border-b ${currentTierConfig.borderClass} overflow-hidden`}>
        {/* Radar concentric sweep background effect */}
        <div className="absolute -right-16 -top-16 w-64 h-64 border border-white/10 rounded-full animate-ping pointer-events-none" style={{ animationDuration: '6s' }} />
        <div className="absolute -right-8 -top-8 w-48 h-48 border border-white/20 rounded-full pointer-events-none" />
        <div className="absolute right-10 top-10 w-24 h-24 border border-white/30 rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Student Info + Rank Insignia */}
          <div className="flex items-center gap-5">
            {/* Avatar with Competency Rank Badge overlay */}
            <div className="relative shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/15 border-4 border-white/30 shadow-2xl flex items-center justify-center text-white/90 backdrop-blur-md">
                  <User className="w-10 h-10 sm:w-12 sm:h-12" />
                </div>
              )}
              <div 
                className={`absolute -bottom-2 -right-2 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-lg border-2 border-white/40 bg-slate-900 ${currentTierConfig.glowClass}`}
                title={`Rank: ${currentTierConfig.title}`}
              >
                <span>{currentTierConfig.animalEmoji}</span>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border shadow-sm flex items-center gap-1.5 ${currentTierConfig.badgeBg}`}>
                  <span className="text-base">{currentTierConfig.animalEmoji}</span>
                  <span>{currentTierConfig.tierTag}: {currentTierConfig.rank}</span>
                </span>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/15 text-white/90 border border-white/20 backdrop-blur-sm">
                  {profile.badgeNumber}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1.5 flex items-center gap-2">
                <span>{profile.name}</span>
                <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
              </h2>

              <p className="text-xs sm:text-sm font-medium text-white/80 mt-0.5">
                {profile.designation} • {profile.stationName}
              </p>

              <p className="text-[11px] italic text-white/65 mt-1 max-w-xl">
                {profile.cadetMotto}
              </p>
            </div>
          </div>

          {/* Quick XP & Rank Badge Emblem on the right */}
          <div className="flex md:flex-col items-end justify-between md:justify-center w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/10 gap-3">
            <div className="text-right">
              <span className="text-[11px] font-mono uppercase tracking-widest text-white/70 block">
                Total Cadet XP
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-300 drop-shadow">
                {profile.xp.toLocaleString()} XP
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-white/80 bg-black/30 px-3 py-1 rounded-lg border border-white/15 backdrop-blur-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-300" />
                <span>{profile.totalStudyHours} hrs logged</span>
              </span>
            </div>
          </div>
        </div>

        {/* Current Forecaster Competency Rank Subtitle & Narrative */}
        <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-white/90 font-medium">
            <span className="text-lg">{currentTierConfig.animalEmoji}</span>
            <span className="font-bold">{currentTierConfig.title}:</span>
            <span className="text-white/80">{currentTierConfig.description}</span>
          </div>

          <div className="shrink-0 flex items-center gap-1.5 font-mono text-[11px] text-white/75 bg-black/20 px-2.5 py-1 rounded-md">
            <span>Level {currentTierConfig.levelNumber} of 4</span>
          </div>
        </div>
      </div>

      {/* STREAK & LEVEL PROGRESSION COCKPIT */}
      <div className={`p-6 sm:p-8 space-y-6 ${isBright ? 'bg-slate-50/50' : 'bg-[#091022]/80'}`}>
        {/* 3 Core Streak Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Streak 1: Lectures Watched */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isBright 
              ? 'bg-white border-slate-200 shadow-sm hover:border-indigo-300' 
              : 'bg-[#0e172e] border-slate-800 shadow-md hover:border-indigo-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center font-bold">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Lectures Watched
                  </span>
                  <span className={`text-2xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    {profile.lecturesWatched}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500 font-mono">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 animate-bounce" />
                  {profile.lectureStreakDays}d streak
                </span>
                <span className="text-[10px] text-slate-400 font-mono">consecutive</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Free Demo Lectures Library
              </span>
              <button
                onClick={handleWatchLectureAction}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  isBright
                    ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'
                    : 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30'
                }`}
                title="Advance lecture watch count & streak"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>+1 Watched</span>
              </button>
            </div>
          </div>

          {/* Streak 2: Quizzes Completed & Mastery */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isBright 
              ? 'bg-white border-slate-200 shadow-sm hover:border-emerald-300' 
              : 'bg-[#0e172e] border-slate-800 shadow-md hover:border-emerald-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Quizzes Done
                  </span>
                  <span className={`text-2xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    {profile.quizzesDone}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-500 font-mono">
                  <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                  {profile.quizStreakDays}d streak
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{profile.quizAverageScore}% avg grade</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Weather Nowcasting Tests
              </span>
              <button
                onClick={() => {
                  sound.playBlip(750);
                  setProfileTab('quiz');
                }}
                className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg transition-all ${
                  isBright
                    ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                    : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>Take Quiz</span>
              </button>
            </div>
          </div>

          {/* Streak 3: Daily Study & Operational Radar Check-In */}
          <div className={`p-5 rounded-2xl border transition-all ${
            isBright 
              ? 'bg-white border-slate-200 shadow-sm hover:border-amber-300' 
              : 'bg-[#0e172e] border-slate-800 shadow-md hover:border-amber-500/40'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold">
                  <Flame className="w-4 h-4 fill-amber-500" />
                </div>
                <div>
                  <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Daily Study Streak
                  </span>
                  <span className={`text-2xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    {profile.dailyStreak} Days
                  </span>
                </div>
              </div>

              <span className="px-2 py-1 text-[10px] font-mono font-bold rounded-lg bg-amber-500/15 text-amber-500 border border-amber-500/30">
                Active Streak 🔥
              </span>
            </div>

            {/* Weekly 7-Day Matrix */}
            <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-1">
              {profile.weeklyStreakMap.map((dayItem, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all ${
                    dayItem.active
                      ? isBright
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : isBright
                        ? 'bg-slate-100 text-slate-400'
                        : 'bg-slate-800 text-slate-500'
                  }`}>
                    {dayItem.active ? '✓' : '•'}
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{dayItem.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROGRESS TO NEXT TIER LEVEL */}
        <div className={`p-5 sm:p-6 rounded-2xl border ${
          isBright 
            ? 'bg-white border-slate-200 shadow-sm' 
            : 'bg-[#0e172e] border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className={`text-sm font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Competency Tier Progression: {currentTierConfig.title}
                  {progressInfo.nextRank ? ` to ${ANIMAL_TIER_CONFIGS[progressInfo.nextRank].title}` : ' (Maximum Rank Reached!)'}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Higher competency levels reflect mastery of lectures, high quiz scores, and consistent study streaks.
              </p>
            </div>

            {progressInfo.nextRank ? (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 text-black dark:bg-slate-800 dark:text-white border border-slate-300 dark:border-slate-700">
                {progressInfo.overallProgressPercent}% to {ANIMAL_TIER_CONFIGS[progressInfo.nextRank].rank}
              </span>
            ) : (
              <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-900 text-white border border-slate-700">
                🌟 Master Tier Reached
              </span>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
            <div 
              className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r from-sky-500 via-indigo-500 to-cyan-400`}
              style={{ width: `${progressInfo.overallProgressPercent}%` }}
            />
          </div>

          {/* Next Rank Criteria Breakdown */}
          {progressInfo.nextRank && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-slate-500 dark:text-slate-400">Lectures Needed:</span>
                <span className={`font-mono font-bold ${progressInfo.lecturesNeeded === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {progressInfo.lecturesNeeded === 0 ? 'Completed ✓' : `${progressInfo.lecturesNeeded} more`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-slate-500 dark:text-slate-400">Quizzes Needed:</span>
                <span className={`font-mono font-bold ${progressInfo.quizzesNeeded === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {progressInfo.quizzesNeeded === 0 ? 'Completed ✓' : `${progressInfo.quizzesNeeded} more`}
                </span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                <span className="text-slate-500 dark:text-slate-400">Target Score Avg:</span>
                <span className={`font-mono font-bold ${progressInfo.scoreNeeded === 0 ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {progressInfo.scoreNeeded === 0 ? 'Qualified ✓' : `Aim for ${ANIMAL_TIER_CONFIGS[progressInfo.nextRank].minAvgScore}%`}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* QUICK SIMULATOR / TIER SELECTOR */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isBright ? 'bg-indigo-50/50 border-indigo-100' : 'bg-[#0f1b33]/60 border-indigo-900/30'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Interactive Tier Preview:
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {ORDERED_RANKS.map((rank) => {
              const cfg = ANIMAL_TIER_CONFIGS[rank];
              const isSelected = profile.currentAnimalRank === rank;
              return (
                <button
                  key={rank}
                  onClick={() => handleSimulateTier(rank)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? isBright
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-indigo-500 text-white shadow-[0_0_12px_rgba(99,102,241,0.4)]'
                      : isBright
                        ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <span>{cfg.animalEmoji}</span>
                  <span>{cfg.rank}</span>
                  {isSelected && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* NAVIGATION TABS WITHIN PROFILE */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {[
            { id: 'overview', label: 'Student Overview', icon: BookOpen },
            { id: 'tiers', label: 'All 4 Competency Levels & Perks', icon: Trophy },
            { id: 'quiz', label: 'Interactive Weather Quiz', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = profileTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playBlip(650);
                  setProfileTab(tab.id as typeof profileTab);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-black text-white shadow-xs'
                    : isBright
                      ? 'text-slate-600 hover:text-black hover:bg-slate-100'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & CADET METRICS */}
        {profileTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Active Competency Perks */}
            <div className={`p-5 rounded-2xl border ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0e172e] border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{currentTierConfig.animalEmoji}</span>
                <h4 className={`text-sm font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  {currentTierConfig.title} • Unlocked Perks & Privileges
                </h4>
              </div>

              <div className="space-y-2.5">
                {currentTierConfig.perks.map((perk, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className={isBright ? 'text-slate-700' : 'text-slate-200'}>
                      {perk}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400">Current Tier Level:</span>
                <span className="font-mono font-bold text-black dark:text-white">
                  Level {currentTierConfig.levelNumber} / 4
                </span>
              </div>
            </div>

            {/* Right: Quick Launch & Actions */}
            <div className={`p-5 rounded-2xl border space-y-3 ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0e172e] border-slate-800'
            }`}>
              <h4 className={`text-sm font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Continuous Learning & Action Center
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep your streaks burning by watching daily demo masterclasses and scoring high in Doppler quizzes.
              </p>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    handleWatchLectureAction();
                    if (onOpenVideoLecture) onOpenVideoLecture();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                    isBright
                      ? 'bg-indigo-50/60 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                      : 'bg-indigo-950/40 hover:bg-indigo-900/40 border-indigo-800/60 text-indigo-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Video className="w-4 h-4 text-indigo-500" />
                    <span>Watch Free Doppler Masterclass (+150 XP)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-400" />
                </button>

                <button
                  onClick={() => {
                    sound.playBlip(700);
                    setProfileTab('quiz');
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                    isBright
                      ? 'bg-emerald-50/60 hover:bg-emerald-100 border-emerald-200 text-emerald-900'
                      : 'bg-emerald-950/40 hover:bg-emerald-900/40 border-emerald-800/60 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-emerald-500" />
                    <span>Solve Doppler Radar Quiz Challenge (+180 XP)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-400" />
                </button>

                {onOpenQuizArena && (
                  <button
                    onClick={() => {
                      sound.playMikuJingle();
                      onOpenQuizArena();
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-black transition-all ${
                      isBright
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md hover:brightness-105 border-transparent'
                        : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:brightness-110 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 fill-current animate-bounce text-amber-200" />
                      <span>Play Fun Quiz Arena (15s Blitz & Radar Mystery)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-black/30 font-mono">
                      ⚡ PLAY
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ALL 4 COMPETENCY LEVELS SHOWCASE */}
        {profileTab === 'tiers' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Student progress is calibrated across four distinguished meteorological competency levels:
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ORDERED_RANKS.map((rankKey) => {
                const cfg = ANIMAL_TIER_CONFIGS[rankKey];
                const isCurrent = profile.currentAnimalRank === rankKey;
                const isPassed = cfg.levelNumber <= currentTierConfig.levelNumber;

                return (
                  <div
                    key={rankKey}
                    className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                      isCurrent
                        ? isBright
                          ? 'bg-gradient-to-br from-indigo-50 to-sky-50 border-indigo-300 shadow-md ring-2 ring-indigo-400'
                          : 'bg-gradient-to-br from-[#121c38] to-[#0a1226] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : isBright
                          ? 'bg-white border-slate-200 opacity-90'
                          : 'bg-[#0d162a] border-slate-800 opacity-85'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-slate-900/20 border border-white/10">
                          {cfg.animalEmoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {cfg.title}
                            </h4>
                            <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${cfg.badgeBg}`}>
                              {cfg.tierTag}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {cfg.subtitle}
                          </p>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                          <Check className="w-3 h-3" /> ACTIVE RANK
                        </span>
                      ) : isPassed ? (
                        <span className="text-[10px] font-mono font-bold text-emerald-500">
                          UNLOCKED ✓
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-slate-400">
                          LOCKED 🔒
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3">
                      {cfg.description}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-400 block text-[9px]">MIN LECTURES</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{cfg.minLectures}+</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">MIN QUIZZES</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{cfg.minQuizzes}+</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">MIN AVG SCORE</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">{cfg.minAvgScore}%</span>
                      </div>
                    </div>

                    {/* Perks preview */}
                    <div className="mt-3 pt-2 space-y-1">
                      {cfg.perks.slice(0, 2).map((p, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <span className="text-sky-500">•</span>
                          <span className="truncate">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: INTERACTIVE WEATHER QUIZ */}
        {profileTab === 'quiz' && (
          <div className="space-y-4">
            {onOpenQuizArena && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-black/25 flex items-center justify-center text-2xl shadow-inner shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-white/20 text-white">
                        FEATURED GAME ARENA
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-200">
                        15s Blitz • Radar Detective • 4 Modes
                      </span>
                    </div>
                    <h4 className="text-base font-black mt-0.5">
                      Ready for the Fun Weather Cadet Quiz Arena?
                    </h4>
                    <p className="text-xs text-white/85">
                      Play with countdown timers, lifelines (50:50, Clues), combo streaks, and cheerleader mascots!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    sound.playMikuJingle();
                    onOpenQuizArena();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-white text-slate-900 hover:bg-slate-100 shadow-md hover:scale-105 active:scale-95 transition-all shrink-0 flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
                  <span>Enter Fun Quiz Arena</span>
                </button>
              </div>
            )}

            <div className={`p-6 rounded-2xl border space-y-5 ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d162a] border-slate-800'
            }`}>
              <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500 font-bold">
                  Question {currentQuizIndex + 1} of {QUICK_METEOROLOGY_QUIZZES.length} • {QUICK_METEOROLOGY_QUIZZES[currentQuizIndex].category}
                </span>
                <h4 className={`text-base font-bold mt-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  {QUICK_METEOROLOGY_QUIZZES[currentQuizIndex].title}
                </h4>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-amber-500/15 text-amber-500">
                +180 XP on Correct
              </span>
            </div>

            <p className={`text-sm font-medium ${isBright ? 'text-slate-800' : 'text-slate-100'}`}>
              {QUICK_METEOROLOGY_QUIZZES[currentQuizIndex].question}
            </p>

            {/* Multiple Choice Options */}
            <div className="space-y-2.5">
              {QUICK_METEOROLOGY_QUIZZES[currentQuizIndex].options.map((opt, i) => {
                const isSelected = selectedOption === i;
                const isCorrect = i === QUICK_METEOROLOGY_QUIZZES[currentQuizIndex].correctIndex;

                let optClass = isBright
                  ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                  : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-200';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    optClass = isBright
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold'
                      : 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold';
                  } else if (isSelected) {
                    optClass = isBright
                      ? 'bg-rose-100 border-rose-400 text-rose-900'
                      : 'bg-rose-950/60 border-rose-500 text-rose-200';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleQuizAnswer(i)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${optClass}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer Explanation & Next Question */}
            {isAnswerSubmitted && (
              <div className={`p-4 rounded-xl border animate-in fade-in-50 space-y-3 ${
                isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#091124] border-slate-800'
              }`}>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Technical Meteorological Explanation:
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  {QUICK_METEOROLOGY_QUIZZES[currentQuizIndex].explanation}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-emerald-500 font-mono">
                    {quizScoreFeedback}
                  </span>

                  <button
                    onClick={handleNextQuiz}
                    className="px-4 py-1.5 rounded-xl text-xs font-bold transition-all bg-black hover:bg-neutral-800 text-white cursor-pointer shadow-xs"
                  >
                    Next Question →
                  </button>
                </div>
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
