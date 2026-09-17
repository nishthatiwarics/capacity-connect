import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Flame, 
  Trophy, 
  Heart, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  HelpCircle, 
  Layers, 
  Radio, 
  Award, 
  Star, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Shield,
  Lightbulb,
  Maximize2,
  ChevronRight,
  Share2
} from 'lucide-react';
import { 
  StudentProfileData, 
  StudentAnimalRank, 
  QuizGameMode, 
  FunQuizQuestion,
  QuizSessionStats 
} from '../types';
import { 
  FUN_QUIZ_QUESTIONS, 
  QUIZ_GAME_MODES, 
  QUIZ_MASCOTS, 
  QuizMascot 
} from '../data/funQuizData';
import { 
  ANIMAL_TIER_CONFIGS, 
  ORDERED_RANKS, 
  calculateStudentAnimalRank 
} from '../data/studentRankData';
import { QuizRadarVisualizer } from './QuizRadarVisualizer';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface StudentFunQuizArenaProps {
  studentProfile: StudentProfileData;
  onUpdateProfile: (updated: StudentProfileData) => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onClose?: () => void;
  initialMode?: QuizGameMode;
}

export const StudentFunQuizArena: React.FC<StudentFunQuizArenaProps> = ({
  studentProfile,
  onUpdateProfile,
  onAwardXP,
  onClose,
  initialMode = 'blitz'
}) => {
  const { isBright } = useTheme();

  // Game Phase: 'lobby' | 'playing' | 'gameover'
  const [gamePhase, setGamePhase] = useState<'lobby' | 'playing' | 'gameover'>('lobby');
  const [selectedMode, setSelectedMode] = useState<QuizGameMode>(initialMode);
  const [selectedMascot, setSelectedMascot] = useState<QuizMascot>(QUIZ_MASCOTS[0]);

  // Active Questions for current session
  const [sessionQuestions, setSessionQuestions] = useState<FunQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // In-Game States
  const [hearts, setHearts] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [comboStreak, setComboStreak] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  // Lifelines availability
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    hint: true,
    timeFreeze: true,
    doubleXp: true
  });
  const [activeDoubleXp, setActiveDoubleXp] = useState(false);
  const [eliminatedOptions, setEliminatedOptions] = useState<number[]>([]);
  const [isHintRevealed, setIsHintRevealed] = useState(false);

  // Answer interaction states
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Timer Ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = sessionQuestions[currentIndex];
  const activeModeConfig = QUIZ_GAME_MODES.find(m => m.id === selectedMode) || QUIZ_GAME_MODES[0];

  // Start a new Game Session
  const handleStartGame = (modeToPlay = selectedMode) => {
    sound.playMikuJingle();
    setSelectedMode(modeToPlay);

    // Shuffle questions or pick relevant ones
    let questionsPool = [...FUN_QUIZ_QUESTIONS];
    if (modeToPlay === 'radar_mystery') {
      questionsPool = questionsPool.filter(q => q.radarSignatureType);
    }
    // Fisher-Yates shuffle
    for (let i = questionsPool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questionsPool[i], questionsPool[j]] = [questionsPool[j], questionsPool[i]];
    }

    const pickedQuestions = questionsPool.slice(0, 6);
    setSessionQuestions(pickedQuestions);
    setCurrentIndex(0);

    const modeCfg = QUIZ_GAME_MODES.find(m => m.id === modeToPlay) || QUIZ_GAME_MODES[0];
    setHearts(modeCfg.initialHearts);
    setTimeLeft(modeCfg.timerSeconds);
    setComboStreak(0);
    setMaxCombo(0);
    setTotalScore(0);
    setTotalXpEarned(0);
    setCorrectCount(0);

    setLifelines({
      fiftyFifty: true,
      hint: true,
      timeFreeze: true,
      doubleXp: true
    });
    setActiveDoubleXp(false);
    setEliminatedOptions([]);
    setIsHintRevealed(false);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setFeedbackMessage(null);

    setGamePhase('playing');
  };

  // Timer countdown loop
  useEffect(() => {
    if (gamePhase !== 'playing' || isAnswerSubmitted || activeModeConfig.timerSeconds === 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time expired!
          handleTimeExpired();
          return 0;
        }
        if (prev <= 4) {
          sound.playBlip(900, 0.04);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gamePhase, isAnswerSubmitted, currentIndex, activeModeConfig.timerSeconds]);

  // Handle Time Expired
  const handleTimeExpired = () => {
    if (isAnswerSubmitted) return;
    sound.playAlert();
    setIsAnswerSubmitted(true);
    setComboStreak(0);
    setFeedbackMessage('Time expired! The storm moves fast in real-time nowcasting!');

    const newHearts = hearts - 1;
    setHearts(newHearts);

    if (newHearts <= 0 && selectedMode === 'survival') {
      setTimeout(() => {
        handleEndSession();
      }, 1800);
    }
  };

  // Handle Lifeline 1: 50/50
  const handleUseFiftyFifty = () => {
    if (!lifelines.fiftyFifty || isAnswerSubmitted || !currentQuestion) return;
    sound.playChime(1100);
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));

    const wrongIndexes = currentQuestion.options
      .map((_, i) => i)
      .filter(i => i !== currentQuestion.correctIndex);
    
    // Pick 2 random wrong indexes to eliminate
    const shuffledWrong = wrongIndexes.sort(() => 0.5 - Math.random());
    setEliminatedOptions(shuffledWrong.slice(0, 2));
  };

  // Handle Lifeline 2: Clue
  const handleUseClue = () => {
    if (!lifelines.hint || isAnswerSubmitted) return;
    sound.playChime(950);
    setLifelines(prev => ({ ...prev, hint: false }));
    setIsHintRevealed(true);
  };

  // Handle Lifeline 3: Freeze / Add Time
  const handleUseTimeFreeze = () => {
    if (!lifelines.timeFreeze || isAnswerSubmitted || activeModeConfig.timerSeconds === 0) return;
    sound.playChime(1300);
    setLifelines(prev => ({ ...prev, timeFreeze: false }));
    setTimeLeft(prev => prev + 10);
  };

  // Handle Lifeline 4: Double XP
  const handleUseDoubleXp = () => {
    if (!lifelines.doubleXp || isAnswerSubmitted) return;
    sound.playSuccess();
    setLifelines(prev => ({ ...prev, doubleXp: false }));
    setActiveDoubleXp(true);
  };

  // Handle Option Select & Answer Submission
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted || eliminatedOptions.includes(idx)) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSelectedOption(idx);
    setIsAnswerSubmitted(true);

    const isCorrect = idx === currentQuestion.correctIndex;

    if (isCorrect) {
      sound.playSuccess();
      const newStreak = comboStreak + 1;
      setComboStreak(newStreak);
      if (newStreak > maxCombo) setMaxCombo(newStreak);

      // Multiplier calculation (1.0x, 1.2x, 1.5x, 2.0x based on streak and speed)
      let multiplier = 1.0;
      if (newStreak >= 4) multiplier = 2.0;
      else if (newStreak >= 3) multiplier = 1.6;
      else if (newStreak >= 2) multiplier = 1.3;

      if (activeDoubleXp) multiplier *= 2;

      const earnedXP = Math.round(currentQuestion.baseXP * multiplier * activeModeConfig.bonusMultiplier);
      const earnedScore = Math.round(100 * multiplier);

      setTotalScore(prev => prev + earnedScore);
      setTotalXpEarned(prev => prev + earnedXP);
      setCorrectCount(prev => prev + 1);

      if (newStreak >= 3) {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        setFeedbackMessage(`🔥 INCREDIBLE ${newStreak}X COMBO! +${earnedXP} XP! Superb meteorological instincts!`);
      } else {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.65 } });
        setFeedbackMessage(`✓ Correct! +${earnedXP} XP earned! Spot on, cadet!`);
      }
    } else {
      sound.playAlert();
      setComboStreak(0);
      setFeedbackMessage(`Incorrect. Review the Doppler radar physics explanation below.`);

      const newHearts = hearts - 1;
      setHearts(newHearts);

      if (newHearts <= 0 && selectedMode === 'survival') {
        setTimeout(() => {
          handleEndSession();
        }, 2200);
      }
    }
  };

  // Advance to Next Question
  const handleNextQuestion = () => {
    sound.playBlip(750);
    if (currentIndex + 1 >= sessionQuestions.length || (hearts <= 0 && selectedMode === 'survival')) {
      handleEndSession();
      return;
    }

    setCurrentIndex(prev => prev + 1);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setFeedbackMessage(null);
    setEliminatedOptions([]);
    setIsHintRevealed(false);
    setActiveDoubleXp(false);
    setTimeLeft(activeModeConfig.timerSeconds);
  };

  // End Session & Persist to Student Profile
  const handleEndSession = () => {
    sound.playSuccess();
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });

    // Update real student profile data!
    const totalQ = sessionQuestions.length || 1;
    const accuracy = Math.round((correctCount / totalQ) * 100);
    const newQuizzesDone = studentProfile.quizzesDone + 1;
    const newQuizStreak = studentProfile.quizStreakDays + 1;
    const newDaily = studentProfile.dailyStreak + (correctCount > 0 ? 1 : 0);

    // Rolling average score
    const newAvg = Math.min(100, Math.max(50, Math.round(
      ((studentProfile.quizAverageScore * studentProfile.quizzesDone) + accuracy) / newQuizzesDone
    )));

    // Re-evaluate animal tier rank
    const recalculatedRank = calculateStudentAnimalRank(
      studentProfile.lecturesWatched,
      newQuizzesDone,
      newAvg
    );

    const updatedProfile: StudentProfileData = {
      ...studentProfile,
      quizzesDone: newQuizzesDone,
      quizStreakDays: newQuizStreak,
      quizAverageScore: newAvg,
      dailyStreak: newDaily,
      xp: studentProfile.xp + totalXpEarned,
      currentAnimalRank: recalculatedRank,
      weeklyStreakMap: studentProfile.weeklyStreakMap.map((d, i) =>
        i === studentProfile.weeklyStreakMap.length - 1 ? { ...d, quized: true, active: true } : d
      )
    };

    onUpdateProfile(updatedProfile);
    if (onAwardXP && totalXpEarned > 0) {
      onAwardXP(totalXpEarned, `Mastered Weather Quiz Arena (${activeModeConfig.name})`);
    }

    setGamePhase('gameover');
  };

  return (
    <div className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
      isBright 
        ? 'bg-white border-slate-200 shadow-xl' 
        : 'bg-[#080e1c] border-slate-800 shadow-2xl'
    }`}>
      {/* ARENA TOP CONTROL STRIP */}
      <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060c18] flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-rose-500 text-white flex items-center justify-center font-black shadow-sm">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Weather Cadet Quiz Arena</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                FUN MODE ⚡
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Interactive meteorology battles, radar mystery scans, and forecaster rank promotions
            </p>
          </div>
        </div>

        {/* Mascot & Rank Pill in Header */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-base">{ANIMAL_TIER_CONFIGS[studentProfile.currentAnimalRank].animalEmoji}</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {studentProfile.currentAnimalRank}
            </span>
            <span className="font-mono text-amber-500 font-bold">
              {studentProfile.xp} XP
            </span>
          </div>

          {onClose && (
            <button
              onClick={() => {
                sound.playBlip(500);
                onClose();
              }}
              className="px-3 py-1 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-200/60 dark:bg-slate-800 transition-all"
            >
              Close Arena ✕
            </button>
          )}
        </div>
      </div>

      {/* PHASE 1: LOBBY & GAME MODE SELECTION */}
      {gamePhase === 'lobby' && (
        <div className="p-6 sm:p-8 space-y-6">
          {/* Welcome Banner with Mascot */}
          <div className="relative p-6 rounded-2xl bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white overflow-hidden shadow-lg">
            <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMascot.avatar}
                  alt={selectedMascot.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/40 shadow-xl"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{selectedMascot.emoji}</span>
                    <span className="text-xs font-mono uppercase tracking-wider font-bold text-cyan-200">
                      Faculty Guide & Cheerleader: {selectedMascot.name}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black mt-0.5">
                    "Ready to level up your forecaster rank, cadet?"
                  </h3>
                  <p className="text-xs text-white/80 italic mt-0.5">
                    {selectedMascot.catchphrase}
                  </p>
                </div>
              </div>

              {/* Mascot Selector */}
              <div className="flex items-center gap-1.5 bg-black/30 p-1.5 rounded-xl border border-white/20 backdrop-blur-md">
                <span className="text-[10px] font-mono text-white/70 px-2">Mentor:</span>
                {QUIZ_MASCOTS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      sound.playBlip(700);
                      setSelectedMascot(m);
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all ${
                      selectedMascot.id === m.id
                        ? 'bg-white text-slate-900 shadow-md scale-110'
                        : 'text-white/80 hover:bg-white/15'
                    }`}
                    title={m.name}
                  >
                    <span>{m.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4 Fun Game Modes Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${isBright ? 'text-slate-800' : 'text-slate-200'}`}>
                Select Game Arena Mode:
              </h3>
              <span className="text-xs font-mono text-slate-400">
                Earn XP • Boost Quiz Streak • Unlock Forecaster Badges
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUIZ_GAME_MODES.map((mode) => {
                const isSelected = selectedMode === mode.id;

                return (
                  <div
                    key={mode.id}
                    onClick={() => {
                      sound.playBlip(650);
                      setSelectedMode(mode.id);
                    }}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? isBright
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-md ring-2 ring-indigo-400'
                          : 'bg-[#0e1933] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                        : isBright
                          ? 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                          : 'bg-[#0d1628] hover:bg-[#111e38] border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                          }`}>
                            {mode.badge}
                          </span>
                          <span className="text-xs font-bold text-amber-500 font-mono">
                            {mode.bonusMultiplier}x Multiplier
                          </span>
                        </div>

                        <h4 className={`text-base font-black mt-1.5 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                          {mode.name}
                        </h4>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {mode.tagline}
                        </p>
                      </div>

                      <div className="text-right">
                        {mode.timerSeconds > 0 ? (
                          <span className="flex items-center gap-1 text-xs font-mono font-bold text-rose-500">
                            <Clock className="w-3.5 h-3.5" />
                            {mode.timerSeconds}s timer
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-emerald-500 font-bold">
                            Untimed Zen
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2">
                      {mode.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono text-slate-400">
                        {mode.initialHearts < 99 ? `${mode.initialHearts} Lives (❤️❤️❤️)` : 'Infinite Lives'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartGame(mode.id);
                        }}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-md hover:brightness-110'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-indigo-600 group-hover:text-white'
                        }`}
                      >
                        <span>Play Now</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => handleStartGame(selectedMode)}
              className="px-8 py-3.5 rounded-2xl text-sm font-black bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5"
            >
              <Zap className="w-5 h-5 fill-current animate-bounce" />
              <span>Launch {activeModeConfig.name}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* PHASE 2: PLAYING ACTIVE QUIZ */}
      {gamePhase === 'playing' && currentQuestion && (
        <div className="p-6 sm:p-8 space-y-6">
          {/* Game HUD Bar: Hearts, Timer, Combo Multiplier, XP */}
          <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
            isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0d162a] border-slate-800'
          }`}>
            {/* Lives / Hearts */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-slate-400 mr-1">LIVES:</span>
              {activeModeConfig.initialHearts < 99 ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    className={`w-5 h-5 transition-all ${
                      i < hearts
                        ? 'fill-rose-500 text-rose-500 scale-105 animate-pulse'
                        : 'text-slate-600 opacity-40'
                    }`}
                  />
                ))
              ) : (
                <span className="text-xs font-mono font-bold text-emerald-500">
                  ∞ UNLIMITED
                </span>
              )}
            </div>

            {/* Timer Countdown (if timed) */}
            {activeModeConfig.timerSeconds > 0 && (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono font-black text-sm border transition-all ${
                  timeLeft <= 4
                    ? 'bg-rose-500/20 text-rose-500 border-rose-500/40 animate-ping'
                    : 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                }`}>
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>
              </div>
            )}

            {/* Combo Streak Multiplier */}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-black font-mono border transition-all ${
                comboStreak >= 3
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg border-transparent animate-pulse'
                  : comboStreak >= 1
                    ? 'bg-amber-500/15 text-amber-500 border-amber-500/30'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border-transparent'
              }`}>
                <Flame className={`w-4 h-4 ${comboStreak >= 1 ? 'fill-current' : ''}`} />
                <span>COMBO {comboStreak}X</span>
              </div>
            </div>

            {/* Total XP in Session */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">SCORE:</span>
              <span className="text-base font-black font-mono text-cyan-500 dark:text-cyan-400">
                +{totalXpEarned} XP
              </span>
            </div>
          </div>

          {/* LIFELINES / POWER-UPS BAR */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-mono font-bold text-slate-400 text-[11px] uppercase">
              Tactical Power-Ups:
            </span>

            <div className="flex flex-wrap items-center gap-2">
              {/* 50:50 */}
              <button
                disabled={!lifelines.fiftyFifty || isAnswerSubmitted}
                onClick={handleUseFiftyFifty}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs border transition-all flex items-center gap-1.5 ${
                  lifelines.fiftyFifty && !isAnswerSubmitted
                    ? isBright
                      ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-300'
                      : 'bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border-indigo-500/40 shadow-xs'
                    : 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent'
                }`}
                title="Eliminate 2 incorrect options"
              >
                <Zap className="w-3 h-3" />
                <span>50:50 Laser</span>
              </button>

              {/* Hachiware Clue */}
              <button
                disabled={!lifelines.hint || isAnswerSubmitted}
                onClick={handleUseClue}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs border transition-all flex items-center gap-1.5 ${
                  lifelines.hint && !isAnswerSubmitted
                    ? isBright
                      ? 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-300'
                      : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/40 shadow-xs'
                    : 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent'
                }`}
                title="Get a helpful radar hint from Hachiware Sensei"
              >
                <Lightbulb className="w-3 h-3" />
                <span>Hachiware's Clue</span>
              </button>

              {/* +10s Time Freeze */}
              {activeModeConfig.timerSeconds > 0 && (
                <button
                  disabled={!lifelines.timeFreeze || isAnswerSubmitted}
                  onClick={handleUseTimeFreeze}
                  className={`px-3 py-1 rounded-lg font-mono font-bold text-xs border transition-all flex items-center gap-1.5 ${
                    lifelines.timeFreeze && !isAnswerSubmitted
                      ? isBright
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/40 shadow-xs'
                      : 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent'
                  }`}
                  title="Add 10 seconds to timer"
                >
                  <Clock className="w-3 h-3" />
                  <span>+10s Freeze</span>
                </button>
              )}

              {/* 2x XP Booster */}
              <button
                disabled={!lifelines.doubleXp || isAnswerSubmitted || activeDoubleXp}
                onClick={handleUseDoubleXp}
                className={`px-3 py-1 rounded-lg font-mono font-bold text-xs border transition-all flex items-center gap-1.5 ${
                  activeDoubleXp
                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-black animate-pulse'
                    : lifelines.doubleXp && !isAnswerSubmitted
                      ? isBright
                        ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
                        : 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border-rose-500/40 shadow-xs'
                      : 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-slate-800 text-slate-400 border-transparent'
                }`}
                title="Double question XP reward"
              >
                <Sparkles className="w-3 h-3" />
                <span>{activeDoubleXp ? '2X XP ACTIVE!' : '2x XP Surge'}</span>
              </button>
            </div>
          </div>

          {/* Hint Overlay (if triggered) */}
          {isHintRevealed && (
            <div className={`p-3.5 rounded-xl border text-xs animate-in fade-in-50 flex items-start gap-3 ${
              isBright ? 'bg-sky-50/70 border-sky-300' : 'bg-slate-900 border-slate-700'
            }`}>
              <img
                src="/src/assets/images/hachiware_teacher_guide_1789296571776.jpg"
                alt="Hachiware Sensei"
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-xl object-cover border-2 border-sky-400 shadow-2xs shrink-0 bg-white"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sky-950 dark:text-sky-300 font-mono text-[11px] uppercase">
                    Hachiware Sensei's Radar Clue:
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-600 text-white font-bold">
                    Sensei Hint
                  </span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 mt-1 leading-relaxed">
                  {currentQuestion.hint}
                </p>
              </div>
            </div>
          )}

          {/* MAIN QUESTION DISPLAY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left/Main Column: Question Text & Multiple Choice Options */}
            <div className={currentQuestion.radarSignatureType ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
              <div>
                <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-amber-500">
                  <span>QUESTION {currentIndex + 1} OF {sessionQuestions.length}</span>
                  <span>•</span>
                  <span>{currentQuestion.category}</span>
                  <span>•</span>
                  <span className="text-indigo-400">{currentQuestion.difficulty}</span>
                </div>

                <h3 className={`text-base sm:text-lg font-black mt-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  {currentQuestion.title}
                </h3>

                <p className={`text-sm sm:text-base font-medium mt-2 leading-relaxed ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
                  {currentQuestion.question}
                </p>
              </div>

              {/* Multiple Choice Options */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options.map((option, idx) => {
                  const isEliminated = eliminatedOptions.includes(idx);
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQuestion.correctIndex;

                  let optClass = isBright
                    ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800'
                    : 'bg-[#0d162a] hover:bg-[#13203c] border-slate-800 text-slate-200';

                  if (isEliminated) {
                    optClass = 'opacity-25 line-through cursor-not-allowed bg-slate-100 dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-800';
                  } else if (isAnswerSubmitted) {
                    if (isCorrect) {
                      optClass = isBright
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400'
                        : 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-bold ring-2 ring-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.3)]';
                    } else if (isSelected) {
                      optClass = isBright
                        ? 'bg-rose-100 border-rose-500 text-rose-950'
                        : 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted || isEliminated}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>

                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 animate-bounce" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Radar Visualizer (for signature questions) */}
            {currentQuestion.radarSignatureType && (
              <div className="lg:col-span-5 flex flex-col justify-center space-y-3">
                <QuizRadarVisualizer
                  signatureType={currentQuestion.radarSignatureType}
                  label={currentQuestion.radarSignatureLabel || 'Doppler Target Anomaly'}
                />
                <div className="text-center">
                  <span className="text-[11px] font-mono text-cyan-400">
                    🔍 Interactive Radar Scope • Click dBZ/Velocity above to toggle polarimetric mode
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* POST-ANSWER EXPLANATION & CHEERLEADER REACTION */}
          {isAnswerSubmitted && (
            <div className={`p-5 sm:p-6 rounded-2xl border animate-in slide-in-from-bottom-3 duration-300 space-y-4 ${
              isBright ? 'bg-indigo-50/50 border-indigo-200' : 'bg-[#0d1730] border-cyan-900/50 shadow-xl'
            }`}>
              {/* Cheerleader Dialogue Banner */}
              <div className="flex items-start gap-3.5">
                <img
                  src={selectedMascot.avatar}
                  alt={selectedMascot.name}
                  className="w-12 h-12 rounded-xl object-cover border-2 border-cyan-400 shadow-md shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400 uppercase">
                      {selectedMascot.name} Cheer:
                    </span>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {feedbackMessage}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-200 mt-1 italic">
                    "{currentQuestion.mikuCommentary}"
                  </p>
                </div>
              </div>

              {/* Scientific Meteorology Explanation */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <BookOpenIcon className="w-4 h-4 text-indigo-400" />
                  <span>Meteorological Physics Breakdown:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.funFact && (
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-600 dark:text-amber-300">
                    <span className="font-bold">🌟 Did You Know? </span>
                    {currentQuestion.funFact}
                  </div>
                )}
              </div>

              {/* Next Question / Finish Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <span className="text-xs font-mono text-slate-400">
                  {currentIndex + 1 < sessionQuestions.length ? `${sessionQuestions.length - (currentIndex + 1)} questions remaining` : 'Final Question!'}
                </span>

                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-sky-500 via-indigo-600 to-cyan-400 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>{currentIndex + 1 < sessionQuestions.length ? 'Next Question →' : 'See Forecaster Results 🏆'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* PHASE 3: GAME OVER / RESULTS PODIUM */}
      {gamePhase === 'gameover' && (
        <div className="p-6 sm:p-10 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 text-white flex items-center justify-center text-4xl shadow-2xl animate-bounce">
            🏆
          </div>

          <div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-cyan-400">
              Session Debriefing Complete
            </span>
            <h3 className={`text-2xl sm:text-3xl font-black mt-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Forecaster Cadet Performance Report
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Outstanding work on the radar screens! Your Doppler reflexes and synoptic answers have been calibrated.
            </p>
          </div>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d162a] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">TOTAL XP</span>
              <span className="text-2xl font-black font-mono text-amber-500">+{totalXpEarned}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d162a] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">ACCURACY</span>
              <span className="text-2xl font-black font-mono text-emerald-500">
                {Math.round((correctCount / (sessionQuestions.length || 1)) * 100)}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d162a] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">MAX COMBO</span>
              <span className="text-2xl font-black font-mono text-rose-500">{maxCombo}x 🔥</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0d162a] border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">CURRENT RANK</span>
              <span className="text-lg font-black text-cyan-400 flex items-center justify-center gap-1">
                <span>{ANIMAL_TIER_CONFIGS[studentProfile.currentAnimalRank].animalEmoji}</span>
                <span className="text-xs truncate">{studentProfile.currentAnimalRank}</span>
              </span>
            </div>
          </div>

          {/* Cheering Mascot Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/30 max-w-lg mx-auto flex items-center gap-4 text-left">
            <img
              src={selectedMascot.avatar}
              alt={selectedMascot.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-400 shrink-0"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-indigo-400">
                <span>{selectedMascot.name} Commendation</span>
                <span>⭐</span>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 mt-0.5">
                "Super proud of your storm-spotting skills today! Your daily study streak is now {studentProfile.dailyStreak} days strong!"
              </p>
            </div>
          </div>

          {/* Cadet Quiz Feedback Card */}
          <div className="max-w-lg mx-auto p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Trainee Feedback for Faculty on this Quiz
                </h4>
              </div>
              <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                +20 XP Reward
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              How did the questions feel? Were the Doppler radar PPI scans clear? Help IMD instructors calibrate assessment difficulty.
            </p>

            <div className="flex flex-wrap gap-1.5">
              {[
                'Realistic Radar Echoes',
                'Great Physics Breakdown',
                'Timer Felt Rushed',
                'Challenging Couplet'
              ].map(tag => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-lg text-[10px] font-mono bg-white/80 dark:bg-slate-900/80 border border-amber-300 dark:border-amber-800/60 text-slate-700 dark:text-slate-300"
                >
                  ✓ {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Write specific suggestions or question feedback..."
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-amber-300 dark:border-amber-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    sound.playSuccess();
                    if (onAwardXP) onAwardXP(20, 'Provided Quiz Assessment Feedback to Faculty');
                    e.currentTarget.value = '';
                    alert("Thank you! Your feedback on this quiz session has been dispatched to IMD trainers.");
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  if (input && input.value.trim()) {
                    sound.playSuccess();
                    if (onAwardXP) onAwardXP(20, 'Provided Quiz Assessment Feedback to Faculty');
                    input.value = '';
                    alert("Thank you! Your feedback on this quiz session has been dispatched to IMD trainers.");
                  }
                }}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all cursor-pointer shadow-2xs shrink-0"
              >
                Send Feedback
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => handleStartGame(selectedMode)}
              className="px-6 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Another Round</span>
            </button>

            <button
              onClick={() => setGamePhase('lobby')}
              className="px-6 py-3 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              Back to Arena Lobby
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-all"
              >
                Return to Command Deck
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for icon
function BookOpenIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}
