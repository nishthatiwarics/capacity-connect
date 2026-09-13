import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, Layers, Eye, EyeOff, Sliders, Zap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';

export type GradientPreset = 'cosmic-aurora' | 'sunset-doppler' | 'cyber-tempest' | 'prism-iridescent';
export type GradientIntensity = 'ultra' | 'vibrant' | 'subtle';

interface MaximalistGradientBackgroundProps {
  initialPreset?: GradientPreset;
  showControls?: boolean;
}

interface PaletteConfig {
  id: GradientPreset;
  name: string;
  tagline: string;
  badgeEmoji: string;
  previewGradient: string;
  darkBlobs: {
    color: string;
    position: string;
    size: string;
    animation: string;
    opacity: string;
  }[];
  brightBlobs: {
    color: string;
    position: string;
    size: string;
    animation: string;
    opacity: string;
  }[];
  baseGradientDark: string;
  baseGradientBright: string;
  gridColorDark: string;
  gridColorBright: string;
  contourStrokeDark: string;
  contourStrokeBright: string;
}

const PALETTES: Record<GradientPreset, PaletteConfig> = {
  'cosmic-aurora': {
    id: 'cosmic-aurora',
    name: 'Cosmic Aurora',
    tagline: 'Deep space indigo, electric cyan & emerald radar blooms',
    badgeEmoji: '🌌',
    previewGradient: 'from-cyan-400 via-emerald-500 to-indigo-600',
    baseGradientDark: 'bg-gradient-to-br from-[#050816] via-[#091024] to-[#04060f]',
    baseGradientBright: 'bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f5f3ff]',
    gridColorDark: 'rgba(6, 182, 212, 0.07)',
    gridColorBright: 'rgba(14, 165, 233, 0.1)',
    contourStrokeDark: 'rgba(6, 182, 212, 0.12)',
    contourStrokeBright: 'rgba(14, 165, 233, 0.18)',
    darkBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#06b6d4_0%,rgba(6,182,212,0.4)_40%,transparent_70%)]',
        position: 'top-[-10%] left-[-5%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-75',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#8b5cf6_0%,rgba(139,92,246,0.4)_40%,transparent_70%)]',
        position: 'top-[20%] right-[-10%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-70',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#10b981_0%,rgba(16,185,129,0.35)_40%,transparent_70%)]',
        position: 'bottom-[-10%] left-[20%]',
        size: 'w-[700px] h-[700px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#f43f5e_0%,rgba(244,63,94,0.3)_40%,transparent_70%)]',
        position: 'bottom-[15%] right-[5%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-55',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#4f46e5_0%,rgba(79,70,229,0.5)_40%,transparent_70%)]',
        position: 'top-[45%] left-[30%]',
        size: 'w-[600px] h-[600px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
    ],
    brightBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#38bdf8_0%,rgba(56,189,248,0.4)_45%,transparent_70%)]',
        position: 'top-[-10%] left-[-5%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-60',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#c084fc_0%,rgba(192,132,252,0.35)_45%,transparent_70%)]',
        position: 'top-[25%] right-[-10%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-55',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#34d399_0%,rgba(52,211,153,0.3)_45%,transparent_70%)]',
        position: 'bottom-[-10%] left-[25%]',
        size: 'w-[700px] h-[700px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-50',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#fda4af_0%,rgba(253,164,175,0.3)_45%,transparent_70%)]',
        position: 'bottom-[10%] right-[5%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-45',
      },
    ],
  },
  'sunset-doppler': {
    id: 'sunset-doppler',
    name: 'Sunset Doppler',
    tagline: 'Vibrant fuchsia, solar gold, hot tangerine & deep magenta',
    badgeEmoji: '🌅',
    previewGradient: 'from-amber-400 via-rose-500 to-purple-600',
    baseGradientDark: 'bg-gradient-to-br from-[#120512] via-[#1c0919] to-[#0a030f]',
    baseGradientBright: 'bg-gradient-to-br from-[#fff7ed] via-[#fff1f2] to-[#faf5ff]',
    gridColorDark: 'rgba(244, 63, 94, 0.08)',
    gridColorBright: 'rgba(244, 63, 94, 0.12)',
    contourStrokeDark: 'rgba(245, 158, 11, 0.15)',
    contourStrokeBright: 'rgba(244, 63, 94, 0.18)',
    darkBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#f59e0b_0%,rgba(245,158,11,0.45)_40%,transparent_70%)]',
        position: 'top-[-10%] left-[5%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-80',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#ec4899_0%,rgba(236,72,153,0.45)_40%,transparent_70%)]',
        position: 'top-[15%] right-[-5%]',
        size: 'w-[850px] h-[850px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-75',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#f97316_0%,rgba(249,115,22,0.4)_40%,transparent_70%)]',
        position: 'bottom-[-5%] left-[30%]',
        size: 'w-[700px] h-[700px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-70',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#8b5cf6_0%,rgba(139,92,246,0.35)_40%,transparent_70%)]',
        position: 'bottom-[20%] right-[10%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#be123c_0%,rgba(190,18,60,0.4)_40%,transparent_70%)]',
        position: 'top-[45%] left-[-10%]',
        size: 'w-[600px] h-[600px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
    ],
    brightBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#fbbf24_0%,rgba(251,191,36,0.4)_45%,transparent_70%)]',
        position: 'top-[-5%] left-[5%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#f43f5e_0%,rgba(244,63,94,0.35)_45%,transparent_70%)]',
        position: 'top-[20%] right-[-5%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#fb923c_0%,rgba(251,146,60,0.35)_45%,transparent_70%)]',
        position: 'bottom-[-5%] left-[25%]',
        size: 'w-[700px] h-[700px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-55',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#d8b4fe_0%,rgba(216,180,254,0.3)_45%,transparent_70%)]',
        position: 'bottom-[15%] right-[8%]',
        size: 'w-[600px] h-[600px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-50',
      },
    ],
  },
  'cyber-tempest': {
    id: 'cyber-tempest',
    name: 'Cyber Tempest',
    tagline: 'High-voltage electric lime, neon turquoise & deep sapphire abyss',
    badgeEmoji: '⚡',
    previewGradient: 'from-emerald-400 via-teal-400 to-blue-600',
    baseGradientDark: 'bg-gradient-to-br from-[#021317] via-[#041d24] to-[#020b12]',
    baseGradientBright: 'bg-gradient-to-br from-[#ecfdf5] via-[#f0fdfa] to-[#eff6ff]',
    gridColorDark: 'rgba(20, 184, 166, 0.08)',
    gridColorBright: 'rgba(13, 148, 136, 0.12)',
    contourStrokeDark: 'rgba(52, 211, 153, 0.14)',
    contourStrokeBright: 'rgba(13, 148, 136, 0.18)',
    darkBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#10b981_0%,rgba(16,185,129,0.5)_40%,transparent_70%)]',
        position: 'top-[-10%] right-[10%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-80',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#06b6d4_0%,rgba(6,182,212,0.45)_40%,transparent_70%)]',
        position: 'top-[20%] left-[-8%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-75',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#3b82f6_0%,rgba(59,130,246,0.45)_40%,transparent_70%)]',
        position: 'bottom-[-10%] right-[15%]',
        size: 'w-[850px] h-[850px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-70',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#14b8a6_0%,rgba(20,184,166,0.4)_40%,transparent_70%)]',
        position: 'bottom-[25%] left-[10%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#6366f1_0%,rgba(99,102,241,0.35)_40%,transparent_70%)]',
        position: 'top-[50%] right-[35%]',
        size: 'w-[600px] h-[600px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
    ],
    brightBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#34d399_0%,rgba(52,211,153,0.4)_45%,transparent_70%)]',
        position: 'top-[-5%] right-[10%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#22d3ee_0%,rgba(34,211,238,0.4)_45%,transparent_70%)]',
        position: 'top-[20%] left-[-5%]',
        size: 'w-[700px] h-[700px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#60a5fa_0%,rgba(96,165,250,0.35)_45%,transparent_70%)]',
        position: 'bottom-[-5%] right-[20%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-55',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#5eead4_0%,rgba(94,234,212,0.35)_45%,transparent_70%)]',
        position: 'bottom-[20%] left-[8%]',
        size: 'w-[600px] h-[600px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-50',
      },
    ],
  },
  'prism-iridescent': {
    id: 'prism-iridescent',
    name: 'Prism Iridescent',
    tagline: 'Maximalist prismatic rainbow, lavender, rose, seafoam & gold',
    badgeEmoji: '🌈',
    previewGradient: 'from-pink-400 via-purple-400 via-sky-400 to-emerald-400',
    baseGradientDark: 'bg-gradient-to-br from-[#0c0a1a] via-[#120f26] to-[#080712]',
    baseGradientBright: 'bg-gradient-to-br from-[#faf5ff] via-[#f0f9ff] to-[#fdf2f8]',
    gridColorDark: 'rgba(168, 85, 247, 0.08)',
    gridColorBright: 'rgba(168, 85, 247, 0.12)',
    contourStrokeDark: 'rgba(236, 72, 153, 0.14)',
    contourStrokeBright: 'rgba(168, 85, 247, 0.18)',
    darkBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#ec4899_0%,rgba(236,72,153,0.45)_40%,transparent_70%)]',
        position: 'top-[-8%] left-[10%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-80',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#a855f7_0%,rgba(168,85,247,0.45)_40%,transparent_70%)]',
        position: 'top-[20%] right-[-5%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-75',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#06b6d4_0%,rgba(6,182,212,0.45)_40%,transparent_70%)]',
        position: 'bottom-[-10%] left-[15%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-70',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#eab308_0%,rgba(234,179,8,0.4)_40%,transparent_70%)]',
        position: 'bottom-[15%] right-[10%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#10b981_0%,rgba(16,185,129,0.35)_40%,transparent_70%)]',
        position: 'top-[45%] left-[40%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
    ],
    brightBlobs: [
      {
        color: 'bg-[radial-gradient(circle_at_center,#f472b6_0%,rgba(244,114,182,0.4)_45%,transparent_70%)]',
        position: 'top-[-5%] left-[8%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-65',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#c084fc_0%,rgba(192,132,252,0.4)_45%,transparent_70%)]',
        position: 'top-[20%] right-[-5%]',
        size: 'w-[800px] h-[800px]',
        animation: 'animate-float-reverse',
        opacity: 'opacity-60',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#38bdf8_0%,rgba(56,189,248,0.35)_45%,transparent_70%)]',
        position: 'bottom-[-5%] left-[20%]',
        size: 'w-[750px] h-[750px]',
        animation: 'animate-pulse-glow',
        opacity: 'opacity-55',
      },
      {
        color: 'bg-[radial-gradient(circle_at_center,#fde047_0%,rgba(253,224,71,0.35)_45%,transparent_70%)]',
        position: 'bottom-[12%] right-[12%]',
        size: 'w-[650px] h-[650px]',
        animation: 'animate-float-slow',
        opacity: 'opacity-50',
      },
    ],
  },
};

