import React from 'react';
import {
  X,
  Download,
  Target,
  UserCheck,
  Video,
  FileText,
  Volume2,
  VolumeX,
  Sparkles,
  Shield,
  Layers,
  HelpCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';
import { sound } from '../utils/audio';

interface ToolsOperationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onExportCSV: () => void;
  onOpenSkillsMatrix: () => void;
  onOpenDemoAccounts: () => void;
  onOpenUploadLecture?: () => void;
  onOpenUploadStudyMaterial?: () => void;
  onOpenCrisisDrill?: () => void;
}

export const ToolsOperationsModal: React.FC<ToolsOperationsModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onExportCSV,
  onOpenSkillsMatrix,
  onOpenDemoAccounts,
  onOpenUploadLecture,
  onOpenUploadStudyMaterial,
  onOpenCrisisDrill
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 border border-sky-100 shadow-2xl text-slate-800 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Operations & Tools Hub
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Unified utilities for reports, simulations, and account management
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playBlip(500);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close Operations Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Items Grid */}
        <div className="mt-5 space-y-3">
          {/* Export CSV Report */}
          <button
            onClick={() => {
              sound.playBlip(700);
              onExportCSV();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Export Workforce Capacity Report (CSV)
                </span>
                <span className="text-[11px] text-slate-500">
                  Download accredited forecaster competencies, radar hours, and certifications
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Competency Skills Matrix */}
          <button
            onClick={() => {
              sound.playBlip(700);
              onOpenSkillsMatrix();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Competency Gap & Skills Matrix
                </span>
                <span className="text-[11px] text-slate-500">
                  Interactive 6-axis meteorological skill evaluation and MoES mapping
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Demo Accounts Switcher */}
          <button
            onClick={() => {
              sound.playBlip(700);
              onOpenDemoAccounts();
              onClose();
            }}
            className="w-full p-3.5 rounded-2xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-slate-900 block">
                  Switch Demo Persona Accounts
                </span>
                <span className="text-[11px] text-slate-500">
                  Switch between Trainee Cadet, Senior Faculty, or Director General
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
          </button>

          {/* Emergency Crisis Drill */}
          {onOpenCrisisDrill && (
            <button
              onClick={() => {
                sound.playAlert();
                onOpenCrisisDrill();
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl border border-rose-200 hover:border-rose-400 hover:bg-rose-50/50 flex items-center justify-between text-left transition-all cursor-pointer group shadow-2xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-slate-900 block">
                    Severe Radar Crisis Drill
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Timed meteorological emergency simulation with Doppler radar telemetry
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}

          {/* Trainer Studio Uploads (If Trainer or Admin) */}
          {(currentRole === 'Trainer' || currentRole === 'Admin') && (
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2.5">
              {onOpenUploadLecture && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playBlip(700);
                    onOpenUploadLecture();
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-100/80 text-emerald-900 text-left transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <Video className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="text-xs font-black block">Upload Lecture</span>
                    <span className="text-[10px] text-emerald-700 block">Video Masterclass</span>
                  </div>
                </button>
              )}

              {onOpenUploadStudyMaterial && (
                <button
                  type="button"
                  onClick={() => {
                    sound.playBlip(700);
                    onOpenUploadStudyMaterial();
                    onClose();
                  }}
                  className="p-3 rounded-2xl border border-purple-200 bg-purple-50/60 hover:bg-purple-100/80 text-purple-900 text-left transition-all cursor-pointer flex items-center gap-2.5"
                >
                  <FileText className="w-4 h-4 text-purple-700 shrink-0" />
                  <div>
                    <span className="text-xs font-black block">Upload Notes</span>
                    <span className="text-[10px] text-purple-700 block">SOPs & Manuals</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Capacity Connect • Meteorological Directorate Utilities
        </div>
      </div>
    </div>
  );
};
