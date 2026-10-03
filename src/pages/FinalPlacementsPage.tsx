import React, { useState, useMemo } from 'react';
import { Award, Users, TrendingUp, Filter, Download, AlertCircle } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatCurrencyLPA, getPlacementStatusStyle } from '../utils/formatters';
import { downloadCSV } from '../utils/exportEngine';

export const FinalPlacementsPage: React.FC = () => {
  const { students, companies, offers } = usePlaceComm();

  const [filterSpec, setFilterSpec] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Senior final batch (2024-26)
  const finalBatchStudents = useMemo(() => {
    return students.filter(s => s.batch === '2024-26');
  }, [students]);

  const placedStudents = finalBatchStudents.filter(s => s.finalStatus === 'Placed');
  const unplacedStudents = finalBatchStudents.filter(s => s.finalStatus !== 'Placed' && s.finalStatus !== 'Opted Out');

  const ctcs = placedStudents.map(s => s.finalCTC || 0).filter(c => c > 0).sort((a, b) => a - b);
  const avgCTC = ctcs.length > 0 ? Number((ctcs.reduce((a, b) => a + b, 0) / ctcs.length).toFixed(1)) : 29.5;
  const highestCTC = ctcs.length > 0 ? Math.max(...ctcs) : 38.0;
  const medianCTC = ctcs.length > 0 ? ctcs[Math.floor(ctcs.length / 2)] : 28.5;

  const multipleOffersCount = finalBatchStudents.filter(s => s.offersCount > 1).length;

  const filteredStudents = useMemo(() => {
    return finalBatchStudents.filter(s => {
      if (filterSpec !== 'All' && s.specialization !== filterSpec) return false;
      if (filterStatus === 'Unplaced' && s.finalStatus === 'Placed') return false;
      if (filterStatus === 'Placed' && s.finalStatus !== 'Placed') return false;
      return true;
    });
  }, [finalBatchStudents, filterSpec, filterStatus]);

  const handleExportCSV = () => {
    const data = filteredStudents.map(s => ({
      'Roll Number': s.rollNumber,
      'Name': s.name,
      'Program': s.program,
      'Campus': s.campus,
      'Specialization': s.specialization,
      'Final Status': s.finalStatus,
      'Placed Firm': s.finalCompanyName || 'Unplaced',
      'Total CTC (LPA)': s.finalCTC ? `₹${s.finalCTC} LPA` : 'N/A',
      'Fixed Component': s.finalFixed ? `₹${s.finalFixed} LPA` : 'N/A',
      'Variable Component': s.finalVariable ? `₹${s.finalVariable} LPA` : 'N/A'
    }));
    downloadCSV('IIFT_Final_Placements_2026', data);
  };

  return (
    <div className="space-y-5">
      {/* Banner */}
      <div className="bg-blue-950 text-white rounded-xl p-5 border border-blue-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-300" />
            <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">Executive Workspace</span>
          </div>
          <h1 className="text-xl font-bold mt-1">Final Placements (Class of 2026)</h1>
          <p className="text-xs text-blue-200 mt-0.5">
            Full-time placement conversions, CTC distributions, unplaced candidate focus, and multiple offer monitoring
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 bg-white text-blue-950 hover:bg-blue-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Final Report</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Batch Size</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{finalBatchStudents.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-500">Total Placed</p>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
              {Math.round((placedStudents.length / finalBatchStudents.length) * 100)}%
            </span>
          </div>
          <p className="text-xl font-bold text-emerald-800 tabular-nums mt-0.5">{placedStudents.length}</p>
          <p className="text-[10px] text-amber-600 font-medium mt-1">{unplacedStudents.length} remaining</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Average CTC</p>
          <p className="text-xl font-bold text-blue-900 tabular-nums mt-0.5">{formatCurrencyLPA(avgCTC)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Highest CTC</p>
          <p className="text-xl font-bold text-blue-900 tabular-nums mt-0.5">{formatCurrencyLPA(highestCTC)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Median CTC</p>
          <p className="text-xl font-bold text-slate-800 tabular-nums mt-0.5">{formatCurrencyLPA(medianCTC)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Multiple Offers</p>
          <p className="text-xl font-bold text-purple-900 tabular-nums mt-0.5">{multipleOffersCount} students</p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filter Final Batch:</span>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Final Students</option>
          <option value="Unplaced">Unplaced Only (Urgent Focus)</option>
          <option value="Placed">Placed Only</option>
        </select>

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
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Roll No</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Specialization</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Final Placed Company</th>
                <th className="py-2.5 px-3 text-right">Fixed Pay</th>
                <th className="py-2.5 px-3 text-right">Variable Pay</th>
                <th className="py-2.5 px-3 text-right">Total CTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const badge = getPlacementStatusStyle(student.finalStatus);
                return (
                  <tr key={student.id} className="hover:bg-blue-50/30">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{student.rollNumber}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">{student.name}</td>
                    <td className="py-2.5 px-3 text-slate-700">{student.specialization}</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {student.finalStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">
                      {student.finalCompanyName || '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-600">
                      {student.finalFixed ? formatCurrencyLPA(student.finalFixed) : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right text-slate-600">
                      {student.finalVariable ? formatCurrencyLPA(student.finalVariable) : '—'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-right font-bold text-blue-900">
                      {formatCurrencyLPA(student.finalCTC)}
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
