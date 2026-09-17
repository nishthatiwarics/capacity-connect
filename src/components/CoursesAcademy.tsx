import React, { useState } from 'react';
import { 
  BookOpen, 
  Radio, 
  Satellite, 
  Cpu, 
  Zap, 
  CloudRain, 
  CheckCircle2, 
  Clock, 
  Star, 
  Award, 
  Plus, 
  Play, 
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { Course } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface CoursesAcademyProps {
  courses: Course[];
  onOpenCertificate: (course: Course) => void;
  onAwardXP: (amount: number, reason: string) => void;
  onAddCourse: (course: Course) => void;
  currentRole?: string;
}

export const CoursesAcademy: React.FC<CoursesAcademyProps> = ({
  courses,
  onOpenCertificate,
  onAwardXP,
  onAddCourse,
  currentRole = 'Trainee',
}) => {
  const { isBright } = useTheme();
  const isTrainerOrAdmin = currentRole === 'Trainer' || currentRole === 'Admin';
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const [activeQuizCourse, setActiveQuizCourse] = useState<Course | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState<boolean>(false);

  // New course form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Course['category']>('Radar & Doppler');
  const [newLevel, setNewLevel] = useState<Course['level']>('Intermediate');
  const [newHours, setNewHours] = useState(30);
  const [newDesc, setNewDesc] = useState('');

  const categories = [
    'All',
    'Radar & Doppler',
    'Satellite Meteorology',
    'NWP & AI',
    'Severe Weather',
    'Monsoon Dynamics',
  ];

  const filteredCourses = selectedCategory === 'All'
    ? courses
    : courses.filter((c) => c.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Radar & Doppler':
        return <Radio className="w-4 h-4 text-cyan-400" />;
      case 'Satellite Meteorology':
        return <Satellite className="w-4 h-4 text-blue-400" />;
      case 'NWP & AI':
        return <Cpu className="w-4 h-4 text-purple-400" />;
      case 'Severe Weather':
        return <Zap className="w-4 h-4 text-amber-400" />;
      default:
        return <CloudRain className="w-4 h-4 text-emerald-400" />;
    }
  };

  const handleLaunchQuiz = (course: Course) => {
    sound.playBlip(700);
    setActiveQuizCourse(course);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const handleQuizAnswerSubmit = () => {
    if (selectedQuizAnswer === null || !activeQuizCourse) return;

    setQuizSubmitted(true);
    const isCorrect = selectedQuizAnswer === activeQuizCourse.quiz.correctIndex;

    if (isCorrect) {
      sound.playSuccess();
      onAwardXP(activeQuizCourse.xpReward, `Passed Course Assessment: ${activeQuizCourse.title}`);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00f5d4', '#38bdf8', '#fbbf24'],
      });
    } else {
      sound.playAlert();
    }
  };

  const handleCreateCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Course = {
      id: `c-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      level: newLevel,
      durationHours: Number(newHours) || 24,
      enrolledCount: 1,
      rating: 5.0,
      completionRate: 0,
      xpReward: 700,
      iconName: 'BookOpen',
      description: newDesc || 'Specialized workforce curriculum developed for India Meteorological Department operations.',
      instructor: 'Admin HQ Curriculum Committee',
      modules: [
        { id: 'm1', title: 'Module 1: Operational Meteorological Guidelines', durationMinutes: 60, completed: false },
        { id: 'm2', title: 'Module 2: Real-time Analysis & Warning Bulletins', durationMinutes: 90, completed: false },
      ],
      quiz: {
        question: `What is the primary operational mandate for ${newTitle}?`,
        options: [
          'Immediate verification against dual-polarization radar & satellite observations',
          'Delaying advisory publication until next synoptic hour',
          'Discarding numerical weather model guidance',
          'Manual calculation without computational systems',
        ],
        correctIndex: 0,
        explanation: 'All IMD operational bulletins mandate multi-source verification using radar, satellite, and ground telemetry.',
      },
    };

    onAddCourse(created);
    sound.playSuccess();
    setIsNewCourseModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title & Add Course */}
      <div className={`border rounded-2xl p-4 lg:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
        isBright 
          ? 'bg-white border-slate-200 shadow-sm' 
          : 'bg-[#0b1220] border-cyan-900/40 shadow-xl'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-lg font-bold tracking-tight ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              Meteorological Academy & Curriculum Matrix
            </h2>
            <span className={`px-2 py-0.5 text-[10px] font-mono uppercase font-bold rounded-full border ${
              isBright 
                ? 'bg-slate-100 text-black border-slate-300' 
                : 'bg-black text-white border-neutral-700'
            }`}>
              WMO Standards
            </span>
          </div>
          <p className={`text-xs ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
            Interactive micro-credentials, simulation assessments, and automated accreditation certificates
          </p>
        </div>

        {isTrainerOrAdmin ? (
          <button
            type="button"
            onClick={() => {
              sound.playBlip(700);
              setIsNewCourseModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 font-bold text-xs rounded-xl transition-all shadow-md shrink-0 self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white cursor-pointer active:scale-95"
            title="Faculty Publishing: Create and publish a new accredited course"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Publish New Course</span>
            <span className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono">Faculty</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-900 text-xs font-medium self-start sm:self-auto shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cadet Enrolled Catalog</span>
          </div>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              sound.playBlip(600);
              setSelectedCategory(cat);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-black text-white border-black shadow-xs font-bold'
                : isBright
                  ? 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-black'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className={`border rounded-2xl p-5 shadow-xs transition-all hover:-translate-y-1 flex flex-col justify-between group ${
              isBright
                ? 'bg-white border-slate-200 hover:border-black hover:shadow-md'
                : 'bg-[#0b1220] border-slate-800 hover:border-neutral-500 shadow-xl'
            }`}
          >
            <div>
              {/* Header tags */}
              <div className="flex items-center justify-between gap-2">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 border rounded-lg text-xs font-mono font-medium ${
                  isBright 
                    ? 'bg-slate-50 border-slate-200 text-black' 
                    : 'bg-slate-900 border-slate-800 text-white'
                }`}>
                  {getCategoryIcon(course.category)}
                  <span className="text-[11px] truncate max-w-[130px] font-semibold">{course.category}</span>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                  isBright 
                    ? 'bg-amber-100 border-amber-300 text-amber-800' 
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  +{course.xpReward} XP
                </span>
              </div>

              {/* Title & Description */}
              <h3 className={`text-base font-bold mt-3 transition-colors line-clamp-2 leading-snug ${
                isBright 
                  ? 'text-slate-900 group-hover:text-black' 
                  : 'text-white group-hover:text-neutral-200'
              }`}>
                {course.title}
              </h3>
              <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${
                isBright ? 'text-slate-600' : 'text-slate-400'
              }`}>
                {course.description}
              </p>

              {/* Modules list snippet */}
              <div className={`mt-4 pt-3 border-t space-y-1.5 ${
                isBright ? 'border-slate-100' : 'border-slate-800/80'
              }`}>
                <div className={`flex items-center justify-between text-[11px] font-mono ${
                  isBright ? 'text-slate-500' : 'text-slate-400'
                }`}>
                  <span>CURRICULUM SYLLABUS</span>
                  <span>{course.modules.length} Modules</span>
                </div>
                {course.modules.slice(0, 2).map((mod) => (
                  <div key={mod.id} className={`flex items-center gap-2 text-xs ${
                    isBright ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${mod.completed ? 'bg-emerald-500' : isBright ? 'bg-slate-300' : 'bg-slate-600'}`} />
                    <span className="truncate">{mod.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Meta & Action Buttons */}
            <div className={`mt-5 pt-3 border-t ${isBright ? 'border-slate-100' : 'border-slate-800'}`}>
              <div className={`flex items-center justify-between text-xs font-mono mb-3 ${
                isBright ? 'text-slate-500' : 'text-slate-400'
              }`}>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {course.durationHours} hrs
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {course.rating} ({course.enrolledCount} enrolled)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLaunchQuiz(course)}
                  className={`flex-1 py-2 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                    isBright
                      ? 'bg-slate-100 hover:bg-black hover:text-white border-slate-200 text-black shadow-2xs'
                      : 'bg-slate-800 hover:bg-black hover:text-white border-slate-700 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Take Assessment</span>
                </button>

                <button
                  onClick={() => {
                    sound.playSuccess();
                    onOpenCertificate(course);
                  }}
                  className={`p-2 border rounded-xl transition-colors ${
                    isBright
                      ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-amber-600'
                      : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-amber-400'
                  }`}
                  title="View / Issue IMD Certificate"
                >
                  <Award className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Assessment / Quiz Modal */}
      {activeQuizCourse && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200 ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/60'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded border ${
                  isBright ? 'bg-slate-100 text-black border-slate-300' : 'bg-black text-white border-neutral-700'
                }`}>
                  {activeQuizCourse.category} • Knowledge Check
                </span>
                <h3 className={`text-base font-bold mt-1 ${isBright ? 'text-slate-900' : 'text-white'}`}>
                  {activeQuizCourse.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveQuizCourse(null)}
                className={`text-lg p-1 cursor-pointer ${isBright ? 'text-slate-400 hover:text-black' : 'text-slate-400 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            <div className={`p-4 border rounded-xl space-y-3 ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5 text-black" />
                <p className={`text-sm font-semibold leading-snug ${isBright ? 'text-slate-800' : 'text-slate-100'}`}>
                  {activeQuizCourse.quiz.question}
                </p>
              </div>

              <div className="space-y-2 mt-3">
                {activeQuizCourse.quiz.options.map((opt, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isCorrect = idx === activeQuizCourse.quiz.correctIndex;
                  let btnStyle = isBright 
                    ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100' 
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (quizSubmitted) {
                    if (isCorrect) {
                      btnStyle = isBright 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold' 
                        : 'bg-emerald-950/60 border-emerald-600 text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = isBright
                        ? 'bg-rose-50 border-rose-400 text-rose-800'
                        : 'bg-rose-950/60 border-rose-600 text-rose-200';
                    }
                  } else if (isSelected) {
                    btnStyle = isBright 
                      ? 'bg-black text-white border-black font-semibold' 
                      : 'bg-white text-black border-white font-semibold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={quizSubmitted}
                      onClick={() => {
                        sound.playBlip(600);
                        setSelectedQuizAnswer(idx);
                      }}
                      className={`w-full p-3 text-left text-xs rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono font-bold shrink-0 text-[10px]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className={`p-3 rounded-xl border text-xs space-y-1 ${
                  selectedQuizAnswer === activeQuizCourse.quiz.correctIndex
                    ? isBright ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                    : isBright ? 'bg-rose-50 border-rose-300 text-rose-900' : 'bg-rose-950/40 border-rose-700 text-rose-300'
                }`}>
                  <p className="font-bold">
                    {selectedQuizAnswer === activeQuizCourse.quiz.correctIndex
                      ? `Correct! +${activeQuizCourse.xpReward} XP earned`
                      : 'Incorrect. Review meteorological standard explanation:'}
                  </p>
                  <p className={`text-[11px] leading-relaxed ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
                    {activeQuizCourse.quiz.explanation}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizAnswerSubmit}
                  disabled={selectedQuizAnswer === null}
                  className="px-4 py-2 disabled:opacity-50 font-bold text-xs rounded-xl transition-all shadow-xs bg-black hover:bg-neutral-800 text-white cursor-pointer"
                >
                  Submit Answer
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onOpenCertificate(activeQuizCourse);
                      setActiveQuizCourse(null);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Award className="w-4 h-4" />
                    <span>Generate Certificate</span>
                  </button>
                  <button
                    onClick={() => setActiveQuizCourse(null)}
                    className={`px-4 py-2 text-xs font-semibold rounded-xl border ${
                      isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-transparent'
                    }`}
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin New Course Creator Modal */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`border rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/60'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
              <h3 className={`text-base font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                Publish New IMD Training Module
              </h3>
              <button
                onClick={() => setIsNewCourseModalOpen(false)}
                className={`text-lg p-1 ${isBright ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-3 text-xs">
              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>COURSE TITLE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Cyclone Warning Systems & Doppler Radar"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>CATEGORY</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Course['category'])}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                      isBright 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                        : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                    }`}
                  >
                    <option value="Radar & Doppler">Radar & Doppler</option>
                    <option value="Satellite Meteorology">Satellite Meteorology</option>
                    <option value="NWP & AI">NWP & AI</option>
                    <option value="Severe Weather">Severe Weather</option>
                    <option value="Monsoon Dynamics">Monsoon Dynamics</option>
                  </select>
                </div>

                <div>
                  <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>LEVEL</label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as Course['level'])}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                      isBright 
                        ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                        : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                    }`}
                  >
                    <option value="Foundational">Foundational</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Master Specialization">Master Specialization</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>DURATION (HOURS)</label>
                <input
                  type="number"
                  min="4"
                  max="120"
                  value={newHours}
                  onChange={(e) => setNewHours(Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className={`font-mono block mb-1 ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>CURRICULUM SYNOPSIS</label>
                <textarea
                  rows={3}
                  placeholder="Describe operational objectives, Doppler methodologies, and forecast standard operating procedures..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-hidden ${
                    isBright 
                      ? 'bg-slate-50 border-slate-300 text-slate-900 focus:border-sky-500' 
                      : 'bg-slate-900 border-slate-800 text-white focus:border-cyan-500'
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-3 border-t ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
                <button
                  type="button"
                  onClick={() => setIsNewCourseModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border ${
                    isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold rounded-xl shadow-xs bg-black hover:bg-neutral-800 text-white cursor-pointer"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
