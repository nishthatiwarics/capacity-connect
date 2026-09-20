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
  Users, 
  Bell, 
  BookOpen, 
  PlusCircle, 
  UserPlus 
} from 'lucide-react';
import { UserRole, AdminAnnouncement, UserAccount } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';
import { WeatherBulletinDashboard } from './WeatherBulletinDashboard';
import { INITIAL_ADMIN_ANNOUNCEMENTS } from '../data/sihPortalData';

interface PortalHomepageProps {
  onLogin: (role: UserRole) => void;
  announcements?: AdminAnnouncement[];
  onRegisterUser?: (account: UserAccount) => void;
}

export const PortalHomepage: React.FC<PortalHomepageProps> = ({ 
  onLogin, 
  announcements = INITIAL_ADMIN_ANNOUNCEMENTS,
  onRegisterUser
}) => {
  const { isBright, toggleTheme } = useTheme();
  const [isMuted, setIsMuted] = useState(sound.isMuted);

  // Authentication Mode: Sign In vs Sign Up
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  // Active form states for each card (Sign In)
  const [traineeEmail, setTraineeEmail] = useState('cadet.julianne@imd.gov.in');
  const [traineePassword, setTraineePassword] = useState('cadet2026');
  const [showTraineePass, setShowTraineePass] = useState(false);
  const [traineeAuthError, setTraineeAuthError] = useState('');

  const [trainerEmail, setTrainerEmail] = useState('faculty.someshwar@imd.gov.in');
  const [trainerPassword, setTrainerPassword] = useState('faculty2026');
  const [showTrainerPass, setShowTrainerPass] = useState(false);
  const [trainerAuthError, setTrainerAuthError] = useState('');

  const [adminEmail, setAdminEmail] = useState('dg.mohapatra@imd.gov.in');
  const [adminPin, setAdminPin] = useState('IMD-ADMIN');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');

  // Sign Up Form State
  const [regRole, setRegRole] = useState<UserRole>('Trainee');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regOrg, setRegOrg] = useState('Central Training Institute, Pune');
  const [regStation, setRegStation] = useState('PUN-CTI (Pune)');
  const [regQual, setRegQual] = useState('M.Sc. Atmospheric Science');
  const [regSpec, setRegSpec] = useState('Doppler Radar & Nowcasting');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) {
      sound.playBlip(900);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      sound.playAlert();
      setRegError('Please complete all required fields.');
      return;
    }
    if (!regEmail.includes('@')) {
      sound.playAlert();
      setRegError('Please enter a valid official institutional email.');
      return;
    }
    if (regPassword.length < 4) {
      sound.playAlert();
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      sound.playAlert();
      setRegError('Passwords do not match. Please recheck.');
      return;
    }

    sound.playSuccess();
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch {}

    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      avatar: regRole === 'Trainer' 
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
        : regRole === 'Admin'
          ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      designation: regRole === 'Trainee' ? 'Cadet Forecaster Level-1' : regRole === 'Trainer' ? 'Accredited Faculty Instructor' : 'Supervisory Directorate Official',
      organization: regOrg,
      station: regStation,
      status: 'Active',
      createdAt: new Date().toISOString().substring(0, 10),
      qualification: regQual,
      specialization: regSpec
    };

    onRegisterUser?.(newAccount);
    setRegSuccess(true);
    setTimeout(() => {
      onLogin(regRole);
    }, 1200);
  };

  const handleLoginSubmit = (role: UserRole) => {
    if (role === 'Trainee') {
      if (!traineeEmail.trim() || !traineeEmail.includes('@')) {
        sound.playAlert();
        setTraineeAuthError('Please enter a valid government email address.');
        return;
      }
      if (traineePassword.trim().length < 4) {
        sound.playAlert();
        setTraineeAuthError('Invalid password. Minimum 4 characters required.');
        return;
      }
      setTraineeAuthError('');
    }

    if (role === 'Trainer') {
      if (!trainerEmail.trim() || !trainerEmail.includes('@')) {
        sound.playAlert();
        setTrainerAuthError('Please enter a valid faculty email address.');
        return;
      }
      if (trainerPassword.trim().length < 4) {
        sound.playAlert();
        setTrainerAuthError('Invalid password. Minimum 4 characters required.');
        return;
      }
      setTrainerAuthError('');
    }

    if (role === 'Admin') {
      const normalizedPin = adminPin.trim().toUpperCase();
      if (normalizedPin !== 'IMD-ADMIN' && normalizedPin !== '1947' && normalizedPin !== 'ADMIN' && normalizedPin !== '1234') {
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
    <div className={`min-h-screen liquid-glass-canvas ${isBright ? 'text-slate-900 selection:bg-sky-500 selection:text-white' : 'dark text-white selection:bg-cyan-500/30 selection:text-cyan-200'} relative overflow-hidden font-sans select-none`}>
      {/* Background Animated Atmospheric Glows & Multi-Chromatic Prismatic Dispersion Blooms */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Directional Soft Ambient Specular Lighting */}
        <div className="absolute -top-32 -left-20 w-[650px] h-[650px] bg-gradient-to-br from-white/95 via-sky-200/45 to-transparent rounded-full blur-[90px]" />

        {/* Dynamic Glowing Vibrant Pastel Blooms (inspired by Liquid Glass Kit & Solutions Digitales) */}
        <div className={`absolute top-10 -right-20 w-[680px] h-[680px] ${isBright ? 'bg-gradient-to-bl from-pink-400/30 via-rose-300/25 to-purple-300/25' : 'bg-pink-600/20'} rounded-full blur-[115px] animate-float-slow`} />
        <div className={`absolute top-1/3 -left-32 w-[720px] h-[720px] ${isBright ? 'bg-gradient-to-tr from-cyan-300/35 via-sky-300/25 to-blue-400/20' : 'bg-cyan-600/20'} rounded-full blur-[125px] animate-float-reverse`} />
        <div className={`absolute -bottom-32 left-1/4 w-[760px] h-[760px] ${isBright ? 'bg-gradient-to-tr from-purple-400/25 via-indigo-300/20 to-teal-300/25' : 'bg-indigo-600/20'} rounded-full blur-[130px]`} />
        <div className={`absolute top-2/3 right-1/4 w-[520px] h-[520px] ${isBright ? 'bg-gradient-to-tl from-emerald-300/30 via-teal-300/20 to-sky-300/20' : 'bg-emerald-600/15'} rounded-full blur-[105px] animate-pulse-glow`} />

        {/* Concentric Radar Rings Watermark with Frosted Shimmer */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border ${isBright ? 'border-sky-300/25 opacity-60' : 'border-cyan-500/10 opacity-30'} pointer-events-none`}>
          <div className={`w-full h-full rounded-full border-2 border-dashed ${isBright ? 'border-sky-400/25' : 'border-cyan-400/15'} animate-spin-ultra-slow flex items-center justify-center`}>
            <div className={`w-3/4 h-3/4 rounded-full border ${isBright ? 'border-blue-400/25' : 'border-blue-500/15'} flex items-center justify-center`}>
              <div className={`w-1/2 h-1/2 rounded-full border ${isBright ? 'border-cyan-400/25' : 'border-cyan-300/10'} flex items-center justify-center`}>
                <div className={`w-1/4 h-1/4 rounded-full border ${isBright ? 'border-amber-400/25' : 'border-amber-400/10'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Radar Azimuth Crosshairs */}
        <div className={`absolute inset-0 flex items-center justify-center ${isBright ? 'opacity-10' : 'opacity-5'}`}>
          <div className={`w-full h-px ${isBright ? 'bg-sky-400' : 'bg-cyan-400'}`} />
          <div className={`h-full w-px ${isBright ? 'bg-sky-400' : 'bg-cyan-400'} absolute`} />
        </div>
      </div>

      {/* Top Government Authority Banner */}
      <div className={`relative z-20 ${isBright ? 'bg-white/80 border-b border-sky-100 text-slate-700 shadow-2xs' : 'bg-gradient-to-r from-slate-950 via-[#0a152e] to-slate-950 border-b border-cyan-500/30 text-white shadow-md'} px-4 py-2 text-xs backdrop-blur-md`}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className={`font-mono text-xs font-black uppercase tracking-wider ${isBright ? 'text-sky-800 bg-sky-50 border-sky-300' : 'text-cyan-300 bg-cyan-950/60 border-cyan-500/40'} px-2 py-0.5 rounded border`}>
              National Weather Service • Operational Portal
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[72px] sm:min-h-[84px] py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Government Emblem / IMD Insignia */}
            <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-2xl ${isBright ? 'bg-gradient-to-br from-amber-100 via-sky-100 to-indigo-100 border-2 border-sky-300 shadow-2xs' : 'bg-gradient-to-br from-amber-500/20 via-sky-500/20 to-indigo-600/30 border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.35)]'} flex items-center justify-center shrink-0`}>
              <svg viewBox="0 0 100 100" className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow" aria-label="Emblem of India">
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0284c7" strokeWidth="3.5" />
                <circle cx="50" cy="50" r="15" fill="none" stroke="#f59e0b" strokeWidth="3" />
                <path d="M50 12 V88 M12 50 H88 M23 23 L77 77 M23 77 L77 23" stroke="#0284c7" strokeWidth="2" />
              </svg>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] sm:text-xs font-black tracking-widest uppercase ${isBright ? 'text-sky-700' : 'text-cyan-400'} drop-shadow-2xs`}>
                  GOVT OF INDIA • MOES
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold bg-amber-500 text-white shadow-2xs">
                  IMD-APEX
                </span>
              </div>
              <h1 className={`text-lg sm:text-2xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'} flex items-center gap-2 leading-tight`}>
                <span>Capacity Connect</span>
                <span className={`text-sm sm:text-base font-bold ${isBright ? 'text-sky-700' : 'text-cyan-200'} opacity-90 hidden md:inline`}>
                  | Meteorological Workforce Accreditation & Doppler Flight Deck
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Access to Weather Bulletin (Visible to Everyone) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                sound.playBlip(700);
                const el = document.getElementById('national-weather-bulletin-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                isBright
                  ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-900'
                  : 'bg-cyan-950/70 hover:bg-cyan-900 border-cyan-400/50 text-cyan-200'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>🌤️ Weather Forecast Bulletin</span>
            </button>
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

      {/* OFFICIAL DIRECTORATE ANNOUNCEMENTS & LEARNING BULLETIN (SIH REQUIREMENT) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className={`p-5 sm:p-7 rounded-[32px] ${
          isBright ? 'liquid-glass-tray' : 'liquid-glass-tray'
        }`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/60 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-100/90 dark:bg-amber-900/40 border border-amber-300/60 dark:border-amber-500/40 text-amber-800 dark:text-amber-200 flex items-center justify-center font-bold text-base shadow-xs">
                📢
              </div>
              <div>
                <h3 className={`text-base font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Directorate Announcements, Achievements & Learning Bulletin
                </h3>
                <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  Published live by IMD Headquarters & Central Training Institute Directorate
                </p>
              </div>
            </div>

            <span className="liquid-glass-pill liquid-glass-pill-emerald px-3.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider">
              Live Official Feed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
            {announcements.slice(0, 4).map((ann) => (
              <div
                key={ann.id}
                className={`p-4 rounded-2xl liquid-glass-card ${
                  ann.isPinned
                    ? 'liquid-glass-bloom-purple'
                    : isBright
                      ? 'liquid-glass-bloom-cyan'
                      : 'dark:border-white/15'
                } flex flex-col justify-between gap-2`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase ${
                      ann.category === 'Notification'
                        ? 'bg-rose-100/90 text-rose-800 border border-rose-300/60'
                        : ann.category === 'Achievement'
                          ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300/60'
                          : ann.category === 'New Learning Content'
                            ? 'bg-sky-100/90 text-sky-800 border border-sky-300/60'
                            : 'bg-amber-100/90 text-amber-800 border border-amber-300/60'
                    }`}>
                      {ann.category}
                    </span>
                    <span className={`text-[10px] font-mono ${isBright ? 'text-slate-400' : 'text-slate-400'}`}>
                      {ann.publishedAt}
                    </span>
                  </div>

                  <h4 className={`text-xs font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-snug line-clamp-2`}>
                    {ann.title}
                  </h4>

                  <p className={`text-[11px] ${isBright ? 'text-slate-600' : 'text-slate-300'} mt-1 leading-relaxed line-clamp-3`}>
                    {ann.content}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  <span>{((ann.author || (ann as any).publishedBy || 'CTI Directorate')).split(',')[0]}</span>
                  {ann.badgeText && (
                    <span className="text-rose-600 dark:text-rose-400 font-extrabold">{ann.badgeText}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHENTICATION MODE SELECTOR (SIGN IN VS SIGN UP) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2 flex justify-center">
        <div className="inline-flex p-1.5 rounded-full liquid-glass-pill-frosted border border-white/90 shadow-md backdrop-blur-xl gap-1.5">
          <button
            onClick={() => {
              sound.playBlip(700);
              setAuthMode('signin');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              authMode === 'signin'
                ? 'liquid-glass-pill liquid-glass-pill-sky text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Authorized Sign In (Trainee • Trainer • Admin)</span>
          </button>

          <button
            onClick={() => {
              sound.playBlip(750);
              setAuthMode('signup');
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 ${
              authMode === 'signup'
                ? 'liquid-glass-pill liquid-glass-pill-emerald text-white shadow-md'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create New Account (Sign Up)</span>
          </button>
        </div>
      </div>

      {/* SIGN UP / REGISTRATION VIEW */}
      {authMode === 'signup' && (
        <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className={`p-7 sm:p-8 rounded-3xl border-2 ${
            isBright ? 'bg-white/95 border-emerald-200 shadow-lg' : 'bg-[#0a1829] border-emerald-500/50 shadow-2xl'
          } animate-in fade-in`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl font-bold">
                📝
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white">
                  SIH Registration
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  Register for National Weather Workforce Portal
                </h3>
                <p className="text-xs text-slate-500">
                  Select your user role and fill in your official academic & station credentials.
                </p>
              </div>
            </div>

            {regSuccess ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-slate-900">
                  Account Created Successfully!
                </h4>
                <p className="text-xs text-slate-500">
                  Signing in to your new <strong>{regRole}</strong> cockpit...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                {/* User Role Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    Select Your Intended Institutional Role *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Trainee', 'Trainer', 'Admin'] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRegRole(r)}
                        className={`p-3 rounded-2xl border text-center font-extrabold transition-all cursor-pointer ${
                          regRole === r
                            ? r === 'Trainee'
                              ? 'bg-sky-50 border-sky-500 text-sky-900 ring-2 ring-sky-400'
                              : r === 'Trainer'
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                                : 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-400'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-lg mb-0.5">
                          {r === 'Trainee' ? '🚀' : r === 'Trainer' ? '🎓' : '🏛️'}
                        </div>
                        <span>{r}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Julianne Moore / Dr. Someshwar Rao"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Official Institutional Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. name@imd.gov.in or .edu"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Station / Institute Location</label>
                    <input
                      type="text"
                      placeholder="e.g. PUN-CTI (Pune) or RMC Chennai"
                      value={regStation}
                      onChange={(e) => setRegStation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Highest Academic Qualification</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc. Meteorology / Ph.D. Radar"
                      value={regQual}
                      onChange={(e) => setRegQual(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization / Operational Interest</label>
                  <input
                    type="text"
                    placeholder="e.g. Doppler Radar Nowcasting, WRF Modeling, Squall Lines"
                    value={regSpec}
                    onChange={(e) => setRegSpec(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Create Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 4 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                {regError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-wider text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>Complete Registration & Enter {regRole} Cockpit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      )}

      {/* 3 EYE-CATCHING ROLE LOGIN CARDS (SHOWN WHEN IN SIGNIN MODE) */}
      {authMode === 'signin' && (
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* CARD 1: TRAINEE / CADET LOGIN (ELECTRIC INDIGO & CYAN THEME) */}
          <div className="liquid-glass-card p-7 sm:p-8 flex flex-col justify-between overflow-hidden relative group">
            {/* Prismatic Internal Aurora Bloom */}
            <div className="absolute -top-14 -right-14 w-52 h-52 liquid-glass-bloom-cyan rounded-full pointer-events-none blur-xl opacity-75" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${isBright ? 'bg-sky-100/90 border border-sky-300 text-sky-700' : 'bg-cyan-500/20 border border-cyan-400 text-cyan-300'} flex items-center justify-center text-2xl shadow-xs`}>
                    🚀
                  </div>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-black ${isBright ? 'text-sky-700' : 'text-cyan-300'}`}>
                      Cadet Track
                    </span>
                    <h3 className={`text-xl font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-tight flex items-center gap-2`}>
                      <span>Trainee / Cadet</span>
                      <span className="liquid-glass-bubble w-3.5 h-3.5" />
                    </h3>
                  </div>
                </div>
                <span className="liquid-glass-pill liquid-glass-pill-cyan px-3.5 py-1 text-xs font-mono font-black shadow-xs">
                  Learner
                </span>
              </div>

              {/* Persona Tag */}
              <div className="p-3.5 rounded-2xl mb-5 liquid-glass-pill-frosted border border-white/80 dark:border-white/15 relative z-10">
                <div className={`font-extrabold ${isBright ? 'text-slate-900' : 'text-white'} text-sm flex items-center justify-between`}>
                  <span>Julianne Moore</span>
                  <span className={`text-xs font-mono font-bold ${isBright ? 'bg-sky-100 text-sky-800 border border-sky-200' : 'bg-cyan-500/30 text-cyan-200'} px-2 py-0.5 rounded-full`}>
                    Falcon • Tier L4
                  </span>
                </div>
                <p className={`text-xs font-semibold ${isBright ? 'text-sky-700' : 'text-cyan-100'} mt-1`}>
                  Doppler Radar Nowcasting Track • Junior Commissioned Forecaster
                </p>
              </div>

              {/* Functional Highlights */}
              <div className={`mb-6 space-y-2.5 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-100'} relative z-10`}>
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
              <div className="space-y-3.5 pt-4 border-t border-white/60 dark:border-white/10 relative z-10">
                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-cyan-200'} mb-1`}>
                    Cadet Official Email ID
                  </label>
                  <input
                    type="email"
                    value={traineeEmail}
                    onChange={(e) => setTraineeEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold liquid-glass-input focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-bold liquid-glass-input focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTraineePass(!showTraineePass)}
                      className={`absolute right-3 top-3 ${isBright ? 'text-slate-500 hover:text-slate-800' : 'text-cyan-300 hover:text-white'}`}
                    >
                      {showTraineePass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {traineeAuthError && (
                    <div className="mt-1 text-xs text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{traineeAuthError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 relative z-10">
              <button
                onClick={() => handleLoginSubmit('Trainee')}
                className="w-full py-3.5 px-4 liquid-glass-pill liquid-glass-pill-sky text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
          <div className="liquid-glass-card p-7 sm:p-8 flex flex-col justify-between overflow-hidden relative group">
            {/* Prismatic Internal Aurora Bloom */}
            <div className="absolute -top-14 -right-14 w-52 h-52 liquid-glass-bloom-emerald rounded-full pointer-events-none blur-xl opacity-75" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${isBright ? 'bg-emerald-100/90 border border-emerald-300 text-emerald-700' : 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'} flex items-center justify-center text-2xl shadow-xs`}>
                    🎓
                  </div>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-black ${isBright ? 'text-emerald-700' : 'text-emerald-300'}`}>
                      Instructional Track
                    </span>
                    <h3 className={`text-xl font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-tight flex items-center gap-2`}>
                      <span>Trainer / Faculty</span>
                      <span className="liquid-glass-bubble w-3.5 h-3.5" />
                    </h3>
                  </div>
                </div>
                <span className="liquid-glass-pill liquid-glass-pill-emerald px-3.5 py-1 text-xs font-mono font-black shadow-xs">
                  Faculty
                </span>
              </div>

              {/* Persona Tag */}
              <div className="p-3.5 rounded-2xl mb-5 liquid-glass-pill-frosted border border-white/80 dark:border-white/15 relative z-10">
                <div className={`font-extrabold ${isBright ? 'text-slate-900' : 'text-white'} text-sm flex items-center justify-between`}>
                  <span>Dr. Someshwar Rao</span>
                  <span className={`text-xs font-mono font-bold ${isBright ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-emerald-500/30 text-emerald-200'} px-2 py-0.5 rounded-full`}>
                    16y Exp • CTI Pune
                  </span>
                </div>
                <p className={`text-xs font-semibold ${isBright ? 'text-emerald-700' : 'text-emerald-100'} mt-1`}>
                  Lead Doppler Radar Faculty & Monsoonal Instructor (CTI Pune)
                </p>
              </div>

              {/* Functional Highlights */}
              <div className={`mb-6 space-y-2.5 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-100'} relative z-10`}>
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
              <div className="space-y-3.5 pt-4 border-t border-white/60 dark:border-white/10 relative z-10">
                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-emerald-200'} mb-1`}>
                    Faculty Official Email ID
                  </label>
                  <input
                    type="email"
                    value={trainerEmail}
                    onChange={(e) => setTrainerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold liquid-glass-input focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 text-xs font-mono font-bold liquid-glass-input focus:outline-none pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowTrainerPass(!showTrainerPass)}
                      className={`absolute right-3 top-3 ${isBright ? 'text-slate-500 hover:text-slate-800' : 'text-emerald-300 hover:text-white'}`}
                    >
                      {showTrainerPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {trainerAuthError && (
                    <div className="mt-1 text-xs text-rose-500 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{trainerAuthError}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2.5 relative z-10">
              <button
                onClick={() => handleLoginSubmit('Trainer')}
                className="w-full py-3.5 px-4 liquid-glass-pill liquid-glass-pill-emerald text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
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
          <div className="liquid-glass-card p-7 sm:p-8 flex flex-col justify-between overflow-hidden relative group">
            {/* Supreme Super-Admin Ribbon */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 text-[10px] font-mono font-black uppercase px-4 py-1 rounded-bl-xl shadow-xs z-20">
              Super-Admin
            </div>

            {/* Prismatic Internal Aurora Bloom */}
            <div className="absolute -top-14 -right-14 w-52 h-52 liquid-glass-bloom-amber rounded-full pointer-events-none blur-xl opacity-75" />

            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl ${isBright ? 'bg-amber-100/90 border border-amber-300 text-amber-700' : 'bg-amber-500/25 border border-amber-400 text-amber-300'} flex items-center justify-center text-2xl shadow-xs`}>
                    🏛️
                  </div>
                  <div>
                    <span className={`text-[11px] font-mono uppercase tracking-wider font-black ${isBright ? 'text-amber-800' : 'text-amber-300'}`}>
                      Apex Directorate
                    </span>
                    <h3 className={`text-xl font-black ${isBright ? 'text-slate-900' : 'text-white'} leading-tight flex items-center gap-2`}>
                      <span>Admin / Director General</span>
                      <span className="liquid-glass-bubble w-3.5 h-3.5" />
                    </h3>
                  </div>
                </div>
              </div>

              {/* Persona Tag */}
              <div className="p-3.5 rounded-2xl mb-5 liquid-glass-pill-frosted border border-white/80 dark:border-white/15 relative z-10">
                <div className={`font-extrabold ${isBright ? 'text-slate-900' : 'text-white'} text-sm flex items-center justify-between`}>
                  <span>Dr. M. Mohapatra</span>
                  <span className="text-xs font-mono font-black bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-2xs">
                    DGM Supreme
                  </span>
                </div>
                <p className={`text-xs font-semibold ${isBright ? 'text-amber-800' : 'text-amber-200'} mt-1`}>
                  Director General of Meteorology, Mausam Bhawan HQ New Delhi
                </p>
              </div>

              {/* Functional Highlights */}
              <div className={`mb-6 space-y-2.5 text-xs font-bold ${isBright ? 'text-slate-700' : 'text-slate-100'} relative z-10`}>
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
              <div className="space-y-3.5 pt-4 border-t border-white/60 dark:border-white/10 relative z-10">
                <div>
                  <label className={`block text-xs font-bold ${isBright ? 'text-slate-700' : 'text-amber-200'} mb-1`}>
                    Director General Official Email ID
                  </label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs font-mono font-bold liquid-glass-input focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={`text-xs font-bold ${isBright ? 'text-slate-700' : 'text-amber-200'}`}>
                      Directorate Security PIN
                    </label>
                    <span className={`text-xs ${isBright ? 'text-amber-900 bg-amber-100 border-amber-300' : 'text-amber-300 bg-amber-500/20 border-amber-400/40'} font-mono font-bold px-2 py-0.5 rounded-full border`}>
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
                      className={`w-full px-3.5 py-2.5 text-xs font-mono font-bold tracking-wider liquid-glass-input focus:outline-none pr-9 ${
                        adminPinError ? 'border-rose-500 text-rose-600' : ''
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

            <div className="mt-6 space-y-2.5 relative z-10">
              <button
                onClick={() => handleLoginSubmit('Admin')}
                className="w-full py-3.5 px-4 liquid-glass-pill liquid-glass-pill-amber text-white text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
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

        {/* Direct Sandbox Access Strip */}
        <div className="mt-10 p-6 rounded-[28px] liquid-glass-card text-center relative overflow-hidden">
          <div className="absolute inset-0 liquid-glass-bloom-multi pointer-events-none opacity-40" />

          <div className="relative z-10 flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span className={`text-xs font-black uppercase tracking-wider ${isBright ? 'text-slate-800' : 'text-cyan-300'}`}>
              Direct Interactive Sandbox Cockpits (One-Tap Exploration)
            </span>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => handleLoginSubmit('Trainee')}
              className="px-5 py-2.5 rounded-full liquid-glass-pill liquid-glass-pill-frosted text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>🚀</span>
              <span>Cadet Flight Deck</span>
            </button>

            <button
              onClick={() => handleLoginSubmit('Trainer')}
              className="px-5 py-2.5 rounded-full liquid-glass-pill liquid-glass-pill-frosted text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>🎓</span>
              <span>Faculty Console</span>
            </button>

            <button
              onClick={() => handleLoginSubmit('Admin')}
              className="px-5 py-2.5 rounded-full liquid-glass-pill liquid-glass-pill-frosted text-xs font-extrabold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>🏛️</span>
              <span>Director General Desk</span>
            </button>
          </div>
        </div>

        {/* Live Institutional Radar Network Metrics */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-5 rounded-2xl liquid-glass-card liquid-glass-bloom-cyan">
            <div className={`text-2xl sm:text-3xl font-black ${isBright ? 'text-sky-600' : 'text-cyan-300'} tracking-tight`}>37</div>
            <div className={`text-[11px] font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Active Doppler Radars (DWR)
            </div>
          </div>
          <div className="p-5 rounded-2xl liquid-glass-card liquid-glass-bloom-emerald">
            <div className={`text-2xl sm:text-3xl font-black ${isBright ? 'text-emerald-600' : 'text-emerald-300'} tracking-tight`}>450+</div>
            <div className={`text-[11px] font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Enrolled Forecasters & Cadets
            </div>
          </div>
          <div className="p-5 rounded-2xl liquid-glass-card liquid-glass-bloom-purple">
            <div className={`text-2xl sm:text-3xl font-black ${isBright ? 'text-indigo-600' : 'text-indigo-300'} tracking-tight`}>94%</div>
            <div className={`text-[11px] font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Readiness Index
            </div>
          </div>
          <div className="p-5 rounded-2xl liquid-glass-card liquid-glass-bloom-amber">
            <div className={`text-2xl sm:text-3xl font-black ${isBright ? 'text-amber-600' : 'text-amber-300'} tracking-tight`}>24/7</div>
            <div className={`text-[11px] font-bold ${isBright ? 'text-slate-600' : 'text-slate-200'} mt-1 uppercase tracking-wider`}>
              Severe Weather Alert Watch
            </div>
          </div>
        </div>
      </main>
      )}

      {/* NATIONAL WEATHER FORECASTATION BULLETIN (VISIBLE TO EVERYONE) */}
      <section id="national-weather-bulletin-section" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 scroll-mt-24">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <h2 className={`text-lg sm:text-xl font-black tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
              National Weather Forecastation Bulletin
            </h2>
            <span className="liquid-glass-pill liquid-glass-pill-cyan px-2.5 py-0.5 text-[10px] font-mono font-bold hidden sm:inline">
              PUBLIC BROADCAST
            </span>
          </div>
          <span className={`text-xs font-medium hidden md:inline ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Available to all citizens, mariners, and operational forecasters
          </span>
        </div>

        <div className="p-4 sm:p-7 rounded-[32px] liquid-glass-tray">
          <WeatherBulletinDashboard />
        </div>
      </section>

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
            <span>National Meteorological Training & Forecast System</span>
            <span>•</span>
            <span>Accredited for National Radar Operations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
