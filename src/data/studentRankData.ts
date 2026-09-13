import { AnimalTierConfig, StudentAnimalRank, StudentProfileData } from '../types';

export const ANIMAL_TIER_CONFIGS: Record<StudentAnimalRank, AnimalTierConfig> = {
  'Cadet Forecaster': {
    rank: 'Cadet Forecaster',
    levelNumber: 1,
    animalEmoji: '🔰',
    title: 'Cadet Forecaster (Level 1)',
    subtitle: 'Atmospheric Science Trainee & Radar Novice',
    tierTag: 'Level 1 • Foundation',
    colorName: 'Slate Violet',
    bgGradient: 'from-slate-700 via-indigo-900/60 to-slate-900',
    borderClass: 'border-indigo-500/40',
    glowClass: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    textColor: 'text-indigo-400',
    minLectures: 0,
    minQuizzes: 0,
    minAvgScore: 0,
    description: 'Disciplined, eager, and mastering atmospheric fundamentals. Cultivating core knowledge in Doppler reflectivity, dBZ echo ranges, and standard synoptic observation codes.',
    perks: [
      'Access to Core Video Lectures & Syllabus',
      'Beginner Doppler Base Reflectivity Lab',
      'WMO Meteorological Glossary & Reference Guides',
      'Official Cadet Forecaster Insignia'
    ]
  },
  'Radar Specialist': {
    rank: 'Radar Specialist',
    levelNumber: 2,
    animalEmoji: '📡',
    title: 'Radar Specialist (Level 2)',
    subtitle: 'Doppler Velocity & Convective Storm Analyst',
    tierTag: 'Level 2 • Specialist',
    colorName: 'Amber Gold',
    bgGradient: 'from-amber-700/60 via-amber-950/70 to-slate-900',
    borderClass: 'border-amber-500/50',
    glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    textColor: 'text-amber-400',
    minLectures: 6,
    minQuizzes: 4,
    minAvgScore: 70,
    description: 'Rapidly detecting convective squall lines, microburst gust fronts, and Doppler radial velocity signatures with operational nowcasting speed.',
    perks: [
      'Doppler Radial Velocity & Spectrum Width Tools',
      'Interactive Severe Storm Crisis Drill Access',
      'Nowcasting Speed Qualification Badge',
      'National Forecaster Leaderboard Listing'
    ]
  },
  'Lead Forecaster': {
    rank: 'Lead Forecaster',
    levelNumber: 3,
    animalEmoji: '🌪️',
    title: 'Lead Forecaster (Level 3)',
    subtitle: 'Severe Cyclone Authority & Shift Commander',
    tierTag: 'Level 3 • Senior Lead',
    colorName: 'Crimson Flame',
    bgGradient: 'from-rose-800/60 via-orange-950/70 to-slate-950',
    borderClass: 'border-rose-500/50',
    glowClass: 'shadow-[0_0_30px_rgba(244,63,94,0.3)]',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    textColor: 'text-rose-400',
    minLectures: 16,
    minQuizzes: 11,
    minAvgScore: 85,
    description: 'Mastery over severe cyclonic storms, supercell hook echo dynamics, dual-pol microphysics, and time-critical public disaster warning advisories.',
    perks: [
      'Dual-Polarization Hydrometeor Classification (ZDR / KDP)',
      'Direct Senior Faculty Advisory & Mentorship Clearance',
      'Lead Forecaster Command Crest Badge',
      'Emergency Operations Desk Issuance Authority'
    ]
  },
  'Chief Meteorologist': {
    rank: 'Chief Meteorologist',
    levelNumber: 4,
    animalEmoji: '💠',
    title: 'Chief Meteorologist (Level 4)',
    subtitle: 'National Directorate Lead & Atmospheric Scientist',
    tierTag: 'Level 4 • Master Lead',
    colorName: 'Cosmic Cyan',
    bgGradient: 'from-cyan-600/50 via-blue-950/80 to-purple-950/60',
    borderClass: 'border-cyan-400/60',
    glowClass: 'shadow-[0_0_35px_rgba(6,182,212,0.4)]',
    badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-300/50',
    textColor: 'text-cyan-300',
    minLectures: 30,
    minQuizzes: 21,
    minAvgScore: 92,
    description: 'Supreme atmospheric expertise synthesizing planetary Rossby wave packets, monsoon depressions, and high-resolution numerical weather prediction models with authoritative precision.',
    perks: [
      'Nationwide 39-Doppler Radar Network Full Ingress',
      'Director General IMD Presidential Commendation',
      'National Meteorological Council Senior Fellow',
      'Chief Atmospheric Scientist Gold Insignia'
    ]
  }
};

