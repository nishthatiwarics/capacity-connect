import { ChatContact, ChatMessage, QuizFeedback, LectureFeedback } from '../types';

export const INITIAL_TRAINER_CONTACTS: ChatContact[] = [
  {
    id: 'teach-01',
    name: 'Dr. Someshwar Rao',
    role: 'Trainer',
    title: 'Lead Doppler Radar Faculty & Meteorological Instructor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institution: 'Central Training Institute (CTI), IMD Pune',
    specialization: 'Polarimetric S-Band Radar & Convective Nowcasting',
    status: 'Online',
    unreadCount: 1,
    lastMessage: 'Check the ZDR calibration notes from Chapter 3 for your question!',
    lastMessageTime: '10 mins ago',
  },
  {
    id: 'teach-03',
    name: 'Prof. K. V. Ramanathan',
    role: 'Trainer',
    title: 'Senior Marine Radar Chair & Cyclone Dynamics Specialist',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    institution: 'CUSAT / RMC Chennai Port Radar',
    specialization: 'Cyclone Eye-Wall Wind Velocity Couplets',
    status: 'In Radar Ops',
    unreadCount: 0,
    lastMessage: 'Remember to verify radial velocity along the coastal tangent.',
    lastMessageTime: '1 hr ago',
  },
  {
    id: 'teach-04',
    name: 'Dr. Sunita Mehra',
    role: 'Trainer',
    title: 'Lead Scientist — AI Weather Downscaling & Satellite Ops',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    institution: 'IMD National Headquarters (Mausam Bhawan)',
    specialization: 'INSAT-3DR Rapid-Scan & Neural Extrapolation',
    status: 'Available',
    unreadCount: 0,
    lastMessage: 'The new satellite Water Vapor loop has been uploaded.',
    lastMessageTime: '3 hrs ago',
  },
  {
    id: 'teach-05',
    name: 'Dr. Vikram Joshi',
    role: 'Trainer',
    title: 'Radar Remote Sensing & Microwave Engineering Chair',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    institution: 'IIT Bombay / Mumbai Megacity Radar Array',
    specialization: 'X-Band Urban Flash Flood Detection',
    status: 'Reviewing Submissions',
    unreadCount: 0,
    lastMessage: 'Good job on the Mumbai squall case diagnosis.',
    lastMessageTime: 'Yesterday',
  }
];

export const INITIAL_TRAINEE_CONTACTS: ChatContact[] = [
  {
    id: 'tr-01',
    name: 'Julianne Moore',
    role: 'Trainee',
    title: 'Forecaster Cadet — Santacruz DWR Ops',
    avatar: '',
    institution: 'RMC Mumbai',
    specialization: 'Radar Reflectivity Interpretation & IDP Level 2',
    status: 'Online',
    unreadCount: 0,
    lastMessage: 'Thank you Sir! I will review the dual-pol notes tonight.',
    lastMessageTime: '8 mins ago',
  },
  {
    id: 'tr-02',
    name: 'Rajesh Sharma',
    role: 'Trainee',
    title: 'Radar Operations Trainee — Mausam Bhawan',
    avatar: '',
    institution: 'IMD New Delhi HQ',
    specialization: 'S-Band Doppler Pulse Compression',
    status: 'Available',
    unreadCount: 1,
    lastMessage: 'Sir, can we arrange a quick doubt session on Nyquist limits?',
    lastMessageTime: '25 mins ago',
  },
  {
    id: 'tr-04',
    name: 'Karthik Balasubramanian',
    role: 'Trainee',
    title: 'Marine Forecaster & Radar Trainee',
    avatar: '',
    institution: 'RMC Chennai',
    specialization: 'Coastal Marine Radar Nowcasting',
    status: 'Available',
    unreadCount: 0,
    lastMessage: 'Submitted my feedback on the cyclone lecture.',
    lastMessageTime: '2 hrs ago',
  },
  {
    id: 'tr-05',
    name: 'Tenzing Norbu',
    role: 'Trainee',
    title: 'Mountain Agro-Meteorology Trainee',
    avatar: '',
    institution: 'RMC Guwahati',
    specialization: 'Orographic Precipitation Tracking',
    status: 'In Radar Ops',
    unreadCount: 0,
    lastMessage: 'The orographic radar echo simulator was very helpful.',
    lastMessageTime: '4 hrs ago',
  }
];

