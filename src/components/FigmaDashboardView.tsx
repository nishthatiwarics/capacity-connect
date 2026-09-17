import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  Clock, 
  ChevronDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Radio, 
  MapPin, 
  ShieldCheck, 
  Activity,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Station, Trainee } from '../types';

interface FigmaDashboardViewProps {
  stations: Station[];
  trainees: Trainee[];
  onSelectStation: (station: Station) => void;
  onOpenDrill: () => void;
  onNavigateToTrainees: () => void;
  onNavigateToCourses: () => void;
}

interface ChartPoint {
  day: string;
  value: number; // 0 - 100
  connections: number;
  bandwidth: string;
}

const CHART_DATA: ChartPoint[] = [
  { day: 'Day 1', value: 34, connections: 4210, bandwidth: '78.2 Mbps' },
  { day: 'Day 2', value: 42, connections: 5120, bandwidth: '82.5 Mbps' },
  { day: 'Day 3', value: 38, connections: 4890, bandwidth: '80.1 Mbps' },
  { day: 'Day 4', value: 58, connections: 6940, bandwidth: '91.4 Mbps' },
  { day: 'Day 5', value: 51, connections: 6180, bandwidth: '86.0 Mbps' },
  { day: 'Day 6', value: 68, connections: 7850, bandwidth: '94.8 Mbps' },
  { day: 'Day 7', value: 65, connections: 7420, bandwidth: '93.2 Mbps' },
  { day: 'Day 8', value: 78, connections: 8960, bandwidth: '98.5 Mbps' },
  { day: 'Day 9', value: 72, connections: 8350, bandwidth: '95.6 Mbps' },
  { day: 'Day 10', value: 83, connections: 9480, bandwidth: '99.1 Mbps' },
  { day: 'Day 11', value: 76, connections: 8820, bandwidth: '96.8 Mbps' },
  { day: 'Day 12', value: 89, connections: 10420, bandwidth: '99.8 Mbps' },
];

