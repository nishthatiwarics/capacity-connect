import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Award, 
  Flame, 
  ShieldCheck, 
  Radio, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Trainee, Station } from '../types';
import { BADGES_CATALOG } from '../data/portalData';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface WorkforceRosterProps {
  trainees: Trainee[];
  stations: Station[];
  onUpdateTrainee: (trainee: Trainee) => void;
  onAddTrainee: (trainee: Trainee) => void;
  onAwardXP: (amount: number, reason: string) => void;
}

export const WorkforceRoster: React.FC<WorkforceRosterProps> = ({
  trainees,
  stations,
  onUpdateTrainee,
  onAddTrainee,
  onAwardXP,
}) => {
  const { isBright } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const [stationFilter, setStationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTrainee, setSelectedTrainee] = useState<Trainee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New trainee state
  const [newName, setNewName] = useState('');
  const [newDesignation, setNewDesignation] = useState('');
  const [newRole, setNewRole] = useState<Trainee['role']>('Meteorologist-B');
  const [newStationId, setNewStationId] = useState(stations[0]?.id || 'st-delhi');

  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStation = stationFilter === 'All' || t.stationId === stationFilter;
    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStation && matchesStatus;
  });

  const handlePromote = (trainee: Trainee) => {
    sound.playSuccess();
    const nextLevel = Math.min(5, trainee.level + 1);
    const titles = [
      'Ground Observer',
      'Radar & Sounding Specialist',
      'Nowcast Analyst',
      'Severe Weather Forecaster',
      'Chief Synoptic Specialist',
    ];

    const updated: Trainee = {
      ...trainee,
      level: nextLevel,
      levelTitle: titles[nextLevel - 1],
      xp: trainee.xp + 500,
      status: nextLevel >= 4 ? 'Certified' : 'Active Duty',
    };

    onUpdateTrainee(updated);
    setSelectedTrainee(updated);
    onAwardXP(500, `Promoted ${trainee.name} to Level ${nextLevel}: ${titles[nextLevel - 1]}`);

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#00f5d4', '#f59e0b', '#3b82f6'],
    });
  };

  const handleAwardBadge = (trainee: Trainee, badgeName: string) => {
    if (trainee.badges.includes(badgeName)) return;

    sound.playSuccess();
    const updated: Trainee = {
      ...trainee,
      badges: [...trainee.badges, badgeName],
      xp: trainee.xp + 300,
    };

    onUpdateTrainee(updated);
    setSelectedTrainee(updated);
    onAwardXP(300, `Awarded ${badgeName} badge to ${trainee.name}`);

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.65 },
    });
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const stationObj = stations.find((s) => s.id === newStationId) || stations[0];
    const created: Trainee = {
      id: `tr-${Date.now()}`,
      name: newName,
      designation: newDesignation || 'Operational Meteorologist',
      badgeNumber: `IMD-2026-MET-${Math.floor(100 + Math.random() * 900)}`,
      stationId: stationObj.id,
      stationName: stationObj.name,
      role: newRole,
      avatar: '',
      level: 1,
      levelTitle: 'Ground Observer',
      xp: 500,
      streakDays: 1,
      completionRate: 20,
      certificationsCount: 1,
      competency: {
        radarMeteorology: 60,
        satelliteInterpretation: 65,
        nwpModeling: 50,
        severeNowcasting: 60,
        synopticAnalysis: 65,
        agroAdvisory: 55,
      },
      badges: ['Radar Scout'],
      lastActive: 'Just registered',
      status: 'In Training',
    };

    onAddTrainee(created);
    sound.playSuccess();
    setIsAddModalOpen(false);
    setNewName('');
    setNewDesignation('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className={`border rounded-2xl p-4 lg:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isBright 
          ? 'bg-white border-slate-200 shadow-sm' 
          : 'bg-[#0b1220] border-cyan-900/40 shadow-xl'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold tracking-tight ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              IMD Workforce & Meteorological Competency Roster
            </h2>
            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-full border ${
              isBright 
                ? 'bg-sky-100 text-sky-800 border-sky-300' 
                : 'bg-cyan-950 text-cyan-300 border-cyan-700/50'
            }`}>
              {trainees.length} Personnel
            </span>
          </div>
          <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Real-time competency tracking, gamified level advancement, and accreditation management
          </p>
        </div>

        <button
          onClick={() => {
            sound.playBlip(700);
            setIsAddModalOpen(true);
          }}
          className={`flex items-center gap-1.5 px-3.5 py-2 font-bold text-xs rounded-xl transition-all shadow-sm shrink-0 self-start sm:self-auto ${
            isBright 
              ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white' 
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Induct Forecaster</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isBright ? 'text-slate-400' : 'text-slate-500'}`} />
          <input
            type="text"
            placeholder="Search by name, badge ID, or operational role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3 py-2 border rounded-xl text-xs focus:outline-hidden ${
              isBright 
                ? 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-sky-500 shadow-xs' 
                : 'bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-500 focus:border-cyan-500'
            }`}
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={stationFilter}
            onChange={(e) => setStationFilter(e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-hidden ${
              isBright 
                ? 'bg-white border-slate-300 text-slate-700 focus:border-sky-500 shadow-xs' 
                : 'bg-slate-900/90 border-slate-800 text-slate-300 focus:border-cyan-500'
            }`}
          >
            <option value="All">All IMD Stations</option>
            {stations.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-hidden ${
              isBright 
                ? 'bg-white border-slate-300 text-slate-700 focus:border-sky-500 shadow-xs' 
                : 'bg-slate-900/90 border-slate-800 text-slate-300 focus:border-cyan-500'
            }`}
          >
            <option value="All">All Statuses</option>
            <option value="Active Duty">Active Duty</option>
            <option value="In Training">In Training</option>
            <option value="Evaluation Due">Evaluation Due</option>
            <option value="Certified">Certified</option>
          </select>
        </div>
      </div>

      {/* Trainees Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTrainees.map((trainee) => (
          <div
            key={trainee.id}
            onClick={() => {
              sound.playBlip(650);
              setSelectedTrainee(trainee);
            }}
            className={`border rounded-2xl p-4 shadow-xs cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between group ${
              isBright
                ? 'bg-white border-slate-200 hover:border-sky-400 hover:shadow-md'
                : 'bg-[#0b1220] border-cyan-900/30 hover:border-cyan-500/50 shadow-xl hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
            }`}
          >
            <div>
              {/* Header: Avatar, Name, Level Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs border ${
                      isBright
                        ? 'bg-slate-100 border-slate-300 text-slate-700'
                        : 'bg-slate-800 border-slate-700 text-slate-200'
                    }`}>
                      {trainee.name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border flex items-center justify-center text-[9px] font-bold font-mono ${
                      isBright 
                        ? 'bg-white border-sky-300 text-sky-700 shadow-xs' 
                        : 'bg-slate-900 border-slate-700 text-cyan-400'
                    }`}>
                      {trainee.level}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold transition-colors ${
                      isBright ? 'text-slate-900 group-hover:text-sky-700' : 'text-white group-hover:text-cyan-300'
                    }`}>
                      {trainee.name}
                    </h3>
                    <p className={`text-[11px] line-clamp-1 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>{trainee.designation}</p>
                    <span className={`text-[10px] font-mono ${isBright ? 'text-sky-700 font-medium' : 'text-cyan-400'}`}>{trainee.badgeNumber}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded border ${
                    trainee.status === 'Certified' 
                      ? isBright ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-emerald-950/80 text-emerald-300 border-emerald-700/50' :
                    trainee.status === 'Active Duty' 
                      ? isBright ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-cyan-950/80 text-cyan-300 border-cyan-700/50' :
                    isBright ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-950/80 text-amber-300 border-amber-700/50'
                  }`}>
                    {trainee.status}
                  </span>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-mono font-bold">
                    <Flame className="w-3 h-3 fill-current" />
                    <span>{trainee.streakDays}d</span>
                  </div>
                </div>
              </div>

              {/* Station Tag */}
              <div className={`mt-3 flex items-center gap-1.5 text-xs font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                <MapPin className={`w-3 h-3 shrink-0 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
                <span className="truncate">{trainee.stationName}</span>
              </div>

              {/* Competency Snapshot Mini-Bars */}
              <div className={`mt-3 pt-3 border-t space-y-1.5 ${isBright ? 'border-slate-100' : 'border-slate-800/80'}`}>
                <div className={`flex justify-between text-[10px] font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>RADAR COMPLIANCE</span>
                  <span className={`font-bold ${isBright ? 'text-sky-700' : 'text-cyan-400'}`}>{trainee.competency.radarMeteorology}%</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${isBright ? 'bg-slate-100' : 'bg-slate-800'}`}>
                  <div
                    className={`h-full rounded-full ${isBright ? 'bg-sky-600' : 'bg-cyan-400'}`}
                    style={{ width: `${trainee.competency.radarMeteorology}%` }}
                  />
                </div>

                <div className={`flex justify-between text-[10px] font-mono pt-1 ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>NOWCASTING CSI</span>
                  <span className={`font-bold ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>{trainee.competency.severeNowcasting}%</span>
                </div>
                <div className={`h-1 rounded-full overflow-hidden ${isBright ? 'bg-slate-100' : 'bg-slate-800'}`}>
                  <div
                    className={`h-full rounded-full ${isBright ? 'bg-emerald-600' : 'bg-emerald-400'}`}
                    style={{ width: `${trainee.competency.severeNowcasting}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Badges and View Action */}
            <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${isBright ? 'border-slate-100' : 'border-slate-800'}`}>
              <div className="flex items-center gap-1">
                {trainee.badges.slice(0, 2).map((b, i) => (
                  <span
                    key={i}
                    className={`px-1.5 py-0.5 border rounded text-[9px] font-mono font-semibold truncate max-w-[90px] ${
                      isBright 
                        ? 'bg-amber-50 border-amber-200 text-amber-800' 
                        : 'bg-slate-900 border-slate-800 text-amber-300'
                    }`}
                  >
                    {b}
                  </span>
                ))}
                {trainee.badges.length > 2 && (
                  <span className={`text-[9px] font-mono ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>+{trainee.badges.length - 2}</span>
                )}
              </div>

              <span className={`group-hover:translate-x-0.5 transition-transform flex items-center font-semibold text-[11px] ${
                isBright ? 'text-sky-600 font-bold' : 'text-cyan-400'
              }`}>
                Inspect <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Trainee Detail / Competency Inspector Modal */}
      {selectedTrainee && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/60'
          }`}>
            {/* Header */}
            <div className={`flex items-start justify-between pb-3 border-b ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-base border ${
                  isBright ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-200'
                }`}>
                  {selectedTrainee.name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className={`text-lg font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>{selectedTrainee.name}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                      isBright ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}>
                      Lvl {selectedTrainee.level}
                    </span>
                  </div>
                  <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>{selectedTrainee.designation}</p>
                  <p className={`text-[11px] font-mono ${isBright ? 'text-sky-700' : 'text-cyan-400'}`}>{selectedTrainee.badgeNumber} • {selectedTrainee.stationName}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTrainee(null)}
                className={`text-lg p-1 ${isBright ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            {/* Level & XP progression bar */}
            <div className={`p-3 border rounded-xl space-y-2 ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-amber-600 font-bold">{selectedTrainee.levelTitle}</span>
                <span className={isBright ? 'text-slate-500' : 'text-slate-400'}>{selectedTrainee.xp} XP (Next rank: 8000 XP)</span>
              </div>
              <div className={`h-2 rounded-full overflow-hidden ${isBright ? 'bg-slate-200' : 'bg-slate-800'}`}>
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-amber-500 rounded-full"
                  style={{ width: `${Math.min(100, (selectedTrainee.xp / 8000) * 100)}%` }}
                />
              </div>
            </div>

            {/* Detailed 6-Axis Competency Breakdown */}
            <div>
              <h4 className={`text-xs font-mono uppercase font-bold mb-3 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Operational Meteorological Competencies (WMO Compliant)
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Doppler Radar Diagnostics', score: selectedTrainee.competency.radarMeteorology, color: 'from-cyan-500 to-blue-500' },
                  { label: 'Satellite Interpretation', score: selectedTrainee.competency.satelliteInterpretation, color: 'from-blue-500 to-indigo-500' },
                  { label: 'NWP Model Assimilation', score: selectedTrainee.competency.nwpModeling, color: 'from-purple-500 to-pink-500' },
                  { label: 'Severe Weather Nowcasting', score: selectedTrainee.competency.severeNowcasting, color: 'from-emerald-500 to-teal-500' },
                  { label: 'Synoptic Chart Analysis', score: selectedTrainee.competency.synopticAnalysis, color: 'from-amber-500 to-orange-500' },
                  { label: 'Agro-Meteorology Advisory', score: selectedTrainee.competency.agroAdvisory, color: 'from-lime-500 to-emerald-500' },
                ].map((c) => (
                  <div key={c.label} className={`p-2.5 border rounded-xl space-y-1.5 ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800/80'
                  }`}>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className={`truncate ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>{c.label}</span>
                      <span className={`font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>{c.score}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isBright ? 'bg-slate-200' : 'bg-slate-800'}`}>
                      <div
                        className={`h-full bg-gradient-to-r ${c.color} rounded-full`}
                        style={{ width: `${c.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Unlocked Badges & Actions */}
            <div>
              <h4 className={`text-xs font-mono uppercase font-bold mb-2 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                Unlocked Achievement Medals
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTrainee.badges.map((b, idx) => (
                  <span
                    key={idx}
                    className={`px-2.5 py-1 border rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 ${
                      isBright 
                        ? 'bg-amber-50 border-amber-300 text-amber-800' 
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>{b}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Quick Available Badges to Award */}
            <div className={`p-3 border rounded-xl space-y-2 ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <span className={`text-[11px] font-mono block ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
                COMMAND ACTIONS: AWARD HONORARY MEDAL
              </span>
              <div className="flex flex-wrap gap-2">
                {BADGES_CATALOG.filter((bc) => !selectedTrainee.badges.includes(bc.name)).map((bc) => (
                  <button
                    key={bc.id}
                    onClick={() => handleAwardBadge(selectedTrainee, bc.name)}
                    className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 font-mono border ${
                      isBright 
                        ? 'bg-white hover:bg-sky-50 border-slate-300 text-slate-700 hover:text-sky-700 hover:border-sky-300' 
                        : 'bg-slate-800 hover:bg-cyan-950 hover:border-cyan-500 border-slate-700 text-slate-300 hover:text-cyan-300'
                    }`}
                  >
                    <Plus className="w-3 h-3" />
                    <span>{bc.name} (+300 XP)</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className={`flex items-center justify-between pt-3 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <button
                onClick={() => setSelectedTrainee(null)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl border ${
                  isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent'
                }`}
              >
                Close
              </button>

              <button
                onClick={() => handlePromote(selectedTrainee)}
                disabled={selectedTrainee.level >= 5}
                className={`px-4 py-2 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50 ${
                  isBright 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-slate-950 shadow-lg'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>{selectedTrainee.level >= 5 ? 'Highest Rank Achieved' : `Promote to Level ${selectedTrainee.level + 1} (+500 XP)`}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Induct Forecaster Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/60'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className={`text-base font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Induct Meteorological Personnel
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className={`text-lg p-1 ${isBright ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>OFFICER FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sangeeta Rao"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>DESIGNATION</label>
                <input
                  type="text"
                  placeholder="e.g., Doppler Radar Analyst"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>STATION POSTING</label>
                <select
                  value={newStationId}
                  onChange={(e) => setNewStationId(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                >
                  {stations.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>INITIAL ROLE CLASSIFICATION</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as Trainee['role'])}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                >
                  <option value="Trainee">Trainee</option>
                  <option value="Meteorologist-B">Meteorologist-B</option>
                  <option value="Meteorologist-A">Meteorologist-A</option>
                  <option value="Radar Scientist">Radar Scientist</option>
                  <option value="Ground Station Assistant">Ground Station Assistant</option>
                </select>
              </div>

              <div className={`flex items-center justify-end gap-2 pt-3 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border ${
                    isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 font-bold rounded-xl shadow-md ${
                    isBright 
                      ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 text-white' 
                      : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 text-slate-950 shadow-lg'
                  }`}
                >
                  Induct Personnel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
