import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Video, 
  FileText, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2,
  AlertCircle
} from 'lucide-react';
import { DemoLecture, DemoLectureChapter } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface UploadDemoLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishLecture: (lecture: DemoLecture) => void;
  teacherName?: string;
  teacherTitle?: string;
  teacherAvatar?: string;
}

export const UploadDemoLectureModal: React.FC<UploadDemoLectureModalProps> = ({
  isOpen,
  onClose,
  onPublishLecture,
  teacherName = 'Dr. Someshwar Rao',
  teacherTitle = 'Lead Doppler Radar Faculty (CTI Pune)',
  teacherAvatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
}) => {
  const { isBright } = useTheme();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DemoLecture['category']>('Radar Meteorology');
  const [durationMinutes, setDurationMinutes] = useState(35);
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [slidesFileName, setSlidesFileName] = useState('Doppler_Lecture_Notes_IMD.pdf');
  const [thumbnailUrl, setThumbnailUrl] = useState(
    'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=600&auto=format&fit=crop&q=80'
  );

  const [chapters, setChapters] = useState<DemoLectureChapter[]>([
    { title: 'Radar Fundamentals & Echo Formation', timestamp: '00:00' },
    { title: 'Doppler Velocity De-aliasing Demo', timestamp: '10:15' },
    { title: 'Real-time Case Analysis & Summary', timestamp: '24:30' },
  ]);

  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTime, setNewChapterTime] = useState('');

  if (!isOpen) return null;

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setUploadedFileName(file.name);
      sound.playBlip(750, 0.05);
    }
  };

  const handleAddChapter = () => {
    if (!newChapterTitle.trim()) return;
    const time = newChapterTime.trim() || '15:00';
    setChapters((prev) => [...prev, { title: newChapterTitle.trim(), timestamp: time }]);
    setNewChapterTitle('');
    setNewChapterTime('');
    sound.playBlip(650, 0.03);
  };

  const handleRemoveChapter = (index: number) => {
    setChapters((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newLecture: DemoLecture = {
      id: `lec-${Date.now()}`,
      teacherId: 'teach-01',
      teacherName,
      teacherTitle,
      teacherAvatar,
      title: title.trim(),
      category,
      durationMinutes: Number(durationMinutes) || 30,
      description: description.trim() || 'Interactive free demo lecture covering operational meteorological interpretation.',
      videoUrl: videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnailUrl,
      slidesFileName,
      views: 1,
      likes: 0,
      rating: 5.0,
      createdAt: 'Just now',
      isFreeDemo: true,
      chapters,
    };

    sound.playSuccess();
    onPublishLecture(newLecture);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all ${
          isBright
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#0b1222] border-cyan-500/40 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Modal Top Bar */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                  IMD Teacher Studio
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded font-bold">
                  100% Free Video Hosting
                </span>
              </div>
              <h2 className="text-sm font-bold tracking-tight">
                Publish Free Demo Video Lecture
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBright ? 'hover:bg-slate-200 border-slate-300 text-slate-600' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          {/* Free Banner */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 text-xs ${
            isBright
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
              : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
          }`}>
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-500 mt-0.5" />
            <div>
              <span className="font-bold">Zero Cost for Instructors & Trainees:</span> Demo lectures uploaded here are instantly accessible across the nationwide Doppler command network, empowering trainee forecasters and showcasing your teaching pedagogy for recruitment.
            </div>
          </div>

          {/* Lecture Title */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Lecture Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Polarimetric Dual-Pol Doppler: ZDR & KDP Analysis"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isBright ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}
            />
          </div>

          {/* Category & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Discipline / Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DemoLecture['category'])}
                className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                  isBright ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                }`}
              >
                <option value="Radar Meteorology">Radar Meteorology</option>
                <option value="Cyclone Dynamics">Cyclone Dynamics</option>
                <option value="Severe Weather Nowcasting">Severe Weather Nowcasting</option>
                <option value="Satellite & NWP">Satellite & NWP</option>
                <option value="Agro-Meteorology">Agro-Meteorology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Duration (Minutes)</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="number"
                  min="5"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isBright ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Video Source Option */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Video File Upload or Stream URL
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* File Upload Box */}
              <label className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isBright
                  ? 'border-slate-300 hover:border-sky-500 bg-slate-50/50'
                  : 'border-slate-700 hover:border-cyan-500 bg-slate-900/50'
              }`}>
                <Upload className="w-5 h-5 text-sky-500 mb-1" />
                <span className="text-xs font-semibold">
                  {uploadedFileName ? uploadedFileName : 'Choose Video File (MP4, WebM)'}
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  Drag and drop or browse device
                </span>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/ogg"
                  onChange={handleVideoFileUpload}
                  className="hidden"
                />
              </label>

              {/* Direct Stream / Video URL */}
              <div className="flex flex-col justify-center">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1">
                  Or enter video stream / cloud link:
                </span>
                <input
                  type="url"
                  placeholder="https://.../video.mp4"
                  value={videoUrl}
                  onChange={(e) => {
                    setVideoUrl(e.target.value);
                    setUploadedFileName(null);
                  }}
                  className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                    isBright ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1">
              Lecture Summary & Syllabus Objectives
            </label>
            <textarea
              rows={3}
              placeholder="Detail the radar signatures, WMO standards, or meteorological principles explored in this lecture..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-2.5 rounded-lg border text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                isBright ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-slate-900 border-slate-700 text-slate-100'
              }`}
            />
          </div>

          {/* Chapters & Timestamps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold">Chapters & Key Radar Signatures</label>
              <span className="text-[11px] text-slate-400">Interactive bookmarks</span>
            </div>

            <div className="space-y-2 mb-2">
              {chapters.map((ch, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg border text-xs ${
                    isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <span className="font-medium">{ch.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-sky-600 dark:text-cyan-400">
                      {ch.timestamp}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChapter(idx)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Chapter Row */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="New Chapter Title (e.g., VAD Wind Profiler Analysis)"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                className={`flex-1 p-2 rounded-lg border text-xs ${
                  isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              />
              <input
                type="text"
                placeholder="12:45"
                value={newChapterTime}
                onChange={(e) => setNewChapterTime(e.target.value)}
                className={`w-20 p-2 rounded-lg border text-xs font-mono ${
                  isBright ? 'bg-slate-50 border-slate-300' : 'bg-slate-900 border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={handleAddChapter}
                className="px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors ${
                isBright ? 'hover:bg-slate-100 border-slate-300' : 'hover:bg-slate-800 border-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md ${
                isBright
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] font-extrabold'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Publish Demo Lecture For Free</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