export const ORDERED_RANKS: StudentAnimalRank[] = [
  'Cadet Forecaster',
  'Radar Specialist',
  'Lead Forecaster',
  'Chief Meteorologist'
];

/**
 * Calculates current student competency rank based on watched lectures, quizzes done, and average score.
 */
export function calculateStudentAnimalRank(
  lecturesWatched: number,
  quizzesDone: number,
  avgScore: number
): StudentAnimalRank {
  if (lecturesWatched >= 30 && quizzesDone >= 21 && avgScore >= 92) {
    return 'Chief Meteorologist';
  }
  if (lecturesWatched >= 16 && quizzesDone >= 11 && avgScore >= 85) {
    return 'Lead Forecaster';
  }
  if (lecturesWatched >= 6 && quizzesDone >= 4 && avgScore >= 70) {
    return 'Radar Specialist';
  }
  return 'Cadet Forecaster';
}

/**
 * Returns progress percentage (0-100) towards the next rank
 */
export function calculateProgressToNextRank(
  currentRank: StudentAnimalRank,
  lecturesWatched: number,
  quizzesDone: number,
  avgScore: number
): {
  nextRank: StudentAnimalRank | null;
  overallProgressPercent: number;
  lecturesNeeded: number;
  quizzesNeeded: number;
  scoreNeeded: number;
} {
  const currentIndex = ORDERED_RANKS.indexOf(currentRank);
  if (currentIndex >= ORDERED_RANKS.length - 1) {
    return {
      nextRank: null,
      overallProgressPercent: 100,
      lecturesNeeded: 0,
      quizzesNeeded: 0,
      scoreNeeded: 0
    };
  }

  const nextRank = ORDERED_RANKS[currentIndex + 1];
  const nextConfig = ANIMAL_TIER_CONFIGS[nextRank];
  const currentConfig = ANIMAL_TIER_CONFIGS[currentRank];

  const lectureSpan = Math.max(1, nextConfig.minLectures - currentConfig.minLectures);
  const quizSpan = Math.max(1, nextConfig.minQuizzes - currentConfig.minQuizzes);

  const lectureProgress = Math.min(1, Math.max(0, (lecturesWatched - currentConfig.minLectures) / lectureSpan));
  const quizProgress = Math.min(1, Math.max(0, (quizzesDone - currentConfig.minQuizzes) / quizSpan));
  const scoreProgress = Math.min(1, Math.max(0, avgScore / Math.max(1, nextConfig.minAvgScore)));

  const overall = Math.round(((lectureProgress * 0.45) + (quizProgress * 0.45) + (scoreProgress * 0.1)) * 100);

  return {
    nextRank,
    overallProgressPercent: Math.min(100, Math.max(0, overall)),
    lecturesNeeded: Math.max(0, nextConfig.minLectures - lecturesWatched),
    quizzesNeeded: Math.max(0, nextConfig.minQuizzes - quizzesDone),
    scoreNeeded: Math.max(0, nextConfig.minAvgScore - avgScore)
  };
}

