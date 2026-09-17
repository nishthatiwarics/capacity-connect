export interface KnowledgeItem {
  id: string;
  title: string;
  category: 'Case Study' | 'Standard Operating Procedure (SOP)' | 'Research Note' | 'Field Observation' | 'Technical Manual';
  competencyDomain: 'Radar Meteorology' | 'Severe Nowcasting' | 'Cyclone Dynamics' | 'Satellite & NWP' | 'Agro-Advisory' | 'Aviation Meteorology';
  authorName: string;
  authorDesignation: string;
  authorAvatar: string;
  stationOrInstitute: string;
  publishedDate: string;
  readTimeMinutes: number;
  upvotes: number;
  commentsCount: number;
  views: number;
  summary: string;
  contentMarkdown: string;
  tags: string[];
  isVerifiedIMD: boolean;
  downloadsCount: number;
  attachmentFileName?: string;
  keyTakeaways: string[];
}

export interface ForumQuestion {
  id: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  title: string;
  description: string;
  category: string;
  postedAt: string;
  upvotes: number;
  answers: {
    id: string;
    authorName: string;
    authorRole: string;
    authorAvatar: string;
    isFacultyVerified: boolean;
    content: string;
    upvotes: number;
    answeredAt: string;
  }[];
}

export const INITIAL_KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'kb-01',
    title: 'Severe Cyclone Biparjoy: Doppler S-Band Velocity De-aliasing & Landfall Nowcasting SOP',
    category: 'Case Study',
    competencyDomain: 'Cyclone Dynamics',
    authorName: 'Dr. Ananya Sengupta',
    authorDesignation: 'Chief Radar Scientist & WMO Expert',
    authorAvatar: '',
    stationOrInstitute: 'IMD Coastal Doppler Network, Bhuj / Jamnagar',
    publishedDate: '12 Oct 2024',
    readTimeMinutes: 8,
    upvotes: 248,
    commentsCount: 34,
    views: 3120,
    summary: 'Operational debrief analyzing radial velocity folding during the 140 km/h landfall of Cyclone Biparjoy. Details standard protocol for dual-PRF switching and mesocyclonic eyewall identification.',
    contentMarkdown: `### Operational Background
During the landfall approach of Very Severe Cyclonic Storm Biparjoy along the Saurashtra-Kutch coastline, S-Band Doppler radars at Bhuj and Kandla encountered extreme azimuthal shear (>45 m/s) resulting in Nyquist velocity folding.

### Key Technical Findings
1. **Dual-PRF Optimization**: Switching to dual-PRF (3:2 ratio) prevented velocity folding up to ±64 m/s without compromising unambiguous range (250 km).
2. **Eyewall Replacement Cycle (ERC)**: Secondary reflectivity concentric ring observed at 14:00 UTC signaled a 2-hour temporary plateau in central pressure.
3. **Radial Convergence Pattern**: Inflow velocity peaks in the front-right quadrant correlated directly with peak storm surge inundation zones.`,
    tags: ['Cyclone Biparjoy', 'S-Band Doppler', 'Velocity De-aliasing', 'Nowcasting', 'MoES Standard'],
    isVerifiedIMD: true,
    downloadsCount: 890,
    attachmentFileName: 'SOP-MoES-Cyclone-Landfall-Radar-Proc-2024.pdf',
    keyTakeaways: [
      'Dual-PRF must be locked 6 hours prior to estimated radar horizon breach',
      'Eyewall replacement cycles can be detected 90 minutes before satellite microwave passes',
      'Velocity azimuth display (VAD) wind profiles enable precise surface gust estimates'
    ]
  },
  {
    id: 'kb-02',
    title: 'IMD Standard Operating Procedure (SOP-04): C-Band Doppler Radar Daily Hardware Calibration & Zero-Check',
    category: 'Standard Operating Procedure (SOP)',
    competencyDomain: 'Radar Meteorology',
    authorName: 'Er. Rajeshwar Rao',
    authorDesignation: 'Superintending Radar Engineer',
    authorAvatar: '',
    stationOrInstitute: 'National Radar Centre, New Delhi',
    publishedDate: '28 Nov 2024',
    readTimeMinutes: 12,
    upvotes: 182,
    commentsCount: 19,
    views: 2450,
    summary: 'Official mandatory procedural guidelines for transmitter magnetron frequency stabilization, noise figure measurement, pedestal azimuth backlash testing, and sun-pointing antenna alignment.',
    contentMarkdown: `### 1. Scope & Applicability
This SOP is mandatory for all IMD operational radar engineers and trainee technical officers operating C-Band (5.6 GHz) Doppler Radar installations across peninsular and plains networks.

### 2. Daily Pre-Shift Calibration Protocol (05:30 IST)
- **Sun Tracking Routine**: Execute solar flux alignment calibration between 06:15 - 06:45 IST to confirm beam pointing accuracy within ±0.05°.
- **Transmitter Klystron/Magnetron Diagnostics**: Verify peak pulse power exceeds 250 kW; duty cycle nominal at 0.001.
- **ZDR (Differential Reflectivity) Birdbath Scan**: Conduct vertical 90° elevation birdbath scan during light stratiform drizzle to calibrate systemic differential reflectivity bias to < 0.1 dB.`,
    tags: ['SOP-04', 'C-Band Radar', 'Hardware Calibration', 'Sun Calibration', 'ZDR Calibration'],
    isVerifiedIMD: true,
    downloadsCount: 1420,
    attachmentFileName: 'IMD-SOP-04-CBand-Radar-Calibration-Manual.pdf',
    keyTakeaways: [
      'Daily solar tracking guarantees azimuth/elevation error remains below 0.05 degrees',
      'Birdbath vertical scan is essential for reliable hydrometeor classification',
      'Weekly waveguide dehydration pressure must maintain 0.35 bar minimum'
    ]
  },
  {
    id: 'kb-03',
    title: 'Himalayan Cloudburst Early Detection: Combining X-Band Micro-Radar with Satellite Water Vapor IR',
    category: 'Research Note',
    competencyDomain: 'Severe Nowcasting',
    authorName: 'Dr. Vandana Joshi',
    authorDesignation: 'Professor of Atmospheric Physics',
    authorAvatar: '',
    stationOrInstitute: 'Western Himalayan Meteorological Centre, Shimla',
    publishedDate: '15 Jan 2025',
    readTimeMinutes: 6,
    upvotes: 310,
    commentsCount: 42,
    views: 4180,
    summary: 'Field observation study demonstrating how X-band steep-elevation scans detect rapid hydrometeor lofting 25 minutes prior to flash flood surges in steep terrain valleys.',
    contentMarkdown: `### Mountain Meteorology Challenge
Steep orography frequently blocks conventional S-band low elevation radar beams. X-band solid-state radars stationed on ridge crests provide vital 0-to-15 km boundary layer coverage.

### Key Indicators for 25-Minute Precursor Alert
- **Echo Top Growth Rate**: > 2.5 km per 5-minute volume scan.
- **Reflectivity Core**: > 52 dBZ extending above the -10°C freezing level (4.2 km MSL).
- **Differential Phase Shift (KDP)**: Rapid surge to > 3.0°/km signaling dense supercooled water drops.`,
    tags: ['Cloudburst', 'Himalayas', 'X-Band Radar', 'Flash Flood', 'Early Warning'],
    isVerifiedIMD: true,
    downloadsCount: 760,
    attachmentFileName: 'Research-Himalayan-Cloudburst-Detection-Framework.pdf',
    keyTakeaways: [
      'KDP spikes provide earlier flood warnings than reflectivity alone in mountainous terrain',
      'X-band mountain networks require dynamic rain attenuation correction algorithms',
      'Nowcasting horizon is expanded by 25 critical minutes for civil administration evacuation'
    ]
  },
  {
    id: 'kb-04',
    title: 'Nor\'wester (Kalbaisakhi) Severe Thunderstorm & Microburst Warning Protocol for Eastern India',
    category: 'Standard Operating Procedure (SOP)',
    competencyDomain: 'Severe Nowcasting',
    authorName: 'Dr. Sourav Banerjee',
    authorDesignation: 'Director, Regional Meteorological Centre Kolkata',
    authorAvatar: '',
    stationOrInstitute: 'RMC Kolkata / Gangetic Bengal Radar Cluster',
    publishedDate: '04 Feb 2025',
    readTimeMinutes: 10,
    upvotes: 195,
    commentsCount: 26,
    views: 1890,
    summary: 'Step-by-step radar signature recognition protocol for squall lines, bow echoes, and dry-slot intrusions triggering severe winds exceeding 80 km/h in West Bengal, Odisha, and Bihar.',
    contentMarkdown: `### Introduction to Nor'wester Dynamics
Nor'westers originate over the Chota Nagpur plateau and propagate southeastward, fed by moisture from the Bay of Bengal meeting cold dry mid-tropospheric westerly winds.

### Warning Issuance Checklist
1. Inspect 3 km CAPPI for Rear Inflow Jet (RIJ) signatures.
2. Monitor Velocity Spectrum Width > 8 m/s indicating extreme turbulence.
3. Trigger Yellow Nowcast alert if VIL (Vertically Integrated Liquid) exceeds 45 kg/m².
4. Upgrade to Red Warning if Bow Echo apex velocity surpasses 55 knots.`,
    tags: ['Nor\'wester', 'Kalbaisakhi', 'Bow Echo', 'Microburst', 'Kolkata Radar'],
    isVerifiedIMD: true,
    downloadsCount: 620,
    attachmentFileName: 'IMD-Norwester-Nowcasting-SOP-Manual.pdf',
    keyTakeaways: [
      'Bow echo apex marks the highest surface wind damage risk zone',
      'VIL collapse triggers microburst within 3-7 minutes',
      'Nowcast bulletins must be dispatched via automated API within 4 minutes of scan completion'
    ]
  },
  {
    id: 'kb-05',
    title: 'AI & Physics-Informed Neural Networks in NWP Ensemble Post-Processing: IMD Pilot Benchmark',
    category: 'Research Note',
    competencyDomain: 'Satellite & NWP',
    authorName: 'Priya Sundararajan',
    authorDesignation: 'Lead AI & NWP Specialist, MoES',
    authorAvatar: '',
    stationOrInstitute: 'Centre for Advanced Medium Range Forecasting, Pune',
    publishedDate: '19 Feb 2025',
    readTimeMinutes: 7,
    upvotes: 275,
    commentsCount: 38,
    views: 3410,
    summary: 'Evaluating transformer-based deep learning models against traditional 12 km GFS/NCUM ensemble forecasts for monsoon quantitative precipitation forecasting (QPF).',
    contentMarkdown: `### Abstract
Extreme precipitation events during the southwest monsoon present steep non-linear biases in physical parameterization schemes. This research evaluates PINNs (Physics-Informed Neural Networks) trained on 20 years of IMD gridded rainfall data.

### Performance Results
- **Brier Skill Score**: Improved by 22% for heavy rainfall events (> 65 mm/day).
- **False Alarm Ratio**: Reduced by 16% in the Western Ghats orographic zone.
- **Inference Latency**: Generates probabilistic ensemble forecast in 45 seconds on standard GPU workstation.`,
    tags: ['AI in Weather', 'PINN', 'NWP', 'Monsoon QPF', 'MoES AI Lab'],
    isVerifiedIMD: true,
    downloadsCount: 950,
    attachmentFileName: 'AI-NWP-Ensemble-Benchmark-Report.pdf',
    keyTakeaways: [
      'AI models must strictly preserve mass and moisture conservation equations',
      'High-resolution terrain elevation masks are vital for accurate orographic precipitation',
      'Hybrid physics-AI approach outperforms standalone neural networks'
    ]
  }
];

