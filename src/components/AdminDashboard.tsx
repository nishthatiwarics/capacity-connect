import React, { useState } from 'react';
import { 
  Shield, 
  Briefcase, 
  Users, 
  Radio, 
  FileText, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  UserCheck, 
  Plus, 
  Video, 
  Star, 
  Download, 
  Search, 
  Sparkles, 
  Building, 
  AlertTriangle,
  Play
} from 'lucide-react';
import { 
  Station, 
  Trainee, 
  TeacherProfile, 
  DemoLecture, 
  FacultyJobOpening, 
  ActivityLog,
  AlertLevel
} from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface AdminDashboardProps {
  stations: Station[];
  trainees: Trainee[];
  teachers: TeacherProfile[];
  demoLectures: DemoLecture[];
  jobOpenings: FacultyJobOpening[];
  activityLogs: ActivityLog[];
  onSelectStation: (st: Station) => void;
  onViewTeacherResume: (teacher: TeacherProfile) => void;
  onPlayLecture: (lecture: DemoLecture) => void;
  onRecruitTeacher: (teacherId: string, roleStation: string) => void;
  onCommissionTrainee: (traineeId: string) => void;
  onAddJobOpening: (job: FacultyJobOpening) => void;
  onOpenDrill: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stations,
  trainees,
  teachers,
  demoLectures,
  jobOpenings,
  activityLogs,
  onSelectStation,
  onViewTeacherResume,
  onPlayLecture,
  onRecruitTeacher,
  onCommissionTrainee,
  onAddJobOpening,
  onOpenDrill,
}) => {
  const { isBright } = useTheme();

  const [activeTab, setActiveTab] = useState<'recruitment' | 'commissioning' | 'stations'>('recruitment');
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('All');
  const [isAddingJob, setIsAddingJob] = useState(false);

  // New Job Opening State
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobStation, setNewJobStation] = useState('Central Training Institute, Pune');
  const [newJobCode, setNewJobCode] = useState('PUN-CTI');
  const [newJobType, setNewJobType] = useState<FacultyJobOpening['type']>('Full-Time Faculty');
  const [newJobSalary, setNewJobSalary] = useState('₹1,40,000 - ₹1,80,000 / month (Level-13 7th CPC)');
  const [newJobExperience, setNewJobExperience] = useState('8+ Years Doppler Radar Meteorology');
  const [newJobDesc, setNewJobDesc] = useState('Deliver advanced operational training for S-Band polarimetric radar stations.');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJobTitle.trim()) return;

    const created: FacultyJobOpening = {
      id: `job-${Date.now()}`,
      stationCode: newJobCode,
      stationName: newJobStation,
      title: newJobTitle.trim(),
      department: 'Directorate of Forecaster Training & Radar Engineering',
      location: newJobStation,
      type: newJobType,
      experienceRequired: newJobExperience,
      salaryRange: newJobSalary,
      description: newJobDesc,
      requiredSkills: ['Doppler Radar', 'WMO Standards', 'Severe Nowcasting'],
      applicantsCount: 0,
      deadline: '31 Oct 2026',
      postedDate: 'Just now',
      status: 'Open',
    };

    sound.playSuccess();
    onAddJobOpening(created);
    setIsAddingJob(false);
    setNewJobTitle('');
  };

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.institution.toLowerCase().includes(teacherSearch.toLowerCase()) ||
      t.specializations.some((s) => s.toLowerCase().includes(teacherSearch.toLowerCase()));

    const matchesSpec =
      selectedSpecialization === 'All' ||
      t.specializations.some((s) => s.toLowerCase().includes(selectedSpecialization.toLowerCase()));

    return matchesSearch && matchesSpec;
  });

  // Trainees with uncommissioned status or evaluation due
  const pendingTrainees = trainees.filter(
    (t) => t.status === 'Evaluation Due' || t.status === 'In Training'
  );

  return (
    <div className="space-y-6">
      {/* Top Admin Apex Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isBright
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#0d1629] border-cyan-900/40 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/30 border border-amber-500/40 flex items-center justify-center text-amber-500 shrink-0">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Admin Command HQ — Dr. M. Mohapatra
                </h1>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full ${
                  isBright ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                }`}>
                  Director General IMD
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Apex Meteorological Administration • Teacher Recruitment Platform & Trainee Accreditation Locks
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddingJob(!isAddingJob)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-xs bg-black hover:bg-neutral-800 text-white cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Teaching Job Opening</span>
            </button>

            <button
              onClick={onOpenDrill}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                isBright
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-amber-950/40 hover:bg-amber-900/40 border-amber-700/50 text-amber-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>National Crisis Drill</span>
            </button>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t ${
          isBright ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Registered Teachers</span>
            <div className="text-xl font-bold text-black dark:text-white mt-0.5">
              {teachers.length} Faculty Profiles
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Free Demo Lectures</span>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {demoLectures.length} Hosted Videos
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Open Teaching Posts</span>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {jobOpenings.length} Requisitions
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Accreditation Locks</span>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
              {pendingTrainees.length} Pending Review
            </div>
          </div>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveTab('recruitment');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'recruitment'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Faculty & Teacher Recruitment Hub ({teachers.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(650);
            setActiveTab('commissioning');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'commissioning'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Trainee Accreditation Locks ({pendingTrainees.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('stations');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stations'
              ? 'bg-black text-white shadow-xs'
              : 'text-slate-600 hover:text-black hover:bg-slate-100'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>National Doppler Radar Stations ({stations.length})</span>
        </button>
      </div>

      {/* MODAL / COLLAPSIBLE: CREATE NEW FACULTY JOB OPENING */}
      {isAddingJob && (
        <form onSubmit={handleCreateJob} className={`p-6 rounded-2xl border space-y-4 animate-in slide-in-from-top-3 ${
          isBright ? 'bg-sky-50/60 border-sky-300' : 'bg-cyan-950/20 border-cyan-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-500" />
              <span>Publish New Faculty Teaching Requisition</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddingJob(false)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Position Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Senior Dual-Polarization Doppler Instructor"
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Radar Station / Training Centre</label>
              <input
                type="text"
                value={newJobStation}
                onChange={(e) => setNewJobStation(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Appointment Type</label>
              <select
                value={newJobType}
                onChange={(e) => setNewJobType(e.target.value as FacultyJobOpening['type'])}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              >
                <option value="Full-Time Faculty">Full-Time Faculty</option>
                <option value="Visiting Lecturer">Visiting Lecturer</option>
                <option value="Research Mentor">Research Mentor</option>
                <option value="Doppler Radar Specialist">Doppler Radar Specialist</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Experience Criteria</label>
              <input
                type="text"
                value={newJobExperience}
                onChange={(e) => setNewJobExperience(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Salary / Honorarium Scale</label>
              <input
                type="text"
                value={newJobSalary}
                onChange={(e) => setNewJobSalary(e.target.value)}
                className={`w-full p-2 rounded-lg border text-xs ${
                  isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Job Description & Teaching Scope</label>
            <textarea
              rows={2}
              value={newJobDesc}
              onChange={(e) => setNewJobDesc(e.target.value)}
              className={`w-full p-2 rounded-lg border text-xs ${
                isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
              }`}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow"
            >
              Broadcast Requisition to Teachers
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: TEACHER RECRUITMENT PLATFORM */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Teacher Resume Platform & Recruitment Roster
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Teachers easily upload their resume here; Admins and regional stations can inspect qualifications, watch demo lectures, and recruit faculty with one click.
                </p>
              </div>

              {/* Filter controls */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name, radar, university..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Teacher Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTeachers.map((teach) => (
                <div
                  key={teach.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isBright
                      ? 'bg-slate-50/80 hover:bg-slate-50 hover:border-sky-300 border-slate-200'
                      : 'bg-[#0f192e] hover:bg-[#121f3a] hover:border-cyan-500/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <img
                      src={teach.avatar}
                      alt={teach.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-black shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 truncate">
                          <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                            {teach.name}
                          </h4>
                          {teach.verifiedBadge && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white shrink-0" />
                          )}
                        </div>
                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 ${
                          teach.recruitmentStatus === 'Available for Recruitment'
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500'
                            : 'bg-slate-100 border-slate-300 text-black dark:bg-slate-800 dark:border-slate-700 dark:text-white'
                        }`}>
                          {teach.recruitmentStatus}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-black dark:text-white truncate mt-0.5">
                        {teach.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {teach.institution} • {teach.experienceYears} Yrs Exp • {teach.publicationsCount} Papers
                      </p>
                    </div>
                  </div>

                  {/* Specializations & Hardware Pills */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap gap-1">
                      {teach.specializations.slice(0, 3).map((spec, i) => (
                        <span
                          key={i}
                          className={`px-1.5 py-0.5 text-[10px] rounded border ${
                            isBright ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                          }`}
                        >
                          {spec}
                        </span>
                      ))}
                      {teach.specializations.length > 3 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-slate-400 font-mono">
                          +{teach.specializations.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions: View Resume, Watch Demo, Recruit */}
                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onViewTeacherResume(teach)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                          isBright
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-sky-500" />
                        <span>View Resume</span>
                      </button>

                      {/* Demo lecture preview button if available */}
                      {demoLectures.find((d) => d.teacherId === teach.id || d.teacherName === teach.name) && (
                        <button
                          onClick={() => {
                            const lec = demoLectures.find(
                              (d) => d.teacherId === teach.id || d.teacherName === teach.name
                            );
                            if (lec) onPlayLecture(lec);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                        >
                          <Play className="w-3 h-3" />
                          <span>Watch Demo</span>
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        sound.playSuccess();
                        onRecruitTeacher(teach.id, 'Central Training Institute, Pune');
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
                        teach.recruitmentStatus === 'Commissioned IMD Faculty'
                          ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                          : isBright
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      }`}
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{teach.recruitmentStatus === 'Commissioned IMD Faculty' ? 'Commissioned' : 'Recruit to Station'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TRAINEE ACCREDITATION LOCKS */}
      {activeTab === 'commissioning' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Trainee Accreditation Lock Oversight
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Unapproved trainees sign in to the Accreditation Lock portal before Admin commissioning. Review progress and authorize operational clearance.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                isBright ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {pendingTrainees.length} Awaiting Commissioning
              </span>
            </div>

            <div className="space-y-3">
              {trainees.map((t) => {
                const isLocked = t.status === 'In Training' || t.status === 'Evaluation Due';

                return (
                  <div
                    key={t.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      isLocked
                        ? isBright
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-amber-950/20 border-amber-800/40'
                        : isBright
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {t.name}
                          </h4>
                          <span className="font-mono text-[10px] text-slate-400">
                            {t.badgeNumber}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.designation} • {t.stationName}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                          <span>Radar: {t.competency.radarMeteorology}%</span>
                          <span>•</span>
                          <span>Nowcasting: {t.competency.severeNowcasting}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                        isLocked
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          : 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                      }`}>
                        {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                        <span>{t.status}</span>
                      </span>

                      {isLocked && (
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            onCommissionTrainee(t.id);
                          }}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                            isBright
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                          }`}
                        >
                          Commission Forecaster
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: NATIONAL STATIONS */}
      {activeTab === 'stations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map((st) => (
            <div
              key={st.id}
              onClick={() => onSelectStation(st)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all hover:scale-[1.01] ${
                isBright
                  ? 'bg-white hover:border-sky-300 border-slate-200 shadow-sm'
                  : 'bg-[#0d1629] hover:border-cyan-500/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-cyan-400">
                  {st.code}
                </span>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  st.alertLevel === 'Red'
                    ? 'bg-rose-500/20 text-rose-500'
                    : st.alertLevel === 'Orange'
                      ? 'bg-amber-500/20 text-amber-500'
                      : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {st.alertLevel} Alert
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{st.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{st.radarType}</p>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs font-mono">
                <span>Capacity: {st.activeTrainees}/{st.totalCapacity}</span>
                <span className="text-emerald-500 font-bold">{st.readinessScore}% Readiness</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
