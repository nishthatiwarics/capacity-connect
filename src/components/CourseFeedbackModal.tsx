import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  Sparkles, 
  Shield 
} from 'lucide-react';
import { CourseFeedbackSubmission, Course } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface CourseFeedbackModalProps {
  courseTitle?: string;
  courseId?: string;
  coursesList?: Course[];
  traineeName: string;
  traineeStation: string;
  onClose: () => void;
  onSubmitFeedback: (feedback: CourseFeedbackSubmission) => void;
}

export const CourseFeedbackModal: React.FC<CourseFeedbackModalProps> = ({
  courseTitle = 'Polarimetric Doppler Weather Radar (DWR) Masterclass',
  courseId = 'crs-1',
  coursesList = [],
  traineeName,
  traineeStation,
  onClose,
  onSubmitFeedback
}) => {
  const { isBright } = useTheme();
  const [selectedCourseTitle, setSelectedCourseTitle] = useState(courseTitle);
  const [overallRating, setOverallRating] = useState(5);
  const [contentQuality, setContentQuality] = useState(5);
  const [trainerEffectiveness, setTrainerEffectiveness] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    sound.playSuccess();

    const submission: CourseFeedbackSubmission = {
      id: `cf-${Date.now()}`,
      courseId,
      courseTitle: selectedCourseTitle,
      traineeName: isAnonymous ? 'Anonymous Cadet Forecaster' : traineeName,
      traineeStation: isAnonymous ? 'Station Confidential' : traineeStation,
      overallRating,
      contentQuality,
      trainerEffectiveness,
      feedbackText: feedbackText.trim(),
      suggestions: suggestions.trim() || 'Nil',
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isAnonymous
    };

    onSubmitFeedback(submission);
    setSubmittedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className={`relative w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
        isBright ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#0b1329] border-cyan-900/60 text-white'
      }`}>
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg">
              ⭐
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                SIH Quality Assurance
              </span>
              <h3 className="text-sm font-extrabold text-slate-900">
                Course & Training Content Feedback
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
              ✓
            </div>
            <h4 className="text-base font-bold text-slate-900">
              Feedback Submitted Successfully!
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your feedback has been logged to the Central Training Institute quality evaluation board.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Target Course Select */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Select Course / Training Module
              </label>
              <select
                value={selectedCourseTitle}
                onChange={(e) => setSelectedCourseTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                {coursesList.length > 0 ? (
                  coursesList.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Polarimetric Doppler Weather Radar (DWR) Operational Masterclass">
                      Polarimetric Doppler Weather Radar (DWR) Operational Masterclass
                    </option>
                    <option value="High-Resolution Numerical Weather Prediction & WRF Modeling">
                      High-Resolution Numerical Weather Prediction & WRF Modeling
                    </option>
                    <option value="Tropical Cyclone Track & Intensity Forecasting (Dvorak Technique)">
                      Tropical Cyclone Track & Intensity Forecasting (Dvorak Technique)
                    </option>
                    <option value="Severe Convective Storms, Squall Lines & Damini Lightning">
                      Severe Convective Storms, Squall Lines & Damini Lightning
                    </option>
                  </>
                )}
              </select>
            </div>

            {/* Ratings Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="font-bold text-slate-700 block mb-1">Overall Course</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setOverallRating(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= overallRating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="font-bold text-slate-700 block mb-1">Content Clarity</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setContentQuality(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= contentQuality
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="font-bold text-slate-700 block mb-1">Trainer Guidance</span>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTrainerEffectiveness(star)}
                      className="cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          star <= trainerEffectiveness
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Written Feedback */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Your Assessment of Content, Lectures & Practical Drills
              </label>
              <textarea
                required
                rows={3}
                placeholder="Share specific thoughts on lecture materials, clarity of Doppler calculations, or practical utility..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Suggestions for Improvement (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Include more real squall line radar datasets..."
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 text-slate-800"
              />
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded text-sky-600 focus:ring-sky-500"
                />
                <span className="text-slate-600 font-semibold">
                  Submit Anonymously (Hide cadet name from instructor)
                </span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Feedback</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
