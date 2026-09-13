import React, { useState, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Download, 
  ThumbsUp, 
  Star, 
  Clock, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  Share2,
  Award
} from 'lucide-react';
import { DemoLecture } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface VideoPlayerModalProps {
  lecture: DemoLecture | null;
  isOpen: boolean;
  onClose: () => void;
  onAwardXP?: (amount: number, reason: string) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  lecture,
  isOpen,
  onClose,
  onAwardXP,
}) => {
  const { isBright } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(lecture ? lecture.likes : 0);

  if (!isOpen || !lecture) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
      sound.playBlip(700, 0.05);
    }
  };

  const handleSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      sound.playBlip(600 + speed * 100, 0.03);
    }
  };

  const handleSeekChapter = (timestamp: string) => {
    if (!videoRef.current) return;
    const parts = timestamp.split(':').map(Number);
    let seconds = 0;
    if (parts.length === 2) {
      seconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    videoRef.current.currentTime = seconds;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
    sound.playBlip(750, 0.04);
  };

  const handleMarkComplete = () => {
    if (hasCompleted) return;
    setHasCompleted(true);
    sound.playSuccess();
    if (onAwardXP) {
      onAwardXP(75, `Completed lecture: "${lecture.title}"`);
    }
  };

  const handleLike = () => {
    if (liked) {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } else {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
      sound.playBlip(880, 0.06);
    }
  };

  const handleDownloadNotes = () => {
    sound.playBlip(700);
    const content = `# IMD Doppler Academy — Lecture Summary & Technical Monograph
Title: ${lecture.title}
Instructor: ${lecture.teacherName} (${lecture.teacherTitle})
Category: ${lecture.category}
Duration: ${lecture.durationMinutes} Minutes
Rating: ${lecture.rating} / 5.0 (WMO Training Standards)

## Abstract & Operational Guidance:
${lecture.description}

## Syllabus & Key Timestamps:
${lecture.chapters.map((c) => `- [${c.timestamp}] ${c.title}`).join('\n')}

---
Verified by India Meteorological Department (MoES), Government of India.
`;
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${lecture.title.replace(/\s+/g, '_')}_Lecture_Notes.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all ${
          isBright
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#0b1222] border-cyan-500/40 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className={`px-5 py-3.5 flex items-center justify-between border-b ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded ${
              isBright ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
            }`}>
              Free Demo Lecture
            </span>
            <span className="text-xs font-semibold truncate max-w-xs sm:max-w-md">
              {lecture.category}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadNotes}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                isBright
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
              title="Download technical notes & syllabus"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lecture Notes</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg border transition-colors ${
                isBright ? 'hover:bg-slate-200 border-slate-300 text-slate-600' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Box */}
        <div className="relative bg-black aspect-video w-full max-h-[420px] overflow-hidden flex items-center justify-center group">
          <video
            ref={videoRef}
            src={lecture.videoUrl}
            poster={lecture.thumbnailUrl}
            className="w-full h-full object-contain"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => {
              setIsPlaying(false);
              handleMarkComplete();
            }}
            controls
          />
        </div>

        {/* Video Controls and Speed Pill Bar */}
        <div className={`px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 border-b text-xs ${
          isBright ? 'bg-slate-100/70 border-slate-200 text-slate-600' : 'bg-[#0e1628] border-slate-800 text-slate-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px]">Speed:</span>
            {[0.75, 1, 1.25, 1.5, 2].map((sp) => (
              <button
                key={sp}
                onClick={() => handleSpeedChange(sp)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold transition-all ${
                  playbackSpeed === sp
                    ? isBright
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-cyan-500 text-slate-950 shadow-sm'
                    : isBright
                      ? 'bg-white hover:bg-slate-200 border border-slate-200 text-slate-700'
                      : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300'
                }`}
              >
                {sp}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                liked
                  ? 'bg-rose-500/15 border-rose-500/50 text-rose-500'
                  : isBright
                    ? 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${liked ? 'fill-rose-500' : ''}`} />
              <span>{likeCount}</span>
            </button>

            <button
              onClick={handleMarkComplete}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                hasCompleted
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isBright
                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sm'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{hasCompleted ? 'Completed (+75 XP)' : 'Mark Completed (+75 XP)'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Info & Chapters */}
        <div className="p-5 overflow-y-auto max-h-[320px] space-y-4">
          <div>
            <h2 className={`text-lg font-bold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
              {lecture.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs">
              <span className="font-semibold text-sky-600 dark:text-cyan-400">
                {lecture.teacherName}
              </span>
              <span className={isBright ? 'text-slate-400' : 'text-slate-600'}>•</span>
              <span className={isBright ? 'text-slate-600' : 'text-slate-300'}>{lecture.teacherTitle}</span>
              <span className={isBright ? 'text-slate-400' : 'text-slate-600'}>•</span>
              <span className="flex items-center gap-1 text-amber-500 font-semibold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {lecture.rating} Rating
              </span>
              <span className={isBright ? 'text-slate-400' : 'text-slate-600'}>•</span>
              <span className="font-mono text-[11px] text-slate-400">{lecture.views} Trainee Views</span>
            </div>
          </div>

          <p className={`text-xs leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
            {lecture.description}
          </p>

          {/* Chapters / Timeline Scrubber */}
          {lecture.chapters && lecture.chapters.length > 0 && (
            <div className={`p-3.5 rounded-xl border ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a]/80 border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-2.5">
                <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                <span className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-slate-800' : 'text-slate-200'}`}>
                  Lecture Chapters & Radar Signatures
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {lecture.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSeekChapter(ch.timestamp)}
                    className={`flex items-center justify-between p-2 rounded-lg text-left text-xs transition-all border ${
                      isBright
                        ? 'bg-white hover:bg-sky-50 hover:border-sky-300 border-slate-200 text-slate-800'
                        : 'bg-[#131e36] hover:bg-[#182645] hover:border-cyan-500/50 border-slate-700/60 text-slate-200'
                    }`}
                  >
                    <span className="font-medium truncate pr-2">{ch.title}</span>
                    <span className={`px-1.5 py-0.5 font-mono text-[10px] rounded shrink-0 ${
                      isBright ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-cyan-300'
                    }`}>
                      {ch.timestamp}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
