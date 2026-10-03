import React, { useState, useMemo } from 'react';
import {
  Building2,
  Filter,
  Plus,
  PhoneCall,
  Calendar,
  ExternalLink,
  Users,
  Briefcase,
  Eye,
  LayoutGrid,
  List
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { Company, CompanyStatus } from '../types';
import { formatDate, getCompanyStatusStyle } from '../utils/formatters';

interface CompaniesPageProps {
  onSelectCompany: (company: Company) => void;
  onOpenQuickCall: (companyId: string) => void;
}

export const CompaniesPage: React.FC<CompaniesPageProps> = ({ onSelectCompany, onOpenQuickCall }) => {
  const { companies, hrContacts, drives, globalSearch, openQuickAction } = usePlaceComm();

  const [viewMode, setViewMode] = useState<'table' | 'cards'>('cards');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterIndustry, setFilterIndustry] = useState<string>('All');

  const industries = useMemo(() => {
    return Array.from(new Set(companies.map(c => c.industry))).sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchInd = c.industry.toLowerCase().includes(q);
        const matchLoc = (c.location || '').toLowerCase().includes(q);
        const matchOwner = c.pcOwnerName.toLowerCase().includes(q);
        if (!matchName && !matchInd && !matchLoc && !matchOwner) return false;
      }

      if (filterStatus !== 'All' && c.status !== filterStatus) return false;
      if (filterType !== 'All' && c.recruitmentType !== filterType && c.recruitmentType !== 'Both') return false;
      if (filterIndustry !== 'All' && c.industry !== filterIndustry) return false;

      return true;
    });
  }, [companies, globalSearch, filterStatus, filterType, filterIndustry]);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">Corporate Outreach &amp; Recruiter CRM</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Managing {filteredCompanies.length} corporate relationships across consulting, finance, tech, FMCG, and international trade
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium ${viewMode === 'cards' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Operational Cards View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cards</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs flex items-center gap-1 font-medium ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              title="Table Grid View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => openQuickAction('add-company')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Company</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filter CRM:</span>
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Schedule Finalized">Schedule Finalized</option>
          <option value="Hiring Active">Hiring Active</option>
          <option value="Discussion">Discussion</option>
          <option value="Interested">Interested</option>
          <option value="Offer Released">Offer Released</option>
          <option value="Prospect">Prospect</option>
          <option value="On Hold">On Hold</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Cycles</option>
          <option value="Final">Final Placement</option>
          <option value="Summer">Summer Placement</option>
        </select>

        <select
          value={filterIndustry}
          onChange={(e) => setFilterIndustry(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Industries</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* View 1: Operational Cards View (Section 13) */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map(c => {
            const badge = getCompanyStatusStyle(c.status);
            const companyHRs = hrContacts.filter(h => h.companyId === c.id);
            const primaryHR = companyHRs.find(h => h.isPrimary) || companyHRs[0];
            const companyDrives = drives.filter(d => d.companyId === c.id);

            return (
              <div
                key={c.id}
                onClick={() => onSelectCompany(c)}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{c.name}</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">{c.industry} · {c.location}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}>
                      {c.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Recruitment Cycle:</span>
                      <span className="font-semibold text-slate-900">{c.recruitmentType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Campus Visit:</span>
                      <span className="font-mono font-medium text-slate-900">
                        {c.expectedVisitDate ? formatDate(c.expectedVisitDate) : 'TBD'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lead HR Contact:</span>
                      <span className="font-medium text-slate-900 truncate max-w-[160px]">
                        {primaryHR ? primaryHR.name : 'Desk'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">PC Relationship Owner:</span>
                      <span className="font-medium text-blue-900">{c.pcOwnerName}</span>
                    </div>
                  </div>

                  {companyDrives.length > 0 && (
                    <div className="mt-2.5 p-2 bg-slate-50 rounded-md border border-slate-100">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Active Roles</p>
                      <div className="space-y-0.5 mt-0.5 text-[11px] text-slate-800">
                        {companyDrives.map(d => (
                          <div key={d.id} className="flex justify-between font-medium">
                            <span className="truncate max-w-[180px]">{d.jobProfile}</span>
                            <span className="font-mono text-blue-800">
                              {d.ctcLpa ? `₹${d.ctcLpa}L` : d.stipendPerMonth ? `₹${Math.round(d.stipendPerMonth / 1000)}k/m` : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenQuickCall(c.id);
                    }}
                    className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded flex items-center gap-1 border border-emerald-200 transition-colors"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>Log Call</span>
                  </button>

                  <button
                    onClick={() => onSelectCompany(c)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    <span>CRM Profile</span>
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View 2: Table Grid View */}
      {viewMode === 'table' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Industry</th>
                  <th className="py-2.5 px-3">Recruitment Cycle</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Expected Visit</th>
                  <th className="py-2.5 px-3">PC Lead</th>
                  <th className="py-2.5 px-3 text-right">Historical Hires</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompanies.map(c => {
                  const badge = getCompanyStatusStyle(c.status);
                  return (
                    <tr
                      key={c.id}
                      onClick={() => onSelectCompany(c)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                    >
                      <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                        {c.name}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{c.industry}</td>
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{c.recruitmentType}</td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-800 whitespace-nowrap">
                        {c.expectedVisitDate ? formatDate(c.expectedVisitDate) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-blue-900 font-medium whitespace-nowrap">{c.pcOwnerName}</td>
                      <td className="py-2.5 px-3 font-mono text-right tabular-nums text-slate-800">{c.historicalHires}</td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQuickCall(c.id);
                          }}
                          className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded text-[11px] font-medium mr-2"
                        >
                          Log Call
                        </button>
                        <button
                          onClick={() => onSelectCompany(c)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
