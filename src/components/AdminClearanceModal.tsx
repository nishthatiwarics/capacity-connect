import React, { useState } from 'react';
import { ShieldAlert, Lock, ArrowRight, X, AlertTriangle, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserRole } from '../types';
import { sound } from '../utils/audio';

interface AdminClearanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: UserRole;
  currentRole: UserRole;
  onGrantAccess: (role: UserRole) => void;
}

export const AdminClearanceModal: React.FC<AdminClearanceModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  currentRole,
  onGrantAccess,
}) => {
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = passcode.trim().toUpperCase();

    // Verification check for Admin access
    if (cleanPin === 'IMD-ADMIN' || cleanPin === 'ADMIN' || cleanPin === '1234') {
      sound.playSuccess();
      setErrorMsg('');
      setPasscode('');
      onGrantAccess(targetRole);
      onClose();
    } else {
      sound.playAlert();
      setErrorMsg('Invalid Security Clearance PIN. Learner credentials cannot access the Admin Governance Desk.');
    }
  };

  const handleQuickAuthorize = () => {
    sound.playSuccess();
    setErrorMsg('');
    setPasscode('');
    onGrantAccess(targetRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Security Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                MoES Protocol 403
              </span>
              <span className="text-xs text-slate-400 font-mono">Restricted Deck</span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">
              Director General Clearance Required
            </h2>
          </div>
        </div>

        {/* Informative Security Warning */}
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 mb-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Learners cannot access the Admin Dashboard</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            You are currently in the <strong className="text-white">{currentRole}</strong> role. Under IMD Directorate security guidelines, only authorized Administrators hold clearance to view and govern the Admin Approvals & Requisition Desk.
          </p>
        </div>

        {/* Passcode Verification Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>Enter Directorate Clearance PIN</span>
              <span className="text-[10px] font-mono text-amber-400">Hint: IMD-ADMIN</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. IMD-ADMIN"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setErrorMsg('');
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs sm:text-sm font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
              />
            </div>
            {errorMsg && (
              <p className="text-xs text-rose-400 mt-1.5 font-medium flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              type="submit"
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <KeyRound className="w-4 h-4" />
              <span>Verify & Unlock</span>
            </button>

            <button
              type="button"
              onClick={handleQuickAuthorize}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              title="Quickly authenticate as Director General Dr. M. Mohapatra"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Elevate as DG</span>
            </button>
          </div>
        </form>

        {/* Footer Dismissal */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Return safely to learner flight deck</span>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-300 hover:text-white font-semibold underline cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
