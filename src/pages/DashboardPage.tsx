import React from 'react';
import {
  Users,
  Building2,
  CalendarDays,
  FileCheck,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  PhoneCall,
  Video,
  CheckCircle2
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatCurrencyLPA, formatStipend, formatDate, getCompanyStatusStyle } from '../utils/formatters';
import { ProactiveNotificationCenter } from '../components/ProactiveNotificationCenter';

interface DashboardPageProps {
  onNavigateTab: (tab: string) => void;
  onOpenQuickCallWithCompany?: (companyId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateTab, onOpenQuickCallWithCompany }) => {
  const { students, companies, interviews, offers, followUps, drives, shortlists } = usePlaceComm();

  // Metrics computation
  const totalStudents = students.length;
  const eligibleStudents = students.filter(s => s.isEligible).length;

  const finalBatchStudents = students.filter(s => s.batch === '2024-26');
  const summerBatchStudents = students.filter(s => s.batch === '2025-27');

  const finalPlacedCount = finalBatchStudents.filter(s => s.finalStatus === 'Placed').length;
  const finalUnplacedCount = finalBatchStudents.filter(s => s.finalStatus !== 'Placed' && s.finalStatus !== 'Opted Out').length;
  const finalPlacementPct = finalBatchStudents.length > 0 
    ? Math.round((finalPlacedCount / finalBatchStudents.length) * 100) 
    : 0;

  const summerPlacedCount = summerBatchStudents.filter(s => s.summerStatus === 'Placed').length;
  const summerUnplacedCount = summerBatchStudents.filter(s => s.summerStatus !== 'Placed').length;

  const confirmedCompanies = companies.filter(c => c.status === 'Confirmed' || c.status === 'Schedule Finalized');
  const activeCompanies = companies.filter(c => c.status !== 'Declined' && c.status !== 'On Hold');

  // Compensation analytics
  const placedFinalStudents = finalBatchStudents.filter(s => s.finalStatus === 'Placed' && s.finalCTC);
  const avgFinalCTC = placedFinalStudents.length > 0
    ? placedFinalStudents.reduce((acc, s) => acc + (s.finalCTC || 0), 0) / placedFinalStudents.length
    : 28.5;
  const highestFinalCTC = placedFinalStudents.length > 0
    ? Math.max(...placedFinalStudents.map(s => s.finalCTC || 0))
    : 38.0;

  const placedSummerStudents = students.filter(s => s.summerStatus === 'Placed' && s.summerStipend);
  const avgSummerStipend = placedSummerStudents.length > 0
    ? placedSummerStudents.reduce((acc, s) => acc + (s.summerStipend || 0), 0) / placedSummerStudents.length
    : 215000;
  const highestSummerStipend = placedSummerStudents.length > 0
    ? Math.max(...placedSummerStudents.map(s => s.summerStipend || 0))
    : 250000;

  // Today's interviews
  const todayStr = '2026-10-03';
  const todayInterviews = interviews.filter(i => i.date === todayStr);

  // Overdue follow-ups
  const overdueFollowUps = followUps.filter(f => f.status === 'PENDING' && f.dueDate <= todayStr);

  // Upcoming company visits
  const upcomingCompanies = companies
    .filter(c => c.expectedVisitDate && c.expectedVisitDate >= todayStr)
    .sort((a, b) => (a.expectedVisitDate || '').localeCompare(b.expectedVisitDate || ''))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-blue-400">
              Placement Command Center
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300">Indian Institute of Foreign Trade, New Delhi</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Placements Season 2026
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational overview across MBA (International Business) &amp; MBA (Business Analytics) — IIFT Delhi
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('interviews')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Today&apos;s Schedule ({todayInterviews.length})</span>
          </button>
          <button
            onClick={() => onNavigateTab('followups')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Follow-up Queue ({overdueFollowUps.length})</span>
          </button>
        </div>
      </div>

      {/* 2. Proactive Notification & Action Command Center */}
      <ProactiveNotificationCenter
        onNavigateTab={onNavigateTab}
        onOpenQuickCallWithCompany={onOpenQuickCallWithCompany}
      />

      {/* 3. Top Metric Cards: Student, Recruitment & Compensation KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Students */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Total Students</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{totalStudents}</p>
          <div className="text-[10px] text-slate-500 mt-1">
            <span>{eligibleStudents} eligible</span>
            <span className="mx-1">·</span>
            <span>{totalStudents - eligibleStudents} hold</span>
          </div>
        </div>

        {/* Final Placed */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium text-slate-500">Final Placed</p>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">
              {finalPlacementPct}%
            </span>
          </div>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            {finalPlacedCount} <span className="text-xs font-normal text-slate-500">/ {finalBatchStudents.length}</span>
          </p>
          <p className="text-[10px] text-amber-600 mt-1 font-medium">{finalUnplacedCount} remaining</p>
        </div>

        {/* Summer Placed */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Summer Placed</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
            {summerPlacedCount} <span className="text-xs font-normal text-slate-500">/ {summerBatchStudents.length}</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1">{summerUnplacedCount} in interview stages</p>
        </div>

        {/* Active Companies */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Active Companies</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{activeCompanies.length}</p>
          <p className="text-[10px] text-emerald-700 font-medium mt-1">{confirmedCompanies.length} confirmed</p>
        </div>

        {/* Offers Made */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Total Offers</p>
          <p className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{offers.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">{shortlists.length} shortlists issued</p>
        </div>

        {/* Average CTC */}
        <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Average Final CTC</p>
          <p className="text-xl font-bold text-blue-900 tabular-nums mt-0.5">
            ₹{avgFinalCTC.toFixed(1)} <span className="text-xs font-normal text-slate-500">LPA</span>
          </p>
          <p className="text-[10px] text-slate-500 mt-1 font-mono">High: {formatCurrencyLPA(highestFinalCTC)}</p>
        </div>
      </div>

      {/* 3. Operational Grid: Today's Interviews & Follow-up Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Today's Interviews Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-semibold text-slate-900">Today&apos;s Interview Lineup (3 Oct 2026)</h2>
            </div>
            <button
              onClick={() => onNavigateTab('interviews')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>View calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {todayInterviews.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No interviews scheduled for today. Check upcoming calendar.
              </div>
            ) : (
              todayInterviews.map(int => (
                <div key={int.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-900">{int.startTime}</span>
                      <span className="text-slate-300">·</span>
                      <span className="font-semibold text-xs text-blue-900">{int.companyName}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-600">{int.round}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium">
                      Candidate: {int.studentName} <span className="font-mono text-[11px] text-slate-500">({int.studentRoll})</span>
                    </p>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1">
                      <span>Interviewer: {int.interviewerName || 'Panel'}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-500 truncate max-w-[200px]">{int.venueOrLink}</span>
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      int.status === 'In Progress' ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' :
                      int.status === 'Completed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {int.status}
                    </span>

                    {int.mode === 'Online' && (
                      <a
                        href={int.venueOrLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium bg-blue-50 px-2 py-0.5 rounded"
                      >
                        <Video className="w-3 h-3" />
                        <span>Room Link</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* HR Follow-up Alerts Card */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900">Follow-up Alerts ({overdueFollowUps.length} Pending)</h2>
            </div>
            <button
              onClick={() => onNavigateTab('followups')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <span>Manage queue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {overdueFollowUps.length === 0 ? (
              <div className="p-6 text-center text-xs text-emerald-700 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All HR follow-up queues are up to date!</span>
              </div>
            ) : (
              overdueFollowUps.map(fup => (
                <div key={fup.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900">{fup.companyName}</span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-700">
                        {fup.priority}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium">
                      Contact: {fup.hrName} {fup.hrPhone ? `(${fup.hrPhone})` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{fup.notes}</p>
                    <p className="text-[10px] text-rose-600 font-medium">Due Date: {formatDate(fup.dueDate)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <button
                      onClick={() => onOpenQuickCallWithCompany && onOpenQuickCallWithCompany(fup.companyId)}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold rounded flex items-center gap-1 shadow-xs"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call HR</span>
                    </button>
                    <span className="text-[10px] text-slate-400">Owner: {fup.pcOwnerName.split(' ')[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 4. Company Pipeline & Student Funnel Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Company Pipeline Funnel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Corporate Outreach Pipeline</h3>
              <p className="text-[11px] text-slate-500">Stage-by-stage company interaction funnel</p>
            </div>
            <button onClick={() => onNavigateTab('companies')} className="text-xs text-blue-600 font-medium">
              View all ({companies.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { stage: 'Prospects / Outreached', count: companies.filter(c => c.status === 'Prospect' || c.status === 'Contacted').length, color: 'bg-slate-300' },
              { stage: 'Interested & In Discussion', count: companies.filter(c => c.status === 'Interested' || c.status === 'Discussion' || c.status === 'Negotiation').length, color: 'bg-amber-400' },
              { stage: 'Confirmed & Slots Finalized', count: confirmedCompanies.length, color: 'bg-blue-600' },
              { stage: 'Hiring Active / Interviewing', count: companies.filter(c => c.status === 'Hiring Active').length, color: 'bg-indigo-600' },
              { stage: 'Offers Released / Converted', count: companies.filter(c => c.status === 'Offer Released' || c.status === 'Converted' || c.status === 'Process Completed').length, color: 'bg-emerald-500' }
            ].map(item => {
              const pct = companies.length > 0 ? Math.round((item.count / companies.length) * 100) : 0;
              return (
                <div key={item.stage} className="text-xs">
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>{item.stage}</span>
                    <span className="font-mono text-slate-900 font-semibold">{item.count} companies ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Placement Funnel */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Student Placement Funnel</h3>
              <p className="text-[11px] text-slate-500">Progression from eligibility to final acceptance</p>
            </div>
            <button onClick={() => onNavigateTab('students')} className="text-xs text-blue-600 font-medium">
              View all ({students.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { stage: 'Eligible Students', count: eligibleStudents, total: totalStudents, color: 'bg-slate-400' },
              { stage: 'Shortlisted at Least Once', count: students.filter(s => s.shortlistsCount > 0).length, total: eligibleStudents, color: 'bg-sky-500' },
              { stage: 'Interviews Attended', count: students.filter(s => s.interviewsCount > 0).length, total: eligibleStudents, color: 'bg-indigo-500' },
              { stage: 'Received Offers', count: students.filter(s => s.offersCount > 0).length, total: eligibleStudents, color: 'bg-purple-600' },
              { stage: 'Final Offers Accepted (Placed)', count: finalPlacedCount, total: finalBatchStudents.length, color: 'bg-emerald-600' }
            ].map(item => {
              const pct = item.total > 0 ? Math.round((item.count / item.total) * 100) : 0;
              return (
                <div key={item.stage} className="text-xs">
                  <div className="flex justify-between font-medium text-slate-700 mb-1">
                    <span>{item.stage}</span>
                    <span className="font-mono text-slate-900 font-semibold">{item.count} students ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-300`} style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Visiting Companies Upcoming Schedule */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-semibold text-slate-900">Upcoming Campus Recruiter Visits</h3>
          </div>
          <button onClick={() => onNavigateTab('companies')} className="text-xs text-blue-600 font-medium">
            Full company list
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {upcomingCompanies.map(c => {
            const badge = getCompanyStatusStyle(c.status);
            return (
              <div key={c.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-start justify-between gap-1">
                  <p className="font-semibold text-xs text-slate-900 truncate">{c.name}</p>
                  <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                    {c.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">{c.industry}</p>
                <div className="text-[11px] font-mono font-medium text-blue-900 pt-1 border-t border-slate-200">
                  Visit: {formatDate(c.expectedVisitDate)}
                </div>
                <p className="text-[10px] text-slate-500">PC Lead: {c.pcOwnerName}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
