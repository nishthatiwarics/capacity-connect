import { 
  UserAccount, 
  TraineeQualification, 
  TraineeWorkExperience, 
  TraineeSkill, 
  TraineeCertificate, 
  TrainerQuestionnaire, 
  TraineeQuestionnaireSubmission, 
  CourseFeedbackSubmission, 
  AdminAnnouncement, 
  TrainerCompetencySubjectMapping 
} from '../types';

export const INITIAL_USER_ACCOUNTS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'Julianne Moore',
    email: 'cadet.julianne@imd.gov.in',
    role: 'Trainee',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    designation: 'Cadet Forecaster Level-2',
    organization: 'India Meteorological Department',
    station: 'PUN-CTI (Pune)',
    status: 'Active',
    createdAt: '2026-01-15',
    qualification: 'M.Sc. Atmospheric Science',
    specialization: 'Doppler Radar Nowcasting'
  },
  {
    id: 'usr-2',
    name: 'Dr. Someshwar Rao',
    email: 'faculty.someshwar@imd.gov.in',
    role: 'Trainer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    designation: 'Lead Faculty & Radar Meteorologist',
    organization: 'Central Training Institute, Pune',
    station: 'PUN-CTI (Pune)',
    status: 'Active',
    createdAt: '2024-03-10',
    qualification: 'Ph.D. Radar Meteorology',
    specialization: 'Dual-Polarization & Severe Storm Dynamics'
  },
  {
    id: 'usr-3',
    name: 'Dr. M. Mohapatra',
    email: 'dg.mohapatra@imd.gov.in',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    designation: 'Director General of Meteorology',
    organization: 'IMD Directorate HQ, Mausam Bhawan',
    station: 'DEL-HQ (New Delhi)',
    status: 'Active',
    createdAt: '2020-08-01',
    qualification: 'Ph.D. Tropical Cyclone Meteorology',
    specialization: 'National Disaster Governance & Cyclone Forecasting'
  },
  {
    id: 'usr-4',
    name: 'Aarav Nair',
    email: 'aarav.nair@imd.gov.in',
    role: 'Trainee',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    designation: 'Cadet Forecaster Level-1',
    organization: 'Regional Meteorological Centre',
    station: 'MAA-RAD (Chennai)',
    status: 'Pending Approval',
    createdAt: '2026-09-18',
    qualification: 'B.Tech Engineering Physics',
    specialization: 'Marine Weather NWP'
  },
  {
    id: 'usr-5',
    name: 'Dr. Ananya Sen',
    email: 'ananya.sen@iitkgp.ac.in',
    role: 'Trainer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    designation: 'Visiting Senior Faculty',
    organization: 'IIT Kharagpur / IMD Kolkata',
    station: 'CCU-ALIPORE (Kolkata)',
    status: 'Pending Approval',
    createdAt: '2026-09-17',
    qualification: 'Ph.D. Tropical Convection & Norwesters',
    specialization: 'Kalbaishakhi & Mesoscale Convective Systems'
  }
];

export const INITIAL_TRAINEE_QUALIFICATIONS: TraineeQualification[] = [
  {
    id: 'q-1',
    degree: 'M.Sc. Atmospheric Science',
    institution: 'Cochin University of Science and Technology (CUSAT)',
    year: '2024',
    specialization: 'Radar Meteorology & Boundary Layer Dynamics',
    grade: 'First Class with Distinction (8.9 CGPA)'
  },
  {
    id: 'q-2',
    degree: 'B.Sc. Physics (Honours)',
    institution: 'St. Xavier’s College, Kolkata',
    year: '2022',
    specialization: 'Electrodynamics & Atmospheric Thermodynamics',
    grade: 'First Class (84.5%)'
  }
];

