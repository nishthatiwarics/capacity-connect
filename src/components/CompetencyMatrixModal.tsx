import React from 'react';
import { 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Radio, 
  Satellite, 
  Cpu, 
  CloudRain, 
  Zap, 
  Award,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { Trainee, StudentProfileData } from '../types';
import { ANIMAL_TIER_CONFIGS } from '../data/studentRankData';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';

interface CompetencyMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: Trainee;
  studentProfile: StudentProfileData;
  onNavigateToTab?: (tab: string) => void;
}

export const CompetencyMatrixModal: React.FC<CompetencyMatrixModalProps> = ({
  isOpen,
  onClose,
  trainee,
  studentProfile,
  onNavigateToTab,
}) => {
  const { isBright } = useTheme();

  if (!isOpen) return null;

  const currentTier = ANIMAL_TIER_CONFIGS[studentProfile.currentAnimalRank];

  const competencyDomains = [
    {
      key: 'radarMeteorology',
      title: 'Doppler Radar Meteorology',
      subtitle: 'Velocity de-aliasing, PPI/RHI scans, dual-pol ZDR & KDP',
      current: trainee.competency.radarMeteorology,
      benchmark: 85,
      icon: Radio,
      color: 'text-black dark:text-white',
      bg: 'bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700',
      barColor: 'bg-black dark:bg-white',
      recommendedModule: 'Doppler S-Band & Dual-Polarization Operations (Course #101)'
    },
    {
      key: 'severeNowcasting',
      title: 'Severe Weather Nowcasting',
      subtitle: 'Bow echo detection, hook echo mesocyclones, microburst warning',
      current: trainee.competency.severeNowcasting,
      benchmark: 90,
      icon: Zap,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10 border-amber-500/20',
      barColor: 'bg-amber-500',
      recommendedModule: 'Nor\'wester & Squall Line Warning Protocol (SOP-04)'
    },
    {
      key: 'satelliteInterpretation',
      title: 'Satellite & IR Water Vapor Analysis',
      subtitle: 'INSAT-3D RGB composites, rapid scan imagery, cyclone Dvorak',
      current: trainee.competency.satelliteInterpretation,
      benchmark: 80,
      icon: Satellite,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10 border-blue-500/20',
      barColor: 'bg-blue-500',
      recommendedModule: 'INSAT-3DR Geostationary Water Vapor Interpretation'
    },
    {
      key: 'nwpModeling',
      title: 'NWP & AI Ensemble Post-Processing',
      subtitle: 'GFS, NCUM, WRF physics parameterization & PINN AI models',
      current: trainee.competency.nwpModeling,
      benchmark: 75,
      icon: Cpu,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10 border-purple-500/20',
      barColor: 'bg-purple-500',
      recommendedModule: 'Physics-Informed Neural Networks in Monsoon QPF'
    },
    {
      key: 'synopticAnalysis',
      title: 'Synoptic Chart & T-Phi Gram Analysis',
      subtitle: 'Monsoon trough positioning, CAPE/CIN tephigram stability',
      current: trainee.competency.synopticAnalysis,
      benchmark: 85,
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      barColor: 'bg-emerald-500',
      recommendedModule: 'Tropical Atmospheric Soundings & Inversion Layers'
    },
    {
      key: 'agroAdvisory',
      title: 'Agro-Meteorological Advisory',
      subtitle: 'District-level nowcast dissemination to farming communities',
      current: trainee.competency.agroAdvisory,
      benchmark: 70,
      icon: CloudRain,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10 border-rose-500/20',
      barColor: 'bg-rose-500',
      recommendedModule: 'Gramin Krishi Mausam Seva (GKMS) Dissemination'
    }
  ];

  const overallAvg = Math.round(
    competencyDomains.reduce((acc, curr) => acc + curr.current, 0) / competencyDomains.length
  );
  const benchmarkAvg = Math.round(
    competencyDomains.reduce((acc, curr) => acc + curr.benchmark, 0) / competencyDomains.length
  );
  const competencyGap = benchmarkAvg - overallAvg;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl p-6 sm:p-8 ${
        isBright 
          ? 'bg-white border-slate-200 text-slate-900' 
          : 'bg-[#091024]/95 border-cyan-500/40 text-white shadow-[0_0_40px_rgba(6,182,212,0.25)]'
      }`}>
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Framework Pillar 2: Competency Engine
              </span>
              <span className="text-xs font-mono text-black dark:text-white font-bold">
                Multi-Axis Skill Gap Analysis
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1">
              Organizational Competency Framework & Gap Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Evaluates current cadet readiness against official WMO-IMD Lead Forecaster accreditation standards.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        {/* Top Summary Banner: Trainee Level & Competency Rank */}
        <div className={`mt-6 p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
        }`}>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{currentTier.animalEmoji}</div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-extrabold">{studentProfile.name}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${currentTier.badgeBg}`}>
                  {currentTier.rank} (Tier {currentTier.levelNumber}/4)
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                {currentTier.title} • {studentProfile.designation} at {studentProfile.stationName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-center font-mono">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Cadet Score</span>
              <span className="text-2xl font-black text-black dark:text-white">{overallAvg}%</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Target Benchmark</span>
              <span className="text-2xl font-black text-emerald-500">{benchmarkAvg}%</span>
            </div>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Skill Gap</span>
              <span className={`text-2xl font-black ${competencyGap > 0 ? 'text-amber-500' : 'text-emerald-400'}`}>
                {competencyGap > 0 ? `-${competencyGap}%` : 'Optimal'}
              </span>
            </div>
          </div>
        </div>

        {/* 6 Competencies Breakdown */}
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase font-bold text-slate-400 tracking-wider">
              6 Core Meteorological Competencies vs Benchmark
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              Dark Bar = Cadet Level • Striped Marker = IMD Target
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competencyDomains.map((comp) => {
              const Icon = comp.icon;
              const hasGap = comp.current < comp.benchmark;
              const gapDelta = comp.benchmark - comp.current;

              return (
                <div
                  key={comp.key}
                  className={`p-4 rounded-2xl border transition-all ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0c142b] border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${comp.bg}`}>
                        <Icon className={`w-4 h-4 ${comp.color}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold leading-tight">{comp.title}</h4>
                        <p className="text-[10px] text-slate-400 leading-tight mt-0.5">{comp.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-right font-mono shrink-0">
                      <span className="text-sm font-bold">{comp.current}%</span>
                      <span className="text-[10px] text-slate-400 block">/ {comp.benchmark}% target</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar with Target Pin */}
                  <div className="relative w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                    <div
                      className={`h-full ${comp.barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${comp.current}%` }}
                    />
                    {/* Benchmark Pin Indicator */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-sm z-10"
                      style={{ left: `${comp.benchmark}%` }}
                      title={`Target Benchmark: ${comp.benchmark}%`}
                    />
                  </div>

                  {/* Recommendation notice if gap exists */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    {hasGap ? (
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium truncate">Gap: -{gapDelta}% • Recommends: {comp.recommendedModule}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                        <span>Meets Lead Forecaster Benchmark</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bottom Ribbon */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span>To advance from <strong>{currentTier.rank}</strong> to next tier:</span>
            <span className="text-black dark:text-white font-bold">Watch {Math.max(0, currentTier.minLectures - studentProfile.lecturesWatched)} more lectures & pass {Math.max(0, currentTier.minQuizzes - studentProfile.quizzesDone)} quizzes</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playBlip(750);
                onNavigateToTab?.('academy');
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all bg-black hover:bg-neutral-800 text-white shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Enroll in Recommended Courses</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
