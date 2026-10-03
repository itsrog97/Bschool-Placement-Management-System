import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Eye,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  Plus,
  UploadCloud
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { Student } from '../types';
import { formatCurrencyLPA, formatStipend, getPlacementStatusStyle } from '../utils/formatters';
import { downloadCSV } from '../utils/exportEngine';

interface StudentsPageProps {
  onSelectStudent: (student: Student) => void;
  onNavigateTab?: (tab: string) => void;
}

export const StudentsPage: React.FC<StudentsPageProps> = ({ onSelectStudent, onNavigateTab }) => {
  const { students, globalSearch, setGlobalSearch, openQuickAction } = usePlaceComm();

  const [exportToast, setExportToast] = useState<string | null>(null);

  // Filters state
  const [filterBatch, setFilterBatch] = useState<string>('All');
  const [filterProgram, setFilterProgram] = useState<string>('All');
  const [filterCampus, setFilterCampus] = useState<string>('All');
  const [filterSpec, setFilterSpec] = useState<string>('All');
  const [filterFinalStatus, setFilterFinalStatus] = useState<string>('All');
  const [filterEligibility, setFilterEligibility] = useState<string>('All');
  const [filterExp, setFilterExp] = useState<string>('All');

  // Sorting state
  const [sortField, setSortField] = useState<keyof Student>('rollNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Column visibility
  const [showColumns, setShowColumns] = useState({
    rollNumber: true,
    name: true,
    program: true,
    campus: true,
    specialization: true,
    cgpa: true,
    workExp: true,
    finalStatus: true,
    shortlists: true,
    interviews: true,
    offers: true,
    placementCompany: true,
    ctc: true
  });
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // Filtered and sorted students
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      // Global / text search
      if (globalSearch) {
        const query = globalSearch.toLowerCase();
        const matchName = s.name.toLowerCase().includes(query);
        const matchRoll = s.rollNumber.toLowerCase().includes(query);
        const matchEmail = s.email.toLowerCase().includes(query);
        const matchCompany = (s.finalCompanyName || '').toLowerCase().includes(query);
        const matchSkills = s.skills.some(sk => sk.toLowerCase().includes(query));
        if (!matchName && !matchRoll && !matchEmail && !matchCompany && !matchSkills) return false;
      }

      if (filterBatch !== 'All' && s.batch !== filterBatch) return false;
      if (filterProgram !== 'All' && s.program !== filterProgram) return false;
      if (filterCampus !== 'All' && s.campus !== filterCampus) return false;
      if (filterSpec !== 'All' && s.specialization !== filterSpec) return false;
      if (filterFinalStatus !== 'All' && s.finalStatus !== filterFinalStatus) return false;
      if (filterEligibility === 'Eligible' && !s.isEligible) return false;
      if (filterEligibility === 'Ineligible' && s.isEligible) return false;

      if (filterExp !== 'All') {
        if (filterExp === 'Fresher' && s.workExpMonths > 0) return false;
        if (filterExp === '1-24' && (s.workExpMonths < 1 || s.workExpMonths > 24)) return false;
        if (filterExp === '25+' && s.workExpMonths < 25) return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (valA === undefined || valA === null) valA = '';
      if (valB === undefined || valB === null) valB = '';

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [students, globalSearch, filterBatch, filterProgram, filterCampus, filterSpec, filterFinalStatus, filterEligibility, filterExp, sortField, sortAsc]);

  const handleSort = (field: keyof Student) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleExportCSV = (exportFullMaster = true) => {
    const targetStudents = exportFullMaster ? students : filteredStudents;
    const exportData = targetStudents.map(s => ({
      'Roll Number': s.rollNumber,
      'Full Name': s.name,
      'Program': s.program,
      'Campus': 'IIFT Delhi',
      'Batch': s.batch,
      'Specialization': s.specialization,
      'Email': s.email,
      'Phone': s.phone,
      'Gender': s.gender,
      'CGPA': s.cgpa,
      'Work Experience (Mo)': s.workExpMonths,
      'UG Degree': s.ugDegree,
      'UG College': s.ugCollege,
      '10th Percent': s.tenthPercent,
      '12th Percent': s.twelfthPercent,
      'Eligibility': s.isEligible ? 'Eligible' : 'Not Eligible',
      'Shortlists Count': s.shortlistsCount,
      'Interviews Count': s.interviewsCount,
      'Offers Count': s.offersCount,
      'Summer Placement Status': s.summerStatus,
      'Summer Company': s.summerCompanyName || 'N/A',
      'Summer Stipend': s.summerStipend || 'N/A',
      'Summer PPO': s.summerPPO ? 'Yes' : 'No',
      'Final Placement Status': s.finalStatus,
      'Placement Company': s.finalCompanyName || 'N/A',
      'Final CTC (LPA)': s.finalCTC || 'N/A',
      'Final Fixed (LPA)': s.finalFixed || 'N/A',
      'Final Variable (LPA)': s.finalVariable || 'N/A',
      'Skills': s.skills.join(', '),
      'Committee Notes': s.notes || ''
    }));

    downloadCSV(exportFullMaster ? 'IIFT_Delhi_Master_Student_Database' : 'IIFT_Delhi_Filtered_Students', exportData);
    setExportToast(`Downloaded IIFT Delhi Master Student Database (${targetStudents.length} students) as CSV`);
    setTimeout(() => setExportToast(null), 3500);
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {exportToast && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">{exportToast}</span>
          </div>
          <button onClick={() => setExportToast(null)} className="text-emerald-200 hover:text-white font-bold ml-3">
            ✕
          </button>
        </div>
      )}

      {/* Top Header & Action Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">Student Master Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {filteredStudents.length} of {students.length} students enrolled at IIFT Delhi (MBA-IB &amp; MBA-BA)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Add Student */}
          <button
            onClick={() => openQuickAction('add-student')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </button>

          {/* Import from Excel Engine */}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('imports')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-300"
              title="Import or bulk update student records from Excel / CSV"
            >
              <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
              <span>Import Excel</span>
            </button>
          )}

          {/* Export to CSV Button */}
          <button
            onClick={() => handleExportCSV(true)}
            className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            title="Download complete IIFT Delhi Master Student Database as CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export to CSV</span>
          </button>

          {/* Column Visibility Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowColumnDropdown(!showColumnDropdown)}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-medium flex items-center gap-1 transition-colors border border-slate-300"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Columns</span>
            </button>

            {showColumnDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl text-slate-900 z-40 p-2 space-y-1 text-xs">
                <p className="font-semibold text-slate-500 text-[10px] uppercase px-1">Visible Columns</p>
                {Object.keys(showColumns).map(col => (
                  <label key={col} className="flex items-center gap-2 px-1 py-1 hover:bg-slate-50 cursor-pointer capitalize">
                    <input
                      type="checkbox"
                      checked={showColumns[col as keyof typeof showColumns]}
                      onChange={(e) => setShowColumns({ ...showColumns, [col]: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>{col.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Filter Bar (Airtable / Excel-like) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filters:</span>
        </div>

        {/* Batch Filter */}
        <select
          value={filterBatch}
          onChange={(e) => setFilterBatch(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Batches</option>
          <option value="2024-26">2024-26 (Final Placement)</option>
          <option value="2025-27">2025-27 (Summer Internship)</option>
        </select>

        {/* Program Filter */}
        <select
          value={filterProgram}
          onChange={(e) => setFilterProgram(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Programs</option>
          <option value="MBA-IB">MBA (IB)</option>
          <option value="MBA-BA">MBA (BA)</option>
        </select>

        {/* Specialization Filter */}
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
          <option value="Operations & Supply Chain">Operations &amp; Supply Chain</option>
        </select>

        {/* Final Status */}
        <select
          value={filterFinalStatus}
          onChange={(e) => setFilterFinalStatus(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Placement Statuses</option>
          <option value="Placed">Placed</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Unplaced">Unplaced</option>
        </select>

        {/* Work Experience */}
        <select
          value={filterExp}
          onChange={(e) => setFilterExp(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Experience</option>
          <option value="Fresher">Freshers (0 Mo)</option>
          <option value="1-24">1 - 24 Months</option>
          <option value="25+">25+ Months</option>
        </select>

        {/* Reset Filters */}
        {(filterBatch !== 'All' || filterProgram !== 'All' || filterSpec !== 'All' || filterFinalStatus !== 'All' || filterExp !== 'All') && (
          <button
            onClick={() => {
              setFilterBatch('All');
              setFilterProgram('All');
              setFilterSpec('All');
              setFilterFinalStatus('All');
              setFilterExp('All');
              setFilterEligibility('All');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium underline ml-auto"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Dense High-Performance Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold sticky top-0 select-none">
              <tr>
                {showColumns.rollNumber && (
                  <th onClick={() => handleSort('rollNumber')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap">
                    <div className="flex items-center gap-1 font-mono">
                      <span>Roll No</span>
                      {sortField === 'rollNumber' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.name && (
                  <th onClick={() => handleSort('name')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Student Name</span>
                      {sortField === 'name' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.program && <th className="py-2.5 px-3 whitespace-nowrap">Program / Batch</th>}
                {showColumns.specialization && <th className="py-2.5 px-3 whitespace-nowrap">Specialization</th>}
                {showColumns.cgpa && (
                  <th onClick={() => handleSort('cgpa')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>CGPA</span>
                      {sortField === 'cgpa' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.workExp && (
                  <th onClick={() => handleSort('workExpMonths')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>Work Exp</span>
                      {sortField === 'workExpMonths' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.finalStatus && <th className="py-2.5 px-3 whitespace-nowrap">Placement Status</th>}
                {showColumns.shortlists && (
                  <th onClick={() => handleSort('shortlistsCount')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Shortlists</span>
                      {sortField === 'shortlistsCount' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.interviews && (
                  <th onClick={() => handleSort('interviewsCount')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Interviews</span>
                      {sortField === 'interviewsCount' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.offers && (
                  <th onClick={() => handleSort('offersCount')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span>Offers</span>
                      {sortField === 'offersCount' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                {showColumns.placementCompany && <th className="py-2.5 px-3 whitespace-nowrap">Placed Company</th>}
                {showColumns.ctc && (
                  <th onClick={() => handleSort('finalCTC')} className="py-2.5 px-3 cursor-pointer hover:bg-slate-200/60 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span>CTC (LPA)</span>
                      {sortField === 'finalCTC' && (sortAsc ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                    </div>
                  </th>
                )}
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-500">
                    No students match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const badge = getPlacementStatusStyle(student.finalStatus);
                  return (
                    <tr
                      key={student.id}
                      onClick={() => onSelectStudent(student)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      {showColumns.rollNumber && (
                        <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-800 whitespace-nowrap">
                          {student.rollNumber}
                        </td>
                      )}
                      {showColumns.name && (
                        <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                          {student.name}
                        </td>
                      )}
                      {showColumns.program && (
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                          {student.program} · <span className="font-mono text-[11px]">{student.batch}</span>
                        </td>
                      )}
                      {showColumns.specialization && (
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                          {student.specialization}
                        </td>
                      )}
                      {showColumns.cgpa && (
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums font-semibold text-slate-800">
                          {student.cgpa.toFixed(2)}
                        </td>
                      )}
                      {showColumns.workExp && (
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-600">
                          {student.workExpMonths > 0 ? `${student.workExpMonths}m` : 'Fresher'}
                        </td>
                      )}
                      {showColumns.finalStatus && (
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {student.finalStatus}
                          </span>
                        </td>
                      )}
                      {showColumns.shortlists && (
                        <td className="py-2.5 px-3 font-mono text-center tabular-nums text-slate-800">
                          {student.shortlistsCount}
                        </td>
                      )}
                      {showColumns.interviews && (
                        <td className="py-2.5 px-3 font-mono text-center tabular-nums text-slate-800">
                          {student.interviewsCount}
                        </td>
                      )}
                      {showColumns.offers && (
                        <td className="py-2.5 px-3 font-mono text-center tabular-nums font-semibold text-purple-900">
                          {student.offersCount}
                        </td>
                      )}
                      {showColumns.placementCompany && (
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-800 font-medium">
                          {student.finalCompanyName || '—'}
                        </td>
                      )}
                      {showColumns.ctc && (
                        <td className="py-2.5 px-3 font-mono text-right tabular-nums font-semibold text-blue-900">
                          {student.finalCTC ? formatCurrencyLPA(student.finalCTC) : '—'}
                        </td>
                      )}
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStudent(student);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-700 rounded hover:bg-slate-100"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