export const INITIAL_TRAINEE_WORK_EXPERIENCE: TraineeWorkExperience[] = [
  {
    id: 'w-1',
    role: 'Meteorological Officer (Cadet Trainee)',
    organization: 'Central Training Institute (CTI), IMD Pune',
    period: '2025 - Present (1 Year)',
    keyResponsibilities: 'Operational synoptic charting, dual-pol Doppler radar reflectivity analysis, 3-hourly nowcasting drafting under Lead Faculty supervision.'
  },
  {
    id: 'w-2',
    role: 'Research Intern (Mesoscale Weather Systems)',
    organization: 'Indian Institute of Tropical Meteorology (IITM)',
    period: '2024 (6 Months)',
    keyResponsibilities: 'Simulated squall line propagation using WRF-ARW 4.2 models and validated against Damini Lightning Network sensors.'
  }
];

export const INITIAL_TRAINEE_INTERESTS: string[] = [
  'Doppler Radar Dual-Polarization (ZDR, KDP, CC)',
  'Severe Thunderstorm & Lightning Nowcasting (DAMINI)',
  'Bay of Bengal Tropical Cyclone Tracks (RSMC)',
  'Numerical Weather Prediction (WRF-ARW & GFS)',
  'Agrometeorological Advisories (Meghdoot)',
  'High-Resolution Satellite Remote Sensing (INSAT-3DR)'
];

export const INITIAL_TRAINEE_SKILLS: TraineeSkill[] = [
  { name: 'DWR Radar Reflectivity & Velocity Interpretation', level: 88, category: 'Instruments & Radar' },
  { name: 'Severe Weather Nowcasting Drafting', level: 82, category: 'Meteorology' },
  { name: 'Tephigram & Convective Index Calculations', level: 91, category: 'Meteorology' },
  { name: 'Python for Meteorology (MetPy, Cartopy, Py-ART)', level: 78, category: 'Computing & NWP' },
  { name: 'WMO Synoptic Station Code Decoding', level: 94, category: 'Meteorology' },
  { name: 'Agromet Advisory Formulation', level: 72, category: 'Advisories' }
];

export const INITIAL_TRAINEE_CERTIFICATES: TraineeCertificate[] = [
  {
    id: 'cert-1',
    title: 'Doppler Weather Radar (DWR) Operational Interpretation',
    issuer: 'India Meteorological Department & MoES',
    issueDate: 'August 14, 2025',
    credentialCode: 'IMD-DWR-2025-0841',
    verified: true
  },
  {
    id: 'cert-2',
    title: 'Severe Convective Storm Nowcasting & Damini Early Warning',
    issuer: 'Central Training Institute (CTI), Pune',
    issueDate: 'January 22, 2026',
    credentialCode: 'CTI-NOW-2026-1190',
    verified: true
  },
  {
    id: 'cert-3',
    title: 'WMO Basic Instructional Package for Meteorologists (BIP-M)',
    issuer: 'World Meteorological Organization & MoES',
    issueDate: 'December 05, 2024',
    credentialCode: 'WMO-BIPM-IN-492',
    verified: true
  }
];

