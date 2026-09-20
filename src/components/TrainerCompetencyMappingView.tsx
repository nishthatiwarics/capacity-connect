import React, { useState } from 'react';
import { 
  Users, 
  Award, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Send, 
  ChevronRight, 
  Building, 
  Star, 
  BookOpen, 
  Check, 
  Compass, 
  GraduationCap, 
  Filter 
} from 'lucide-react';
import { TrainerCompetencySubjectMapping, TeacherProfile } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface TrainerCompetencyMappingViewProps {
  mappings: TrainerCompetencySubjectMapping[];
  teachers: TeacherProfile[];
  onAssignTrainer?: (subjectName: string, trainerName: string) => void;
  onPostRecruitment?: (subjectName: string) => void;
}

export const TrainerCompetencyMappingView: React.FC<TrainerCompetencyMappingViewProps> = ({
  mappings,
  teachers,
  onAssignTrainer,
  onPostRecruitment
}) => {
  const { isBright } = useTheme();
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(mappings[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [assignedTrainersMap, setAssignedTrainersMap] = useState<Record<string, string>>({
    'tcm-1': 'Dr. Someshwar Rao'
  });
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const domains = ['All', ...Array.from(new Set(mappings.map((m) => m.domain)))];

  const filteredMappings = mappings.filter((m) => {
    const matchesDomain = selectedDomain === 'All' || m.domain === selectedDomain;
    const matchesSearch =
      m.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.requiredQualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDomain && matchesSearch;
  });

  const activeSubject = mappings.find((m) => m.id === selectedSubjectId) || filteredMappings[0] || mappings[0];

  const handleAssign = (trainerName: string) => {
    sound.playSuccess();
    setAssignedTrainersMap((prev) => ({
      ...prev,
      [activeSubject.id]: trainerName
    }));
    setSuccessToast(`Successfully matched and assigned ${trainerName} to "${activeSubject.subjectName}"!`);
    setTimeout(() => setSuccessToast(null), 4000);
    if (onAssignTrainer) {
      onAssignTrainer(activeSubject.subjectName, trainerName);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isBright
          ? 'bg-gradient-to-r from-sky-50 via-white to-blue-50 border-sky-200 shadow-2xs text-slate-800'
          : 'bg-[#0a152e] border-cyan-800/40 shadow-xl text-white'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-600 text-white tracking-wider">
                  SIH Mandate 2026
                </span>
                <span className="text-xs font-semibold text-sky-800 font-mono">
                  Competency Mapping Algorithm
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                Trainer Competency & Subject Matching Engine
              </h1>
              <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
                Automatically identifies the most qualified and experienced instructors across IMD institutes (CTI Pune, RSMC New Delhi, NCMRWF Noida) for specialized meteorological curricula.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] font-mono font-bold text-slate-500 block">Identified Capacity</span>
              <span className="text-sm font-black text-emerald-600">
                {mappings.reduce((acc, m) => acc + m.suitableTrainers.length, 0)} Faculty Profiles Mapped
              </span>
            </div>
            <button
              onClick={() => {
                sound.playBlip(700);
                if (onPostRecruitment) {
                  onPostRecruitment(activeSubject.subjectName);
                }
                setSuccessToast(`Initiated requisition to fill trainer gaps in "${activeSubject.subjectName}"`);
                setTimeout(() => setSuccessToast(null), 4000);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-sky-400" />
              <span>Fill Capacity Gap</span>
            </button>
          </div>
        </div>

        {/* Success notification */}
        {successToast && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Main 2-Column Split: Subject Catalog on Left, Smart Trainer Matches on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Subjects list (4 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-600" />
                <span>Specialized Curricula</span>
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500">
                {filteredMappings.length} Subjects
              </span>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search subject or qualification..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Domain filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
              {domains.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    selectedDomain === d
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Subjects Cards */}
          <div className="space-y-2.5">
            {filteredMappings.map((subj) => {
              const isSelected = subj.id === activeSubject.id;
              const assigned = assignedTrainersMap[subj.id];
              return (
                <div
                  key={subj.id}
                  onClick={() => {
                    sound.playBlip(600);
                    setSelectedSubjectId(subj.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50/80 border-sky-400 shadow-xs ring-2 ring-sky-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded">
                      {subj.domain}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      subj.urgency === 'Critical National Priority'
                        ? 'bg-rose-100 text-rose-800'
                        : subj.urgency === 'High Demand'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                    }`}>
                      {subj.urgency}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-2 leading-snug">
                    {subj.subjectName}
                  </h3>

                  <div className="flex items-center justify-between mt-3 text-[11px] text-slate-500">
                    <span>Min {subj.minExperienceYears}y exp required</span>
                    <span className="font-bold text-sky-700 flex items-center gap-1">
                      <span>{subj.suitableTrainers.length} Mapped</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {assigned && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Assigned:</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-600" />
                        {assigned}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Matched Trainers Ranking & Diagnostics (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase text-sky-700">
                  Target Curriculum Mapping
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-0.5">
                  {activeSubject.subjectName}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Required Criteria: <strong className="text-slate-800">{activeSubject.requiredQualification}</strong> (≥ {activeSubject.minExperienceYears} yrs experience)
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {activeSubject.suitableTrainers.length} Qualified Trainers
                </span>
              </div>
            </div>

            {/* Trainer Rankings List */}
            <div className="space-y-4 mt-5">
              {activeSubject.suitableTrainers.map((trainer, idx) => {
                const isCurrentAssigned = assignedTrainersMap[activeSubject.id] === trainer.trainerName;
                return (
                  <div
                    key={trainer.trainerId}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCurrentAssigned
                        ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-400'
                        : idx === 0
                          ? 'bg-gradient-to-r from-sky-50/40 via-white to-indigo-50/30 border-sky-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      {/* Left: Avatar & Bio */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={trainer.avatar}
                          alt={trainer.trainerName}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900">
                              {trainer.trainerName}
                            </h4>
                            {idx === 0 && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                                Top Match
                              </span>
                            )}
                            <span className="text-[11px] font-mono text-slate-500">
                              {trainer.institution}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-700 mt-1">
                            {trainer.highestDegree} • <span className="text-sky-700">{trainer.specialization}</span>
                          </p>

                          <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-500">
                            <span className="font-mono bg-slate-100 px-2 py-0.5 rounded">
                              {trainer.experienceYears} Years Operational Experience
                            </span>
                            {trainer.currentAssignment && (
                              <span className="text-slate-600 italic">
                                Current: {trainer.currentAssignment}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Suitability Score & Assign Button */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <div className="text-left sm:text-right">
                          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">
                            Competency Match
                          </span>
                          <span className="text-lg font-black text-sky-600">
                            {trainer.matchScore}%
                          </span>
                        </div>

                        {isCurrentAssigned ? (
                          <div className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <Check className="w-3.5 h-3.5" />
                            <span>Currently Assigned</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAssign(trainer.trainerName)}
                            className="px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 active:scale-95"
                          >
                            <Send className="w-3 h-3" />
                            <span>Assign to Course</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Match Score Bar */}
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          trainer.matchScore >= 95
                            ? 'bg-emerald-500'
                            : trainer.matchScore >= 85
                              ? 'bg-sky-500'
                              : 'bg-amber-500'
                        }`}
                        style={{ width: `${trainer.matchScore}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Institutional Capacity Summary Box */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Algorithm Criteria:</strong> Calculated from highest terminal degree (35%), verified research index (25%), years in radar/NWP operations (20%), and WMO accreditation (20%).
              </span>
            </div>
            <span className="font-mono text-[11px] text-slate-500 whitespace-nowrap">
              MoES Capacity Connect v2.6
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
