import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Briefcase, 
  Award, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  Radio, 
  Mail, 
  Phone, 
  Star, 
  Send, 
  FileCheck,
  Building,
  Sparkles
} from 'lucide-react';
import { TeacherProfile } from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface TeacherResumeModalProps {
  teacher: TeacherProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onRecruitTeacher?: (teacherId: string, offerMessage: string) => void;
  currentUserRole?: string;
}

export const TeacherResumeModal: React.FC<TeacherResumeModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onRecruitTeacher,
  currentUserRole,
}) => {
  const { isBright } = useTheme();
  const [showRecruitOfferBox, setShowRecruitOfferBox] = useState(false);
  const [offerStation, setOfferStation] = useState('Central Training Institute, Pune');
  const [offerRole, setOfferRole] = useState('Senior Doppler Weather Radar Faculty');
  const [offerMessage, setOfferMessage] = useState(
    'We are delighted to extend a formal invitation for this faculty opening based on your Doppler radar publications and WMO instruction credentials.'
  );
  const [offerSent, setOfferSent] = useState(false);

  if (!isOpen || !teacher) return null;

  const handleSendOffer = () => {
    sound.playSuccess();
    setOfferSent(true);
    if (onRecruitTeacher) {
      onRecruitTeacher(teacher.id, `${offerRole} at ${offerStation}`);
    }
  };

  const handleDownloadCV = () => {
    sound.playBlip(700);
    const cvText = `===================================================================
INDIA METEOROLOGICAL DEPARTMENT — FACULTY & SCIENTIST CURRICULUM VITAE
Ministry of Earth Sciences, Government of India
===================================================================

NAME: ${teacher.name}
DESIGNATION: ${teacher.title}
DEPARTMENT: ${teacher.department}
INSTITUTION: ${teacher.institution}
EMAIL: ${teacher.email}
PHONE: ${teacher.phone || 'Available upon formal request'}

ACADEMIC QUALIFICATIONS:
- Highest Degree: ${teacher.highestDegree}
- Specialization: ${teacher.qualification}
- Total Instructional & Research Experience: ${teacher.experienceYears} Years

WMO RECOGNIZED SPECIALIZATIONS:
${teacher.specializations.map((s) => `• ${s}`).join('\n')}

RADAR HARDWARE & LABORATORY PROFICIENCY:
${teacher.radarHardwareExperience.map((r) => `• ${r}`).join('\n')}

SELECTED PEER-REVIEWED SCIENTIFIC PUBLICATIONS (${teacher.publicationsCount} Total):
${teacher.topPublications.map((p, i) => `[${i + 1}] ${p}`).join('\n\n')}

INSTRUCTIONAL RECORD:
- Active Trainees Mentored: ${teacher.studentsTrained}+
- Faculty Instructional Rating: ${teacher.rating} / 5.0
- Current Recruitment Status: ${teacher.recruitmentStatus}

BIOGRAPHICAL STATEMENT & TEACHING PHILOSOPHY:
${teacher.bio}

===================================================================
Verified by Capacity Connect MoES Meteorological Faculty Registry.
Generated on: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
===================================================================
`;
    const blob = new Blob([cvText], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${teacher.name.replace(/\s+/g, '_')}_IMD_Faculty_CV.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden border shadow-2xl transition-all ${
          isBright
            ? 'bg-white border-slate-200 text-slate-900'
            : 'bg-[#0b1222] border-cyan-500/40 text-slate-100 shadow-[0_0_40px_rgba(6,182,212,0.2)]'
        }`}
      >
        {/* Header with Official IMD / MoES Bar */}
        <div className={`px-6 py-4 flex items-center justify-between border-b ${
          isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500/20 to-blue-600/30 border border-sky-400/40 flex items-center justify-center text-sky-600 dark:text-cyan-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-sky-600 dark:text-cyan-400">
                  MoES / IMD Faculty Registry
                </span>
                <span className="px-1.5 py-0.2 text-[9px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded">
                  Verified Scientist
                </span>
              </div>
              <h2 className="text-sm font-bold tracking-tight">
                Verified Faculty Curriculum Vitae (CV)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadCV}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                isBright
                  ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CV</span>
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

        {/* Scrollable CV Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] space-y-6">
          {/* Top Profile Card */}
          <div className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
            isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0f192e] border-slate-800'
          }`}>
            <div className="flex items-center gap-4">
              <img
                src={teacher.avatar}
                alt={teacher.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-sm"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight">{teacher.name}</h3>
                  {teacher.verifiedBadge && (
                    <CheckCircle2 className="w-4 h-4 text-sky-500" title="IMD Verified Instructor" />
                  )}
                </div>
                <p className="text-xs font-medium text-sky-600 dark:text-cyan-400">{teacher.title}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {teacher.institution}
                  </span>
                  <span>•</span>
                  <span>{teacher.experienceYears} Years Exp</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {teacher.rating}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0 w-full sm:w-auto">
              <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border text-center ${
                teacher.recruitmentStatus === 'Available for Recruitment'
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                  : 'bg-sky-500/10 text-sky-500 border-sky-500/30'
              }`}>
                {teacher.recruitmentStatus}
              </span>
              <button
                onClick={() => setShowRecruitOfferBox(!showRecruitOfferBox)}
                className={`flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-sm ${
                  isBright
                    ? 'bg-sky-600 hover:bg-sky-700 text-white'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>{showRecruitOfferBox ? 'Close Offer Box' : 'Recruit This Teacher'}</span>
              </button>
            </div>
          </div>

          {/* Quick Recruitment Offer Box (Expandable) */}
          {showRecruitOfferBox && (
            <div className={`p-4 rounded-xl border animate-in slide-in-from-top-3 ${
              isBright
                ? 'bg-sky-50/70 border-sky-300'
                : 'bg-cyan-950/30 border-cyan-500/40'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-cyan-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Dispatch Faculty Recruitment Requisition
                </h4>
              </div>

              {offerSent ? (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>
                    Official faculty requisition sent to {teacher.name} ({teacher.email}) and notified to IMD Head Office.
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="block text-[11px] font-medium mb-1">Target Station / Hub</label>
                      <input
                        type="text"
                        value={offerStation}
                        onChange={(e) => setOfferStation(e.target.value)}
                        className={`w-full p-2 rounded-lg border text-xs ${
                          isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium mb-1">Requisition Role Title</label>
                      <input
                        type="text"
                        value={offerRole}
                        onChange={(e) => setOfferRole(e.target.value)}
                        className={`w-full p-2 rounded-lg border text-xs ${
                          isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium mb-1">Personalized Message</label>
                    <textarea
                      rows={2}
                      value={offerMessage}
                      onChange={(e) => setOfferMessage(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs ${
                        isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                      }`}
                    />
                  </div>

                  <button
                    onClick={handleSendOffer}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Official Recruitment Offer</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Bio / Summary */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Academic Profile & Forecaster Teaching Statement
            </h4>
            <p className={`text-xs leading-relaxed ${isBright ? 'text-slate-700' : 'text-slate-300'}`}>
              {teacher.bio}
            </p>
          </div>

          {/* Specializations & Radar Hardware */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-xl border ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-2.5">
                <Radio className="w-4 h-4 text-sky-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider">
                  Meteorological Specializations
                </h5>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {teacher.specializations.map((spec, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 text-[11px] rounded-md font-medium border ${
                      isBright
                        ? 'bg-white border-slate-200 text-slate-800'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200'
                    }`}
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${
              isBright ? 'bg-slate-50 border-slate-200' : 'bg-[#0f172a] border-slate-800'
            }`}>
              <div className="flex items-center gap-2 mb-2.5">
                <Radio className="w-4 h-4 text-cyan-500" />
                <h5 className="text-xs font-bold uppercase tracking-wider">
                  Radar Hardware & System Experience
                </h5>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {teacher.radarHardwareExperience.map((rad, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 text-[11px] font-mono rounded-md border ${
                      isBright
                        ? 'bg-sky-50 border-sky-200 text-sky-900'
                        : 'bg-cyan-950/50 border-cyan-800/60 text-cyan-300'
                    }`}
                  >
                    {rad}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Peer-Reviewed Publications */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  Selected Peer-Reviewed Publications ({teacher.publicationsCount} Total)
                </h4>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Scopus / Web of Science</span>
            </div>

            <div className="space-y-2">
              {teacher.topPublications.map((pub, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs leading-relaxed ${
                    isBright ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#0f192d] border-slate-800 text-slate-300'
                  }`}
                >
                  <span className="font-bold text-sky-600 dark:text-cyan-400 mr-2">[{idx + 1}]</span>
                  {pub}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Details & Honorarium */}
          <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 text-xs ${
            isBright ? 'bg-slate-100/70 border-slate-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                {teacher.email}
              </span>
              {teacher.phone && (
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                  {teacher.phone}
                </span>
              )}
            </div>

            {teacher.hourlyRateOrHonorarium && (
              <div className="font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                Govt Honorarium Standard: {teacher.hourlyRateOrHonorarium}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
