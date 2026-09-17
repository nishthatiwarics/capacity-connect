import React, { useState } from 'react';
import { 
  User, 
  Video, 
  Award, 
  BookOpen, 
  Radio, 
  Play, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Star, 
  Flame, 
  Sparkles, 
  Download, 
  ShieldAlert,
  ArrowRight,
  Search,
  Eye,
  Zap,
  Send,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Trainee, DemoLecture, Course, StudentProfileData, ApprovalRequest } from '../types';
import { ANIMAL_TIER_CONFIGS } from '../data/studentRankData';
import { StudentProfileCard } from './StudentProfileCard';
import { StudentFunQuizArena } from './StudentFunQuizArena';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface TraineeDashboardProps {
  trainee: Trainee;
  demoLectures: DemoLecture[];
  courses: Course[];
  studentProfile: StudentProfileData;
  approvalRequests?: ApprovalRequest[];
  onUpdateStudentProfile: (profile: StudentProfileData) => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onPlayLecture: (lecture: DemoLecture) => void;
  onOpenRadarLab: () => void;
  onOpenCourses: () => void;
  onOpenDrill: () => void;
  onOpenCertificate: (course: Course) => void;
  onOpenQuizArena?: () => void;
  onSubmitApprovalRequest?: (req: Omit<ApprovalRequest, 'id' | 'status' | 'submittedAt'>) => void;
}

