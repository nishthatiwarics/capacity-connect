import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  User, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Search, 
  Sparkles, 
  Star, 
  ThumbsUp, 
  Check, 
  CheckCheck, 
  Clock, 
  Radio, 
  BookOpen, 
  Zap, 
  HelpCircle, 
  Filter, 
  RefreshCw, 
  ChevronRight,
  MessageCircle,
  Award,
  AlertCircle
} from 'lucide-react';
import { 
  ChatMessage, 
  ChatContact, 
  QuizFeedback, 
  LectureFeedback, 
  UserRole, 
  DemoLecture, 
  Course 
} from '../types';
import { 
  INITIAL_TRAINER_CONTACTS, 
  INITIAL_TRAINEE_CONTACTS, 
  INITIAL_DIRECT_MESSAGES, 
  INITIAL_ANONYMOUS_MESSAGES, 
  INITIAL_QUIZ_FEEDBACKS, 
  INITIAL_LECTURE_FEEDBACKS,
  getRandomAnonymousName
} from '../data/chatData';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface ChatSystemWindowProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  currentUserName: string;
  lectures: DemoLecture[];
  courses: Course[];
  onAwardXP?: (amount: number, reason: string) => void;
}

export const ChatSystemWindow: React.FC<ChatSystemWindowProps> = ({
  isOpen,
  onClose,
  currentRole,
  currentUserName,
  lectures,
  courses,
  onAwardXP
}) => {
  const { isBright } = useTheme();

  // Active top-level mode: 'direct' (Faculty ↔ Trainee) | 'anonymous' (Anonymous Lounge) | 'feedback' (Quiz & Lecture Feedback)
  const [activeTab, setActiveTab] = useState<'direct' | 'anonymous' | 'feedback'>('direct');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Contacts state
  const [trainerContacts] = useState<ChatContact[]>(INITIAL_TRAINER_CONTACTS);
  const [traineeContacts] = useState<ChatContact[]>(INITIAL_TRAINEE_CONTACTS);
  const [selectedContactId, setSelectedContactId] = useState<string>('teach-01');
  const [searchContactText, setSearchContactText] = useState<string>('');

  // Messages state
  const [directMessages, setDirectMessages] = useState<ChatMessage[]>(INITIAL_DIRECT_MESSAGES);
  const [messageInput, setMessageInput] = useState<string>('');
  const [isTrainerTyping, setIsTrainerTyping] = useState<boolean>(false);

  // Anonymous Channel state
  const [anonymousMessages, setAnonymousMessages] = useState<ChatMessage[]>(INITIAL_ANONYMOUS_MESSAGES);
  const [selectedChannelTag, setSelectedChannelTag] = useState<string>('#All-Topics');
  const [anonymousInput, setAnonymousInput] = useState<string>('');
  const [currentAnonymousAlias, setCurrentAnonymousAlias] = useState<string>(getRandomAnonymousName);
  const [postChannelTag, setPostChannelTag] = useState<string>('#General-Candid');

  // Feedback State
  const [quizFeedbacks, setQuizFeedbacks] = useState<QuizFeedback[]>(INITIAL_QUIZ_FEEDBACKS);
  const [lectureFeedbacks, setLectureFeedbacks] = useState<LectureFeedback[]>(INITIAL_LECTURE_FEEDBACKS);
  const [feedbackCategoryFilter, setFeedbackCategoryFilter] = useState<'all' | 'lectures' | 'quizzes' | 'submit'>('all');

  // Submit Feedback Form State
  const [feedbackType, setFeedbackType] = useState<'lecture' | 'quiz'>('lecture');
  const [selectedTargetId, setSelectedTargetId] = useState<string>(lectures[0]?.id || 'lec-01');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [feedbackDifficulty, setFeedbackDifficulty] = useState<QuizFeedback['difficultyFeeling']>('Balanced');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [trainerReplyText, setTrainerReplyText] = useState<string>('');
  const [activeReplyingFeedbackId, setActiveReplyingFeedbackId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine available contacts based on current user role
  const isUserTrainer = currentRole === 'Trainer';
  const availableContacts = isUserTrainer ? traineeContacts : trainerContacts;
  const filteredContacts = availableContacts.filter(c => 
    c.name.toLowerCase().includes(searchContactText.toLowerCase()) ||
    c.specialization.toLowerCase().includes(searchContactText.toLowerCase()) ||
    c.institution.toLowerCase().includes(searchContactText.toLowerCase())
  );

  const activeContact = availableContacts.find(c => c.id === selectedContactId) || availableContacts[0];

  // Active direct conversation messages
  const activeConversationMessages = directMessages.filter(msg => {
    if (isUserTrainer) {
      // Current user is trainer: show messages where receiver is active trainee or sender is active trainee
      return (msg.receiverId === activeContact?.id && msg.senderRole === 'Trainer') ||
             (msg.senderId === activeContact?.id);
    } else {
      // Current user is trainee: show messages between this trainee and selected trainer
      return (msg.receiverId === activeContact?.id) || (msg.senderId === activeContact?.id);
    }
  });

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationMessages.length, isTrainerTyping, anonymousMessages.length, activeTab]);

  if (!isOpen) return null;

  // Handle sending direct message
  const handleSendDirectMessage = (overrideContent?: string) => {
    const text = (overrideContent || messageInput).trim();
    if (!text || !activeContact) return;

    sound.playBlip(780, 0.05);

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: isUserTrainer ? 'teach-01' : 'tr-01',
      senderName: currentUserName || (isUserTrainer ? 'Dr. Someshwar Rao' : 'Julianne Moore'),
      senderRole: isUserTrainer ? 'Trainer' : 'Trainee',
      receiverId: activeContact.id,
      channelType: 'direct',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setDirectMessages(prev => [...prev, newMsg]);
    setMessageInput('');

    // If trainee sent a message, simulate faculty answer after short delay
    if (!isUserTrainer) {
      setIsTrainerTyping(true);
      setTimeout(() => {
        setIsTrainerTyping(false);
        sound.playBlip(920, 0.06);

        let reply = "Thank you for reaching out, Cadet! I've noted this. Let's verify the radar PPI scans in the Doppler lab during tomorrow's shift.";
        const lower = text.toLowerCase();
        if (lower.includes('vad') || lower.includes('velocity') || lower.includes('nyquist')) {
          reply = "Great question regarding Velocity Azimuth Display! Remember that when radial velocity exceeds the Nyquist velocity (Vmax = λ * PRF / 4), velocity folding occurs. Check Chapter 3 in the lecture for the de-aliasing algorithm.";
        } else if (lower.includes('quiz') || lower.includes('question') || lower.includes('hook echo')) {
          reply = "For that quiz question: look closely at the cyclonic inflow notch. The hook echo wraps around the mesocyclonic updraft, which is the primary hallmark of tornadic rotation.";
        } else if (lower.includes('feedback') || lower.includes('lecture') || lower.includes('video')) {
          reply = "Thank you for the thoughtful feedback! We continuously update our training modules based on trainee inputs. Keep up the high standard!";
        } else if (lower.includes('guidance') || lower.includes('1-on-1') || lower.includes('help')) {
          reply = "I'm available today between 14:00 and 16:00 UTC for a 1-on-1 virtual mentoring slot. Feel free to join the Doppler lab room.";
        }

        const facultyReply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          senderId: activeContact.id,
          senderName: activeContact.name,
          senderRole: 'Trainer',
          receiverId: 'tr-01',
          channelType: 'direct',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'delivered'
        };
        setDirectMessages(prev => [...prev, facultyReply]);
      }, 1200);
    }
  };

  // Handle posting anonymous message
  const handlePostAnonymous = (e: React.FormEvent) => {
    e.preventDefault();
    if (!anonymousInput.trim()) return;

    sound.playBlip(750, 0.05);

    const newAnon: ChatMessage = {
      id: `anon-${Date.now()}`,
      senderId: `anon-${Date.now()}`,
      senderName: 'Anonymous Forecaster',
      senderRole: 'Anonymous',
      channelType: 'anonymous',
      channelTag: postChannelTag,
      isAnonymous: true,
      anonymousAlias: currentAnonymousAlias,
      content: anonymousInput.trim(),
      timestamp: 'Just now',
      likesCount: 1
    };

    setAnonymousMessages(prev => [newAnon, ...prev]);
    setAnonymousInput('');

    if (onAwardXP) {
      onAwardXP(15, 'Contributed Candid Insight to Anonymous Forecaster Lounge');
    }
  };

  // Handle like anonymous message
  const handleLikeAnonymous = (msgId: string) => {
    sound.playBlip(850, 0.04);
    setAnonymousMessages(prev => prev.map(m => {
      if (m.id === msgId) {
        return { ...m, likesCount: (m.likesCount || 0) + 1 };
      }
      return m;
    }));
  };

  // Handle submit feedback form
  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    sound.playSuccess();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });

    if (feedbackType === 'lecture') {
      const lectureObj = lectures.find(l => l.id === selectedTargetId) || lectures[0];
      const newLfb: LectureFeedback = {
        id: `lfb-${Date.now()}`,
        lectureId: lectureObj.id,
        lectureTitle: lectureObj.title,
        teacherId: lectureObj.teacherId,
        traineeId: 'tr-01',
        traineeName: currentUserName || 'Julianne Moore',
        traineeRank: 'Radar Specialist',
        rating: feedbackRating,
        contentClarity: 5,
        audioVisualQuality: 5,
        pacing: 'Just Right',
        comment: feedbackComment.trim(),
        submittedAt: 'Today',
        likesCount: 1
      };
      setLectureFeedbacks(prev => [newLfb, ...prev]);
    } else {
      const courseObj = courses.find(c => c.id === selectedTargetId) || courses[0];
      const newQfb: QuizFeedback = {
        id: `qfb-${Date.now()}`,
        quizId: courseObj.id,
        quizTitle: `Assessment: ${courseObj.title}`,
        traineeId: 'tr-01',
        traineeName: currentUserName || 'Julianne Moore',
        traineeRank: 'Radar Specialist',
        rating: feedbackRating,
        difficultyFeeling: feedbackDifficulty,
        selectedTags: selectedTags.length ? selectedTags : ['Clear Physics', 'Practical Value'],
        comment: feedbackComment.trim(),
        submittedAt: 'Today'
      };
      setQuizFeedbacks(prev => [newQfb, ...prev]);
    }

    if (onAwardXP) {
      onAwardXP(25, `Submitted Detailed Feedback for ${feedbackType === 'lecture' ? 'Video Lecture' : 'Quiz'}`);
    }

    setFeedbackComment('');
    setSelectedTags([]);
    setFeedbackCategoryFilter('all');
  };

  // Handle trainer reply to feedback
  const handleTrainerReplyFeedback = (feedbackId: string, isQuiz: boolean) => {
    if (!trainerReplyText.trim()) return;
    sound.playBlip(700);

    if (isQuiz) {
      setQuizFeedbacks(prev => prev.map(q => {
        if (q.id === feedbackId) {
          return {
            ...q,
            trainerResponse: trainerReplyText.trim(),
            trainerRespondedBy: currentUserName || 'Dr. Someshwar Rao',
            trainerRespondedAt: 'Just now'
          };
        }
        return q;
      }));
    } else {
      setLectureFeedbacks(prev => prev.map(l => {
        if (l.id === feedbackId) {
          return {
            ...l,
            trainerResponse: {
              trainerName: currentUserName || 'Dr. Someshwar Rao',
              trainerTitle: 'Lead Radar Faculty',
              comment: trainerReplyText.trim(),
              respondedAt: 'Just now'
            }
          };
        }
        return l;
      }));
    }

    setActiveReplyingFeedbackId(null);
    setTrainerReplyText('');
  };

  const filteredAnonymousMessages = selectedChannelTag === '#All-Topics'
    ? anonymousMessages
    : anonymousMessages.filter(m => m.channelTag === selectedChannelTag);

  return (
    <div 
      className={`fixed z-50 transition-all duration-300 shadow-2xl flex flex-col overflow-hidden border ${
        isExpanded
          ? 'inset-3 sm:inset-6 rounded-3xl'
          : 'bottom-4 right-4 w-[95vw] sm:w-[500px] md:w-[620px] h-[660px] max-h-[92vh] rounded-3xl'
      } ${
        isBright
          ? 'bg-white/95 border-slate-200 text-slate-900 shadow-xl backdrop-blur-xl'
          : 'bg-[#0b1222]/95 border-cyan-500/30 text-slate-100 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-xl'
      }`}
      role="dialog"
      aria-label="Trainee Trainer Communication and Anonymous Feedback Window"
    >
      {/* Top Header Bar */}
      <div className={`px-4 sm:px-6 py-3.5 flex items-center justify-between border-b shrink-0 ${
        isBright ? 'bg-slate-50/90 border-slate-200' : 'bg-[#0f172a]/90 border-slate-800'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold tracking-tight">
                IMD Faculty & Cadet Communication Hub
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                isBright ? 'bg-sky-100 text-sky-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
              }`}>
                {currentRole} Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Direct faculty contact, anonymous candidate lounge & feedback channel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBright ? 'hover:bg-slate-200 border-slate-200 text-slate-600' : 'hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title={isExpanded ? 'Restore compact window' : 'Expand window'}
            aria-label={isExpanded ? 'Restore compact window' : 'Expand window'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBright ? 'hover:bg-rose-50 hover:text-rose-600 border-slate-200 text-slate-600' : 'hover:bg-rose-950 hover:text-rose-400 border-slate-700 text-slate-300'
            }`}
            title="Close communication hub"
            aria-label="Close communication hub"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Navigation Mode Switcher Tabs */}
      <div className={`px-4 sm:px-6 py-2 border-b flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0 ${
        isBright ? 'bg-white border-slate-200' : 'bg-[#0d1527] border-slate-800'
      }`}>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tab 1: Direct Contact */}
          <button
            onClick={() => {
              setActiveTab('direct');
              sound.playBlip(650);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'direct'
                ? 'bg-sky-600 text-white shadow-xs'
                : isBright ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{isUserTrainer ? 'Trainee Enquiries' : 'Trainer Direct Contact'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          {/* Tab 2: Anonymous Channel */}
          <button
            onClick={() => {
              setActiveTab('anonymous');
              sound.playBlip(650);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'anonymous'
                ? 'bg-purple-600 text-white shadow-xs'
                : isBright ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <EyeOff className="w-3.5 h-3.5 text-purple-300" />
            <span>Anonymous Lounge</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-500/20 text-purple-200 font-mono">
              Confidential
            </span>
          </button>

          {/* Tab 3: Quiz & Lecture Feedback */}
          <button
            onClick={() => {
              setActiveTab('feedback');
              sound.playBlip(650);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-amber-600 text-white shadow-xs'
                : isBright ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>Quiz & Video Feedback</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Doppler Telemetry Synced</span>
        </div>
      </div>

      {/* =========================================================================
          VIEW 1: DIRECT CONTACT (TRAINEES ↔ TRAINERS)
      ========================================================================= */}
      {activeTab === 'direct' && (
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Contacts Sidebar */}
          <div className={`w-full md:w-56 lg:w-64 border-b md:border-b-0 md:border-r flex flex-col shrink-0 ${
            isBright ? 'bg-slate-50/70 border-slate-200' : 'bg-[#090f1d] border-slate-800'
          }`}>
            {/* Search Contacts */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isUserTrainer ? "Search trainees..." : "Search trainers & faculty..."}
                  value={searchContactText}
                  onChange={(e) => setSearchContactText(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-sky-500 text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Contacts Scrollable List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              <div className="px-2 py-1 text-[10px] font-mono uppercase font-bold text-slate-400">
                {isUserTrainer ? 'Active Trainee Cadets' : 'Commissioned IMD Faculty'}
              </div>

              {filteredContacts.map(contact => {
                const isSelected = contact.id === activeContact?.id;
                return (
                  <button
                    key={contact.id}
                    onClick={() => {
                      setSelectedContactId(contact.id);
                      sound.playBlip(600);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? isBright
                          ? 'bg-sky-50 border-sky-200 shadow-2xs'
                          : 'bg-sky-950/60 border-sky-600/50 shadow-2xs'
                        : isBright
                          ? 'bg-transparent border-transparent hover:bg-slate-100'
                          : 'bg-transparent border-transparent hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="relative shrink-0">
                      {contact.avatar ? (
                        <img 
                          src={contact.avatar} 
                          alt={contact.name} 
                          className="w-8 h-8 rounded-full object-cover border border-slate-300 dark:border-slate-700" 
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs">
                          {contact.name.charAt(0)}
                        </div>
                      )}
                      <span className={`w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 absolute -bottom-0.5 -right-0.5 ${
                        contact.status === 'Online' ? 'bg-emerald-500' :
                        contact.status === 'In Radar Ops' ? 'bg-amber-500' : 'bg-sky-400'
                      }`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold truncate text-slate-900 dark:text-slate-100">
                          {contact.name}
                        </span>
                        {contact.unreadCount > 0 && (
                          <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shrink-0">
                            {contact.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {contact.specialization}
                      </p>
                      <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {contact.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Conversation Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Active Contact Header */}
            {activeContact && (
              <div className={`px-4 py-2.5 border-b flex items-center justify-between shrink-0 ${
                isBright ? 'bg-white border-slate-200' : 'bg-[#0d162a] border-slate-800'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 flex items-center justify-center font-bold text-xs">
                    {activeContact.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{activeContact.name}</span>
                      <span className="text-[10px] font-normal text-slate-400 font-mono">
                        ({activeContact.institution})
                      </span>
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">
                      {activeContact.title} • {activeContact.specialization}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {activeContact.status}
                  </span>
                </div>
              </div>
            )}

            {/* Quick Meteorological Topic Starter Chips */}
            {!isUserTrainer && (
              <div className={`px-4 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-[11px] shrink-0 ${
                isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0c1426] border-slate-800/80'
              }`}>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 shrink-0">
                  Quick Topics:
                </span>
                <button
                  onClick={() => handleSendDirectMessage("Sir, could you explain the correlation coefficient (CC) drop in the melting layer?")}
                  className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-800/80 shrink-0 transition-all text-[11px] font-medium cursor-pointer"
                >
                  ⚡ Dual-Pol CC Drop
                </button>
                <button
                  onClick={() => handleSendDirectMessage("Could we review Question 4 from the Doppler Velocity Blitz?")}
                  className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/80 shrink-0 transition-all text-[11px] font-medium cursor-pointer"
                >
                  🎯 Quiz Q4 Review
                </button>
                <button
                  onClick={() => handleSendDirectMessage("Are there downloadable slides for Chapter 3 on hook echoes?")}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 shrink-0 transition-all text-[11px] font-medium cursor-pointer"
                >
                  📘 Lecture Notes
                </button>
                <button
                  onClick={() => handleSendDirectMessage("Requesting 1-on-1 guidance on Nyquist velocity de-aliasing.")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 shrink-0 transition-all text-[11px] font-medium cursor-pointer"
                >
                  🤝 1-on-1 Guidance
                </button>
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConversationMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    No messages yet with {activeContact?.name}
                  </h4>
                  <p className="text-xs max-w-xs mt-1">
                    Send a question or click any of the quick topic chips above to start a meteorological consultation!
                  </p>
                </div>
              ) : (
                activeConversationMessages.map((msg) => {
                  const isMine = isUserTrainer ? msg.senderRole === 'Trainer' : msg.senderRole === 'Trainee';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[10px] text-slate-400 font-mono">
                        <span className="font-bold text-slate-600 dark:text-slate-300">
                          {msg.senderName}
                        </span>
                        <span>•</span>
                        <span>{msg.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isMine
                            ? 'bg-sky-600 text-white rounded-tr-xs'
                            : isBright
                              ? 'bg-slate-100 text-slate-900 border border-slate-200 rounded-tl-xs'
                              : 'bg-[#131e38] text-slate-100 border border-slate-800 rounded-tl-xs'
                        }`}
                      >
                        {msg.relatedTopic && (
                          <div className={`mb-1.5 pb-1 text-[10px] font-mono font-bold uppercase border-b flex items-center gap-1 ${
                            isMine ? 'border-sky-500/50 text-sky-100' : 'border-slate-200 dark:border-slate-700 text-sky-600 dark:text-cyan-400'
                          }`}>
                            <BookOpen className="w-3 h-3" />
                            <span className="truncate">{msg.relatedTopic}</span>
                          </div>
                        )}
                        <p>{msg.content}</p>
                      </div>

                      <div className="flex items-center gap-1 mt-0.5 text-[9px] text-slate-400 font-mono">
                        {isMine && (
                          <span className="flex items-center gap-0.5 text-sky-500">
                            <CheckCheck className="w-3 h-3" /> Delivered
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Trainer Typing Indicator */}
              {isTrainerTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px]">
                    ✍️
                  </div>
                  <span className="font-mono text-[11px]">{activeContact?.name} is typing meteorological advice...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct Message Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendDirectMessage();
              }}
              className={`p-3 border-t flex items-center gap-2 shrink-0 ${
                isBright ? 'bg-white border-slate-200' : 'bg-[#0d162a] border-slate-800'
              }`}
            >
              <input
                type="text"
                placeholder={`Message ${activeContact?.name || 'Faculty'} (press Enter to send)...`}
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-sky-500 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW 2: ANONYMOUS FORECASTER LOUNGE (ZERO-IDENTITY)
      ========================================================================= */}
      {activeTab === 'anonymous' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Privacy & Candid Atmosphere Notice */}
          <div className={`p-3 sm:px-6 py-2.5 border-b flex items-center justify-between gap-3 text-xs shrink-0 ${
            isBright ? 'bg-purple-50/80 border-purple-200 text-purple-900' : 'bg-purple-950/40 border-purple-900/60 text-purple-200'
          }`}>
            <div className="flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <div>
                <span className="font-extrabold text-xs">Zero-Identity Meteorological Lounge</span>
                <p className="text-[11px] opacity-85">
                  Trainers and trainees communicate with complete anonymity. Honest feedback on syllabus, exam pressure & radar equipment.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300">
                Your Codename: <strong className="font-bold">{currentAnonymousAlias}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playBlip(600);
                  setCurrentAnonymousAlias(getRandomAnonymousName());
                }}
                className="p-1 rounded-lg border border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 transition-all text-[10px]"
                title="Generate new anonymous alias"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Anonymous Channel Selector Pills */}
          <div className={`px-4 sm:px-6 py-2 border-b flex items-center gap-2 overflow-x-auto text-xs shrink-0 ${
            isBright ? 'bg-white border-slate-200' : 'bg-[#0d162a] border-slate-800'
          }`}>
            {['#All-Topics', '#General-Candid', '#Quiz-Feedback', '#Lecture-Doubts', '#Radar-Grievances'].map(tag => (
              <button
                key={tag}
                onClick={() => {
                  setSelectedChannelTag(tag);
                  sound.playBlip(600);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                  selectedChannelTag === tag
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : isBright ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Anonymous Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
            {filteredAnonymousMessages.map((anon) => (
              <div
                key={anon.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isBright
                    ? 'bg-slate-50/90 border-slate-200 shadow-2xs'
                    : 'bg-[#0f172a] border-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-indigo-600 text-white flex items-center justify-center text-[10px] font-mono font-bold">
                      🕵️
                    </div>
                    <span className="text-xs font-mono font-black text-purple-700 dark:text-purple-300">
                      {anon.anonymousAlias || 'Anonymous Forecaster'}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 font-semibold">
                      {anon.channelTag}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {anon.timestamp}
                  </span>
                </div>

                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                  {anon.content}
                </p>

                <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400">
                    🔒 Zero digital footprint stored
                  </span>

                  <button
                    onClick={() => handleLikeAnonymous(anon.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                      isBright
                        ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3 text-purple-500" />
                    <span>Helpful ({anon.likesCount || 0})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Post Anonymously Input Form */}
          <form
            onSubmit={handlePostAnonymous}
            className={`p-3 sm:p-4 border-t flex flex-col gap-2 shrink-0 ${
              isBright ? 'bg-white border-slate-200' : 'bg-[#0d162a] border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-slate-500">Post to:</span>
                <select
                  value={postChannelTag}
                  onChange={(e) => setPostChannelTag(e.target.value)}
                  className="px-2 py-1 text-xs font-mono rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                >
                  <option value="#General-Candid">#General-Candid</option>
                  <option value="#Quiz-Feedback">#Quiz-Feedback</option>
                  <option value="#Lecture-Doubts">#Lecture-Doubts</option>
                  <option value="#Radar-Grievances">#Radar-Grievances</option>
                </select>
              </div>

              <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
                Posting as {currentAnonymousAlias}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Write candid observation, exam difficulty query, or radar grievance..."
                value={anonymousInput}
                onChange={(e) => setAnonymousInput(e.target.value)}
                className="flex-1 px-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-purple-500 text-slate-900 dark:text-slate-100"
              />
              <button
                type="submit"
                disabled={!anonymousInput.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer shrink-0"
              >
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* =========================================================================
          VIEW 3: QUIZ & VIDEO LECTURE FEEDBACK HUB
      ========================================================================= */}
      {activeTab === 'feedback' && (
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          {/* Sub-Tabs: All / Lectures / Quizzes / Leave Feedback */}
          <div className={`px-4 sm:px-6 py-2.5 border-b flex items-center justify-between gap-2 overflow-x-auto text-xs shrink-0 ${
            isBright ? 'bg-slate-50/80 border-slate-200' : 'bg-[#0d162a] border-slate-800'
          }`}>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFeedbackCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  feedbackCategoryFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : isBright ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                All Feedback ({lectureFeedbacks.length + quizFeedbacks.length})
              </button>
              <button
                onClick={() => setFeedbackCategoryFilter('lectures')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  feedbackCategoryFilter === 'lectures'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : isBright ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                Video Lectures ({lectureFeedbacks.length})
              </button>
              <button
                onClick={() => setFeedbackCategoryFilter('quizzes')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                  feedbackCategoryFilter === 'quizzes'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : isBright ? 'hover:bg-slate-200 text-slate-700' : 'hover:bg-slate-800 text-slate-300'
                }`}
              >
                Quizzes ({quizFeedbacks.length})
              </button>
            </div>

            <button
              onClick={() => {
                setFeedbackCategoryFilter('submit');
                sound.playBlip(700);
              }}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-2xs hover:brightness-110 flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Submit Trainee Feedback</span>
            </button>
          </div>

          {/* SUBMIT FEEDBACK FORM VIEW */}
          {feedbackCategoryFilter === 'submit' ? (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className={`p-6 rounded-3xl border max-w-xl mx-auto space-y-4 ${
                isBright ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#0f182f] border-slate-800 shadow-xl'
              }`}>
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Submit Learning Feedback</span>
                  </h4>
                  <button
                    onClick={() => setFeedbackCategoryFilter('all')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    ← Back to Reviews
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Your feedback helps IMD faculty refine radar simulations, adjust quiz timers, and improve lecture explanations. Earn +25 XP!
                </p>

                <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
                  {/* Target Type Selector */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackType('lecture')}
                      className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                        feedbackType === 'lecture'
                          ? 'bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-700 dark:text-sky-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="text-sm">🎥 Video Lecture</div>
                      <div className="text-[10px] font-normal text-slate-500">Demo masterclasses & slides</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedbackType('quiz')}
                      className={`p-3 rounded-2xl border text-left font-bold transition-all cursor-pointer ${
                        feedbackType === 'quiz'
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-700 dark:text-amber-300 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                    >
                      <div className="text-sm">🎯 Quiz Arena / Assessment</div>
                      <div className="text-[10px] font-normal text-slate-500">Speed blitz, timers & questions</div>
                    </button>
                  </div>

                  {/* Select Specific Lecture or Quiz */}
                  <div>
                    <label className="block font-bold mb-1">
                      {feedbackType === 'lecture' ? 'Select Video Lecture:' : 'Select Quiz / Course Assessment:'}
                    </label>
                    <select
                      value={selectedTargetId}
                      onChange={(e) => setSelectedTargetId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium text-xs focus:outline-none focus:border-sky-500"
                    >
                      {feedbackType === 'lecture' ? (
                        lectures.map(lec => (
                          <option key={lec.id} value={lec.id}>
                            {lec.title} ({lec.teacherName})
                          </option>
                        ))
                      ) : (
                        courses.map(course => (
                          <option key={course.id} value={course.id}>
                            Assessment: {course.title}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  {/* Star Rating */}
                  <div>
                    <label className="block font-bold mb-1.5">
                      Overall Rating (1 to 5 Stars):
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setFeedbackRating(star);
                            sound.playBlip(600 + star * 60);
                          }}
                          className="p-1.5 transition-transform hover:scale-125 cursor-pointer"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= feedbackRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="ml-2 font-mono font-bold text-amber-600 dark:text-amber-400">
                        {feedbackRating} / 5.0
                      </span>
                    </div>
                  </div>

                  {/* Tags for Quick Classification */}
                  <div>
                    <label className="block font-bold mb-1">Highlight Attributes:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Realistic Radar Imagery',
                        'Clear Explanations',
                        'Challenging Questions',
                        'Needs More Time',
                        'Great Physics Breakdown',
                        'Practical Shift Value'
                      ].map(tag => {
                        const isSelected = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setSelectedTags(prev => 
                                isSelected ? prev.filter(t => t !== tag) : [...prev, tag]
                              );
                              sound.playBlip(700);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}{tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Detailed Comments */}
                  <div>
                    <label className="block font-bold mb-1">
                      Detailed Review & Constructive Suggestions:
                    </label>
                    <textarea
                      rows={3}
                      placeholder={feedbackType === 'lecture' 
                        ? "What concept clicked for you? Were timestamps and notes helpful? Any topics needing more depth?"
                        : "Were the questions balanced? How was the 15-second timer? Did you spot any ambiguous options?"
                      }
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-normal text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setFeedbackCategoryFilter('all')}
                      className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!feedbackComment.trim()}
                      className="px-6 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-md hover:brightness-110 disabled:opacity-50 cursor-pointer"
                    >
                      Submit Feedback (+25 XP)
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            /* FEEDBACK LIST VIEW */
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Aggregate Feedback Banner */}
              <div className={`p-4 rounded-2xl border grid grid-cols-2 sm:grid-cols-4 gap-3 text-center ${
                isBright ? 'bg-amber-50/60 border-amber-200' : 'bg-amber-950/20 border-amber-900/40'
              }`}>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Avg Video Rating</span>
                  <div className="text-xl font-black font-mono text-amber-500 flex items-center justify-center gap-1">
                    <span>4.95</span>
                    <Star className="w-4 h-4 fill-amber-500" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Quiz Satisfaction</span>
                  <div className="text-xl font-black font-mono text-emerald-500">96.4%</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Total Cadet Reviews</span>
                  <div className="text-xl font-black font-mono text-sky-500">{quizFeedbacks.length + lectureFeedbacks.length}</div>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">Faculty Addressed</span>
                  <div className="text-xl font-black font-mono text-purple-500">100%</div>
                </div>
              </div>

              {/* Video Lecture Feedback List */}
              {(feedbackCategoryFilter === 'all' || feedbackCategoryFilter === 'lectures') && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <BookOpen className="w-4 h-4 text-sky-500" />
                    <span>Video Lecture Feedback Submissions</span>
                  </div>

                  {lectureFeedbacks.map((lfb) => (
                    <div
                      key={lfb.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isBright ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#0f172a] border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                              {lfb.traineeName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300">
                              {lfb.traineeRank}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-sky-600 dark:text-cyan-400 mt-0.5">
                            {lfb.lectureTitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl text-amber-500 font-mono font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{lfb.rating}.0 / 5.0</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed">
                        "{lfb.comment}"
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                        <span>Submitted on {lfb.submittedAt}</span>
                        <span>Pacing: {lfb.pacing} • Audio/Visual: {lfb.audioVisualQuality}/5</span>
                      </div>

                      {/* Official Faculty Reply */}
                      {lfb.trainerResponse ? (
                        <div className="mt-3 p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-sky-800 dark:text-sky-300 font-mono text-[11px] flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" />
                              Official Faculty Reply: {lfb.trainerResponse.trainerName}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {lfb.trainerResponse.respondedAt}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 italic">
                            "{lfb.trainerResponse.comment}"
                          </p>
                        </div>
                      ) : (
                        isUserTrainer && (
                          <div className="mt-2.5">
                            {activeReplyingFeedbackId === lfb.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Type faculty response to cadet feedback..."
                                  value={trainerReplyText}
                                  onChange={(e) => setTrainerReplyText(e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                                />
                                <button
                                  onClick={() => handleTrainerReplyFeedback(lfb.id, false)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-600 text-white"
                                >
                                  Reply
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setActiveReplyingFeedbackId(lfb.id)}
                                className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline"
                              >
                                + Reply as Faculty
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Quiz Assessment Feedback List */}
              {(feedbackCategoryFilter === 'all' || feedbackCategoryFilter === 'quizzes') && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <Zap className="w-4 h-4 text-amber-500" />
                    <span>Quiz & Assessment Feedback Submissions</span>
                  </div>

                  {quizFeedbacks.map((qfb) => (
                    <div
                      key={qfb.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        isBright ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#0f172a] border-slate-800'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                              {qfb.traineeName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                              {qfb.traineeRank}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                              Felt: {qfb.difficultyFeeling}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                            {qfb.quizTitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-xl text-amber-500 font-mono font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span>{qfb.rating}.0 / 5.0</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {qfb.selectedTags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                          >
                            ✓ {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 mt-2.5 leading-relaxed">
                        "{qfb.comment}"
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Submitted on {qfb.submittedAt}</span>
                      </div>

                      {/* Trainer Response */}
                      {qfb.trainerResponse ? (
                        <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-amber-900 dark:text-amber-300 font-mono text-[11px] flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5" />
                              Addressed by Faculty: {qfb.trainerRespondedBy || 'Faculty'}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {qfb.trainerRespondedAt}
                            </span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300 italic">
                            "{qfb.trainerResponse}"
                          </p>
                        </div>
                      ) : (
                        isUserTrainer && (
                          <div className="mt-2.5">
                            {activeReplyingFeedbackId === qfb.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Address cadet feedback as faculty..."
                                  value={trainerReplyText}
                                  onChange={(e) => setTrainerReplyText(e.target.value)}
                                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
                                />
                                <button
                                  onClick={() => handleTrainerReplyFeedback(qfb.id, true)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-600 text-white"
                                >
                                  Submit
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setActiveReplyingFeedbackId(qfb.id)}
                                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                              >
                                + Address Feedback as Faculty
                              </button>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