export const INITIAL_TRAINER_QUESTIONNAIRES: TrainerQuestionnaire[] = [
  {
    id: 'qnr-1',
    title: 'Dual-Polarization DWR Severe Weather Diagnostic Assessment',
    subject: 'Radar Meteorology',
    deadline: '2026-09-25 18:00',
    totalMarks: 50,
    passingMarks: 35,
    createdBy: 'Dr. Someshwar Rao',
    trainerId: 't-1',
    status: 'Active',
    submissionsCount: 18,
    averageScore: 41.5,
    createdAt: '2026-09-15',
    questions: [
      {
        id: 'q1',
        question: 'Which dual-polarization radar parameter drops sharply (< 0.85) inside a severe hail core aloft due to irregular shapes and tumbling?',
        options: [
          'Differential Reflectivity (ZDR)',
          'Correlation Coefficient (CC / RhoHV)',
          'Specific Differential Phase (KDP)',
          'Radial Velocity (Vr)'
        ],
        correctIndex: 1,
        explanation: 'Correlation Coefficient (CC/RhoHV) drops noticeably below 0.85 in mixed hail/rain cores because non-spherical, tumbling hailstones scatter horizontally and vertically polarized pulses non-uniformly.',
        marks: 10
      },
      {
        id: 'q2',
        question: 'In an approaching squall line, a localized bow-shaped bulge on radar reflectivity (Bow Echo) is primarily caused by:',
        options: [
          'Rear Inflow Jet (RIJ) pushing convective cells forward',
          'Cyclonic warm core formation at the surface',
          'Stratiform anvil precipitation sublimation aloft',
          'Beam attenuation through distant sea breeze'
        ],
        correctIndex: 0,
        explanation: 'A Rear Inflow Jet (RIJ) channels strong horizontal momentum from mid-troposphere to the surface, creating damaging straight-line winds and bowing the line forward.',
        marks: 10
      },
      {
        id: 'q3',
        question: 'What is the operational threshold of CAPE (Convective Available Potential Energy) indicating high probability of severe Kalbaishakhi thunderstorms?',
        options: [
          '< 500 J/kg',
          '500 - 1000 J/kg',
          '1000 - 2000 J/kg',
          '> 2500 J/kg with Lifted Index < -4'
        ],
        correctIndex: 3,
        explanation: 'Severe convective storms in Bengal and eastern India regularly require extreme thermodynamic instability, with CAPE exceeding 2500 J/kg and Lifted Index below -4.',
        marks: 10
      },
      {
        id: 'q4',
        question: 'According to standard IMD cyclone warning procedures, at what lead time is the "Cyclone Warning" (Orange message) officially issued to coastal ports and collectors?',
        options: [
          '72 hours ahead of landfall',
          '48 hours ahead of landfall',
          '24 hours ahead of expected landfall or commencement of adverse weather',
          '6 hours ahead of eye passage'
        ],
        correctIndex: 2,
        explanation: 'Stage 3 (Cyclone Warning) is issued at least 24 hours in advance with expected point of landfall and gale wind warnings for maritime and land districts.',
        marks: 10
      },
      {
        id: 'q5',
        question: 'Under WMO Code 4677, which present weather symbol depicts a thunderstorm with heavy rain but no hail?',
        options: [
          'Code 17 (Thunderstorm without precipitation)',
          'Code 95 (Slight or moderate thunderstorm with rain)',
          'Code 97 (Heavy thunderstorm with rain)',
          'Code 99 (Heavy thunderstorm with hail)'
        ],
        correctIndex: 2,
        explanation: 'WMO code 97 represents a thunderstorm that is severe/heavy with rain at the observation time.',
        marks: 10
      }
    ]
  },
  {
    id: 'qnr-2',
    title: 'Numerical Weather Prediction & WRF Parameterization Quiz',
    subject: 'NWP & Computational Met',
    deadline: '2026-09-28 23:59',
    totalMarks: 30,
    passingMarks: 20,
    createdBy: 'Dr. V. K. Rajiv',
    trainerId: 't-2',
    status: 'Active',
    submissionsCount: 14,
    averageScore: 24.2,
    createdAt: '2026-09-18',
    questions: [
      {
        id: 'q1',
        question: 'When downscaling global models to 3 km convective-permitting resolution in WRF, which parameterization scheme should be turned OFF?',
        options: [
          'Microphysics scheme',
          'Cumulus convection parameterization scheme',
          'Planetary Boundary Layer (PBL) scheme',
          'Surface layer physics scheme'
        ],
        correctIndex: 1,
        explanation: 'At grid spacing ≤ 4 km, cumulus updrafts are explicitly resolved by the model dynamics, hence cumulus parameterization is switched off to avoid double-counting.',
        marks: 10
      },
      {
        id: 'q2',
        question: 'What is the CFL (Courant-Friedrichs-Lewy) condition primary purpose in atmospheric numerical integration?',
        options: [
          'Ensures cloud droplets condense at 100% relative humidity',
          'Guarantees mathematical stability of the finite difference time-stepping scheme',
          'Calculates Coriolis force at equatorial latitudes',
          'Eliminates geostrophic wind shear'
        ],
        correctIndex: 1,
        explanation: 'The CFL condition (c * dt / dx ≤ 1) guarantees numerical stability so information doesn\'t propagate faster across the spatial grid than the time-step allows.',
        marks: 10
      },
      {
        id: 'q3',
        question: 'In Indian monsoon forecasting, the GFS-T1534 operational model corresponds approximately to which horizontal grid resolution?',
        options: [
          '100 km',
          '50 km',
          '12 km',
          '3 km'
        ],
        correctIndex: 2,
        explanation: 'The spectral model T1534 has an effective horizontal resolution of approximately 12 kilometers over the global domain.',
        marks: 10
      }
    ]
  }
];

