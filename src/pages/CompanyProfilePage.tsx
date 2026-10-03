import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Globe,
  MapPin,
  PhoneCall,
  Mail,
  Calendar,
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ExternalLink,
  MessageSquare,
  FileText
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { Company, CompanyStatus } from '../types';
import { formatDate, formatCurrencyLPA, formatStipend, getCompanyStatusStyle } from '../utils/formatters';

interface CompanyProfilePageProps {
  company: Company;
  onBack: () => void;
  onOpenQuickCall: (companyId: string) => void;
}

export const CompanyProfilePage: React.FC<CompanyProfilePageProps> = ({ company, onBack, onOpenQuickCall }) => {
  const {
    hrContacts,
    drives,
    shortlists,
    interviews,
    offers,
    activities,
    followUps,
    updateCompanyStatus,
    openQuickAction,
    canEdit
  } = usePlaceComm();

  const [activeTab, setActiveTab] = useState<'info' | 'hr' | 'drives' | 'timeline' | 'followups'>('info');

  const companyHRs = hrContacts.filter(h => h.companyId === company.id);
  const companyDrives = drives.filter(d => d.companyId === company.id);
  const companyShortlists = shortlists.filter(s => s.companyName === company.name);
  const companyInterviews = interviews.filter(i => i.companyName === company.name);
  const companyOffers = offers.filter(o => o.companyId === company.id || o.companyName === company.name);
  const companyActivities = activities.filter(a => a.companyId === company.id).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  const companyFollowUps = followUps.filter(f => f.companyId === company.id);

  const statusBadge = getCompanyStatusStyle(company.status);

  const statusOptions: CompanyStatus[] = [
    'Prospect',
    'Contacted',
    'Interested',
    'Discussion',
    'Negotiation',
    'Confirmed',
    'Schedule Finalized',
    'Hiring Active',
    'Process Completed',
    'Offer Released',
    'Converted',
    'On Hold',
    'Declined'
  ];

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Companies Directory</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              <Building2 className="w-7 h-7 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{company.name}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                  {company.status}
                </span>
                <span className="text-[10px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded font-medium">
                  {company.companyType}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {company.industry} · {company.location} · {company.recruitmentType} Placements
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{company.website.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{company.location}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Expected Visit: {company.expectedVisitDate ? formatDate(company.expectedVisitDate) : 'Not finalized'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions (Call HR & Status Dropdown) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenQuickCall(company.id)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Log HR Call (&lt;20s)</span>
            </button>

            {canEdit && (
              <select
                value={company.status}
                onChange={(e) => updateCompanyStatus(company.id, e.target.value as CompanyStatus)}
                className="bg-slate-50 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:bg-white"
              >
                {statusOptions.map(st => (
                  <option key={st} value={st}>Move to: {st}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Funnel Statistics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Recruitment Drives</p>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{companyDrives.length}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Shortlisted</p>
            <p className="text-base font-bold font-mono text-blue-900 mt-0.5">{companyShortlists.length}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Interviews</p>
            <p className="text-base font-bold font-mono text-indigo-900 mt-0.5">{companyInterviews.length}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Offers Rolled Out</p>
            <p className="text-base font-bold font-mono text-purple-900 mt-0.5">{companyOffers.length}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Historical Hires</p>
            <p className="text-base font-bold font-mono text-emerald-900 mt-0.5">{company.historicalHires}</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs font-medium">
        {[
          { id: 'info', label: 'Company Overview & Notes' },
          { id: 'hr', label: `HR Contacts Directory (${companyHRs.length})` },
          { id: 'drives', label: `Recruitment Drives & CTC (${companyDrives.length})` },
          { id: 'timeline', label: `CRM Timeline (${companyActivities.length})` },
          { id: 'followups', label: `Follow-ups (${companyFollowUps.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 border-b-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-800 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Company Overview */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Engagement</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">PlaceComm Relationship Lead:</span>
                <span className="font-semibold text-blue-900">{company.pcOwnerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Recruitment Cycle Target:</span>
                <span className="font-semibold text-slate-900">{company.recruitmentType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Hiring Intent / Mandate:</span>
                <span className="text-slate-800 font-medium">{company.hiringIntent || 'Open campus engagement'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Historical IIFT Alum Hires:</span>
                <span className="font-mono text-slate-800 font-semibold">{company.historicalHires} candidates</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Coordinator Brief &amp; Notes</h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 min-h-[90px]">
              {company.notes || 'No confidential coordinator notes recorded yet.'}
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: HR Contacts */}
      {activeTab === 'hr' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Recruiter &amp; HR Contacts ({companyHRs.length})</span>
            <button
              onClick={() => openQuickAction('add-hr')}
              className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Recruiter</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {companyHRs.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No HR contacts listed. Click &apos;Add Recruiter&apos; to create one.</div>
            ) : (
              companyHRs.map(hr => (
                <div key={hr.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{hr.name}</p>
                      {hr.isPrimary && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                          Primary Contact
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 font-medium">{hr.designation}</p>
                    <div className="flex items-center gap-4 text-slate-500 pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <a href={`mailto:${hr.email}`} className="text-blue-600 hover:underline">{hr.email}</a>
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                        <span>{hr.phone}</span>
                      </span>
                      <span>Preferred Channel: <strong>{hr.preferredChannel}</strong></span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => onOpenQuickCall(company.id)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-xs"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call Now</span>
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Last contact: {hr.lastContactDate ? formatDate(hr.lastContactDate) : 'Not recorded'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Recruitment Drives */}
      {activeTab === 'drives' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Recruitment Drives ({companyDrives.length})</span>
            <button
              onClick={() => openQuickAction('create-drive')}
              className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Drive</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {companyDrives.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No recruitment drives active for this company yet.</div>
            ) : (
              companyDrives.map(d => (
                <div key={d.id} className="p-4 hover:bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm">{d.jobProfile}</h4>
                        <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded">
                          {d.cycle} ({d.cycleType})
                        </span>
                        <span className="text-[10px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                          {d.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 leading-relaxed">{d.jobDescription}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-base font-bold font-mono text-blue-900">
                        {d.ctcLpa ? formatCurrencyLPA(d.ctcLpa) : formatStipend(d.stipendPerMonth)}
                      </p>
                      <p className="text-[10px] text-slate-500">Target Hires: {d.expectedHires}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
                    <div>
                      <span>Allowed Specializations: </span>
                      <span className="font-semibold text-slate-700">{d.allowedSpecializations.join(', ')}</span>
                    </div>
                    <div>
                      <span>Min CGPA: </span>
                      <span className="font-mono font-semibold text-slate-700">{d.minCgpa}</span>
                    </div>
                    <div>
                      <span>Interview Date: </span>
                      <span className="font-mono font-semibold text-blue-800">
                        {d.interviewDate ? formatDate(d.interviewDate) : 'TBD'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: CRM Activity Timeline */}
      {activeTab === 'timeline' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">Outreach &amp; Communication History</h3>
            <button
              onClick={() => onOpenQuickCall(company.id)}
              className="px-2.5 py-1 bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Log Interaction</span>
            </button>
          </div>

          <div className="space-y-3 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {companyActivities.length === 0 ? (
              <p className="text-xs text-slate-500">No communication activities logged yet.</p>
            ) : (
              companyActivities.map(act => (
                <div key={act.id} className="relative text-xs space-y-0.5">
                  <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{act.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{formatDate(act.timestamp)}</span>
                    {act.outcome && (
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {act.outcome}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 leading-relaxed">{act.notes}</p>
                  <p className="text-[10px] text-slate-400">Logged by: {act.actorName}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Follow-ups */}
      {activeTab === 'followups' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Follow-up Tasks ({companyFollowUps.length})</span>
            <button
              onClick={() => openQuickAction('add-followup')}
              className="px-2.5 py-1 bg-blue-600 text-white rounded text-xs font-medium flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Follow-up</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {companyFollowUps.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No scheduled follow-ups pending for this company.</div>
            ) : (
              companyFollowUps.map(fup => (
                <div key={fup.id} className="p-3.5 hover:bg-slate-50 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{fup.actionType} with {fup.hrName}</span>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-rose-50 text-rose-700">
                        {fup.priority}
                      </span>
                      <span className="text-[10px] text-slate-500">Status: {fup.status}</span>
                    </div>
                    <p className="text-slate-600 mt-1">{fup.notes}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Due: {formatDate(fup.dueDate)}</p>
                  </div>
                  <button
                    onClick={() => onOpenQuickCall(company.id)}
                    className="px-3 py-1 bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1 shrink-0"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Call HR</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
