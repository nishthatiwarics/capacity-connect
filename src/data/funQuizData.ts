import { FunQuizQuestion, QuizGameMode } from '../types';

export interface QuizMascot {
  id: string;
  name: string;
  title: string;
  avatar: string;
  emoji: string;
  themeColor: string;
  catchphrase: string;
}

export const QUIZ_MASCOTS: QuizMascot[] = [
  {
    id: 'miku_advisor',
    name: 'Hachiware Sensei',
    title: 'Blue Hachiware Chiikawa Teacher Guide',
    avatar: '/src/assets/images/hachiware_teacher_guide_1789296571776.jpg',
    emoji: '🐱',
    themeColor: 'from-sky-500 to-blue-600',
    catchphrase: 'Nanto ka nare! Let\'s study meteorology and Doppler radar step by step!'
  },
  {
    id: 'cadet_mentor',
    name: 'Cadet Mentor Rohan',
    title: 'Foundational Weather Trainee (Level 1)',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    emoji: '🔰',
    themeColor: 'from-slate-500 to-indigo-600',
    catchphrase: 'Mastering every reflectivity dBZ contour from the ground up!'
  },
  {
    id: 'radar_specialist',
    name: 'Specialist Ananya',
    title: 'Doppler Radar Specialist (Level 2)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    emoji: '📡',
    themeColor: 'from-amber-500 to-orange-600',
    catchphrase: 'Sharp velocity dipoles and rapid nowcasting precision!'
  },
  {
    id: 'cyclone_lead',
    name: 'Forecaster Vikram',
    title: 'Severe Cyclone Warning Lead (Level 3)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emoji: '🌪️',
    themeColor: 'from-rose-500 to-red-600',
    catchphrase: 'Standing vigilant through every cyclone eyewall!'
  },
  {
    id: 'chief_scientist',
    name: 'Dr. K. Ramanathan',
    title: 'Chief Atmospheric Scientist (Level 4)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    emoji: '💠',
    themeColor: 'from-sky-400 to-cyan-500',
    catchphrase: 'Deciphering planetary wave dynamics with master-level rigor!'
  }
];

