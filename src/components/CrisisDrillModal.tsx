import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Radio, 
  Wind, 
  CloudLightning, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Award, 
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface CrisisDrillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDrillComplete: (score: number, drillName: string) => void;
}

interface Step {
  title: string;
  situation: string;
  telemetry: string;
  options: {
    text: string;
    score: number;
    feedback: string;
  }[];
}

export const CrisisDrillModal: React.FC<CrisisDrillModalProps> = ({
  isOpen,
  onClose,
  onDrillComplete,
}) => {
  const { isBright } = useTheme();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [stepSubmitted, setStepSubmitted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const drillSteps: Step[] = [
    {
      title: 'Phase 1: Doppler Radar Scan Configuration',
      situation: 'INSAT-3D detects dense central overcast (CDO) with eyewall convection 180 km southeast of Visakhapatnam. Radar echo top reaching 17 km.',
      telemetry: 'DWR S-Band Chennai & Visakhapatnam: Inbound radial velocity couplet 65 knots at 1.5 km altitude.',
      options: [
        {
          text: 'Initiate High-Resolution Sector Scan (VCP-12, 14 elevations every 4.5 minutes) focused on eyewall azimuth.',
          score: 35,
          feedback: 'Optimal Command: High-frequency VCP-12 captures mesocyclone eyewall contraction and rapid intensification.',
        },
        {
          text: 'Maintain standard surveillance mode (2 elevations every 15 minutes) to conserve transmitter tube life.',
          score: 10,
          feedback: 'Suboptimal: Standard surveillance misses rapid eyewall cycle changes and sudden pressure drops.',
        },
        {
          text: 'Shut down radar scanner until landfall to prevent coastal salt spray corrosion.',
          score: 0,
          feedback: 'Critical Failure: Radar shutdown blindfolds disaster management authorities.',
        },
      ],
    },
    {
      title: 'Phase 2: Synoptic Warning & Color Bulletin Escalation',
      situation: 'Central minimum pressure dropped to 972 hPa. Max sustained surface winds estimated at 120-130 km/h (Very Severe Cyclonic Storm).',
      telemetry: 'Barometric tendency: -4.2 hPa/3hr at coastal observatories. High astronomical spring tide pending in 6 hours.',
      options: [
        {
          text: 'Upgrade coastal districts immediately to RED WARNING (Cyclone Warning) with 2.5-3m storm surge inundation maps.',
          score: 35,
          feedback: 'Decisive Action: Red Bulletin mandates complete suspension of fishing and evacuation of low-lying coastal hamlets.',
        },
        {
          text: 'Issue Yellow Alert watch and wait for another satellite orbit pass before escalating.',
          score: 12,
          feedback: 'Too Passive: 6-hour delay prevents district collectors from completing shelter evacuations.',
        },
        {
          text: 'Send general weather summary without storm surge estimates.',
          score: 5,
          feedback: 'Deficient SOP: Storm surge causes 80% of coastal casualties if omitted from bulletins.',
        },
      ],
    },
    {
      title: 'Phase 3: Nowcasting Micro-Warning & Public Alert Dispatch',
      situation: 'Outer spiral rainbands producing localized cloud bursts (>65 mm/hr) and destructive squalls at port cities.',
      telemetry: 'Lightning Detection Network logs 4,200 CG flashes/hr in northern quadrant feeder band.',
      options: [
        {
          text: 'Push CAP-based emergency mobile siren alerts, alert state disaster response forces (NDRF), and close port operations.',
          score: 30,
          feedback: 'Flawless Coordination: Multi-channel CAP siren ensures zero loss of life.',
        },
        {
          text: 'Send email notification to port authorities during regular business hours.',
          score: 8,
          feedback: 'Too Slow: Email is inadequate for imminent landfall emergencies.',
        },
      ],
    },
  ];

  const currentStep = drillSteps[currentStepIndex];

  const handleSubmitStep = () => {
    if (selectedOptionIndex === null) return;
    setStepSubmitted(true);
    const chosen = currentStep.options[selectedOptionIndex];
    const newScore = accumulatedScore + chosen.score;
    setAccumulatedScore(newScore);

    if (chosen.score > 20) {
      sound.playSuccess();
    } else {
      sound.playAlert();
    }
  };

  const handleNextStep = () => {
    sound.playBlip(700);
    if (currentStepIndex + 1 < drillSteps.length) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOptionIndex(null);
      setStepSubmitted(false);
    } else {
      setIsFinished(true);
      onDrillComplete(accumulatedScore, 'Cyclone Marut Crisis Command Drill');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#00f5d4', '#ef4444'],
      });
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setSelectedOptionIndex(null);
    setAccumulatedScore(0);
    setStepSubmitted(false);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className={`border rounded-2xl max-w-2xl w-full p-6 space-y-5 animate-in fade-in zoom-in duration-200 ${
        isBright
          ? 'bg-white border-amber-400/80 shadow-2xl'
          : 'bg-[#0b1220] border-amber-500/50 shadow-[0_0_35px_rgba(245,158,11,0.2)]'
      }`}>
        {/* Header */}
        <div className={`flex items-start justify-between pb-3 border-b ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isBright ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'
            }`}>
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                  isBright ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-rose-950 text-rose-300 border-rose-700'
                }`}>
                  IMD SIMULATION EXERCISE
                </span>
                <span className={`text-xs font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  Step {currentStepIndex + 1} of {drillSteps.length}
                </span>
              </div>
              <h2 className={`text-base lg:text-lg font-bold mt-0.5 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Cyclone &apos;Marut&apos; Emergency Response Drill
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`text-lg p-1 ${isBright ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
          >
            ✕
          </button>
        </div>

        {!isFinished ? (
          <div className="space-y-4">
            {/* Situation Intel */}
            <div className={`p-4 border rounded-xl space-y-2 ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <h3 className={`text-sm font-bold flex items-center gap-2 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                <CloudLightning className={`w-4 h-4 ${isBright ? 'text-amber-600' : 'text-amber-400'}`} />
                <span>{currentStep.title}</span>
              </h3>
              <p className={`text-xs leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
                {currentStep.situation}
              </p>
              <div className={`p-2.5 border rounded-lg text-xs font-mono ${
                isBright 
                  ? 'bg-slate-100 border-slate-300 text-slate-900' 
                  : 'bg-slate-950/70 border-slate-800 text-slate-200'
              }`}>
                <span className={`block text-[10px] uppercase font-bold ${isBright ? 'text-black' : 'text-white'}`}>LIVE TELEMETRY:</span>
                {currentStep.telemetry}
              </div>
            </div>

            {/* Tactical Decision Options */}
            <div className="space-y-2">
              <span className={`text-[11px] font-mono uppercase font-bold block ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                SELECT COMMAND DECISION:
              </span>
              {currentStep.options.map((opt, idx) => {
                const isSelected = selectedOptionIndex === idx;
                let borderClass = isBright
                  ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                  : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:border-slate-700';

                if (stepSubmitted) {
                  if (opt.score > 20) {
                    borderClass = isBright
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'bg-emerald-950/50 border-emerald-600 text-emerald-200';
                  } else if (isSelected && opt.score <= 20) {
                    borderClass = isBright
                      ? 'bg-rose-50 border-rose-400 text-rose-800'
                      : 'bg-rose-950/50 border-rose-600 text-rose-200';
                  }
                } else if (isSelected) {
                  borderClass = isBright
                    ? 'bg-black text-white border-black font-semibold shadow-xs'
                    : 'bg-white text-black border-white font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={stepSubmitted}
                    onClick={() => {
                      sound.playBlip(600);
                      setSelectedOptionIndex(idx);
                    }}
                    className={`w-full p-3 text-left text-xs rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${borderClass}`}
                  >
                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono font-bold shrink-0 text-[10px] mt-0.5">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold leading-snug">{opt.text}</p>
                      {stepSubmitted && (
                        <p className={`text-[11px] mt-1.5 pt-1.5 border-t border-current/20 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                          {opt.feedback}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Actions Bar */}
            <div className={`flex items-center justify-between pt-3 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <span className={`text-xs font-mono font-bold ${isBright ? 'text-amber-700' : 'text-amber-400'}`}>
                SCORE: {accumulatedScore} / 100
              </span>

              {!stepSubmitted ? (
                <button
                  onClick={handleSubmitStep}
                  disabled={selectedOptionIndex === null}
                  className={`px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-md disabled:opacity-50 ${
                    isBright 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white' 
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950'
                  }`}
                >
                  Confirm Command Action
                </button>
              ) : (
                <button
                  onClick={handleNextStep}
                  className="px-4 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-xs bg-black hover:bg-neutral-800 text-white cursor-pointer"
                >
                  <span>Continue to Next Phase</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished State & Debriefing */
          <div className="text-center py-6 space-y-4">
            <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mx-auto shadow-md ${
              isBright 
                ? 'bg-amber-100 border-amber-300 text-amber-700' 
                : 'bg-gradient-to-br from-amber-500/20 to-emerald-500/20 border-amber-500/40 text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
            }`}>
              <Award className="w-8 h-8" />
            </div>

            <div>
              <h3 className={`text-xl font-extrabold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Drill Completed Successfully!
              </h3>
              <p className={`text-xs mt-1 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                Cyclone Emergency Warning Readiness Rating
              </p>
            </div>

            <div className={`p-4 border rounded-xl max-w-sm mx-auto space-y-2 ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <span className="text-4xl font-extrabold font-mono text-black dark:text-white">
                {accumulatedScore} / 100
              </span>
              <p className={`text-xs font-semibold ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>
                {accumulatedScore >= 80 ? 'Grade A: Chief Forecaster Operational Standard' : 'Grade B: Satisfactory Emergency Compliance'}
              </p>
              <p className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                +450 XP credited to National HQ & Participating RMC Trainees
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={handleReset}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 border ${
                  isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-transparent'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Rerun Drill</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 font-bold text-xs rounded-xl shadow-xs bg-black hover:bg-neutral-800 text-white cursor-pointer"
              >
                Return to Command Deck
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
