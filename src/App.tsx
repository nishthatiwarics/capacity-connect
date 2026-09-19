import React, { useState } from 'react';
import { 
  Radio, 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Zap, 
  ShieldAlert, 
  Download, 
  Award, 
  Flame, 
  Sparkles,
  Layers,
  HelpCircle,
  Video,
  Briefcase,
  FileText,
  UserCheck,
  ChevronDown,
  Lock,
  Plus,
  Trophy,
  Target,
  Share2,
  Compass,
  CheckCircle2,
  ArrowRight,
  Activity,
  Globe,
  Sliders,
  GraduationCap,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Satellite,
  Cpu,
  CloudRain,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Clock,
  Send,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { PortalHomepage } from './components/PortalHomepage';
import { 
  UserRole, 
  Station, 
  Trainee, 
  Course, 
  AlertLevel, 
  TeacherProfile, 
  DemoLecture, 
  FacultyJobOpening,
  StudentProfileData,
  ApprovalRequest
} from './types';
import { 
  INITIAL_STATIONS, 
  INITIAL_TRAINEES, 
  INITIAL_COURSES, 
  RADAR_SCENARIOS, 
  INITIAL_ACTIVITY_LOGS,
  DEMO_ACCOUNTS,
  INITIAL_TEACHERS,
  INITIAL_DEMO_LECTURES,
  INITIAL_JOB_OPENINGS,
  INITIAL_APPROVAL_REQUESTS
} from './data/portalData';
import { 
  INITIAL_STUDENT_PROFILE, 
  ANIMAL_TIER_CONFIGS, 
  calculateStudentAnimalRank 
} from './data/studentRankData';
import { Header } from './components/Header';
import { CommandOverview } from './components/CommandOverview';
import { RadarSimLab } from './components/RadarSimLab';
import { CoursesAcademy } from './components/CoursesAcademy';
import { WorkforceRoster } from './components/WorkforceRoster';
import { CrisisDrillModal } from './components/CrisisDrillModal';
import { StationDetailModal } from './components/StationDetailModal';
import { CertificateModal } from './components/CertificateModal';
import { MikuPetGuide } from './components/MikuPetGuide';
import { DemoAccountsCard } from './components/DemoAccountsCard';
import { AdminDashboard } from './components/AdminDashboard';
import { TrainerDashboard } from './components/TrainerDashboard';
import { TraineeDashboard } from './components/TraineeDashboard';
import { TeacherResumeModal } from './components/TeacherResumeModal';
import { UploadDemoLectureModal } from './components/UploadDemoLectureModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { StudentProfileCard } from './components/StudentProfileCard';
import { StudentProfileModal } from './components/StudentProfileModal';
import { StudentFunQuizArena } from './components/StudentFunQuizArena';
import { KnowledgeSharingHub } from './components/KnowledgeSharingHub';
import { CompetencyMatrixModal } from './components/CompetencyMatrixModal';
import { MaximalistGradientBackground } from './components/MaximalistGradientBackground';
import { Sidebar, NavSection } from './components/Sidebar';
import { FigmaDashboardView } from './components/FigmaDashboardView';
import { OceanCapacityDashboard } from './components/OceanCapacityDashboard';
import { OceanQuoteCard } from './components/OceanQuoteCard';
import { sound } from './utils/audio';
import { useTheme } from './context/ThemeContext';
import { AdminClearanceModal } from './components/AdminClearanceModal';
import { ChatSystemWindow } from './components/ChatSystemWindow';
import confetti from 'canvas-confetti';

export default function App() {
  const { isBright, toggleTheme } = useTheme();

  // Audio feedback and theme toggle states
  const [isMuted, setIsMuted] = useState(sound.isMuted);
  const toggleSound = () => {
    sound.isMuted = !sound.isMuted;
    setIsMuted(sound.isMuted);
    if (!sound.isMuted) {
      sound.playBlip(900);
    }
  };
  const handleThemeToggle = () => {
    toggleTheme();
    sound.playBlip(isBright ? 500 : 800);
  };

  // Roles: 'Admin' | 'Trainer' | 'Trainee'
  const [currentRole, setCurrentRole] = useState<UserRole>('Trainee');

  // Security Clearance Modal State to prevent unauthorized learner access to Admin
  const [isClearanceModalOpen, setIsClearanceModalOpen] = useState(false);
  const [pendingTargetRole, setPendingTargetRole] = useState<UserRole>('Admin');

  // Director General Multi-Console Inspection View: 'admin' | 'trainer' | 'trainee'
  // Rule: Only Admin can access trainee and trainer's dashboard
  const [adminInspectionMode, setAdminInspectionMode] = useState<'admin' | 'trainer' | 'trainee'>('admin');

  // Sidebar navigation state aligned with screenshot (Home, Skill Tree, Courses, Quests, Leaderboard, Badges, Profile)
  const [activeNav, setActiveNav] = useState<NavSection>('home');

  // Navigation tab aligned with 3 Pillars & Portal Architecture
  const [activeTab, setActiveTab] = useState<'dashboard' | 'training' | 'competency' | 'knowledge' | 'my-learning'>('dashboard');
  
  // Pillar Sub-tabs for deep organized navigation
  const [trainingSubTab, setTrainingSubTab] = useState<'courses' | 'masterclasses' | 'roster'>('courses');
  const [competencySubTab, setCompetencySubTab] = useState<'matrix' | 'simulator' | 'arena'>('matrix');
  const [knowledgeSubTab, setKnowledgeSubTab] = useState<'hub' | 'faculty'>('hub');
  const [dashboardView, setDashboardView] = useState<'ocean' | 'cockpit' | 'command-network' | 'telemetry'>('ocean');

  const [searchQuery, setSearchQuery] = useState('');

  // Main State
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [trainees, setTrainees] = useState<Trainee[]>(INITIAL_TRAINEES);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activityLogs, setActivityLogs] = useState(INITIAL_ACTIVITY_LOGS);

  // Teachers, Demo Lectures, Job Openings
  const [teachers, setTeachers] = useState<TeacherProfile[]>(INITIAL_TEACHERS);
  const [demoLectures, setDemoLectures] = useState<DemoLecture[]>(INITIAL_DEMO_LECTURES);
  const [jobOpenings, setJobOpenings] = useState<FacultyJobOpening[]>(INITIAL_JOB_OPENINGS);

  // Approval Requests across Trainers and Trainees to DG / Admin
  const [approvalRequests, setApprovalRequests] = useState<ApprovalRequest[]>(INITIAL_APPROVAL_REQUESTS);

  // Student Profile State: Streaks & Competency Ranks
  const [studentProfile, setStudentProfile] = useState<StudentProfileData>(INITIAL_STUDENT_PROFILE);
  const [isStudentProfileModalOpen, setIsStudentProfileModalOpen] = useState(false);

  // Modals State
  const [isCrisisDrillOpen, setIsCrisisDrillOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [certificateCourse, setCertificateCourse] = useState<Course | null>(null);
  const [isCompetencyMatrixOpen, setIsCompetencyMatrixOpen] = useState(false);

  // Additional Modals: Resume, Video Player, Upload Demo, Role Switcher, Chat System, Study Material Upload
  const [activeTeacherForResume, setActiveTeacherForResume] = useState<TeacherProfile | null>(null);
  const [activeLectureForVideo, setActiveLectureForVideo] = useState<DemoLecture | null>(null);
  const [isUploadLectureOpen, setIsUploadLectureOpen] = useState(false);
  const [isUploadStudyMaterialOpen, setIsUploadStudyMaterialOpen] = useState(false);
  const [isDemoAccountModalOpen, setIsDemoAccountModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // User XP & Notification toast
  const [currentXP, setCurrentXP] = useState(4820);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleAwardXP = (amount: number, reason: string) => {
    setCurrentXP((prev) => prev + amount);
    showToast(`+${amount} XP: ${reason}`);

    const newLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      actor: currentRole === 'Admin' ? 'Admin Command Desk' : currentRole === 'Trainer' ? teachers[0].name : trainees[0].name,
      action: reason,
      category: 'drill' as const,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  const handleUpdateStationAlert = (stationId: string, level: AlertLevel) => {
    setStations((prev) =>
      prev.map((s) => (s.id === stationId ? { ...s, alertLevel: level } : s))
    );
    if (selectedStation && selectedStation.id === stationId) {
      setSelectedStation((prev) => (prev ? { ...prev, alertLevel: level } : null));
    }
    showToast(`Station alert level updated to ${level}`);
  };

  const handleUpdateTrainee = (updated: Trainee) => {
    setTrainees((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleAddTrainee = (created: Trainee) => {
    setTrainees((prev) => [created, ...prev]);
    showToast(`Forecaster ${created.name} successfully inducted!`);
  };

  const handleAddCourse = (created: Course) => {
    setCourses((prev) => [created, ...prev]);
    showToast(`New curriculum '${created.title}' published to Academy!`);
  };

  const handleDrillComplete = (score: number, drillName: string) => {
    handleAwardXP(450, `Completed ${drillName} with ${score}/100 score`);
  };

  // Teacher Resume update
  const handleUpdateTeacher = (updated: TeacherProfile) => {
    setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast('Teacher profile and resume successfully synchronized!');
  };

  // Upload Free Demo Lecture
  const handlePublishLecture = (newLecture: DemoLecture) => {
    setDemoLectures((prev) => [newLecture, ...prev]);
    handleAwardXP(300, `Published free demo lecture: ${newLecture.title}`);
    showToast(`"${newLecture.title}" published free across the nationwide network!`);
  };

  // Apply for Job Opening with Resume
  const handleApplyForJob = (jobId: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teachers[0].id
          ? { ...t, appliedJobIds: [...t.appliedJobIds, jobId] }
          : t
      )
    );
    setJobOpenings((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, applicantsCount: j.applicantsCount + 1 } : j
      )
    );
    handleAwardXP(200, 'Submitted Faculty Recruitment Application');
    showToast('Application and resume dispatched to IMD Directorate for review!');
  };

  // Admin recruits teacher
  const handleRecruitTeacher = (teacherId: string, roleStation: string) => {
    setTeachers((prev) =>
      prev.map((t) =>
        t.id === teacherId
          ? { ...t, recruitmentStatus: 'Commissioned IMD Faculty' }
          : t
      )
    );
    showToast(`Official recruitment requisition issued to teacher for ${roleStation}!`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  // Admin commissions trainee (unlocks accreditation lock)
  const handleCommissionTrainee = (traineeId: string) => {
    setTrainees((prev) =>
      prev.map((t) =>
        t.id === traineeId ? { ...t, status: 'Certified' } : t
      )
    );
    showToast('Trainee successfully commissioned by Director General! Accreditation unlocked.');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Add Job Opening
  const handleAddJobOpening = (newJob: FacultyJobOpening) => {
    setJobOpenings((prev) => [newJob, ...prev]);
    showToast(`New teaching vacancy '${newJob.title}' broadcasted!`);
  };

  // Requisitions & Clearances Approval Engine for DG / Admin
  const handleApproveRequest = (requestId: string, remarks?: string) => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // safe fallback
    }

    setApprovalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'Approved' as const,
              reviewedBy: 'Dr. M. Mohapatra (DG IMD)',
              reviewedAt: 'Just now',
              adminRemarks: remarks || 'Officially Authorized & Endorsed by Director General IMD'
            }
          : req
      )
    );

    const approvedReq = approvalRequests.find((r) => r.id === requestId);
    showToast(`Requisition authorized: "${approvedReq?.title || requestId}"`);

    const newLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      actor: 'Dr. M. Mohapatra (DG IMD)',
      action: `Approved: ${approvedReq?.title || 'Requisition'}`,
      category: 'certification' as const
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  const handleRejectRequest = (requestId: string, remarks?: string) => {
    sound.playBlip(350);
    setApprovalRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'Rejected' as const,
              reviewedBy: 'Dr. M. Mohapatra (DG IMD)',
              reviewedAt: 'Just now',
              adminRemarks: remarks || 'Declined under Director General review'
            }
          : req
      )
    );

    const rejectedReq = approvalRequests.find((r) => r.id === requestId);
    showToast(`Declined requisition: "${rejectedReq?.title || requestId}"`);
  };

  const handleSubmitApprovalRequest = (newReqData: Omit<ApprovalRequest, 'id' | 'status' | 'submittedAt'>) => {
    const newReq: ApprovalRequest = {
      ...newReqData,
      id: `req-${Date.now()}`,
      status: 'Pending',
      submittedAt: 'Just now'
    };
    setApprovalRequests((prev) => [newReq, ...prev]);
    showToast(`Lodged requisition: "${newReq.title}" with DG Mausam Bhawan`);

    const newLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      actor: newReq.requesterName,
      action: `Lodged ${newReq.category}: ${newReq.title}`,
      category: 'course' as const
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 7)]);
  };

  // CSV Export
  const handleExportReport = () => {
    sound.playBlip(700);
    const headers = ['Station Code', 'Station Name', 'Region', 'Total Capacity', 'Certified Forecasters', 'Active Trainees', 'Readiness Score (%)', 'Alert Level'];
    const rows = stations.map((s) => [
      s.code,
      `"${s.name}"`,
      s.region,
      s.totalCapacity,
      s.certifiedForecasters,
      s.activeTrainees,
      s.readinessScore,
      s.alertLevel,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CAPACITY_CONNECT_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Capacity Connect institutional workforce CSV exported successfully.');
  };

  // Security Clearance Gate Trigger
  const handleRequestAdminClearance = (targetRole: UserRole) => {
    setPendingTargetRole(targetRole);
    setIsClearanceModalOpen(true);
  };

  // Grant access after Directorate PIN verification
  const handleGrantClearance = (role: UserRole) => {
    setCurrentRole(role);
    sound.playSuccess();
    setActiveTab('dashboard');
    setDashboardView('cockpit');
    setAdminInspectionMode('admin');
    showToast(`Director General security clearance authorized. Full access granted.`);
  };

  // Helper to switch role with access control:
  // Rule: Do not let learner access admin dashboard; only admin can access trainee and trainer's dashboard
  const handleSwitchRole = (role: UserRole) => {
    if (currentRole === 'Trainee' && role !== 'Trainee') {
      sound.playAlert();
      handleRequestAdminClearance(role);
      return;
    }

    if (currentRole === 'Trainer' && role !== 'Trainer') {
      sound.playAlert();
      handleRequestAdminClearance(role);
      return;
    }

    // Admin has full super-user authority to switch or inspect any dashboard!
    setCurrentRole(role);
    sound.playSuccess();
    setActiveTab('dashboard');
    setDashboardView('cockpit');
    setAdminInspectionMode('admin');
    showToast(`Switched active cockpit to ${role}`);
  };

  // Dedicated Separate Homepage Authentication Gateway state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginFromHomepage = (role: UserRole) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard');
    setDashboardView('cockpit');
    if (role === 'Admin') {
      setAdminInspectionMode('admin');
    }
    sound.playSuccess();
    showToast(`Authorized login: Switched to ${role === 'Admin' ? 'Director General (Admin HQ)' : role === 'Trainer' ? 'Senior Faculty (Trainer)' : 'Cadet (Trainee Flight Deck)'}`);
  };

  const handleLogoutToHomepage = () => {
    sound.playBlip(500);
    setIsLoggedIn(false);
    showToast('Signed out of session. Returned to Institutional Gateway.');
  };

  const currentTierConfig = ANIMAL_TIER_CONFIGS[studentProfile.currentAnimalRank];
  const pendingApprovalsCount = approvalRequests.filter((r) => r.status === 'Pending').length;

  if (!isLoggedIn) {
    return (
      <>
        <PortalHomepage onLogin={handleLoginFromHomepage} />
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`fixed bottom-5 left-5 z-50 rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-5 shadow-2xl ${
            isBright
              ? 'bg-white border border-sky-300 text-slate-800 shadow-xl'
              : 'bg-[#0b1220] border border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
          }`}>
            <Sparkles className={`w-4 h-4 shrink-0 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="bg-pink-blue-mesh min-h-screen flex flex-row font-sans relative text-slate-800 selection:bg-sky-500 selection:text-white overflow-x-hidden">
      {/* Ambient Atmospheric Vibrant Gradient Floating Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[620px] h-[620px] bg-gradient-to-br from-cyan-400/40 via-sky-500/30 to-blue-600/25 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-[18%] right-[-10%] w-[680px] h-[680px] bg-gradient-to-bl from-rose-400/35 via-pink-400/30 to-amber-300/35 rounded-full blur-[110px] animate-float-reverse" />
        <div className="absolute bottom-[-10%] left-[20%] w-[720px] h-[720px] bg-gradient-to-tr from-purple-500/30 via-indigo-400/25 to-cyan-400/25 rounded-full blur-[120px]" />
        <div className="absolute top-[50%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-r from-emerald-400/30 via-teal-400/25 to-sky-400/20 rounded-full blur-[90px] animate-pulse-glow" />
        <div className="absolute bottom-[15%] right-[-5%] w-[550px] h-[550px] bg-gradient-to-tl from-amber-400/30 via-orange-300/25 to-rose-400/25 rounded-full blur-[100px]" />
      </div>

      {/* Navigation Sidebar matching screenshot */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={(nav) => {
          setActiveNav(nav);
          if (nav === 'home' || nav === 'dashboard') {
            setActiveTab('dashboard');
            setDashboardView('ocean');
          } else if (nav === 'skill-tree') {
            setIsCompetencyMatrixOpen(true);
          } else if (nav === 'courses') {
            setActiveTab('training');
            setTrainingSubTab('courses');
          } else if (nav === 'quests') {
            setActiveTab('competency');
            setCompetencySubTab('arena');
          } else if (nav === 'leaderboard' || nav === 'badges' || nav === 'profile') {
            setIsStudentProfileModalOpen(true);
          } else if (nav === 'trainees') {
            setActiveTab('competency');
          } else if (nav === 'repository') {
            setActiveTab('knowledge');
            setKnowledgeSubTab('hub');
          }
          sound.playBlip(600);
        }}
        onOpenGuide={() => setIsStudentProfileModalOpen(true)}
        onStartTour={() => {
          sound.playSuccess();
          showToast("Starting Hachiware Sensei's Interactive Tour of Capacity Connect!");
        }}
        onOpenFeatures={() => {
          setIsCompetencyMatrixOpen(true);
        }}
        onOpenHelp={() => {
          setActiveTab('knowledge');
          setKnowledgeSubTab('hub');
        }}
        onOpenChat={() => {
          sound.playBlip(700);
          setIsChatOpen(true);
        }}
        onLogoutToHomepage={handleLogoutToHomepage}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Top Command Header matching screenshot */}
        <Header
          currentRole={currentRole}
          onRoleChange={handleSwitchRole}
          onRequestAdminClearance={handleRequestAdminClearance}
          onLogoutToHomepage={handleLogoutToHomepage}
          onOpenCrisisDrill={() => setIsCrisisDrillOpen(true)}
          activeSectionTitle={
            activeNav === 'home' || activeNav === 'dashboard' ? 'Home' :
            activeNav === 'skill-tree' ? 'Skill Tree' :
            activeNav === 'courses' ? 'Courses' :
            activeNav === 'quests' ? 'Quests' :
            activeNav === 'leaderboard' ? 'Leaderboard' :
            activeNav === 'badges' ? 'Badges' :
            activeNav === 'profile' ? 'Profile' : 'Capacity Connect'
          }
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          dailyStreak={studentProfile.dailyStreak}
          badgesCount={8}
          currentXP={currentXP}
          userLevel={7}
          onOpenProfile={() => setIsStudentProfileModalOpen(true)}
          onOpenDemoAccounts={() => setIsDemoAccountModalOpen(true)}
          onOpenChat={() => {
            sound.playBlip(700);
            setIsChatOpen(true);
          }}
        />

        {/* Quick-Access Ribbon with Clean Meteorological Light Aesthetic */}
        <div className="border-b border-sky-100/90 px-6 py-2.5 bg-white/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-slate-500">
              Active Cockpit:
            </span>
            <span className="px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200 shadow-2xs">
              {currentRole === 'Admin' ? '🔒 Admin HQ (Dr. M. Mohapatra • DG)' : currentRole === 'Trainer' ? '📋 Faculty Console (Dr. Someshwar Rao)' : '👤 Trainee Flight Deck (Julianne Moore)'}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Trainer Publishing Actions (Only appears for Trainers) */}
            {currentRole === 'Trainer' && (
              <div className="flex items-center gap-2 pr-2 border-r border-sky-200">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-500 hidden lg:inline">
                  Trainer Studio:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    sound.playBlip(700);
                    setIsUploadLectureOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Upload a new free demo video lecture for trainees (Trainer Only)"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>+ Upload Lecture</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playBlip(700);
                    setActiveTab('knowledge');
                    setKnowledgeSubTab('hub');
                    setIsUploadStudyMaterialOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-500 text-white shadow-2xs cursor-pointer active:scale-95 transition-all"
                  title="Upload SOP, calibration manual, or study notes (Trainer Only)"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>+ Upload Study Material</span>
                </button>
              </div>
            )}

            {/* Faculty & Trainee Chat Window Trigger */}
            <button
              onClick={() => {
                sound.playBlip(750);
                setIsChatOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-900 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="Open Chat with Faculty, Anonymous Lounge & Feedback"
            >
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
              <span>Faculty Chat & Feedback</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </button>
            {/* Homepage / Sign Out button */}
            <button
              onClick={handleLogoutToHomepage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-all shadow-2xs cursor-pointer"
              title="Return to the separate login homepage"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Institutional Homepage</span>
            </button>

            {/* Export Capacity CSV */}
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer"
              title="Export Workforce Capacity CSV Report"
            >
              <Download className="w-3.5 h-3.5 text-sky-600" />
              <span>Export CSV</span>
            </button>

            {/* Forecaster Competency Rank Badge */}
            <button
              onClick={() => {
                sound.playBlip(700);
                setActiveNav('trainees');
                setActiveTab('my-learning');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 transition-all shadow-2xs cursor-pointer"
              title="View your personalized Individual Development Plan & Rank"
            >
              <span>{currentTierConfig.animalEmoji}</span>
              <span className="font-extrabold text-amber-700">{studentProfile.currentAnimalRank}</span>
              <span className="hidden sm:inline font-mono text-slate-500 text-[11px]">
                (L{currentTierConfig.levelNumber} • {studentProfile.dailyStreak}d streak)
              </span>
            </button>

            {/* Competency Gap Analysis Shortcut */}
            <button
              onClick={() => setIsCompetencyMatrixOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer"
            >
              <Target className="w-3.5 h-3.5 text-sky-600" />
              <span>Skills Matrix</span>
            </button>

            {/* Demo Accounts Switcher Trigger */}
            <button
              onClick={() => setIsDemoAccountModalOpen(!isDemoAccountModalOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-2xs cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>Demo Accounts</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Upload Demo Lecture (Restricted strictly to Trainers) */}
            {currentRole === 'Trainer' && (
              <button
                type="button"
                onClick={() => {
                  sound.playBlip(700);
                  setIsUploadLectureOpen(true);
                }}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white transition-all shadow-2xs cursor-pointer active:scale-95"
                title="Upload a new video masterclass with chapters and lecture notes (Trainer Only)"
              >
                <Video className="w-3.5 h-3.5" />
                <span>+ Upload Lecture</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Demo Accounts Card */}
        {isDemoAccountModalOpen && (
          <div className="px-6 py-3 w-full animate-in slide-in-from-top-2">
            <DemoAccountsCard
              currentRole={currentRole}
              onSelectRole={(r) => {
                handleSwitchRole(r);
                setIsDemoAccountModalOpen(false);
              }}
              onRequestAdminClearance={(target) => {
                setIsDemoAccountModalOpen(false);
                handleRequestAdminClearance(target);
              }}
              onClose={() => setIsDemoAccountModalOpen(false)}
            />
          </div>
        )}

        {/* Main Content Container */}
        <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-6">
          {/* Dynamic Role-Based Institutional Directive Banner */}
          {currentRole === 'Admin' && (
            <div className="p-5 sm:p-6 rounded-3xl border bg-gradient-to-r from-amber-50 via-white to-sky-50 border-amber-200 text-slate-800 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  🏛️
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500 text-white tracking-wider">
                      Apex Directorate Governance
                    </span>
                    <span className="text-xs text-amber-800 font-semibold font-mono">
                      Mausam Bhawan • New Delhi HQ
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                    Director General Command & Supreme Approvals Desk
                  </h1>
                  <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
                    Statutory authorization of faculty training requisitions and cadet clearances, live performance dossiers for teachers & students, and emergency radar network overrides.
                  </p>

                  {/* Live Admin Telemetry Chips */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-200">
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardView('cockpit');
                      }}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100/70 hover:bg-amber-100 border border-amber-300 text-amber-900 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Pending Requisitions: <strong className="text-slate-900">{pendingApprovalsCount}</strong></span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardView('cockpit');
                      }}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Faculty Profiles: <strong className="text-slate-900">{teachers.length}</strong></span>
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardView('cockpit');
                      }}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                      <span>Cadet Profiles: <strong className="text-slate-900">{trainees.length}</strong></span>
                    </button>
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5 text-blue-600" />
                      <span>DWR Stations: <strong className="text-slate-900">{stations.length}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Fast Actions */}
              <div className="flex flex-wrap lg:flex-col items-stretch gap-2 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setDashboardView('cockpit');
                  }}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorizations Queue ({pendingApprovalsCount})</span>
                </button>

                <button
                  onClick={() => setIsCrisisDrillOpen(true)}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Simulate National Crisis</span>
                </button>
              </div>
            </div>
          )}

          {currentRole === 'Trainer' && (
            <div className="p-5 sm:p-6 rounded-3xl border bg-gradient-to-r from-emerald-50 via-white to-sky-50 border-emerald-200 text-slate-800 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  🎓
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white tracking-wider">
                      Instructional Faculty Console
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold font-mono">
                      Central Training Institute (CTI) Pune
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                    Senior Meteorological Instructor & Research Dossier
                  </h1>
                  <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
                    Maintain curriculum syllabi, deliver high-definition free demo masterclasses to cadets, upload scientific publications, and lodge formal research and transmission requisitions directly to the Director General.
                  </p>

                  {/* Live Trainer Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-200">
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Research Papers: <strong className="text-slate-900">{teachers[0].publicationsCount}</strong></span>
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-teal-600" />
                      <span>Trainees Mentored: <strong className="text-slate-900">{teachers[0].studentsTrained}+</strong></span>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardView('cockpit');
                      }}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Requisitions to DG: <strong className="text-slate-900">{approvalRequests.filter((r) => r.requesterRole === 'Trainer').length}</strong></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trainer Actions */}
              <div className="flex flex-wrap lg:flex-col items-stretch gap-2 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setDashboardView('cockpit');
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Lodge Requisition to DG</span>
                </button>

                <button
                  onClick={() => setIsUploadLectureOpen(true)}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Video className="w-4 h-4 text-sky-600" />
                  <span>Publish Demo Masterclass</span>
                </button>
              </div>
            </div>
          )}

          {currentRole === 'Trainee' && (
            <div className="p-5 sm:p-6 rounded-3xl border bg-gradient-to-r from-sky-50 via-white to-blue-50/80 border-sky-200 text-slate-800 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-300 flex items-center justify-center text-2xl shrink-0 shadow-2xs">
                  🚀
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-600 text-white tracking-wider">
                      Operational Cadet Cockpit
                    </span>
                    <span className="text-xs text-sky-800 font-semibold font-mono">
                      {currentTierConfig.animalEmoji} {studentProfile.currentAnimalRank} (Level {currentTierConfig.levelNumber})
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 mt-1">
                    Forecaster Competency & Flight Deck
                  </h1>
                  <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
                    Master dual-polarization Doppler radar interpretation, climb the 6-axis meteorological skill matrix, compete in rapid 15s quiz blitzes, and submit official authorization requests to the Director General.
                  </p>

                  {/* Live Trainee Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-slate-200">
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-2xs">
                      <span>{currentTierConfig.animalEmoji}</span>
                      <span>Streak: <strong className="text-slate-900">{studentProfile.dailyStreak} Days</strong></span>
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-2xs">
                      <Award className="w-3.5 h-3.5 text-amber-500" />
                      <span>XP Accumulated: <strong className="text-slate-900">{currentXP} XP</strong></span>
                    </span>
                    <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 flex items-center gap-1.5 shadow-2xs">
                      <Radio className="w-3.5 h-3.5 text-sky-600" />
                      <span>Radar Readiness: <strong className="text-slate-900">{trainees[0].readinessScore}%</strong></span>
                    </span>
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setDashboardView('cockpit');
                      }}
                      className="px-3 py-1 rounded-xl text-xs font-semibold bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5 text-sky-600" />
                      <span>Cadet Requests to DG: <strong className="text-slate-900">{approvalRequests.filter((r) => r.requesterRole === 'Trainee').length}</strong></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Trainee Actions */}
              <div className="flex flex-wrap lg:flex-col items-stretch gap-2 w-full lg:w-auto shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('competency');
                    setCompetencySubTab('arena');
                  }}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-current text-white animate-bounce" />
                  <span>Play Cadet Quiz Arena ⚡</span>
                </button>

                <button
                  onClick={() => {
                    setActiveNav('trainees');
                    setActiveTab('competency');
                    setCompetencySubTab('simulator');
                  }}
                  className="px-4 py-2 bg-white hover:bg-sky-50 border border-sky-200 text-sky-800 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
                >
                  <Radio className="w-4 h-4 text-sky-600" />
                  <span>Launch Doppler Sim</span>
                </button>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 1: PORTAL COMMAND HUB / OCEAN & LEARNING DASHBOARD
          ========================================================================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Dashboard Sub-View Mode Selector */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => {
                      sound.playBlip(700);
                      setDashboardView('ocean');
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                      dashboardView === 'ocean'
                        ? 'bg-[#ea580c] text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>🌊</span>
                    <span>Ocean Capacity Hub (Overview)</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playBlip(700);
                      setDashboardView('telemetry');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dashboardView === 'telemetry'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>📊</span>
                    <span>Network Telemetry & DWR Stations</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playBlip(700);
                      setDashboardView('cockpit');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dashboardView === 'cockpit'
                        ? currentRole === 'Admin'
                          ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                          : currentRole === 'Trainer'
                            ? 'bg-emerald-600 text-white font-bold shadow-xs'
                            : 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>{currentRole === 'Admin' ? '🏛️' : currentRole === 'Trainer' ? '🎓' : '🚀'}</span>
                    <span>{currentRole} Cockpit</span>
                    {currentRole === 'Admin' && pendingApprovalsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950 text-amber-300 font-mono font-bold animate-pulse">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      sound.playBlip(700);
                      setDashboardView('command-network');
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      dashboardView === 'command-network'
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <span>🌐</span>
                    <span>National Radar Command</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-500 px-2">
                  <span>Learner</span>
                  <span>•</span>
                  <span>MoES India</span>
                </div>
              </div>

              {/* View 1: Primary Ocean Capacity Dashboard matching screenshot */}
              {dashboardView === 'ocean' && (
                <OceanCapacityDashboard
                  userXP={currentXP}
                  dailyStreak={studentProfile.dailyStreak}
                  badgesCount={8}
                  onStartCourse={(courseId) => {
                    setActiveNav('courses');
                    setActiveTab('training');
                    setTrainingSubTab('courses');
                    showToast('Navigating to course curriculum...');
                  }}
                  onOpenSkillTree={() => {
                    setIsCompetencyMatrixOpen(true);
                  }}
                  onOpenQuizArena={() => {
                    setActiveNav('quests');
                    setActiveTab('competency');
                    setCompetencySubTab('arena');
                  }}
                  onOpenVideoPlayer={(title) => {
                    setActiveLectureForVideo(demoLectures[0]);
                  }}
                  onOpenProfile={() => {
                    setIsStudentProfileModalOpen(true);
                  }}
                  onAwardXP={handleAwardXP}
                />
              )}

              {/* View 2: Figma High-Fidelity Dashboard: 3 Top KPI Cards, Connection Over Time line chart, Recent Trainees, and DWR Stations */}
              {dashboardView === 'telemetry' && (
                <FigmaDashboardView
                  stations={stations}
                  trainees={trainees}
                  onSelectStation={(st) => setSelectedStation(st)}
                  onOpenDrill={() => setIsCrisisDrillOpen(true)}
                  onNavigateToTrainees={() => {
                    setActiveNav('trainees');
                    setActiveTab('competency');
                  }}
                  onNavigateToCourses={() => {
                    setActiveNav('courses');
                    setActiveTab('training');
                    setTrainingSubTab('courses');
                  }}
                />
              )}

              {/* View 3: Radar Command Overview */}
              {dashboardView === 'command-network' && (
                <CommandOverview
                  stations={stations}
                  trainees={trainees}
                  activityLogs={activityLogs}
                  onSelectStation={(st) => setSelectedStation(st)}
                  onOpenRadarLab={() => {
                    setActiveNav('trainees');
                    setActiveTab('competency');
                    setCompetencySubTab('simulator');
                  }}
                  onOpenCourses={() => {
                    setActiveNav('courses');
                    setActiveTab('training');
                    setTrainingSubTab('courses');
                  }}
                  onOpenDrill={() => setIsCrisisDrillOpen(true)}
                />
              )}

              {/* View 4: Role-specific Cockpits (Admin, Trainer, Trainee) */}
              {dashboardView === 'cockpit' && (
                <>
                  {currentRole === 'Admin' && (
                    <div className="space-y-6">
                      {/* Director General Multi-Console Authority Toolbar:
                          Only Admin can access trainee and trainer's dashboard */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-amber-500/40 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-xl shrink-0 shadow-inner">
                            👑
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                                Directorate Multi-Console Command
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-slate-950">
                                Unrestricted Super-Admin Access
                              </span>
                            </div>
                            <p className="text-xs text-slate-300">
                              As Admin, you hold statutory clearance to inspect and audit Trainee and Trainer consoles in real time.
                            </p>
                          </div>
                        </div>

                        {/* 3 Cockpit Inspection Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800 w-full md:w-auto">
                          <button
                            onClick={() => {
                              sound.playBlip(700);
                              setAdminInspectionMode('admin');
                            }}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              adminInspectionMode === 'admin'
                                ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <span>🏛️</span>
                            <span>Admin Governance Desk</span>
                            {pendingApprovalsCount > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-amber-300 font-mono font-bold">
                                {pendingApprovalsCount}
                              </span>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              sound.playBlip(700);
                              setAdminInspectionMode('trainer');
                            }}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              adminInspectionMode === 'trainer'
                                ? 'bg-emerald-600 text-white font-black shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <span>🎓</span>
                            <span>Inspect Trainer's Console</span>
                          </button>

                          <button
                            onClick={() => {
                              sound.playBlip(700);
                              setAdminInspectionMode('trainee');
                            }}
                            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                              adminInspectionMode === 'trainee'
                                ? 'bg-indigo-600 text-white font-black shadow-xs'
                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                          >
                            <span>🚀</span>
                            <span>Inspect Trainee's Flight Deck</span>
                          </button>
                        </div>
                      </div>

                      {/* Display Selected Mode for Admin */}
                      {adminInspectionMode === 'admin' && (
                        <AdminDashboard
                          stations={stations}
                          trainees={trainees}
                          teachers={teachers}
                          demoLectures={demoLectures}
                          jobOpenings={jobOpenings}
                          activityLogs={activityLogs}
                          approvalRequests={approvalRequests}
                          onSelectStation={(st) => setSelectedStation(st)}
                          onViewTeacherResume={(t) => setActiveTeacherForResume(t)}
                          onViewStudentProfile={(t) => {
                            setStudentProfile((prev) => ({
                              ...prev,
                              name: t.name,
                              division: t.specialization,
                              station: t.station,
                              batch: t.batch,
                              radarHours: t.readinessScore * 3,
                            }));
                            setIsStudentProfileModalOpen(true);
                          }}
                          onPlayLecture={(lec) => setActiveLectureForVideo(lec)}
                          onRecruitTeacher={handleRecruitTeacher}
                          onCommissionTrainee={handleCommissionTrainee}
                          onAddJobOpening={handleAddJobOpening}
                          onApproveRequest={handleApproveRequest}
                          onRejectRequest={handleRejectRequest}
                          onUpdateStationAlert={handleUpdateStationAlert}
                          onOpenDrill={() => setIsCrisisDrillOpen(true)}
                        />
                      )}

                      {adminInspectionMode === 'trainer' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-emerald-950/90 border border-emerald-500/60 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">👁️</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black uppercase text-emerald-400">
                                    Director General Live Audit
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">
                                    Dr. Someshwar Rao (Faculty)
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300">
                                  You are reviewing faculty instructional courseware, demo lectures, and requisitions under supreme statutory authority.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                sound.playBlip(700);
                                setAdminInspectionMode('admin');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
                            >
                              Return to Admin Desk
                            </button>
                          </div>

                          <TrainerDashboard
                            teacher={teachers[0]}
                            demoLectures={demoLectures}
                            jobOpenings={jobOpenings}
                            approvalRequests={approvalRequests}
                            onUpdateTeacher={handleUpdateTeacher}
                            onOpenUploadLecture={() => setIsUploadLectureOpen(true)}
                            onPlayLecture={(lec) => setActiveLectureForVideo(lec)}
                            onViewTeacherResume={(t) => setActiveTeacherForResume(t)}
                            onApplyForJob={handleApplyForJob}
                            onSubmitApprovalRequest={handleSubmitApprovalRequest}
                          />
                        </div>
                      )}

                      {adminInspectionMode === 'trainee' && (
                        <div className="space-y-4">
                          <div className="p-4 bg-indigo-950/90 border border-cyan-500/60 rounded-2xl text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">👁️</span>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black uppercase text-cyan-400">
                                    Director General Live Audit
                                  </span>
                                  <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
                                    Julianne Moore (Cadet)
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300">
                                  You are reviewing cadet telemetry, Doppler radar simulator hours, daily streak progress, and requisition approvals.
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                sound.playBlip(700);
                                setAdminInspectionMode('admin');
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shrink-0 transition-all cursor-pointer shadow-xs"
                            >
                              Return to Admin Desk
                            </button>
                          </div>

                          <TraineeDashboard
                            trainee={trainees[0]}
                            demoLectures={demoLectures}
                            courses={courses}
                            studentProfile={studentProfile}
                            approvalRequests={approvalRequests}
                            onUpdateStudentProfile={setStudentProfile}
                            onAwardXP={handleAwardXP}
                            onPlayLecture={(lec) => setActiveLectureForVideo(lec)}
                            onOpenRadarLab={() => {
                              setActiveNav('trainees');
                              setActiveTab('competency');
                              setCompetencySubTab('simulator');
                            }}
                            onOpenCourses={() => {
                              setActiveNav('courses');
                              setActiveTab('training');
                              setTrainingSubTab('courses');
                            }}
                            onOpenDrill={() => setIsCrisisDrillOpen(true)}
                            onOpenCertificate={(c) => setCertificateCourse(c)}
                            onOpenQuizArena={() => {
                              setActiveNav('trainees');
                              setActiveTab('competency');
                              setCompetencySubTab('arena');
                            }}
                            onSubmitApprovalRequest={handleSubmitApprovalRequest}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {currentRole === 'Trainer' && (
                    <TrainerDashboard
                      teacher={teachers[0]}
                      demoLectures={demoLectures}
                      jobOpenings={jobOpenings}
                      approvalRequests={approvalRequests}
                      onUpdateTeacher={handleUpdateTeacher}
                      onOpenUploadLecture={() => setIsUploadLectureOpen(true)}
                      onOpenUploadStudyMaterial={() => {
                        setActiveTab('knowledge');
                        setKnowledgeSubTab('hub');
                        setIsUploadStudyMaterialOpen(true);
                      }}
                      onPlayLecture={(lec) => setActiveLectureForVideo(lec)}
                      onViewTeacherResume={(t) => setActiveTeacherForResume(t)}
                      onApplyForJob={handleApplyForJob}
                      onSubmitApprovalRequest={handleSubmitApprovalRequest}
                    />
                  )}

                  {currentRole === 'Trainee' && (
                    <TraineeDashboard
                      trainee={trainees[0]}
                      demoLectures={demoLectures}
                      courses={courses}
                      studentProfile={studentProfile}
                      approvalRequests={approvalRequests}
                      onUpdateStudentProfile={setStudentProfile}
                      onAwardXP={handleAwardXP}
                      onPlayLecture={(lec) => setActiveLectureForVideo(lec)}
                      onOpenRadarLab={() => {
                        setActiveNav('trainees');
                        setActiveTab('competency');
                        setCompetencySubTab('simulator');
                      }}
                      onOpenCourses={() => {
                        setActiveNav('courses');
                        setActiveTab('training');
                        setTrainingSubTab('courses');
                      }}
                      onOpenDrill={() => setIsCrisisDrillOpen(true)}
                      onOpenCertificate={(c) => setCertificateCourse(c)}
                      onOpenQuizArena={() => {
                        setActiveNav('trainees');
                        setActiveTab('competency');
                        setCompetencySubTab('arena');
                      }}
                      onSubmitApprovalRequest={handleSubmitApprovalRequest}
                    />
                  )}
                </>
              )}
            </div>
          )}

        {/* =========================================================================
            TAB 2: PILLAR 1: ORGANIZATIONAL TRAINING
        ========================================================================= */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            {/* Pillar Sub-navigation */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
              isBright ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-sky-500" />
                  <h2 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    Pillar 1: Organizational Training Management
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Standardized WMO Curricula, Free Faculty Video Masterclasses, and Workforce Batch Deployment.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setTrainingSubTab('courses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    trainingSubTab === 'courses'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <span>Curriculum & Courses ({courses.length})</span>
                </button>

                <button
                  onClick={() => setTrainingSubTab('masterclasses')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    trainingSubTab === 'masterclasses'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <span>Free Video Masterclasses ({demoLectures.length})</span>
                </button>

                <button
                  onClick={() => setTrainingSubTab('roster')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    trainingSubTab === 'roster'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  <span>Workforce Batches & Roster ({trainees.length})</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: Courses Academy */}
            {trainingSubTab === 'courses' && (
              <CoursesAcademy
                courses={courses}
                onOpenCertificate={(course) => setCertificateCourse(course)}
                onAwardXP={handleAwardXP}
                onAddCourse={handleAddCourse}
                currentRole={currentRole}
              />
            )}

            {/* Sub-Tab 2: Free Video Masterclasses Showcase */}
            {trainingSubTab === 'masterclasses' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${
                  isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1629] border-slate-800 shadow-xl'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-emerald-500" />
                        <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                          Free Meteorological Video Masterclasses
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Open-access training lectures uploaded by accredited IMD faculty and meteorological researchers.
                      </p>
                    </div>

                    {/* Demo lectures can ONLY be uploaded by trainers */}
                    {currentRole === 'Trainer' ? (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playBlip(700);
                          setIsUploadLectureOpen(true);
                        }}
                        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl transition-all shadow-md active:scale-95 cursor-pointer ${
                          isBright
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20 ring-2 ring-emerald-400/30'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                        }`}
                        title="Upload a new video masterclass with chapters and lecture notes (Trainer Only)"
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>Upload Demo Lecture (Trainer)</span>
                        <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">
                          Faculty
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 text-xs font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                        <span>Faculty Masterclasses • Free Cadet Access</span>
                      </div>
                    )}
                  </div>

                  {/* Organized Trainer Lecture Management Strip */}
                  {currentRole === 'Trainer' && (
                    <div className={`mb-5 p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                      isBright
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                        : 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <span className="p-1.5 rounded-lg bg-emerald-600 text-white shadow-2xs">
                          <Video className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="font-bold">Faculty Masterclass Production Deck</p>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300">
                            {demoLectures.length} lectures currently published for cadets. Add custom chapter markers, quiz timestamps, and slides.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          sound.playBlip(700);
                          setIsUploadLectureOpen(true);
                        }}
                        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs active:scale-95 cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Upload New Lecture</span>
                      </button>
                    </div>
                  )}

                  {/* Lecture Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {demoLectures.map((lec) => (
                      <div
                        key={lec.id}
                        className={`rounded-xl border overflow-hidden flex flex-col justify-between transition-all ${
                          isBright ? 'bg-slate-50 border-slate-200 hover:shadow-md' : 'bg-[#0f192d] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-slate-900 group">
                          <img src={lec.thumbnailUrl} alt={lec.title} className="w-full h-full object-cover" />
                          <button
                            onClick={() => setActiveLectureForVideo(lec)}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-90 group-hover:opacity-100"
                          >
                            <span className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow">
                              ▶
                            </span>
                          </button>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white font-mono text-[10px] rounded">
                            {lec.durationMinutes} min
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <span className="text-[10px] font-mono text-sky-600 dark:text-cyan-400 uppercase font-bold">
                            {lec.category}
                          </span>
                          <h4 className="text-xs font-bold line-clamp-1">{lec.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                            {lec.description}
                          </p>
                          <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">{lec.teacherName}</span>
                            <button
                              onClick={() => setActiveLectureForVideo(lec)}
                              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                            >
                              Watch Free
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Workforce Batches & Roster */}
            {trainingSubTab === 'roster' && (
              <WorkforceRoster
                trainees={trainees}
                stations={stations}
                onUpdateTrainee={handleUpdateTrainee}
                onAddTrainee={handleAddTrainee}
                onAwardXP={handleAwardXP}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: PILLAR 2: COMPETENCY DEVELOPMENT
        ========================================================================= */}
        {activeTab === 'competency' && (
          <div className="space-y-6">
            {/* Pillar Sub-navigation */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
              isBright ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-emerald-500" />
                  <h2 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    Pillar 2: Competency Development Engine
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Multi-Axis Skills Framework, 360° Doppler Radar Simulator, and Forecaster Competency Ladder.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCompetencySubTab('matrix')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    competencySubTab === 'matrix'
                      ? isBright
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : isBright
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>Skills Matrix & Gap Analysis</span>
                </button>

                <button
                  onClick={() => setCompetencySubTab('simulator')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    competencySubTab === 'simulator'
                      ? isBright
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                      : isBright
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>360° Doppler Radar Sim Lab</span>
                </button>

                <button
                  onClick={() => setCompetencySubTab('arena')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    competencySubTab === 'arena'
                      ? isBright
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs font-black'
                        : 'bg-gradient-to-r from-amber-500 to-rose-600 text-white font-black'
                      : isBright
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Cadet Quiz Arena</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: 6-Domain Competency Framework & Gap Analysis */}
            {competencySubTab === 'matrix' && (
              <div className="space-y-6">
                {/* Executive Summary Card */}
                <div className={`p-6 rounded-2xl border ${
                  isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1629] border-slate-800 shadow-xl'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">
                        WMO 258 / IMD Competency Standard
                      </span>
                      <h3 className={`text-lg font-bold tracking-tight mt-1.5 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                        Forecaster 6-Axis Competency Framework & Skill Gap Benchmark
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Active assessment of Dr. Rajeshwari Menon against operational readiness benchmarks.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsCompetencyMatrixOpen(true)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isBright
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                        }`}
                      >
                        <Sliders className="w-3.5 h-3.5" />
                        <span>Launch Full Detailed Matrix Modal</span>
                      </button>
                    </div>
                  </div>

                  {/* 6 Competency Domain Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        title: 'Doppler Radar Meteorology',
                        desc: 'Velocity de-aliasing, PPI/RHI scans, dual-pol ZDR & KDP',
                        current: trainees[0].competency.radarMeteorology,
                        benchmark: 85,
                        icon: Radio,
                        color: 'text-cyan-500'
                      },
                      {
                        title: 'Severe Weather Nowcasting',
                        desc: 'Bow echo detection, hook echo mesocyclones, microburst warnings',
                        current: trainees[0].competency.severeNowcasting,
                        benchmark: 90,
                        icon: Zap,
                        color: 'text-amber-500'
                      },
                      {
                        title: 'Numerical Weather Prediction & AI',
                        desc: 'High-res NWP interpretation, WRF ensembles, AI forecasting models',
                        current: trainees[0].competency.numericalWeatherPrediction,
                        benchmark: 80,
                        icon: Cpu,
                        color: 'text-purple-500'
                      },
                      {
                        title: 'Satellite & Cloud Microphysics',
                        desc: 'INSAT-3D RGB composites, rapid-scan convection, water vapor tracers',
                        current: trainees[0].competency.satelliteMeteorology,
                        benchmark: 75,
                        icon: Satellite,
                        color: 'text-indigo-500'
                      },
                      {
                        title: 'Synoptic Analysis & Monsoon Systems',
                        desc: 'Depression tracks, monsoon trough oscillations, WMO plotting',
                        current: trainees[0].competency.synopticAnalysis,
                        benchmark: 85,
                        icon: CloudRain,
                        color: 'text-blue-500'
                      },
                      {
                        title: 'Agro-Advisory & Early Warning',
                        desc: 'District agromet bulletins, farmer SMS alerts, SOP compliance',
                        current: trainees[0].competency.agroAdvisory,
                        benchmark: 80,
                        icon: ShieldCheck,
                        color: 'text-emerald-500'
                      },
                    ].map((dom, idx) => {
                      const gap = dom.current - dom.benchmark;
                      const Icon = dom.icon;
                      return (
                        <div
                          key={idx}
                          className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                            isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0f192e] border-slate-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className={`w-4 h-4 ${dom.color}`} />
                                <h4 className="text-xs font-bold truncate">{dom.title}</h4>
                              </div>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                gap >= 0 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                  : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              }`}>
                                {gap >= 0 ? `+${gap}% Qualified` : `${gap}% Gap`}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {dom.desc}
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-mono">
                              <span className="text-slate-400">Current: {dom.current}%</span>
                              <span className="text-slate-500">Benchmark: {dom.benchmark}%</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  dom.current >= dom.benchmark ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}
                                style={{ width: `${Math.min(100, dom.current)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Direct Action Hub: Simulate or Take Quiz */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    onClick={() => setCompetencySubTab('simulator')}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      isBright ? 'bg-cyan-50/60 hover:bg-cyan-100/60 border-cyan-200' : 'bg-cyan-950/30 hover:bg-cyan-900/40 border-cyan-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Radio className="w-5 h-5 text-cyan-500" />
                      <h4 className="text-sm font-bold">360° Doppler Radar Simulator Lab</h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Practice real-time velocity de-aliasing, hook echo identification, and PPI/RHI scan interpretations.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-4">
                      Launch Radar Simulator <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div 
                    onClick={() => setCompetencySubTab('arena')}
                    className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                      isBright ? 'bg-amber-50/60 hover:bg-amber-100/60 border-amber-200' : 'bg-amber-950/30 hover:bg-amber-900/40 border-amber-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-5 h-5 text-amber-500" />
                      <h4 className="text-sm font-bold">Cadet Weather Quiz Arena</h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Engage in 15-second Doppler Blitz challenges, Radar Mystery Canvas, and competency promotions.
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 mt-4">
                      Enter Quiz Arena <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Doppler Radar Sim Lab */}
            {competencySubTab === 'simulator' && (
              <RadarSimLab
                scenarios={RADAR_SCENARIOS}
                onAwardXP={handleAwardXP}
              />
            )}

            {/* Sub-Tab 3: Cadet Quiz Arena */}
            {competencySubTab === 'arena' && (
              <StudentFunQuizArena
                studentProfile={studentProfile}
                onUpdateProfile={setStudentProfile}
                onAwardXP={handleAwardXP}
                onClose={() => setCompetencySubTab('matrix')}
              />
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: PILLAR 3: KNOWLEDGE SHARING
        ========================================================================= */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            {/* Pillar Sub-navigation */}
            <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 ${
              isBright ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#0d1629] border-slate-800'
            }`}>
              <div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-purple-500" />
                  <h2 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                    Pillar 3: Knowledge Sharing & Faculty Exchange
                  </h2>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Institutional Repository, Field SOP Vault, Expert Q&A Forum, and Faculty Recruitment Hub.
                </p>
              </div>

              {/* Sub-tab pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setKnowledgeSubTab('hub')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    knowledgeSubTab === 'hub'
                      ? isBright
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : isBright
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>SOP Vault, Case Studies & Forum</span>
                </button>

                <button
                  onClick={() => setKnowledgeSubTab('faculty')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    knowledgeSubTab === 'faculty'
                      ? isBright
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                      : isBright
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <span>Faculty Directory & Recruitment ({teachers.length})</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab 1: SOP Vault & Case Studies & Discussion Forum */}
            {knowledgeSubTab === 'hub' && (
              <KnowledgeSharingHub
                currentUserRole={currentRole}
                onAwardXP={handleAwardXP}
                isExternalUploadOpen={isUploadStudyMaterialOpen}
                onCloseExternalUpload={() => setIsUploadStudyMaterialOpen(false)}
              />
            )}

            {/* Sub-Tab 2: Faculty Directory & Teacher Recruitment Platform */}
            {knowledgeSubTab === 'faculty' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border ${
                  isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1629] border-slate-800 shadow-xl'
                }`}>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                        Meteorological Faculty Directory & Recruitment Requisitions
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Teachers upload their CV and research credentials. Regional radar stations and DG IMD issue recruitment requisitions.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (currentRole !== 'Trainer') {
                          setCurrentRole('Trainer');
                          showToast('Switched to Trainer mode to manage your faculty resume.');
                        }
                        setActiveTab('dashboard');
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all bg-black hover:bg-neutral-800 text-white shadow-xs cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Manage My Teacher Resume</span>
                    </button>
                  </div>

                  {/* Teachers Roster Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teachers.map((teach) => (
                      <div
                        key={teach.id}
                        className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                          isBright
                            ? 'bg-slate-50/80 hover:bg-white hover:border-black border-slate-200'
                            : 'bg-[#0f192e] hover:bg-[#121f3a] hover:border-neutral-500 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {teach.avatar ? (
                            <img
                              src={teach.avatar}
                              alt={teach.name}
                              className="w-14 h-14 rounded-2xl object-cover border-2 border-black shrink-0"
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-base text-slate-800 dark:text-slate-100 shrink-0">
                              {teach.name.replace(/^(Dr\.|Prof\.)\s*/, '').split(' ').map((n) => n[0]).join('').slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                              {teach.name}
                            </h4>
                            <p className="text-xs font-semibold text-black dark:text-white mt-0.5 truncate">
                              {teach.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {teach.institution} • {teach.experienceYears} Yrs Exp
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <div className="text-[11px] font-mono text-slate-400">
                            Degree: {teach.highestDegree}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {teach.specializations.slice(0, 3).map((s, i) => (
                              <span
                                key={i}
                                className={`px-1.5 py-0.5 text-[10px] rounded border ${
                                  isBright ? 'bg-white border-slate-200 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'
                                }`}
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setActiveTeacherForResume(teach)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                              isBright
                                ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                            }`}
                          >
                            View Full Resume
                          </button>

                          <button
                            onClick={() => handleRecruitTeacher(teach.id, 'Central Training Institute, Pune')}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                              isBright
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold'
                            }`}
                          >
                            Recruit Teacher
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Job Openings Section */}
                <div className={`p-6 rounded-2xl border ${
                  isBright ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0d1629] border-slate-800 shadow-xl'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className={`text-base font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
                        Current Teaching Vacancies & Requisitions ({jobOpenings.length})
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Faculty requisitions broadcasted by IMD Headquarters and Regional Radar Stations.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {jobOpenings.map((job) => (
                      <div
                        key={job.id}
                        className={`p-4 rounded-xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                          isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f192d] border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-cyan-400">
                              {job.stationCode}
                            </span>
                            <h4 className="text-sm font-bold">{job.title}</h4>
                            <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-500 rounded">
                              {job.type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {job.stationName} • {job.experienceRequired} • {job.salaryRange}
                          </p>
                        </div>

                        <button
                          onClick={() => handleApplyForJob(job.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            isBright
                              ? 'bg-sky-600 hover:bg-sky-700 text-white'
                              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold'
                          }`}
                        >
                          Apply with Teacher Resume
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: TRAINEE PORTAL & INDIVIDUAL DEVELOPMENT PLAN (IDP)
        ========================================================================= */}
        {activeTab === 'my-learning' && (
          <div className="space-y-6">
            <StudentProfileCard
              profile={studentProfile}
              onUpdateProfile={setStudentProfile}
              onAwardXP={handleAwardXP}
              onOpenVideoLecture={() => {
                setActiveTab('training');
                setTrainingSubTab('masterclasses');
              }}
              onOpenQuizArena={() => {
                setActiveTab('competency');
                setCompetencySubTab('arena');
              }}
            />
          </div>
        )}
      </main>

      {/* Discreet Bottom Controls: Theme & Sound */}
      <div className={`fixed bottom-4 left-4 z-40 flex items-center gap-1.5 p-1 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
        isBright
          ? 'bg-white/90 border-slate-200 text-slate-700'
          : 'bg-slate-900/90 border-slate-800 text-slate-300'
      }`}>
        <button
          onClick={handleThemeToggle}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
            isBright
              ? 'hover:bg-amber-50 hover:text-amber-800'
              : 'hover:bg-slate-800 hover:text-white'
          }`}
          title={isBright ? 'Switch to Dark Ops' : 'Switch to Daylight Bright'}
        >
          {isBright ? <Sun className="w-3.5 h-3.5 text-amber-600" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          <span className="text-[11px] font-semibold">{isBright ? 'Bright' : 'Dark'}</span>
        </button>
        <div className={`w-[1px] h-3.5 ${isBright ? 'bg-slate-200' : 'bg-slate-800'}`} />
        <button
          onClick={toggleSound}
          className={`p-1.5 rounded-lg text-xs transition-all ${
            isBright
              ? 'hover:bg-slate-100 text-slate-600'
              : 'hover:bg-slate-800 text-slate-400'
          }`}
          title={isMuted ? 'Unmute audio' : 'Mute audio'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-500" />}
        </button>
      </div>

      {/* Capacity AI Advisor: Professional Meteorological Guidance */}
      <MikuPetGuide
        activeTab={activeTab}
        onNavigateTab={(tab) => {
          setActiveTab(tab as typeof activeTab);
          sound.playBlip(700);
        }}
        onOpenDrill={() => setIsCrisisDrillOpen(true)}
        onAwardXP={handleAwardXP}
      />

      {/* =========================================================================
          APPLICATION MODALS
      ========================================================================= */}

      {/* 1. 6-Axis Competency Matrix Modal */}
      <CompetencyMatrixModal
        isOpen={isCompetencyMatrixOpen}
        onClose={() => setIsCompetencyMatrixOpen(false)}
        trainee={trainees[0]}
        studentProfile={studentProfile}
        onNavigateToTab={(tab) => {
          setIsCompetencyMatrixOpen(false);
          setActiveTab(tab as typeof activeTab);
        }}
      />

      {/* 3. Teacher Full Resume & Recruitment Modal */}
      <TeacherResumeModal
        teacher={activeTeacherForResume}
        isOpen={Boolean(activeTeacherForResume)}
        onClose={() => setActiveTeacherForResume(null)}
        onRecruitTeacher={handleRecruitTeacher}
        currentUserRole={currentRole}
      />

      {/* 4. Free Demo Video Lecture Upload Modal (Restricted strictly to Trainers) */}
      <UploadDemoLectureModal
        isOpen={isUploadLectureOpen && currentRole === 'Trainer'}
        onClose={() => setIsUploadLectureOpen(false)}
        onPublishLecture={handlePublishLecture}
        teacherName={teachers[0]?.name}
        teacherTitle={teachers[0]?.title}
        teacherAvatar={teachers[0]?.avatar}
      />

      {/* 5. Interactive Video Player Modal */}
      <VideoPlayerModal
        lecture={activeLectureForVideo}
        isOpen={Boolean(activeLectureForVideo)}
        onClose={() => setActiveLectureForVideo(null)}
        onLectureCompleted={() => {
          handleAwardXP(150, 'Completed Free Demo Lecture Study');
          const newLectures = studentProfile.lecturesWatched + 1;
          const newStreak = studentProfile.lectureStreakDays + 1;
          const newDaily = studentProfile.dailyStreak + 1;
          const newRank = calculateStudentAnimalRank(newLectures, studentProfile.quizzesDone, studentProfile.quizAverageScore);
          setStudentProfile((prev) => ({
            ...prev,
            lecturesWatched: newLectures,
            lectureStreakDays: newStreak,
            dailyStreak: newDaily,
            xp: prev.xp + 150,
            currentAnimalRank: newRank,
            weeklyStreakMap: prev.weeklyStreakMap.map((d, i) =>
              i === prev.weeklyStreakMap.length - 1 ? { ...d, watched: true, active: true } : d
            ),
          }));
        }}
      />

      {/* 6. Crisis Drill Modal */}
      <CrisisDrillModal
        isOpen={isCrisisDrillOpen}
        onClose={() => setIsCrisisDrillOpen(false)}
        onDrillComplete={handleDrillComplete}
      />

      {/* 7. Station Detail Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
        onUpdateStationAlert={handleUpdateStationAlert}
        onLaunchStationDrill={() => setIsCrisisDrillOpen(true)}
      />

      {/* 8. Certificate Modal */}
      <CertificateModal
        course={certificateCourse}
        recipientName={currentRole === 'Admin' ? 'Dr. Ananya Sengupta' : trainees[0].name}
        onClose={() => setCertificateCourse(null)}
      />

      {/* 9. Student Modern Competency Profile & Streaks Modal */}
      <StudentProfileModal
        isOpen={isStudentProfileModalOpen}
        onClose={() => setIsStudentProfileModalOpen(false)}
        profile={studentProfile}
        onUpdateProfile={setStudentProfile}
        onAwardXP={handleAwardXP}
        onOpenVideoLecture={() => {
          setIsStudentProfileModalOpen(false);
          setActiveTab('training');
          setTrainingSubTab('masterclasses');
        }}
        onOpenQuizArena={() => {
          setIsStudentProfileModalOpen(false);
          setActiveTab('competency');
          setCompetencySubTab('arena');
        }}
      />

      {/* 10. Security Clearance Modal (Prevents learners from accessing Admin Dashboard) */}
      <AdminClearanceModal
        isOpen={isClearanceModalOpen}
        onClose={() => setIsClearanceModalOpen(false)}
        targetRole={pendingTargetRole}
        onGrantAccess={handleGrantClearance}
      />

      {/* 11. Faculty & Trainee Chat Window with Anonymous Lounge and Feedback Hub */}
      <ChatSystemWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentRole={currentRole}
        currentUserName={
          currentRole === 'Admin' 
            ? 'Dr. M. Mohapatra (DG IMD)' 
            : currentRole === 'Trainer' 
              ? 'Dr. Someshwar Rao' 
              : trainees[0]?.name || 'Julianne Moore'
        }
        lectures={demoLectures}
        courses={courses}
        onAwardXP={handleAwardXP}
      />

      {/* Floating Chat & Anonymous Lounge Action Button (Inside Cockpit, Not on Landing Homepage) */}
      <button
        type="button"
        onClick={() => {
          sound.playBlip(750);
          setIsChatOpen((prev) => !prev);
        }}
        className={`fixed bottom-6 right-6 z-40 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 font-bold text-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
          isBright
            ? 'bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-indigo-300'
            : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)]'
        }`}
        aria-label="Open Faculty & Trainee Chat with Anonymous Lounge and Feedback"
      >
        <div className="relative">
          <MessageSquare className="w-4 h-4" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-1 -right-1 border-2 border-white dark:border-slate-900 animate-pulse" />
        </div>
        <span className="hidden sm:inline">Faculty Chat</span>
        <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-mono tracking-wide">
          + Anonymous
        </span>
      </button>

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed bottom-5 left-5 z-50 rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2.5 animate-in slide-in-from-bottom-5 shadow-2xl ${
          isBright
            ? 'bg-white border border-sky-300 text-slate-800 shadow-xl'
            : 'bg-[#0b1220] border border-cyan-500/50 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]'
        }`}>
          <Sparkles className={`w-4 h-4 shrink-0 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Professional Institutional Footer */}
      <footer className={`border-t py-4 px-6 text-center text-xs font-mono backdrop-blur-md transition-colors ${
        isBright 
          ? 'border-slate-200/80 bg-white/75 text-slate-600' 
          : 'border-slate-800/80 bg-[#050811]/75 text-slate-400'
      }`}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CAPACITY CONNECT • Digital Capacity Building & Learning Management Portal (MoES / IMD)</span>
          <span>Doppler S/C/X Band Telemetry Synchronized • Training • Competency • Knowledge Sharing</span>
        </div>
      </footer>
      </div>
    </div>
  );
}