export const INITIAL_DIRECT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-01',
    senderId: 'tr-01',
    senderName: 'Julianne Moore',
    senderRole: 'Trainee',
    receiverId: 'teach-01',
    channelType: 'direct',
    content: 'Good morning Dr. Rao! I was reviewing your lecture on Dual-Polarization radar. When looking at the melting layer (bright band), does the correlation coefficient (ρHV) always drop significantly below 0.95?',
    timestamp: '10:14 AM',
    relatedTopic: 'Lecture: Dual-Polarization Radar ZDR & KDP',
    status: 'read'
  },
  {
    id: 'msg-02',
    senderId: 'teach-01',
    senderName: 'Dr. Someshwar Rao',
    senderRole: 'Trainer',
    receiverId: 'tr-01',
    channelType: 'direct',
    content: 'Excellent observation Cadet Julianne! Yes, in the melting layer, we have a mixture of liquid drops, partially melted snowflakes, and ice aggregates. Because their shapes and orientations are heterogeneous, the correlation coefficient (CC / ρHV) typically drops to between 0.85 and 0.92, while ZDR spikes. That is the signature of the bright band!',
    timestamp: '10:18 AM',
    relatedTopic: 'Lecture: Dual-Polarization Radar ZDR & KDP',
    status: 'read'
  },
  {
    id: 'msg-03',
    senderId: 'tr-01',
    senderName: 'Julianne Moore',
    senderRole: 'Trainee',
    receiverId: 'teach-01',
    channelType: 'direct',
    content: 'That makes total physical sense now! In Quiz Question 4, I was wondering if we could get more practice questions with real Doppler PPI scans from the Santacruz radar?',
    timestamp: '10:22 AM',
    relatedTopic: 'Quiz: Radar Velocity Blitz',
    status: 'read'
  },
  {
    id: 'msg-04',
    senderId: 'teach-01',
    senderName: 'Dr. Someshwar Rao',
    senderRole: 'Trainer',
    receiverId: 'tr-01',
    channelType: 'direct',
    content: 'Check the ZDR calibration notes from Chapter 3 for your question! I have also queued 5 new live polarimetric scans from the Mumbai monsoon event into the Radar Sim Lab for your batch today.',
    timestamp: '10:26 AM',
    relatedTopic: 'Quiz: Radar Velocity Blitz',
    status: 'delivered'
  },
  {
    id: 'msg-05',
    senderId: 'tr-02',
    senderName: 'Rajesh Sharma',
    senderRole: 'Trainee',
    receiverId: 'teach-01',
    channelType: 'direct',
    content: 'Sir, can we arrange a quick doubt session on Nyquist limits and Doppler velocity de-aliasing before the Level 3 exam?',
    timestamp: '09:45 AM',
    relatedTopic: 'Exam Preparation: Doppler Velocity De-aliasing',
    status: 'delivered'
  }
];