export const TraineeDashboard: React.FC<TraineeDashboardProps> = ({
  trainee,
  demoLectures,
  courses,
  studentProfile,
  approvalRequests = [],
  onUpdateStudentProfile,
  onAwardXP,
  onPlayLecture,
  onOpenRadarLab,
  onOpenCourses,
  onOpenDrill,
  onOpenCertificate,
  onOpenQuizArena,
  onSubmitApprovalRequest,
}) => {
  const { isBright } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'quiz-arena' | 'lectures' | 'accreditation' | 'requests'>('profile');
  const [lectureFilter, setLectureFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Trainee Clearance Request Form State
  const [reqCategory, setReqCategory] = useState<ApprovalRequest['category']>('Radar Simulator Clearance');
  const [reqTitle, setReqTitle] = useState('');
  const [reqDetails, setReqDetails] = useState('');
  const [reqUrgency, setReqUrgency] = useState<ApprovalRequest['urgency']>('Routine');
  const [reqSubmittedSuccess, setReqSubmittedSuccess] = useState(false);

  const rankConfig = ANIMAL_TIER_CONFIGS[studentProfile.currentAnimalRank];

  const filteredLectures = demoLectures.filter((l) => {
    const matchesCat = lectureFilter === 'All' || l.category === lectureFilter;
    const matchesSearch =
      l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.teacherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Trainee Cockpit Header */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isBright
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#0d1629] border-cyan-900/40 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {studentProfile.avatar ? (
                <img
                  src={studentProfile.avatar}
                  alt={studentProfile.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500/40 shadow-md text-slate-500 dark:text-slate-400">
                  <User className="w-10 h-10" />
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 p-1 bg-indigo-500 rounded-full text-white shadow text-xs">
                👤
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className={`text-xl font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  {studentProfile.name}
                </h1>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-full border ${
                  isBright ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-indigo-950 text-indigo-300 border-indigo-700/50'
                }`}>
                  Trainee Forecaster Cockpit
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {studentProfile.badgeNumber}
                </span>
              </div>

              <p className="text-xs font-semibold text-sky-600 dark:text-cyan-400 mt-1">
                {studentProfile.designation} • {studentProfile.stationName}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                    isBright 
                      ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100' 
                      : 'bg-amber-950/60 text-amber-300 border-amber-600/50 hover:bg-amber-900/60'
                  }`}
                  title="Click to view student competency level and streak profile"
                >
                  <span className="text-sm">{rankConfig.animalEmoji}</span>
                  <span>Rank: {rankConfig.rank}</span>
                  <span className="text-[10px] font-mono opacity-80">({rankConfig.tierTag})</span>
                </button>

                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {studentProfile.dailyStreak}d Study Streak
                </span>
                <span>•</span>
                <span className="font-mono font-semibold text-indigo-500 dark:text-indigo-400">
                  {studentProfile.lecturesWatched} Lectures Watched
                </span>
                <span>•</span>
                <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                  {studentProfile.quizzesDone} Quizzes Aced ({studentProfile.quizAverageScore}%)
                </span>
                <span>•</span>
                <span className="font-mono font-semibold text-sky-600 dark:text-cyan-400">
                  {studentProfile.xp} XP
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenRadarLab}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                isBright
                  ? 'bg-sky-600 hover:bg-sky-700 text-white'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Launch Doppler Lab</span>
            </button>

            <button
              onClick={onOpenDrill}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                isBright
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-amber-950/40 hover:bg-amber-900/40 border-amber-700/50 text-amber-300'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span>Emergency Drill</span>
            </button>

            <button
              onClick={() => {
                sound.playMikuJingle();
                if (onOpenQuizArena) {
                  onOpenQuizArena();
                } else {
                  setActiveSubTab('quiz-arena');
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl transition-all shadow-md ${
                isBright
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:brightness-105 shadow-amber-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)] hover:brightness-110'
              }`}
            >
              <Zap className="w-4 h-4 fill-current animate-bounce text-amber-200" />
              <span>Play Quiz Arena ⚡</span>
            </button>
          </div>
        </div>

        {/* Competency 6-Axis Preview */}
        <div className={`grid grid-cols-2 sm:grid-cols-6 gap-2 mt-6 pt-5 border-t ${
          isBright ? 'border-slate-200' : 'border-slate-800'
        }`}>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Radar Echoes</span>
            <span className="text-sm font-bold text-sky-600 dark:text-cyan-400">{trainee.competency.radarMeteorology}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Satellite</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{trainee.competency.satelliteInterpretation}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">NWP Modeling</span>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{trainee.competency.nwpModeling}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Nowcasting</span>
            <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{trainee.competency.severeNowcasting}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Synoptic</span>
            <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{trainee.competency.synopticAnalysis}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 text-center">
            <span className="text-[10px] text-slate-400 font-mono block">Agro-Advisory</span>
            <span className="text-sm font-bold text-rose-600 dark:text-rose-400">{trainee.competency.agroAdvisory}%</span>
          </div>
        </div>
      </div>

      {/* Trainee Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveSubTab('profile');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'profile'
              ? isBright
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
              : isBright
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <span className="text-base">{rankConfig.animalEmoji}</span>
          <span>Competency Rank Profile ({rankConfig.rank})</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold">
            {studentProfile.dailyStreak}d Streak
          </span>
        </button>

        <button
          onClick={() => {
            sound.playMikuJingle();
            setActiveSubTab('quiz-arena');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'quiz-arena'
              ? isBright
                ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-sm font-black'
                : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.35)] font-black'
              : isBright
                ? 'text-amber-800 bg-amber-50/70 hover:bg-amber-100 border border-amber-200/80 font-bold'
                : 'text-amber-300 bg-amber-950/30 hover:bg-amber-900/40 border border-amber-700/40 font-bold'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-amber-300 animate-bounce" />
          <span>Cadet Quiz Arena</span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/30 text-white font-bold">
            15s BLITZ ⚡
          </span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveSubTab('lectures');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'lectures'
              ? isBright
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : isBright
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Free Demo Video Lectures ({demoLectures.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(650);
            setActiveSubTab('accreditation');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'accreditation'
              ? isBright
                ? 'bg-sky-600 text-white shadow-sm'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
              : isBright
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Accreditation Lock & WMO Licenses</span>
        </button>

        <button
          onClick={() => {
            sound.playBlip(600);
            setActiveSubTab('requests');
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'requests'
              ? isBright
                ? 'bg-amber-600 text-white shadow-sm font-black'
                : 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.25)] font-black'
              : isBright
                ? 'text-slate-600 hover:bg-slate-100'
                : 'text-slate-400 hover:bg-slate-800/60'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Cadet Clearances to DG ({approvalRequests.filter((r) => r.requesterRole === 'Trainee').length})</span>
          {approvalRequests.filter((r) => r.requesterRole === 'Trainee' && r.status === 'Pending').length > 0 && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500 text-slate-950 font-black">
              {approvalRequests.filter((r) => r.requesterRole === 'Trainee' && r.status === 'Pending').length} Pending
            </span>
          )}
        </button>
      </div>

      {/* SUB-TAB 0: STUDENT COMPETENCY PROFILE & STREAKS */}
      {activeSubTab === 'profile' && (
        <StudentProfileCard
          profile={studentProfile}
          onUpdateProfile={onUpdateStudentProfile}
          onAwardXP={onAwardXP}
          onOpenVideoLecture={() => setActiveSubTab('lectures')}
          onOpenQuizArena={() => setActiveSubTab('quiz-arena')}
        />
      )}

      {/* SUB-TAB: FUN WEATHER CADET QUIZ ARENA */}
      {activeSubTab === 'quiz-arena' && (
        <StudentFunQuizArena
          studentProfile={studentProfile}
          onUpdateProfile={onUpdateStudentProfile}
          onAwardXP={onAwardXP}
          onClose={() => setActiveSubTab('profile')}
        />
      )}

      {/* SUB-TAB 1: FREE DEMO VIDEO LECTURES LIBRARY */}
      {activeSubTab === 'lectures' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                  <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    Free Video Lectures Uploaded by IMD Faculty
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Watch specialized radar and severe weather masterclasses published by certified trainers for free.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search lectures, topics, instructors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-xs border ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-700'
                  }`}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {['All', 'Radar Meteorology', 'Cyclone Dynamics', 'Severe Weather Nowcasting', 'Satellite & NWP'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sound.playBlip(650, 0.03);
                    setLectureFilter(cat);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    lectureFilter === cat
                      ? isBright
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-cyan-500 text-slate-950 border-cyan-500 font-extrabold'
                      : isBright
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredLectures.map((lec) => (
                <div
                  key={lec.id}
                  className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group ${
                    isBright
                      ? 'bg-slate-50/70 hover:bg-white hover:border-sky-300 border-slate-200 shadow-sm'
                      : 'bg-[#0f192d] hover:bg-[#121f37] hover:border-cyan-500/50 border-slate-800 shadow-lg'
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img
                      src={lec.thumbnailUrl}
                      alt={lec.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
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

                  {/* Body Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {lec.teacherAvatar ? (
                          <img
                            src={lec.teacherAvatar}
                            alt={lec.teacherName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-[9px] text-slate-700 dark:text-slate-300">
                            {lec.teacherName.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}
                        <span className="text-[11px] font-semibold text-sky-600 dark:text-cyan-400 truncate">
                          {lec.teacherName}
                        </span>
                      </div>
                      <h4 className={`text-sm font-bold tracking-tight line-clamp-2 ${
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
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          isBright
                            ? 'bg-sky-600 hover:bg-sky-700 text-white'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Free</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACCREDITATION LOCK STATUS */}
      {activeSubTab === 'accreditation' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Accreditation Lock Portal & WMO Licensing
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Connected to live Supabase cloud. Unapproved trainees sign in to the Accreditation Lock portal before Admin commissioning.
                </p>
              </div>
            </div>

            {/* Lock Status Visualizer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <div className={`p-4 rounded-xl border ${
                isBright ? 'bg-emerald-50/60 border-emerald-300' : 'bg-emerald-950/30 border-emerald-800/60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Stage 1: Ground Theory</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xs font-semibold">WMO-258 Syllabus Clearance</div>
                <p className="text-[11px] text-slate-500 mt-1">Foundational radar physics & synoptic analysis verified.</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                isBright ? 'bg-emerald-50/60 border-emerald-300' : 'bg-emerald-950/30 border-emerald-800/60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400">Stage 2: Doppler Simulator</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-xs font-semibold">Dual-Pol Radar Lab Drills</div>
                <p className="text-[11px] text-slate-500 mt-1">Completed 14 simulated cyclone & hailstorm diagnosis cases.</p>
              </div>

              <div className={`p-4 rounded-xl border ${
                trainee.status === 'Certified'
                  ? isBright ? 'bg-emerald-50/60 border-emerald-300' : 'bg-emerald-950/30 border-emerald-800/60'
                  : isBright ? 'bg-amber-50/60 border-amber-300' : 'bg-amber-950/30 border-amber-800/60'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-xs font-bold uppercase ${
                    trainee.status === 'Certified' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
                  }`}>
                    Stage 3: Apex Commissioning
                  </span>
                  {trainee.status === 'Certified' ? (
                    <Unlock className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="text-xs font-semibold">Director General Authorization</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {trainee.status === 'Certified'
                    ? 'Fully commissioned by DG IMD for live radar warning issuance.'
                    : 'Pending final administrative sign-off by Dr. M. Mohapatra.'}
                </p>
              </div>
            </div>

            {/* Available Course Diplomas */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                WMO Accredited Curricula & Diplomas
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courses.slice(0, 4).map((c) => (
                  <div
                    key={c.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 ${
                      isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f192d] border-slate-800'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-xs">
                        {c.title}
                      </h5>
                      <p className="text-[11px] text-slate-400">{c.instructor} • {c.durationHours} Hours</p>
                    </div>
                    <button
                      onClick={() => onOpenCertificate(c)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                        isBright
                          ? 'bg-white hover:bg-slate-100 text-sky-700 border-slate-300'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border-slate-700'
                      }`}
                    >
                      View Diploma
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: CADET CLEARANCES & PETITIONS TO DG / ADMIN */}
      {activeSubTab === 'requests' && (
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl border ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d1629] border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  Cadet Clearances & Directorate Authorization
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Lodge official clearance requests to the Director General for specialized radar simulator authorization, course enrollment prerequisites, or station assignments.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400">
                Direct Cadet-to-DG Pipeline
              </span>
            </div>

            {/* Submission Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!reqTitle.trim() || !reqDetails.trim()) return;
                if (onSubmitApprovalRequest) {
                  onSubmitApprovalRequest({
                    requesterRole: 'Trainee',
                    requesterId: trainee.id,
                    requesterName: trainee.name,
                    requesterTitle: `${trainee.batch} • ${studentProfile.currentAnimalRank.toUpperCase()}`,
                    category: reqCategory,
                    title: reqTitle.trim(),
                    details: reqDetails.trim(),
                    stationOrInstitute: trainee.station,
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
                  Lodge Formal Cadet Request to Director General
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Clearance Category</label>
                  <select
                    value={reqCategory}
                    onChange={(e) => setReqCategory(e.target.value as ApprovalRequest['category'])}
                    className={`w-full p-2 rounded-lg border text-xs ${
                      isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Radar Simulator Clearance">Radar Doppler Simulator Solo Clearance</option>
                    <option value="Course Enrollment Exemption">Course Enrollment Prerequisite Exemption</option>
                    <option value="WMO Exam Attempt">WMO Senior Certification Exam Accelerated Sitting</option>
                    <option value="Station Reassignment / Leave">Severe Weather Field Assignment Request</option>
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
                    <option value="Routine">Routine (Standard Cadet Review)</option>
                    <option value="Priority">Priority (Upcoming Simulation Window)</option>
                    <option value="Emergency">Emergency (Immediate Station Deployment)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Subject / Clearance Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Solo Doppler Radar Volumetric Scan Protocol Authorization"
                  value={reqTitle}
                  onChange={(e) => setReqTitle(e.target.value)}
                  className={`w-full p-2 rounded-lg border text-xs ${
                    isBright ? 'bg-white border-slate-300 text-slate-900' : 'bg-slate-900 border-slate-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Explanation & Statement of Preparedness</label>
                <textarea
                  rows={2}
                  required
                  placeholder="State your completed modules, current radar competency score, and why this clearance is requested..."
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
                    <span>Clearance request transmitted to Director General for review!</span>
                  </span>
                ) : <span />}

                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to DG Mausam Bhawan</span>
                </button>
              </div>
            </form>

            {/* List of Trainee Requests */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                My Cadet Requests & Approval Status
              </h4>

              <div className="space-y-3">
                {approvalRequests.filter((r) => r.requesterRole === 'Trainee').map((req) => (
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
