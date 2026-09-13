import React, { useEffect, useRef, useState } from 'react';
import { Layers, Crosshair, ZoomIn, Radio, Eye } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface QuizRadarVisualizerProps {
  signatureType?: 'hook_echo' | 'cyclone_eye' | 'bow_echo' | 'hail_core' | 'monsoon_depression' | 'microburst';
  label?: string;
  isCompact?: boolean;
}

export const QuizRadarVisualizer: React.FC<QuizRadarVisualizerProps> = ({
  signatureType = 'hook_echo',
  label = 'Radar Reflectivity Anomaly',
  isCompact = false,
}) => {
  const { isBright } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'reflectivity' | 'velocity'>('reflectivity');
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; dbz: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let sweepAngle = 0;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(cx, cy) - 15;

      // Clear
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, w, h);

      // Radar Scope Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, maxRadius);
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(0.8, '#060d1b');
      bgGrad.addColorStop(1, '#030710');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, maxRadius, 0, Math.PI * 2);
      ctx.fill();

      // Range Rings (50, 100, 150, 200 km)
      const ringSteps = [0.25, 0.5, 0.75, 1.0];
      ringSteps.forEach((step, idx) => {
        const r = maxRadius * step;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);

        // Label
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
        ctx.font = '9px monospace';
        ctx.fillText(`${(idx + 1) * 50}km`, cx + 4, cy - r + 11);
      });

      // Azimuth Radials (every 45 deg)
      for (let deg = 0; deg < 360; deg += 45) {
        const rad = (deg * Math.PI) / 180;
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(rad) * maxRadius, cy + Math.sin(rad) * maxRadius);
        ctx.stroke();
      }

      // Draw Synthetic Weather Pattern depending on signatureType
      ctx.save();
      if (signatureType === 'hook_echo') {
        // Supercell with pronounced hook appendage
        const stormX = cx + 30;
        const stormY = cy - 20;

        if (viewMode === 'reflectivity') {
          // Outer light rain 30 dBZ
          const g1 = ctx.createRadialGradient(stormX, stormY, 15, stormX, stormY, 65);
          g1.addColorStop(0, '#ef4444'); // high core
          g1.addColorStop(0.3, '#f59e0b');
          g1.addColorStop(0.7, '#10b981');
          g1.addColorStop(1, 'transparent');
          ctx.fillStyle = g1;
          ctx.beginPath();
          ctx.ellipse(stormX, stormY, 55, 38, -0.4, 0, Math.PI * 2);
          ctx.fill();

          // Curled hook appendage (in SW quadrant)
          ctx.strokeStyle = '#dc2626'; // 65 dBZ red
          ctx.lineWidth = 14;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.arc(stormX - 25, stormY + 25, 26, 0.2, 1.8 * Math.PI, false);
          ctx.stroke();

          // Hook tip intense magenta core
          ctx.fillStyle = '#db2777'; // 70 dBZ
          ctx.beginPath();
          ctx.arc(stormX - 35, stormY + 32, 8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Velocity Couplet (Inbound Green vs Outbound Red)
          ctx.fillStyle = '#10b981'; // inbound toward radar
          ctx.beginPath();
          ctx.arc(stormX - 38, stormY + 25, 16, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ef4444'; // outbound away from radar
          ctx.beginPath();
          ctx.arc(stormX - 18, stormY + 28, 16, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (signatureType === 'cyclone_eye') {
        // Tropical Cyclone with distinct spiral bands and clear eye
        const eyeX = cx + 10;
        const eyeY = cy + 10;
        const eyeRadius = 18;

        // Spiral rainbands
        for (let i = 0; i < 4; i++) {
          const startAngle = (i * Math.PI) / 2;
          ctx.strokeStyle = viewMode === 'reflectivity' ? (i % 2 === 0 ? '#ef4444' : '#f59e0b') : (i % 2 === 0 ? '#06b6d4' : '#f97316');
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.beginPath();
          for (let a = 0; a < Math.PI * 1.8; a += 0.1) {
            const r = eyeRadius + 10 + a * 22;
            const px = eyeX + Math.cos(startAngle + a) * r;
            const py = eyeY + Math.sin(startAngle + a) * r;
            if (a === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.stroke();
        }

        // Eyewall ring
        ctx.strokeStyle = viewMode === 'reflectivity' ? '#ec4899' : '#3b82f6';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeRadius + 8, 0, Math.PI * 2);
        ctx.stroke();

        // Clear Eye
        ctx.fillStyle = '#0a1628';
        ctx.beginPath();
        ctx.arc(eyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
      } else if (signatureType === 'bow_echo') {
        // Curved bow echo line
        const bx = cx - 15;
        const by = cy;

        ctx.strokeStyle = viewMode === 'reflectivity' ? '#ef4444' : '#f97316';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(bx, by, 75, -0.6 * Math.PI, 0.6 * Math.PI);
        ctx.stroke();

        // Rear Inflow Notch (hollow behind the apex)
        ctx.fillStyle = '#060d1b';
        ctx.beginPath();
        ctx.arc(bx - 30, by, 22, 0, Math.PI * 2);
        ctx.fill();

        // Core apex hail
        ctx.fillStyle = viewMode === 'reflectivity' ? '#db2777' : '#22c55e';
        ctx.beginPath();
        ctx.arc(bx + 40, by, 10, 0, Math.PI * 2);
        ctx.fill();
      } else if (signatureType === 'hail_core') {
        // Severe core with classic three-body scatter spike (hail spike)
        const hx = cx + 35;
        const hy = cy - 35;

        // Hail spike projecting radially outward along radar beam
        const spikeAngle = Math.atan2(hy - cy, hx - cx);
        ctx.strokeStyle = 'rgba(236, 72, 153, 0.4)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(hx, hy);
        ctx.lineTo(hx + Math.cos(spikeAngle) * 90, hy + Math.sin(spikeAngle) * 90);
        ctx.stroke();

        // Intense core 68 dBZ
        ctx.fillStyle = '#ec4899';
        ctx.beginPath();
        ctx.arc(hx, hy, 22, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#831843';
        ctx.beginPath();
        ctx.arc(hx, hy, 12, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Broad convective bands (Monsoon / Microburst)
        ctx.fillStyle = 'rgba(16, 185, 129, 0.5)';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 25, 80, 30, 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.beginPath();
        ctx.ellipse(cx + 15, cy - 20, 35, 14, 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Radar Sweep Line & Phosphor Glow
      const sweepX = cx + Math.cos(sweepAngle) * maxRadius;
      const sweepY = cy + Math.sin(sweepAngle) * maxRadius;

      // Glow cone trailing the sweep
      const coneGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxRadius);
      coneGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
      coneGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();
      ctx.fill();

      // Main beam
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sweepX, sweepY);
      ctx.stroke();

      // Radar Station Center Hub
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      sweepAngle = (sweepAngle + 0.035) % (Math.PI * 2);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [signatureType, viewMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    // simulated dBZ
    const distFromCenter = Math.hypot(x - rect.width / 2, y - rect.height / 2);
    const simulatedDbz = Math.min(68, Math.max(12, Math.round(70 - distFromCenter * 0.35)));
    setMousePos({ x, y, dbz: simulatedDbz });
  };

  return (
    <div className={`rounded-2xl border overflow-hidden relative ${
      isBright ? 'bg-slate-900 border-slate-700 shadow-md' : 'bg-[#050a14] border-cyan-900/40 shadow-xl'
    }`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-cyan-900/40 bg-slate-950/80 text-xs">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span className="font-mono font-bold text-cyan-300 truncate text-[11px]">
            {label}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setViewMode(viewMode === 'reflectivity' ? 'velocity' : 'reflectivity')}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all ${
              viewMode === 'reflectivity'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}
            title="Toggle Reflectivity (dBZ) / Radial Velocity (kt)"
          >
            {viewMode === 'reflectivity' ? 'dBZ Reflectivity' : 'Radial Velocity (kt)'}
          </button>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative flex items-center justify-center p-2 bg-[#050a14]">
        <canvas
          ref={canvasRef}
          width={isCompact ? 280 : 340}
          height={isCompact ? 220 : 260}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMousePos(null)}
          className="rounded-xl cursor-crosshair max-w-full"
        />

        {/* Live Crosshair readout overlay */}
        {mousePos && (
          <div className="absolute top-4 left-4 pointer-events-none bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-cyan-500/40 text-[10px] font-mono text-cyan-300 flex items-center gap-2 shadow-lg">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>X:{mousePos.x} Y:{mousePos.y}</span>
            <span className="text-amber-400 font-bold">{mousePos.dbz} dBZ</span>
          </div>
        )}

        {/* Color Palette legend */}
        <div className="absolute bottom-3 right-3 pointer-events-none flex items-center gap-0.5 bg-black/70 px-2 py-1 rounded border border-white/10 text-[9px] font-mono text-white/70">
          <span className="text-[8px] mr-1">dBZ:</span>
          <span className="w-2.5 h-2 bg-blue-500 rounded-xs" title="15-25 dBZ" />
          <span className="w-2.5 h-2 bg-emerald-500 rounded-xs" title="30-40 dBZ" />
          <span className="w-2.5 h-2 bg-amber-500 rounded-xs" title="45-50 dBZ" />
          <span className="w-2.5 h-2 bg-red-500 rounded-xs" title="55-60 dBZ" />
          <span className="w-2.5 h-2 bg-pink-500 rounded-xs" title="65+ dBZ (Hail/Tor)" />
        </div>
      </div>
    </div>
  );
};