export const INITIAL_ANONYMOUS_MESSAGES: ChatMessage[] = [
  {
    id: 'anon-01',
    senderId: 'anon-u-101',
    senderName: 'Anonymous Forecaster',
    senderRole: 'Anonymous',
    channelType: 'anonymous',
    channelTag: '#Quiz-Feedback',
    isAnonymous: true,
    anonymousAlias: 'Radar-Observer-408',
    content: 'The 15-second timer on the Radar Velocity Blitz feels slightly tight when computing radial velocity shears from raw PPI scans. Could the faculty consider giving 20 seconds for the polarimetric questions?',
    timestamp: 'Today at 09:15 AM',
    likesCount: 14
  },
  {
    id: 'anon-02',
    senderId: 'anon-u-102',
    senderName: 'Anonymous Faculty',
    senderRole: 'Anonymous',
    channelType: 'anonymous',
    channelTag: '#Quiz-Feedback',
    isAnonymous: true,
    anonymousAlias: 'Faculty-Mentor-89',
    content: 'Noted! The 15s timer is intended to mimic high-stress operational squall warnings where decisions must be made in seconds. However, we have added a "Zen Practice Mode" with unlimited time so cadets can study the physical explanations without panic.',
    timestamp: 'Today at 09:32 AM',
    likesCount: 21
  },
  {
    id: 'anon-03',
    senderId: 'anon-u-103',
    senderName: 'Anonymous Trainee',
    senderRole: 'Anonymous',
    channelType: 'anonymous',
    channelTag: '#Lecture-Doubts',
    isAnonymous: true,
    anonymousAlias: 'Monsoon-Cadet-27',
    content: 'Chapter 4 in Dr. Someshwar Rao’s lecture on hydrometeor classification was phenomenal! Can we get a downloadable PDF cheat sheet for ZDR vs KDP ranges for hail identification?',
    timestamp: 'Today at 08:40 AM',
    likesCount: 18
  },
  {
    id: 'anon-04',
    senderId: 'anon-u-104',
    senderName: 'Anonymous Forecaster',
    senderRole: 'Anonymous',
    channelType: 'anonymous',
    channelTag: '#Radar-Grievances',
    isAnonymous: true,
    anonymousAlias: 'Echo-Sentinel-72',
    content: 'Notice to fellow trainees on shift: Santacruz C-Band radar had ground clutter filter calibration at 06:00 UTC today. If you see anomalous reflectivity rings within 15 km, verify with satellite CTBT before issuing urban alerts.',
    timestamp: 'Yesterday at 06:45 PM',
    likesCount: 32
  },
  {
    id: 'anon-05',
    senderId: 'anon-u-105',
    senderName: 'Anonymous Cadre',
    senderRole: 'Anonymous',
    channelType: 'anonymous',
    channelTag: '#General-Candid',
    isAnonymous: true,
    anonymousAlias: 'Stealth-Nowcaster-19',
    content: 'Having this anonymous forum is really empowering. We can speak frankly about curriculum pacing and hardware difficulties without worrying about hierarchy. Kudos to the CTI modernization team!',
    timestamp: 'Yesterday at 04:12 PM',
    likesCount: 45
  }
];

export const INITIAL_QUIZ_FEEDBACKS: QuizFeedback[] = [
  {
    id: 'qfb-01',
    quizId: 'blitz',
    quizTitle: 'Doppler Radar Speed Blitz & Severe Nowcasting',
    traineeId: 'tr-01',
    traineeName: 'Julianne Moore',
    traineeRank: 'Radar Specialist',
    rating: 5,
    difficultyFeeling: 'Balanced',
    selectedTags: ['Realistic Radar Echoes', 'Great Physics Explanations', 'Mascot Cheer Boosts Morale'],
    comment: 'The hook echo signature question was spot-on. The scientific explanation comparing cyclonic wrapping with rear flank downdraft helped clarify my textbook notes.',
    submittedAt: '15 Sep 2026, 04:30 PM',
    trainerResponse: 'Thank you Cadet Julianne. Real DWR cases will continue to be updated weekly.',
    trainerRespondedBy: 'Dr. Someshwar Rao',
    trainerRespondedAt: '15 Sep 2026, 05:15 PM'
  },
  {
    id: 'qfb-02',
    quizId: 'c-rad-01',
    quizTitle: 'Course Assessment: Doppler Radar Meteorology & Severe Hook Echo',
    traineeId: 'tr-02',
    traineeName: 'Rajesh Sharma',
    traineeRank: 'Cadet Forecaster',
    rating: 4,
    difficultyFeeling: 'Challenging',
    selectedTags: ['Challenging Doppler Signatures', 'Needs More Time for Math'],
    comment: 'The question on tornadic supercell rear-flank gradient was tricky but fair. Would appreciate more questions on VAD wind profiles.',
    submittedAt: '14 Sep 2026, 02:10 PM',
    trainerResponse: 'We have updated Module 4 with two new VAD wind profile diagnostic walkthroughs.',
    trainerRespondedBy: 'Dr. Someshwar Rao',
    trainerRespondedAt: '14 Sep 2026, 03:00 PM'
  },
  {
    id: 'qfb-03',
    quizId: 'survival',
    quizTitle: 'Severe Weather Storm Survival Challenge',
    traineeId: 'tr-04',
    traineeName: 'Karthik Balasubramanian',
    traineeRank: 'Lead Forecaster',
    rating: 5,
    difficultyFeeling: 'Challenging',
    selectedTags: ['Realistic Radar Echoes', 'Great Physics Explanations', 'High Operational Relevance'],
    comment: 'The 3-heart system really tests your reflex confidence under pressure. Great drill before active shift duty at the coastal radar station.',
    submittedAt: '13 Sep 2026, 11:20 AM'
  }
];

