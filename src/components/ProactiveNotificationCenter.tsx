import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  Calendar,
  Building2,
  PhoneCall,
  Mail,
  CheckCircle2,
  Bell,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Send,
  Check,
  CalendarDays,
  UserCheck,
  X,
  ExternalLink
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatDate } from '../utils/formatters';

interface ProactiveNotificationCenterProps {
  onNavigateTab: (tab: string) => void;
  onOpenQuickCallWithCompany?: (companyId: string) => void;
}

export const ProactiveNotificationCenter: React.FC<ProactiveNotificationCenterProps> = ({
  onNavigateTab,
  onOpenQuickCallWithCompany
}) => {
  const {
    drives,
    followUps,
    companies,
    hrContacts,
    completeFollowUp,
    updateFollowUp,
    addAuditLog,
    currentUser
  } = usePlaceComm();

  const [activeFilter, setActiveFilter] = useState<'all' | 'drives' | 'hr'>('all');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const todayStr = '2026-10-03';
  const tomorrowStr = '2026-10-04';

  // 1. Compute Urgent Recruitment Drive Deadlines
  const driveDeadlines = useMemo(() => {
    const list: {
      id: string;
      driveId: string;
      companyName: string;
      jobProfile: string;
      cycle: string;
      deadlineType: 'application' | 'shortlist' | 'interview' | 'offer';
      deadlineDate: string;
      urgency: 'critical' | 'urgent' | 'upcoming';
      label: string;
      description: string;
      ownerName: string;
    }[] = [];

    drives.forEach(d => {
      // A. Application Deadline
      if (d.applicationDeadline) {
        if (d.applicationDeadline === todayStr) {
          list.push({
            id: `dd-app-${d.id}`,
            driveId: d.id,
            companyName: d.companyName,
            jobProfile: d.jobProfile,
            cycle: d.cycle,
            deadlineType: 'application',
            deadlineDate: d.applicationDeadline,
            urgency: 'critical',
            label: 'Applications Close Today (23:59 IST)',
            description: `Student resume submission portal closes tonight. Current pool: verified IIFT Delhi applicants.`,
            ownerName: d.ownerName
          });
        } else if (d.applicationDeadline === tomorrowStr) {
          list.push({
            id: `dd-app-${d.id}`,
            driveId: d.id,
            companyName: d.companyName,
            jobProfile: d.jobProfile,
            cycle: d.cycle,
            deadlineType: 'application',
            deadlineDate: d.applicationDeadline,
            urgency: 'urgent',
            label: 'Application Closes in 24 Hours',
            description: `Final reminder needed for unapplied eligible candidates in MBA-IB & MBA-BA.`,
            ownerName: d.ownerName
          });
        }
      }

      // B. Shortlist Release Deadline
      if (d.shortlistDate) {
        if (d.shortlistDate === todayStr) {
          list.push({
            id: `dd-sl-${d.id}`,
            driveId: d.id,
            companyName: d.companyName,
            jobProfile: d.jobProfile,
            cycle: d.cycle,
            deadlineType: 'shortlist',
            deadlineDate: d.shortlistDate,
            urgency: 'critical',
            label: 'HR Shortlist Expected Today',
            description: `Chase corporate recruiter to release confirmed candidate shortlist for upcoming rounds.`,
            ownerName: d.ownerName
          });
        } else if (d.shortlistDate === tomorrowStr) {
          list.push({
            id: `dd-sl-${d.id}`,
            driveId: d.id,
            companyName: d.companyName,
            jobProfile: d.jobProfile,
            cycle: d.cycle,
            deadlineType: 'shortlist',
            deadlineDate: d.shortlistDate,
            urgency: 'urgent',
            label: 'Shortlist Release Due Tomorrow',
            description: `Verify candidate shortlist transmission protocol with HR talent team.`,
            ownerName: d.ownerName
          });
        }
      }

      // C. Interview Slot Date
      if (d.interviewDate) {
        if (d.interviewDate === todayStr && d.status !== 'Completed') {
          list.push({
            id: `dd-int-${d.id}`,
            driveId: d.id,
            companyName: d.companyName,
            jobProfile: d.jobProfile,
            cycle: d.cycle,
            deadlineType: 'interview',
            deadlineDate: d.interviewDate,
            urgency: 'critical',
            label: 'Interview Drive Day Active Today',
            description: `Live GD/PI rounds active on campus. Coordinator panel supervision required.`,
            ownerName: d.ownerName
          });
        } else if (d.interviewDate === tomorrowStr) {
          list.push({
            id: `dd-int-${d.id}`,
            driveId: d.id,
            companyName: d.companyName,
            jobProfile: d.jobProfile,
            cycle: d.cycle,
            deadlineType: 'interview',
            deadlineDate: d.interviewDate,
            urgency: 'urgent',
            label: 'Interviews Scheduled Tomorrow (4 Oct)',
            description: `Confirm board room allocations and online panel meeting links with students.`,
            ownerName: d.ownerName
          });
        }
      }

      // D. Offer Release Date
      if (d.offerDate && d.offerDate === todayStr) {
        list.push({
          id: `dd-off-${d.id}`,
          driveId: d.id,
          companyName: d.companyName,
          jobProfile: d.jobProfile,
          cycle: d.cycle,
          deadlineType: 'offer',
          deadlineDate: d.offerDate,
          urgency: 'critical',
          label: 'Offers Rollout Due Today',
          description: `Corporate HR committed to releasing final placement offers by tonight.`,
          ownerName: d.ownerName
        });
      }
    });

    return list;
  }, [drives, todayStr, tomorrowStr]);

  // 2. Compute Pending HR Outreach Follow-ups
  const pendingHRFollowUps = useMemo(() => {
    return followUps
      .filter(f => f.status === 'PENDING')
      .map(f => {
        const isOverdue = f.dueDate < todayStr;
        const isToday = f.dueDate === todayStr;
        const isTomorrow = f.dueDate === tomorrowStr;

        // Find linked HR contact
        const matchedHR = hrContacts.find(h => h.id === f.hrContactId) ||
                          hrContacts.find(h => h.companyId === f.companyId);

        let urgency: 'critical' | 'urgent' | 'upcoming' = 'upcoming';
        let timingLabel = `Due: ${formatDate(f.dueDate)}`;

        if (isOverdue) {
          urgency = 'critical';
          timingLabel = `OVERDUE (Due ${formatDate(f.dueDate)})`;
        } else if (isToday) {
          urgency = 'critical';
          timingLabel = `DUE TODAY (3 Oct)`;
        } else if (isTomorrow) {
          urgency = 'urgent';
          timingLabel = `Due Tomorrow (4 Oct)`;
        }

        return {
          ...f,
          hrPhone: f.hrPhone || matchedHR?.phone || '+91 98110 00000',
          hrEmail: f.hrEmail || matchedHR?.email || 'hr@corporate.com',
          hrDesignation: matchedHR?.designation || 'Campus Lead',
          preferredChannel: matchedHR?.preferredChannel || 'Call',
          urgency,
          timingLabel,
          isOverdue,
          isToday
        };
      })
      .sort((a, b) => {
        if (a.isOverdue && !b.isOverdue) return -1;
        if (!a.isOverdue && b.isOverdue) return 1;
        if (a.isToday && !b.isToday) return -1;
        if (!a.isToday && b.isToday) return 1;
        return a.dueDate.localeCompare(b.dueDate);
      });
  }, [followUps, hrContacts, todayStr, tomorrowStr]);

  // Total urgent items count
  const criticalCount = driveDeadlines.filter(d => d.urgency === 'critical').length +
                        pendingHRFollowUps.filter(h => h.urgency === 'critical').length;
  const totalCount = driveDeadlines.length + pendingHRFollowUps.length;

  // Actions
  const handleCompleteHRFollowUp = (fupId: string, companyName: string, hrName: string) => {
    completeFollowUp(fupId, undefined, 'Marked as completed from Proactive Dashboard Action Center');
    addAuditLog('RESOLVE_FOLLOWUP', 'FollowUp', fupId, `Proactively completed HR outreach task for ${hrName} (${companyName})`);
    setFeedbackToast(`✓ Completed follow-up with ${hrName} (${companyName})`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleSnoozeHR = (fupId: string, companyName: string) => {
    updateFollowUp(fupId, { dueDate: tomorrowStr });
    setFeedbackToast(`Snoozed follow-up for ${companyName} to tomorrow (4 Oct)`);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleBroadcastReminder = (companyName: string, type: string) => {
    setFeedbackToast(`📢 Sent high-priority broadcast reminder for ${companyName} (${type}) to all enrolled students!`);
    setTimeout(() => setFeedbackToast(null), 4000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 border border-blue-900/60 rounded-xl p-4 sm:p-5 text-white shadow-md space-y-4">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="bg-emerald-700 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{feedbackToast}</span>
          </div>
          <button onClick={() => setFeedbackToast(null)} className="text-emerald-200 hover:text-white font-bold ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Top Banner Header with Pulsing Beacon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-900/40 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-8 h-8 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4 animate-bounce" />
            </div>
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-tight">Proactive Placement Command Alerts</h2>
              <span className="px-2 py-0.5 bg-rose-600/30 text-rose-300 border border-rose-500/40 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {criticalCount} Critical Action{criticalCount !== 1 ? 's' : ''} Today
              </span>
            </div>
            <p className="text-xs text-blue-200/70 mt-0.5">
              Live automated detection of recruitment drive deadlines and urgent HR outreach queues
            </p>
          </div>
        </div>

        {/* View Controls & Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-900/80 p-0.5 rounded-lg border border-blue-900/60 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All Alerts ({totalCount})
            </button>
            <button
              onClick={() => setActiveFilter('drives')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeFilter === 'drives'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Drives ({driveDeadlines.length})
            </button>
            <button
              onClick={() => setActiveFilter('hr')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                activeFilter === 'hr'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              HR Follow-ups ({pendingHRFollowUps.length})
            </button>
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded border border-slate-700 transition-colors"
            title={isCollapsed ? 'Expand alert tray' : 'Collapse alert tray'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Alerts Grid */}
      {!isCollapsed && (
        <div className="space-y-3">
          {totalCount === 0 ? (
            <div className="bg-emerald-950/40 border border-emerald-800/40 rounded-lg p-5 text-center space-y-1">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-emerald-200">All Clear! No Pending Critical Deadlines</p>
              <p className="text-xs text-emerald-300/70">
                All recruitment drives and HR outreach tasks are up to date for today.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. Recruitment Drive Deadline Cards */}
              {(activeFilter === 'all' || activeFilter === 'drives') &&
                driveDeadlines.map(d => (
                  <div
                    key={d.id}
                    className={`bg-slate-900/90 border rounded-lg p-3.5 flex flex-col justify-between gap-2.5 transition-all shadow-xs ${
                      d.urgency === 'critical'
                        ? 'border-l-4 border-l-rose-500 border-rose-900/40 bg-gradient-to-r from-rose-950/20 to-slate-900/90'
                        : 'border-l-4 border-l-amber-500 border-amber-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span className="truncate">{d.companyName}</span>
                          <span className="text-[10px] font-normal text-slate-400">· {d.cycle}</span>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            d.urgency === 'critical'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {d.label}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-blue-300 mt-1">{d.jobProfile}</p>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{d.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <span className="text-[10px] text-slate-400">Lead: {d.ownerName}</span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleBroadcastReminder(d.companyName, d.label)}
                          className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-500/30 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                          title="Broadcast deadline alert to students"
                        >
                          <Send className="w-3 h-3" />
                          <span>Remind Batch</span>
                        </button>

                        <button
                          onClick={() => onNavigateTab('recruitment')}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                        >
                          <span>Open Drive</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              {/* 2. Key HR Follow-up Action Cards */}
              {(activeFilter === 'all' || activeFilter === 'hr') &&
                pendingHRFollowUps.map(fup => (
                  <div
                    key={fup.id}
                    className={`bg-slate-900/90 border rounded-lg p-3.5 flex flex-col justify-between gap-2.5 transition-all shadow-xs ${
                      fup.urgency === 'critical'
                        ? 'border-l-4 border-l-rose-500 border-rose-900/40 bg-gradient-to-r from-rose-950/20 to-slate-900/90'
                        : 'border-l-4 border-l-amber-500 border-amber-900/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-white">{fup.companyName}</span>
                          <p className="text-xs text-slate-300 font-medium">
                            HR: <span className="text-white font-semibold">{fup.hrName}</span> ({fup.hrDesignation})
                          </p>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                            fup.isOverdue
                              ? 'bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse'
                              : fup.isToday
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {fup.timingLabel}
                        </span>
                      </div>

                      {/* Direct Phone Number & Contact Row */}
                      <div className="flex items-center gap-3 text-[11px] text-emerald-400 font-mono mt-1.5 flex-wrap">
                        <a
                          href={`tel:${fup.hrPhone}`}
                          className="flex items-center gap-1 hover:underline text-emerald-300 font-semibold"
                        >
                          <PhoneCall className="w-3 h-3 text-emerald-400" />
                          <span>{fup.hrPhone}</span>
                        </a>

                        <a
                          href={`mailto:${fup.hrEmail}`}
                          className="flex items-center gap-1 hover:underline text-blue-300"
                        >
                          <Mail className="w-3 h-3 text-blue-400" />
                          <span>{fup.hrEmail}</span>
                        </a>

                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-sans">
                          Prefers: {fup.preferredChannel}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed bg-slate-800/40 p-1.5 rounded border border-slate-800/60">
                        {fup.notes}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs flex-wrap gap-2">
                      <span className="text-[10px] text-slate-400">Owner: {fup.pcOwnerName.split(' ')[0]}</span>

                      <div className="flex items-center gap-1.5">
                        {/* Rapid 20-second Call Logger */}
                        {onOpenQuickCallWithCompany && (
                          <button
                            onClick={() => onOpenQuickCallWithCompany(fup.companyId)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                            title="Call HR & log outcome in <20s"
                          >
                            <PhoneCall className="w-3 h-3" />
                            <span>Quick Call</span>
                          </button>
                        )}

                        {/* 1-Click Mark Completed */}
                        <button
                          onClick={() => handleCompleteHRFollowUp(fup.id, fup.companyName, fup.hrName)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-[11px] font-medium flex items-center gap-1 transition-colors"
                          title="Mark this outreach task as completed"
                        >
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Done</span>
                        </button>

                        {/* Snooze 24h */}
                        <button
                          onClick={() => handleSnoozeHR(fup.id, fup.companyName)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded text-[11px] font-medium transition-colors"
                          title="Postpone due date by 24 hours"
                        >
                          Snooze
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
