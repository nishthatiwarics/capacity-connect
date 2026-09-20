import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Send, 
  BookOpen 
} from 'lucide-react';
import { TrainerQuestionnaire, TraineeQuestionnaireSubmission } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

interface SubjectWiseMcqAssessmentModalProps {
  questionnaire: TrainerQuestionnaire;
  traineeName: string;
  onClose: () => void;
  onSubmitResults: (submission: TraineeQuestionnaireSubmission) => void;
}

export const SubjectWiseMcqAssessmentModal: React.FC<SubjectWiseMcqAssessmentModalProps> = ({
  questionnaire,
  traineeName,
  onClose,
  onSubmitResults
}) => {
  const { isBright } = useTheme();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(
    new Array(questionnaire.questions.length).fill(-1)
  );
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
  const [traineeFeedback, setTraineeFeedback] = useState('');

  // Countdown timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const currentQ = questionnaire.questions[currentIdx];

  const handleSelectOption = (optIdx: number) => {
    sound.playBlip(700);
    const updated = [...selectedAnswers];
    updated[currentIdx] = optIdx;
    setSelectedAnswers(updated);
  };

  const handleFinalSubmit = () => {
    sound.playSuccess();
    let calculatedMarks = 0;
    questionnaire.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctIndex) {
        calculatedMarks += q.marks;
      }
    });

    const passed = calculatedMarks >= questionnaire.passingMarks;
    setScore(calculatedMarks);
    setIsCompleted(true);

    if (passed) {
      try {
        confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      } catch {}
    }

    const sub: TraineeQuestionnaireSubmission = {
      id: `sub-${Date.now()}`,
      questionnaireId: questionnaire.id,
      questionnaireTitle: questionnaire.title,
      traineeId: 'usr-1',
      traineeName: traineeName,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      score: calculatedMarks,
      totalMarks: questionnaire.totalMarks,
      percentage: Math.round((calculatedMarks / questionnaire.totalMarks) * 100),
      passed,
      answers: selectedAnswers,
      feedback: traineeFeedback
    };

    onSubmitResults(sub);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
        isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0b1329] border-cyan-900/60 text-white'
      }`}>
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-300 text-sky-800 flex items-center justify-center text-lg">
              📝
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                {questionnaire.subject}
              </span>
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {questionnaire.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isCompleted && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-bold ${
                timeLeft < 120 ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!isCompleted ? (
            <>
              {/* Question Navigation Bubbles */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {questionnaire.questions.map((_, idx) => {
                  const isAns = selectedAnswers[idx] !== -1;
                  const isCur = idx === currentIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIdx(idx)}
                      className={`w-8 h-8 rounded-xl font-mono text-xs font-bold shrink-0 transition-all cursor-pointer ${
                        isCur
                          ? 'bg-sky-600 text-white ring-2 ring-sky-400/40 shadow-xs'
                          : isAns
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question */}
              <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Question {currentIdx + 1} of {questionnaire.questions.length}</span>
                  <span className="font-bold text-sky-700">Worth: {currentQ.marks} Marks</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h4>

                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, optIdx) => {
                    const isSelected = selectedAnswers[currentIdx] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-sky-50 border-sky-500 text-sky-950 ring-1 ring-sky-500'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span className="flex-1">{option}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs shrink-0 ${
                          isSelected ? 'bg-sky-600 border-sky-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Pagination & Submit */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-30 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentIdx < questionnaire.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer flex items-center gap-1 shadow-xs"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinalSubmit}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Assessment Now</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Result Screen */
            <div className="text-center py-6 space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center text-4xl shadow-md ${
                score >= questionnaire.passingMarks
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-2 border-amber-300'
              }`}>
                {score >= questionnaire.passingMarks ? '🏆' : '📚'}
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {score >= questionnaire.passingMarks
                    ? 'Assessment Passed with Distinction!'
                    : 'Assessment Completed — Review Recommended'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">
                  Passing Threshold: {questionnaire.passingMarks} / {questionnaire.totalMarks} Marks
                </p>
              </div>

              <div className="max-w-xs mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-mono text-slate-400 block uppercase font-bold">
                  Your Final Score
                </span>
                <span className="text-3xl font-black text-sky-700">
                  {score} / {questionnaire.totalMarks}
                </span>
                <span className="block text-xs font-mono font-bold text-slate-500 mt-0.5">
                  ({Math.round((score / questionnaire.totalMarks) * 100)}% Accuracy)
                </span>
              </div>

              {/* Explanations review */}
              <div className="text-left space-y-3 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                  Question Review & Faculty Explanations:
                </h4>
                {questionnaire.questions.map((q, idx) => {
                  const isCorrect = selectedAnswers[idx] === q.correctIndex;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isCorrect
                          ? 'bg-emerald-50/60 border-emerald-200'
                          : 'bg-rose-50/60 border-rose-200'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-900">Q{idx + 1}: {q.question}</span>
                        <span className={`text-[11px] font-mono font-bold ${
                          isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px]">
                        <strong>Faculty Key:</strong> {q.options[q.correctIndex]}
                      </p>
                      <p className="text-slate-500 text-[11px] italic">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
