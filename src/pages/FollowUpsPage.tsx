import React, { useState, useMemo } from 'react';
import { Clock, Plus, PhoneCall, Check, AlertTriangle, Calendar, Filter } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { FollowUp, PriorityLevel } from '../types';
import { formatDate, getPriorityStyle } from '../utils/formatters';

interface FollowUpsPageProps {
  onOpenQuickCall: (companyId: string) => void;
}

export const FollowUpsPage: React.FC<FollowUpsPageProps> = ({ onOpenQuickCall }) => {
  const { followUps, completeFollowUp, openQuickAction } = usePlaceComm();

  const [activeTab, setActiveTab] = useState<'overdue' | 'today' | 'upcoming' | 'all'>('overdue');
  const [filterPriority, setFilterPriority] = useState<string>('All');

  const todayStr = '2026-10-03';
  const tomorrowStr = '2026-10-04';

  const categorizedFollowUps = useMemo(() => {
    const overdue = followUps.filter(f => f.status === 'PENDING' && f.dueDate < todayStr);
    const today = followUps.filter(f => f.status === 'PENDING' && f.dueDate === todayStr);
    const upcoming = followUps.filter(f => f.status === 'PENDING' && f.dueDate > todayStr);
    return { overdue, today, upcoming };
  }, [followUps, todayStr]);

  const displayedFollowUps = useMemo(() => {
    let list: FollowUp[] = [];
    if (activeTab === 'overdue') list = categorizedFollowUps.overdue;
    else if (activeTab === 'today') list = categorizedFollowUps.today;
    else if (activeTab === 'upcoming') list = categorizedFollowUps.upcoming;
    else list = followUps;

    if (filterPriority !== 'All') {
      list = list.filter(f => f.priority === filterPriority);
    }

    return list.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [categorizedFollowUps, activeTab, followUps, filterPriority]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h1 className="text-base font-bold text-slate-900">Placement Coordinator Follow-up Queue</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized outreach tasks to corporate HR leads, recruiters, and campus talent partners
          </p>
        </div>

        <button
          onClick={() => openQuickAction('add-followup')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Follow-up Task</span>
        </button>
      </div>

      {/* Segmented Queue Views (Section 22) */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'overdue' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Overdue ({categorizedFollowUps.overdue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              activeTab === 'today' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Due Today ({categorizedFollowUps.today.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              activeTab === 'upcoming' ? 'bg-white text-blue-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming ({categorizedFollowUps.upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Tasks ({followUps.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {displayedFollowUps.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-xs text-slate-500 shadow-xs">
            No follow-up tasks in this queue. Great job!
          </div>
        ) : (
          displayedFollowUps.map(fup => {
            const prioBadge = getPriorityStyle(fup.priority);
            const isOverdue = fup.status === 'PENDING' && fup.dueDate < todayStr;
            return (
              <div
                key={fup.id}
                className={`bg-white border rounded-xl p-4 shadow-xs transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isOverdue ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">{fup.companyName}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${prioBadge.bg} ${prioBadge.text}`}>
                      {fup.priority}
                    </span>
                    <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      Action: {fup.actionType}
                    </span>
                    {fup.status === 'COMPLETED' && (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                        Completed
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-800 font-medium leading-relaxed">{fup.notes}</p>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span>Contact: <strong>{fup.hrName}</strong> {fup.hrPhone ? `(${fup.hrPhone})` : ''}</span>
                    <span className="text-slate-300">·</span>
                    <span>Assigned Coordinator: <strong>{fup.pcOwnerName}</strong></span>
                    <span className="text-slate-300">·</span>
                    <span className={`font-mono font-medium ${isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-600'}`}>
                      Due: {formatDate(fup.dueDate)} {isOverdue && '(OVERDUE)'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenQuickCall(fup.companyId)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call HR</span>
                  </button>

                  {fup.status === 'PENDING' && (
                    <button
                      onClick={() => completeFollowUp(fup.id, undefined, 'Marked completed in queue')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold flex items-center gap-1 border border-slate-300 transition-colors"
                      title="Mark as completed without scheduling new follow-up"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Done</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
