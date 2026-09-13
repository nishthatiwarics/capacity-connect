import React, { useRef } from 'react';
import { Award, CheckCircle2, Download, Printer, ShieldCheck } from 'lucide-react';
import { Course } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface CertificateModalProps {
  course: Course | null;
  recipientName: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  course,
  recipientName,
  onClose,
}) => {
  const { isBright } = useTheme();
  const certRef = useRef<HTMLDivElement | null>(null);

  if (!course) return null;

  const handlePrint = () => {
    sound.playBlip(700);
    window.print();
  };

  const certId = `IMD-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
  const issueDate = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className={`border rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200 ${
        isBright ? 'bg-white border-slate-200' : 'bg-[#0b1220] border-cyan-900/60'
      }`}>
        <div className={`flex items-center justify-between pb-2 border-b ${isBright ? 'border-slate-200' : 'border-slate-800'}`}>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className={`text-sm font-bold uppercase tracking-wider ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Official IMD Competency Accreditation
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`text-lg p-1 ${isBright ? 'text-slate-400 hover:text-slate-700' : 'text-slate-400 hover:text-white'}`}
          >
            ✕
          </button>
        </div>

        {/* Certificate Canvas Frame */}
        <div
          ref={certRef}
          className={`border-4 rounded-xl p-6 sm:p-8 text-center relative overflow-hidden space-y-4 ${
            isBright
              ? 'bg-gradient-to-b from-amber-50/50 via-white to-sky-50/40 border-amber-400 shadow-lg text-slate-800'
              : 'bg-gradient-to-b from-[#0e1628] to-[#070d1a] border-amber-500/40 shadow-inner'
          }`}
        >
          {/* Subtle background seal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Award className="w-80 h-80 text-amber-500" />
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-mono tracking-widest text-amber-600 uppercase font-bold">
              INDIA METEOROLOGICAL DEPARTMENT • MINISTRY OF EARTH SCIENCES
            </p>
            <h2 className={`text-xl sm:text-2xl font-extrabold tracking-wide font-serif ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Certificate of Meteorological Proficiency
            </h2>
            <p className={`text-xs font-mono ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>
              National Workforce Development & Operational Radar Accreditation
            </p>
          </div>

          <div className="py-2">
            <p className={`text-xs italic ${isBright ? 'text-slate-500' : 'text-slate-400'}`}>This is officially conferred upon</p>
            <h3 className={`text-lg sm:text-xl font-bold tracking-wide mt-1 ${isBright ? 'text-sky-800' : 'text-cyan-300'}`}>
              {recipientName || 'Meteorologist Officer'}
            </h3>
            <p className={`text-xs max-w-md mx-auto mt-2 leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-400'}`}>
              for successfully mastering the operational syllabus and practical radar diagnostics in
            </p>
            <h4 className={`text-base font-extrabold mt-1 underline decoration-amber-500/60 decoration-2 underline-offset-4 ${
              isBright ? 'text-slate-900' : 'text-white'
            }`}>
              {course.title}
            </h4>
            <span className={`inline-block px-3 py-0.5 font-mono text-[10px] font-bold rounded-full mt-2 border ${
              isBright 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              Grade: Operational Master Forecaster ({course.xpReward} XP Accredited)
            </span>
          </div>

          <div className={`pt-4 border-t flex items-center justify-between text-xs font-mono ${
            isBright ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'
          }`}>
            <div className="text-left">
              <span className={`block text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>ISSUED BY:</span>
              <span className={`font-semibold ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>{course.instructor}</span>
            </div>
            <div className="flex flex-col items-center">
              <ShieldCheck className={`w-6 h-6 mb-0.5 ${isBright ? 'text-emerald-600' : 'text-emerald-400'}`} />
              <span className={`text-[9px] font-bold ${isBright ? 'text-emerald-700' : 'text-emerald-400'}`}>VERIFIED WMO STANDARD</span>
            </div>
            <div className="text-right">
              <span className={`block text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>ACCREDITATION ID:</span>
              <span className={`font-semibold ${isBright ? 'text-sky-700' : 'text-cyan-400'}`}>{certId}</span>
              <span className={`block text-[10px] ${isBright ? 'text-slate-400' : 'text-slate-500'}`}>{issueDate}</span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 text-xs font-semibold rounded-xl border ${
              isBright ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-transparent'
            }`}
          >
            Close
          </button>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 border ${
                isBright 
                  ? 'bg-sky-50 hover:bg-sky-100 border-sky-300 text-sky-800 shadow-xs' 
                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

