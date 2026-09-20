import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  XCircle, 
  BarChart3, 
  BookOpen, 
  Award, 
  Bell, 
  Sparkles, 
  Plus, 
  Send, 
  Eye, 
  Filter, 
  Search, 
  Layers, 
  TrendingUp, 
  Clock 
} from 'lucide-react';
import { 
  UserAccount, 
  AdminAnnouncement, 
  AdminMonitoringStats, 
  UserRole 
} from '../types';
import { sound } from '../utils/audio';
import { useTheme } from '../context/ThemeContext';

interface AdminGovernanceDashboardProps {
  userAccounts: UserAccount[];
  announcements: AdminAnnouncement[];
  monitoringStats: AdminMonitoringStats;
  onUpdateUserAccounts: (updated: UserAccount[]) => void;
  onPublishAnnouncement: (announcement: AdminAnnouncement) => void;
}

export const AdminGovernanceDashboard: React.FC<AdminGovernanceDashboardProps> = ({
  userAccounts,
  announcements,
  monitoringStats,
  onUpdateUserAccounts,
  onPublishAnnouncement
}) => {
  const { isBright } = useTheme();
  const [activeTab, setActiveTab] = useState<'users' | 'monitoring' | 'announcements'>('users');
  const [userRoleFilter, setUserRoleFilter] = useState<'All' | UserRole>('All');
  const [userSearch, setUserSearch] = useState('');

  // New Announcement Form State
  const [isDraftingAnnouncement, setIsDraftingAnnouncement] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annCategory, setAnnCategory] = useState<AdminAnnouncement['category']>('Announcement');
  const [annPriority, setAnnPriority] = useState<AdminAnnouncement['priority']>('Normal');
  const [annActionUrl, setAnnActionUrl] = useState('');

  const handleApproveUser = (userId: string) => {
    sound.playSuccess();
    const updated = userAccounts.map((u) => {
      if (u.id === userId) {
        return { ...u, status: 'Active' as const };
      }
      return u;
    });
    onUpdateUserAccounts(updated);
  };

  const handleRejectUser = (userId: string) => {
    sound.playAlert();
    const updated = userAccounts.map((u) => {
      if (u.id === userId) {
        return { ...u, status: 'Suspended' as const };
      }
      return u;
    });
    onUpdateUserAccounts(updated);
  };

  const handleChangeUserRole = (userId: string, newRole: UserRole) => {
    sound.playBlip(700);
    const updated = userAccounts.map((u) => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });
    onUpdateUserAccounts(updated);
  };

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    sound.playSuccess();

    const newAnn: AdminAnnouncement = {
      id: `ann-${Date.now()}`,
      title: annTitle.trim(),
      category: annCategory,
      content: annContent.trim(),
      author: 'Directorate General, IMD HQ',
      publishedAt: 'Just now',
      publishedBy: 'Directorate General, IMD HQ',
      priority: annPriority,
      isPinned: annPriority === 'Urgent',
      targetRoles: ['Trainee', 'Trainer', 'Admin'],
      actionUrl: annActionUrl.trim() || undefined
    };

    onPublishAnnouncement(newAnn);
    setIsDraftingAnnouncement(false);
    setAnnTitle('');
    setAnnContent('');
    setAnnActionUrl('');
  };

  const filteredUsers = userAccounts.filter((u) => {
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const matchesQuery = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.organization.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl border transition-all ${
        isBright ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#0f172a] border-cyan-900/40 shadow-xl'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center text-2xl shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500 text-white">
                  Admin Module
                </span>
                <span className="text-xs font-semibold text-amber-800 font-mono">
                  Supervisory Directorate
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                User Governance, Monitoring Dashboards & Homepage Publishing
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Approve cadet/trainer registrations, supervise system-wide course & assessment telemetry, and broadcast announcements to the homepage.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                sound.playBlip(700);
                setIsDraftingAnnouncement(true);
                setActiveTab('announcements');
              }}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Bell className="w-4 h-4" />
              <span>Publish to Homepage</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'users'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Approval & Roles ({userAccounts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('monitoring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'monitoring'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Institutional Dashboards & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'announcements'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Homepage Announcements ({announcements.length})</span>
        </button>
      </div>

      {/* TAB 1: USER APPROVAL & ROLE MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, email, or station..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              {(['All', 'Trainee', 'Trainer', 'Admin'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setUserRoleFilter(r)}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    userRoleFilter === r
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-mono uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-3">User & Email</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Station / Institute</th>
                  <th className="px-4 py-3">Approval Status</th>
                  <th className="px-4 py-3 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      <div className="text-[11px] font-mono text-slate-500">{u.email}</div>
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleChangeUserRole(u.id, e.target.value as UserRole)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 font-bold text-slate-800 text-xs cursor-pointer"
                      >
                        <option value="Trainee">Trainee</option>
                        <option value="Trainer">Trainer</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>

                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {u.organization}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'Pending Approval'
                            ? 'bg-amber-100 text-amber-800 animate-pulse'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {u.status === 'Pending Approval' ? (
                          <>
                            <button
                              onClick={() => handleApproveUser(u.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectUser(u.id)}
                              className="px-2.5 py-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : u.status === 'Active' ? (
                          <button
                            onClick={() => handleRejectUser(u.id)}
                            className="px-2.5 py-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                          >
                            Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApproveUser(u.id)}
                            className="px-2.5 py-1 rounded-lg text-emerald-700 hover:bg-emerald-50 text-xs font-bold cursor-pointer"
                          >
                            Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: MONITORING DASHBOARDS (COURSES, ENROLLMENTS, CERTIFICATIONS, ASSESSMENTS, PARTICIPATION) */}
      {activeTab === 'monitoring' && (
        <div className="space-y-6">
          {/* Top 5 Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Courses Monitored</span>
              <div className="text-2xl font-black text-sky-700 mt-1">{monitoringStats.totalCourses}</div>
              <span className="text-[11px] text-emerald-600 font-bold">100% WMO BIP-M Aligned</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Total Enrollments</span>
              <div className="text-2xl font-black text-indigo-700 mt-1">{monitoringStats.totalEnrollments}</div>
              <span className="text-[11px] text-slate-500">Across 6 Met Regions</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Certificates Issued</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{monitoringStats.certificationsIssued}</div>
              <span className="text-[11px] text-emerald-600 font-bold">Cryptographically Verified</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Assessments Taken</span>
              <div className="text-2xl font-black text-amber-700 mt-1">{monitoringStats.assessmentsCompleted}</div>
              <span className="text-[11px] text-slate-500">Avg Pass Rate: {monitoringStats.assessmentPassRate}%</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Daily Study Hours</span>
              <div className="text-2xl font-black text-rose-700 mt-1">{monitoringStats.dailyActiveLearnerHours}h</div>
              <span className="text-[11px] text-emerald-600 font-bold">↑ 18% this month</span>
            </div>
          </div>

          {/* Regional Enrollments & Assessment Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>Station-wise Cadet Enrollments</span>
              </h3>
              <div className="space-y-2.5 pt-1 text-xs">
                {monitoringStats.stationEnrollmentBreakdown.map((st, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{st.station}</span>
                      <span className="font-mono text-sky-700">{st.count} Cadets</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${Math.min(100, (st.count / 150) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Subject Assessment Pass Performance</span>
              </h3>
              <div className="space-y-2.5 pt-1 text-xs">
                {monitoringStats.subjectPassRateBreakdown.map((sb, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800">{sb.subject}</span>
                      <span className="font-mono text-emerald-700">{sb.passRate}% Passed</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${sb.passRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HOMEPAGE PUBLISHING */}
      {activeTab === 'announcements' && (
        <div className="space-y-5">
          {isDraftingAnnouncement && (
            <form onSubmit={handlePublishSubmit} className="p-6 rounded-2xl bg-amber-50/70 border border-amber-300 space-y-4 shadow-sm animate-in fade-in text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-950 uppercase">
                  Broadcast to Institutional Homepage & Cadet Feed
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDraftingAnnouncement(false)}
                  className="text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Headline / Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Advanced WRF Parameterization Module Released"
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={annCategory}
                    onChange={(e) => setAnnCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="Announcement">Announcement</option>
                    <option value="Notification">Notification (Urgent)</option>
                    <option value="Achievement">Cadet Achievement</option>
                    <option value="Newly Added Learning Content">Newly Added Learning Content</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice Body Text</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed description of notice, milestone or syllabus addition..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Broadcast Priority</label>
                  <select
                    value={annPriority}
                    onChange={(e) => setAnnPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Pinned to Top)</option>
                    <option value="Urgent">Urgent Alert</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Action Link (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. #courses or #radar"
                    value={annActionUrl}
                    onChange={(e) => setAnnActionUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          )}

          {/* List of Published Announcements */}
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 transition-all shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      ann.category === 'Notification'
                        ? 'bg-rose-100 text-rose-800'
                        : ann.category === 'Achievement'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ann.category === 'Newly Added Learning Content'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                    }`}>
                      {ann.category}
                    </span>
                    {ann.priority === 'Urgent' && (
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold animate-pulse">
                        URGENT
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {ann.publishedAt}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900">
                  {ann.title}
                </h4>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {ann.content}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Author: {ann.publishedBy}</span>
                  <span className="text-emerald-700 font-bold">● Active on Homepage</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
