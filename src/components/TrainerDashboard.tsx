import React, { useState } from 'react';
import { 
  GraduationCap, 
  Video, 
  FileText, 
  Briefcase, 
  Upload, 
  Plus, 
  CheckCircle2, 
  Star, 
  Users, 
  Eye, 
  Clock, 
  Play, 
  Download, 
  Radio, 
  Building, 
  BookOpen, 
  Award, 
  Sparkles, 
  Send, 
  Check, 
  Edit3, 
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { TeacherProfile, DemoLecture, FacultyJobOpening, ApprovalRequest, TrainerQuestionnaire } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import { TrainerQuestionnaireManager } from './TrainerQuestionnaireManager';
import { INITIAL_TRAINER_QUESTIONNAIRES, INITIAL_TRAINEE_SUBMISSIONS } from '../data/sihPortalData';

interface TrainerDashboardProps {
  teacher: TeacherProfile;
  demoLectures: DemoLecture[];
  jobOpenings: FacultyJobOpening[];
  approvalRequests?: ApprovalRequest[];
  onUpdateTeacher: (updated: TeacherProfile) => void;
  onOpenUploadLecture: () => void;
  onOpenUploadStudyMaterial?: () => void;
  onPlayLecture: (lecture: DemoLecture) => void;
  onViewTeacherResume: (teacher: TeacherProfile) => void;
  onApplyForJob: (jobId: string) => void;
  onSubmitApprovalRequest?: (req: Omit<ApprovalRequest, 'id' | 'status' | 'submittedAt'>) => void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  teacher,
  demoLectures,
  jobOpenings,
  approvalRequests = [],
  onUpdateTeacher,
  onOpenUploadLecture,
  onOpenUploadStudyMaterial,
  onPlayLecture,
  onViewTeacherResume,
  onApplyForJob,
  onSubmitApprovalRequest,
}) => {
  const { isBright } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState<'questionnaires' | 'resume' | 'lectures' | 'recruitment' | 'requisitions'>('questionnaires');
  const [isEditingResume, setIsEditingResume] = useState(false);

  // SIH Questionnaires state
  const [questionnaires, setQuestionnaires] = useState<TrainerQuestionnaire[]>(INITIAL_TRAINER_QUESTIONNAIRES);
  const [submissions, setSubmissions] = useState(INITIAL_TRAINEE_SUBMISSIONS);

  // New Requisition Form State
  const [reqCategory, setReqCategory] = useState<ApprovalRequest['category']>('Radar Research Transmission Slot');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDetails, setReqDetails] = useState('');
  const [reqUrgency, setReqUrgency] = useState<ApprovalRequest['urgency']>('Priority');
  const [reqSubmittedSuccess, setReqSubmittedSuccess] = useState(false);

  // Resume editing state
  const [editTitle, setEditTitle] = useState(teacher.title);
  const [editInstitution, setEditInstitution] = useState(teacher.institution);
  const [editExperienceYears, setEditExperienceYears] = useState(teacher.experienceYears);
  const [editQualification, setEditQualification] = useState(teacher.qualification);
  const [editBio, setEditBio] = useState(teacher.bio);
  const [editPhone, setEditPhone] = useState(teacher.phone || '+91 94220 88319');
  const [editSpecializations, setEditSpecializations] = useState(teacher.specializations.join(', '));
  const [newPublication, setNewPublication] = useState('');
  const [resumeUploadedSuccess, setResumeUploadedSuccess] = useState(false);

  const handleResumeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sound.playSuccess();
      const updated: TeacherProfile = {
        ...teacher,
        resumeFileName: file.name,
        resumeUploadedAt: 'Just now (Verified)',
      };
      onUpdateTeacher(updated);
      setResumeUploadedSuccess(true);
      setTimeout(() => setResumeUploadedSuccess(false), 4000);
    }
  };

  const handleSaveResumeDetails = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playSuccess();
    const updated: TeacherProfile = {
      ...teacher,
      title: editTitle,
      institution: editInstitution,
      experienceYears: Number(editExperienceYears) || teacher.experienceYears,
      qualification: editQualification,
      bio: editBio,
      phone: editPhone,
      specializations: editSpecializations.split(',').map((s) => s.trim()).filter(Boolean),
    };
    onUpdateTeacher(updated);
    setIsEditingResume(false);
  };

  const handleAddPublication = () => {
    if (!newPublication.trim()) return;
    sound.playBlip(750, 0.05);
    const updated: TeacherProfile = {
      ...teacher,
      publicationsCount: teacher.publicationsCount + 1,
      topPublications: [newPublication.trim(), ...teacher.topPublications],
    };
    onUpdateTeacher(updated);
    setNewPublication('');
  };

  const handleToggleRecruitmentStatus = () => {
    sound.playBlip(650, 0.05);
    const nextStatus =
      teacher.recruitmentStatus === 'Available for Recruitment'
        ? 'Commissioned IMD Faculty'
        : 'Available for Recruitment';
    onUpdateTeacher({
      ...teacher,
      recruitmentStatus: nextStatus,
    });
  };

  // Filter lectures authored by this trainer
  const teacherLectures = demoLectures.filter(
    (l) => l.teacherId === teacher.id || l.teacherName === teacher.name
  );

  return (
    <div className="space-y-6">
      {/* Top Welcome / Faculty Profile Header Card (PRYDA Radiant Aqua Glass Style) */}
      <div className="p-7 sm:p-8 rounded-[32px] pryda-glass-tray relative transition-all shadow-xl">
        <div className="absolute -top-16 -right-16 w-64 h-64 liquid-glass-bloom-cyan rounded-full pointer-events-none opacity-50 blur-2xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 liquid-glass-bloom-emerald rounded-full pointer-events-none opacity-30 blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              {teacher.avatar ? (
                <img
                  src={teacher.avatar}
                  alt={teacher.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400/60 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-sky-500/20 border-2 border-sky-400/60 flex items-center justify-center font-black text-xl text-sky-800 dark:text-sky-200 shadow-md">
                  {teacher.name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white shadow" title="Verified IMD Faculty">
                <Check className="w-3.5 h-3.5" />
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 dark:text-white">
                  {teacher.name}
                </h1>
                <span className="px-2.5 py-0.5 text-[10px] font-mono font-black uppercase rounded-full liquid-glass-pill liquid-glass-pill-sky text-white">
                  Faculty / Trainer Portal
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-black liquid-glass-pill-frosted border border-emerald-400/60 text-emerald-900 dark:text-emerald-300 rounded-full flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  MoES & IMD Verified
                </span>
              </div>

              <p className="text-xs font-black text-slate-950 dark:text-cyan-200 mt-1">
                {teacher.title}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-800 dark:text-slate-200 font-bold">
                <span className="flex items-center gap-1 text-slate-950 dark:text-slate-100 font-black">
                  <Building className="w-3.5 h-3.5 text-sky-600" />
                  {teacher.institution}
                </span>
                <span>•</span>
                <span className="font-extrabold text-slate-900 dark:text-slate-200">{teacher.experienceYears} Years Faculty Experience</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 font-black">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {teacher.rating} / 5.0 Rating
                </span>
              </div>
            </div>
          </div>

          {/* Organized Trainer Actions & Status Controls */}
          <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            {/* Group 1: Primary Publishing Actions */}
            <div className="flex items-center gap-2 p-1 rounded-2xl liquid-glass-pill-frosted border border-white/80 dark:border-white/15 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  sound.playBlip(700);
                  onOpenUploadLecture();
                }}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-full liquid-glass-pill liquid-glass-pill-emerald text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                title="Upload new free demo video lecture for trainees"
              >
                <Video className="w-4 h-4" />
                <span>Upload Demo Lecture</span>
              </button>

              {onOpenUploadStudyMaterial && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playBlip(700);
                    onOpenUploadStudyMaterial();
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-black rounded-full liquid-glass-pill liquid-glass-pill-purple text-white transition-all shadow-md cursor-pointer hover:scale-105 active:scale-95"
                  title="Upload SOP, radar debrief, or training manual to the Study Vault"
                >
                  <FileText className="w-4 h-4" />
                  <span>Upload Study Material</span>
                </button>
              )}
            </div>

            {/* Group 2: Faculty Profile & Availability */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sound.playBlip(600);
                  onViewTeacherResume(teacher);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-full liquid-glass-pill-frosted border border-sky-300/80 text-sky-950 dark:text-sky-200 transition-all cursor-pointer shadow-xs hover:scale-105"
              >
                <FileCheck className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-400" />
                <span>Faculty Dossier</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playBlip(650);
                  handleToggleRecruitmentStatus();
                }}
                className={`px-3.5 py-2 text-xs font-black rounded-full transition-all cursor-pointer shadow-xs hover:scale-105 ${
                  teacher.recruitmentStatus === 'Available for Recruitment'
                    ? 'liquid-glass-pill-frosted border border-emerald-400 text-emerald-950 dark:text-emerald-300'
                    : 'liquid-glass-pill-frosted border border-amber-400 text-amber-950 dark:text-amber-300'
                }`}
                title="Click to toggle availability on the IMD Recruitment Job Board"
              >
                ● {teacher.recruitmentStatus}
              </button>
            </div>
          </div>
        </div>

        {/* Quick KPI Stats Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/70 dark:border-white/15">
          <div className="p-3.5 rounded-2xl pryda-glass-card shadow-2xs">
            <span className="text-[11px] text-slate-800 dark:text-slate-300 font-extrabold">Published Lectures</span>
            <div className="text-xl font-black text-slate-950 dark:text-white mt-0.5">
              {teacherLectures.length || 2} Free Videos
            </div>
          </div>
          <div className="p-3.5 rounded-2xl pryda-glass-card shadow-2xs">
            <span className="text-[11px] text-slate-800 dark:text-slate-300 font-extrabold">Students Mentored</span>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-0.5">
              {teacher.studentsTrained}+ Trainees
            </div>
          </div>
          <div className="p-3.5 rounded-2xl pryda-glass-card shadow-2xs">
            <span className="text-[11px] text-slate-800 dark:text-slate-300 font-extrabold">Research Publications</span>
            <div className="text-xl font-black text-indigo-700 dark:text-indigo-400 mt-0.5">
              {teacher.publicationsCount} Papers
            </div>
          </div>
          <div className="p-3.5 rounded-2xl pryda-glass-card shadow-2xs">
            <span className="text-[11px] text-slate-800 dark:text-slate-300 font-extrabold">IMD Job Applications</span>
            <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-0.5">
              {teacher.appliedJobIds.length} Active Posts
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation for Trainer Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-full liquid-glass-pill-frosted border border-white/80 dark:border-white/15 shadow-xs">
        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveSubTab('resume');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'resume'
              ? 'liquid-glass-pill liquid-glass-pill-sky text-white shadow-sm'
              : 'text-slate-950 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-300'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Faculty Resume & Credentials</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(650);
            setActiveSubTab('lectures');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'lectures'
              ? 'liquid-glass-pill liquid-glass-pill-sky text-white shadow-sm'
              : 'text-slate-950 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-300'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Free Demo Video Lectures ({teacherLectures.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(700);
            setActiveSubTab('recruitment');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'recruitment'
              ? 'liquid-glass-pill liquid-glass-pill-emerald text-white shadow-sm'
              : 'text-slate-950 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-300'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>IMD Faculty Job Openings ({jobOpenings.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveSubTab('requisitions');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
            activeSubTab === 'requisitions'
              ? 'liquid-glass-pill liquid-glass-pill-amber text-white shadow-sm'
              : 'text-slate-950 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-300'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Faculty Requisitions to DG ({approvalRequests.filter((r) => r.requesterRole === 'Trainer').length})</span>
          {approvalRequests.filter((r) => r.requesterRole === 'Trainer' && r.status === 'Pending').length > 0 && (
            <span className="px-2 py-0.5 text-[10px] bg-amber-500 text-white font-black rounded-full">
              {approvalRequests.filter((r) => r.requesterRole === 'Trainer' && r.status === 'Pending').length} Pending
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: TEACHER RESUME & CV MANAGEMENT */}
      {activeSubTab === 'resume' && (
        <div className="space-y-6">
          {/* Resume Upload Box & File Drag Drop */}
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Teacher Curriculum Vitae (CV) & Resume Platform
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Easily upload your resume file or edit credentials below. Admins and radar station directors recruit faculty directly from here.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setIsEditingResume(!isEditingResume)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                    isEditingResume
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-500'
                      : isBright
                        ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditingResume ? 'Cancel Edit' : 'Edit Credentials'}</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop File Upload Banner */}
            <div className={`p-5 rounded-xl border-2 border-dashed transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isBright
                ? 'border-sky-300 bg-sky-50/50 hover:bg-sky-50'
                : 'border-cyan-500/40 bg-cyan-950/20 hover:bg-cyan-950/30'
            }`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-400/40 flex items-center justify-center text-sky-600 dark:text-cyan-400 shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {teacher.resumeFileName || 'Dr_Someshwar_Rao_IMD_Faculty_CV.pdf'}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 rounded">
                      Uploaded & Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Last updated: {teacher.resumeUploadedAt || 'Recently'} • PDF/DOCX (Max 25MB)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <label className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                  isBright
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                }`}>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload New Resume File</span>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleResumeFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {resumeUploadedSuccess && (
              <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>New resume document uploaded successfully and synched with IMD Recruitment Board!</span>
              </div>
            )}
          </div>

          {/* Edit Resume Details Form OR Live Credentials Card */}
          {isEditingResume ? (
            <form onSubmit={handleSaveResumeDetails} className={`p-6 rounded-2xl border space-y-4 ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <h4 className="text-sm font-bold tracking-tight">Edit Academic Profile & Specializations</h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Official Designation</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-xs ${
                      isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Current Institution / Radar Station</label>
                  <input
                    type="text"
                    value={editInstitution}
                    onChange={(e) => setEditInstitution(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-xs ${
                      isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Highest Qualification / Doctorate</label>
                  <input
                    type="text"
                    value={editQualification}
                    onChange={(e) => setEditQualification(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-xs ${
                      isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Years of Instruction Experience</label>
                  <input
                    type="number"
                    value={editExperienceYears}
                    onChange={(e) => setEditExperienceYears(Number(e.target.value))}
                    className={`w-full p-2.5 rounded-lg border text-xs ${
                      isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Specializations (comma separated)</label>
                <input
                  type="text"
                  value={editSpecializations}
                  onChange={(e) => setEditSpecializations(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs ${
                    isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Biographical Statement & Teaching Philosophy</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className={`w-full p-2.5 rounded-lg border text-xs ${
                    isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingResume(false)}
                  className={`px-4 py-2 rounded-lg border text-xs ${
                    isBright ? 'border-slate-300' : 'border-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Credentials & Hardware */}
              <div className={`p-5 rounded-2xl border lg:col-span-1 space-y-4 ${
                isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
              }`}>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Qualification & Degrees
                  </h4>
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-sky-600 dark:text-cyan-400">
                      {teacher.highestDegree}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {teacher.qualification}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Radar Hardware Experience
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.radarHardwareExperience.map((r, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded border ${
                          isBright ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-800 border-slate-700 text-slate-200'
                        }`}
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Specializations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {teacher.specializations.map((s, i) => (
                      <span
                        key={i}
                        className={`px-2 py-0.5 text-[11px] rounded border ${
                          isBright ? 'bg-sky-50 border-sky-200 text-sky-900' : 'bg-cyan-950/60 border-cyan-800 text-cyan-300'
                        }`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Research Publications & Add Paper */}
              <div className={`p-5 rounded-2xl border lg:col-span-2 space-y-4 ${
                isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-sky-500" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">
                      Selected Scientific Publications ({teacher.publicationsCount})
                    </h4>
                  </div>
                </div>

                {/* Add Publication Bar */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add newly published paper / monograph citation..."
                    value={newPublication}
                    onChange={(e) => setNewPublication(e.target.value)}
                    className={`flex-1 p-2 rounded-lg border text-xs ${
                      isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                    }`}
                  />
                  <button
                    onClick={handleAddPublication}
                    className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Citation</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {teacher.topPublications.map((pub, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs leading-relaxed ${
                        isBright ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0f192e] border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="font-bold text-sky-600 dark:text-cyan-400 mr-2">[{idx + 1}]</span>
                      {pub}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: FREE DEMO VIDEO LECTURES */}
      {activeSubTab === 'lectures' && (
        <div className="space-y-6">
          {/* Upload Banner */}
          <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isBright
              ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 text-emerald-950'
              : 'bg-gradient-to-r from-emerald-950/40 to-teal-950/30 border-emerald-800/40 text-emerald-200'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold tracking-tight">
                  Free Demo Video Lecture Studio
                </h3>
              </div>
              <p className="text-xs mt-1 text-emerald-800/80 dark:text-emerald-300/80">
                Upload your video masterclasses to share Doppler diagnostics with the national workforce for free.
              </p>
            </div>

            <button
              onClick={onOpenUploadLecture}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 ${
                isBright
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Upload Demo Lecture (Free)</span>
            </button>
          </div>

          {/* Grid of Published Demo Lectures */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {demoLectures.map((lec) => (
              <div
                key={lec.id}
                className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group ${
                  isBright
                    ? 'bg-white hover:border-sky-300 border-slate-200 shadow-sm'
                    : 'bg-[#0d1629] hover:border-cyan-500/50 border-slate-800 shadow-lg'
                }`}
              >
                {/* Thumbnail with Play Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <img
                    src={lec.thumbnailUrl}
                    alt={lec.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onPlayLecture(lec)}
                      className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded">
                    {lec.durationMinutes} min
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600/90 text-white font-mono text-[10px] font-bold rounded uppercase">
                    Free Demo
                  </span>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] font-mono text-sky-600 dark:text-cyan-400 font-bold uppercase">
                      {lec.category}
                    </span>
                    <h4 className={`text-sm font-bold tracking-tight line-clamp-2 mt-0.5 ${
                      isBright ? 'text-slate-900' : 'text-white'
                    }`}>
                      {lec.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {lec.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {lec.views}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {lec.rating}
                      </span>
                    </div>

                    <button
                      onClick={() => onPlayLecture(lec)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        isBright
                          ? 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200'
                          : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border-cyan-800/60'
                      }`}
                    >
                      Watch Demo
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: IMD FACULTY RECRUITMENT & JOB OPENINGS */}
      {activeSubTab === 'recruitment' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  IMD Faculty Recruitment & Station Vacancy Board
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Teachers and researchers can apply directly using their uploaded resume and demo lectures with 1-click.
                </p>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                isBright ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {jobOpenings.length} Active Teaching Requisitions
              </span>
            </div>

            {/* Jobs List */}
            <div className="space-y-3">
              {jobOpenings.map((job) => {
                const hasApplied = teacher.appliedJobIds.includes(job.id);

                return (
                  <div
                    key={job.id}
                    className={`p-5 rounded-xl border transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                      isBright
                        ? 'bg-slate-50/80 hover:bg-slate-50 border-slate-200'
                        : 'bg-[#0f192d] hover:bg-[#121e36] border-slate-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-cyan-400 border border-sky-500/20">
                          {job.stationCode}
                        </span>
                        <h4 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
                          {job.title}
                        </h4>
                        <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          {job.type}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building className="w-3.5 h-3.5" />
                          {job.stationName}
                        </span>
                        <span>•</span>
                        <span>{job.experienceRequired}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          {job.salaryRange}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl">
                        {job.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.requiredSkills.map((sk, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                              isBright ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                            }`}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full lg:w-auto">
                      <div className="text-[11px] font-mono text-slate-400">
                        Deadline: {job.deadline}
                      </div>

                      {hasApplied ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 rounded-xl text-xs font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Application Under Review</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            sound.playSuccess();
                            onApplyForJob(job.id);
                          }}
                          className={`flex items-center justify-center gap-1.5 px-5 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                            isBright
                              ? 'bg-sky-600 hover:bg-sky-700 text-white'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          }`}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>1-Click Apply with My Resume</span>
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

      {/* TAB 4: REQUISITIONS & CLEARANCES TO DG / ADMIN */}
      {activeSubTab === 'requisitions' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Faculty Requisitions & Formal Clearances Desk
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Submit official requisitions directly to the Director General / Apex IMD Administration for live radar transmission windows, syllabus revisions, or demo video publication approval.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400">
                Direct Channel to DG Mausam Bhawan
              </span>
            </div>

            {/* Submission Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reqTitle.trim() || !reqDetails.trim()) return;
                if (onSubmitApprovalRequest) {
                  onSubmitApprovalRequest({
                    requesterRole: 'Trainer',
                    requesterId: teacher.id,
                    requesterName: teacher.name,
                    requesterTitle: teacher.title,
                    category: reqCategory,
                    title: reqTitle.trim(),
                    details: reqDetails.trim(),
                    stationOrInstitute: teacher.institution,
                    urgency: reqUrgency
                  });
                }
                sound.playSuccess();
                setReqTitle('');
                setReqDetails('');
                setReqSubmittedSuccess(true);
                setTimeout(() => setReqSubmittedSuccess(false), 4000);
              }}
              className={`p-5 rounded-2xl border space-y-4 mb-8 ${
                isBright ? 'bg-amber-50/40 border-amber-300' : 'bg-amber-950/20 border-amber-800/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Compose New Requisition to Director General
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Requisition Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as ApprovalRequest['category'])}
                    className={`w-full p-2 rounded-lg border text-xs ${
                      isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Radar Research Transmission Slot">Radar Research Transmission Slot</option>
                    <option value="Publish Demo Video Lecture">Publish Demo Video Lecture Authorization</option>
                    <option value="Curriculum Syllabus Revision">Curriculum Syllabus Revision</option>
                    <option value="Guest Faculty Honorarium">Guest Faculty Honorarium / Budget</option>
                    <option value="Station Reassignment / Leave">Faculty Station Duty Reassignment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Priority / Urgency</label>
                  <select
                    value={reqUrgency}
                    onChange={(e) => setReqUrgency(e.target.value as ApprovalRequest['urgency'])}
                    className={`w-full p-2 rounded-lg border text-xs ${
                      isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Routine">Routine (Standard 48-hr Review)</option>
                    <option value="Priority">Priority (Next Briefing Review)</option>
                    <option value="Emergency">Emergency (Immediate Operational Override)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Requisition Subject / Header</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Live Dual-Polarization Calibration Slot on Mumbai S-Band DWR"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs ${
                    isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Detailed Technical Justification & Scope</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain requirements, hours needed, trainee cohorts participating, and expected output..."
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs ${
                    isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                {reqSubmittedSuccess ? (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Requisition successfully lodged with DG Mausam Bhawan!</span>
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Director General</span>
                </button>
              </div>
            </form>

            {/* List of Trainer Requisitions and DG Status */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                My Submitted Requisitions & Official DG Decisions
              </h4>

              <div className="space-y-3">
                {approvalRequests.filter((r) => r.requesterRole === 'Trainer').map((req) => (
                  <div
                    key={req.id}
                    className={`p-4 rounded-xl border ${
                      req.status === 'Approved'
                        ? 'bg-emerald-500/10 border-emerald-500/30'
                        : req.status === 'Rejected'
                          ? 'bg-rose-500/10 border-rose-500/30'
                          : isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase rounded ${
                          req.status === 'Approved'
                            ? 'bg-emerald-500 text-white'
                            : req.status === 'Rejected'
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-500 text-slate-950'
                        }`}>
                          {req.status}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 dark:text-white">{req.title}</h5>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Submitted {req.submittedAt}</span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{req.details}</p>

                    {req.reviewedBy && (
                      <div className="mt-2.5 p-2 rounded-lg bg-black/5 dark:bg-black/40 border border-slate-200 dark:border-slate-800 text-[11px] flex items-start gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{req.status} by {req.reviewedBy}</span>
                          {req.adminRemarks && (
                            <p className="italic text-slate-500 mt-0.5">&ldquo;{req.adminRemarks}&rdquo;</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