export const INITIAL_TRAINEE_SUBMISSIONS: TraineeQuestionnaireSubmission[] = [
  {
    id: 'sub-1',
    questionnaireId: 'qnr-1',
    questionnaireTitle: 'Dual-Polarization DWR Severe Weather Diagnostic Assessment',
    traineeId: 'usr-1',
    traineeName: 'Julianne Moore',
    submittedAt: '2026-09-18 14:30',
    score: 48,
    totalMarks: 50,
    percentage: 96,
    passed: true,
    answers: [1, 0, 3, 2, 2],
    feedback: 'Outstanding mastery of differential reflectivity and WMO synoptic coding!'
  },
  {
    id: 'sub-2',
    questionnaireId: 'qnr-1',
    questionnaireTitle: 'Dual-Polarization DWR Severe Weather Diagnostic Assessment',
    traineeId: 'usr-4',
    traineeName: 'Aarav Nair',
    submittedAt: '2026-09-18 17:15',
    score: 38,
    totalMarks: 50,
    percentage: 76,
    passed: true,
    answers: [1, 0, 2, 2, 2],
    feedback: 'Good work on radar basics; review thermodynamic CAPE threshold values.'
  }
];

export const INITIAL_COURSE_FEEDBACKS: CourseFeedbackSubmission[] = [
  {
    id: 'cf-1',
    courseId: 'crs-1',
    courseTitle: 'Polarimetric Doppler Weather Radar (DWR) Operational Masterclass',
    traineeName: 'Julianne Moore',
    traineeStation: 'PUN-CTI (Pune)',
    overallRating: 5,
    contentQuality: 5,
    trainerEffectiveness: 5,
    feedbackText: 'The radar beam propagation physics and live simulation drills prepared me directly for station shifts at Mumbai radar.',
    suggestions: 'Would love more real-time cases of supercell tornado signatures over North India plains.',
    submittedAt: '2026-09-14 11:20'
  },
  {
    id: 'cf-2',
    courseId: 'crs-2',
    courseTitle: 'High-Resolution Numerical Weather Prediction & WRF Modeling',
    traineeName: 'Aarav Nair',
    traineeStation: 'MAA-RAD (Chennai)',
    overallRating: 4,
    contentQuality: 4,
    trainerEffectiveness: 5,
    feedbackText: 'Dr. Rajiv explained boundary layer schemes clearly. The GPU-accelerated computing modules were very practical.',
    suggestions: 'Please include more sample Python scripts for plotting sounding curves.',
    submittedAt: '2026-09-16 16:45'
  }
];

