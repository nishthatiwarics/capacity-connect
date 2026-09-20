import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  Award, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ExternalLink, 
  Download, 
  ShieldCheck, 
  Star, 
  Layers, 
  Flame, 
  Calendar, 
  Check, 
  FileText 
} from 'lucide-react';
import { 
  StudentProfileData, 
  TraineeQualification, 
  TraineeWorkExperience, 
  TraineeSkill, 
  TraineeCertificate 
} from '../types';
import { ANIMAL_TIER_CONFIGS } from '../data/studentRankData';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface TraineeProfessionalProfileViewProps {
  profile: StudentProfileData;
  qualifications: TraineeQualification[];
  workExperience: TraineeWorkExperience[];
  interests: string[];
  skills: TraineeSkill[];
  certificates: TraineeCertificate[];
  onUpdateQualifications: (updated: TraineeQualification[]) => void;
  onUpdateWorkExperience: (updated: TraineeWorkExperience[]) => void;
  onUpdateInterests: (updated: string[]) => void;
  onUpdateSkills: (updated: TraineeSkill[]) => void;
  onViewCertificate?: (cert: TraineeCertificate) => void;
}

export const TraineeProfessionalProfileView: React.FC<TraineeProfessionalProfileViewProps> = ({
  profile,
  qualifications,
  workExperience,
  interests,
  skills,
  certificates,
  onUpdateQualifications,
  onUpdateWorkExperience,
  onUpdateInterests,
  onUpdateSkills,
  onViewCertificate
}) => {
  const { isBright } = useTheme();
  const [activeTab, setActiveTab] = useState<'qualifications' | 'experience' | 'skills' | 'interests' | 'certificates'>('qualifications');

  // Add Qualification Modal / Form State
  const [isAddingQual, setIsAddingQual] = useState(false);
  const [qualDegree, setQualDegree] = useState('');
  const [qualInstitution, setQualInstitution] = useState('');
  const [qualYear, setQualYear] = useState('2025');
  const [qualSpecialization, setQualSpecialization] = useState('');
  const [qualGrade, setQualGrade] = useState('');

  // Add Work Experience Modal / Form State
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [expRole, setExpRole] = useState('');
  const [expOrg, setExpOrg] = useState('');
  const [expPeriod, setExpPeriod] = useState('2025 - 2026');
  const [expResp, setExpResp] = useState('');

  // Add Skill State
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState(80);
  const [skillCategory, setSkillCategory] = useState<TraineeSkill['category']>('Meteorology');

  // Add Interest State
  const [newInterestInput, setNewInterestInput] = useState('');

  const rankConfig = ANIMAL_TIER_CONFIGS[profile.currentAnimalRank];

  const handleAddQualification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qualDegree.trim() || !qualInstitution.trim()) return;
    sound.playSuccess();
    const newQ: TraineeQualification = {
      id: `q-${Date.now()}`,
      degree: qualDegree.trim(),
      institution: qualInstitution.trim(),
      year: qualYear.trim(),
      specialization: qualSpecialization.trim() || 'Atmospheric Science',
      grade: qualGrade.trim() || 'First Class'
    };
    onUpdateQualifications([newQ, ...qualQualificationsState]);
    setIsAddingQual(false);
    setQualDegree('');
    setQualInstitution('');
    setQualSpecialization('');
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expRole.trim() || !expOrg.trim()) return;
    sound.playSuccess();
    const newE: TraineeWorkExperience = {
      id: `exp-${Date.now()}`,
      role: expRole.trim(),
      organization: expOrg.trim(),
      period: expPeriod.trim(),
      keyResponsibilities: expResp.trim() || 'Operational duties & radar surveillance'
    };
    onUpdateWorkExperience([newE, ...workExperience]);
    setIsAddingExp(false);
    setExpRole('');
    setExpOrg('');
    setExpResp('');
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    sound.playSuccess();
    const newS: TraineeSkill = {
      name: skillName.trim(),
      level: Number(skillLevel) || 75,
      category: skillCategory
    };
    onUpdateSkills([newS, ...skills]);
    setIsAddingSkill(false);
    setSkillName('');
  };

  const handleAddInterest = () => {
    if (!newInterestInput.trim()) return;
    if (interests.includes(newInterestInput.trim())) return;
    sound.playBlip(700);
    onUpdateInterests([...interests, newInterestInput.trim()]);
    setNewInterestInput('');
  };

  const handleRemoveInterest = (item: string) => {
    sound.playBlip(500);
    onUpdateInterests(interests.filter((i) => i !== item));
  };

  const qualQualificationsState = qualifications;

  return (
    <div className="space-y-6">
      {/* Profile Header Dossier */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isBright
          ? 'bg-white border-slate-200 shadow-2xs'
          : 'bg-[#0d1629] border-cyan-900/40 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-sky-400/50 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-sky-600 rounded-full text-white shadow text-xs">
                👤
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-sky-50 text-sky-700 border border-sky-300">
                  SIH Professional Profile
                </span>
                <span className="font-mono text-xs text-slate-500 font-bold">
                  {profile.badgeNumber}
                </span>
              </div>

              <p className="text-xs font-semibold text-sky-800 mt-1">
                {profile.designation} • {profile.stationName}
              </p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-600">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 flex items-center gap-1">
                  <span>{rankConfig.animalEmoji}</span>
                  <span>Rank: {rankConfig.rank}</span>
                </span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {profile.dailyStreak}d Streak
                </span>
                <span>•</span>
                <span className="font-mono text-indigo-700 font-bold">
                  {profile.xp} XP Accumulated
                </span>
                <span>•</span>
                <span className="font-mono text-emerald-700 font-bold">
                  {certificates.length} Verified Certificates
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                sound.playBlip(700);
                setIsAddingQual(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Qualification</span>
            </button>
            <button
              onClick={() => {
                sound.playBlip(700);
                setIsAddingExp(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Experience</span>
            </button>
          </div>
        </div>

        {/* Cadets Motto */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="italic">
            "{profile.cadetMotto || 'Dedication to national safety through high-precision nowcasting and atmospheric vigilance.'}"
          </span>
          <span className="font-mono text-[11px] text-slate-500 font-bold">
            Joined: {profile.joinedDate}
          </span>
        </div>
      </div>

      {/* Sub-Nav Tabs for Profile Sections */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('qualifications')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'qualifications'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Qualifications ({qualifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'experience'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Work Experience ({workExperience.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'skills'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Skills Matrix ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('interests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'interests'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Star className="w-4 h-4" />
          <span>Interests ({interests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'certificates'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Certificates & Credentials ({certificates.length})</span>
        </button>
      </div>

      {/* SECTION 1: QUALIFICATIONS */}
      {activeTab === 'qualifications' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-sky-600" />
              <span>Academic & Professional Qualifications</span>
            </h3>
            <button
              onClick={() => setIsAddingQual(true)}
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualifications.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-all shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {q.degree}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-100 text-slate-700">
                    {q.year}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-600">
                  {q.institution}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-sky-700 font-bold">
                    Specialization: {q.specialization}
                  </span>
                  {q.grade && (
                    <span className="text-emerald-700 font-mono font-bold">
                      {q.grade}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form Modal when adding */}
          {isAddingQual && (
            <form
              onSubmit={handleAddQualification}
              className="p-5 rounded-2xl bg-sky-50/70 border border-sky-300 space-y-4 shadow-sm animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-sky-900">
                  Add New Qualification / Degree
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingQual(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Tech Atmospheric Remote Sensing"
                    value={qualDegree}
                    onChange={(e) => setQualDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">University / Institution</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. IIT Delhi / CUSAT"
                    value={qualInstitution}
                    onChange={(e) => setQualInstitution(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year of Graduation</label>
                  <input
                    type="text"
                    value={qualYear}
                    onChange={(e) => setQualYear(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Radar Meteorology & Nowcasting"
                    value={qualSpecialization}
                    onChange={(e) => setQualSpecialization(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Qualification
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SECTION 2: WORK EXPERIENCE */}
      {activeTab === 'experience' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-sky-600" />
              <span>Operational & Meteorological Work Experience</span>
            </h3>
            <button
              onClick={() => setIsAddingExp(true)}
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Role</span>
            </button>
          </div>

          <div className="space-y-3">
            {workExperience.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-all shadow-2xs space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h4 className="text-sm font-extrabold text-slate-900">
                    {exp.role}
                  </h4>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>

                <p className="text-xs font-bold text-sky-800">
                  {exp.organization}
                </p>

                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {exp.keyResponsibilities}
                </p>
              </div>
            ))}
          </div>

          {isAddingExp && (
            <form
              onSubmit={handleAddExperience}
              className="p-5 rounded-2xl bg-sky-50/70 border border-sky-300 space-y-4 shadow-sm animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-sky-900">
                  Add Work Experience Record
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingExp(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Assistant Forecaster"
                    value={expRole}
                    onChange={(e) => setExpRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Organization / Station</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Regional Met Centre, Mumbai"
                    value={expOrg}
                    onChange={(e) => setExpOrg(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Duration / Period</label>
                  <input
                    type="text"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Key Responsibilities</label>
                  <input
                    type="text"
                    placeholder="e.g. Synoptic chart analysis, nowcast bulletin dispatch"
                    value={expResp}
                    onChange={(e) => setExpResp(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Save Experience
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SECTION 3: SKILLS MATRIX */}
      {activeTab === 'skills' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <span>Competency Skill Matrix & Proficiency Levels</span>
            </h3>
            <button
              onClick={() => setIsAddingSkill(true)}
              className="text-xs font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Skill</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((s, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">{s.name}</span>
                  <span className="font-mono font-bold text-sky-700">{s.level}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      s.level >= 85
                        ? 'bg-emerald-500'
                        : s.level >= 70
                          ? 'bg-sky-500'
                          : 'bg-amber-500'
                    }`}
                    style={{ width: `${s.level}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Category: {s.category}</span>
                  <span className="font-bold text-slate-600">
                    {s.level >= 85 ? 'Specialist Level' : 'Proficient'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {isAddingSkill && (
            <form
              onSubmit={handleAddSkill}
              className="p-5 rounded-2xl bg-sky-50/70 border border-sky-300 space-y-3 text-xs shadow-sm"
            >
              <h4 className="font-black text-sky-900 uppercase">Add Skill to Profile</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Skill name (e.g. DWR Velocity Dealiasing)"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
                <select
                  value={skillCategory}
                  onChange={(e) => setSkillCategory(e.target.value as any)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl"
                >
                  <option value="Meteorology">Meteorology</option>
                  <option value="Instruments & Radar">Instruments & Radar</option>
                  <option value="Computing & NWP">Computing & NWP</option>
                  <option value="Advisories">Advisories</option>
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(Number(e.target.value))}
                    className="w-full accent-sky-600"
                  />
                  <span className="font-mono font-bold text-slate-800">{skillLevel}%</span>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSkill(false)}
                  className="px-3 py-1.5 text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-sky-600 text-white font-bold"
                >
                  Save Skill
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* SECTION 4: INTERESTS */}
      {activeTab === 'interests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Star className="w-4 h-4 text-sky-600" />
              <span>Meteorological Research & Operational Interests</span>
            </h3>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <p className="text-xs text-slate-600">
              Interests help match you with suitable advanced training tracks and guest faculty masterclasses across IMD.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-2 group shadow-2xs"
                >
                  <span>{interest}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveInterest(interest)}
                    className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Remove interest"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 max-w-md pt-2">
              <input
                type="text"
                placeholder="Add new research interest (e.g. Polarimetric Microphysics)..."
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
                className="flex-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={handleAddInterest}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: CERTIFICATES */}
      {activeTab === 'certificates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-sky-600" />
              <span>Official Accreditation & Verified Certificates</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 transition-all shadow-2xs flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-lg">
                      📜
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified
                    </span>
                  </div>

                  <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                    {cert.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 mt-1">
                    Issuer: {cert.issuer}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Issued: {cert.issueDate}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-mono text-[10px] text-sky-700 font-bold">
                    {cert.credentialCode}
                  </span>
                  <button
                    onClick={() => onViewCertificate?.(cert)}
                    className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
