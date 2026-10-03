import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  Building2,
  User,
  X,
  AlertCircle,
  ExternalLink,
  GripVertical
} from 'lucide-react';
import { Interview, RecruitmentDrive, InterviewStatus, InterviewResult } from '../types';
import { formatDate } from '../utils/formatters';

interface InterviewsCalendarProps {
  interviews: Interview[];
  drives: RecruitmentDrive[];
  onRescheduleInterview: (interviewId: string, newDate: string) => void;
  onRescheduleDrive: (driveId: string, newDate: string) => void;
  onUpdateInterviewStatus?: (id: string, status: InterviewStatus, result?: InterviewResult, feedback?: string) => void;
  canEdit: boolean;
}

export const InterviewsCalendar: React.FC<InterviewsCalendarProps> = ({
  interviews,
  drives,
  onRescheduleInterview,
  onRescheduleDrive,
  onUpdateInterviewStatus,
  canEdit
}) => {
  // Calendar state initialized to October 2026 (the active placement season in mock data)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October

  const [draggedItem, setDraggedItem] = useState<{
    type: 'interview' | 'drive';
    id: string;
    title: string;
    oldDate: string;
  } | null>(null);

  const [dragOverDate, setDragOverDate] = useState<string | null>(null);
  const [rescheduleToast, setRescheduleToast] = useState<{ message: string } | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  // Filters inside calendar
  const [filterCompany, setFilterCompany] = useState<string>('All');
  const [filterType, setFilterType] = useState<'all' | 'interviews' | 'drives'>('all');

  const todayStr = '2026-10-03';

  // Navigation helpers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const handleToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(9); // October 2026
  };

  // Month metadata
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar Grid generation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7; // Monday = 0

  // Preceding month trailing days
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Preceding padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const m = currentMonth + 1;
      const dateStr = `${currentYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: true });
    }

    // Trailing padding to make full 35 or 42 cells (7 columns)
    const totalCells = Math.ceil(days.length / 7) * 7;
    const remaining = totalCells - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({ dateStr, dayNum: d, isCurrentMonth: false });
    }

    return days;
  }, [currentYear, currentMonth, daysInMonth, firstDayIndex, prevMonthDays]);

  // Companies dropdown list
  const companiesList = useMemo(() => {
    const set = new Set<string>();
    interviews.forEach(i => set.add(i.companyName));
    drives.forEach(d => set.add(d.companyName));
    return Array.from(set).sort();
  }, [interviews, drives]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const map: { [dateStr: string]: { interviews: Interview[]; drives: RecruitmentDrive[] } } = {};

    interviews.forEach(int => {
      if (filterCompany !== 'All' && int.companyName !== filterCompany) return;
      if (!map[int.date]) map[int.date] = { interviews: [], drives: [] };
      map[int.date].interviews.push(int);
    });

    drives.forEach(drv => {
      if (!drv.interviewDate) return;
      if (filterCompany !== 'All' && drv.companyName !== filterCompany) return;
      if (!map[drv.interviewDate]) map[drv.interviewDate] = { interviews: [], drives: [] };
      map[drv.interviewDate].drives.push(drv);
    });

    return map;
  }, [interviews, drives, filterCompany]);

  // Drag and drop handlers
  const handleDragStart = (
    e: React.DragEvent,
    type: 'interview' | 'drive',
    id: string,
    title: string,
    oldDate: string
  ) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ type, id, title, oldDate }));
    e.dataTransfer.effectAllowed = 'move';
    setDraggedItem({ type, id, title, oldDate });
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverDate !== dateStr) {
      setDragOverDate(dateStr);
    }
  };

  const handleDragLeave = (e: React.DragEvent, dateStr: string) => {
    if (dragOverDate === dateStr) {
      setDragOverDate(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDragOverDate(null);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      if (!dataStr) return;
      const data = JSON.parse(dataStr) as { type: 'interview' | 'drive'; id: string; title: string; oldDate: string };

      if (data.oldDate === targetDate) {
        setDraggedItem(null);
        return; // dropped on same day
      }

      if (data.type === 'interview') {
        onRescheduleInterview(data.id, targetDate);
        setRescheduleToast({
          message: `Rescheduled interview for "${data.title}" to ${formatDate(targetDate)}`
        });
      } else if (data.type === 'drive') {
        onRescheduleDrive(data.id, targetDate);
        setRescheduleToast({
          message: `Rescheduled drive "${data.title}" to ${formatDate(targetDate)}`
        });
      }

      setTimeout(() => setRescheduleToast(null), 4000);
    } catch {
      // ignore parse errors
    } finally {
      setDraggedItem(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Toast Notification for Rescheduling */}
      {rescheduleToast && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">{rescheduleToast.message}</span>
          </div>
          <button onClick={() => setRescheduleToast(null)} className="text-emerald-200 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Calendar Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Month Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-bold text-slate-900 min-w-[130px] text-center font-sans">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-white transition-colors"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-2.5 py-1.5 bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold rounded-md border border-blue-200 transition-colors"
          >
            Today (3 Oct 2026)
          </button>
        </div>

        {/* Drag and Drop instructions prompt */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
          <span><strong>Drag &amp; Drop</strong> any interview or drive card to reschedule its date.</span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium"
          >
            <option value="All">All Companies</option>
            {companiesList.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium"
          >
            <option value="all">All Events</option>
            <option value="interviews">Interviews Only</option>
            <option value="drives">Placement Drives Only</option>
          </select>
        </div>
      </div>

      {/* Month Calendar Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        {/* Day Header */}
        <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center text-xs font-semibold text-slate-600">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="py-2.5 border-r border-slate-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Day Cells Grid */}
        <div className="grid grid-cols-7 auto-rows-fr divide-y divide-slate-200">
          {calendarDays.map((cell, idx) => {
            const isToday = cell.dateStr === todayStr;
            const isOver = dragOverDate === cell.dateStr;
            const dayEvents = eventsByDate[cell.dateStr] || { interviews: [], drives: [] };

            const showDrives = filterType === 'all' || filterType === 'drives';
            const showInterviews = filterType === 'all' || filterType === 'interviews';

            const driveCount = dayEvents.drives.length;
            const interviewCount = dayEvents.interviews.length;
            const totalCount = (showDrives ? driveCount : 0) + (showInterviews ? interviewCount : 0);

            return (
              <div
                key={cell.dateStr + idx}
                onDragOver={(e) => handleDragOver(e, cell.dateStr)}
                onDragLeave={(e) => handleDragLeave(e, cell.dateStr)}
                onDrop={(e) => handleDrop(e, cell.dateStr)}
                className={`min-h-[120px] p-1.5 border-r border-slate-200 last:border-r-0 flex flex-col justify-between transition-all ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/50 text-slate-400'
                    : isToday
                    ? 'bg-blue-50/20'
                    : 'bg-white text-slate-800'
                } ${
                  isOver
                    ? 'ring-2 ring-blue-500 bg-blue-50/80 border-blue-400'
                    : ''
                }`}
              >
                {/* Date Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday
                        ? 'bg-blue-600 text-white shadow-xs'
                        : cell.isCurrentMonth
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {cell.dayNum}
                  </span>

                  {totalCount > 0 && (
                    <span className="text-[10px] font-semibold text-slate-500">
                      {totalCount} event{totalCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {/* Event Cards inside cell */}
                <div className="space-y-1 overflow-y-auto max-h-[140px] flex-1">
                  {/* Scheduled Placement Drives */}
                  {showDrives &&
                    dayEvents.drives.map(drive => (
                      <div
                        key={drive.id}
                        draggable={canEdit}
                        onDragStart={(e) =>
                          handleDragStart(e, 'drive', drive.id, `${drive.companyName} (${drive.jobProfile})`, drive.interviewDate || '')
                        }
                        className={`p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-950 rounded border border-indigo-200 text-[11px] leading-tight transition-all shadow-2xs ${
                          canEdit ? 'cursor-grab active:cursor-grabbing hover:scale-[1.01]' : ''
                        }`}
                        title={`Placement Drive: ${drive.companyName} - ${drive.jobProfile}. Drag to reschedule.`}
                      >
                        <div className="flex items-center gap-1 font-bold text-indigo-900 truncate">
                          <Building2 className="w-3 h-3 text-indigo-600 shrink-0" />
                          <span className="truncate">{drive.companyName}</span>
                        </div>
                        <p className="text-[10px] text-indigo-700 truncate mt-0.5">{drive.jobProfile}</p>
                        <div className="flex items-center justify-between text-[9px] text-indigo-600 mt-1 font-semibold">
                          <span>{drive.cycleType} Drive</span>
                          <span>{drive.expectedHires} Hires</span>
                        </div>
                      </div>
                    ))}

                  {/* Student Interviews */}
                  {showInterviews &&
                    dayEvents.interviews.map(int => (
                      <div
                        key={int.id}
                        draggable={canEdit}
                        onDragStart={(e) =>
                          handleDragStart(e, 'interview', int.id, `${int.studentName} - ${int.companyName}`, int.date)
                        }
                        onClick={() => setSelectedInterview(int)}
                        className={`p-1.5 rounded border text-[11px] leading-tight transition-all shadow-2xs cursor-pointer ${
                          int.status === 'In Progress'
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300 ring-1 ring-amber-400'
                            : int.status === 'Completed'
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border-emerald-200'
                            : 'bg-blue-50/70 hover:bg-blue-100 text-blue-950 border-blue-200'
                        } ${canEdit ? 'cursor-grab active:cursor-grabbing hover:scale-[1.01]' : ''}`}
                        title={`${int.startTime} - ${int.companyName} (${int.round}) for ${int.studentName}. Click to inspect or Drag to reschedule date.`}
                      >
                        <div className="flex items-center justify-between gap-1 font-mono text-[10px] font-bold text-blue-900">
                          <span>{int.startTime}</span>
                          <span className={`text-[9px] font-semibold px-1 py-0.2 rounded uppercase ${
                            int.status === 'In Progress' ? 'bg-amber-200 text-amber-900' :
                            int.status === 'Completed' ? 'bg-emerald-200 text-emerald-900' :
                            'bg-blue-200 text-blue-900'
                          }`}>
                            {int.round.split(' ')[0]}
                          </span>
                        </div>

                        <p className="font-semibold text-slate-900 truncate mt-0.5">{int.companyName}</p>
                        <p className="text-[10px] text-slate-600 truncate">{int.studentName}</p>

                        <div className="flex items-center gap-1 text-[9px] text-slate-500 mt-1">
                          {int.mode === 'Online' ? (
                            <span className="flex items-center gap-0.5 text-blue-700 font-medium">
                              <Video className="w-2.5 h-2.5" />
                              <span>Zoom</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-slate-700 font-medium">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>Campus</span>
                            </span>
                          )}
                          <span className="text-slate-300">·</span>
                          <span className="truncate">{int.result}</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Empty slot placeholder on hover */}
                {isOver && (
                  <div className="mt-1 border border-dashed border-blue-400 rounded bg-blue-100/50 p-1 text-center text-[10px] text-blue-800 font-semibold animate-pulse">
                    Drop to Reschedule
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Interview Details Modal */}
      {selectedInterview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-sm">Scheduled Interview Details</span>
              </div>
              <button
                onClick={() => setSelectedInterview(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedInterview.companyName}</h3>
                  <p className="text-slate-600 font-medium">{selectedInterview.profile} · {selectedInterview.round}</p>
                </div>
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-1 rounded">
                  {selectedInterview.startTime} - {selectedInterview.endTime}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-[10px] uppercase font-semibold text-slate-500">Student Candidate</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedInterview.studentName}</p>
                  <p className="font-mono text-slate-600 text-[11px]">{selectedInterview.studentRoll}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="text-[10px] uppercase font-semibold text-slate-500">Date &amp; Venue</p>
                  <p className="font-bold text-slate-900 text-sm mt-0.5">{formatDate(selectedInterview.date)}</p>
                  <p className="text-slate-600 text-[11px] truncate">{selectedInterview.mode}</p>
                </div>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-700">Interview Panel / Interviewer:</p>
                <p className="text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 font-medium">
                  {selectedInterview.interviewerName || 'Panel not assigned'}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-semibold text-slate-700">Meeting Room / Campus Venue:</p>
                {selectedInterview.mode === 'Online' ? (
                  <a
                    href={selectedInterview.venueOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 text-blue-700 bg-blue-50 p-2 rounded border border-blue-200 hover:underline font-mono"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="truncate">{selectedInterview.venueOrLink}</span>
                    <ExternalLink className="w-3 h-3 ml-auto" />
                  </a>
                ) : (
                  <p className="text-slate-800 bg-slate-50 p-2 rounded border border-slate-200 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedInterview.venueOrLink}</span>
                  </p>
                )}
              </div>

              {/* Status and Result Controls */}
              {canEdit && onUpdateInterviewStatus && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Interview Status</label>
                    <select
                      value={selectedInterview.status}
                      onChange={(e) => {
                        const newStatus = e.target.value as InterviewStatus;
                        onUpdateInterviewStatus(selectedInterview.id, newStatus);
                        setSelectedInterview({ ...selectedInterview, status: newStatus });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs font-semibold text-slate-900"
                    >
                      <option value="Scheduled">Scheduled</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="Rescheduled">Rescheduled</option>
                      <option value="No Show">No Show</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Evaluation Outcome</label>
                    <select
                      value={selectedInterview.result}
                      onChange={(e) => {
                        const newResult = e.target.value as InterviewResult;
                        onUpdateInterviewStatus(selectedInterview.id, selectedInterview.status, newResult);
                        setSelectedInterview({ ...selectedInterview, result: newResult });
                      }}
                      className="w-full bg-slate-50 border border-slate-300 rounded p-1.5 text-xs font-semibold text-slate-900"
                    >
                      <option value="Pending">Result: Pending</option>
                      <option value="Selected">Result: Selected</option>
                      <option value="Rejected">Result: Rejected</option>
                      <option value="Waitlisted">Result: Waitlisted</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedInterview(null)}
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