export const FUN_QUIZ_QUESTIONS: FunQuizQuestion[] = [
  {
    id: 'fq-01',
    category: 'Doppler Radar Mysteries',
    title: 'The Infamous "Hook Echo" Monster',
    question: 'You spot a suspicious, curled hook-shaped appendage dangling from the south-southwest flank of a violent supercell storm on the S-Band Doppler screen. What atmospheric beast is about to touch down?',
    options: [
      'A massive tornado vortex (mesocyclone rotation)',
      'A fluffy herd of innocent cumulus humilis clouds',
      'A swarm of migratory locusts playing a prank on the radar antenna',
      'Gentle maritime sea breeze with 0% hazard probability'
    ],
    correctIndex: 0,
    explanation: 'The classic "Hook Echo" signature forms when high-reflectivity rain and hail get wrapped tightly around the storm\'s violently rotating updraft (mesocyclone). It is the premier radar warning sign of a potentially devastating tornado!',
    funFact: 'Did you know? The first documented radar Hook Echo was captured by Donald Staggs in Illinois on April 9, 1953, using an ex-military radar!',
    hint: 'Look at the tight hook curling around the rain-free updraft zone. Rotational torque is extreme here!',
    difficulty: 'Level 2: Specialist (Medium)',
    mikuCommentary: 'That curl is dangerous! Spin up the tornado siren right now, cadet! 🌪️',
    radarSignatureType: 'hook_echo',
    radarSignatureLabel: 'Tornadic Mesocyclone Hook Echo (65+ dBZ core)',
    baseXP: 180
  },
  {
    id: 'fq-02',
    category: 'Tropical Cyclones & Storms',
    title: 'Inside the Calm Eye of the Beast',
    question: 'A Category 4 Very Severe Cyclonic Storm is roaring over the Bay of Bengal. Your coastal Doppler radar reveals a circular 35 km ring of 60 dBZ echoes surrounding an eerily pitch-black, zero-echo center. What is happening in that calm center?',
    options: [
      'Cold air sinking gently inside the Cyclone Eye (Eyewall boundary)',
      'A giant vacuum cleaner sucking all oxygen from planet Earth',
      'Alien spacecraft disguising their thermal propulsion exhaust',
      'A localized heat wave caused by boiling surface plankton'
    ],
    correctIndex: 0,
    explanation: 'The Eye of a tropical cyclone features dry, subsiding (sinking) air which suppresses cloud formation and produces calm winds and clear skies, framed by the terrifying, torrential Eyewall where maximum hurricane-force winds rage!',
    funFact: 'Birds trapped inside a cyclone eye often ride along for hundreds of kilometers because they cannot penetrate the punishing winds of the surrounding eyewall!',
    hint: 'The eyewall has the highest winds, but inside the center core, the air actually sinks and becomes calm.',
    difficulty: 'Level 2: Specialist (Medium)',
    mikuCommentary: 'Don\'t let the calm eye fool you! The back half of the eyewall is coming right behind it! 🌀',
    radarSignatureType: 'cyclone_eye',
    radarSignatureLabel: 'Severe Cyclone Eye & Concentric Eyewall Rainbands',
    baseXP: 200
  },
  {
    id: 'fq-03',
    category: 'Severe Storm Nowcasting',
    title: 'The Charging Bow Echo & The Rear-Inflow Jet',
    question: 'A linear squall line on radar suddenly bulges forward like an archer\'s drawn bow, accelerating towards the city at 95 km/h. What extreme ground hazard should airport control towers be warned about immediately?',
    options: [
      'Destructive straight-line winds and microbursts (derecho wind gusts)',
      'Sudden accumulation of freezing snow in tropical Chennai',
      'Zero wind speed causing hot air balloons to stall forever',
      'Rapid drop in humidity with no atmospheric consequences'
    ],
    correctIndex: 0,
    explanation: 'When a convective line curves into a "Bow Echo", a powerful channel of high-momentum mid-level air known as a Rear-Inflow Jet (RIJ) plunges to the surface, blasting trees, power lines, and aircraft with ferocious straight-line winds!',
    funFact: 'Derecho winds from intense bow echoes can exceed 160 km/h (100 mph), flattening millions of acres of forest in a single afternoon!',
    hint: 'Think of an archer pulling a bowstring: the arrow shoots forward with extreme wind force!',
    difficulty: 'Level 3: Lead Forecaster (Hard)',
    mikuCommentary: 'Hold onto your hats and secure all aircraft! Straight-line winds incoming! 💨',
    radarSignatureType: 'bow_echo',
    radarSignatureLabel: 'Accelerating Bow Echo with Rear-Inflow Notch',
    baseXP: 220
  },
  {
    id: 'fq-04',
    category: 'Radar Physics & Polarimetry',
    title: 'The Mysterious Purple Hail Core (ZDR ≈ 0 dB)',
    question: 'On Dual-Polarization radar, you observe an explosive thunderstorm core with ultra-high reflectivity (> 65 dBZ) but Differential Reflectivity (ZDR) sits right around 0 dB. Why is ZDR near zero despite the torrential precipitation?',
    options: [
      'Giant tumbling hail stones appear aerodynamically spherical to polarized radar pulses',
      'The raindrops are shaped like long flat pancakes floating horizontally',
      'The radar antenna is covered in wet leaves blocking horizontal signals',
      'The clouds are completely empty and transmitting phantom signals'
    ],
    correctIndex: 0,
    explanation: 'Large raindrops flatten into horizontally oriented oblates as they fall (giving high positive ZDR > 3 dB). However, tumbling hail stones wobble in all 3 dimensions randomly, causing horizontal and vertical radar pulses to scatter equally—hence ZDR stays near 0 dB!',
    funFact: 'Hailstones can grow layers like an onion! Each milky layer represents a trip up into the storm\'s freezing updraft core!',
    hint: 'Raindrops flatten like frisbees, but tumbling hail stones tumble and look round on average!',
    difficulty: 'Level 3: Lead Forecaster (Hard)',
    mikuCommentary: 'Tumbling ice bombs! Dual-pol radar exposes hail secrets in a snap! ❄️',
    radarSignatureType: 'hail_core',
    radarSignatureLabel: 'High dBZ Hail Spike & Zero ZDR Tumbling Signature',
    baseXP: 250
  },
  {
    id: 'fq-05',
    category: 'Monsoon Dynamics & India Weather',
    title: 'The Great Monsoon Trough & Low-Pressure Depressions',
    question: 'During peak Southwest Monsoon season in July, a low-pressure monsoon depression forms over the Head Bay of Bengal. Which direction does its torrential rain belt usually propagate across India?',
    options: [
      'West-northwestward along the monsoon trough towards Central India & Rajasthan',
      'Straight eastwards into Myanmar with zero rain over mainland India',
      'Directly south towards Antarctica along the equator',
      'It stays stationary in the Bay of Bengal for 6 consecutive months'
    ],
    correctIndex: 0,
    explanation: 'Monsoon depressions typically track west-northwestward along the active monsoon trough axis across Odisha, Chhattisgarh, Madhya Pradesh, and Gujarat, bringing the life-giving heavy rains that fill reservoirs across India!',
    funFact: 'Monsoon depressions are responsible for over 50% of the severe flood-producing rainfall events across Central and North-West India!',
    hint: 'Follow the monsoon trough axis: it steers storms from the Bay of Bengal into central India.',
    difficulty: 'Level 1: Cadet (Easy)',
    mikuCommentary: 'The lifeblood of Indian agriculture! Guide those rain clouds safely across the plains! 🌧️🌾',
    radarSignatureType: 'monsoon_depression',
    radarSignatureLabel: 'Synoptic Monsoon Low-Pressure Depression Vortex',
    baseXP: 160
  },
  {
    id: 'fq-06',
    category: 'Lightning & Severe Storms',
    title: 'The Kalbaishakhi (Nor\'wester) Lightning Storm',
    question: 'In the pre-monsoon summer months (April-May) over West Bengal, Odisha, and Bangladesh, violent evening thunderstorms known as "Kalbaishakhi" (Nor\'westers) strike. What triggers their explosive convective ignition?',
    options: [
      'Hot dry continental air from the Chota Nagpur plateau colliding with moist maritime air from the Bay of Bengal',
      'Sudden evaporation of the holy Ganges river creating steam clouds',
      'Cold polar winds blowing all the way from the North Pole without warming',
      'Fireworks displays in Kolkata warming up the upper troposphere'
    ],
    correctIndex: 0,
    explanation: 'Kalbaishakhi thunderstorms are caused by strong atmospheric thermodynamic instability where hot, dry elevated air from the plateau overrides warm, extremely moist southerly air from the Bay of Bengal, triggering ferocious squalls and lightning!',
    funFact: 'The name "Kalbaishakhi" literally translates to "Calamity of the month of Baishakh" in Bengali due to its dramatic suddenness and gale-force squalls!',
    hint: 'Look for the boundary where dry plateau air meets moist sea air from the south.',
    difficulty: 'Level 4: Chief Meteorologist (Expert)',
    mikuCommentary: 'Flash, bang, rumble! Kalbaishakhi storms are legendary for their intense lightning displays! ⚡',
    radarSignatureType: 'microburst',
    radarSignatureLabel: 'Kalbaishakhi Convective Gust Front with 75 km/h Squall',
    baseXP: 280
  },
  {
    id: 'fq-07',
    category: 'Atmospheric Optics & Wonders',
    title: 'The 22° Solar Halo Mystery',
    question: 'You look up at midday and see a pristine, shimmering luminous ring encircling the sun at an exact angle of 22 degrees. What atmospheric phenomenon creates this celestial ring?',
    options: [
      'Refraction of sunlight through hexagonal ice crystals floating in high-altitude Cirrostratus clouds',
      'A defect in your sunglasses polarizing the UV radiation',
      'Smoke particles from industrial chimneys reflecting rainbow wavelengths',
      'Low-level fog droplets bouncing laser beams from airport beacons'
    ],
    correctIndex: 0,
    explanation: 'The 22° halo is a classic optical display caused by sunlight passing through and refracting inside billions of microscopic hexagonal ice prism crystals in high cirrostratus clouds at minimum angle of deviation (21.84°)!',
    funFact: 'Ancient mariners and farmers used the 22° solar halo as a storm warning: Cirrostratus clouds often precede warm fronts and cyclonic storms by 24 to 48 hours!',
    hint: 'Hexagonal ice prisms high up in freezing cirrus clouds act like tiny natural prisms bending light at 22 degrees.',
    difficulty: 'Level 1: Cadet (Easy)',
    mikuCommentary: 'A magical halo in the sky! Mother Nature\'s very own stained glass window! ☀️❄️',
    baseXP: 150
  },
  {
    id: 'fq-08',
    category: 'Doppler Velocity Interpretations',
    title: 'Decoding Green vs Red on Radial Velocity',
    question: 'On an IMD Doppler Weather Radar radial velocity display, what do COOL GREEN colors and WARM RED colors represent relative to the radar antenna tower at the center?',
    options: [
      'Green = Winds moving TOWARD the radar; Red = Winds moving AWAY from the radar',
      'Green = Safe harmless clouds; Red = Toxic acid rain droplets',
      'Green = Temperatures below zero; Red = Temperatures above 40°C',
      'Green = High air pressure; Red = Extreme low pressure tornado'
    ],
    correctIndex: 0,
    explanation: 'By international Doppler convention (and IMD standard), cool colors (greens/blues) signify inbound radial velocity (winds traveling toward the radar site), while warm colors (reds/yellows) indicate outbound radial velocity (winds traveling away)!',
    funFact: 'A tight side-by-side patch of bright green and bright red touching each other is called a "Velocity Couplet"—the undeniable fingerprint of rotational spin!',
    hint: 'Green is "Incoming" (towards), Red is "Receding" (away)!',
    difficulty: 'Level 2: Specialist (Medium)',
    mikuCommentary: 'Green to me, Red away from me! Remember that golden radar rule, cadet! 🟢🔴',
    baseXP: 190
  }
];

