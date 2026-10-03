import React, { useState, useMemo } from 'react';
import { Briefcase, Plus, Filter, Calendar, Users, Award, ExternalLink } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { RecruitmentDrive } from '../types';
import { formatCurrencyLPA, formatStipend, formatDate } from '../utils/formatters';

interface RecruitmentDrivesPageProps {
  onSelectCompanyByName: (companyName: string) => void;
}

export const RecruitmentDrivesPage: React.FC<RecruitmentDrivesPageProps> = ({ onSelectCompanyByName }) => {
  const { drives, shortlists, interviews, offers, openQuickAction, globalSearch } = usePlaceComm();

  const [filterCycle, setFilterCycle] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredDrives = useMemo(() => {
    return drives.filter(d => {
      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        const matchComp = d.companyName.toLowerCase().includes(q);
        const matchProfile = d.jobProfile.toLowerCase().includes(q);
        const matchCycle = d.cycle.toLowerCase().includes(q);
        if (!matchComp && !matchProfile && !matchCycle) return false;
      }

      if (filterCycle !== 'All' && d.cycle !== filterCycle) return false;
      if (filterType !== 'All' && d.cycleType !== filterType) return false;
      if (filterStatus !== 'All' && d.status !== filterStatus) return false;

      return true;
    });
  }, [drives, globalSearch, filterCycle, filterType, filterStatus]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">Recruitment Drives Management</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracking {filteredDrives.length} drives with job profiles, compensations, eligibility criteria and schedules
          </p>
        </div>

        <button
          onClick={() => openQuickAction('create-drive')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Open Recruitment Drive</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filter Drives:</span>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Cycle Types</option>
          <option value="Final">Final Placements</option>
          <option value="Summer">Summer Placements</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Drive Statuses</option>
          <option value="Applications Open">Applications Open</option>
          <option value="Shortlisting">Shortlisting</option>
          <option value="Interviews Scheduled">Interviews Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDrives.map(drive => {
          const driveShortlists = shortlists.filter(s => s.driveId === drive.id);
          const driveInterviews = interviews.filter(i => i.driveId === drive.id);
          const driveOffers = offers.filter(o => o.driveId === drive.id);

          return (
            <div key={drive.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <button
                    onClick={() => onSelectCompanyByName(drive.companyName)}
                    className="font-bold text-sm text-slate-900 hover:text-blue-700 flex items-center gap-1 text-left"
                  >
                    <span>{drive.companyName}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                  <p className="text-xs font-semibold text-blue-900 mt-0.5">{drive.jobProfile}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {drive.status}
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">{drive.cycle}</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                {drive.jobDescription || 'Standard campus role description.'}
              </p>

              <div className="grid grid-cols-3 gap-2 text-xs py-2 border-y border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Compensation</p>
                  <p className="font-mono font-bold text-blue-900 mt-0.5">
                    {drive.ctcLpa ? formatCurrencyLPA(drive.ctcLpa) : formatStipend(drive.stipendPerMonth)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Target Hires</p>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{drive.expectedHires} positions</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Min CGPA</p>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{drive.minCgpa}</p>
                </div>
              </div>

              {/* Progress metrics */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-slate-700">
                    Shortlisted: <strong className="font-mono text-slate-900">{driveShortlists.length}</strong>
                  </span>
                  <span className="font-medium text-slate-700">
                    Interviews: <strong className="font-mono text-slate-900">{driveInterviews.length}</strong>
                  </span>
                  <span className="font-medium text-slate-700">
                    Offers: <strong className="font-mono text-purple-900">{driveOffers.length}</strong>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {drive.interviewDate ? `Date: ${formatDate(drive.interviewDate)}` : 'Date TBD'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
