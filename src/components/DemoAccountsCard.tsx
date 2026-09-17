import React from 'react';
import { Lock, FileText, UserCheck, CheckCircle2, ChevronRight, Sparkles, Shield, User } from 'lucide-react';
import { UserRole, DemoAccount } from '../types';
import { DEMO_ACCOUNTS } from '../data/portalData';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface DemoAccountsCardProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onRequestAdminClearance?: (targetRole: UserRole) => void;
  variant?: 'inline' | 'modal' | 'dropdown';
  onClose?: () => void;
}

export const DemoAccountsCard: React.FC<DemoAccountsCardProps> = ({
  currentRole,
  onSelectRole,
  onRequestAdminClearance,
  variant = 'inline',
  onClose,
}) => {
  const { isBright } = useTheme();

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <Lock className="w-4 h-4 text-amber-500" />;
      case 'Trainer':
      case 'Faculty':
        return <FileText className="w-4 h-4 text-sky-500" />;
      case 'Trainee':
        return <User className="w-4 h-4 text-indigo-500" />;
      default:
        return <UserCheck className="w-4 h-4 text-cyan-500" />;
    }
  };

  const getRoleEmoji = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return '🔒';
      case 'Trainer':
      case 'Faculty':
        return '📋';
      case 'Trainee':
        return '👤';
      default:
        return '👤';
    }
  };

  const handleSelect = (account: DemoAccount) => {
    // SECURITY GUARD:
    // Only Admin can access trainee and trainer's dashboard
    // Learner cannot access admin dashboard
    if (currentRole !== 'Admin' && account.role === 'Admin') {
      sound.playAlert();
      if (onRequestAdminClearance) {
        onRequestAdminClearance('Admin');
      }
      return;
    }

    if (currentRole === 'Trainee' && account.role === 'Trainer') {
      sound.playAlert();
      if (onRequestAdminClearance) {
        onRequestAdminClearance('Trainer');
      }
      return;
    }

    if (currentRole === 'Trainer' && account.role === 'Trainee') {
      sound.playAlert();
      if (onRequestAdminClearance) {
        onRequestAdminClearance('Trainee');
      }
      return;
    }

    sound.playBlip(750, 0.08);
    onSelectRole(account.role);
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      id="demo-accounts-card"
      className={`rounded-2xl transition-all ${
        variant === 'modal'
          ? isBright
            ? 'bg-white p-6 max-w-lg w-full shadow-2xl border border-slate-200'
            : 'bg-[#0b1222] p-6 max-w-lg w-full shadow-[0_0_35px_rgba(6,182,212,0.25)] border border-cyan-500/30'
          : isBright
            ? 'bg-white/90 backdrop-blur-md p-5 border border-slate-200 shadow-sm'
            : 'bg-[#0d1527]/90 backdrop-blur-md p-5 border border-slate-800/80 shadow-lg'
      }`}
    >
      {/* Title Header matching user screenshot */}
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-mono uppercase font-bold tracking-wider ${
            isBright ? 'text-slate-600' : 'text-slate-300'
          }`}>
            DEMO ACCOUNTS — ONE-CLICK ACCESS
          </span>
        </div>
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
          isBright ? 'bg-sky-50 text-sky-700 border border-sky-200' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
        }`}>
          Instant Switch
        </span>
      </div>

      {/* 3 Demo Account Buttons matching screenshot layout */}
      <div className="space-y-2.5">
        {DEMO_ACCOUNTS.map((acc) => {
          const isSelected =
            currentRole === acc.role ||
            (acc.role === 'Trainer' && currentRole === 'Faculty');

          return (
            <button
              key={acc.role}
              onClick={() => handleSelect(acc)}
              className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start justify-between gap-3 group relative border ${
                isSelected
                  ? isBright
                    ? 'bg-sky-50/90 border-sky-400 shadow-sm ring-2 ring-sky-400/30'
                    : 'bg-cyan-950/40 border-cyan-400/80 shadow-[0_0_18px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                  : isBright
                    ? 'bg-slate-50/80 hover:bg-slate-100/90 border-slate-200/80 text-slate-800'
                    : 'bg-[#0f192d]/60 hover:bg-[#132039] border-slate-800/70 text-slate-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Account Avatar with Badge */}
                <div className="relative shrink-0 mt-0.5">
                  {acc.avatar ? (
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className={`w-10 h-10 rounded-xl object-cover border ${
                        isSelected
                          ? isBright ? 'border-sky-500 ring-2 ring-sky-200' : 'border-cyan-400 ring-2 ring-cyan-500/30'
                          : isBright ? 'border-slate-300' : 'border-slate-700'
                      }`}
                    />
                  ) : (
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                        isSelected
                          ? isBright ? 'border-sky-500 ring-2 ring-sky-200 bg-sky-100 text-sky-700' : 'border-cyan-400 ring-2 ring-cyan-500/30 bg-cyan-950 text-cyan-300'
                          : isBright ? 'border-slate-300 bg-slate-100 text-slate-500' : 'border-slate-700 bg-slate-800 text-slate-400'
                      }`}
                    >
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 text-xs">
                    {getRoleEmoji(acc.role)}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold tracking-tight ${
                      isSelected
                        ? isBright ? 'text-sky-950' : 'text-cyan-200 font-extrabold'
                        : isBright ? 'text-slate-900' : 'text-white'
                    }`}>
                      {acc.role}
                    </span>
                    {isSelected && (
                      <span className={`px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded ${
                        isBright ? 'bg-sky-600 text-white' : 'bg-cyan-500 text-slate-950'
                      }`}>
                        Active
                      </span>
                    )}
                    {acc.role === 'Admin' && currentRole !== 'Admin' && (
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-amber-500/20 text-amber-600 border border-amber-500/30 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>DG Only</span>
                      </span>
                    )}
                    {currentRole === 'Trainee' && acc.role === 'Trainer' && (
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Faculty</span>
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-semibold ${isBright ? 'text-slate-800' : 'text-slate-200'}`}>
                    {acc.name}
                  </div>
                  <div className={`text-[11px] font-mono truncate max-w-[240px] sm:max-w-xs ${
                    isBright ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {acc.email}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end justify-between h-full pt-1 shrink-0">
                {isSelected ? (
                  <CheckCircle2 className={`w-5 h-5 ${isBright ? 'text-sky-600' : 'text-cyan-400'}`} />
                ) : (acc.role === 'Admin' && currentRole !== 'Admin') || (currentRole === 'Trainee' && acc.role === 'Trainer') || (currentRole === 'Trainer' && acc.role === 'Trainee') ? (
                  <Lock className="w-4 h-4 text-amber-500/70" />
                ) : (
                  <ChevronRight className={`w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all ${
                    isBright ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                )}
                <span className={`text-[10px] mt-2 font-mono ${
                  isSelected 
                    ? isBright ? 'text-sky-700 font-semibold' : 'text-cyan-300 font-semibold'
                    : isBright ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {acc.role === 'Admin' && currentRole !== 'Admin' 
                    ? 'Requires DG PIN' 
                    : acc.role === 'Admin' 
                      ? 'HQ Oversight (All Access)' 
                      : acc.role === 'Trainer' 
                        ? 'Upload & Teach' 
                        : 'Learn & Certify'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer text exactly matching the user's uploaded screenshot */}
      <div className={`mt-3.5 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-2 ${
        isBright ? 'border-slate-200 text-slate-500' : 'border-slate-800/80 text-slate-400'
      }`}>
        <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5 text-sky-500" />
        <p>
          Connected to live Supabase cloud. Unapproved trainees sign in to the Accreditation Lock portal before Admin commissioning.
        </p>
      </div>
    </div>
  );
};
