import React, { useState } from 'react';
import { 
  Plus, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  FileText, 
  BarChart3, 
  Upload, 
  Play, 
  Download, 
  Trash2, 
  Check, 
  Eye, 
  Award, 
  Video, 
  Sparkles, 
  Send 
} from 'lucide-react';
import { 
  TrainerQuestionnaire, 
  TraineeQuestionnaireSubmission, 
  TrainerQuestionnaireQuestion, 
  DemoLecture 
} from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface TrainerQuestionnaireManagerProps {
  questionnaires: TrainerQuestionnaire[];
  submissions: TraineeQuestionnaireSubmission[];
  trainerName: string;
  demoLectures: DemoLecture[];
  onCreateQuestionnaire: (q: TrainerQuestionnaire) => void;
  onOpenUploadLecture: () => void;
  onOpenUploadMaterial?: () => void;
}

export const TrainerQuestionnaireManager: React.FC<TrainerQuestionnaireManagerProps> = ({
  questionnaires,
  submissions,
  trainerName,
  demoLectures,
  onCreateQuestionnaire,
  onOpenUploadLecture,
  onOpenUploadMaterial
}) => {
  const { isBright } = useTheme();
  const [activeTab, setActiveTab] = useState<'questionnaires' | 'monitoring' | 'library'>('questionnaires');
  const [isCreating, setIsCreating] = useState(false);

  // New Questionnaire Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Radar Meteorology');
  const [deadline, setDeadline] = useState('2026-10-01 18:00');
  const [passingMarks, setPassingMarks] = useState(30);
  const [questions, setQuestions] = useState<TrainerQuestionnaireQuestion[]>([
    {
      id: 'q-1',
      question: 'In polarimetric radar, a high Differential Phase Shift (KDP) with high Reflectivity indicates:',
      options: [
        'Heavy liquid rain with high precipitation water content',
        'Dry snow aggregates aloft',
        'Ground clutter from urban buildings',
        'Refraction through thermal inversion'
      ],
      correctIndex: 0,
      explanation: 'KDP is sensitive specifically to anisotropic liquid water content, unaffected by isotropic hail or calibration attenuation.',
      marks: 10
    }
  ]);

  // Current Question being added
  const [newQText, setNewQText] = useState('');
  const [newOpt0, setNewOpt0] = useState('');
  const [newOpt1, setNewOpt1] = useState('');
  const [newOpt2, setNewOpt2] = useState('');
  const [newOpt3, setNewOpt3] = useState('');
  const [correctOptIdx, setCorrectOptIdx] = useState(0);
  const [newExplanation, setNewExplanation] = useState('');
  const [newMarks, setNewMarks] = useState(10);

  // Uploaded Study Materials in Trainer Library
  const [libraryMaterials, setLibraryMaterials] = useState([
    {
      id: 'mat-1',
      title: 'Operational Handbook: S-Band Polarimetric Radar Calibration',
      type: 'PDF Reference Manual',
      size: '14.8 MB',
      uploadedAt: '3 days ago',
      downloads: 42
    },
    {
      id: 'mat-2',
      title: 'Kalbaishakhi Severe Thunderstorm Dynamics & Squall Line Nowcasting Slides',
      type: 'PPTX Presentation',
      size: '32.1 MB',
      uploadedAt: 'Yesterday',
      downloads: 67
    },
    {
      id: 'mat-3',
      title: 'Python for Meteorology: MetPy Sounding & Tephigram Script Pack',
      type: 'Jupyter & Python Pack',
      size: '4.2 MB',
      uploadedAt: 'Just now',
      downloads: 19
    }
  ]);

  const handleAddQuestionToDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQText.trim() || !newOpt0.trim() || !newOpt1.trim()) return;
    sound.playSuccess();
    const newQ: TrainerQuestionnaireQuestion = {
      id: `q-${Date.now()}`,
      question: newQText.trim(),
      options: [newOpt0.trim(), newOpt1.trim(), newOpt2.trim() || 'Option 3', newOpt3.trim() || 'Option 4'],
      correctIndex: correctOptIdx,
      explanation: newExplanation.trim() || 'Refer to WMO Basic Instructional Package for Meteorologists (BIP-M).',
      marks: Number(newMarks) || 10
    };
    setQuestions([...questions, newQ]);
    setNewQText('');
    setNewOpt0('');
    setNewOpt1('');
    setNewOpt2('');
    setNewOpt3('');
    setNewExplanation('');
  };

  const handleSaveQuestionnaire = () => {
    if (!title.trim() || questions.length === 0) return;
    sound.playSuccess();
    const totalMarks = questions.reduce((acc, q) => acc + q.marks, 0);
    const newQnr: TrainerQuestionnaire = {
      id: `qnr-${Date.now()}`,
      title: title.trim(),
      subject,
      deadline,
      totalMarks,
      passingMarks: Math.min(passingMarks, totalMarks),
      createdBy: trainerName,
      trainerId: 't-1',
      status: 'Active',
      questions,
      submissionsCount: 0,
      averageScore: 0,
      createdAt: new Date().toISOString().substring(0, 10)
    };
    onCreateQuestionnaire(newQnr);
    setIsCreating(false);
    setTitle('');
  };

  const handleUploadMaterialSim = () => {
    const title = prompt('Enter title of presentation or study material:', 'INSAT-3DR Tropical Cyclone Dvorak Technique Guide');
    if (!title) return;
    sound.playSuccess();
    setLibraryMaterials([
      {
        id: `mat-${Date.now()}`,
        title,
        type: 'PDF / Slides Presentation',
        size: '18.4 MB',
        uploadedAt: 'Just now (Verified)',
        downloads: 0
      },
      ...libraryMaterials
    ]);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isBright ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#0b1426] border-cyan-900/40 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center text-2xl shrink-0">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-600 text-white">
                  Trainer Console
                </span>
                <span className="text-xs font-semibold text-emerald-800 font-mono">
                  SIH Problem Statement
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                Questionnaires, Trainee Monitoring & Library Management
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Draft subject questionnaires with explicit deadlines, track trainee submissions & performance, and publish recorded masterclasses & study materials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playBlip(700);
                setIsCreating(true);
                setActiveTab('questionnaires');
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Questionnaire</span>
            </button>
            <button
              onClick={onOpenUploadLecture}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Video className="w-4 h-4 text-sky-400" />
              <span>Upload Lecture</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('questionnaires')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'questionnaires'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Active Questionnaires ({questionnaires.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'monitoring'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Trainee Performance Gradebook ({submissions.length} Submissions)</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'library'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Trainer Library ({libraryMaterials.length + demoLectures.length} Items)</span>
        </button>
      </div>

      {/* TAB 1: QUESTIONNAIRES */}
      {activeTab === 'questionnaires' && (
        <div className="space-y-5">
          {/* Creator Form if opened */}
          {isCreating && (
            <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-300 space-y-4 shadow-sm animate-in fade-in">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-emerald-950 uppercase">
                  Draft New Questionnaire with Deadline
                </h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. S-Band Radar Dual-Pol Quiz"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Radar Meteorology">Radar Meteorology</option>
                    <option value="NWP & Computational Met">NWP & Computational Met</option>
                    <option value="Severe Weather Nowcasting">Severe Weather Nowcasting</option>
                    <option value="Tropical Cyclone Track">Tropical Cyclone Track</option>
                    <option value="Agrometeorology">Agrometeorology</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Submission Deadline</label>
                  <input
                    type="datetime-local"
                    value={deadline.replace(' ', 'T')}
                    onChange={(e) => setDeadline(e.target.value.replace('T', ' '))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Questions List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-700">
                  Questions in Questionnaire ({questions.length})
                </h4>
                {questions.map((q, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-900">Q{idx + 1}: {q.question}</span>
                      <span className="text-emerald-700 font-mono">{q.marks} marks</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Correct: <strong className="text-emerald-800">{q.options[q.correctIndex]}</strong>
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Single Question Form */}
              <form onSubmit={handleAddQuestionToDraft} className="p-4 rounded-xl bg-white border border-emerald-200 space-y-3 text-xs">
                <h5 className="font-bold text-emerald-900">Add Question to Questionnaire</h5>
                <input
                  type="text"
                  required
                  placeholder="Enter question text..."
                  value={newQText}
                  onChange={(e) => setNewQText(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Option A"
                    value={newOpt0}
                    onChange={(e) => setNewOpt0(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Option B"
                    value={newOpt1}
                    onChange={(e) => setNewOpt1(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Option C"
                    value={newOpt2}
                    onChange={(e) => setNewOpt2(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Option D"
                    value={newOpt3}
                    onChange={(e) => setNewOpt3(e.target.value)}
                    className="px-3 py-1.5 border border-slate-200 rounded-lg"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Correct Option:</span>
                    <select
                      value={correctOptIdx}
                      onChange={(e) => setCorrectOptIdx(Number(e.target.value))}
                      className="px-2 py-1 border rounded-lg bg-emerald-50 text-emerald-900 font-bold"
                    >
                      <option value={0}>Option A</option>
                      <option value={1}>Option B</option>
                      <option value={2}>Option C</option>
                      <option value={3}>Option D</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold cursor-pointer"
                  >
                    + Add Question
                  </button>
                </div>
              </form>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveQuestionnaire}
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs cursor-pointer"
                >
                  Publish Questionnaire with Deadline
                </button>
              </div>
            </div>
          )}

          {/* Questionnaires Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questionnaires.map((qnr) => (
              <div
                key={qnr.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-50 text-sky-800 border border-sky-200">
                    {qnr.subject}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                    {qnr.status}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {qnr.title}
                </h4>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1 text-rose-700 font-bold">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {qnr.deadline}
                  </span>
                  <span>•</span>
                  <span>{qnr.questions.length} Questions</span>
                  <span>•</span>
                  <span>{qnr.totalMarks} Marks</span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">
                    Submissions: <strong className="text-emerald-700">{qnr.submissionsCount} Trainees</strong>
                  </span>
                  <span className="font-mono text-slate-500">
                    Avg Score: {qnr.averageScore} / {qnr.totalMarks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MONITORING GRADEBOOK */}
      {activeTab === 'monitoring' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Trainee Participation & Assessment Performance Roster
              </h3>
              <p className="text-xs text-slate-500">
                Real-time assessment scores, completion status, and grading analytics
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {submissions.length} Submissions Logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">Trainee</th>
                  <th className="px-4 py-3">Questionnaire / Assessment</th>
                  <th className="px-4 py-3">Submitted At</th>
                  <th className="px-4 py-3">Score / Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Feedback / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">
                      {sub.traineeName}
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {sub.questionnaireTitle}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">
                      {sub.submittedAt}
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-slate-800">
                      {sub.score} / {sub.totalMarks} ({sub.percentage}%)
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        sub.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {sub.passed ? 'PASSED' : 'RETEST DUE'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 italic text-[11px]">
                      {sub.feedback || 'Satisfactory performance'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TRAINER LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Trainer Library (Recorded Lectures, Presentations & Study Materials)
              </h3>
              <p className="text-xs text-slate-500">
                Files uploaded here are directly accessible to trainees in their learning portal.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleUploadMaterialSim}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Study Material / PPT</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Demo lectures */}
            {demoLectures.map((lec) => (
              <div
                key={lec.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5"
              >
                <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-100">
                  <img src={lec.thumbnailUrl} alt={lec.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                    {lec.durationMinutes} mins
                  </span>
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px]">
                    LECTURE
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {lec.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{lec.views} Cadet Views</span>
                  <span className="font-bold text-sky-700">★ {lec.rating}</span>
                </div>
              </div>
            ))}

            {/* Study materials & presentations */}
            {libraryMaterials.map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 border border-sky-200 flex items-center justify-center text-sm font-bold">
                      📄
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 text-slate-600 font-bold">
                      {mat.size}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 leading-snug">
                    {mat.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Type: {mat.type}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-mono">{mat.uploadedAt}</span>
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      alert(`Downloading "${mat.title}" for offline training.`);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold cursor-pointer flex items-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
