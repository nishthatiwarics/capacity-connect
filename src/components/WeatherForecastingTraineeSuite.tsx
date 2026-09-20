import React, { useState } from 'react';
import {
  CloudLightning,
  Activity,
  Compass,
  Wind,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  Award,
  Zap,
  TrendingUp,
  FileText,
  Sliders,
  Sparkles,
  ShieldAlert,
  Thermometer,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';
import { sound } from '../utils/audio';

export interface WeatherForecastingTraineeSuiteProps {
  onAwardXP?: (amount: number, reason: string) => void;
  onOpenRadarSim?: () => void;
  isEmbedded?: boolean;
}

interface NowcastScenario {
  id: string;
  title: string;
  station: string;
  region: string;
  radarEcho: {
    maxReflectivityDBZ: number;
    echoTopKm: number;
    radialVelocityMps: number;
    vorticity: string;
  };
  surfaceObs: {
    tempC: number;
    dewPointC: number;
    pressureHpa: number;
    pressureTendency3hrHpa: number;
    windDirection: string;
    windSpeedKnots: number;
  };
  satelliteSignature: string;
  correctAlertLevel: 'Yellow' | 'Orange' | 'Red';
  correctPhenomenon: string;
  correctWindGust: string;
  explanation: string;
}

const NOWCAST_SCENARIOS: NowcastScenario[] = [
  {
    id: 'delhi-squall',
    title: 'Delhi-NCR Approaching Bow Echo & Pre-Monsoon Squall',
    station: 'DWR Palam (New Delhi)',
    region: 'Northwest Plains',
    radarEcho: {
      maxReflectivityDBZ: 58,
      echoTopKm: 14.5,
      radialVelocityMps: -28,
      vorticity: 'Strong meso-cyclonic shear along gust front'
    },
    surfaceObs: {
      tempC: 38.5,
      dewPointC: 22.0,
      pressureHpa: 1002.4,
      pressureTendency3hrHpa: -3.8,
      windDirection: 'NW',
      windSpeedKnots: 34
    },
    satelliteSignature: 'INSAT-3DR TIR1 shows rapid convective expansion with cloud top temp dropping to -68°C',
    correctAlertLevel: 'Orange',
    correctPhenomenon: 'Severe Thunderstorm with Squall & Gusts',
    correctWindGust: '60-75 kmph',
    explanation: 'Reflectivity > 55 dBZ paired with echo tops above 14 km and steep pressure drop (-3.8 hPa) necessitates an IMD Orange Alert with squall warnings for airport operations and civic authorities.'
  },
  {
    id: 'kolkata-kalbaishakhi',
    title: 'Kolkata Severe Kalbaishakhi (Nor\'wester) with Hailstorm',
    station: 'DWR Kolkata (Subhasgram)',
    region: 'Gangetic West Bengal',
    radarEcho: {
      maxReflectivityDBZ: 64,
      echoTopKm: 16.2,
      radialVelocityMps: -35,
      vorticity: 'Bounded Weak Echo Region (BWER) & Three-Body Scatter Spike'
    },
    surfaceObs: {
      tempC: 34.0,
      dewPointC: 26.5,
      pressureHpa: 998.2,
      pressureTendency3hrHpa: -5.2,
      windDirection: 'NW',
      windSpeedKnots: 42
    },
    satelliteSignature: 'Overshooting tops on INSAT-3DR visible channel with cold-ring shaped convective anvil (-74°C)',
    correctAlertLevel: 'Red',
    correctPhenomenon: 'Severe Thunderstorm, Hail & Destructive Winds',
    correctWindGust: '75-90 kmph',
    explanation: 'Reflectivity over 60 dBZ combined with a BWER signature and echo top at 16.2 km indicates intense hail formation and microburst potential. Mandates an immediate IMD RED ALERT.'
  },
  {
    id: 'mumbai-coastal',
    title: 'Mumbai Konkan Monsoon Super-Cellular Rain Bands',
    station: 'DWR Mumbai (Veravali)',
    region: 'Konkan Coast',
    radarEcho: {
      maxReflectivityDBZ: 51,
      echoTopKm: 11.8,
      radialVelocityMps: -22,
      vorticity: 'Low-level maritime convergence line'
    },
    surfaceObs: {
      tempC: 28.5,
      dewPointC: 27.0,
      pressureHpa: 1004.1,
      pressureTendency3hrHpa: -1.4,
      windDirection: 'WSW',
      windSpeedKnots: 28
    },
    satelliteSignature: 'Continuous moisture inflow plumes originating from Arabian Sea feeding coastal orographic cloud bands',
    correctAlertLevel: 'Orange',
    correctPhenomenon: 'Heavy to Very Heavy Rain with Coastal Squall',
    correctWindGust: '45-60 kmph',
    explanation: 'High moisture saturation (dew point depression 1.5°C) and persistent 45-50 dBZ bands over Mumbai urban areas indicate localized flooding risks. Orange Alert matches IMD standard protocol.'
  },
  {
    id: 'chennai-shower',
    title: 'Chennai Coastal Evening Sea-Breeze Thunder-Cell',
    station: 'DWR Chennai (Port Trust)',
    region: 'Coastal Tamil Nadu',
    radarEcho: {
      maxReflectivityDBZ: 44,
      echoTopKm: 9.5,
      radialVelocityMps: -12,
      vorticity: 'Weak coastal sea-breeze front'
    },
    surfaceObs: {
      tempC: 32.2,
      dewPointC: 24.8,
      pressureHpa: 1008.6,
      pressureTendency3hrHpa: -0.8,
      windDirection: 'SE',
      windSpeedKnots: 16
    },
    satelliteSignature: 'Isolated cumulus congestus cells along the coastal convergence line',
    correctAlertLevel: 'Yellow',
    correctPhenomenon: 'Moderate Thundershower & Gusty Winds',
    correctWindGust: '30-45 kmph',
    explanation: 'Moderate reflectivity (< 45 dBZ) with warm cloud tops. Standard IMD Yellow Alert (Be Updated) for localized lightning and passing showers.'
  }
];

export const WeatherForecastingTraineeSuite: React.FC<WeatherForecastingTraineeSuiteProps> = ({
  onAwardXP,
  onOpenRadarSim,
  isEmbedded = false
}) => {
  const [activeTab, setActiveTab] = useState<'nowcast-sim' | 'tephigram-calc' | 'synoptic-decoder' | 'duty-checklist'>('nowcast-sim');

  // NOWCAST SIMULATOR STATE
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const [traineeAlertLevel, setTraineeAlertLevel] = useState<'Green' | 'Yellow' | 'Orange' | 'Red'>('Yellow');
  const [traineePhenomenon, setTraineePhenomenon] = useState('Severe Thunderstorm with Squall & Gusts');
  const [traineeWindGust, setTraineeWindGust] = useState('60-75 kmph');
  const [traineeLeadTime, setTraineeLeadTime] = useState('3 Hours');
  const [traineeActionStatement, setTraineeActionStatement] = useState('Take shelter in sturdy structures. Avoid standing under tall trees or tin sheds.');
  const [evaluationResult, setEvaluationResult] = useState<{
    submitted: boolean;
    score: number;
    passed: boolean;
    feedback: string;
  } | null>(null);

  // TEPHIGRAM & STABILITY CALCULATOR STATE
  const [surfaceTemp, setSurfaceTemp] = useState<number>(36);
  const [surfaceDewPoint, setSurfaceDewPoint] = useState<number>(24);
  const [midTroposphereTemp500, setMidTroposphereTemp500] = useState<number>(-12);
  const [temp700hpa, setTemp700hpa] = useState<number>(9);

  // Calculations for Atmospheric Instability
  const tempDewDepression = surfaceTemp - surfaceDewPoint;
  const lclEstimateMeters = Math.round(125 * tempDewDepression);
  
  // CAPE estimation proxy formula
  const parcelSurplusTemp500 = (surfaceTemp - (surfaceTemp - surfaceDewPoint) * 0.2 - 28) - midTroposphereTemp500;
  const capeEstimated = Math.max(0, Math.round(parcelSurplusTemp500 * 240 + (surfaceDewPoint * 45)));
  
  // CIN estimate
  const cinEstimated = Math.max(10, Math.round(tempDewDepression * 14));
  
  // Lifted Index: approx T500_env - T500_parcel
  const liftedIndexEstimated = parseFloat((-parcelSurplusTemp500 * 0.85).toFixed(1));
  
  // K-Index formula approximation: (T850 - T500) + Td850 - (T700 - Td700)
  const kIndexEstimated = Math.round((surfaceTemp - 5 - midTroposphereTemp500) + (surfaceDewPoint - 4) - (temp700hpa - (surfaceDewPoint - 8)));

  // Stability Assessment
  let stormRiskLabel = 'Low / Isolated';
  let stormRiskColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  if (capeEstimated > 2800 || liftedIndexEstimated < -6) {
    stormRiskLabel = 'Extreme / Severe Hail & Squall';
    stormRiskColor = 'text-rose-700 bg-rose-50 border-rose-300';
  } else if (capeEstimated > 1600 || liftedIndexEstimated < -3) {
    stormRiskLabel = 'Moderate to High / Organized Thunderstorm';
    stormRiskColor = 'text-amber-700 bg-amber-50 border-amber-300';
  }

  // DUTY SHIFT CHECKLIST STATE
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    'synoptic-00utc': true,
    'dwr-scan': true,
    'insat-rapid': false,
    'nowcast-mausam': false,
    'metar-taf': false,
    'marine-osf': false,
    'ndma-dispatch': false,
  });

  const toggleTask = (id: string) => {
    sound.playBlip(700);
    setCheckedTasks((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const completedTasksCount = Object.values(checkedTasks).filter(Boolean).length;
  const totalTasksCount = Object.keys(checkedTasks).length;

  const currentScenario = NOWCAST_SCENARIOS[selectedScenarioIndex];

  // Submit Nowcast Evaluation
  const handleSubmitNowcast = () => {
    sound.playSuccess();
    let score = 0;
    let feedback = '';

    const alertLevelMatch = traineeAlertLevel === currentScenario.correctAlertLevel;
    const phenomMatch = traineePhenomenon === currentScenario.correctPhenomenon;
    const gustMatch = traineeWindGust === currentScenario.correctWindGust;

    if (alertLevelMatch) score += 50;
    if (phenomMatch) score += 30;
    if (gustMatch) score += 20;

    const passed = score >= 70;

    if (passed) {
      feedback = `Excellent analysis! You accurately identified the ${currentScenario.correctAlertLevel} Alert criteria for ${currentScenario.station}. ${currentScenario.explanation}`;
      onAwardXP?.(120, `Completed IMD Nowcast Exercise: ${currentScenario.title}`);
    } else {
      feedback = `Verification Discrepancy: Expected ${currentScenario.correctAlertLevel} Alert due to: ${currentScenario.explanation}. Review Doppler velocity and reflectivity thresholds.`;
    }

    setEvaluationResult({
      submitted: true,
      score,
      passed,
      feedback
    });
  };

  return (
    <div className={`space-y-6 text-slate-800 ${isEmbedded ? '' : 'p-4 sm:p-6 max-w-7xl mx-auto'}`}>
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-7 border border-sky-800/40 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-[11px] font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>IMD METEOROLOGICAL FORECASTER TRAINING SUITE</span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Weather Forecasting Trainee Operations Lab
            </h2>
            
            <p className="text-xs sm:text-sm text-sky-200/80 max-w-2xl leading-relaxed">
              Designed as per the Government of India standard weather ecosystem (Mausam, Damini, Meghdoot & NWFC). Train on live radar cases, thermodynamic soundings, and official synoptic bulletins.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md text-center min-w-[120px]">
              <div className="text-[10px] uppercase font-mono text-sky-300 font-bold">Duty Shift Progress</div>
              <div className="text-lg font-black text-white mt-0.5">{completedTasksCount}/{totalTasksCount} Handover</div>
              <div className="w-full bg-white/20 rounded-full h-1.5 mt-1.5 overflow-hidden">
                <div 
                  className="bg-emerald-400 h-full rounded-full transition-all"
                  style={{ width: `${(completedTasksCount / totalTasksCount) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('nowcast-sim');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'nowcast-sim'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Mausam 3-Hr Nowcast Drafter</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('tephigram-calc');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tephigram-calc'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Thermometer className="w-4 h-4 text-rose-500" />
          <span>Tephigram & Stability Indices (CAPE/CIN)</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('synoptic-decoder');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'synoptic-decoder'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Compass className="w-4 h-4 text-blue-500" />
          <span>Surface Synoptic Station Model</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('duty-checklist');
          }}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'duty-checklist'
              ? 'bg-white text-slate-900 shadow-xs font-black'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Operational Duty Checklist</span>
        </button>
      </div>

      {/* =========================================================================
          TAB 1: MAUSAM 3-HOUR NOWCAST DRAFTING & VERIFICATION SIMULATOR
      ========================================================================= */}
      {activeTab === 'nowcast-sim' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Case Selector & Real Observational Data (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Case Selector Chips */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 font-mono">
                Select Operational Training Scenario ({NOWCAST_SCENARIOS.length} Available):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {NOWCAST_SCENARIOS.map((scen, idx) => (
                  <button
                    key={scen.id}
                    onClick={() => {
                      sound.playBlip(600);
                      setSelectedScenarioIndex(idx);
                      setEvaluationResult(null);
                    }}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                      selectedScenarioIndex === idx
                        ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-500/20 shadow-2xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">{scen.title}</div>
                    <div className="text-[11px] text-sky-700 font-medium mt-0.5">{scen.station}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Radar & Observation Teletype Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900">{currentScenario.title}</h3>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    Target Station: <span className="font-bold text-slate-800">{currentScenario.station}</span> • Region: {currentScenario.region}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  DWR Scan: Live (10m Refresh)
                </span>
              </div>

              {/* Doppler Radar Echo Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Max Reflectivity</div>
                  <div className="text-base font-black text-rose-600 mt-0.5">{currentScenario.radarEcho.maxReflectivityDBZ} dBZ</div>
                  <div className="text-[9px] text-slate-400">High core precipitation</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Echo Top Height</div>
                  <div className="text-base font-black text-sky-700 mt-0.5">{currentScenario.radarEcho.echoTopKm} km</div>
                  <div className="text-[9px] text-slate-400">Deep convective chimney</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">Doppler Velocity</div>
                  <div className="text-base font-black text-indigo-700 mt-0.5">{currentScenario.radarEcho.radialVelocityMps} m/s</div>
                  <div className="text-[9px] text-slate-400">Inbound wind vector</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="text-[10px] font-mono text-slate-500 uppercase font-semibold">3-Hr Baro Drop</div>
                  <div className="text-base font-black text-amber-700 mt-0.5">{currentScenario.surfaceObs.pressureTendency3hrHpa} hPa</div>
                  <div className="text-[9px] text-slate-400">Vigorous cyclogenesis</div>
                </div>
              </div>

              {/* Teletype Observation Details */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs space-y-1.5 border border-slate-800">
                <div className="text-slate-400 text-[10px] flex items-center justify-between border-b border-slate-800 pb-1">
                  <span>METAR / SYNOP GROUND STATION OBSERVATION:</span>
                  <span>UTC + 05:30 IST</span>
                </div>
                <div>SURFACE TEMP: {currentScenario.surfaceObs.tempC}°C | DEW POINT: {currentScenario.surfaceObs.dewPointC}°C | QNH: {currentScenario.surfaceObs.pressureHpa} hPa</div>
                <div>SURFACE WIND: {currentScenario.surfaceObs.windDirection} @ {currentScenario.surfaceObs.windSpeedKnots} Knots (Peak Gusts recorded)</div>
                <div className="text-amber-300">VORTICITY PATTERN: {currentScenario.radarEcho.vorticity}</div>
                <div className="text-sky-300 text-[11px] pt-1 border-t border-slate-800/80">SATELLITE SIGNATURE: {currentScenario.satelliteSignature}</div>
              </div>
            </div>
          </div>

          {/* Right Column: Trainee Nowcast Drafting Form (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <h3 className="font-extrabold text-sm text-slate-900">Official Nowcast Issuance Form</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-500">NWFC Standard</span>
            </div>

            {/* 1. Alert Color Code Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                1. IMD 4-Color Warning Level:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Green', 'Yellow', 'Orange', 'Red'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      sound.playBlip(700);
                      setTraineeAlertLevel(lvl);
                    }}
                    className={`py-2 rounded-xl text-xs font-black uppercase transition-all cursor-pointer border ${
                      traineeAlertLevel === lvl
                        ? lvl === 'Red'
                          ? 'bg-rose-600 text-white border-rose-700 shadow-xs scale-[1.02]'
                          : lvl === 'Orange'
                          ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-xs scale-[1.02]'
                          : lvl === 'Yellow'
                          ? 'bg-yellow-400 text-slate-950 border-yellow-500 shadow-xs scale-[1.02]'
                          : 'bg-emerald-600 text-white border-emerald-700 shadow-xs scale-[1.02]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Forecasted Weather Phenomenon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                2. Weather Phenomenon & Hazard:
              </label>
              <select
                value={traineePhenomenon}
                onChange={(e) => setTraineePhenomenon(e.target.value)}
                className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="Severe Thunderstorm with Squall & Gusts">Severe Thunderstorm with Squall & Gusts</option>
                <option value="Severe Thunderstorm, Hail & Destructive Winds">Severe Thunderstorm, Hail & Destructive Winds</option>
                <option value="Heavy to Very Heavy Rain with Coastal Squall">Heavy to Very Heavy Rain with Coastal Squall</option>
                <option value="Moderate Thundershower & Gusty Winds">Moderate Thundershower & Gusty Winds</option>
                <option value="Light Rain / Passing Drizzle">Light Rain / Passing Drizzle</option>
              </select>
            </div>

            {/* 3. Wind Gust Prediction */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                3. Expected Surface Wind Gust Speed:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['30-45 kmph', '45-60 kmph', '60-75 kmph', '75-90 kmph'].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      sound.playBlip(700);
                      setTraineeWindGust(g);
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-left border transition-all cursor-pointer ${
                      traineeWindGust === g
                        ? 'bg-sky-50 border-sky-400 text-sky-900 font-extrabold shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Action Suggested & Impact Statement */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                4. Public Advisory / Action Statement:
              </label>
              <textarea
                value={traineeActionStatement}
                onChange={(e) => setTraineeActionStatement(e.target.value)}
                rows={2}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                placeholder="Draft official action statement for public and disaster management..."
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitNowcast}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit for Verification & IMD Evaluation</span>
            </button>

            {/* Evaluation Result Feedback */}
            {evaluationResult && (
              <div className={`p-4 rounded-2xl border animate-in fade-in duration-200 space-y-2 ${
                evaluationResult.passed
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {evaluationResult.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span className="font-black text-xs uppercase">
                      {evaluationResult.passed ? 'Verified: Target Standard Met' : 'Needs Calibration'}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs px-2 py-0.5 rounded-full bg-white/80 border">
                    Score: {evaluationResult.score}/100
                  </span>
                </div>
                
                <p className="text-xs leading-relaxed font-normal">
                  {evaluationResult.feedback}
                </p>

                {evaluationResult.passed && (
                  <div className="text-[11px] font-mono font-bold text-emerald-800 flex items-center gap-1.5 pt-1 border-t border-emerald-200/60">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>+120 XP Credited to your Met Cadet Profile</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 2: TEPHIGRAM & ATMOSPHERIC STABILITY CALCULATOR (CAPE / CIN / LI)
      ========================================================================= */}
      {activeTab === 'tephigram-calc' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Controls: Sounding Thermals (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-black text-sm text-slate-900">Radiosonde Sounding Parameters</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Adjust vertical temperature and moisture layers to calculate convective triggers.
              </p>
            </div>

            {/* Slider 1: Surface Temp */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Surface Temperature (T):</span>
                <span className="font-mono text-rose-600">{surfaceTemp}°C</span>
              </div>
              <input
                type="range"
                min={20}
                max={48}
                value={surfaceTemp}
                onChange={(e) => setSurfaceTemp(Number(e.target.value))}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            {/* Slider 2: Dew Point */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">Surface Dew Point (Td):</span>
                <span className="font-mono text-blue-600">{surfaceDewPoint}°C</span>
              </div>
              <input
                type="range"
                min={10}
                max={Math.min(30, surfaceTemp)}
                value={surfaceDewPoint}
                onChange={(e) => setSurfaceDewPoint(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="text-[10px] text-slate-400 font-mono">
                Dew point depression: {(surfaceTemp - surfaceDewPoint).toFixed(1)}°C
              </div>
            </div>

            {/* Slider 3: 500 hPa Temp */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">500 hPa Mid-Level Temp (~5.8 km):</span>
                <span className="font-mono text-sky-700">{midTroposphereTemp500}°C</span>
              </div>
              <input
                type="range"
                min={-25}
                max={-2}
                value={midTroposphereTemp500}
                onChange={(e) => setMidTroposphereTemp500(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Slider 4: 700 hPa Temp */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-700">700 hPa Lower-Mid Temp (~3.0 km):</span>
                <span className="font-mono text-indigo-700">{temp700hpa}°C</span>
              </div>
              <input
                type="range"
                min={0}
                max={18}
                value={temp700hpa}
                onChange={(e) => setTemp700hpa(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-800">Forecast Rule of Thumb:</div>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                When CAPE exceeds 2,000 J/kg and CIN falls below 50 J/kg with negative Lifted Index (&lt; -4), surface solar heating triggers explosive cumulonimbus development within 90 minutes.
              </p>
            </div>
          </div>

          {/* Right Column: Thermodynamic Indices Display (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-black text-sm text-slate-900">Computed Instability Indices</h3>
                  <div className="text-xs text-slate-500 font-mono">Tephigram Parcel Ascent Diagnostics</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${stormRiskColor}`}>
                  {stormRiskLabel}
                </span>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* CAPE */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">CAPE Energy</span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">J/kg</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{capeEstimated} J/kg</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {capeEstimated > 2500 ? 'Extreme Instability' : capeEstimated > 1200 ? 'Moderate Updraft Potential' : 'Marginal Buoyancy'}
                  </div>
                </div>

                {/* CIN */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">CIN (Inhibition)</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">J/kg</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{cinEstimated} J/kg</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {cinEstimated < 40 ? 'Weak Cap (Breaks Easily)' : 'Strong Cap (Prevents Early Storms)'}
                  </div>
                </div>

                {/* Lifted Index (LI) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Lifted Index (LI)</span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">°C</span>
                  </div>
                  <div className={`text-2xl font-black mt-1 ${liftedIndexEstimated < -4 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {liftedIndexEstimated > 0 ? `+${liftedIndexEstimated}` : liftedIndexEstimated}°C
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {liftedIndexEstimated < -5 ? 'Severe Storm Environment' : liftedIndexEstimated < 0 ? 'Unstable Atmosphere' : 'Stable Air'}
                  </div>
                </div>

                {/* Lifted Condensation Level (LCL) */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">LCL Cloud Base</span>
                    <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded">AGL</span>
                  </div>
                  <div className="text-2xl font-black text-slate-900 mt-1">{lclEstimateMeters} m</div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Estimated Cumulus Base Height
                  </div>
                </div>
              </div>

              {/* Graphical Tephigram Schematic */}
              <div className="p-4 rounded-xl bg-slate-950 text-white font-mono text-xs space-y-2 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
                  <span>TEPHIGRAM PROFILE SCHEMATIC:</span>
                  <span className="text-emerald-400">Parcel Ascent Curve</span>
                </div>
                
                {/* SVG Visual Sounding */}
                <div className="h-44 w-full bg-slate-900/80 rounded-lg p-2 relative overflow-hidden flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 400 160">
                    {/* Grid Isobars */}
                    <line x1="20" y1="20" x2="380" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="25" y="18" fill="#64748b" fontSize="9">300 hPa</text>
                    
                    <line x1="20" y1="65" x2="380" y2="65" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="25" y="63" fill="#64748b" fontSize="9">500 hPa</text>
                    
                    <line x1="20" y1="110" x2="380" y2="110" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
                    <text x="25" y="108" fill="#64748b" fontSize="9">700 hPa</text>
                    
                    <line x1="20" y1="150" x2="380" y2="150" stroke="#475569" strokeWidth="1.5" />
                    <text x="25" y="146" fill="#94a3b8" fontSize="9">1000 hPa (Sfc)</text>

                    {/* Environment Temp line (Red) */}
                    <path
                      d={`M 260 150 L 220 110 L 160 65 L 90 20`}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                    />

                    {/* Dew point line (Blue) */}
                    <path
                      d={`M 200 150 L 160 110 L 110 65 L 50 20`}
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                    />

                    {/* Parcel Ascent Line (Yellow/Orange) */}
                    <path
                      d={`M 260 150 Q 230 110 210 65 T 130 20`}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="2"
                      strokeDasharray="3 3"
                    />

                    {/* CAPE Area label */}
                    <polygon points="160,65 210,65 130,20 90,20" fill="rgba(251, 191, 36, 0.2)" />
                    <text x="145" y="45" fill="#fde68a" fontSize="10" fontWeight="bold">CAPE Area</text>
                  </svg>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-rose-500 inline-block" /> Environmental Temp (T)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-sky-400 inline-block" /> Dew Point Curve (Td)</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-amber-400 inline-block border-t border-dashed" /> Moist Parcel Ascent</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: SURFACE SYNOPTIC STATION MODEL DECODER
      ========================================================================= */}
      {activeTab === 'synoptic-decoder' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-base font-black text-slate-900">WMO Standard Surface Synoptic Station Model</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Every weather station reports an encoded station plot every 3 hours (00, 03, 06, 09, 12, 15, 18, 21 UTC). Learn how to decode wind barbs, pressure tendency, present weather, and cloud oktas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Interactive Station Model Diagram (6 cols) */}
            <div className="md:col-span-6 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="relative w-64 h-64 flex items-center justify-center">
                {/* Center Circle (Cloud Cover: 6/8 Oktas) */}
                <div className="w-16 h-16 rounded-full border-2 border-slate-900 relative overflow-hidden bg-white shadow-sm flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-800" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 75%)' }} />
                  <span className="relative z-10 font-bold text-[10px] text-white">6/8</span>
                </div>

                {/* Wind Barb pointing NW at 25 knots */}
                <div className="absolute top-8 left-8 flex items-center origin-bottom-right rotate-[-45deg]">
                  <div className="w-20 h-0.5 bg-slate-900" />
                  <div className="flex flex-col gap-1 -ml-1">
                    <div className="w-4 h-1 bg-slate-900" />
                    <div className="w-4 h-1 bg-slate-900" />
                    <div className="w-2 h-1 bg-slate-900" />
                  </div>
                </div>

                {/* Temperature (Top Left) */}
                <div className="absolute top-10 left-12 font-mono font-black text-sm text-rose-600">
                  32°C
                  <div className="text-[9px] font-normal text-slate-500 font-sans">Dry Bulb Temp</div>
                </div>

                {/* Dew Point (Bottom Left) */}
                <div className="absolute bottom-10 left-12 font-mono font-black text-sm text-blue-600">
                  26°C
                  <div className="text-[9px] font-normal text-slate-500 font-sans">Dew Point</div>
                </div>

                {/* Pressure in tenths (Top Right): 1004.8 hPa -> 048 */}
                <div className="absolute top-10 right-10 font-mono font-black text-sm text-slate-900">
                  048
                  <div className="text-[9px] font-normal text-slate-500 font-sans">1004.8 hPa</div>
                </div>

                {/* Pressure Tendency (Bottom Right): -2.4 \ */}
                <div className="absolute bottom-10 right-10 font-mono font-black text-sm text-amber-600">
                  -24 \
                  <div className="text-[9px] font-normal text-slate-500 font-sans">-2.4 hPa Falling</div>
                </div>

                {/* Present Weather (Middle Left): Thunderstorm with rain */}
                <div className="absolute left-4 top-28 flex items-center gap-1">
                  <CloudLightning className="w-5 h-5 text-indigo-600" />
                  <span className="text-[10px] font-bold text-indigo-900">ww 95</span>
                </div>
              </div>

              <div className="text-center mt-3 text-xs text-slate-600 font-medium">
                Example Station: <span className="font-bold text-slate-900">Santacruz / Mumbai (Airport)</span> • 12:00 UTC
              </div>
            </div>

            {/* Explanations Guide (6 cols) */}
            <div className="md:col-span-6 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800">1. Pressure Reading (048):</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Reported as the last 3 digits in tenths of hPa. If first digit is 0-5, prefix with 10 (048 = 1004.8 hPa). If 6-9, prefix with 9 (982 = 998.2 hPa).
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800">2. Wind Barb Interpretation:</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Shaft points in the direction the wind is coming from. Full barb = 10 knots, half barb = 5 knots, pennant triangle = 50 knots.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800">3. Pressure Tendency (-24 \):</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Indicates change in MSLP over the preceding 3 hours. -24 represents a drop of 2.4 hPa, characteristic of an incoming low-pressure area or squall line.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-800">4. Present Weather Code (ww 95):</div>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Standard WMO Code 95 indicates "Thunderstorm, slight or moderate, with rain and/or snow but not hail at time of observation."
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: OPERATIONAL DUTY FORECASTER CHECKLIST
      ========================================================================= */}
      {activeTab === 'duty-checklist' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900">Standard Operational Duty Shift Checklist</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                IMD National Weather Forecasting Centre (NWFC) standard shift handover workflow.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-600">Completion:</span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                {Math.round((completedTasksCount / totalTasksCount) * 100)}%
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'synoptic-00utc',
                time: '00:00 UTC (05:30 IST)',
                title: 'Plot & Analyze Surface Synoptic & Upper-Air Charts',
                desc: 'Decode surface observations, trace isobars at 2 hPa intervals, and verify the position of the Monsoon Trough / Western Disturbance.'
              },
              {
                id: 'dwr-scan',
                time: 'Continuous (10-min)',
                title: 'Monitor 37 Doppler Weather Radars (DWR) Volume Scans',
                desc: 'Inspect Max(Z) Reflectivity for convective cores > 45 dBZ, identify hook echoes, squall lines, and verify radial velocity shears.'
              },
              {
                id: 'insat-rapid',
                time: 'Continuous (15-min)',
                title: 'Verify INSAT-3DR Rapid Scan Satellite Products',
                desc: 'Examine TIR-1 brightness temperatures for cloud top cooling (< -65°C) and water vapor channel moisture transport plumes.'
              },
              {
                id: 'nowcast-mausam',
                time: 'Every 3 Hours',
                title: 'Issue & Disseminate 3-Hourly Nowcast Bulletins via Mausam App',
                desc: 'Generate district-level severe thunderstorm and rainfall warnings with color codes (Green/Yellow/Orange/Red) for 800+ stations.'
              },
              {
                id: 'metar-taf',
                time: 'Every 30 Mins / 3 Hours',
                title: 'Validate Aviation Aerodrome Forecasts (METAR, SPECI, TAF)',
                desc: 'Broadcast runway visual range (RVR), crosswind shear, and thunderstorm warnings for major international and domestic airports.'
              },
              {
                id: 'marine-osf',
                time: '06:00 & 18:00 UTC',
                title: 'Co-ordinate Maritime Ocean State Bulletins with INCOIS',
                desc: 'Issue high swell wave warnings, rough sea condition advisories, and Fishermen Warning zones for Arabian Sea & Bay of Bengal.'
              },
              {
                id: 'ndma-dispatch',
                time: 'Immediate on Alert Escalation',
                title: 'Alert NDMA & State Disaster Management Authorities (SDMA)',
                desc: 'Dispatch emergency red/orange alert advisories for immediate evacuation, school closures, or civil defense mobilization.'
              }
            ].map((task) => (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  checkedTasks[task.id]
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checkedTasks[task.id]}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`text-xs font-bold ${checkedTasks[task.id] ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                      {task.title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {task.time}
                    </span>
                  </div>
                  <p className={`text-xs mt-1 leading-relaxed ${checkedTasks[task.id] ? 'text-emerald-800/80' : 'text-slate-600'}`}>
                    {task.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