export const FigmaDashboardView: React.FC<FigmaDashboardViewProps> = ({
  stations,
  trainees,
  onSelectStation,
  onOpenDrill,
  onNavigateToTrainees,
  onNavigateToCourses
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<ChartPoint | null>(null);
  const [timeRange, setTimeRange] = useState<'Last 12 Days' | 'Last 30 Days' | 'Quarterly'>('Last 12 Days');
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);

  // SVG Chart Dimensions
  const svgWidth = 640;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  // Calculate coordinates for the line chart
  const points = CHART_DATA.map((d, index) => {
    const x = paddingX + (index / (CHART_DATA.length - 1)) * (svgWidth - paddingX * 2);
    // Invert Y so highest value is near top
    const y = svgHeight - paddingY - (d.value / 100) * (svgHeight - paddingY * 2);
    return { x, y, data: d };
  });

  // Build SVG path
  const pathD = points.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill path for gradient under the line
  const fillD = `${pathD} L ${points[points.length - 1].x} ${svgHeight - paddingY} L ${points[0].x} ${svgHeight - paddingY} Z`;

  // Recent Trainees matching Figma
  const recentTrainees = [
    {
      id: 'rt-1',
      name: 'Julianne Moore',
      role: 'UI Design & Radar Cartography',
      status: 'Active',
      statusColor: 'bg-emerald-500'
    },
    {
      id: 'rt-2',
      name: 'Robert Downey',
      role: 'Cybersecurity & DWR Telemetry',
      status: 'Pending',
      statusColor: 'bg-amber-400'
    },
    {
      id: 'rt-3',
      name: 'Emma Watson',
      role: 'Data Science & WRF Modeling',
      status: 'Active',
      statusColor: 'bg-emerald-500'
    },
    {
      id: 'rt-4',
      name: 'Arthur Dent',
      role: 'Product Mgmt & Disaster SOPs',
      status: 'Offline',
      statusColor: 'bg-slate-300'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 3 Metric Cards matching Figma top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Total Users */}
        <div 
          onClick={onNavigateToTrainees}
          className="bg-white/90 backdrop-blur-md border border-sky-200/80 hover:border-sky-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group text-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrolled Cadets</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 group-hover:bg-sky-600 group-hover:text-white transition-colors shadow-xs">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">12,847</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>+14.2% active this cycle</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Courses */}
        <div 
          onClick={onNavigateToCourses}
          className="bg-white/90 backdrop-blur-md border border-blue-200/80 hover:border-blue-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group text-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Curriculum Modules</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">342</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-sky-600">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>+8.4% completion rate</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Approval */}
        <div 
          onClick={onNavigateToTrainees}
          className="bg-white/90 backdrop-blur-md border border-amber-200/80 hover:border-amber-400 rounded-2xl p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group text-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Requisitions</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">19</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-amber-600">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              <span>Awaiting DG Signature</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Capacity Connection Over Time + Recent Trainees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Capacity Connection Over Time Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between text-slate-900">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Capacity Connection & Radar Telemetry Over Time
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5">
                Real-time interactive bandwidth and cadet engagement across national stations.
              </p>
            </div>

            {/* Timeframe Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-white hover:border-sky-400 transition-colors shadow-2xs"
              >
                <span>{timeRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isTimeDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs text-slate-700">
                  {(['Last 12 Days', 'Last 30 Days', 'Quarterly'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTimeRange(opt);
                        setIsTimeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 font-bold transition-colors ${
                        timeRange === opt ? 'bg-sky-600 text-white' : 'text-slate-700 hover:bg-sky-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Responsive SVG Line Chart (Meteorological sky blue highlight line & points) */}
          <div className="mt-6 relative w-full overflow-x-auto scrollbar-none">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              <defs>
                <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal subtle guideline rows */}
              {[25, 50, 75, 100].map((v) => {
                const y = svgHeight - paddingY - (v / 100) * (svgHeight - paddingY * 2);
                return (
                  <line
                    key={v}
                    x1={paddingX}
                    y1={y}
                    x2={svgWidth - paddingX}
                    y2={y}
                    stroke="#F1F5F9"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Area gradient under the line */}
              <path d={fillD} fill="url(#skyGradient)" />

              {/* The Line - Atmospheric Sky Blue Highlight */}
              <path
                d={pathD}
                fill="none"
                stroke="#0284c7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Dots for each day */}
              {points.map((pt, idx) => {
                const isHovered = hoveredPoint?.day === pt.data.day;
                return (
                  <g key={idx} className="cursor-pointer">
                    {/* Hit target */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="14"
                      fill="transparent"
                      onMouseEnter={() => setHoveredPoint(pt.data)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                    {/* Visual dot */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 7 : 5}
                      fill={isHovered ? '#0ea5e9' : '#0284c7'}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="transition-all duration-200"
                    />
                  </g>
                );
              })}

              {/* X-Axis Labels */}
              {points.map((pt, idx) => (
                <text
                  key={idx}
                  x={pt.x}
                  y={svgHeight - 8}
                  textAnchor="middle"
                  className={`text-[10px] font-sans font-medium transition-colors ${
                    hoveredPoint?.day === pt.data.day ? 'fill-sky-700 font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.data.day}
                </text>
              ))}
            </svg>

            {/* Hover Tooltip - High-contrast Sky/Navy Highlight */}
            {hoveredPoint && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xl flex items-center gap-2">
                <span className="text-sky-300 font-bold">{hoveredPoint.day}:</span>
                <span>{hoveredPoint.connections.toLocaleString()} Connections</span>
                <span className="opacity-70">|</span>
                <span className="text-emerald-400 font-bold">{hoveredPoint.bandwidth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Recent Trainees (lg:col-span-4) matching Figma */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between text-slate-900">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Recent Trainees
            </h3>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Live roster of deployed operational cadets.
            </p>

            <div className="mt-5 space-y-4">
              {recentTrainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className="flex items-center justify-between pb-3.5 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {trainee.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {trainee.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${trainee.statusColor} shadow-xs`} />
                    <span className={`text-xs font-bold ${
                      trainee.status === 'Active' ? 'text-emerald-600' :
                      trainee.status === 'Pending' ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {trainee.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToTrainees}
            className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 hover:border-sky-400 text-xs font-bold text-slate-700 hover:text-sky-900 hover:bg-sky-50 transition-all text-center cursor-pointer shadow-2xs"
          >
            View All Trainees Roster
          </button>
        </div>
      </div>

      {/* Operational Telemetry: National Radar Stations Network */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl p-6 shadow-xs text-slate-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                National Doppler Weather Radar (DWR) Telemetry
              </h3>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Real-time operational readiness & simulated training capacity across Indian zones.
            </p>
          </div>

          <button
            onClick={onOpenDrill}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            Launch Crisis Drill
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.slice(0, 4).map((station) => (
            <div
              key={station.id}
              onClick={() => onSelectStation(station)}
              className="border border-slate-200/90 hover:border-sky-400 rounded-xl p-4 transition-all cursor-pointer group bg-slate-50/70 hover:bg-white shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-slate-900">{station.name}</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                  station.alertLevel === 'Red' ? 'bg-rose-100 text-rose-800' :
                  station.alertLevel === 'Orange' ? 'bg-amber-100 text-amber-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {station.code}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between text-xs">
                <span className="text-slate-500 font-medium">Readiness:</span>
                <span className="font-mono font-bold text-slate-900">{station.readinessScore}%</span>
              </div>

              <div className="w-full bg-slate-100 h-2 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all"
                  style={{ width: `${station.readinessScore}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono font-medium">
                <span>{station.activeTrainees} Active Cadets</span>
                <span>{station.certifiedForecasters} Certified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