export const INITIAL_ADMIN_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'Cabinet Approval for Mission Mausam (Phase-1 Expansion 2024-2027)',
    category: 'Announcement',
    content: 'Ministry of Earth Sciences announces commissioning of 50 new Doppler Weather Radars, 60 Wind Profilers, and supercomputing capacity expansion to 30 PFLOPS for seamless pan-India nowcasting.',
    author: 'Dr. M. Mohapatra (Director General)',
    publishedAt: '2026-09-19 09:00',
    isPinned: true,
    targetRoles: ['Trainee', 'Trainer', 'Admin'],
    badgeText: 'NATIONAL PRIORITY'
  },
  {
    id: 'ann-2',
    title: 'Pre-Monsoon 2026 Severe Weather Cadet Certification Examinations',
    category: 'Notification',
    content: 'All Cadet Forecasters must complete the mandatory 6-Axis Radar Competency Assessment and 40 flight hours on the Doppler Simulator before October 15, 2026 to receive official shift sign-off.',
    author: 'Director of Training, CTI Pune',
    publishedAt: '2026-09-18 10:30',
    isPinned: true,
    targetRoles: ['Trainee', 'Trainer'],
    badgeText: 'DEADLINE'
  },
  {
    id: 'ann-3',
    title: 'Cadet Forecaster of the Month: Julianne Moore (CTI Pune)',
    category: 'Achievement',
    content: 'Recognized for achieving 98.4% radar nowcast accuracy during the simulated Mumbai squall line drill and maintaining a 24-day uninterrupted study streak.',
    author: 'IMD Directorate Evaluation Board',
    publishedAt: '2026-09-17 14:00',
    isPinned: false,
    targetRoles: ['Trainee', 'Trainer', 'Admin'],
    badgeText: 'CADET HONOUR'
  },
  {
    id: 'ann-4',
    title: 'New Masterclass: Tropical Cyclone Track & Intensity Estimation via Dvorak Technique',
    category: 'New Learning Content',
    content: 'Uploaded by RSMC New Delhi faculty. Includes 8 hours of video modules, interactive INSAT-3DR infrared loop analysis, and real-case studies of Cyclone Amphan, Biparjoy, and Remal.',
    author: 'RSMC Cyclone Directorate',
    publishedAt: '2026-09-16 16:00',
    isPinned: false,
    targetRoles: ['Trainee', 'Trainer'],
    badgeText: 'NEW COURSE'
  }
];