export const QUICK_METEOROLOGY_QUIZZES = [
  {
    id: 'quiz-01',
    category: 'Doppler Radar Principles',
    title: 'Hook Echo & Mesocyclone Identification',
    question: 'On an S-Band Doppler Radar reflectivity display, what does a distinct "Hook Echo" pattern protruding from the southern quadrant of a storm typically signify?',
    options: [
      'A harmless drizzle band decaying due to ground clutter',
      'The presence of a rotating mesocyclone with potential tornado genesis',
      'High-altitude cirrus clouds with zero severe weather threat',
      'Radar hardware calibration error requiring manual reboot'
    ],
    correctIndex: 1,
    explanation: 'A Hook Echo is a classic radar signature formed by precipitation wrapping around a strong rotating updraft (mesocyclone), frequently associated with tornadic supercells.'
  },
  {
    id: 'quiz-02',
    category: 'Severe Storm Nowcasting',
    title: 'Bow Echo & Damaging Straight-Line Winds',
    question: 'When Doppler radial velocity displays a high-velocity outbound surge coinciding with a curved "Bow Echo" on reflectivity, what hazard is most imminent at ground level?',
    options: [
      'Severe destructive straight-line winds and microbursts (derecho)',
      'Freezing rain in coastal maritime tropical zones',
      'Widespread gentle monsoon stratiform precipitation',
      'Atmospheric dry-air intrusion dissipating all rainfall'
    ],
    correctIndex: 0,
    explanation: 'Bow echoes are propelled forward by strong rear-inflow jets (RIJ), causing widespread straight-line wind damage reaching 50-80+ knots.'
  },
  {
    id: 'quiz-03',
    category: 'Tropical Cyclones',
    title: 'Dual-Polarization Hydrometeor Classification',
    question: 'In dual-polarization weather radar, what does a near-zero Differential Reflectivity (ZDR ≈ 0 dB) combined with very high Horizontal Reflectivity (ZH > 55 dBZ) reveal?',
    options: [
      'Fine drizzle droplets floating in calm air',
      'Heavy spherical tumbling hail stones within a severe convective core',
      'Chaff or bird migration crossing the radar beam',
      'Pure clear-air turbulent boundary layer echoes'
    ],
    correctIndex: 1,
    explanation: 'Tumbling hail stones appear aerodynamically spherical to polarized beams (ZDR near 0 dB), yet backscatter immense radar energy (ZH > 55 dBZ).'
  },
  {
    id: 'quiz-04',
    category: 'Monsoon Dynamics',
    title: 'Tropical Easterly Jet & Monsoon Trough',
    question: 'During the Southwest Monsoon season in India, what dynamic upper-tropospheric feature (around 150 hPa) reinforces the Tibetan Anticyclone and active monsoon spells?',
    options: [
      'The Polar Night Jet Stream',
      'The Tropical Easterly Jet (TEJ) positioned over southern peninsular India',
      'The Subtropical Westerly Jet dipping south into Gujarat',
      'A persistent surface cold front entering from the Arabian Sea'
    ],
    correctIndex: 1,
    explanation: 'The Tropical Easterly Jet (TEJ) at ~150 hPa is a hallmark of the summer Indian monsoon, driven by the intense thermal contrast created by the elevated Tibetan Plateau.'
  },
  {
    id: 'quiz-05',
    category: 'Satellite Meteorology',
    title: 'Water Vapor Channel (6.7 µm) Interpretation',
    question: 'In INSAT-3D/3DR Water Vapor channel imagery, a dark black stripe or tongue curving into a developing storm cluster signifies:',
    options: [
      'Deep atmospheric moisture saturated from surface to tropopause',
      'Dry upper-tropospheric air intrusion enhancing potential convective instability',
      'Complete cloud cover with intense continuous rainfall',
      'Solar sensor reflection during local solar midnight'
    ],
    correctIndex: 1,
    explanation: 'Dark areas on 6.7 µm water vapor imagery denote dry mid-to-upper tropospheric air, which when overrunning warm, moist low-level air dramatically increases convective instability.'
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfileData = {
  id: 'std-learner',
  name: 'Learner',
  designation: 'Learner',
  badgeNumber: 'IMD-TR-2026-088',
  stationName: 'Doppler Radar Station & CTI Pune',
  avatar: '',
  cadetMotto: '"Precision in observation, vigilance in warning, excellence in service."',
  joinedDate: 'Jan 2026',
  dailyStreak: 16,
  lecturesWatched: 18,
  lectureStreakDays: 8,
  quizzesDone: 14,
  quizStreakDays: 6,
  quizAverageScore: 89,
  totalStudyHours: 42.5,
  radarDrillsCompleted: 7,
  weeklyStreakMap: [
    { day: 'Mon', watched: true, quized: true, active: true },
    { day: 'Tue', watched: true, quized: false, active: true },
    { day: 'Wed', watched: true, quized: true, active: true },
    { day: 'Thu', watched: false, quized: true, active: true },
    { day: 'Fri', watched: true, quized: true, active: true },
    { day: 'Sat', watched: true, quized: true, active: true },
    { day: 'Sun', watched: true, quized: true, active: true }
  ],
  currentAnimalRank: 'Lead Forecaster',
  xp: 5240
};
