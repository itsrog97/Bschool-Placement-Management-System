import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Plus,
  Filter,
  Video,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  List,
  LayoutGrid
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { Interview, InterviewStatus, InterviewResult } from '../types';
import { formatDate } from '../utils/formatters';
import { InterviewsCalendar } from '../components/InterviewsCalendar';

export const InterviewsPage: React.FC = () => {
  const {
    interviews,
    drives,
    updateInterview,
    updateInterviewStatus,
    updateDrive,
    addAuditLog,
    openQuickAction,
    canEdit
  } = usePlaceComm();

  const [activeView, setActiveView] = useState<'calendar' | 'list'>('calendar');
  const [viewFilter, setViewFilter] = useState<'today' | 'upcoming' | 'all'>('today');
  const [filterCompany, setFilterCompany] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const todayStr = '2026-10-03';

  const companiesList = useMemo(() => {
    return Array.from(new Set(interviews.map(i => i.companyName))).sort();
  }, [interviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter(i => {
      if (viewFilter === 'today' && i.date !== todayStr) return false;
      if (viewFilter === 'upcoming' && i.date < todayStr) return false;
      if (filterCompany !== 'All' && i.companyName !== filterCompany) return false;
      if (filterStatus !== 'All' && i.status !== filterStatus) return false;
      return true;
    }).sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.startTime.localeCompare(b.startTime);
    });
  }, [interviews, viewFilter, filterCompany, filterStatus, todayStr]);

  // Reschedule handlers
  const handleRescheduleInterview = (interviewId: string, newDate: string) => {
    const targetInt = interviews.find(i => i.id === interviewId);
    if (!targetInt) return;

    updateInterview(interviewId, {
      date: newDate,
      status: targetInt.status === 'Completed' ? 'Completed' : 'Rescheduled'
    });

    addAuditLog(
      'RESCHEDULE_INTERVIEW',
      'Interview',
      interviewId,
      `Rescheduled interview for candidate ${targetInt.studentName} (${targetInt.companyName}) from ${formatDate(targetInt.date)} to ${formatDate(newDate)}`
    );
  };

  const handleRescheduleDrive = (driveId: string, newDate: string) => {
    const targetDrive = drives.find(d => d.id === driveId);
    if (!targetDrive) return;

    updateDrive(driveId, {
      interviewDate: newDate
    });

    addAuditLog(
      'RESCHEDULE_DRIVE',
      'RecruitmentDrive',
      driveId,
      `Rescheduled recruitment drive for ${targetDrive.companyName} (${targetDrive.jobProfile}) to ${formatDate(newDate)}`
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">Interviews &amp; Drive Scheduling</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Interactive visual calendar for placement drives, student interview slots, and drag-and-drop rescheduling
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Calendar vs List View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeView === 'calendar' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Calendar View</span>
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeView === 'list' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Cards List</span>
            </button>
          </div>

          <button
            onClick={() => openQuickAction('schedule-interview')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Slot</span>
          </button>
        </div>
      </div>

      {/* Main View: Calendar View */}
      {activeView === 'calendar' && (
        <InterviewsCalendar
          interviews={interviews}
          drives={drives}
          onRescheduleInterview={handleRescheduleInterview}
          onRescheduleDrive={handleRescheduleDrive}
          onUpdateInterviewStatus={updateInterviewStatus}
          canEdit={canEdit}
        />
      )}

      {/* Alternative View: Cards / List View */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {/* Sub-Tabs & Filters for List View */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setViewFilter('today')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  viewFilter === 'today' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Today&apos;s Lineup (3 Oct)
              </button>
              <button
                onClick={() => setViewFilter('upcoming')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  viewFilter === 'upcoming' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Upcoming Interviews
              </button>
              <button
                onClick={() => setViewFilter('all')}
                className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                  viewFilter === 'all' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Scheduled ({interviews.length})
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
              >
                <option value="All">All Companies</option>
                {companiesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Confirmed">Confirmed</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredInterviews.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 shadow-xs">
                No interviews scheduled matching the selected filters.
              </div>
            ) : (
              filteredInterviews.map(interview => (
                <div
                  key={interview.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                        {interview.startTime} - {interview.endTime}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{interview.companyName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs font-semibold text-slate-700">{interview.round}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{interview.profile}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-700 flex-wrap">
                      <span className="font-medium">
                        Candidate: <strong>{interview.studentName}</strong> <span className="font-mono text-slate-500">({interview.studentRoll})</span>
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500">Interviewer: {interview.interviewerName || 'Panel'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-mono text-slate-500">Date: {formatDate(interview.date)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {interview.mode === 'Online' ? (
                        <span className="flex items-center gap-1 text-blue-700 bg-blue-50/70 px-2 py-0.5 rounded font-medium">
                          <Video className="w-3.5 h-3.5" />
                          <a href={interview.venueOrLink} target="_blank" rel="noreferrer" className="hover:underline truncate max-w-xs">
                            {interview.venueOrLink}
                          </a>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-medium">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{interview.venueOrLink}</span>
                        </span>
                      )}
                      {interview.feedback && (
                        <span className="italic text-slate-600 truncate max-w-sm">
                          &quot;{interview.feedback}&quot;
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status and Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                    {canEdit && (
                      <select
                        value={interview.status}
                        onChange={(e) => updateInterviewStatus(interview.id, e.target.value as InterviewStatus)}
                        className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 font-semibold"
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Rescheduled">Rescheduled</option>
                        <option value="No Show">No Show</option>
                      </select>
                    )}

                    {canEdit && (
                      <select
                        value={interview.result}
                        onChange={(e) => updateInterviewStatus(interview.id, interview.status, e.target.value as InterviewResult)}
                        className={`border rounded px-2 py-1 text-xs font-semibold ${
                          interview.result === 'Selected' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                          interview.result === 'Rejected' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                          'bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        <option value="Pending">Result: Pending</option>
                        <option value="Selected">Result: Selected</option>
                        <option value="Rejected">Result: Rejected</option>
                        <option value="Waitlisted">Result: Waitlisted</option>
                      </select>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
