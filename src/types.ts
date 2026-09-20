export type UserRole = 'Admin' | 'Trainer' | 'Trainee' | 'Faculty';

export interface DemoAccount {
  role: UserRole;
  name: string;
  email: string;
  designation: string;
  avatar: string;
  badge: string;
  description: string;
}

export interface DemoLectureChapter {
  title: string;
  timestamp: string;
}

export interface DemoLecture {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherTitle: string;
  teacherAvatar: string;
  title: string;
  category: 'Radar Meteorology' | 'Cyclone Dynamics' | 'Severe Weather Nowcasting' | 'Satellite & NWP' | 'Agro-Meteorology';
  durationMinutes: number;
  description: string;
  videoUrl: string; // real video link or uploaded object URL
  thumbnailUrl: string;
  slidesFileName?: string;
  views: number;
  likes: number;
  rating: number; // e.g. 4.9
  createdAt: string;
  isFreeDemo: boolean;
  chapters: DemoLectureChapter[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  title: string;
  department: string;
  institution: string;
  experienceYears: number;
  qualification: string;
  highestDegree: string;
  specializations: string[];
  bio: string;
  publicationsCount: number;
  topPublications: string[];
  radarHardwareExperience: string[];
  resumeFileName?: string;
  resumeFileUrl?: string;
  resumeUploadedAt?: string;
  recruitmentStatus: 'Available for Recruitment' | 'Employed - Open for Guest Faculty' | 'Commissioned IMD Faculty';
  appliedJobIds: string[];
  rating: number;
  studentsTrained: number;
  hourlyRateOrHonorarium?: string;
  verifiedBadge: boolean;
}

export interface FacultyJobOpening {
  id: string;
  stationCode: string;
  stationName: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-Time Faculty' | 'Visiting Lecturer' | 'Research Mentor' | 'Doppler Radar Specialist';
  experienceRequired: string;
  salaryRange: string;
  description: string;
  requiredSkills: string[];
  applicantsCount: number;
  deadline: string;
  postedDate: string;
  status: 'Open' | 'Interviewing' | 'Filled';
}

export type AlertLevel = 'Green' | 'Yellow' | 'Orange' | 'Red';

export type StudentAnimalRank = 'Cadet Forecaster' | 'Radar Specialist' | 'Lead Forecaster' | 'Chief Meteorologist';
export type StudentRankTier = StudentAnimalRank;

export interface AnimalTierConfig {
  rank: StudentAnimalRank;
  levelNumber: number; // 1 to 4
  animalEmoji: string; // Insignia emblem: 🔰, 📡, 🌪️, 💠
  title: string;
  subtitle: string;
  tierTag: string;
  colorName: string;
  bgGradient: string;
  borderClass: string;
  glowClass: string;
  badgeBg: string;
  textColor: string;
  minLectures: number;
  minQuizzes: number;
  minAvgScore: number;
  description: string;
  perks: string[];
}

export interface StudentProfileData {
  id: string;
  name: string;
  designation: string;
  badgeNumber: string;
  stationName: string;
  avatar: string;
  cadetMotto: string;
  joinedDate: string;
  // Streak tracking
  dailyStreak: number;
  lecturesWatched: number;
  lectureStreakDays: number;
  quizzesDone: number;
  quizStreakDays: number;
  quizAverageScore: number; // 0 - 100
  totalStudyHours: number;
  radarDrillsCompleted: number;
  weeklyStreakMap: { day: string; watched: boolean; quized: boolean; active: boolean }[];
  // Animal Tier Rank
  currentAnimalRank: StudentAnimalRank;
  xp: number;
}

export type QuizGameMode = 'blitz' | 'radar_mystery' | 'survival' | 'practice';

export interface FunQuizQuestion {
  id: string;
  category: string;
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  funFact?: string;
  hint: string;
  difficulty: 'Level 1: Cadet (Easy)' | 'Level 2: Specialist (Medium)' | 'Level 3: Lead Forecaster (Hard)' | 'Level 4: Chief Meteorologist (Expert)';
  mikuCommentary: string;
  radarSignatureType?: 'hook_echo' | 'cyclone_eye' | 'bow_echo' | 'hail_core' | 'monsoon_depression' | 'microburst';
  radarSignatureLabel?: string;
  baseXP: number;
}

export interface QuizSessionStats {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  maxCombo: number;
  totalXpEarned: number;
  mode: QuizGameMode;
  achievedRankPromotion?: StudentAnimalRank;
}

export interface Station {
  id: string;
  name: string;
  code: string;
  region: string;
  location: string;
  status: 'Operational' | 'Standby' | 'Maintenance';
  alertLevel: AlertLevel;
  radarType: string;
  totalCapacity: number;
  activeTrainees: number;
  certifiedForecasters: number;
  readinessScore: number; // percentage
  lat: number;
  lng: number;
  activeAlertDescription?: string;
}

export interface CompetencyScore {
  radarMeteorology: number; // 0-100
  satelliteInterpretation: number;
  nwpModeling: number;
  severeNowcasting: number;
  synopticAnalysis: number;
  agroAdvisory: number;
}

export interface Trainee {
  id: string;
  name: string;
  designation: string;
  badgeNumber: string;
  stationId: string;
  stationName: string;
  role: 'Meteorologist-A' | 'Meteorologist-B' | 'Radar Scientist' | 'Trainee' | 'Ground Station Assistant';
  avatar: string;
  level: number; // 1 to 5
  levelTitle: string;
  xp: number;
  streakDays: number;
  completionRate: number; // 0-100
  certificationsCount: number;
  competency: CompetencyScore;
  badges: string[];
  lastActive: string;
  status: 'Active Duty' | 'In Training' | 'Evaluation Due' | 'Certified';
}

export interface CourseModule {
  id: string;
  title: string;
  durationMinutes: number;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  category: 'Radar & Doppler' | 'Satellite Meteorology' | 'NWP & AI' | 'Severe Weather' | 'Monsoon Dynamics' | 'Aviation & Marine';
  level: 'Foundational' | 'Intermediate' | 'Advanced' | 'Master Specialization';
  durationHours: number;
  enrolledCount: number;
  rating: number;
  completionRate: number;
  xpReward: number;
  iconName: string;
  description: string;
  instructor: string;
  modules: CourseModule[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface RadarScenario {
  id: string;
  title: string;
  station: string;
  event: string;
  category: 'Cyclone' | 'Supercell' | 'Monsoon Surge' | 'Nor\'wester';
  severity: AlertLevel;
  maxReflectivityDbz: number;
  echoTopKm: number;
  radialVelocityKnots: number;
  description: string;
  keyFeature: string;
  correctDiagnosis: string;
}

export interface Badge {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  unlockedCount: number;
}

export type RequestUrgency = 'Routine' | 'Priority' | 'Emergency';
export type RequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface ApprovalRequest {
  id: string;
  requesterRole: 'Trainer' | 'Trainee';
  requesterId: string;
  requesterName: string;
  requesterTitle: string;
  category: 
    | 'Radar Simulator Clearance'
    | 'Course Enrollment Clearance'
    | 'Advanced Certification Exam'
    | 'Radar Research Transmission Slot'
    | 'Publish Demo Video Lecture'
    | 'Curriculum Syllabus Revision'
    | 'Guest Faculty Honorarium'
    | 'Station Reassignment / Leave';
  title: string;
  details: string;
  stationOrInstitute: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminRemarks?: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'drill' | 'cert' | 'station' | 'course';
  badge?: string;
}

export interface ChatContact {
  id: string;
  name: string;
  role: 'Trainer' | 'Trainee' | 'Admin';
  title: string;
  avatar: string;
  institution: string;
  specialization: string;
  status: 'Online' | 'In Radar Ops' | 'Available' | 'Reviewing Submissions' | 'Offline';
  unreadCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'Trainer' | 'Trainee' | 'Admin' | 'Anonymous';
  senderAvatar?: string;
  receiverId?: string; // target user id, or 'channel-all'
  channelType: 'direct' | 'anonymous';
  channelTag?: string; // e.g. '#general', '#quiz-feedback', '#lecture-doubts', '#radar-grievances'
  content: string;
  timestamp: string;
  isAnonymous?: boolean;
  anonymousAlias?: string; // e.g. "Anonymous Meteorologist #408"
  relatedTopic?: string;
  likesCount?: number;
  status?: 'sent' | 'delivered' | 'read';
}

export interface QuizFeedback {
  id: string;
  quizId: string;
  quizTitle: string;
  traineeId: string;
  traineeName: string;
  traineeRank: string;
  rating: number; // 1 - 5
  difficultyFeeling: 'Too Easy' | 'Balanced' | 'Challenging' | 'Extremely Hard';
  selectedTags: string[];
  comment: string;
  reportedQuestionIndex?: number;
  submittedAt: string;
  trainerResponse?: string;
  trainerRespondedBy?: string;
  trainerRespondedAt?: string;
}

export interface TraineeQualification {
  id: string;
  degree: string;
  institution: string;
  year: string;
  specialization: string;
  grade?: string;
}

export interface TraineeWorkExperience {
  id: string;
  role: string;
  organization: string;
  period: string;
  keyResponsibilities: string;
}

export interface TraineeSkill {
  name: string;
  level: number; // 0 - 100
  category: 'Meteorology' | 'Computing & NWP' | 'Instruments & Radar' | 'Advisories';
}

export interface TraineeCertificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialCode: string;
  verified: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  designation: string;
  organization: string;
  station: string;
  status: 'Active' | 'Pending Approval' | 'Suspended';
  createdAt: string;
  qualification?: string;
  specialization?: string;
}

export interface TrainerQuestionnaireQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks: number;
}

export interface TrainerQuestionnaire {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  totalMarks: number;
  passingMarks: number;
  createdBy: string;
  trainerId: string;
  status: 'Active' | 'Closed';
  questions: TrainerQuestionnaireQuestion[];
  submissionsCount: number;
  averageScore: number;
  createdAt: string;
}

export interface TraineeQuestionnaireSubmission {
  id: string;
  questionnaireId: string;
  questionnaireTitle: string;
  traineeId: string;
  traineeName: string;
  submittedAt: string;
  score: number;
  totalMarks: number;
  percentage: number;
  passed: boolean;
  answers: number[];
  feedback?: string;
}

export interface CourseFeedbackSubmission {
  id: string;
  courseId: string;
  courseTitle: string;
  traineeName: string;
  traineeStation: string;
  overallRating: number; // 1 to 5
  contentQuality: number;
  trainerEffectiveness: number;
  feedbackText: string;
  suggestions: string;
  submittedAt: string;
  isAnonymous?: boolean;
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  category: 'Notification' | 'Announcement' | 'Achievement' | 'New Learning Content';
  content: string;
  author: string;
  publishedAt: string;
  isPinned: boolean;
  targetRoles: ('Trainee' | 'Trainer' | 'Admin')[];
  badgeText?: string;
  linkText?: string;
  priority?: 'Normal' | 'Urgent';
  publishedBy?: string;
  actionUrl?: string;
}

export interface AdminMonitoringStats {
  totalCourses: number;
  totalEnrollments: number;
  certificationsIssued: number;
  assessmentsCompleted: number;
  assessmentPassRate: number;
  dailyActiveLearnerHours: number;
  stationEnrollmentBreakdown: { station: string; activeTrainees: number; completionRate: number }[];
  subjectPassRateBreakdown: { subject: string; enrolled: number; passRate: number }[];
}

export interface TrainerCompetencySubjectMapping {
  id: string;
  subjectName: string;
  domain: string;
  requiredQualification: string;
  minExperienceYears: number;
  urgency: 'Standard' | 'High Demand' | 'Critical National Priority';
  suitableTrainers: {
    trainerId: string;
    trainerName: string;
    avatar: string;
    institution: string;
    matchScore: number; // 0 - 100%
    experienceYears: number;
    highestDegree: string;
    specialization: string;
    currentAssignment?: string;
    availability: 'Available for Assignment' | 'Currently Assigned' | 'Guest Faculty';
  }[];
}

export interface LectureFeedback {
  id: string;
  lectureId: string;
  lectureTitle: string;
  teacherId?: string;
  traineeId: string;
  traineeName: string;
  traineeRank: string;
  rating: number; // 1 - 5
  contentClarity: number; // 1 - 5
  audioVisualQuality: number; // 1 - 5
  pacing: 'Too Slow' | 'Just Right' | 'Too Fast';
  comment: string;
  submittedAt: string;
  likesCount: number;
  trainerResponse?: {
    trainerName: string;
    trainerTitle: string;
    comment: string;
    respondedAt: string;
  };
}
