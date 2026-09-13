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
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Users</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-black tracking-tight">12,847</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>+14.2%</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Courses */}
        <div 
          onClick={onNavigateToCourses}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Courses</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-black tracking-tight">342</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              <span>+8.4%</span>
            </div>
          </div>
        </div>

        {/* Card 3: Pending Approval */}
        <div 
          onClick={onNavigateToTrainees}
          className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Approval</span>
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-extrabold text-black tracking-tight">19</h3>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-bold text-rose-600">
              <ArrowDownRight className="w-4 h-4 stroke-[2.5]" />
              <span>-23.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Capacity Connection Over Time + Recent Trainees */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Capacity Connection Over Time Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Capacity Connection Over Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Monitor interactive bandwidth and trainee engagement.
              </p>
            </div>

            {/* Timeframe Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-semibold text-black bg-white hover:border-black transition-colors shadow-2xs"
              >
                <span>{timeRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isTimeDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 text-xs">
                  {(['Last 12 Days', 'Last 30 Days', 'Quarterly'] as const).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setTimeRange(opt);
                        setIsTimeDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 transition-colors ${
                        timeRange === opt ? 'bg-black text-white font-bold' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Responsive SVG Line Chart (Black highlight line & points) */}
          <div className="mt-6 relative w-full overflow-x-auto scrollbar-none">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-auto min-w-[500px]"
            >
              <defs>
                <linearGradient id="blackGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#000000" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
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
              <path d={fillD} fill="url(#blackGradient)" />

              {/* The Line - Black Highlight as requested */}
              <path
                d={pathD}
                fill="none"
                stroke="#000000"
                strokeWidth="2.75"
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
                      r={isHovered ? 6 : 4.5}
                      fill="#000000"
                      stroke="#FFFFFF"
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
                    hoveredPoint?.day === pt.data.day ? 'fill-black font-bold' : 'fill-slate-400'
                  }`}
                >
                  {pt.data.day}
                </text>
              ))}
            </svg>

            {/* Hover Tooltip - Black Highlight */}
            {hoveredPoint && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-mono shadow-md flex items-center gap-2">
                <span className="font-bold">{hoveredPoint.day}:</span>
                <span>{hoveredPoint.connections.toLocaleString()} Connections</span>
                <span className="opacity-70">|</span>
                <span className="text-emerald-400 font-semibold">{hoveredPoint.bandwidth}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Recent Trainees (lg:col-span-4) matching Figma */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">
              Recent Trainees
            </h3>

            <div className="mt-5 space-y-4">
              {recentTrainees.map((trainee) => (
                <div
                  key={trainee.id}
                  className="flex items-center justify-between pb-3.5 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div>
                    <h4 className="text-sm font-bold text-black leading-snug">
                      {trainee.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {trainee.role}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-2">
                    <span className={`w-2 h-2 rounded-full ${trainee.statusColor}`} />
                    <span className={`text-xs font-semibold ${
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
            className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 hover:border-black text-xs font-bold text-black hover:bg-slate-50 transition-all text-center"
          >
            View All Trainees Roster
          </button>
        </div>
      </div>

      {/* Operational Telemetry: National Radar Stations Network */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-base font-bold text-black tracking-tight">
                National Doppler Weather Radar (DWR) Telemetry
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time operational readiness & simulated training capacity across Indian zones.
            </p>
          </div>

          <button
            onClick={onOpenDrill}
            className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs shrink-0"
          >
            Launch Crisis Drill
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stations.slice(0, 4).map((station) => (
            <div
              key={station.id}
              onClick={() => onSelectStation(station)}
              className="border border-slate-200 rounded-xl p-4 hover:border-black transition-all cursor-pointer group bg-slate-50/50 hover:bg-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-black">{station.name}</span>
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
                <span className="text-slate-500">Readiness:</span>
                <span className="font-mono font-bold text-black">{station.readinessScore}%</span>
              </div>

              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-black h-full rounded-full transition-all"
                  style={{ width: `${station.readinessScore}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
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
