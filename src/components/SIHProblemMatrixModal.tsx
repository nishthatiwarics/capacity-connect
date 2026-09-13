import React from 'react';
import { 
  Trophy, 
  CheckCircle2, 
  BookOpen, 
  Layers, 
  Share2, 
  Cpu, 
  Radio, 
  Users, 
  ShieldCheck, 
  Flame, 
  Zap, 
  ExternalLink,
  Target,
  Award
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';

interface SIHProblemMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export const SIHProblemMatrixModal: React.FC<SIHProblemMatrixModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
}) => {
  const { isBright } = useTheme();

  if (!isOpen) return null;

  const pillars = [
    {
      id: 'training',
      title: 'Pillar 1: Organizational Training',
      subtitle: 'Centralized Learning Management System (LMS) & Cadet Pathways',
      icon: BookOpen,
      badge: 'LMS Core',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      description: 'Structured training management engineered for the India Meteorological Department (MoES) and scientific workforce.',
      features: [
        'End-to-End Course Academy with modular syllabus, progress tracking, and chapter quizzes',
        'Free Demo Video Lecture Studio where faculty can publish high-definition video masterclasses',
        'Multi-Role Training Pathways tailored for Induction Cadets, Radar Engineers, and Lead Forecasters',
        'Verifiable WMO & IMD Accreditation Certificates with cryptographic verification IDs'
      ],
      quickTab: 'academy',
      quickTabLabel: 'Explore Academy & Courses'
    },
    {
      id: 'competency',
      title: 'Pillar 2: Competency Development',
      subtitle: 'Multi-Axis Skills Matrix, Radar Simulator & Competency Ladder',
      icon: Target,
      badge: 'Competency Engine',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      description: 'Dynamic competency benchmarking with gamified progression to sustain long-term student engagement.',
      features: [
        '6 Core Competency Domains: Doppler Radar, Satellite, NWP/AI, Severe Nowcasting, Synoptic, Agro-Advisory',
        'Competency Tier Progression: Cadet Forecaster (Level 1) → Radar Specialist (Level 2) → Lead Forecaster (Level 3) → Chief Meteorologist (Level 4)',
        'Cadet Weather Quiz Arena: 15s Doppler Speed Blitz, Radar Mystery Canvas, and Survival Arcade',
        'Doppler Radar Simulator Lab: 360° PPI/RHI scans with real-time velocity de-aliasing diagnostics',
        'Crisis Emergency Warning Drills with time-critical scenario decision trees'
      ],
      quickTab: 'student-profile',
      quickTabLabel: 'View Student Competency Profile & Streaks'
    },
    {
      id: 'knowledge',
      title: 'Pillar 3: Knowledge Sharing',
      subtitle: 'Centralized Repository, Field SOP Vault & Faculty Exchange',
      icon: Share2,
      badge: 'Knowledge Hub',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      description: 'Preserving institutional memory and democratizing field insights across regional meteorological centres.',
      features: [
        'Operational Case Studies & Debriefs (e.g. Cyclone Biparjoy radar tracking, Himalayan cloudburst early warning)',
        'Official Standard Operating Procedures (SOPs) & hardware calibration manuals with instant text downloads',
        'Peer-to-Faculty Discussion Forum for real-time operational weather queries with verified expert endorsements',
        'Open Knowledge Contribution Pipeline allowing cadets and field scientists to submit post-event debriefs'
      ],
      quickTab: 'knowledge-hub',
      quickTabLabel: 'Open Centralized Knowledge Hub'
    },
    {
      id: 'platform',
      title: 'Pillar 4: Centralized Web-Based Platform',
      subtitle: 'Unified Command Architecture, Multi-Role RBAC & Digital Ecosystem',
      icon: Cpu,
      badge: 'Architecture',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      description: 'Mission-critical web application architecture uniting executive command, trainers, and cadets.',
      features: [
        'Multi-Role Access Control: Instant switching between Admin Command, Trainer Cockpit, and Trainee Desk',
        'Interactive Station Map & Network Readiness Monitor tracking nationwide Doppler coverage',
        'Faculty Recruitment & Resume Hub connecting universities and retired radar scientists',
        'Hatsune Miku AI Interactive Guide providing contextual guidance, auditory feedback, and morale boosts',
        'Maximalist Gradient Theme with dynamic atmospheric mesh, isobars, and Doppler antenna rings'
      ],
      quickTab: 'dashboard',
      quickTabLabel: 'View Command Dashboard'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 ${
        isBright 
          ? 'bg-white border-slate-200 text-slate-900' 
          : 'bg-[#091024]/95 border-cyan-500/40 text-white shadow-[0_0_40px_rgba(6,182,212,0.25)]'
      }`}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                Smart India Hackathon (SIH) Solution
              </span>
              <span className="text-xs font-mono text-cyan-500 font-bold">
                MoES / IMD Workforce Development
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              CAPACITY CONNECT: Problem Statement Mapping
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed max-w-2xl">
              &quot;A Digital Capacity Building and Learning Management Portal to support organizational training, 
              competency development, and knowledge sharing through a centralized web-based platform.&quot;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* 4 Pillars Matrix Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isBright
                    ? 'bg-slate-50/80 hover:bg-sky-50/40 border-slate-200 hover:border-sky-300 shadow-xs'
                    : 'bg-[#0c142b] hover:bg-[#0f1a38] border-slate-800 hover:border-cyan-500/40 shadow-lg'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl border ${
                        isBright ? 'bg-sky-100 text-sky-700 border-sky-200' : 'bg-cyan-950/80 text-cyan-400 border-cyan-700/50'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-tight">{pillar.title}</h3>
                        <p className="text-[10px] text-slate-400 font-mono">{pillar.subtitle}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mb-3 leading-relaxed">
                    {pillar.description}
                  </p>

                  <ul className="space-y-2 mb-4">
                    {pillar.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800/80">
                  <button
                    onClick={() => {
                      sound.playBlip(750);
                      onNavigateToTab?.(pillar.quickTab);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                      isBright
                        ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    }`}
                  >
                    <span>{pillar.quickTabLabel}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Forecaster Rank Progression System in Competency Development */}
        <div className={`mt-6 p-4 rounded-2xl border ${
          isBright ? 'bg-amber-50/70 border-amber-200 text-amber-950' : 'bg-amber-950/20 border-amber-600/30 text-amber-200'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔰 📡 🌪️ 💠</span>
              <div>
                <h4 className="text-xs font-black uppercase font-mono tracking-wide">
                  Gamified Student Competency Ladder & Streaks
                </h4>
                <p className="text-[11px] opacity-85">
                  Cadet Forecaster (Level 1) → Radar Specialist (Level 2) → Lead Forecaster (Level 3) → Chief Meteorologist (Level 4 Master Tier).
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onNavigateToTab?.('student-profile');
                onClose();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                isBright ? 'bg-amber-600 text-white hover:bg-amber-500' : 'bg-amber-500 text-slate-950 font-black hover:bg-amber-400'
              }`}
            >
              Inspect Student Profile
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Capacity Connect • SIH 2024 Project Specification (MoES / IMD)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Close SIH Overview
          </button>
        </div>
      </div>
    </div>
  );
};
