import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Radio,
  GraduationCap,
  Users,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  Bot,
  Zap,
  Volume2,
  VolumeX,
  Compass,
  Award,
  Sun,
  Moon,
  Send,
  HelpCircle,
  Minimize2,
  Maximize2,
  BookOpen,
  Target,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import hachiwareTeacherGuide from '../assets/images/hachiware_teacher_guide_1789296571776.jpg';

interface MikuPetGuideProps {
  activeTab: string;
  onNavigateTab: (tab: string) => void;
  onOpenDrill: () => void;
  onAwardXP: (amount: number, reason: string) => void;
}

interface TourStep {
  tab: string;
  title: string;
  subtitle: string;
  description: string;
  targetHighlight: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface AssistantQA {
  q: string;
  a: string;
  category: string;
}

const PRESET_QUESTIONS: AssistantQA[] = [
  {
    q: 'What are the 3 Pillars of Capacity Connect?',
    a: 'Capacity Connect addresses institutional meteorological capacity building via: (1) Organizational Training (LMS courses, video masterclasses, cohorts), (2) Competency Development (6-axis skills matrix, 360° Doppler radar simulator, cadet quiz arena), and (3) Knowledge Sharing (institutional SOP repository, peer Q&A forum, faculty exchange).',
    category: 'Architecture'
  },
  {
    q: 'How does Doppler Radar detect cyclone eyes and mesocyclones?',
    a: 'Doppler radars emit S-band (2.8 GHz) radio pulses. When pulses bounce off hydrometeors, frequency shifts via the Doppler Effect. Cyclonic rotation produces a velocity dipole (inbound vs outbound velocities side-by-side) with hook echoes and a calm precipitation-free eye!',
    category: 'Radar Science'
  },
  {
    q: 'How does the Forecaster Competency Ladder progress?',
    a: 'Trainees advance through 4 objective tiers: Cadet Forecaster (Level 1) → Radar Specialist (Level 2) → Lead Forecaster (Level 3) → Chief Meteorologist (Level 4), verified by simulation scores, quiz benchmarks, and verified course credits.',
    category: 'Competency'
  },
  {
    q: 'How do regional stations recruit certified faculty?',
    a: 'In the Knowledge Sharing pillar, under Faculty Exchange, verified trainers upload credentials and resumes. IMD Headquarters and regional radar centers can review CVs and issue recruitment requisitions directly.',
    category: 'Recruitment'
  }
];

export const MikuPetGuide: React.FC<MikuPetGuideProps> = ({
  activeTab,
  onNavigateTab,
  onOpenDrill,
  onAwardXP,
}) => {
  const { isBright, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [activeGuideView, setActiveGuideView] = useState<'tour' | 'features' | 'oracle'>('tour');
  const [currentTourIndex, setCurrentTourIndex] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [oracleAnswer, setOracleAnswer] = useState<string | null>(null);
  const [statusState, setStatusState] = useState<'ready' | 'scanning' | 'boosted'>('ready');
  const [isMuted, setIsMuted] = useState(false);
  const [hasPromptedGreeting, setHasPromptedGreeting] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState<string>('Capacity Connect AI Advisor: How can I assist your meteorological training?');

  // Define Site Map Tour Steps
  const tourSteps: TourStep[] = [
    {
      tab: 'dashboard',
      title: '1. Executive Command & Capacity Overview',
      subtitle: 'Centralized Telemetry & Station Readiness',
      description: 'Monitor all 32 Doppler Radar Stations across India. Track institutional readiness metrics, active trainees on duty, station alert stages (Green/Yellow/Orange/Red), and export compliance audits.',
      targetHighlight: 'Command Deck Tab',
      actionLabel: 'Explore Command Deck',
      onAction: () => onNavigateTab('dashboard')
    },
    {
      tab: 'training',
      title: '2. Pillar 1: Organizational Training',
      subtitle: 'Structured Curricula & Free Masterclasses',
      description: 'Explore standardized meteorological learning pathways, interactive Doppler video masterclasses, personnel training cohorts, and verifiable completion certifications.',
      targetHighlight: 'Organizational Training',
      actionLabel: 'Open Training Academy',
      onAction: () => onNavigateTab('training')
    },
    {
      tab: 'competency',
      title: '3. Pillar 2: Competency Development',
      subtitle: 'Skills Framework, Radar Sim & Quiz Arena',
      description: 'Benchmark skills across 6 domains (Doppler Radar, Satellite, NWP, Nowcasting). Practice 360° PPI/RHI scans in the Doppler Radar Simulator Lab and compete in the Cadet Weather Quiz Arena.',
      targetHighlight: 'Competency Engine',
      actionLabel: 'Open Competency Lab',
      onAction: () => onNavigateTab('competency')
    },
    {
      tab: 'knowledge',
      title: '4. Pillar 3: Knowledge Sharing',
      subtitle: 'Institutional SOP Vault & Faculty Exchange',
      description: 'Access centralized field SOPs, cyclone case studies, verified peer Q&A forum, and the meteorological faculty recruitment directory.',
      targetHighlight: 'Knowledge Sharing Hub',
      actionLabel: 'Open Knowledge Hub',
      onAction: () => onNavigateTab('knowledge')
    },
    {
      tab: 'my-learning',
      title: '5. Trainee Portal & Competency Ladder',
      subtitle: 'Individual Development Plan (IDP)',
      description: 'Track personal rank promotions (Cadet Forecaster to Chief Meteorologist), daily study streaks, XP progression, and earned diplomas.',
      targetHighlight: 'My Learning Tab',
      actionLabel: 'Inspect Trainee Profile',
      onAction: () => onNavigateTab('my-learning')
    },
    {
      tab: 'dashboard',
      title: '6. Severe Weather Crisis Emergency Drill',
      subtitle: 'Tactical Emergency Response Simulation',
      description: 'Test emergency warning protocols under severe tropical cyclone scenarios with time-sensitive telemetry decisions and damage mitigation.',
      targetHighlight: 'Crisis Drill Modal',
      actionLabel: 'Launch Emergency Drill',
      onAction: () => onOpenDrill()
    }
  ];

  // Greet user on mount with subtle blip
  useEffect(() => {
    if (!hasPromptedGreeting) {
      const timer = setTimeout(() => {
        setHasPromptedGreeting(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [hasPromptedGreeting]);

  // Current tour step
  const currentStep = tourSteps[currentTourIndex];

  // Sound toggling
  const handleToggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) {
      sound.playChime(900);
    }
  };

  // Run Radar Telemetry Diagnostics
  const handleRunRadarScan = () => {
    sound.playRadarPing();
    setIsScanning(true);
    setStatusState('scanning');
    setBubbleMessage('Scanning 32 S-Band Radar stations... All 12 elevation sweeps nominal (Dual-Pol ZDR calibrated)! 📡');
    setTimeout(() => {
      setIsScanning(false);
      setStatusState('ready');
    }, 2200);
  };

  // Trainee Commendation (+50 XP)
  const handleAwardCommendation = () => {
    sound.playSuccess();
    setStatusState('boosted');
    setBubbleMessage('Professional Development Commendation Granted! +50 XP Awarded! 🎖️');
    onAwardXP(50, 'Capacity Connect Advisor Commendation for Excellence');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { x: 0.9, y: 0.8 },
      colors: ['#0284c7', '#0d9488', '#10b981', '#f59e0b']
    });
    setTimeout(() => {
      setStatusState('ready');
    }, 2500);
  };

  // Step Navigation in Tour
  const handleNextTourStep = () => {
    sound.playBlip(750);
    const nextIdx = (currentTourIndex + 1) % tourSteps.length;
    setCurrentTourIndex(nextIdx);
    onNavigateTab(tourSteps[nextIdx].tab);
    setBubbleMessage(`Exploring: ${tourSteps[nextIdx].title}`);
  };

  const handlePrevTourStep = () => {
    sound.playBlip(650);
    const prevIdx = (currentTourIndex - 1 + tourSteps.length) % tourSteps.length;
    setCurrentTourIndex(prevIdx);
    onNavigateTab(tourSteps[prevIdx].tab);
    setBubbleMessage(`Exploring: ${tourSteps[prevIdx].title}`);
  };

  // Handle Oracle Question
  const handleAskQuestion = (qa: AssistantQA) => {
    sound.playChime(850);
    setCustomQuestion(qa.q);
    setOracleAnswer(qa.a);
    setBubbleMessage(qa.a.slice(0, 80) + '...');
  };

  const handleCustomQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    sound.playChime(900);
    const lower = customQuestion.toLowerCase();
    let response = "In Indian meteorological capacity development, multi-sensor synergy—combining S-Band Doppler radar, INSAT-3DR satellite soundings, and high-resolution NWP models—yields optimal disaster forecasting accuracy.";

    if (lower.includes('cyclone') || lower.includes('storm')) {
      response = "Cyclones in the North Indian Ocean are categorized from Depressions to Super Cyclonic Storms (>120 knots). Coastal Doppler radars at Kolkata, Paradip, Visakhapatnam, and Chennai track eye-wall replacement and wind shear.";
    } else if (lower.includes('radar') || lower.includes('dwr') || lower.includes('frequency')) {
      response = "IMD utilizes S-Band (2.7–2.9 GHz, 500 km range) for tropical squall penetration, alongside C-Band and X-Band radars for urban high-resolution flash flood tracking.";
    } else if (lower.includes('pillar') || lower.includes('capacity') || lower.includes('sih')) {
      response = "Capacity Connect is built on 3 foundational pillars: (1) Organizational Training, (2) Competency Development, and (3) Institutional Knowledge Sharing, centralized under a single web platform.";
    } else if (lower.includes('certificate') || lower.includes('diploma') || lower.includes('exam')) {
      response = "To earn credentials, complete course modules in the Organizational Training pillar, complete the final assessment quiz, and issue your verified digital certificate.";
    }

    setOracleAnswer(response);
    setBubbleMessage(response.slice(0, 85) + '...');
  };

  return (
    <>
      {/* Floating Advisor Widget Button (Always Visible in bottom right) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
        {/* Floating Speech Bubble preview when closed */}
        {!isOpen && (
          <div
            onClick={() => {
              sound.playBlip(750);
              setIsOpen(true);
            }}
            className={`group max-w-[280px] px-3 py-2 rounded-2xl border text-xs shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 flex items-center gap-2.5 ${
              isBright
                ? 'bg-white border-slate-300 text-slate-800 shadow-slate-900/10 hover:border-black'
                : 'bg-slate-900 border-slate-700 text-slate-100 shadow-black/40 hover:border-white'
            }`}
          >
            <img
              src={hachiwareTeacherGuide}
              alt="Hachiware Chiikawa Teacher"
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-xl object-cover shrink-0 border border-sky-300 dark:border-sky-600 shadow-2xs"
            />
            <div className="truncate">
              <p className="font-bold text-[11px] text-black dark:text-white flex items-center gap-1.5">
                <span>Hachiware • AI Guide</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </p>
              <p className={`text-[10px] truncate ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                {bubbleMessage}
              </p>
            </div>
          </div>
        )}

        {/* Mascot Avatar Orb / Trigger Button */}
        <div className="relative group">
          <button
            onClick={() => {
              sound.playBlip(isOpen ? 500 : 750);
              setIsOpen(!isOpen);
            }}
            title="Hachiware Teacher (Chiikawa) — Capacity Connect AI Guide"
            className="relative w-14 h-14 rounded-2xl p-0.5 transition-transform duration-300 active:scale-95 shadow-xl flex items-center justify-center overflow-hidden border-2 border-sky-400 dark:border-sky-300 bg-sky-50 dark:bg-slate-900 ring-4 ring-sky-100/80 dark:ring-sky-950"
          >
            <img
              src={hachiwareTeacherGuide}
              alt="Hachiware Teacher AI Guide"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-[14px] group-hover:scale-105 transition-transform duration-300"
            />

            {/* Status icon badge */}
            <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
          </button>

          {/* Guide Badge */}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-sky-600 dark:bg-sky-500 text-white font-mono text-[9px] font-bold rounded-full border border-white dark:border-black shadow-xs">
              SENSEI
            </span>
          )}
        </div>
      </div>

      {/* Expanded Interactive Capacity Advisor Dialog */}
      {isOpen && (
        <div className={`fixed bottom-24 right-4 sm:right-6 z-40 w-[92vw] sm:w-[440px] max-h-[85vh] flex flex-col rounded-2xl shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-6 duration-200 overflow-hidden backdrop-blur-md ${
          isBright ? 'bg-white border-slate-300 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-100'
        }`}>
          {/* Header Card */}
          <div className={`p-4 border-b flex items-center justify-between transition-colors ${
            isBright 
              ? 'bg-sky-50/70 border-slate-200' 
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border-2 border-sky-400 dark:border-sky-300 shrink-0 shadow-sm bg-white">
                <img
                  src={hachiwareTeacherGuide}
                  alt="Hachiware Teacher Guide"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-extrabold text-black dark:text-white flex items-center gap-1.5">
                    <span>Hachiware Sensei</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-sky-600 text-white font-bold">
                      Chiikawa Guide
                    </span>
                  </h3>
                </div>
                <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  Learning Guide & Capacity Operations Advisor
                </p>
              </div>
            </div>

            {/* Header controls: sound & close */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleToggleSound}
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isBright
                    ? 'hover:bg-slate-200/70 border-slate-200 text-slate-600'
                    : 'hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-black dark:text-white" />}
              </button>

              <button
                onClick={() => {
                  sound.playBlip(500);
                  setIsOpen(false);
                }}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isBright
                    ? 'hover:bg-slate-200/70 border-slate-200 text-slate-600'
                    : 'hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Diagnostics Action Bar */}
          <div className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono transition-colors ${
            isBright ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <span className="text-[10px] uppercase font-bold text-black dark:text-white flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>Status: {statusState.toUpperCase()}</span>
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleRunRadarScan}
                title="Scan Radar Station Network"
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all flex items-center gap-1 border ${
                  isBright
                    ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                }`}
              >
                <Radio className="w-3 h-3 text-emerald-500" />
                <span>Radar Scan</span>
              </button>

              <button
                onClick={handleAwardCommendation}
                title="Award Training Commendation (+50 XP)"
                className="px-2 py-0.5 rounded text-[11px] font-bold transition-all flex items-center gap-1 border bg-black hover:bg-neutral-800 text-white border-black"
              >
                <Zap className="w-3 h-3 text-amber-400" />
                <span>+50 XP</span>
              </button>
            </div>
          </div>

          {/* Navigation Mode Tabs: [Portal Tour] [Three Pillars] [Ask AI Assistant] */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => {
                sound.playBlip(700);
                setActiveGuideView('tour');
              }}
              className={`flex-1 py-2 text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeGuideView === 'tour'
                  ? 'border-b-2 border-black text-black dark:border-white dark:text-white font-bold bg-slate-100/80 dark:bg-slate-850'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Portal Tour</span>
            </button>

            <button
              onClick={() => {
                sound.playBlip(700);
                setActiveGuideView('features');
              }}
              className={`flex-1 py-2 text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeGuideView === 'features'
                  ? 'border-b-2 border-black text-black dark:border-white dark:text-white font-bold bg-slate-100/80 dark:bg-slate-850'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>3 Pillars</span>
            </button>

            <button
              onClick={() => {
                sound.playBlip(700);
                setActiveGuideView('oracle');
              }}
              className={`flex-1 py-2 text-center transition-colors flex items-center justify-center gap-1.5 ${
                activeGuideView === 'oracle'
                  ? 'border-b-2 border-black text-black dark:border-white dark:text-white font-bold bg-slate-100/80 dark:bg-slate-850'
                  : 'text-slate-500 hover:text-black dark:hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ask Hachiware</span>
            </button>
          </div>

          {/* Dynamic Content Body */}
          <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4 text-xs">
            {/* VIEW 1: PORTAL TOUR */}
            {activeGuideView === 'tour' && (
              <div className="space-y-3.5">
                {/* Hachiware Sensei Executive Briefing Banner */}
                <div className={`p-3 rounded-xl border flex items-center gap-3.5 ${
                  isBright ? 'bg-sky-50/70 border-sky-200' : 'bg-slate-900 border-slate-800'
                }`}>
                  <img
                    src={hachiwareTeacherGuide}
                    alt="Hachiware Sensei Briefing"
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 rounded-lg object-cover border border-sky-300 dark:border-slate-700 shadow-xs shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-600 text-white uppercase">
                        Study Briefing
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug font-medium">
                      "Yah! I'm Hachiware Sensei! Let's explore the capacity building pillars, Doppler radars, and ocean science together! Nanto ka nareー!"
                    </p>
                  </div>
                </div>

                {/* Tour Progress Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-black dark:text-white font-bold">
                      STEP {currentTourIndex + 1} OF {tourSteps.length}
                    </span>
                    <span className="text-slate-500">{currentStep.targetHighlight}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white rounded-full transition-all duration-300"
                      style={{ width: `${((currentTourIndex + 1) / tourSteps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Current Tour Card */}
                <div className={`p-3.5 rounded-xl border space-y-2 transition-colors ${
                  isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
                }`}>
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold text-slate-500 dark:text-slate-400 block">
                      {currentStep.subtitle}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                      {currentStep.title}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                    {currentStep.description}
                  </p>

                  {/* Interactive Jump Action */}
                  {currentStep.actionLabel && currentStep.onAction && (
                    <button
                      onClick={() => {
                        sound.playSuccess();
                        currentStep.onAction?.();
                      }}
                      className="w-full mt-2 py-2 px-3 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{currentStep.actionLabel}</span>
                    </button>
                  )}
                </div>

                {/* Tour Controller */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handlePrevTourStep}
                    className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-colors ${
                      isBright ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                    }`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {tourSteps.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          sound.playBlip(700);
                          setCurrentTourIndex(i);
                          onNavigateTab(tourSteps[i].tab);
                        }}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentTourIndex ? 'w-5 bg-black dark:bg-white' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNextTourStep}
                    className="px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-bold flex items-center gap-1 text-xs transition-colors shadow-xs"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2: THREE PILLARS OVERVIEW */}
            {activeGuideView === 'features' && (
              <div className="space-y-3">
                <div className={`p-3 rounded-xl border space-y-1.5 ${
                  isBright ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
                }`}>
                  <h4 className="font-bold text-xs flex items-center gap-1.5 text-black dark:text-white">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Capacity Building Framework: Strategic Pillars</span>
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    CAPACITY CONNECT integrates the three core pillars for comprehensive institutional workforce readiness across Indian meteorological commands:
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    {
                      icon: <GraduationCap className="w-4 h-4 text-black dark:text-white" />,
                      title: 'Pillar 1: Organizational Training',
                      desc: 'WMO-standardized courses, free Doppler video masterclasses, regional batch enrollment, and verifiable digital completion credentials.',
                      action: 'View Training',
                      onClick: () => onNavigateTab('training')
                    },
                    {
                      icon: <Target className="w-4 h-4 text-black dark:text-white" />,
                      title: 'Pillar 2: Competency Development',
                      desc: '6-domain skills matrix, 360° Doppler radar simulation lab, cadet quiz arena, and objective 4-tier forecaster competency progression.',
                      action: 'View Competency',
                      onClick: () => onNavigateTab('competency')
                    },
                    {
                      icon: <Share2 className="w-4 h-4 text-black dark:text-white" />,
                      title: 'Pillar 3: Knowledge Sharing',
                      desc: 'Centralized institutional repository with cyclone SOPs, peer discussion forum, and certified faculty recruitment platform.',
                      action: 'View Knowledge',
                      onClick: () => onNavigateTab('knowledge')
                    }
                  ].map((feat, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-2.5 transition-all ${
                        isBright ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                          {feat.icon}
                        </span>
                        <div>
                          <h5 className="font-bold text-xs text-slate-900 dark:text-white">{feat.title}</h5>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">{feat.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={feat.onClick}
                        className="shrink-0 px-2.5 py-1 bg-black hover:bg-neutral-800 text-white font-bold rounded-lg text-[10px] font-mono transition-all shadow-xs"
                      >
                        {feat.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* VIEW 3: AI METEOROLOGY ADVISOR (Q&A) */}
            {activeGuideView === 'oracle' && (
              <div className="space-y-3">
                {oracleAnswer && (
                  <div className={`p-3.5 rounded-xl border space-y-2 animate-in fade-in zoom-in-95 duration-150 ${
                    isBright ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}>
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <img
                          src={hachiwareTeacherGuide}
                          alt="Hachiware Sensei"
                          referrerPolicy="no-referrer"
                          className="w-5 h-5 rounded-full object-cover border border-sky-400"
                        />
                        <span className="text-black dark:text-white font-bold">HACHIWARE SENSEI GUIDANCE:</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">✓ VERIFIED</span>
                    </div>
                    <p className="text-xs leading-relaxed font-medium">
                      {oracleAnswer}
                    </p>
                  </div>
                )}

                {/* Suggested Questions */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                    FREQUENT ARCHITECTURAL & WEATHER QUESTIONS:
                  </span>
                  <div className="space-y-1">
                    {PRESET_QUESTIONS.map((qa, i) => (
                      <button
                        key={i}
                        onClick={() => handleAskQuestion(qa)}
                        className={`w-full text-left p-2 rounded-lg border text-[11px] transition-all flex items-center justify-between gap-2 group ${
                          isBright
                            ? 'bg-white hover:bg-slate-100 border-slate-200 hover:border-black text-slate-700 hover:text-black'
                            : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 hover:border-white text-slate-300 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{qa.q}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 shrink-0">
                          {qa.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Freeform Question Form */}
                <form onSubmit={handleCustomQuestionSubmit} className="pt-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ask Hachiware Sensei about training pillars, radars, or exams..."
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      className={`w-full pl-3 pr-8 py-2 rounded-xl text-xs border focus:outline-hidden transition-all ${
                        isBright
                          ? 'bg-white border-slate-300 text-slate-900 focus:border-black shadow-xs'
                          : 'bg-slate-900 border-slate-800 text-white focus:border-white'
                      }`}
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-black dark:text-white hover:opacity-80"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Footer Status Line */}
          <div className={`p-2.5 border-t text-center text-[10px] font-mono flex items-center justify-between transition-colors ${
            isBright ? 'bg-slate-100 border-slate-200 text-slate-500' : 'bg-slate-950 border-slate-800 text-slate-500'
          }`}>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Capacity AI Telemetry v3.0</span>
            </span>
            <span>CAPACITY CONNECT • MoES / IMD</span>
          </div>
        </div>
      )}
    </>
  );
};