export const MaximalistGradientBackground: React.FC<MaximalistGradientBackgroundProps> = ({
  initialPreset = 'cosmic-aurora',
  showControls = true,
}) => {
  const { isBright } = useTheme();

  // Load from localStorage if present
  const [activePreset, setActivePreset] = useState<GradientPreset>(() => {
    try {
      const saved = localStorage.getItem('imd_maximalist_gradient_preset');
      if (saved && (saved in PALETTES)) return saved as GradientPreset;
    } catch (e) {
      // ignore
    }
    return initialPreset;
  });

  const [intensity, setIntensity] = useState<GradientIntensity>(() => {
    try {
      const saved = localStorage.getItem('imd_maximalist_gradient_intensity');
      if (saved === 'ultra' || saved === 'vibrant' || saved === 'subtle') return saved;
    } catch (e) {
      // ignore
    }
    return 'ultra';
  });

  const [showOverlays, setShowOverlays] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('imd_maximalist_gradient_preset', activePreset);
    } catch (e) {
      // ignore
    }
  }, [activePreset]);

  useEffect(() => {
    try {
      localStorage.setItem('imd_maximalist_gradient_intensity', intensity);
    } catch (e) {
      // ignore
    }
  }, [intensity]);

  const palette = PALETTES[activePreset] || PALETTES['cosmic-aurora'];
  const blobs = isBright ? palette.brightBlobs : palette.darkBlobs;

  // Scale opacity based on intensity
  const intensityMultiplier = intensity === 'ultra' ? 1.3 : intensity === 'vibrant' ? 1.0 : 0.6;
  const filterBlur = intensity === 'ultra' ? 'blur-[90px]' : intensity === 'vibrant' ? 'blur-[120px]' : 'blur-[150px]';

  return (
    <>
      {/* FIXED MAXIMALIST GRADIENT CANVAS BEHIND ALL APP CONTENT */}
      <div 
        id="maximalist-gradient-container"
        className={`fixed inset-0 pointer-events-none -z-10 overflow-hidden transition-colors duration-700 ${
          isBright ? palette.baseGradientBright : palette.baseGradientDark
        }`}
        aria-hidden="true"
      >
        {/* Layer 1: Atmospheric Radial Mesh Gradient Blobs */}
        <div 
          className={`absolute inset-0 transition-all duration-700 ${filterBlur}`}
          style={{ opacity: intensityMultiplier }}
        >
          {blobs.map((blob, idx) => (
            <div
              key={`${activePreset}-${idx}`}
              className={`absolute rounded-full ${blob.size} ${blob.position} ${blob.color} ${blob.opacity} ${blob.animation} transform-gpu will-change-transform`}
            />
          ))}
        </div>

        {/* Layer 2: Geometric & Meteorological Isobar Contours SVG */}
        {showOverlays && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
            style={{ opacity: intensity === 'subtle' ? 0.35 : intensity === 'vibrant' ? 0.65 : 0.9 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Micro-dot matrix pattern */}
              <pattern
                id="maximalist-dot-grid"
                x="0"
                y="0"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="1.2"
                  fill={isBright ? palette.gridColorBright : palette.gridColorDark}
                />
                <circle
                  cx="4"
                  cy="4"
                  r="0.75"
                  fill={isBright ? palette.gridColorBright : palette.gridColorDark}
                />
              </pattern>

              {/* Crosshair pattern */}
              <pattern
                id="maximalist-crosshair"
                x="0"
                y="0"
                width="144"
                height="144"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 72 64 L 72 80 M 64 72 L 80 72"
                  stroke={isBright ? palette.gridColorBright : palette.gridColorDark}
                  strokeWidth="1.2"
                />
              </pattern>
            </defs>

            {/* Pattern rects */}
            <rect width="100%" height="100%" fill="url(#maximalist-dot-grid)" />
            <rect width="100%" height="100%" fill="url(#maximalist-crosshair)" />

            {/* Isobar Atmospheric Pressure Flow Contours */}
            <g
              fill="none"
              stroke={isBright ? palette.contourStrokeBright : palette.contourStrokeDark}
              strokeWidth="1.5"
              strokeLinecap="round"
              className="transition-all duration-700"
            >
              {/* Contour 1: Upper right atmospheric wave */}
              <path
                d="M 800 -100 C 1100 120, 1300 40, 1600 200 C 1800 320, 1950 240, 2200 400"
                strokeDasharray="8 6"
              />
              <path
                d="M 750 -40 C 1050 180, 1280 100, 1550 270 C 1750 390, 1900 320, 2150 480"
              />
              <path
                d="M 700 20 C 1000 240, 1250 160, 1500 340 C 1700 460, 1850 400, 2100 560"
                strokeDasharray="4 8"
              />

              {/* Contour 2: Lower left deep trough */}
              <path
                d="M -100 600 C 250 720, 450 580, 700 800 C 950 1020, 1200 900, 1500 1150"
              />
              <path
                d="M -150 670 C 200 790, 420 650, 660 880 C 900 1100, 1160 970, 1450 1220"
                strokeDasharray="6 6"
              />
              <path
                d="M -200 740 C 150 860, 390 720, 620 960 C 850 1180, 1120 1040, 1400 1290"
              />
            </g>

            {/* Doppler Concentric Rings in Top Right Corner (Ultra-slow spin) */}
            <g
              className="animate-spin-ultra-slow origin-[85%_15%]"
              fill="none"
              stroke={isBright ? palette.contourStrokeBright : palette.contourStrokeDark}
              strokeWidth="1.2"
            >
              <circle cx="85%" cy="15%" r="180" strokeDasharray="6 8" />
              <circle cx="85%" cy="15%" r="280" />
              <circle cx="85%" cy="15%" r="380" strokeDasharray="12 12" />
              <circle cx="85%" cy="15%" r="490" strokeDasharray="3 6" />
              {/* Azimuth tick marks */}
              <line x1="85%" y1="calc(15% - 510px)" x2="85%" y2="calc(15% + 510px)" strokeDasharray="4 10" />
              <line x1="calc(85% - 510px)" y1="15%" x2="calc(85% + 510px)" y2="15%" strokeDasharray="4 10" />
            </g>
          </svg>
        )}

        {/* Layer 3: Vignette & Soft Gradient Frame */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            isBright
              ? 'bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.4)_100%)]'
              : 'bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(5,8,16,0.6)_100%)]'
          }`}
        />
      </div>

      {/* FLOATING MAXIMALIST GRADIENT THEME CONTROLLER */}
      {showControls && (
        <aside 
          id="maximalist-theme-controls"
          aria-label="Maximalist Theme Controls"
          className="fixed bottom-5 right-5 z-40"
        >
          {isMenuOpen && (
            <div
              className={`mb-3 w-80 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200 ${
                isBright
                  ? 'bg-white/95 border-sky-200 text-slate-900 shadow-sky-500/10'
                  : 'bg-[#0b1224]/95 border-cyan-500/30 text-white shadow-2xl shadow-cyan-950/50'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{palette.badgeEmoji}</span>
                  <div>
                    <h4 className="text-xs font-black uppercase tracking-wider">
                      Gradient Maximalism
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      Multi-stop atmospheric gradient meshes
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 p-1 rounded-md"
                >
                  ✕
                </button>
              </div>

              {/* 4 Maximalist Palettes */}
              <div className="mt-3 space-y-2">
                <label className="text-[10px] font-mono uppercase font-bold text-slate-400">
                  Select Gradient Atmosphere
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(PALETTES) as GradientPreset[]).map((key) => {
                    const item = PALETTES[key];
                    const isSelected = activePreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          setActivePreset(key);
                          sound.playBlip(750);
                        }}
                        className={`p-2.5 rounded-xl text-left transition-all border relative overflow-hidden ${
                          isSelected
                            ? isBright
                              ? 'border-sky-500 ring-2 ring-sky-400/40 bg-sky-50/80 shadow-xs'
                              : 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                            : isBright
                              ? 'border-slate-200 hover:bg-slate-50'
                              : 'border-slate-800 hover:bg-slate-900/60'
                        }`}
                      >
                        {/* Gradient preview bar */}
                        <div
                          className={`h-2 rounded-full w-full bg-gradient-to-r ${item.previewGradient} mb-1.5 shadow-xs`}
                        />
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1">
                            <span>{item.badgeEmoji}</span>
                            <span className="truncate">{item.name}</span>
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {item.tagline}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Intensity Controls */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    Color Bloom Intensity
                  </span>
                  <span className="text-[10px] font-mono font-bold capitalize text-sky-500">
                    {intensity}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/80">
                  {(['ultra', 'vibrant', 'subtle'] as GradientIntensity[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setIntensity(level);
                        sound.playBlip(680);
                      }}
                      className={`py-1 text-[11px] font-bold rounded-lg capitalize transition-all ${
                        intensity === level
                          ? isBright
                            ? 'bg-white text-sky-600 shadow-xs'
                            : 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Isobar & Radar Overlay Toggle */}
              <div className="mt-3 pt-2.5 flex items-center justify-between text-xs">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  Isobars & Radar Rings
                </span>
                <button
                  onClick={() => {
                    setShowOverlays(!showOverlays);
                    sound.playBlip(600);
                  }}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all ${
                    showOverlays
                      ? isBright
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                      : isBright
                        ? 'bg-slate-100 text-slate-500 border-slate-300'
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {showOverlays ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  <span>{showOverlays ? 'Visible' : 'Hidden'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Floating Launcher Trigger Pill */}
          <button
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              sound.playBlip(700);
            }}
            className={`group flex items-center gap-2 px-3.5 py-2 rounded-full font-bold text-xs shadow-xl border backdrop-blur-md transition-all hover:scale-105 active:scale-95 ${
              isBright
                ? 'bg-white/90 hover:bg-white text-slate-800 border-sky-200 shadow-sky-500/15'
                : 'bg-[#0d1629]/90 hover:bg-[#121f3a] text-cyan-300 border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.25)]'
            }`}
            title="Configure Gradient Maximalist Background Theme"
          >
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${palette.previewGradient} animate-pulse`} />
            <span className="text-base leading-none">{palette.badgeEmoji}</span>
            <span className="hidden sm:inline font-mono tracking-tight font-extrabold">
              Gradient: {palette.name}
            </span>
            <Palette className="w-3.5 h-3.5 text-sky-400 group-hover:rotate-12 transition-transform" />
          </button>
        </aside>
      )}
    </>
  );
};
