import React, { useState, useMemo } from 'react';
import { UserCheck, Plus, Filter, UploadCloud, Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatDate } from '../utils/formatters';
import { downloadCSV } from '../utils/exportEngine';

interface ShortlistsPageProps {
  onNavigateTab: (tab: string) => void;
}

export const ShortlistsPage: React.FC<ShortlistsPageProps> = ({ onNavigateTab }) => {
  const { shortlists, students, drives, openQuickAction, removeShortlist, canEdit } = usePlaceComm();

  const [activeTab, setActiveTab] = useState<'records' | 'distribution'>('records');
  const [filterDrive, setFilterDrive] = useState('All');
  const [filterRange, setFilterRange] = useState('All');

  // Distribution buckets (Section 18)
  const zeroShortlists = students.filter(s => s.shortlistsCount === 0);
  const oneToThree = students.filter(s => s.shortlistsCount >= 1 && s.shortlistsCount <= 3);
  const fivePlus = students.filter(s => s.shortlistsCount >= 5);

  const filteredShortlists = useMemo(() => {
    return shortlists.filter(s => {
      if (filterDrive !== 'All' && s.driveId !== filterDrive) return false;
      return true;
    });
  }, [shortlists, filterDrive]);

  const filteredDistributionStudents = useMemo(() => {
    if (filterRange === 'zero') return zeroShortlists;
    if (filterRange === '1-3') return oneToThree;
    if (filterRange === '5+') return fivePlus;
    return students;
  }, [filterRange, zeroShortlists, oneToThree, fivePlus, students]);

  const handleExportShortlists = () => {
    const data = filteredShortlists.map(s => ({
      'Company': s.companyName,
      'Profile': s.profile,
      'Cycle': s.cycle,
      'Roll Number': s.studentRoll,
      'Student Name': s.studentName,
      'Specialization': s.studentSpecialization,
      'CGPA': s.studentCgpa,
      'Round': s.roundName,
      'Shortlisted Date': s.shortlistedAt,
      'Imported By': s.importedBy
    }));
    downloadCSV('IIFT_Shortlists_Export', data);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">Shortlist Management &amp; Analytics</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of {shortlists.length} candidate shortlists processed across corporate drives
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('imports')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 border border-slate-300 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Bulk Upload Excel</span>
          </button>

          <button
            onClick={() => openQuickAction('add-shortlist')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shortlist</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              activeTab === 'records' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Shortlist Records ({shortlists.length})
          </button>
          <button
            onClick={() => setActiveTab('distribution')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              activeTab === 'distribution' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Shortlist Dashboard
          </button>
        </div>

        {activeTab === 'records' ? (
          <div className="flex items-center gap-2">
            <select
              value={filterDrive}
              onChange={(e) => setFilterDrive(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
            >
              <option value="All">All Drives</option>
              {drives.map(d => (
                <option key={d.id} value={d.id}>{d.companyName} · {d.jobProfile}</option>
              ))}
            </select>
            <button
              onClick={handleExportShortlists}
              className="px-2.5 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-medium border border-slate-300 flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <select
              value={filterRange}
              onChange={(e) => setFilterRange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
            >
              <option value="All">All Students</option>
              <option value="zero">Zero Shortlists ({zeroShortlists.length})</option>
              <option value="1-3">1 to 3 Shortlists ({oneToThree.length})</option>
              <option value="5+">5+ Shortlists ({fivePlus.length})</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Records Table */}
      {activeTab === 'records' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Profile</th>
                  <th className="py-2.5 px-3">Roll No</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Specialization</th>
                  <th className="py-2.5 px-3 text-right">CGPA</th>
                  <th className="py-2.5 px-3">Round</th>
                  <th className="py-2.5 px-3">Shortlisted Date</th>
                  {canEdit && <th className="py-2.5 px-3 text-right">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShortlists.map(sh => (
                  <tr key={sh.id} className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{sh.companyName}</td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{sh.profile}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 whitespace-nowrap">{sh.studentRoll}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">{sh.studentName}</td>
                    <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{sh.studentSpecialization}</td>
                    <td className="py-2.5 px-3 font-mono text-right font-medium text-slate-800 whitespace-nowrap">{sh.studentCgpa.toFixed(2)}</td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold text-[10px]">
                        {sh.roundName}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono whitespace-nowrap">{formatDate(sh.shortlistedAt)}</td>
                    {canEdit && (
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => removeShortlist(sh.id)}
                          className="text-rose-600 hover:text-rose-800 text-[11px] font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Distribution Dashboard */}
      {activeTab === 'distribution' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-rose-800 uppercase">Attention: 0 Shortlists</p>
              <p className="text-xl font-bold font-mono text-rose-950 mt-1">{zeroShortlists.length} candidates</p>
              <p className="text-[11px] text-rose-700 mt-0.5">Need immediate CV rework &amp; prep cell mapping</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-blue-800 uppercase">Active: 1 - 3 Shortlists</p>
              <p className="text-xl font-bold font-mono text-blue-950 mt-1">{oneToThree.length} candidates</p>
              <p className="text-[11px] text-blue-700 mt-0.5">Undergoing interview rounds</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-emerald-800 uppercase">High Traction: 5+ Shortlists</p>
              <p className="text-xl font-bold font-mono text-emerald-950 mt-1">{fivePlus.length} candidates</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">High probability of offer conversion</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Roll No</th>
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Program</th>
                    <th className="py-2.5 px-3">Specialization</th>
                    <th className="py-2.5 px-3 text-center">Shortlists</th>
                    <th className="py-2.5 px-3 text-center">Interviews</th>
                    <th className="py-2.5 px-3 text-center">Offers</th>
                    <th className="py-2.5 px-3">Final Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDistributionStudents.map(student => (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{student.rollNumber}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">{student.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{student.program} ({student.batch})</td>
                      <td className="py-2.5 px-3 text-slate-700">{student.specialization}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-bold text-blue-900">{student.shortlistsCount}</td>
                      <td className="py-2.5 px-3 font-mono text-center text-slate-800">{student.interviewsCount}</td>
                      <td className="py-2.5 px-3 font-mono text-center font-semibold text-purple-900">{student.offersCount}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-semibold text-slate-800">{student.finalStatus}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
