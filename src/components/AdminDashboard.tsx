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
  Play,
  Clock,
  Check,
  X,
  Eye,
  Sliders,
  Bell,
  Activity,
  Flame,
  Award,
  Filter,
  BarChart3,
  Send,
  RadioTower,
  Cpu
} from 'lucide-react';
import { 
  Station, 
  Trainee, 
  TeacherProfile, 
  DemoLecture, 
  FacultyJobOpening, 
  ActivityLog,
  AlertLevel,
  ApprovalRequest
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
  approvalRequests: ApprovalRequest[];
  onSelectStation: (st: Station) => void;
  onViewTeacherResume: (teacher: TeacherProfile) => void;
  onViewStudentProfile: (trainee: Trainee) => void;
  onPlayLecture: (lecture: DemoLecture) => void;
  onRecruitTeacher: (teacherId: string, roleStation: string) => void;
  onCommissionTrainee: (traineeId: string) => void;
  onAddJobOpening: (job: FacultyJobOpening) => void;
  onApproveRequest: (requestId: string, remarks?: string) => void;
  onRejectRequest: (requestId: string, remarks?: string) => void;
  onUpdateStationAlert?: (stationId: string, level: AlertLevel) => void;
  onOpenDrill: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stations,
  trainees,
  teachers,
  demoLectures,
  jobOpenings,
  activityLogs,
  approvalRequests,
  onSelectStation,
  onViewTeacherResume,
  onViewStudentProfile,
  onPlayLecture,
  onRecruitTeacher,
  onCommissionTrainee,
  onAddJobOpening,
  onApproveRequest,
  onRejectRequest,
  onUpdateStationAlert,
  onOpenDrill,
}) => {
  const { isBright } = useTheme();

  // Active Tab: Approvals is primary to meet user request!
  const [activeTab, setActiveTab] = useState<'approvals' | 'analytics-dossiers' | 'system-controls' | 'recruitment' | 'commissioning' | 'stations'>('approvals');
  
  // Approvals Filter State
  const [approvalRoleFilter, setApprovalRoleFilter] = useState<'All' | 'Trainer' | 'Trainee'>('All');
  const [approvalStatusFilter, setApprovalStatusFilter] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [approvalSearch, setApprovalSearch] = useState('');
  const [reviewRemarksMap, setReviewRemarksMap] = useState<Record<string, string>>({});

  // Teacher / Student Dossier Filter State
  const [teacherSearch, setTeacherSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [dossierView, setDossierView] = useState<'teachers' | 'students'>('teachers');

  // Job Opening State
  const [isAddingJob, setIsAddingJob] = useState(false);
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobStation, setNewJobStation] = useState('Central Training Institute, Pune');
  const [newJobCode, setNewJobCode] = useState('PUN-CTI');
  const [newJobType, setNewJobType] = useState<FacultyJobOpening['type']>('Full-Time Faculty');
  const [newJobSalary, setNewJobSalary] = useState('₹1,40,000 - ₹1,80,000 / month (Level-13 7th CPC)');
  const [newJobExperience, setNewJobExperience] = useState('8+ Years Doppler Radar Meteorology');
  const [newJobDesc, setNewJobDesc] = useState('Deliver advanced operational training for S-Band polarimetric radar stations.');

  // System Controls State
  const [isCrisisSimulationMode, setIsCrisisSimulationMode] = useState(false);
  const [radarNetworkTransmissionLocked, setRadarNetworkTransmissionLocked] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastLevel, setBroadcastLevel] = useState<AlertLevel>('Red');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Statistics Calculations
  const pendingRequestsCount = approvalRequests.filter((r) => r.status === 'Pending').length;
  const trainerRequestsCount = approvalRequests.filter((r) => r.requesterRole === 'Trainer').length;
  const traineeRequestsCount = approvalRequests.filter((r) => r.requesterRole === 'Trainee').length;

  const totalPublishedLectures = demoLectures.length;
  const totalTeacherPublications = teachers.reduce((acc, t) => acc + t.publicationsCount, 0);
  const avgTeacherExperience = (teachers.reduce((acc, t) => acc + t.experienceYears, 0) / (teachers.length || 1)).toFixed(1);
  const avgTeacherRating = (teachers.reduce((acc, t) => acc + t.rating, 0) / (teachers.length || 1)).toFixed(2);

  const totalTraineesCount = trainees.length;
  const avgTraineeXP = Math.round(trainees.reduce((acc, t) => acc + t.xp, 0) / (trainees.length || 1));
  const avgCompletionRate = Math.round(trainees.reduce((acc, t) => acc + t.completionRate, 0) / (trainees.length || 1));
  const certifiedTraineesCount = trainees.filter((t) => t.status === 'Certified').length;
  const pendingCommissionCount = trainees.filter((t) => t.status === 'Evaluation Due' || t.status === 'In Training').length;

  // Filter Approvals
  const filteredApprovals = approvalRequests.filter((req) => {
    const matchesRole = approvalRoleFilter === 'All' || req.requesterRole === approvalRoleFilter;
    const matchesStatus = approvalStatusFilter === 'All' || req.status === approvalStatusFilter;
    const matchesSearch = 
      req.title.toLowerCase().includes(approvalSearch.toLowerCase()) ||
      req.requesterName.toLowerCase().includes(approvalSearch.toLowerCase()) ||
      req.category.toLowerCase().includes(approvalSearch.toLowerCase()) ||
      req.stationOrInstitute.toLowerCase().includes(approvalSearch.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  // Filter Teachers & Students
  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.institution.toLowerCase().includes(teacherSearch.toLowerCase()) ||
    t.specializations.some((s) => s.toLowerCase().includes(teacherSearch.toLowerCase()))
  );

  const filteredStudents = trainees.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.badgeNumber.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.stationName.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.levelTitle.toLowerCase().includes(studentSearch.toLowerCase())
  );

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

  const handleBroadcastAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    sound.playAlarm();
    if (onUpdateStationAlert) {
      stations.forEach((st) => onUpdateStationAlert(st.id, broadcastLevel));
    }
    setBroadcastSuccess(true);
    setTimeout(() => {
      setBroadcastSuccess(false);
      setBroadcastMessage('');
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Apex Admin Command Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isBright
          ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border-slate-700 shadow-xl'
          : 'bg-gradient-to-r from-[#0a0f1d] via-[#0d1629] to-[#0f1d38] border-cyan-500/40 text-white shadow-2xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_20px_rgba(251,191,36,0.25)]">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 border border-amber-400/40 text-amber-300">
                  Apex Supreme Governance
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  Mausam Bhawan • New Delhi
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Director General Administrative Command Console
              </h2>
              <p className="text-xs text-slate-300 max-w-2xl mt-0.5">
                Full operational oversight: approve requisitions from trainers and trainees, inspect live faculty & cadet dossiers, configure national radar locks, and govern workforce commissioning.
              </p>
            </div>
          </div>

          {/* Quick Apex Status Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
              <div className="text-[10px] font-semibold text-slate-300 uppercase">Pending Approvals</div>
              <div className="text-base font-black text-amber-400 flex items-center gap-1.5">
                <span>{pendingRequestsCount}</span>
                <span className="text-xs font-normal text-slate-300">requests</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
              <div className="text-[10px] font-semibold text-slate-300 uppercase">Awaiting Commission</div>
              <div className="text-base font-black text-emerald-400 flex items-center gap-1.5">
                <span>{pendingCommissionCount}</span>
                <span className="text-xs font-normal text-slate-300">cadets</span>
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-white/15 backdrop-blur-md">
              <div className="text-[10px] font-semibold text-slate-300 uppercase">Network Readiness</div>
              <div className="text-base font-black text-cyan-400">92%</div>
            </div>

            <button
              onClick={() => {
                sound.playBlip(700);
                setActiveTab('system-controls');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>System Controls</span>
            </button>
          </div>
        </div>
      </div>

      {/* Admin Tab Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {/* TAB 1: APPROVALS */}
        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveTab('approvals');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'approvals'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Approvals & Requisitions Desk</span>
          {pendingRequestsCount > 0 && (
            <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
              activeTab === 'approvals' ? 'bg-slate-950 text-amber-400' : 'bg-amber-500 text-slate-950'
            }`}>
              {pendingRequestsCount} Pending
            </span>
          )}
        </button>

        {/* TAB 2: ANALYTICS & PROFILES */}
        <button
          onClick={() => {
            sound.playBlip(650);
            setActiveTab('analytics-dossiers');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics-dossiers'
              ? 'bg-black text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Teacher & Student Stats & Profiles</span>
        </button>

        {/* TAB 3: SYSTEM CONTROLS */}
        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('system-controls');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'system-controls'
              ? 'bg-black text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Apex System Controls</span>
        </button>

        {/* TAB 4: RECRUITMENT */}
        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveTab('recruitment');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'recruitment'
              ? 'bg-black text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Faculty Recruitment ({teachers.length})</span>
        </button>

        {/* TAB 5: COMMISSIONING LOCKS */}
        <button
          onClick={() => {
            sound.playBlip(650);
            setActiveTab('commissioning');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'commissioning'
              ? 'bg-black text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Trainee Accreditation Locks ({pendingCommissionCount})</span>
        </button>

        {/* TAB 6: STATIONS */}
        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveTab('stations');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'stations'
              ? 'bg-black text-white dark:bg-cyan-500 dark:text-slate-950 shadow-md'
              : 'text-slate-600 hover:text-black hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>DWR Stations Telemetry ({stations.length})</span>
        </button>
      </div>

      {/* =========================================================================
          VIEW 1: APPROVALS & REQUISITIONS DESK (CRITICAL USER REQUIREMENT)
      ========================================================================= */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            {/* Header & Sub-filters */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    Director General Requisition & Clearance Desk
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                    Dual Authority: Trainers & Trainees
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Review and authorize radar simulator lab clearances, demo lecture broadcast releases, research slots, exam certifications, and faculty requisitions.
                </p>
              </div>

              {/* Search */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search request title, person, category..."
                  value={approvalSearch}
                  onChange={(e) => setApprovalSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border ${
                    isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>
            </div>

            {/* Filter Pills Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Requester:</span>
                {(['All', 'Trainer', 'Trainee'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      sound.playBlip(600);
                      setApprovalRoleFilter(role);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      approvalRoleFilter === role
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400'
                    }`}
                  >
                    {role === 'All' ? 'All Roles' : `${role}s Only`}
                    {role === 'Trainer' && ` (${trainerRequestsCount})`}
                    {role === 'Trainee' && ` (${traineeRequestsCount})`}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => {
                      sound.playBlip(600);
                      setApprovalStatusFilter(st);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      approvalStatusFilter === st
                        ? st === 'Pending' 
                          ? 'bg-amber-500 text-slate-950 font-black' 
                          : st === 'Approved'
                            ? 'bg-emerald-600 text-white'
                            : st === 'Rejected'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Requests Cards List */}
            {filteredApprovals.length === 0 ? (
              <div className="text-center py-12 text-slate-400 border border-dashed rounded-2xl border-slate-300 dark:border-slate-800">
                <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-sm font-semibold">No requests matching this filter criteria</p>
                <p className="text-xs text-slate-500 mt-1">All queues are clear or no matching records found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredApprovals.map((req) => {
                  const isPending = req.status === 'Pending';
                  const isApproved = req.status === 'Approved';
                  const isRejected = req.status === 'Rejected';

                  return (
                    <div
                      key={req.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isPending
                          ? isBright
                            ? 'bg-amber-50/40 border-amber-300 shadow-xs'
                            : 'bg-amber-950/20 border-amber-800/60'
                          : isApproved
                            ? isBright
                              ? 'bg-emerald-50/30 border-emerald-200'
                              : 'bg-emerald-950/20 border-emerald-900/40'
                            : isBright
                              ? 'bg-rose-50/30 border-rose-200'
                              : 'bg-rose-950/20 border-rose-900/40'
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5 flex-1">
                          {/* Role Icon Badge */}
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                            req.requesterRole === 'Trainer'
                              ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                              : 'bg-cyan-500/15 border-cyan-500/30 text-cyan-600 dark:text-cyan-400'
                          }`}>
                            {req.requesterRole === 'Trainer' ? (
                              <Briefcase className="w-5 h-5" />
                            ) : (
                              <Award className="w-5 h-5" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md border ${
                                req.requesterRole === 'Trainer'
                                  ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-600 dark:text-indigo-400'
                                  : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-400'
                              }`}>
                                {req.requesterRole} Request
                              </span>

                              <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {req.category}
                              </span>

                              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                                req.urgency === 'Emergency'
                                  ? 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                                  : req.urgency === 'Priority'
                                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700'
                              }`}>
                                {req.urgency} Urgency
                              </span>

                              <span className="text-[11px] text-slate-400 font-mono ml-auto">
                                Submitted {req.submittedAt}
                              </span>
                            </div>

                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {req.title}
                            </h4>
                            
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                              {req.details}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              <span><strong>Requester:</strong> {req.requesterName} ({req.requesterTitle})</span>
                              <span>•</span>
                              <span><strong>Station/Center:</strong> {req.stationOrInstitute}</span>
                            </div>

                            {/* Reviewed Info if already reviewed */}
                            {req.reviewedBy && (
                              <div className="mt-3 p-2.5 rounded-lg bg-black/5 dark:bg-black/30 border border-slate-200 dark:border-slate-800 text-xs flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                                    {req.status} by {req.reviewedBy} on {req.reviewedAt}
                                  </div>
                                  {req.adminRemarks && (
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 italic">
                                      &ldquo;{req.adminRemarks}&rdquo;
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions Right Side */}
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 lg:pl-4 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800 pt-3 lg:pt-0 w-full lg:w-auto">
                          {isPending ? (
                            <div className="flex flex-col gap-2 w-full sm:w-64">
                              <input
                                type="text"
                                placeholder="Admin remarks / clearance ref..."
                                value={reviewRemarksMap[req.id] || ''}
                                onChange={(e) => setReviewRemarksMap({ ...reviewRemarksMap, [req.id]: e.target.value })}
                                className={`px-2.5 py-1.5 rounded-lg text-xs border ${
                                  isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                                }`}
                              />
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    sound.playSuccess();
                                    onApproveRequest(req.id, reviewRemarksMap[req.id] || 'Cleared and authorized by DG IMD.');
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  onClick={() => {
                                    sound.playBlip(500);
                                    onRejectRequest(req.id, reviewRemarksMap[req.id] || 'Declined. Revision or departmental re-submission required.');
                                  }}
                                  className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                                >
                                  <X className="w-3.5 h-3.5" />
                                  <span>Reject</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                                isApproved
                                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                  : 'bg-rose-500/15 border-rose-500/40 text-rose-600 dark:text-rose-400'
                              }`}>
                                {isApproved ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                                <span>{req.status}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: TEACHER & STUDENT ANALYTICS & PROFILES (USER REQUIREMENT)
      ========================================================================= */}
      {activeTab === 'analytics-dossiers' && (
        <div className="space-y-6">
          {/* Top Level Macro Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculty Roster</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{teachers.length} Instructors</div>
              <div className="text-xs text-slate-500 mt-0.5">{avgTeacherExperience} yrs avg experience</div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Cadets & Trainees</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalTraineesCount} Enrolled</div>
              <div className="text-xs text-emerald-500 font-semibold mt-0.5">{certifiedTraineesCount} fully certified</div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Curriculum Output</div>
              <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalPublishedLectures} Demo Lectures</div>
              <div className="text-xs text-slate-500 mt-0.5">{totalTeacherPublications} scientific papers</div>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cadet Mastery Level</div>
              <div className="text-2xl font-black text-amber-500 mt-1">{avgTraineeXP.toLocaleString()} XP Avg</div>
              <div className="text-xs text-slate-500 mt-0.5">{avgCompletionRate}% syllabus completion</div>
            </div>
          </div>

          {/* Dossier Selector Bar */}
          <div className={`p-5 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => {
                    sound.playBlip(600);
                    setDossierView('teachers');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dossierView === 'teachers'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Teacher Profiles & Credentials ({teachers.length})</span>
                </button>
                <button
                  onClick={() => {
                    sound.playBlip(600);
                    setDossierView('students');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    dossierView === 'students'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Student Profiles & Animal Ranks ({trainees.length})</span>
                </button>
              </div>

              {/* Dynamic search input based on subview */}
              <div className="relative w-full md:w-72">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={dossierView === 'teachers' ? "Search teacher by name or skill..." : "Search student by name, badge, station..."}
                  value={dossierView === 'teachers' ? teacherSearch : studentSearch}
                  onChange={(e) => dossierView === 'teachers' ? setTeacherSearch(e.target.value) : setStudentSearch(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 rounded-xl text-xs border ${
                    isBright ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>
            </div>

            {/* SUB-VIEW A: TEACHERS DOSSIER */}
            {dossierView === 'teachers' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredTeachers.map((teach) => (
                  <div
                    key={teach.id}
                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                      isBright
                        ? 'bg-slate-50/80 hover:bg-slate-50 border-slate-200 hover:border-slate-300'
                        : 'bg-[#0f192e] hover:bg-[#121f3a] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-slate-800 dark:text-slate-100 shadow-xs shrink-0">
                        {teach.name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                            {teach.name}
                          </h4>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shrink-0">
                            {teach.rating} ★ Rating
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                          {teach.title}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {teach.institution} • {teach.experienceYears} Yrs Exp • {teach.publicationsCount} Papers
                        </p>
                      </div>
                    </div>

                    {/* Hardware & Specializations */}
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

                    {/* Direct Admin Access Button to Teacher Profile/Resume */}
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          sound.playBlip(700);
                          onViewTeacherResume(teach);
                        }}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                          isBright
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5 text-sky-500" />
                        <span>Inspect Full Profile & CV</span>
                      </button>

                      <button
                        onClick={() => {
                          sound.playSuccess();
                          onRecruitTeacher(teach.id, 'Central Training Institute, Pune');
                        }}
                        className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                          teach.recruitmentStatus === 'Commissioned IMD Faculty'
                            ? 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                        }`}
                      >
                        {teach.recruitmentStatus === 'Commissioned IMD Faculty' ? 'Commissioned' : 'Recruit'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW B: STUDENTS DOSSIER */}
            {dossierView === 'students' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredStudents.map((stu) => {
                  const isLocked = stu.status === 'In Training' || stu.status === 'Evaluation Due';

                  return (
                    <div
                      key={stu.id}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                        isBright
                          ? 'bg-slate-50/80 hover:bg-slate-50 border-slate-200'
                          : 'bg-[#0f192e] hover:bg-[#121f3a] border-slate-800'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 flex items-center justify-center font-bold text-sm text-indigo-700 dark:text-indigo-300 shadow-xs shrink-0">
                          {stu.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                              {stu.name}
                            </h4>
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shrink-0 ${
                              stu.status === 'Certified'
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                                : 'bg-amber-500/15 border-amber-500/40 text-amber-600 dark:text-amber-400'
                            }`}>
                              {stu.status}
                            </span>
                          </div>

                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate mt-0.5">
                            {stu.designation} • {stu.stationName}
                          </p>

                          <div className="flex items-center gap-3 mt-1.5 text-xs">
                            <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                              <Flame className="w-3.5 h-3.5 fill-amber-500" />
                              {stu.streakDays}d Streak
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-mono text-slate-500">{stu.xp.toLocaleString()} XP</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-mono text-slate-500">L{stu.level}</span>
                          </div>
                        </div>
                      </div>

                      {/* Radar Competency Bars */}
                      <div className="space-y-1.5 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
                        <div className="flex justify-between font-mono text-slate-600 dark:text-slate-300">
                          <span>Doppler Radar Skill</span>
                          <span className="font-bold">{stu.competency.radarMeteorology}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-500 h-full rounded-full"
                            style={{ width: `${stu.competency.radarMeteorology}%` }}
                          />
                        </div>
                      </div>

                      {/* Direct Admin Access Button to Student Profile Dossier */}
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            sound.playBlip(700);
                            onViewStudentProfile(stu);
                          }}
                          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                            isBright
                              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800 shadow-xs'
                              : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                          }`}
                        >
                          <Eye className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Inspect Student Profile & Streaks</span>
                        </button>

                        {isLocked && (
                          <button
                            onClick={() => {
                              sound.playSuccess();
                              onCommissionTrainee(stu.id);
                            }}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                          >
                            Commission
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: APEX SYSTEM CONTROLS (GIVES ADMIN ALL THE CONTROLS)
      ========================================================================= */}
      {activeTab === 'system-controls' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <h3 className={`text-base font-bold tracking-tight mb-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Apex Executive Operations & Telemetry Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Critical administrative controls reserved strictly for Director General of Meteorology and Apex IMD Headquarters.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Control 1: Global Operational Mode vs Crisis Simulation */}
              <div className={`p-5 rounded-2xl border ${
                isCrisisSimulationMode
                  ? 'bg-rose-500/10 border-rose-500/40'
                  : isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-rose-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      National Crisis Simulation Mode
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      sound.playAlarm();
                      setIsCrisisSimulationMode(!isCrisisSimulationMode);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      isCrisisSimulationMode
                        ? 'bg-rose-600 text-white border-rose-500'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                    }`}
                  >
                    {isCrisisSimulationMode ? 'ACTIVE: CRISIS DRILL' : 'STANDBY: NORMAL OPS'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  When engaged, injects synchronized severe cyclone / squall nowcasting scenarios across all 32 trainee radar consoles simultaneously.
                </p>
                <div className="mt-4">
                  <button
                    onClick={onOpenDrill}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                  >
                    Dispatch Emergency Supercell Cyclone Drill Now
                  </button>
                </div>
              </div>

              {/* Control 2: Radar Network Transmission Lock */}
              <div className={`p-5 rounded-2xl border ${
                radarNetworkTransmissionLocked
                  ? 'bg-amber-500/10 border-amber-500/40'
                  : isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/50 border-slate-800'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <RadioTower className="w-5 h-5 text-amber-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      DWR Transmitter Frequency Lock
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      sound.playBlip(750);
                      setRadarNetworkTransmissionLocked(!radarNetworkTransmissionLocked);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      radarNetworkTransmissionLocked
                        ? 'bg-amber-600 text-white border-amber-500'
                        : 'bg-emerald-600 text-white border-emerald-500'
                    }`}
                  >
                    {radarNetworkTransmissionLocked ? 'LOCKED (SAFETY PROTOCOL)' : 'UNLOCKED (ALL FREQUENCIES)'}
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Locks pulse repetition frequencies (PRF) on S/C/X band weather radars to prevent unauthorized calibration adjustments during severe cyclone watches.
                </p>
                <div className="mt-4 text-[11px] font-mono text-slate-400">
                  Status: {radarNetworkTransmissionLocked ? 'Safety lock engaged across 32 radar transmitters' : 'Standard WMO dual-pol scan mode running'}
                </div>
              </div>
            </div>

            {/* Control 3: Mass Weather Flash Warning Alert Dispatcher */}
            <div className={`mt-6 p-5 rounded-2xl border ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/40 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  National Severe Weather Broadcast Dispatcher
                </h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Instantly transmit a priority weather alert directive across all Regional Meteorological Centres (RMCs) and update station alert tiers.
              </p>

              <form onSubmit={handleBroadcastAlert} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={broadcastLevel}
                    onChange={(e) => setBroadcastLevel(e.target.value as AlertLevel)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                      broadcastLevel === 'Red'
                        ? 'bg-rose-500 text-white'
                        : broadcastLevel === 'Orange'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-emerald-600 text-white'
                    }`}
                  >
                    <option value="Red">Red Alert (Severe Action Required)</option>
                    <option value="Orange">Orange Alert (High Preparedness)</option>
                    <option value="Yellow">Yellow Alert (Watch & Monitor)</option>
                    <option value="Green">Green Alert (Routine Baseline)</option>
                  </select>

                  <input
                    type="text"
                    required
                    placeholder="Broadcast text e.g., 'Emergency: Severe squall line crossing Bay of Bengal coast. RMC Chennai on 100% vigilance.'"
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className={`flex-1 px-3 py-2 rounded-xl text-xs border ${
                      isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  />

                  <button
                    type="submit"
                    className="px-5 py-2 bg-black dark:bg-white text-white dark:text-slate-950 rounded-xl text-xs font-bold shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Broadcast</span>
                  </button>
                </div>

                {broadcastSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Broadcast successfully transmitted to all 32 Doppler Radar stations. Alert levels synchronized.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 4: RECRUITMENT & JOB OPENINGS
      ========================================================================= */}
      {activeTab === 'recruitment' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Faculty Recruitment & Vacancies
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Publish sanctioned teaching posts for CTI Pune, RMC training academies, and Doppler radar observatories.
                </p>
              </div>

              <button
                onClick={() => setIsAddingJob(!isAddingJob)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish New Requisition</span>
              </button>
            </div>

            {/* Collapsible New Job Form */}
            {isAddingJob && (
              <form onSubmit={handleCreateJob} className={`p-5 rounded-2xl border space-y-4 mb-6 ${
                isBright ? 'bg-sky-50/60 border-sky-300' : 'bg-cyan-950/20 border-cyan-500/40'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-cyan-400">
                    Broadcast Sanctioned Teaching Post
                  </h4>
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
                      placeholder="e.g., Chief Cyclone Dynamics & Coastal Radar Specialist"
                      value={newJobTitle}
                      onChange={(e) => setNewJobTitle(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Location / Training Institute</label>
                    <input
                      type="text"
                      value={newJobStation}
                      onChange={(e) => setNewJobStation(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow cursor-pointer"
                  >
                    Broadcast Requisition
                  </button>
                </div>
              </form>
            )}

            {/* Active Job Openings List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobOpenings.map((job) => (
                <div
                  key={job.id}
                  className={`p-4 rounded-xl border ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs font-bold text-sky-600 dark:text-cyan-400">
                      {job.stationCode}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      {job.type}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{job.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{job.stationName}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">{job.description}</p>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between text-xs text-slate-400 font-mono">
                    <span>{job.applicantsCount} Applicants</span>
                    <span>Deadline: {job.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 5: TRAINEE ACCREDITATION LOCKS
      ========================================================================= */}
      {activeTab === 'commissioning' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Trainee Accreditation & Commissioning Locks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Authorize cadets who have completed radar simulator hours and passed competency exams to enter Active Duty.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                isBright ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-amber-950 text-amber-300 border-amber-800'
              }`}>
                {pendingCommissionCount} Awaiting Authorization
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
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-200 shrink-0">
                        {t.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
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
                      <button
                        onClick={() => {
                          sound.playBlip(700);
                          onViewStudentProfile(t);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isBright
                            ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                            : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                        }`}
                      >
                        Inspect Dossier
                      </button>

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
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Commission
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

      {/* =========================================================================
          VIEW 6: STATIONS TELEMETRY
      ========================================================================= */}
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