export const INITIAL_FORUM_QUESTIONS: ForumQuestion[] = [
  {
    id: 'fq-01',
    title: 'How do you differentiate between anomalous ground clutter and low-level stratiform rain during winter temperature inversions?',
    description: 'At our North Indian C-band station, we frequently see 40 dBZ echoes at 0.5° elevation on cold winter mornings that dissipate by 10 AM. Dual-pol correlation coefficient (CC) is around 0.65 - 0.82. What is the standard confirmation procedure before flagging as precipitation?',
    authorName: 'Rohan Deshmukh',
    authorRole: 'Trainee Meteorologist (Cadet Forecaster)',
    authorAvatar: '',
    category: 'Radar Meteorology',
    postedAt: '2 days ago',
    upvotes: 18,
    answers: [
      {
        id: 'ans-01',
        authorName: 'Dr. Ananya Sengupta',
        authorRole: 'Chief Radar Scientist (Chief Meteorologist)',
        authorAvatar: '',
        isFacultyVerified: true,
        content: 'Excellent practical observation, Cadet Rohan! Temperature inversions create super-refraction, bending the radar beam down into hills, buildings, or the ground (AP clutter). The key dual-polarization metric here is Copolar Correlation Coefficient (RhoHV / CC). Pure meteorological rain exhibits CC > 0.95. If CC is < 0.85 with near-zero radial velocity and wide spectrum width, it is 100% anomalous propagation. Do NOT issue rainfall warnings on these echoes without checking the 1.5° elevation slice.',
        upvotes: 27,
        answeredAt: '1 day ago'
      }
    ]
  },
  {
    id: 'fq-02',
    title: 'What is the minimum echo top height to categorize a convective cloud as a potential Severe Thunderstorm over peninsular India?',
    description: 'During pre-monsoon convective activity in Hyderabad, our Doppler radar often tracks cells reaching 12 km vs 16 km. At what height does the lightning and squall probability cross the 80% threshold?',
    authorName: 'Kavita Nair',
    authorRole: 'Meteorologist-B (Lead Forecaster)',
    authorAvatar: '',
    category: 'Severe Nowcasting',
    postedAt: '3 days ago',
    upvotes: 24,
    answers: [
      {
        id: 'ans-02',
        authorName: 'Dr. Sourav Banerjee',
        authorRole: 'Director, RMC Kolkata',
        authorAvatar: '',
        isFacultyVerified: true,
        content: 'In tropical peninsular regions, the -20°C isotherm sits around 7.5 to 8.0 km. A cell requires its 40 dBZ core to penetrate at least 3 km above the -20°C level (i.e. echo top > 13.5 km) for strong non-inductive mixed-phase electrification. Once echo tops exceed 15 km with 50 dBZ cores, severe hail and >60 km/h surface squalls have an 88% statistical correlation.',
        upvotes: 31,
        answeredAt: '2 days ago'
      }
    ]
  }
];
