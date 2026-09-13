import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  RotateCcw, 
  Maximize2, 
  Crosshair, 
  Layers, 
  Zap, 
  ShieldAlert, 
  CheckCircle2, 
  Info,
  Sliders,
  Wind,
  CloudRain,
  Eye
} from 'lucide-react';
import { RadarScenario, AlertLevel } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface RadarSimLabProps {
  scenarios: RadarScenario[];
  onAwardXP: (xp: number, reason: string) => void;
}

export const RadarSimLab: React.FC<RadarSimLabProps> = ({
  scenarios,
  onAwardXP,
}) => {
  const { isBright } = useTheme();
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const activeScenario = scenarios[selectedScenarioIndex] || scenarios[0];

  const [radarMode, setRadarMode] = useState<'Reflectivity' | 'Velocity' | 'CloudTop'>('Reflectivity');
  const [beamSpeed, setBeamSpeed] = useState<number>(1.2); // radians per second
  const [gainDbz, setGainDbz] = useState<number>(45);
  const [rangeKm, setRangeKm] = useState<number>(250);
  const [activeBand, setActiveBand] = useState<'S-Band' | 'C-Band' | 'X-Band'>('S-Band');
  
  // Interactive Anomaly Inspection
  const [inspectedPoint, setInspectedPoint] = useState<{
    x: number;
    y: number;
    rangeKm: number;
    azimuthDeg: number;
    dbz: number;
    velocityKt: number;
  } | null>(null);

  const [diagnosisSubmitted, setDiagnosisSubmitted] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<{ passed: boolean; message: string } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const angleRef = useRef<number>(0);


  // Draw Doppler Radar Sweep loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;
    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isRunning) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      angleRef.current = (angleRef.current + beamSpeed * dt) % (2 * Math.PI);
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) - 20;

      // Clear dark atmospheric canvas
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, width, height);

      // Radar Range Rings (50km, 100km, 150km, 200km, 250km)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)';
      ctx.lineWidth = 1;
      const ringSteps = 5;
      for (let i = 1; i <= ringSteps; i++) {
        const r = (maxRadius / ringSteps) * i;
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, 2 * Math.PI);
        ctx.stroke();

        // Distance label
        ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText(`${Math.round((rangeKm / ringSteps) * i)}km`, centerX + 4, centerY - r + 12);
      }

      // Azimuth lines (every 45 degrees)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.12)';
      for (let a = 0; a < 360; a += 45) {
        const rad = (a * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + Math.cos(rad) * maxRadius, centerY + Math.sin(rad) * maxRadius);
        ctx.stroke();

        // Degree label
        const degX = centerX + Math.cos(rad) * (maxRadius + 12);
        const degY = centerY + Math.sin(rad) * (maxRadius + 12);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${a}°`, degX, degY);
      }

      // Draw Scenario Weather Echoes
      const currentScenario = scenarios[selectedScenarioIndex];
      drawScenarioEcho(ctx, centerX, centerY, maxRadius, currentScenario, radarMode, gainDbz);

      // Radar Sweep Beam with fading trail
      const currentAngle = angleRef.current;
      const sweepSegments = 40;
      const sweepSpan = 0.5; // radians

      for (let s = 0; s < sweepSegments; s++) {
        const segFrac = s / sweepSegments;
        const segAngle = currentAngle - sweepSpan * (1 - segFrac);
        const alpha = segFrac * 0.28;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, maxRadius, segAngle, segAngle + sweepSpan / sweepSegments);
        ctx.closePath();

        if (radarMode === 'Reflectivity') {
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`;
        } else if (radarMode === 'Velocity') {
          ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, ${alpha})`;
        }
        ctx.fill();
      }

      // Bright leading sweep line
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(currentAngle) * maxRadius, centerY + Math.sin(currentAngle) * maxRadius);
      ctx.strokeStyle = radarMode === 'Reflectivity' ? '#22d3ee' : radarMode === 'Velocity' ? '#34d399' : '#c084fc';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Station Center Crosshair & Pulse
      ctx.beginPath();
      ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#38bdf8';
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.stroke();

      // If user inspected a point, draw tactical crosshair
      if (inspectedPoint) {
        ctx.save();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(inspectedPoint.x, inspectedPoint.y, 14, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(inspectedPoint.x - 20, inspectedPoint.y);
        ctx.lineTo(inspectedPoint.x + 20, inspectedPoint.y);
        ctx.moveTo(inspectedPoint.x, inspectedPoint.y - 20);
        ctx.lineTo(inspectedPoint.x, inspectedPoint.y + 20);
        ctx.stroke();
        ctx.restore();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [beamSpeed, selectedScenarioIndex, radarMode, gainDbz, rangeKm, inspectedPoint, scenarios]);

  // Helper to draw realistic weather echoes based on category
  const drawScenarioEcho = (
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    maxR: number,
    scenario: RadarScenario,
    mode: 'Reflectivity' | 'Velocity' | 'CloudTop',
    gain: number
  ) => {
    ctx.save();

    if (scenario.category === 'Supercell') {
      // Amritsar Hook Echo at 240 deg, 0.45 distance
      const rad = (240 * Math.PI) / 180;
      const dist = maxR * 0.48;
      const ex = cx + Math.cos(rad) * dist;
      const ey = cy + Math.sin(rad) * dist;

      // Outer storm envelope
      const grad = ctx.createRadialGradient(ex, ey, 5, ex, ey, 65);
      if (mode === 'Reflectivity') {
        grad.addColorStop(0, 'rgba(217, 70, 239, 0.9)'); // High dBZ core (>65 dBZ)
        grad.addColorStop(0.3, 'rgba(239, 68, 68, 0.85)'); // Red 55 dBZ
        grad.addColorStop(0.6, 'rgba(234, 179, 8, 0.7)');  // Yellow 40 dBZ
        grad.addColorStop(0.85, 'rgba(34, 197, 94, 0.5)'); // Green 25 dBZ
        grad.addColorStop(1, 'transparent');
      } else if (mode === 'Velocity') {
        // Tight couplet: Left inbound (green), Right outbound (red)
        grad.addColorStop(0, 'rgba(244, 63, 94, 0.85)');
        grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.85)');
        grad.addColorStop(1, 'transparent');
      } else {
        // Cloud-top IR cold core (-70°C)
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.4, 'rgba(99, 102, 241, 0.8)');
        grad.addColorStop(1, 'transparent');
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ex, ey, 65, 0, 2 * Math.PI);
      ctx.fill();

      // Hook Echo Appendage
      ctx.beginPath();
      ctx.moveTo(ex + 10, ey + 10);
      ctx.bezierCurveTo(ex + 35, ey + 45, ex + 5, ey + 55, ex - 18, ey + 45);
      ctx.strokeStyle = mode === 'Reflectivity' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(244, 63, 94, 0.9)';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.stroke();

    } else if (scenario.category === 'Cyclone') {
      // Cyclone Eyewall with spiral rainbands
      const rad = (110 * Math.PI) / 180;
      const dist = maxR * 0.45;
      const ex = cx + Math.cos(rad) * dist;
      const ey = cy + Math.sin(rad) * dist;

      // Concentric eyewall
      ctx.beginPath();
      ctx.arc(ex, ey, 24, 0, 2 * Math.PI);
      ctx.strokeStyle = mode === 'Reflectivity' ? 'rgba(217, 70, 239, 0.95)' : 'rgba(244, 63, 94, 0.9)';
      ctx.lineWidth = 14;
      ctx.stroke();

      // Clear eye in the center
      ctx.fillStyle = '#050a14';
      ctx.beginPath();
      ctx.arc(ex, ey, 14, 0, 2 * Math.PI);
      ctx.fill();

      // Spiral Feeder bands
      for (let b = 0; b < 3; b++) {
        ctx.beginPath();
        const startA = (b * 120 * Math.PI) / 180;
        ctx.arc(ex, ey, 45 + b * 22, startA, startA + Math.PI * 0.9);
        ctx.strokeStyle = mode === 'Reflectivity' ? 'rgba(234, 179, 8, 0.65)' : 'rgba(16, 185, 129, 0.6)';
        ctx.lineWidth = 10;
        ctx.stroke();
      }

    } else if (scenario.category === 'Monsoon Surge') {
      // Broad coastal bands
      ctx.beginPath();
      ctx.ellipse(cx - 30, cy + 40, maxR * 0.6, maxR * 0.25, -Math.PI / 4, 0, 2 * Math.PI);
      const grad = ctx.createLinearGradient(cx - 100, cy - 50, cx + 100, cy + 150);
      grad.addColorStop(0, 'rgba(34, 197, 94, 0.6)');
      grad.addColorStop(0.5, 'rgba(234, 179, 8, 0.7)');
      grad.addColorStop(0.8, 'rgba(239, 68, 68, 0.65)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();

    } else {
      // Nor'wester Squall Line (long linear band)
      ctx.save();
      ctx.translate(cx + 20, cy - 20);
      ctx.rotate(-Math.PI / 6);
      ctx.beginPath();
      ctx.rect(-maxR * 0.55, -25, maxR * 1.1, 50);
      const grad = ctx.createLinearGradient(0, -25, 0, 25);
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.85)'); // Leading edge gust front
      grad.addColorStop(0.4, 'rgba(234, 179, 8, 0.75)');
      grad.addColorStop(0.8, 'rgba(34, 197, 94, 0.5)'); // Trailing stratiform
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  };

  // Canvas Click Handler: Interactively pinpoint radar anomalies
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const dx = clickX - cx;
    const dy = clickY - cy;

    const distPx = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = Math.min(cx, cy) - 20;
    const calculatedRangeKm = Math.min(rangeKm, Math.round((distPx / maxRadius) * rangeKm));

    // Azimuth in standard meteorological degrees (0 = North, 90 = East, 180 = South, 270 = West)
    let angleRad = Math.atan2(dy, dx);
    let azim = Math.round((angleRad * 180) / Math.PI);
    if (azim < 0) azim += 360;

    // Simulated dBZ & Velocity based on proximity to active scenario anomaly
    const dbzValue = Math.min(72, Math.max(15, Math.round(activeScenario.maxReflectivityDbz - (Math.random() * 8))));
    const velValue = Math.round(activeScenario.radialVelocityKnots * (0.8 + Math.random() * 0.3));

    sound.playRadarPing();

    setInspectedPoint({
      x: clickX,
      y: clickY,
      rangeKm: calculatedRangeKm,
      azimuthDeg: azim,
      dbz: dbzValue,
      velocityKt: velValue,
    });
    setDiagnosisSubmitted(false);
    setDiagnosisResult(null);
  };

  // Submitting diagnosis for active scenario
  const handleConfirmDiagnosis = () => {
    sound.playSuccess();
    setDiagnosisSubmitted(true);
    setDiagnosisResult({
      passed: true,
      message: `Diagnosis Confirmed! Target identified: ${activeScenario.keyFeature}. ${activeScenario.correctDiagnosis}`,
    });

    onAwardXP(350, `Radar Lab Mastery: ${activeScenario.title}`);
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.65 },
      colors: ['#00f5d4', '#0284c7', '#f59e0b', '#10b981'],
    });
  };

  return (
    <div className={`border rounded-2xl p-4 lg:p-6 shadow-xs relative overflow-hidden transition-colors ${
      isBright 
        ? 'bg-white border-slate-200 shadow-sm' 
        : 'bg-[#0b1220] border-cyan-900/40 shadow-xl'
    }`}>
      {/* Subtle tactical corner badges */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${
        isBright ? 'bg-sky-400/10' : 'bg-cyan-500/5'
      }`} />

      {/* Header section */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
        isBright ? 'border-slate-200' : 'border-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${
            isBright 
              ? 'bg-sky-50 border border-sky-200 text-sky-600' 
              : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400'
          }`}>
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className={`text-base lg:text-lg font-bold tracking-tight ${
                isBright ? 'text-slate-900' : 'text-white'
              }`}>
                Interactive Doppler Weather Radar Lab
              </h2>
              <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-full border ${
                isBright 
                  ? 'bg-sky-100 text-sky-800 border-sky-300' 
                  : 'bg-cyan-950 text-cyan-300 border-cyan-700/50'
              }`}>
                Live Simulator
              </span>
            </div>
            <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
              Real-time 360° PPI sweep • Click anywhere on radar to inspect storm cell telemetry
            </p>
          </div>
        </div>

        {/* Mode Buttons */}
        <div className={`flex items-center gap-1.5 p-1 border rounded-xl ${
          isBright ? 'bg-slate-100 border-slate-200' : 'bg-slate-900 border-slate-800'
        }`}>
          <button
            onClick={() => {
              sound.playBlip(650);
              setRadarMode('Reflectivity');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              radarMode === 'Reflectivity'
                ? isBright
                  ? 'bg-sky-600 text-white shadow-xs font-bold'
                  : 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : isBright
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
            }`}
          >
            Reflectivity (dBZ)
          </button>
          <button
            onClick={() => {
              sound.playBlip(750);
              setRadarMode('Velocity');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              radarMode === 'Velocity'
                ? isBright
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'bg-emerald-500 text-slate-950 shadow-md font-bold'
                : isBright
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
            }`}
          >
            Radial Velocity (VAD)
          </button>
          <button
            onClick={() => {
              sound.playBlip(850);
              setRadarMode('CloudTop');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              radarMode === 'CloudTop'
                ? isBright
                  ? 'bg-indigo-600 text-white shadow-xs font-bold'
                  : 'bg-purple-500 text-slate-950 shadow-md font-bold'
                : isBright
                  ? 'text-slate-600 hover:text-slate-900'
                  : 'text-slate-400 hover:text-white'
            }`}
          >
            INSAT-3DR IR
          </button>
        </div>
      </div>

      {/* Main Grid: Radar Canvas + Interactive Scenario Control Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5">
        {/* Left: Interactive Canvas Viewport */}
        <div className={`lg:col-span-7 flex flex-col items-center justify-center border rounded-xl p-3 relative ${
          isBright ? 'bg-slate-900 border-slate-700 shadow-md' : 'bg-[#070b14] border-slate-800'
        }`}>
          <div className="w-full flex items-center justify-between px-2 pb-2 text-[11px] font-mono text-slate-300">
            <span className="flex items-center gap-1 text-cyan-400 font-semibold">
              <Crosshair className="w-3.5 h-3.5" />
              <span>{activeScenario.station}</span>
            </span>
            <span className="text-slate-400">RANGE: {rangeKm} KM • 0.5° ELEVATION</span>
          </div>

          <div className="relative w-full aspect-square max-w-[500px]">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              onClick={handleCanvasClick}
              className="w-full h-full rounded-lg cursor-crosshair shadow-inner"
            />

            {/* Corner telemetry watermark */}
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-slate-950/80 backdrop-blur border border-slate-800 rounded text-[10px] font-mono text-slate-300 pointer-events-none">
              FREQ: {activeBand} • GAIN: {gainDbz} dB
            </div>

            {/* Instruction tooltip */}
            {!inspectedPoint && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-cyan-950/90 backdrop-blur-sm border border-cyan-600 rounded-full text-[11px] text-cyan-200 pointer-events-none flex items-center gap-1.5 animate-bounce shadow-md">
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>Tap on storm anomaly to inspect</span>
              </div>
            )}
          </div>

          {/* Color Bar Scale */}
          <div className="w-full max-w-[480px] mt-3">
            <div className="flex justify-between text-[10px] font-mono text-slate-300 mb-1">
              <span>{radarMode === 'Reflectivity' ? '10 dBZ (Light)' : radarMode === 'Velocity' ? '-60 kt (Inbound)' : '-80°C (Cold Core)'}</span>
              <span className="font-bold text-white uppercase">{radarMode} Scale</span>
              <span>{radarMode === 'Reflectivity' ? '70 dBZ (Hail)' : radarMode === 'Velocity' ? '+60 kt (Outbound)' : '+30°C (Warm)'}</span>
            </div>
            <div 
              className="h-2 rounded-full w-full"
              style={{
                background: radarMode === 'Reflectivity'
                  ? 'linear-gradient(to right, #0284c7, #22c55e, #eab308, #ef4444, #d946ef, #ffffff)'
                  : radarMode === 'Velocity'
                  ? 'linear-gradient(to right, #10b981, #064e3b, #050a14, #7f1d1d, #f43f5e)'
                  : 'linear-gradient(to right, #ffffff, #6366f1, #3b82f6, #06b6d4, #10b981, #f59e0b)'
              }}
            />
          </div>
        </div>

        {/* Right: Mission Scenario Selector & Tactical Analysis Deck */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Scenario Picker Carousel */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                isBright ? 'text-slate-600' : 'text-slate-400'
              }`}>
                Active Weather Scenarios
              </span>
              <span className={`text-[11px] font-mono ${isBright ? 'text-sky-700 font-bold' : 'text-cyan-400'}`}>
                {selectedScenarioIndex + 1} of {scenarios.length}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {scenarios.map((sc, idx) => (
                <button
                  key={sc.id}
                  onClick={() => {
                    sound.playBlip(700);
                    setSelectedScenarioIndex(idx);
                    setInspectedPoint(null);
                    setDiagnosisSubmitted(false);
                  }}
                  className={`p-2.5 text-left rounded-xl border transition-all ${
                    selectedScenarioIndex === idx
                      ? isBright
                        ? 'bg-sky-50 border-sky-400 shadow-sm ring-1 ring-sky-300'
                        : 'bg-cyan-950/50 border-cyan-500/60 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                      : isBright
                        ? 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 text-slate-600'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono uppercase font-bold ${
                      isBright ? 'text-sky-700' : 'text-cyan-400'
                    }`}>
                      {sc.category}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${sc.severity === 'Red' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                  </div>
                  <h4 className={`text-xs font-semibold line-clamp-1 ${
                    isBright ? 'text-slate-900 font-bold' : 'text-slate-200'
                  }`}>
                    {sc.title}
                  </h4>
                  <p className={`text-[10px] mt-0.5 ${isBright ? 'text-slate-500' : 'text-slate-500'}`}>{sc.station}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Scenario Detailed Intel Card */}
          <div className={`p-4 border rounded-xl space-y-3 transition-colors ${
            isBright ? 'bg-slate-50/80 border-slate-200 shadow-xs' : 'bg-slate-900/80 border-slate-800'
          }`}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                  isBright 
                    ? 'bg-rose-100 text-rose-800 border-rose-200' 
                    : 'bg-rose-950 text-rose-300 border-rose-800/50'
                }`}>
                  {activeScenario.event}
                </span>
                <h3 className={`text-sm font-bold mt-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  {activeScenario.title}
                </h3>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-mono font-bold ${
                  isBright ? 'text-rose-700' : 'text-rose-400'
                }`}>
                  {activeScenario.maxReflectivityDbz} dBZ
                </span>
                <p className={`text-[10px] font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                  TOP: {activeScenario.echoTopKm} km
                </p>
              </div>
            </div>

            <p className={`text-xs leading-relaxed ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              {activeScenario.description}
            </p>

            <div className={`p-2.5 border rounded-lg text-xs ${
              isBright 
                ? 'bg-white border-slate-200' 
                : 'bg-slate-950/60 border-slate-800/80'
            }`}>
              <span className={`text-[11px] font-mono font-semibold block mb-0.5 ${
                isBright ? 'text-amber-800' : 'text-amber-400'
              }`}>
                KEY SIGNATURE:
              </span>
              <span className={isBright ? 'text-slate-800 font-medium' : 'text-slate-200'}>{activeScenario.keyFeature}</span>
            </div>

            {/* Target Inspection Result Box */}
            {inspectedPoint ? (
              <div className={`p-3 border rounded-xl space-y-2 ${
                isBright 
                  ? 'bg-sky-50/80 border-sky-200' 
                  : 'bg-cyan-950/40 border-cyan-800/60'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-mono font-bold flex items-center gap-1 ${
                    isBright ? 'text-sky-800' : 'text-cyan-300'
                  }`}>
                    <Crosshair className="w-3.5 h-3.5" />
                    TARGET ACQUIRED
                  </span>
                  <span className={`font-mono text-[11px] ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
                    {inspectedPoint.azimuthDeg}° AZ • {inspectedPoint.rangeKm} KM
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className={`p-2 rounded-lg ${isBright ? 'bg-white border border-sky-100' : 'bg-slate-900'}`}>
                    <span className={`text-[10px] block font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>REFLECTIVITY</span>
                    <span className={`text-sm font-bold font-mono ${isBright ? 'text-sky-700' : 'text-cyan-300'}`}>
                      {inspectedPoint.dbz} dBZ
                    </span>
                  </div>
                  <div className={`p-2 rounded-lg ${isBright ? 'bg-white border border-sky-100' : 'bg-slate-900'}`}>
                    <span className={`text-[10px] block font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>RADIAL VELOCITY</span>
                    <span className={`text-sm font-bold font-mono ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>
                      ±{inspectedPoint.velocityKt} knots
                    </span>
                  </div>
                </div>

                {!diagnosisSubmitted ? (
                  <button
                    onClick={handleConfirmDiagnosis}
                    className={`w-full py-2 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                      isBright 
                        ? 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Storm Diagnosis (+350 XP)</span>
                  </button>
                ) : (
                  <div className={`p-2.5 border rounded-lg text-xs space-y-1 ${
                    isBright 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : 'bg-emerald-950/60 border-emerald-800/60 text-emerald-300'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold">
                      <CheckCircle2 className={`w-4 h-4 ${isBright ? 'text-emerald-600' : 'text-emerald-400'}`} />
                      <span>{diagnosisResult?.message}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className={`text-center py-3 border border-dashed rounded-xl text-xs ${
                isBright ? 'border-slate-300 text-slate-500 bg-white/50' : 'border-slate-800 text-slate-500'
              }`}>
                Click on the radar display above to pinpoint the mesocyclone or squall signature.
              </div>
            )}
          </div>

          {/* Tactical Sliders */}
          <div className={`p-3 border rounded-xl space-y-2 text-xs ${
            isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between text-slate-500">
              <span className={`flex items-center gap-1 text-[11px] font-mono ${
                isBright ? 'text-slate-700' : 'text-slate-400'
              }`}>
                <Sliders className={`w-3.5 h-3.5 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
                SWEEP ROTATION SPEED
              </span>
              <span className={`font-mono font-bold ${isBright ? 'text-sky-700' : 'text-cyan-400'}`}>{beamSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.2"
              value={beamSpeed}
              onChange={(e) => setBeamSpeed(parseFloat(e.target.value))}
              className={`w-full h-1 rounded-lg cursor-pointer ${
                isBright ? 'accent-sky-600 bg-slate-200' : 'accent-cyan-400 bg-slate-800'
              }`}
            />

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
              <span className={isBright ? 'text-slate-600' : 'text-slate-400'}>RADAR FREQUENCY:</span>
              <div className="flex gap-1.5">
                {(['S-Band', 'C-Band', 'X-Band'] as const).map((band) => (
                  <button
                    key={band}
                    onClick={() => {
                      sound.playBlip(800);
                      setActiveBand(band);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all ${
                      activeBand === band
                        ? isBright 
                          ? 'bg-sky-600 text-white border-sky-600 shadow-xs' 
                          : 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : isBright
                          ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {band}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
