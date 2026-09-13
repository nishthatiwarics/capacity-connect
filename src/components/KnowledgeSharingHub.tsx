import React, { useState } from 'react';
import { 
  BookOpen, 
  Share2, 
  Download, 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  CheckCircle2, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Sparkles, 
  Radio, 
  HelpCircle, 
  UserCheck, 
  ExternalLink,
  ChevronRight,
  Send,
  Calendar,
  Layers,
  Award
} from 'lucide-react';
import { KnowledgeItem, ForumQuestion, INITIAL_KNOWLEDGE_ITEMS, INITIAL_FORUM_QUESTIONS } from '../data/knowledgeData';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';
import confetti from 'canvas-confetti';

interface KnowledgeSharingHubProps {
  onAwardXP?: (amount: number, reason: string) => void;
  currentUserRole?: string;
}

export const KnowledgeSharingHub: React.FC<KnowledgeSharingHubProps> = ({
  onAwardXP,
  currentUserRole = 'Trainee',
}) => {
  const { isBright } = useTheme();

  const [activeSubTab, setActiveSubTab] = useState<'articles' | 'forum' | 'sops'>('articles');
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>(INITIAL_KNOWLEDGE_ITEMS);
  const [forumQuestions, setForumQuestions] = useState<ForumQuestion[]>(INITIAL_FORUM_QUESTIONS);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [selectedItemForReading, setSelectedItemForReading] = useState<KnowledgeItem | null>(null);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState<boolean>(false);
  const [isNewQuestionModalOpen, setIsNewQuestionModalOpen] = useState<boolean>(false);

  // New Question form state
  const [questionTitle, setQuestionTitle] = useState('');
  const [questionDesc, setQuestionDesc] = useState('');
  const [questionCategory, setQuestionCategory] = useState('Radar Meteorology');

  // New Answer state for questions
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerContent, setAnswerContent] = useState('');

  // Contribution Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<KnowledgeItem['category']>('Case Study');
  const [newDomain, setNewDomain] = useState<KnowledgeItem['competencyDomain']>('Radar Meteorology');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTakeaways, setNewTakeaways] = useState('');
  const [newTags, setNewTags] = useState('IMD, Field Debrief');

  const categories = ['All', 'Case Study', 'Standard Operating Procedure (SOP)', 'Research Note', 'Field Observation'];
  const domains = ['All', 'Radar Meteorology', 'Severe Nowcasting', 'Cyclone Dynamics', 'Satellite & NWP', 'Agro-Advisory'];

  // Filter items
  const filteredItems = knowledgeItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDomain = selectedDomain === 'All' || item.competencyDomain === selectedDomain;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeSubTab === 'sops') {
      return item.category === 'Standard Operating Procedure (SOP)' && matchesSearch;
    }
    return matchesCat && matchesDomain && matchesSearch;
  });

  const handleUpvoteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playBlip(800);
    setKnowledgeItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, upvotes: item.upvotes + 1 };
      }
      return item;
    }));
    onAwardXP?.(15, 'Contributed Peer Upvote to Institutional Knowledge');
  };

  const handleDownloadSOP = (item: KnowledgeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playReward();
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
    setKnowledgeItems(prev => prev.map(i => i.id === item.id ? { ...i, downloadsCount: i.downloadsCount + 1 } : i));
    
    // Create quick text-blob download simulating official document
    const blob = new Blob([
      `CAPACITY CONNECT - INDIA METEOROLOGICAL DEPARTMENT\n` +
      `CENTRALIZED KNOWLEDGE REPOSITORY & SOP VAULT\n` +
      `------------------------------------------------------------\n` +
      `DOCUMENT: ${item.title}\n` +
      `CATEGORY: ${item.category} | DOMAIN: ${item.competencyDomain}\n` +
      `AUTHOR: ${item.authorName} (${item.authorDesignation})\n` +
      `ORGANIZATION: ${item.stationOrInstitute}\n` +
      `DATE: ${item.publishedDate} | VERIFIED BY MoES: YES\n` +
      `------------------------------------------------------------\n\n` +
      `EXECUTIVE SUMMARY:\n${item.summary}\n\n` +
      `KEY TAKEAWAYS:\n${item.keyTakeaways.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}\n\n` +
      `FULL TECHNICAL TEXT:\n${item.contentMarkdown}`
    ], { type: 'text/plain;charset=utf-8' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = item.attachmentFileName || `${item.id}-IMD-Official-SOP.txt`;
    link.click();
    onAwardXP?.(50, 'Archived Official SOP for Operational Reference');
  };

  const handleSubmitContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSummary || !newContent) return;

    const newItem: KnowledgeItem = {
      id: `kb-user-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      competencyDomain: newDomain,
      authorName: currentUserRole === 'Admin' ? 'Dr. Ananya Sengupta' : 'Officer Cadet (Trainee)',
      authorDesignation: currentUserRole === 'Admin' ? 'Director General / Scientific Admin' : 'Junior Forecaster & Trainee',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      stationOrInstitute: 'Regional Meteorological Centre (Capacity Connect Contributor)',
      publishedDate: 'Today',
      readTimeMinutes: Math.max(3, Math.ceil(newContent.split(' ').length / 180)),
      upvotes: 1,
      commentsCount: 0,
      views: 12,
      summary: newSummary,
      contentMarkdown: newContent,
      tags: newTags.split(',').map(t => t.trim()),
      isVerifiedIMD: currentUserRole === 'Admin' || currentUserRole === 'Trainer',
      downloadsCount: 0,
      keyTakeaways: newTakeaways ? newTakeaways.split('\n').filter(Boolean) : [
        'Documented direct field operational observation',
        'Added to organizational knowledge baseline for peer training'
      ],
      attachmentFileName: `${newTitle.replace(/[^a-zA-Z0-9]/g, '-').slice(0, 30)}-Doc.pdf`
    };

    setKnowledgeItems([newItem, ...knowledgeItems]);
    setIsContributeModalOpen(false);
    sound.playReward();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    onAwardXP?.(200, 'Published Case Study / Knowledge Debrief to Centralized Hub');

    // reset
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewTakeaways('');
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionTitle || !questionDesc) return;

    const newQ: ForumQuestion = {
      id: `fq-${Date.now()}`,
      title: questionTitle,
      description: questionDesc,
      category: questionCategory,
      authorName: 'Cadet Rohan (You)',
      authorRole: 'Trainee Meteorologist',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      postedAt: 'Just now',
      upvotes: 1,
      answers: []
    };

    setForumQuestions([newQ, ...forumQuestions]);
    setIsNewQuestionModalOpen(false);
    setQuestionTitle('');
    setQuestionDesc('');
    sound.playSuccess();
    onAwardXP?.(50, 'Submitted Operational Question to Knowledge Forum');
  };

  const handlePostAnswer = (questionId: string) => {
    if (!answerContent.trim()) return;

    const newAnswer = {
      id: `ans-${Date.now()}`,
      authorName: currentUserRole === 'Admin' ? 'Dr. Ananya Sengupta (Faculty)' : 'Trainee Forecaster',
      authorRole: currentUserRole === 'Admin' ? 'Chief Radar Scientist' : 'Meteorologist Cadet',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      isFacultyVerified: currentUserRole === 'Admin' || currentUserRole === 'Trainer',
      content: answerContent,
      upvotes: 0,
      answeredAt: 'Just now'
    };

    setForumQuestions(prev => prev.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          answers: [...q.answers, newAnswer]
        };
      }
      return q;
    }));

    setAnswerContent('');
    setAnsweringQuestionId(null);
    sound.playSuccess();
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    onAwardXP?.(100, 'Shared Operational Meteorological Answer on Forum');
  };

  return (
    <div className="space-y-6">
      {/* HERO BANNER: Centralized Knowledge Sharing Pillar */}
      <div className={`p-6 rounded-2xl border transition-all ${
        isBright 
          ? 'bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border-sky-200 shadow-sm' 
          : 'bg-gradient-to-r from-[#0b162e] via-[#0d1b38] to-[#111633] border-cyan-500/30 shadow-2xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${
                isBright ? 'bg-sky-600 text-white' : 'bg-cyan-500 text-slate-950'
              }`}>
                Strategic Pillar 3
              </span>
              <span className={`text-xs font-mono font-bold ${isBright ? 'text-sky-700' : 'text-cyan-300'}`}>
                Centralized Knowledge Repository & Field Debriefs
              </span>
            </div>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Centralized Knowledge Sharing Hub
            </h2>
            <p className={`text-sm leading-relaxed ${isBright ? 'text-slate-600' : 'text-slate-300'}`}>
              Institutional memory platform connecting trainee cadets, Doppler radar operators, and faculty scientists. 
              Access real-world severe weather case studies, official MoES/IMD Standard Operating Procedures (SOPs), 
              and peer-to-peer technical forums.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">{knowledgeItems.length}</span>
                <span className="text-slate-500 dark:text-slate-400">Verified SOPs & Debriefs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span className="font-bold">{forumQuestions.length}</span>
                <span className="text-slate-500 dark:text-slate-400">Active Technical Inquiries</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-4 h-4 text-purple-500" />
                <span className="font-bold">
                  {knowledgeItems.reduce((acc, curr) => acc + curr.downloadsCount, 0)}
                </span>
                <span className="text-slate-500 dark:text-slate-400">Operational Downloads</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => setIsContributeModalOpen(true)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                isBright
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm hover:shadow'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:brightness-110 text-slate-950 font-black shadow-[0_0_20px_rgba(6,182,212,0.3)]'
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Contribute Case Debrief / SOP</span>
            </button>

            <button
              onClick={() => setIsNewQuestionModalOpen(true)}
              className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                isBright
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border-cyan-500/40'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Ask Field Expert</span>
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB NAVIGATOR & FILTERS */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 rounded-xl border bg-slate-100/80 dark:bg-slate-900/60 dark:border-slate-800">
          <button
            onClick={() => {
              setActiveSubTab('articles');
              sound.playBlip(600);
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'articles'
                ? isBright
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Case Studies & Debriefs ({knowledgeItems.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('sops');
              sound.playBlip(600);
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'sops'
                ? isBright
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Official SOP Vault</span>
          </button>

          <button
            onClick={() => {
              setActiveSubTab('forum');
              sound.playBlip(600);
            }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'forum'
                ? isBright
                  ? 'bg-white text-sky-700 shadow-xs'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Peer & Faculty Forum ({forumQuestions.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search radar debriefs, calibration SOPs, keywords..."
            className={`w-full pl-9 pr-4 py-2 rounded-xl text-xs border focus:outline-none focus:ring-2 transition-all ${
              isBright
                ? 'bg-white border-slate-300 text-slate-900 focus:ring-sky-500'
                : 'bg-slate-900/90 border-slate-800 text-white focus:ring-cyan-500 focus:border-cyan-500'
            }`}
          />
        </div>
      </div>

      {/* FILTER PILLS FOR ARTICLES & SOPS */}
      {activeSubTab !== 'forum' && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-bold mr-1">
            Competency Domain:
          </span>
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => {
                setSelectedDomain(dom);
                sound.playBlip(700);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedDomain === dom
                  ? isBright
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                  : isBright
                    ? 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    : 'bg-slate-900/70 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      )}

      {/* TAB 1 & 2: KNOWLEDGE ARTICLES & SOPs GRID */}
      {activeSubTab !== 'forum' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setSelectedItemForReading(item);
                sound.playBlip(700);
              }}
              className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isBright
                  ? 'bg-white hover:bg-sky-50/40 border-slate-200 hover:border-sky-300 shadow-sm hover:shadow-md'
                  : 'bg-[#0b1222]/90 hover:bg-[#0f1a30] border-slate-800 hover:border-cyan-500/40 shadow-xl'
              }`}
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                    item.category === 'Standard Operating Procedure (SOP)'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : item.category === 'Case Study'
                        ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30'
                  }`}>
                    {item.category}
                  </span>

                  {item.isVerifiedIMD && (
                    <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                      <CheckCircle2 className="w-3 h-3 text-cyan-500" />
                      <span>MoES Verified</span>
                    </span>
                  )}
                </div>

                <h3 className={`text-base font-bold line-clamp-2 group-hover:text-sky-600 dark:group-hover:text-cyan-300 transition-colors ${
                  isBright ? 'text-slate-900' : 'text-white'
                }`}>
                  {item.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key takeaway pill */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div className={`mt-3 p-2.5 rounded-xl text-[11px] font-medium border ${
                    isBright 
                      ? 'bg-amber-50/80 border-amber-200/80 text-amber-900' 
                      : 'bg-amber-950/20 border-amber-600/30 text-amber-300'
                  }`}>
                    <span className="font-bold font-mono uppercase text-[9px] block text-amber-700 dark:text-amber-400">
                      Operational Takeaway:
                    </span>
                    <span className="line-clamp-2 mt-0.5">
                      💡 {item.keyTakeaways[0]}
                    </span>
                  </div>
                )}
              </div>

              {/* Author & Footer Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-300 dark:ring-slate-700"
                    />
                    <div>
                      <p className="text-xs font-bold truncate max-w-[130px]">{item.authorName}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[130px]">{item.stationOrInstitute}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.attachmentFileName && (
                      <button
                        onClick={(e) => handleDownloadSOP(item, e)}
                        className={`p-1.5 rounded-lg text-xs font-mono transition-all ${
                          isBright
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : 'bg-emerald-950/50 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-600/40'
                        }`}
                        title="Download Document"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={(e) => handleUpvoteItem(item.id, e)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                        isBright
                          ? 'hover:bg-slate-100 text-slate-600 border border-slate-200'
                          : 'hover:bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                      title="Endorse Operational Finding"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>{item.upvotes}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: PEER & FACULTY DISCUSSION FORUM */}
      {activeSubTab === 'forum' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className={`text-base font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
              Technical Questions & Faculty Q&A
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Peer knowledge exchange for cadet forecasters and radar operators
            </span>
          </div>

          <div className="space-y-4">
            {forumQuestions.map((q) => (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isBright
                    ? 'bg-white border-slate-200 shadow-sm'
                    : 'bg-[#0a1120] border-slate-800 shadow-xl'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isBright ? 'bg-sky-100 text-sky-800' : 'bg-cyan-950 text-cyan-300 border border-cyan-700/50'
                      }`}>
                        {q.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Posted {q.postedAt}
                      </span>
                    </div>

                    <h4 className={`text-base font-bold ${isBright ? 'text-slate-900' : 'text-white'}`}>
                      {q.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {q.description}
                    </p>

                    <div className="flex items-center gap-2 pt-1 text-xs">
                      <img src={q.authorAvatar} alt={q.authorName} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{q.authorName}</span>
                      <span className="text-[11px] text-slate-400 font-mono">({q.authorRole})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setForumQuestions(prev => prev.map(item => item.id === q.id ? { ...item, upvotes: item.upvotes + 1 } : item));
                        sound.playBlip(750);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                        isBright
                          ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{q.upvotes}</span>
                    </button>
                    <button
                      onClick={() => setAnsweringQuestionId(answeringQuestionId === q.id ? null : q.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isBright
                          ? 'bg-sky-600 hover:bg-sky-500 text-white'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </button>
                  </div>
                </div>

                {/* Answers list */}
                {q.answers.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                    <span className="text-[11px] font-mono uppercase font-bold text-slate-400 block">
                      {q.answers.length} Faculty & Senior Responses:
                    </span>
                    {q.answers.map((ans) => (
                      <div
                        key={ans.id}
                        className={`p-3.5 rounded-xl border ${
                          ans.isFacultyVerified
                            ? isBright
                              ? 'bg-emerald-50/70 border-emerald-200/80 text-slate-800'
                              : 'bg-emerald-950/20 border-emerald-700/40 text-slate-200'
                            : isBright
                              ? 'bg-slate-50 border-slate-200'
                              : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <img src={ans.authorAvatar} alt={ans.authorName} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs font-bold">{ans.authorName}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({ans.authorRole})</span>
                            {ans.isFacultyVerified && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold font-mono bg-emerald-500 text-slate-950">
                                Verified Faculty
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">{ans.answeredAt}</span>
                        </div>
                        <p className="text-xs leading-relaxed mt-1 text-slate-700 dark:text-slate-300">
                          {ans.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer box if opened */}
                {answeringQuestionId === q.id && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-200">
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Write your meteorological explanation / protocol reference:
                    </label>
                    <textarea
                      rows={3}
                      value={answerContent}
                      onChange={(e) => setAnswerContent(e.target.value)}
                      placeholder="Reference WMO manual, radar reflectivity signatures, or local station calibration guidelines..."
                      className={`w-full p-3 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                        isBright
                          ? 'bg-white border-slate-300 text-slate-900 focus:ring-sky-500'
                          : 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-500'
                      }`}
                    />
                    <div className="flex items-center justify-end gap-2 mt-2">
                      <button
                        onClick={() => setAnsweringQuestionId(null)}
                        className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handlePostAnswer(q.id)}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          isBright
                            ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-xs'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-xs'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Answer (+100 XP)</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: FULL KNOWLEDGE ARTICLE READER */}
      {selectedItemForReading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 ${
            isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0a1122] border-cyan-500/40 text-white'
          }`}>
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-sky-500/20 text-sky-600 dark:text-sky-300">
                    {selectedItemForReading.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedItemForReading.competencyDomain} • {selectedItemForReading.readTimeMinutes} min read
                  </span>
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">
                  {selectedItemForReading.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItemForReading(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Author info */}
            <div className="flex items-center justify-between py-4 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <img
                  src={selectedItemForReading.authorAvatar}
                  alt={selectedItemForReading.authorName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30"
                />
                <div>
                  <h4 className="text-xs font-bold">{selectedItemForReading.authorName}</h4>
                  <p className="text-[11px] text-slate-400">{selectedItemForReading.authorDesignation}</p>
                  <p className="text-[10px] text-slate-500">{selectedItemForReading.stationOrInstitute}</p>
                </div>
              </div>

              {selectedItemForReading.attachmentFileName && (
                <button
                  onClick={(e) => handleDownloadSOP(selectedItemForReading, e)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isBright
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-xs'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download SOP ({selectedItemForReading.downloadsCount})</span>
                </button>
              )}
            </div>

            {/* Body */}
            <div className="py-5 space-y-4">
              <div className={`p-4 rounded-xl border ${
                isBright ? 'bg-sky-50/60 border-sky-200' : 'bg-cyan-950/20 border-cyan-600/30'
              }`}>
                <span className="text-[10px] font-mono font-bold uppercase text-sky-600 dark:text-cyan-400 block mb-1">
                  Executive Operational Summary:
                </span>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {selectedItemForReading.summary}
                </p>
              </div>

              {selectedItemForReading.keyTakeaways && (
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase font-bold text-slate-400">
                    Mandatory Standard Operating Takeaways:
                  </h4>
                  <ul className="space-y-1.5">
                    {selectedItemForReading.keyTakeaways.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase font-bold text-slate-400 mb-2">
                  Technical Documentation:
                </h4>
                <div className={`p-4 rounded-xl font-mono text-xs whitespace-pre-line leading-relaxed ${
                  isBright ? 'bg-slate-100 text-slate-800' : 'bg-slate-950/80 text-slate-300 border border-slate-800'
                }`}>
                  {selectedItemForReading.contentMarkdown}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {selectedItemForReading.tags.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={(e) => handleUpvoteItem(selectedItemForReading.id, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  isBright
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/40'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Endorse Case Finding ({selectedItemForReading.upvotes})</span>
              </button>

              <button
                onClick={() => setSelectedItemForReading(null)}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: CONTRIBUTE KNOWLEDGE / CASE DEBRIEF */}
      {isContributeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 ${
            isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0a1122] border-cyan-500/40 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-500" />
                  <span>Contribute Case Study or Operational SOP</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Share real-world radar observations, station calibration tips, or nowcasting debriefs with the IMD workforce.
                </p>
              </div>
              <button
                onClick={() => setIsContributeModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitContribution} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Document Title *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Doppler Radar Observations of Cyclone Remal: Coastal Rainband Dynamics"
                  className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                    isBright
                      ? 'bg-white border-slate-300 text-slate-900 focus:ring-sky-500'
                      : 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                    Document Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as KnowledgeItem['category'])}
                    className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                      isBright
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  >
                    <option value="Case Study">Case Study</option>
                    <option value="Standard Operating Procedure (SOP)">Standard Operating Procedure (SOP)</option>
                    <option value="Research Note">Research Note</option>
                    <option value="Field Observation">Field Observation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                    Competency Domain
                  </label>
                  <select
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value as KnowledgeItem['competencyDomain'])}
                    className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                      isBright
                        ? 'bg-white border-slate-300 text-slate-900'
                        : 'bg-slate-900 border-slate-800 text-white'
                    }`}
                  >
                    <option value="Radar Meteorology">Radar Meteorology</option>
                    <option value="Severe Nowcasting">Severe Nowcasting</option>
                    <option value="Cyclone Dynamics">Cyclone Dynamics</option>
                    <option value="Satellite & NWP">Satellite & NWP</option>
                    <option value="Agro-Advisory">Agro-Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Executive Operational Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="2-3 sentence overview explaining the operational relevance and key outcome..."
                  className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                    isBright
                      ? 'bg-white border-slate-300 text-slate-900 focus:ring-sky-500'
                      : 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Full Technical Text & Methodological Findings *
                </label>
                <textarea
                  rows={5}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Provide technical depth: radar settings, Nyquist parameters, reflectivity DBZ thresholds, or station alignment checklist..."
                  className={`w-full p-2.5 rounded-xl text-xs font-mono border focus:outline-none focus:ring-2 ${
                    isBright
                      ? 'bg-white border-slate-300 text-slate-900 focus:ring-sky-500'
                      : 'bg-slate-900 border-slate-800 text-white focus:ring-cyan-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Key Takeaways (one per line)
                </label>
                <textarea
                  rows={2}
                  value={newTakeaways}
                  onChange={(e) => setNewTakeaways(e.target.value)}
                  placeholder="Takeaway 1&#10;Takeaway 2"
                  className={`w-full p-2.5 rounded-xl text-xs border focus:outline-none focus:ring-2 ${
                    isBright
                      ? 'bg-white border-slate-300 text-slate-900'
                      : 'bg-slate-900 border-slate-800 text-white'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsContributeModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    isBright
                      ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                      : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  }`}
                >
                  Publish to Centralized Hub (+200 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASK FIELD EXPERT QUESTION */}
      {isNewQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 ${
            isBright ? 'bg-white border-slate-200 text-slate-900' : 'bg-[#0a1122] border-cyan-500/40 text-white'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-500" />
                <span>Ask Field Experts & Faculty</span>
              </h3>
              <button onClick={() => setIsNewQuestionModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostQuestion} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  required
                  value={questionTitle}
                  onChange={(e) => setQuestionTitle(e.target.value)}
                  placeholder="e.g. How to interpret negative ZDR in conical hail cores?"
                  className={`w-full p-2.5 rounded-xl text-xs border ${
                    isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Category
                </label>
                <select
                  value={questionCategory}
                  onChange={(e) => setQuestionCategory(e.target.value)}
                  className={`w-full p-2.5 rounded-xl text-xs border ${
                    isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <option value="Radar Meteorology">Radar Meteorology</option>
                  <option value="Severe Nowcasting">Severe Nowcasting</option>
                  <option value="Cyclone Dynamics">Cyclone Dynamics</option>
                  <option value="Satellite & NWP">Satellite & NWP</option>
                  <option value="Station Hardware">Station Hardware & Calibration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase font-mono text-slate-500 mb-1">
                  Context & Operational Details *
                </label>
                <textarea
                  rows={4}
                  required
                  value={questionDesc}
                  onChange={(e) => setQuestionDesc(e.target.value)}
                  placeholder="Describe the scenario, elevation angle, observed velocity/reflectivity values, and station conditions..."
                  className={`w-full p-2.5 rounded-xl text-xs border ${
                    isBright ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-800'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewQuestionModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 rounded-xl text-xs font-extrabold ${
                    isBright ? 'bg-sky-600 text-white' : 'bg-cyan-500 text-slate-950'
                  }`}
                >
                  Post to Forum (+50 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
