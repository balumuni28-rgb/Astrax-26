import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Download,
  Printer,
  Trash2,
  FileCode,
  ArrowLeft,
  LogOut,
  Sparkles,
  Trophy,
  Filter,
  CheckCircle,
  ExternalLink,
  RefreshCw,
  Eye
} from 'lucide-react';
import { StudentRegistration, COMPETITIONS, COURSES, AdminAuth } from '../types';
import { registrationService } from '../services/registrationService';

interface AdminDashboardProps {
  adminAuth: AdminAuth;
  registrations: StudentRegistration[];
  onRegistrationsChange: (updated: StudentRegistration[]) => void;
  onRefresh?: () => void;
  onExitAdminView: () => void;
  onLogoutAdmin: () => void;
  onViewPass: (reg: StudentRegistration) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminAuth,
  registrations,
  onRegistrationsChange,
  onRefresh,
  onExitAdminView,
  onLogoutAdmin,
  onViewPass
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompFilter, setSelectedCompFilter] = useState('all');
  const [selectedYearFilter, setSelectedYearFilter] = useState('all');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [showPythonCodeModal, setShowPythonCodeModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    const fresh = registrationService.getRegistrations();
    onRegistrationsChange(fresh);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filtered registrations
  const filteredList = useMemo(() => {
    return registrations.filter((reg) => {
      const matchesSearch =
        reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.sucNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        reg.course.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesComp =
        selectedCompFilter === 'all' || reg.competitionId === selectedCompFilter;

      const matchesYear =
        selectedYearFilter === 'all' || reg.year === selectedYearFilter;

      const matchesCourse =
        selectedCourseFilter === 'all' || reg.course === selectedCourseFilter;

      return matchesSearch && matchesComp && matchesYear && matchesCourse;
    });
  }, [registrations, searchQuery, selectedCompFilter, selectedYearFilter, selectedCourseFilter]);

  // Statistics
  const trackStats = useMemo(() => {
    return COMPETITIONS.map((comp) => {
      const count = registrations.filter((r) => r.competitionId === comp.id).length;
      return {
        ...comp,
        count
      };
    });
  }, [registrations]);

  const handleDelete = (id: string) => {
    const success = registrationService.deleteRegistration(id);
    if (success) {
      onRegistrationsChange(registrationService.getRegistrations());
      setDeleteConfirmId(null);
    }
  };

  const handleResetData = () => {
    if (window.confirm('Reset all registrations to initial Aditya Degree College seed data?')) {
      const resetList = registrationService.resetToDefault();
      onRegistrationsChange(resetList);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      'SUC Code',
      'Student Name',
      'Class/Course',
      'Year of Study',
      'Competition Track',
      'Registered At'
    ];

    const rows = filteredList.map((r) => [
      `"${r.sucNumber}"`,
      `"${r.studentName}"`,
      `"${r.course}"`,
      `"${r.year}"`,
      `"${r.competitionTitle}"`,
      `"${r.registeredAt}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ASTRA_X26_Aditya_Registrations_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen pb-16 pt-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto animate-fade-in">
      
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#3d0712]/95 border border-amber-500/40 mb-8 shadow-xl">
        
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExitAdminView}
            className="p-2 rounded-xl bg-black/40 text-amber-300 hover:text-white hover:bg-black/70 border border-amber-500/30 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold"
            title="Return to public registration view"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Event Portal</span>
          </button>

          <div className="w-12 h-12 rounded-xl bg-white p-1 border border-amber-300 overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
            <img src="/aditya-logo.jpg" alt="Aditya Official Logo" className="w-full h-full object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Admin Console
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-400 text-black uppercase">
                Authorized
              </span>
            </div>
            <p className="text-xs text-amber-100/80">
              Administrator • Aditya Degree College
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowPythonCodeModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-100 bg-[#3d060f] hover:bg-[#520915] border border-amber-400/50 transition-all font-tech tracking-wider uppercase cursor-pointer"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Python Flask Backend</span>
          </button>

          <button
            type="button"
            onClick={onLogoutAdmin}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-200 bg-red-950/70 hover:bg-red-900 border border-red-500/50 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mb-8">
        
        {/* Total Metric Card */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1 p-4 rounded-2xl bg-gradient-to-br from-[#680e1e] to-[#3a050f] border-2 border-amber-300 shadow-[0_0_15px_rgba(212,175,55,0.4)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-xs font-bold uppercase font-tech tracking-wider">Total Enrolled</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-black text-white font-heading">{registrations.length}</span>
            <p className="text-[10px] text-amber-200/70 mt-0.5">Students Verified</p>
          </div>
        </div>

        {/* 6 Competition Metrics */}
        {trackStats.map((track) => (
          <div
            key={track.id}
            onClick={() => setSelectedCompFilter(selectedCompFilter === track.id ? 'all' : track.id)}
            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedCompFilter === track.id
                ? 'bg-amber-400/25 border-amber-300 shadow-[0_0_12px_rgba(212,175,55,0.5)]'
                : 'bg-black/40 border-amber-500/30 hover:border-amber-400/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-amber-300 uppercase tracking-tight truncate">
                {track.title}
              </span>
              <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-white font-heading">{track.count}</span>
              <span className="text-[10px] text-slate-400 block truncate">candidates</span>
            </div>
          </div>
        ))}

      </div>

      {/* Filter & Search Bar */}
      <div className="p-5 rounded-2xl theme-wine-cream-card border border-amber-500/40 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SUC code, student name, class..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/40 text-sm text-white placeholder-slate-400 focus:border-amber-300 focus:ring-1 focus:ring-amber-300 transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          
          <div className="flex items-center gap-1.5 text-xs text-amber-200">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedCompFilter}
              onChange={(e) => setSelectedCompFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-black/70 border border-amber-500/40 text-xs text-white focus:border-amber-300"
            >
              <option value="all">All Competitions ({registrations.length})</option>
              {COMPETITIONS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <select
            value={selectedYearFilter}
            onChange={(e) => setSelectedYearFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/70 border border-amber-500/40 text-xs text-white focus:border-amber-300"
          >
            <option value="all">All Academic Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
          </select>

          <select
            value={selectedCourseFilter}
            onChange={(e) => setSelectedCourseFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/70 border border-amber-500/40 text-xs text-white focus:border-amber-300 max-w-[180px]"
          >
            <option value="all">All Courses / Classes</option>
            {COURSES.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Export & Print */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all font-tech tracking-wider uppercase cursor-pointer"
            title="Download CSV file for attendance and evaluation"
          >
            <Download className="w-3.5 h-3.5 text-black" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-100 bg-black/50 hover:bg-black/70 border border-amber-500/40 transition-colors cursor-pointer"
            title="Print roster"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-100 bg-black/50 hover:bg-black/70 border border-amber-500/40 transition-colors cursor-pointer"
            title="Refresh latest registrations"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

        </div>

      </div>

      {/* Main Student Details Table (Requirement 6) */}
      <div className="rounded-2xl theme-wine-cream-card gold-border-lux overflow-hidden shadow-2xl">
        
        {/* Table Header Bar */}
        <div className="p-4 sm:p-5 bg-black/70 border-b border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>Registered Students Roster</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-black">
                  {filteredList.length} {filteredList.length === 1 ? 'Student' : 'Students'}
                </span>
              </h3>
              <p className="text-xs text-amber-200/70 mt-0.5">
                Live list of students enrolled from Aditya Degree College
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-300/80">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-[11px]">
              Active Admin: {adminAuth.username}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-black/60 border-b-2 border-amber-400/50 text-amber-300 uppercase font-tech tracking-wider text-[11px]">
                <th className="py-4 px-4 font-bold">SUC Code</th>
                <th className="py-4 px-4 font-bold">Student Name</th>
                <th className="py-4 px-4 font-bold">Class / Course</th>
                <th className="py-4 px-4 font-bold">Year</th>
                <th className="py-4 px-4 font-bold">Competition Track</th>
                <th className="py-4 px-4 font-bold">Registered Timestamp</th>
                <th className="py-4 px-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/20">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 px-4 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 mb-3">
                        <Users className="w-6 h-6" />
                      </div>
                      <p className="text-base font-bold text-white">
                        {registrations.length === 0
                          ? 'No Registered Students Yet'
                          : 'No Matching Registered Students'}
                      </p>
                      <p className="text-xs text-amber-200/70 mt-1">
                        {registrations.length === 0
                          ? 'When students submit their registration on the event portal, their SUC code, student name, class, year, and competition will instantly appear here for the admin.'
                          : 'Try changing your search query or competition track filters.'}
                      </p>
                      {registrations.length === 0 && (
                        <button
                          type="button"
                          onClick={onExitAdminView}
                          className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 transition-all cursor-pointer font-tech uppercase"
                        >
                          Go to Registration Form
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredList.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-amber-400/10 transition-colors"
                  >
                    {/* SUC Code */}
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                      <span className="px-2 py-1 rounded bg-black/50 border border-amber-500/40">
                        {student.sucNumber}
                      </span>
                    </td>

                    {/* Student Name */}
                    <td className="py-3.5 px-4 font-bold text-white">
                      {student.studentName}
                    </td>

                    {/* Class / Course */}
                    <td className="py-3.5 px-4 text-slate-200">
                      {student.course}
                    </td>

                    {/* Year */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-200 border border-amber-400/30">
                        {student.year}
                      </span>
                    </td>

                    {/* Competition */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#580a18] text-amber-200 border border-amber-400/50">
                        <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>{student.competitionTitle}</span>
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3.5 px-4 text-[11px] font-mono text-slate-400">
                      {student.registeredAt}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => onViewPass(student)}
                          className="p-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/40 text-amber-300 border border-amber-400/40 transition-colors cursor-pointer"
                          title="View & Print Entry Pass"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(student.id)}
                          className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-500/40 transition-colors cursor-pointer"
                          title="Remove registration"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="p-4 bg-black/60 border-t border-amber-500/30 flex items-center justify-between text-xs text-amber-200/70">
          <div>
            Showing <strong className="text-white">{filteredList.length}</strong> of{' '}
            <strong className="text-white">{registrations.length}</strong> total registered students.
          </div>
          <div className="text-[11px] text-amber-400">
            Aditya Degree College • ASTRA X&apos;26 Control System
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl theme-wine-cream-card gold-border-lux p-6 text-center">
            <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white font-heading">Cancel Registration?</h4>
            <p className="text-xs text-slate-300 mt-2">
              Are you sure you want to remove this candidate registration from ASTRA X&apos;26? This action will free up the SUC number.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-700 hover:bg-red-600 transition-colors cursor-pointer"
              >
                Yes, Delete Entry
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-black/50 hover:bg-black/80 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Python Flask Backend Architecture Modal (Requirement 11) */}
      {showPythonCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[85vh] rounded-3xl theme-wine-cream-card gold-border-lux p-6 flex flex-col shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-lg font-black text-amber-200 font-heading">
                    Python Flask &amp; SQLite Database Backend
                  </h3>
                  <p className="text-xs text-slate-300">
                    Built for Aditya Degree College • Source file: <code className="text-amber-300">backend/app.py</code>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPythonCodeModal(false)}
                className="p-1.5 rounded-lg bg-black/40 text-amber-200 hover:text-white border border-amber-500/30 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-xs text-slate-200 font-mono">
              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
                <span className="text-amber-300 font-bold block mb-1">
                  1. Run Flask Server Locally:
                </span>
                <p className="text-slate-300">pip install -r backend/requirements.txt</p>
                <p className="text-slate-300">python3 backend/app.py</p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
                <span className="text-amber-300 font-bold block mb-1">
                  2. Strict Rule Implementation in Python:
                </span>
                <p className="text-emerald-400"># Checks if SUC already exists in SQLite table</p>
                <p>cursor.execute(&quot;SELECT student_name, competition_title FROM registrations WHERE UPPER(suc_number) = ?&quot;, (suc_number,))</p>
                <p>{'if existing: return jsonify({"error": "One student may only participate in one competition."}), 409'}</p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-amber-500/30">
                <span className="text-amber-300 font-bold block mb-1">
                  3. Admin Authentication Logic:
                </span>
                <p className="text-slate-300">{'ALLOWED_ADMINS = {"varshu", "rampa", "jai"}'}</p>
                <p className="text-slate-300">{'password = "astra@aditya2026"'}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-amber-500/30 flex items-center justify-between">
              <span className="text-[11px] text-amber-300">
                Includes SQLite database integration + REST API endpoints.
              </span>
              <button
                type="button"
                onClick={() => setShowPythonCodeModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 font-tech uppercase"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
};
