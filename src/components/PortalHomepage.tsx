import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  User, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Radio, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Activity, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon,
  AlertTriangle,
  Award,
  Zap,
  Check,
  Compass,
  Building2,
  Users
} from 'lucide-react';
import { UserRole } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface PortalHomepageProps {
  onLogin: (role: UserRole) => void;
}

export const PortalHomepage: React.FC<PortalHomepageProps> = ({ onLogin }) => {
  const { isBright, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Active form states for each card
  const [traineeEmail, setTraineeEmail] = useState('cadet.julianne@imd.gov.in');
  const [traineePassword, setTraineePassword] = useState('cadet2026');
  const [showTraineePass, setShowTraineePass] = useState(false);

  const [trainerEmail, setTrainerEmail] = useState('faculty.someshwar@imd.gov.in');
  const [trainerPassword, setTrainerPassword] = useState('faculty2026');
  const [showTrainerPass, setShowTrainerPass] = useState(false);

  const [adminEmail, setAdminEmail] = useState('dg.mohapatra@imd.gov.in');
  const [adminPin, setAdminPin] = useState('IMD-ADMIN');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) {
      sound.playBlip(900);
    }
  };

  const handleLoginSubmit = (role: UserRole) => {
    if (role === 'Admin') {
      const normalizedPin = adminPin.trim().toUpperCase();
      if (normalizedPin !== 'IMD-ADMIN' && normalizedPin !== '1947' && normalizedPin !== 'ADMIN') {
        sound.playAlert();
        setAdminPinError('Invalid Directorate PIN. Use IMD-ADMIN for authorized access.');
        return;
      }
      setAdminPinError('');
    }

    sound.playSuccess();
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Ignore in sandbox if unavailable
    }
    onLogin(role);
  };

  return (
    <div className={`min-h-screen ${isBright ? 'bg-pink-blue-mesh text-slate-900 selection:bg-sky-500 selection:text-white' : 'bg-[#060a17] text-white selection:bg-cyan-500/30 selection:text-cyan-200'} relative overflow-hidden font-sans select-none`}>
      {/* Background Animated Atmospheric Glows & Radar Watermark */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Dynamic Glowing Vibrant Blurs */}
        <div className={`absolute -top-32 -left-32 w-[650px] h-[650px] ${isBright ? 'bg-gradient-to-br from-cyan-400/40 via-sky-500/30 to-blue-600/25' : 'bg-blue-600/25'} rounded-full blur-[110px] animate-float-slow`} />
        <div className={`absolute top-1/4 -right-32 w-[700px] h-[700px] ${isBright ? 'bg-gradient-to-bl from-rose-400/35 via-pink-400/30 to-amber-300/35' : 'bg-cyan-500/20'} rounded-full blur-[120px] animate-float-reverse`} />
        <div className={`absolute -bottom-32 left-1/3 w-[750px] h-[750px] ${isBright ? 'bg-gradient-to-tr from-purple-500/30 via-indigo-400/25 to-cyan-400/25' : 'bg-indigo-600/25'} rounded-full blur-[130px]`} />
        <div className={`absolute top-1/2 left-1/4 w-[450px] h-[450px] ${isBright ? 'bg-gradient-to-r from-emerald-400/30 via-teal-400/25 to-sky-400/20' : 'bg-amber-500/10'} rounded-full blur-[100px] animate-pulse-glow`} />

        {/* Concentric Radar Rings Watermark */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border ${isBright ? 'border-sky-300/30 opacity-70' : 'border-cyan-500/10 opacity-40'} pointer-events-none`}>
          <div className={`w-full h-full rounded-full border-2 border-dashed ${isBright ? 'border-sky-400/30' : 'border-cyan-400/15'} animate-spin-ultra-slow flex items-center justify-center`}>
            <div className={`w-3/4 h-3/4 rounded-full border ${isBright ? 'border-blue-400/30' : 'border-blue-500/15'} flex items-center justify-center`}>
              <div className={`w-1/2 h-1/2 rounded-full border ${isBright ? 'border-cyan-400/30' : 'border-cyan-300/10'} flex items-center justify-center`}>
                <div className={`w-1/4 h-1/4 rounded-full border ${isBright ? 'border-amber-400/30' : 'border-amber-400/10'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Radar Azimuth Crosshairs */}
        <div className={`absolute inset-0 flex items-center justify-center ${isBright ? 'opacity-15' : 'opacity-10'}`}>
          <div className={`w-full h-px ${isBright ? 'bg-sky-400' : 'bg-cyan-400'}`} />
          <div className={`h-full w-px ${isBright ? 'bg-sky-400' : 'bg-cyan-400'} absolute`} />
        </div>
      </div>

      {/* Top SIH & Government Authority Banner */}
      <div className={`relative z-20 ${isBright ? 'bg-white/80 border-b border-sky-100 text-slate-700 shadow-2xs' : 'bg-gradient-to-r from-slate-950 via-[#0a152e] to-slate-950 border-b border-cyan-500/30 text-white shadow-md'} px-4 py-2 text-xs backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className={`font-mono text-xs font-black uppercase tracking-wider ${isBright ? 'text-amber-800 bg-amber-50 border-amber-300' : 'text-amber-300 bg-amber-500/10 border-amber-400/30'} px-2 py-0.5 rounded border`}>
              Smart India Hackathon (SIH) Showcase
            </span>
            <span className={`hidden sm:inline ${isBright ? 'text-sky-500' : 'text-cyan-400'} font-bold`}>|</span>
            <span className={`hidden sm:inline ${isBright ? 'text-slate-700 font-bold' : 'text-slate-200 font-bold'} text-xs`}>
              Ministry of Earth Sciences & India Meteorological Department (IMD)
            </span>
          </div>

          <div className={`flex items-center gap-4 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-200'}`}>
            <span className={`hidden md:inline font-mono ${isBright ? 'text-sky-800 bg-sky-50 border-sky-200' : 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40'} px-2 py-0.5 rounded border`}>
              37 DWR Stations Synchronized • HQ Lodhi Road
            </span>
            <button
              onClick={toggleSound}
              className={`p-1.5 ${isBright ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:border-sky-300' : 'text-slate-300 hover:text-white bg-slate-900/80 border-slate-700 hover:border-cyan-400'} rounded-lg border transition-colors cursor-pointer shadow-2xs`}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>
            <button
              onClick={toggleTheme}
              className={`p-1.5 ${isBright ? 'text-slate-600 hover:text-slate-900 bg-white border-slate-200 hover:border-amber-400' : 'text-slate-300 hover:text-white bg-slate-900/80 border-slate-700 hover:border-amber-400'} rounded-lg border transition-colors cursor-pointer shadow-2xs`}
              title="Toggle Theme"
            >
              {isBright ? <Moon className="w-4 h-4 text-sky-600" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Main Header / Institutional Brand Identity */}
      <header className={`relative z-20 border-b ${isBright ? 'border-sky-100 bg-white/85 text-slate-800' : 'border-cyan-500/25 bg-[#091126]/90 text-white'} backdrop-blur-md sticky top-0 shadow-2xs`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-22 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Government Emblem / IMD Insignia */}
            <div className={`w-14 h-14 rounded-2xl ${isBright ? 'bg-gradient-to-br from-amber-100 via-sky-100 to-indigo-100 border-2 border-sky-300 shadow-2xs' : 'bg-gradient-to-br from-amber-500/20 via-sky-500/20 to-indigo-600/30 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]'} flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 100 100" className="w-10 h-10 drop-shadow" aria-label="Emblem of India">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="3.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M23 77 L77 23" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black tracking-widest uppercase ${isBright ? 'text-sky-700' : 'text-cyan-400'} drop-shadow-2xs`}>
                  GOVERNMENT OF INDIA • MINISTRY OF EARTH SCIENCES
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-500 text-white shadow-2xs">
                  IMD-APEX
                </span>
              </div>
              <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'} flex items-center gap-2`}>
                <span>Capacity Connect</span>
                <span className={`text-sm sm:text-base font-bold ${isBright ? 'text-sky-700' : 'text-cyan-200'} opacity-90 hidden md:inline`}>
                  | Meteorological Workforce Accreditation & Doppler Flight Deck
                </span>
              </h1>
            </div>
          </div>

          {/* Institutional Badge for SIH Judges */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-right">
              <div className={`text-xs font-black ${isBright ? 'text-amber-800' : 'text-amber-300'} uppercase tracking-wider flex items-center justify-end gap-1.5`}>
                <Award className="w-4 h-4 text-amber-500" />
                <span>SIH Problem Statement Solved</span>
              </div>
              <div className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-300'} font-bold`}>
                Unified Role-Based National Cockpit
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4 text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold ${isBright ? 'bg-sky-50 text-sky-800 border-2 border-sky-300 shadow-2xs' : 'bg-gradient-to-r from-blue-900/70 via-cyan-900/60 to-indigo-900/70 text-cyan-200 border-2 border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.3)]'} mb-4`}>
          <Sparkles className="w-4 h-4 text-sky-600 animate-pulse" />
          <span className="tracking-wide">NATIONAL METEOROLOGICAL WORKFORCE CAPABILITY MATRIX</span>
          <span className="px-2 py-0.5 rounded-full bg-sky-600 text-white font-black text-[10px]">
            PROD READY
          </span>
        </div>

        <h2 className={`text-3xl sm:text-5xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'} max-w-4xl mx-auto leading-tight drop-shadow-2xs`}>
          Unified Access Gate for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600">National Weather Forecasters</span>
        </h2>
        
        <p className={`mt-4 text-base sm:text-lg ${isBright ? 'text-slate-600 font-medium' : 'text-slate-200 font-bold'} max-w-3xl mx-auto leading-relaxed`}>
          Select your authorized operational track below. Trainees enter the sandboxed flight deck with 360° Doppler radar simulators; senior faculty manage accredited curriculum; and the Director General commands statutory station governance.
        </p>

        {/* Security Rule Callout with High-Contrast Amber Border */}
        <div className={`mt-6 max-w-3xl mx-auto p-4 rounded-2xl ${isBright ? 'bg-amber-50/95 border border-amber-300 text-amber-900 shadow-2xs' : 'bg-[#1c1404] border-2 border-amber-400/90 text-amber-100 shadow-[0_0_30px_rgba(245,158,11,0.25)]'} text-xs sm:text-sm font-bold flex items-center justify-center gap-3`}>
          <Shield className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong className={`${isBright ? 'text-amber-950' : 'text-amber-300'}`}>Strict Directorate Access Enforcement:</strong> Trainee accounts are locked out of administrative consoles. The Director General holds apex multi-console supervisory clearance.
          </span>
        </div>
      </section>

      {/* 3 EYE-CATCHING ROLE LOGIN CARDS */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* CARD 1: TRAINEE / CADET LOGIN (ELECTRIC INDIGO & CYAN THEME) */}
          <div className={`rounded-3xl border-2 ${isBright ? 'border-sky-200 bg-white/90 shadow-2xs hover:border-sky-400 hover:shadow-md' : 'border-cyan-400/80 bg-gradient-to-b from-[#0b1433] via-[#0f1d47] to-[#0c1638] shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:shadow-[0_0_50px_rgba(6,182,212,0.45)] hover:border-cyan-300'} p-7 flex flex-col justify-between transition-all duration-300 group`}>
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${isBright ? 'bg-sky-100 border-2 border-sky-300 text-sky-700' : 'bg-cyan-500/20 border-2 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'} flex items-center justify-center text-2xl shadow-2xs`}>
                    🚀
                  </div>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-black ${isBright ? 'text-sky-700' : 'text-cyan-300'}`}>
                      Cadet Track
                    </span>
                    <h3 className={`text-xl font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-tight`}>Trainee / Cadet</h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-black ${isBright ? 'bg-sky-600 text-white' : 'bg-cyan-400 text-slate-950'} shadow-2xs`}>
                  Learner
                </span>
              </div>

              {/* Persona Tag */}
              <div className={`p-3.5 rounded-2xl mb-5 ${isBright ? 'bg-sky-50 border border-sky-200 text-slate-800' : 'bg-[#142354] border border-cyan-400/40 text-slate-100'} shadow-2xs`}>
                <div className={`font-extrabold ${isBright ? 'text-slate-900' : 'text-white'} text-sm flex items-center justify-between`}>
                  <span>Julianne Moore</span>
                  <span className={`text-xs font-mono font-bold ${isBright ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-cyan-500/30 text-cyan-200'} px-2 py-0.5 rounded`}>
                    Falcon • Tier L4
                  </span>
                </div>
                <p className={`text-xs font-semibold ${isBright ? 'text-sky-700' : 'text-cyan-100'} mt-1`}>
                  Doppler Radar Nowcasting Track • Junior Commissioned Forecaster
                </p>
              </div>

              {/* Functional Highlights */}
              <div className={`mb-6 space-y-2 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-100'}`}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Interactive 6-Axis Competency Radar Tree</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>360° Doppler Radar Simulator Lab</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>15s Rapid Quiz Arena & Animal Rank Streaks</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Watch Demo Masterclasses & Certify</span>
                </div>
              </div>

              {/* Login Form */}
              <div className={`space-y-3.5 pt-4 border-t ${isBright ? 'border-slate-200' : 'border-cyan-500/30'}`}>
                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-cyan-200'} mb-1`}>
                    Cadet Official Email ID
                  </label>
                  <input
                    type="email"
                    value={traineeEmail}
                    onChange={(e) => setTraineeEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border ${isBright ? 'border-slate-300 bg-white text-slate-900 focus:border-sky-500' : 'border-2 border-indigo-400/70 bg-[#080f26] text-white focus:border-cyan-300'} focus:outline-none shadow-2xs`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-cyan-200'} mb-1`}>
                    Cadet Portal Password
                  </label>
                  <div className="relative">
                    <input
                      type={showTraineePass ? 'text' : 'password'}
                      value={traineePassword}
                      onChange={(e) => setTraineePassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border ${isBright ? 'border-slate-300 bg-white text-slate-900 focus:border-sky-500' : 'border-2 border-indigo-400/70 bg-[#080f26] text-white focus:border-cyan-300'} focus:outline-none pr-9 shadow-2xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowTraineePass(!showTraineePass)}
                      className={`absolute right-3 top-3 ${isBright ? 'text-slate-500 hover:text-slate-800' : 'text-cyan-300 hover:text-white'}`}
                    >
                      {showTraineePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => handleLoginSubmit('Trainee')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Enter Flight Deck (Cadet)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className={`text-center text-[11px] font-bold ${isBright ? 'text-slate-500' : 'text-cyan-300/90'} flex items-center justify-center gap-1`}>
                <Lock className="w-3 h-3" />
                <span>Sandboxed: Strictly restricted from Admin consoles</span>
              </div>
            </div>
          </div>


          {/* CARD 2: TRAINER / SENIOR FACULTY (MONSOONAL EMERALD & TEAL THEME) */}
          <div className={`rounded-3xl border-2 ${isBright ? 'border-emerald-200 bg-white/90 shadow-2xs hover:border-emerald-400 hover:shadow-md' : 'border-emerald-400/80 bg-gradient-to-b from-[#07241e] via-[#0b332b] to-[#082620] shadow-[0_0_35px_rgba(16,185,129,0.25)] hover:shadow-[0_0_50px_rgba(52,211,153,0.45)] hover:border-emerald-300'} p-7 flex flex-col justify-between transition-all duration-300 group`}>
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${isBright ? 'bg-emerald-100 border-2 border-emerald-300 text-emerald-700' : 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'} flex items-center justify-center text-2xl shadow-2xs`}>
                    🎓
                  </div>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-black ${isBright ? 'text-emerald-700' : 'text-emerald-300'}`}>
                      Instructional Track
                    </span>
                    <h3 className={`text-xl font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-tight`}>Trainer / Faculty</h3>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-black ${isBright ? 'bg-emerald-600 text-white' : 'bg-emerald-400 text-slate-950'} shadow-2xs`}>
                  Faculty
                </span>
              </div>

              {/* Persona Tag */}
              <div className={`p-3.5 rounded-2xl mb-5 ${isBright ? 'bg-emerald-50 border border-emerald-200 text-slate-800' : 'bg-[#0e3b32] border border-emerald-400/40 text-slate-100'} shadow-2xs`}>
                <div className={`font-extrabold ${isBright ? 'text-slate-900' : 'text-white'} text-sm flex items-center justify-between`}>
                  <span>Dr. Someshwar Rao</span>
                  <span className={`text-xs font-mono font-bold ${isBright ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/30 text-emerald-200'} px-2 py-0.5 rounded`}>
                    16y Exp • CTI Pune
                  </span>
                </div>
                <p className={`text-xs font-semibold ${isBright ? 'text-emerald-700' : 'text-emerald-100'} mt-1`}>
                  Lead Doppler Radar Faculty & Monsoonal Instructor (CTI Pune)
                </p>
              </div>

              {/* Functional Highlights */}
              <div className={`mb-6 space-y-2 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-100'}`}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Publish Demo Video Masterclasses</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Curriculum & Batch Progression Manager</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Faculty Research & Resume Dossier Editor</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Requisitions to Director General Desk</span>
                </div>
              </div>

              {/* Login Form */}
              <div className={`space-y-3.5 pt-4 border-t ${isBright ? 'border-slate-200' : 'border-emerald-500/30'}`}>
                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-emerald-200'} mb-1`}>
                    Faculty Official Email ID
                  </label>
                  <input
                    type="email"
                    value={trainerEmail}
                    onChange={(e) => setTrainerEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border ${isBright ? 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500' : 'border-2 border-emerald-400/70 bg-[#051714] text-white focus:border-emerald-300'} focus:outline-none shadow-2xs`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-emerald-200'} mb-1`}>
                    Faculty Portal Password
                  </label>
                  <div className="relative">
                    <input
                      type={showTrainerPass ? 'text' : 'password'}
                      value={trainerPassword}
                      onChange={(e) => setTrainerPassword(e.target.value)}
                      className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border ${isBright ? 'border-slate-300 bg-white text-slate-900 focus:border-emerald-500' : 'border-2 border-emerald-400/70 bg-[#051714] text-white focus:border-emerald-300'} focus:outline-none pr-9 shadow-2xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowTrainerPass(!showTrainerPass)}
                      className={`absolute right-3 top-3 ${isBright ? 'text-slate-500 hover:text-slate-800' : 'text-emerald-300 hover:text-white'}`}
                    >
                      {showTrainerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => handleLoginSubmit('Trainer')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Enter Faculty Console (Trainer)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className={`text-center text-[11px] font-bold ${isBright ? 'text-slate-500' : 'text-emerald-300/90'} flex items-center justify-center gap-1`}>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Authorized CTI Pune Instructor Clearance</span>
              </div>
            </div>
          </div>


          {/* CARD 3: ADMIN / DIRECTOR GENERAL (IMPERIAL GOLD & SOLAR AMBER) */}
          <div className={`rounded-3xl border-2 ${isBright ? 'border-amber-200 bg-white/90 shadow-2xs hover:border-amber-400 hover:shadow-md' : 'border-amber-400 bg-gradient-to-b from-[#271b05] via-[#382607] to-[#251905] shadow-[0_0_40px_rgba(245,158,11,0.35)] hover:shadow-[0_0_55px_rgba(251,191,36,0.6)] hover:border-yellow-300'} p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group`}>
            {/* Supreme Super-Admin Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 text-[10px] font-mono font-black uppercase px-4 py-1 rounded-bl-xl shadow-2xs">
              Super-Admin
            </div>

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${isBright ? 'bg-amber-100 border-2 border-amber-300 text-amber-700' : 'bg-amber-500/25 border-2 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]'} flex items-center justify-center text-2xl shadow-2xs`}>
                    🏛️
                  </div>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-black ${isBright ? 'text-amber-800' : 'text-amber-300'}`}>
                      Apex Directorate
                    </span>
                    <h3 className={`text-xl font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-tight`}>Admin / Director General</h3>
                  </div>
                </div>
              </div>

              {/* Persona Tag */}
              <div className={`p-3.5 rounded-2xl mb-5 ${isBright ? 'bg-amber-50 border border-amber-200 text-slate-800' : 'bg-[#3f2b09] border border-amber-400/50 text-amber-100'} shadow-2xs`}>
                <div className={`font-extrabold ${isBright ? 'text-slate-900' : 'text-white'} text-sm flex items-center justify-between`}>
                  <span>Dr. M. Mohapatra</span>
                  <span className="text-xs font-mono font-black bg-amber-500 text-white px-2 py-0.5 rounded shadow-2xs">
                    DGM Supreme
                  </span>
                </div>
                <p className={`text-xs font-semibold ${isBright ? 'text-amber-800' : 'text-amber-200'} mt-1`}>
                  Director General of Meteorology, Mausam Bhawan HQ New Delhi
                </p>
              </div>

              {/* Functional Highlights */}
              <div className={`mb-6 space-y-2 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-100'}`}>
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className={`${isBright ? 'text-amber-900' : 'text-amber-200'} font-bold`}>Statutory Approvals & Requisitions Desk</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className={`${isBright ? 'text-amber-900' : 'text-amber-200'} font-bold`}>Multi-Console Audit: Inspect Trainee & Trainer</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Radio className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>National 37-Radar Alerts & Override Controls</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Commissioning Forecasters & Personnel Audits</span>
                </div>
              </div>

              {/* Login Form with Directorate PIN */}
              <div className={`space-y-3.5 pt-4 border-t ${isBright ? 'border-slate-200' : 'border-amber-500/40'}`}>
                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-amber-200'} mb-1`}>
                    Director General Official Email ID
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border ${isBright ? 'border-slate-300 bg-white text-slate-900 focus:border-amber-500' : 'border-2 border-amber-400/80 bg-[#1a1203] text-white focus:border-yellow-300'} focus:outline-none shadow-2xs`}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-xs font-bold ${isBright ? 'text-slate-700' : 'text-amber-200'}`}>
                      Directorate Security PIN
                    </label>
                    <span className={`text-xs ${isBright ? 'text-amber-900 bg-amber-100 border-amber-300' : 'text-amber-300 bg-amber-500/20 border-amber-400/40'} font-mono font-bold px-2 py-0.5 rounded border`}>
                      PIN: IMD-ADMIN
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showAdminPin ? 'text' : 'password'}
                      value={adminPin}
                      onChange={(e) => {
                        setAdminPin(e.target.value);
                        setAdminPinError('');
                      }}
                      placeholder="Enter IMD-ADMIN"
                      className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider rounded-xl border bg-white focus:outline-none pr-9 shadow-2xs ${
                        adminPinError 
                          ? 'border-rose-500 text-rose-600 bg-rose-50' 
                          : isBright
                            ? 'border-slate-300 text-slate-900 focus:border-amber-500'
                            : 'border-amber-400 bg-[#1a1203] text-amber-300 focus:border-yellow-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPin(!showAdminPin)}
                      className={`absolute right-3 top-3 ${isBright ? 'text-slate-500 hover:text-slate-800' : 'text-amber-300 hover:text-white'}`}
                    >
                      {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {adminPinError && (
                    <div className="mt-1 text-xs text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{adminPinError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5">
              <button
                onClick={() => handleLoginSubmit('Admin')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all active:scale-98 cursor-pointer"
              >
                <span>Authorize & Sign In as Admin (DG)</span>
                <Shield className="w-4 h-4 text-white" />
              </button>

              <div className={`text-center text-[11px] font-bold ${isBright ? 'text-amber-800' : 'text-amber-300'} flex items-center justify-center gap-1`}>
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Unrestricted Apex Super-Admin & Multi-Console Authority</span>
              </div>
            </div>
          </div>

        </div>

        {/* Rapid 1-Click Sandbox Test Access Bar for SIH Judges */}
        <div className={`mt-12 p-6 rounded-3xl border ${isBright ? 'border-sky-200 bg-white/90 text-slate-800 shadow-2xs' : 'border-2 border-cyan-500/40 bg-gradient-to-r from-[#091530] via-[#0c1f47] to-[#091530] text-center shadow-[0_0_35px_rgba(6,182,212,0.2)]'} text-center`}>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className={`text-sm font-bold uppercase tracking-widest ${isBright ? 'text-amber-800' : 'text-amber-300'}`}>
              Judges Rapid 1-Click Evaluation Bar (Instant Role Launch)
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handleLoginSubmit('Trainee')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${isBright ? 'bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-800' : 'bg-indigo-600/30 hover:bg-indigo-600 border-2 border-cyan-400 text-white'} shadow-2xs transition-all active:scale-95 cursor-pointer`}
            >
              <span className="text-base">🚀</span>
              <span>Launch Trainee Cockpit (Cadet)</span>
            </button>

            <button
              onClick={() => handleLoginSubmit('Trainer')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${isBright ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800' : 'bg-emerald-600/30 hover:bg-emerald-600 border-2 border-emerald-400 text-white'} shadow-2xs transition-all active:scale-95 cursor-pointer`}
            >
              <span className="text-base">🎓</span>
              <span>Launch Trainer Console (Faculty)</span>
            </button>

            <button
              onClick={() => handleLoginSubmit('Admin')}
              className={`px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2.5 ${isBright ? 'bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900' : 'bg-amber-500/30 hover:bg-amber-500 border-2 border-amber-400 text-white hover:text-slate-950'} shadow-2xs transition-all active:scale-95 cursor-pointer`}
            >
              <span className="text-base">🏛️</span>
              <span>Launch Admin Desk (Director General)</span>
            </button>
          </div>
        </div>

        {/* Live Institutional Radar Network Metrics */}
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-5 text-center">
          <div className={`p-5 rounded-2xl border ${isBright ? 'border-sky-200 bg-white/90 shadow-2xs' : 'border-2 border-cyan-500/40 bg-[#09142e]/90 shadow-md'}`}>
            <div className={`text-3xl sm:text-4xl font-black ${isBright ? 'text-sky-600' : 'text-cyan-300'} tracking-tight`}>37</div>
            <div className={`text-xs font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Active Doppler Radars (DWR)
            </div>
          </div>
          <div className={`p-5 rounded-2xl border ${isBright ? 'border-emerald-200 bg-white/90 shadow-2xs' : 'border-2 border-emerald-500/40 bg-[#08211d]/90 shadow-md'}`}>
            <div className={`text-3xl sm:text-4xl font-black ${isBright ? 'text-emerald-600' : 'text-emerald-300'} tracking-tight`}>450+</div>
            <div className={`text-xs font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Enrolled Forecasters & Cadets
            </div>
          </div>
          <div className={`p-5 rounded-2xl border ${isBright ? 'border-indigo-200 bg-white/90 shadow-2xs' : 'border-2 border-indigo-500/40 bg-[#0f193d]/90 shadow-md'}`}>
            <div className={`text-3xl sm:text-4xl font-black ${isBright ? 'text-indigo-600' : 'text-indigo-300'} tracking-tight`}>94%</div>
            <div className={`text-xs font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Operational Readiness Index
            </div>
          </div>
          <div className={`p-5 rounded-2xl border ${isBright ? 'border-amber-200 bg-white/90 shadow-2xs' : 'border-2 border-amber-500/40 bg-[#241a05]/90 shadow-md'}`}>
            <div className={`text-3xl sm:text-4xl font-black ${isBright ? 'text-amber-600' : 'text-amber-300'} tracking-tight`}>24/7</div>
            <div className={`text-xs font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Severe Weather Alert Watch
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 mt-14 border-t ${isBright ? 'border-sky-100 bg-white/80 text-slate-600' : 'border-cyan-500/30 bg-[#050a17] text-slate-300'} py-8 text-center text-xs backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className={`font-extrabold ${isBright ? 'text-slate-800' : 'text-slate-200'} text-sm`}>
            India Meteorological Department (IMD) • Ministry of Earth Sciences, Government of India
          </p>
          <p className={`text-xs font-bold ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Capacity Connect Monsoonal & Severe Weather Workforce Accreditation System • Lodhi Road, New Delhi - 110003
          </p>
          <div className={`pt-2 text-xs font-mono font-bold ${isBright ? 'text-sky-600' : 'text-cyan-400'} flex items-center justify-center gap-2`}>
            <span>Official Hackathon Prototype</span>
            <span>•</span>
            <span>Accredited for National Radar Operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