export const QUIZ_GAME_MODES: {
  id: QuizGameMode;
  name: string;
  tagline: string;
  badge: string;
  icon: string;
  description: string;
  timerSeconds: number; // 0 for untimed
  initialHearts: number;
  bonusMultiplier: number;
  color: string;
}[] = [
  {
    id: 'blitz',
    name: 'Doppler Speed Blitz',
    tagline: '15-Second High Octane Rush',
    badge: 'POPULAR ⚡',
    icon: 'Zap',
    description: 'Race against a ticking 15-second clock! Fast answers earn up to 3.0x combo multipliers and mega XP bonuses!',
    timerSeconds: 15,
    initialHearts: 3,
    bonusMultiplier: 1.5,
    color: 'from-amber-500 to-red-500'
  },
  {
    id: 'radar_mystery',
    name: 'Radar Signature Mystery',
    tagline: 'Visual Doppler Detective',
    badge: 'INTERACTIVE 🛰️',
    icon: 'Eye',
    description: 'Inspect authentic simulated Doppler radar scans (Hook Echoes, Cyclone Eyes, Bow Echoes, Hail Cores) to diagnose severe storms!',
    timerSeconds: 25,
    initialHearts: 3,
    bonusMultiplier: 1.3,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'survival',
    name: 'Competency Tier Survival Run',
    tagline: 'Climb Cadet to Chief Meteorologist',
    badge: 'CHALLENGE 🏆',
    icon: 'Trophy',
    description: 'Start as a Cadet with 3 hearts! Every streak of correct answers promotes you up to Specialist, Lead Forecaster, and Chief Meteorologist!',
    timerSeconds: 20,
    initialHearts: 3,
    bonusMultiplier: 1.8,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'practice',
    name: 'Hachiware Study & Practice Nook',
    tagline: 'Relaxed Learning with Faculty Hints',
    badge: 'CASUAL 🐱',
    icon: 'BookOpen',
    description: 'No countdown timer stress! Take all the time you need, read rich meteorological explanations, and consult with mentors.',
    timerSeconds: 0,
    initialHearts: 99,
    bonusMultiplier: 1.0,
    color: 'from-purple-500 to-indigo-600'
  }
];
