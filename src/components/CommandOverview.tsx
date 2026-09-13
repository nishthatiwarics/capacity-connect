import React from 'react';
import { 
  Radio, 
  Users, 
  Award, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import { Station, Trainee, ActivityLog, AlertLevel } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface CommandOverviewProps {
  stations: Station[];
  trainees: Trainee[];
  activityLogs: ActivityLog[];
  onSelectStation: (station: Station) => void;
  onOpenRadarLab: () => void;
  onOpenCourses: () => void;
  onOpenDrill: () => void;
}

export const CommandOverview: React.FC<CommandOverviewProps> = ({
  stations,
  trainees,
  activityLogs,
  onSelectStation,
  onOpenRadarLab,
  onOpenCourses,
  onOpenDrill,
}) => {
  const { isBright } = useTheme();

  // Computed KPI metrics
  const totalCapacity = stations.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalActiveTrainees = stations.reduce((acc, s) => acc + s.activeTrainees, 0);
  const totalCertified = stations.reduce((acc, s) => acc + s.certifiedForecasters, 0);
  const avgReadiness = Math.round(stations.reduce((acc, s) => acc + s.readinessScore, 0) / stations.length);
  const highAlertCount = stations.filter((s) => s.alertLevel === 'Orange' || s.alertLevel === 'Red').length;

  const getAlertBadge = (level: AlertLevel) => {
    if (isBright) {
      switch (level) {
        case 'Red':
          return 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse';
        case 'Orange':
          return 'bg-orange-50 text-orange-800 border-orange-300';
        case 'Yellow':
          return 'bg-amber-50 text-amber-900 border-amber-300';
        default:
          return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      }
    }
    switch (level) {
      case 'Red':
        return 'bg-rose-950/80 text-rose-300 border-rose-600/60 animate-pulse';
      case 'Orange':
        return 'bg-amber-950/80 text-amber-300 border-amber-600/60';
      case 'Yellow':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-600/60';
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-600/60';
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Warning / Advisory Marquee Ticker */}
      <div className={`border rounded-xl px-4 py-2.5 flex items-center gap-3 overflow-hidden shadow-xs transition-colors ${
        isBright 
          ? 'bg-amber-50/90 border-amber-200 text-slate-800' 
          : 'bg-[#0b1329] border-amber-500/30 text-slate-300'
      }`}>
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
          isBright 
            ? 'bg-amber-500 text-white' 
            : 'bg-amber-500/20 border border-amber-500/40 text-amber-300'
        }`}>
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>IMD NOWCAST BULLETINS</span>
        </div>
        <div className={`text-xs font-medium truncate flex items-center gap-4 ${
          isBright ? 'text-slate-700' : 'text-slate-300'
        }`}>
          <span className={isBright ? 'text-rose-700 font-bold' : 'text-rose-400 font-semibold'}>● Kolkata:</span>
          <span>Severe Nor&apos;wester squall line advancing towards Gangetic West Bengal (Wind gusts 80-90 km/h).</span>
          <span className={isBright ? 'text-amber-800 font-bold' : 'text-amber-400 font-semibold'}>● Mumbai:</span>
          <span>Offshore trough active along Konkan coast; heavy rainfall nowcast advisory for next 6 hours.</span>
          <span className={isBright ? 'text-sky-700 font-bold' : 'text-cyan-400 font-semibold'}>● Pune CTI:</span>
          <span>NWP High-Resolution WRF Model assimilated 0600 UTC INSAT-3DR Sounding data.</span>
        </div>
      </div>

      {/* Primary KPI Bento Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Workforce Capacity */}
        <div className={`border rounded-2xl p-4 relative overflow-hidden transition-all group ${
          isBright 
            ? 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-sky-300' 
            : 'bg-[#0b1220] border-cyan-900/30 shadow-lg hover:border-cyan-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase tracking-wider ${
              isBright ? 'text-slate-500 font-bold' : 'text-slate-400'
            }`}>
              National Capacity
            </span>
            <div className={`p-2 rounded-xl ${
              isBright 
                ? 'bg-sky-50 border border-sky-200 text-sky-600' 
                : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
            }`}>
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-extrabold font-mono ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              {totalCapacity}
            </span>
            <span className={`text-xs font-medium ${
              isBright ? 'text-sky-700 font-bold' : 'text-cyan-400'
            }`}>officers & staff</span>
          </div>
          <div className="mt-3">
            <div className={`flex justify-between text-[11px] font-mono mb-1 ${
              isBright ? 'text-slate-600' : 'text-slate-400'
            }`}>
              <span>{totalActiveTrainees} Trainees Active</span>
              <span className={`font-bold ${isBright ? 'text-sky-700' : 'text-cyan-300'}`}>
                {Math.round(((totalCapacity - totalActiveTrainees) / totalCapacity) * 100)}% Deployed
              </span>
            </div>
            <div className={`h-1.5 rounded-full overflow-hidden ${
              isBright ? 'bg-slate-100' : 'bg-slate-800'
            }`}>
              <div
                className={`h-full rounded-full ${
                  isBright ? 'bg-gradient-to-r from-sky-500 to-blue-600' : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                }`}
                style={{ width: `${Math.round(((totalCapacity - totalActiveTrainees) / totalCapacity) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Certified Forecasters */}
        <div className={`border rounded-2xl p-4 relative overflow-hidden transition-all group ${
          isBright 
            ? 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300' 
            : 'bg-[#0b1220] border-cyan-900/30 shadow-lg hover:border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase tracking-wider ${
              isBright ? 'text-slate-500 font-bold' : 'text-slate-400'
            }`}>
              Accredited Forecasters
            </span>
            <div className={`p-2 rounded-xl ${
              isBright 
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-600' 
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
            }`}>
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-extrabold font-mono ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              {totalCertified}
            </span>
            <span className={`text-xs font-semibold ${
              isBright ? 'text-emerald-700' : 'text-emerald-400'
            }`}>+28 this quarter</span>
          </div>
          <p className={`text-[11px] mt-3 flex items-center gap-1 ${
            isBright ? 'text-slate-600' : 'text-slate-400'
          }`}>
            <CheckCircle2 className={`w-3.5 h-3.5 ${isBright ? 'text-emerald-600' : 'text-emerald-400'}`} />
            <span>Passed WMO & IMD Competency Standard</span>
          </p>
        </div>

        {/* Card 3: Operational Readiness Index */}
        <div className={`border rounded-2xl p-4 relative overflow-hidden transition-all group ${
          isBright 
            ? 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300' 
            : 'bg-[#0b1220] border-cyan-900/30 shadow-lg hover:border-blue-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase tracking-wider ${
              isBright ? 'text-slate-500 font-bold' : 'text-slate-400'
            }`}>
              Readiness Score
            </span>
            <div className={`p-2 rounded-xl ${
              isBright 
                ? 'bg-blue-50 border border-blue-200 text-blue-600' 
                : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
            }`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-extrabold font-mono ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              {avgReadiness}%
            </span>
            <span className={`text-xs font-medium ${
              isBright ? 'text-blue-700 font-semibold' : 'text-blue-400'
            }`}>Optimal Index</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
              isBright 
                ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                : 'bg-blue-950/80 border border-blue-800/60 text-blue-300'
            }`}>
              {highAlertCount} Stations on Alert
            </span>
            <span className={`text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>Cyclone Season Ready</span>
          </div>
        </div>

        {/* Card 4: Radar Doppler Network */}
        <div className={`border rounded-2xl p-4 relative overflow-hidden transition-all group ${
          isBright 
            ? 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300' 
            : 'bg-[#0b1220] border-cyan-900/30 shadow-lg hover:border-amber-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-mono uppercase tracking-wider ${
              isBright ? 'text-slate-500 font-bold' : 'text-slate-400'
            }`}>
              DWR Doppler Network
            </span>
            <div className={`p-2 rounded-xl ${
              isBright 
                ? 'bg-amber-50 border border-amber-200 text-amber-600' 
                : 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
            }`}>
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl lg:text-3xl font-extrabold font-mono ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              {stations.length}/{stations.length}
            </span>
            <span className={`text-xs font-semibold ${
              isBright ? 'text-emerald-700' : 'text-emerald-400'
            }`}>100% Online</span>
          </div>
          <button
            onClick={() => {
              sound.playBlip(750);
              onOpenRadarLab();
            }}
            className={`mt-3 text-xs flex items-center gap-1 font-semibold group/btn transition-colors ${
              isBright ? 'text-sky-700 hover:text-sky-800' : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <span>Launch Doppler Sim Lab</span>
            <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Regional Stations Interactive Command Deck */}
      <div className={`border rounded-2xl p-4 lg:p-6 shadow-xs transition-colors ${
        isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/40 shadow-xl'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
          isBright ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base lg:text-lg font-bold tracking-tight ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}>
                IMD Regional Centres & Training Hubs
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-full border ${
                isBright 
                  ? 'bg-sky-100 text-sky-800 border-sky-300' 
                  : 'bg-cyan-950 text-cyan-300 border-cyan-700/50'
              }`}>
                Interactive Grid
              </span>
            </div>
            <p className={`text-xs mt-0.5 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
              Select any station to inspect workforce capacity, radar telemetry, and dispatch drills
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playBlip(650);
                onOpenCourses();
              }}
              className={`px-3 py-1.5 border text-xs font-semibold rounded-lg transition-colors ${
                isBright 
                  ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' 
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200'
              }`}
            >
              Browse Training Matrix
            </button>
            <button
              onClick={() => {
                sound.playAlert();
                onOpenDrill();
              }}
              className={`px-3 py-1.5 border text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
                isBright 
                  ? 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-900' 
                  : 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Simulate Emergency Drill</span>
            </button>
          </div>
        </div>

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {stations.map((station) => (
            <div
              key={station.id}
              onClick={() => {
                sound.playBlip(700);
                onSelectStation(station);
              }}
              className={`border rounded-xl p-4 cursor-pointer transition-all hover:-translate-y-0.5 group ${
                isBright 
                  ? 'bg-slate-50/70 border-slate-200 hover:border-sky-400 hover:bg-white hover:shadow-md' 
                  : 'bg-[#070c18] border-slate-800/80 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold ${
                      isBright ? 'text-sky-700' : 'text-cyan-400'
                    }`}>
                      {station.code}
                    </span>
                    <span className={isBright ? 'text-slate-300' : 'text-slate-600'}>•</span>
                    <span className={`text-[10px] font-medium ${
                      isBright ? 'text-slate-500' : 'text-slate-400'
                    }`}>
                      {station.region}
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold mt-1 transition-colors line-clamp-1 ${
                    isBright ? 'text-slate-900 group-hover:text-sky-700' : 'text-white group-hover:text-cyan-300'
                  }`}>
                    {station.name}
                  </h3>
                </div>

                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${getAlertBadge(station.alertLevel)}`}>
                  {station.alertLevel} Alert
                </span>
              </div>

              <div className={`flex items-center gap-1.5 text-xs mt-2 font-mono ${
                isBright ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <MapPin className={`w-3 h-3 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span className="truncate">{station.location}</span>
              </div>

              {/* Station Radar Specification */}
              <div className={`mt-3 p-2 border rounded-lg text-[11px] flex items-center gap-2 ${
                isBright 
                  ? 'bg-white border-slate-200 text-slate-700' 
                  : 'bg-slate-900/60 border-slate-800/80 text-slate-300'
              }`}>
                <Radio className={`w-3.5 h-3.5 shrink-0 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span className="truncate font-mono">{station.radarType}</span>
              </div>

              {/* Readiness & Capacity Stats */}
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className={`p-1.5 rounded-lg ${isBright ? 'bg-slate-100' : 'bg-slate-900/40'}`}>
                  <span className={`text-[10px] font-mono block ${isBright ? 'text-slate-500' : 'text-slate-500'}`}>CAPACITY</span>
                  <span className={`font-mono font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>{station.totalCapacity}</span>
                </div>
                <div className={`p-1.5 rounded-lg ${isBright ? 'bg-slate-100' : 'bg-slate-900/40'}`}>
                  <span className={`text-[10px] font-mono block ${isBright ? 'text-slate-500' : 'text-slate-500'}`}>CERTIFIED</span>
                  <span className={`font-mono font-bold ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>{station.certifiedForecasters}</span>
                </div>
                <div className={`p-1.5 rounded-lg ${isBright ? 'bg-slate-100' : 'bg-slate-900/40'}`}>
                  <span className={`text-[10px] font-mono block ${isBright ? 'text-slate-500' : 'text-slate-500'}`}>READINESS</span>
                  <span className={`font-mono font-bold ${isBright ? 'text-sky-700' : 'text-cyan-300'}`}>{station.readinessScore}%</span>
                </div>
              </div>

              {/* Active Alert Line */}
              {station.activeAlertDescription && (
                <div className={`mt-3 text-[11px] leading-tight border rounded p-1.5 line-clamp-2 ${
                  isBright 
                    ? 'bg-amber-50 border-amber-200 text-amber-900' 
                    : 'bg-amber-950/30 border-amber-800/30 text-amber-300/90'
                }`}>
                  <span className={`font-semibold ${isBright ? 'text-amber-800' : 'text-amber-400'}`}>Notice: </span>
                  {station.activeAlertDescription}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Two Columns: Live Activity Logs & Meteorological Station Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Gamified Station Leaderboard */}
        <div className={`lg:col-span-7 border rounded-2xl p-4 lg:p-6 shadow-xs transition-colors ${
          isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/40 shadow-xl'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isBright ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}>
                Top Rated IMD Training Hubs
              </h3>
            </div>
            <span className={`text-[11px] font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>By Accreditation & Simulation Scores</span>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { rank: '1', station: 'Central Training Institute (Pune)', metric: '98% Readiness • 4,820 Module Hours', change: '+12% XP', badge: 'National Leader' },
              { rank: '2', station: 'RMC Chennai Port Radar', metric: '96% Readiness • Cyclone Early Warning Ace', change: '+9% XP', badge: 'Maritime Star' },
              { rank: '3', station: 'IMD National HQ (New Delhi)', metric: '94% Readiness • 284 Certified Officers', change: '+8% XP', badge: 'Command Core' },
              { rank: '4', station: 'RMC Kolkata (Alipore)', metric: '91% Readiness • Nor\'wester Drill Lead', change: '+15% XP', badge: 'Squall Hunter' },
            ].map((item) => (
              <div key={item.rank} className={`flex items-center justify-between p-3 border rounded-xl transition-colors ${
                isBright 
                  ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300' 
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                    item.rank === '1' 
                      ? isBright ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40' 
                      : isBright ? 'bg-slate-200 text-slate-700' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{item.rank}
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold ${isBright ? 'text-slate-900' : 'text-slate-200'}`}>{item.station}</h4>
                    <p className={`text-[11px] font-mono mt-0.5 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>{item.metric}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 border text-[10px] font-mono font-semibold rounded ${
                    isBright 
                      ? 'bg-sky-50 text-sky-800 border-sky-200' 
                      : 'bg-cyan-950 text-cyan-300 border border-cyan-800/40'
                  }`}>
                    {item.badge}
                  </span>
                  <span className={`text-xs font-mono font-bold ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Activity Stream */}
        <div className={`lg:col-span-5 border rounded-2xl p-4 lg:p-6 shadow-xs transition-colors ${
          isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/40 shadow-xl'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isBright ? 'border-slate-200' : 'border-slate-800'
          }`}>
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 animate-pulse ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
              <h3 className={`text-sm font-bold uppercase tracking-wider ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}>
                Live Activity Stream
              </h3>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="mt-4 space-y-3">
            {activityLogs.map((log) => (
              <div key={log.id} className={`p-2.5 border rounded-lg space-y-1 ${
                isBright 
                  ? 'bg-slate-50 border-slate-200 text-slate-800' 
                  : 'bg-slate-900/50 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`font-semibold truncate max-w-[200px] ${
                    isBright ? 'text-sky-700 font-bold' : 'text-cyan-300'
                  }`}>
                    {log.actor}
                  </span>
                  <span className={`font-mono shrink-0 ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>{log.timestamp}</span>
                </div>
                <p className={`text-xs leading-snug ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
                  {log.action}
                </p>
                {log.badge && (
                  <span className={`inline-block px-1.5 py-0.2 text-[9px] font-mono font-bold rounded mt-1 border ${
                    isBright 
                      ? 'bg-amber-50 text-amber-800 border-amber-300' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    Unlocked: {log.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