export const INITIAL_TRAINER_COMPETENCY_MAPPINGS: TrainerCompetencySubjectMapping[] = [
  {
    id: 'tcm-1',
    subjectName: 'Polarimetric Doppler Weather Radar (DWR) Calibration & Nowcasting',
    domain: 'Radar & Severe Storms',
    requiredQualification: 'Ph.D. / M.Tech in Radar Meteorology / Microwave Remote Sensing',
    minExperienceYears: 8,
    urgency: 'Critical National Priority',
    suitableTrainers: [
      {
        trainerId: 't-1',
        trainerName: 'Dr. Someshwar Rao',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        institution: 'CTI Pune (IMD)',
        matchScore: 98,
        experienceYears: 16,
        highestDegree: 'Ph.D. Atmospheric Radar Physics',
        specialization: 'Dual-Pol S-Band Radar & Microburst Detection',
        currentAssignment: 'Lead Instructor (CTI Pune)',
        availability: 'Available for Assignment'
      },
      {
        trainerId: 't-3',
        trainerName: 'Dr. P. K. Jayashree',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
        institution: 'RMC Chennai',
        matchScore: 91,
        experienceYears: 12,
        highestDegree: 'Ph.D. Marine Radar Meteorology',
        specialization: 'Coastal DWR Reflectivity & Cyclone Landfall',
        currentAssignment: 'Chennai Radar Station Chief',
        availability: 'Guest Faculty'
      },
      {
        trainerId: 't-5',
        trainerName: 'Dr. Ananya Sen',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
        institution: 'IIT Kharagpur / IMD Kolkata',
        matchScore: 84,
        experienceYears: 9,
        highestDegree: 'Ph.D. Mesoscale Convective Systems',
        specialization: 'Norwesters & Severe Squall Line Radar Signatures',
        availability: 'Available for Assignment'
      }
    ]
  },
  {
    id: 'tcm-2',
    subjectName: 'Numerical Weather Prediction (NWP) Modeling with WRF-ARW & GFS',
    domain: 'Atmospheric Modeling & HPC',
    requiredQualification: 'Ph.D. in Computational Meteorology / Dynamic Meteorology',
    minExperienceYears: 6,
    urgency: 'High Demand',
    suitableTrainers: [
      {
        trainerId: 't-2',
        trainerName: 'Dr. V. K. Rajiv',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
        institution: 'NCMRWF Noida',
        matchScore: 96,
        experienceYears: 14,
        highestDegree: 'Ph.D. Geophysical Fluid Dynamics',
        specialization: 'Global Ensemble Forecasting & Data Assimilation',
        currentAssignment: 'Senior Scientist F (NCMRWF)',
        availability: 'Available for Assignment'
      },
      {
        trainerId: 't-6',
        trainerName: 'Dr. Rohan Mehra',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
        institution: 'IIT Delhi / IMD HQ',
        matchScore: 89,
        experienceYears: 8,
        highestDegree: 'Ph.D. High Performance Computing',
        specialization: 'Boundary Layer Parameterization in WRF',
        availability: 'Currently Assigned'
      }
    ]
  },
  {
    id: 'tcm-3',
    subjectName: 'Tropical Cyclone Structure, Dvorak Technique & Track Forecasting',
    domain: 'Synoptic & Cyclone Meteorology',
    requiredQualification: 'M.Sc. / Ph.D. with > 10 Years RSMC Cyclone Warning Experience',
    minExperienceYears: 10,
    urgency: 'Critical National Priority',
    suitableTrainers: [
      {
        trainerId: 'usr-3',
        trainerName: 'Dr. M. Mohapatra',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        institution: 'IMD Directorate HQ, New Delhi',
        matchScore: 99,
        experienceYears: 32,
        highestDegree: 'Ph.D. Tropical Cyclones (Utkal Univ)',
        specialization: 'Cyclone Track, Intensity & Storm Surge Forecasting',
        currentAssignment: 'Director General of Meteorology',
        availability: 'Guest Faculty'
      },
      {
        trainerId: 't-4',
        trainerName: 'Dr. Sunita Kulkarni',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        institution: 'RSMC New Delhi',
        matchScore: 93,
        experienceYears: 15,
        highestDegree: 'Ph.D. Satellite Meteorology',
        specialization: 'Advanced Dvorak Technique & INSAT-3DR Water Vapor',
        availability: 'Available for Assignment'
      }
    ]
  },
  {
    id: 'tcm-4',
    subjectName: 'Agrometeorological Advisory Services (Meghdoot / AAS Block Level)',
    domain: 'Agricultural & Applied Meteorology',
    requiredQualification: 'M.Sc. / Ph.D. in Agricultural Meteorology or Agronomy',
    minExperienceYears: 5,
    urgency: 'Standard',
    suitableTrainers: [
      {
        trainerId: 't-7',
        trainerName: 'Dr. Balwinder Singh',
        avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
        institution: 'Punjab Agricultural University / IMD Chandigarh',
        matchScore: 95,
        experienceYears: 18,
        highestDegree: 'Ph.D. Agrometeorology',
        specialization: 'Crop-Weather Models & Block Agro Advisories',
        availability: 'Available for Assignment'
      },
      {
        trainerId: 't-8',
        trainerName: 'Dr. K. R. Meenakshi',
        avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
        institution: 'TNAU Coimbatore / IMD Chennai',
        matchScore: 88,
        experienceYears: 11,
        highestDegree: 'Ph.D. Microclimatology',
        specialization: 'Paddy & Cotton Thermal Time Indices',
        availability: 'Available for Assignment'
      }
    ]
  }
];