export const INITIAL_LECTURE_FEEDBACKS: LectureFeedback[] = [
  {
    id: 'lfb-01',
    lectureId: 'lec-01',
    lectureTitle: 'Mastering Dual-Polarization Radar: ZDR & KDP Rain vs Hail Discrimination',
    teacherId: 'teach-01',
    traineeId: 'tr-01',
    traineeName: 'Julianne Moore',
    traineeRank: 'Radar Specialist',
    rating: 5,
    contentClarity: 5,
    audioVisualQuality: 5,
    pacing: 'Just Right',
    comment: 'Dr. Rao’s breakdown of correlation coefficient (CC) and differential phase (KDP) was the clearest explanation I have seen anywhere. The Pune convective cell case study brought the theory to life.',
    submittedAt: '14 Sep 2026',
    likesCount: 12,
    trainerResponse: {
      trainerName: 'Dr. Someshwar Rao',
      trainerTitle: 'Lead Doppler Radar Faculty',
      comment: 'Delighted to hear this! Pay special attention to slide 14 on melting layer signatures during your upcoming station drill.',
      respondedAt: '14 Sep 2026, 06:30 PM'
    }
  },
  {
    id: 'lfb-02',
    lectureId: 'lec-01',
    lectureTitle: 'Mastering Dual-Polarization Radar: ZDR & KDP Rain vs Hail Discrimination',
    teacherId: 'teach-01',
    traineeId: 'tr-02',
    traineeName: 'Rajesh Sharma',
    traineeRank: 'Cadet Forecaster',
    rating: 5,
    contentClarity: 4,
    audioVisualQuality: 5,
    pacing: 'Just Right',
    comment: 'The interactive timestamps and downloadable markdown notes saved hours of transcription. Excellent lecture!',
    submittedAt: '13 Sep 2026',
    likesCount: 8
  },
  {
    id: 'lfb-03',
    lectureId: 'lec-02',
    lectureTitle: 'Tropical Cyclone Eye-Wall Velocity Dynamics on Coastal S-Band Radars',
    teacherId: 'teach-03',
    traineeId: 'tr-04',
    traineeName: 'Karthik Balasubramanian',
    traineeRank: 'Lead Forecaster',
    rating: 5,
    contentClarity: 5,
    audioVisualQuality: 5,
    pacing: 'Just Right',
    comment: 'Prof. Ramanathan’s experience with maritime radars in the Bay of Bengal shows in every minute. The velocity couplet analysis is essential for any coastal radar officer.',
    submittedAt: '12 Sep 2026',
    likesCount: 15,
    trainerResponse: {
      trainerName: 'Prof. K. V. Ramanathan',
      trainerTitle: 'Senior Marine Radar Chair',
      comment: 'Keep practicing the radius of maximum winds (RMW) estimation in the Radar Sim Lab, Karthik.',
      respondedAt: '13 Sep 2026, 09:10 AM'
    }
  }
];

export const ANONYMOUS_NAME_POOL = [
  'Radar-Observer-408',
  'Storm-Chaser-89',
  'Monsoon-Cadet-27',
  'Echo-Sentinel-72',
  'Stealth-Nowcaster-19',
  'Doppler-Analyst-304',
  'Cyclone-Watcher-55',
  'Vorticity-Scout-81',
  'Baroclinic-Wanderer-94',
  'Microburst-Tracker-16',
  'Cumulonimbus-Cadre-63',
  'Polarimetric-Ghost-12'
];

export const getRandomAnonymousName = (): string => {
  const index = Math.floor(Math.random() * ANONYMOUS_NAME_POOL.length);
  const randomNum = Math.floor(100 + Math.random() * 900);
  const base = ANONYMOUS_NAME_POOL[index].split('-').slice(0, 2).join('-');
  return `${base}-${randomNum}`;
};
