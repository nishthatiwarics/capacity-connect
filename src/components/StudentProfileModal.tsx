import React from 'react';
import { X, Sparkles, User, Trophy, Flame } from 'lucide-react';
import { StudentProfileData } from '../types';
import { StudentProfileCard } from './StudentProfileCard';
import { useTheme } from '../context/ThemeContext';
import { sound } from '../utils/audio';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: StudentProfileData;
  onUpdateProfile: (updated: StudentProfileData) => void;
  onAwardXP?: (amount: number, reason: string) => void;
  onOpenVideoLecture?: () => void;
  onOpenQuizArena?: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onAwardXP,
  onOpenVideoLecture,
  onOpenQuizArena,
}) => {
  const { isBright } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in-50 duration-200">
      <div 
        className="relative w-full max-w-5xl my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={() => {
            sound.playBlip(500);
            onClose();
          }}
          className={`absolute -top-3 -right-3 z-20 p-2 rounded-full border shadow-xl transition-all ${
            isBright
              ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-white'
          }`}
          title="Close Profile"
        >
          <X className="w-5 h-5" />
        </button>

        <StudentProfileCard
          profile={profile}
          onUpdateProfile={onUpdateProfile}
          onAwardXP={onAwardXP}
          onOpenVideoLecture={() => {
            onClose();
            if (onOpenVideoLecture) onOpenVideoLecture();
          }}
          onOpenQuizArena={() => {
            onClose();
            if (onOpenQuizArena) onOpenQuizArena();
          }}
        />
      </div>
    </div>
  );
};
