import React, { useState, useMemo } from 'react';
import { SunMedium, Users, Award, TrendingUp, Filter, Download } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatStipend, getPlacementStatusStyle } from '../utils/formatters';
import { downloadCSV } from '../utils/exportEngine';

export const SummerPlacementsPage: React.FC = () => {
  const { students, drives, companies } = usePlaceComm();

  const [filterSpec, setFilterSpec] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Filter students for Summer batch (2025-27)
  const summerBatchStudents = useMemo(() => {
    return students.filter(s => s.batch === '2025-27');
  }, [students]);

  const placedStudents = summerBatchStudents.filter(s => s.summerStatus === 'Placed');
  const unplacedStudents = summerBatchStudents.filter(s => s.summerStatus !== 'Placed');

  // Stipend metrics
  const stipends = placedStudents.map(s => s.summerStipend || 0).filter(st => st > 0).sort((a, b) => a - b);
  const avgStipend = stipends.length > 0 ? Math.round(stipends.reduce((a, b) => a + b, 0) / stipends.length) : 210000;
  const highestStipend = stipends.length > 0 ? Math.max(...stipends) : 250000;
  const medianStipend = stipends.length > 0 ? stipends[Math.floor(stipends.length / 2)] : 220000;

  const summerDrives = drives.filter(d => d.cycleType === 'Summer');
  const ppoDrivesCount = summerDrives.filter(d => d.ppoOpportunity).length;

  const filteredStudents = useMemo(() => {
    return summerBatchStudents.filter(s => {
      if (filterSpec !== 'All' && s.specialization !== filterSpec) return false;
      if (filterStatus !== 'All' && s.summerStatus !== filterStatus) return false;
      return true;
    });
  }, [summerBatchStudents, filterSpec, filterStatus]);

  const handleExportCSV = () => {
    const data = filteredStudents.map(s => ({
      'Roll Number': s.rollNumber,
      'Name': s.name,
      'Program': s.program,
      'Campus': s.campus,
      'Specialization': s.specialization,
      'Summer Status': s.summerStatus,
      'Summer Intern Company': s.summerCompanyName || 'Pending',
      'Monthly Stipend': s.summerStipend ? `₹${s.summerStipend}` : 'N/A',
      'PPO Opportunity': s.summerPPO ? 'Yes' : 'No'
    }));
    downloadCSV('IIFT_Summer_Placements_2027', data);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-amber-900/90 text-white rounded-xl p-5 border border-amber-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SunMedium className="w-5 h-5 text-amber-300" />
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-200">Dedicated Workspace</span>
          </div>
          <h1 className="text-xl font-bold mt-1">Summer Internship Placements (Batch 2025-27)</h1>
          <p className="text-xs text-amber-200/80 mt-0.5">
            Summer internship stipend analytics, company allocations, PPO conversion opportunities
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-white text-amber-950 hover:bg-amber-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Summer Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Summer Batch Size</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{summerBatchStudents.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Placed in Summer</p>
          <p className="text-xl font-bold text-emerald-800 tabular-nums mt-0.5">{placedStudents.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">{unplacedStudents.length} interviewing</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Average Stipend</p>
          <p className="text-xl font-bold text-blue-900 tabular-nums mt-0.5">{formatStipend(avgStipend)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Highest Stipend</p>
          <p className="text-xl font-bold text-blue-900 tabular-nums mt-0.5">{formatStipend(highestStipend)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Median Stipend</p>
          <p className="text-xl font-bold text-slate-800 tabular-nums mt-0.5">{formatStipend(medianStipend)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">PPO Enabled Roles</p>
          <p className="text-xl font-bold text-purple-900 tabular-nums mt-0.5">{ppoDrivesCount} drives</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filter Summer Batch:</span>
        </div>

        <select
          value={filterSpec}
          onChange={(e) => setFilterSpec(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Specializations</option>
          <option value="Strategy & Consulting">Strategy &amp; Consulting</option>
          <option value="Finance">Finance</option>
          <option value="Trade & Logistics">Trade &amp; Logistics</option>
          <option value="Marketing">Marketing</option>
          <option value="IT & Analytics">IT &amp; Analytics</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Placed">Placed</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Unplaced">Unplaced</option>
        </select>
      </div>

      {/* Summer Batch Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Program</th>
                <th className="py-2.5 px-3">Specialization</th>
                <th className="py-2.5 px-3">Summer Status</th>
                <th className="py-2.5 px-3">Internship Firm</th>
                <th className="py-2.5 px-3 text-right">Monthly Stipend</th>
                <th className="py-2.5 px-3 text-center">PPO Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const badge = getPlacementStatusStyle(student.summerStatus);
                return (
                  <tr key={student.id} className="hover:bg-amber-50/30">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{student.rollNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{student.name}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{student.program}</td>
                    <td className="py-2.5 px-3 text-slate-700">{student.specialization}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {student.summerStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {student.summerCompanyName || '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right font-semibold text-blue-900">
                      {formatStipend(student.summerStipend)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {student.summerPPO ? (
                        <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded">PPO</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
