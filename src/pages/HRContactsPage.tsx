import React, { useState, useMemo } from 'react';
import { UserCircle2, Plus, Mail, PhoneCall, Building2, Filter, Search, Calendar } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { HRContact } from '../types';
import { formatDate } from '../utils/formatters';

interface HRContactsPageProps {
  onOpenQuickCall: (companyId: string) => void;
  onSelectCompanyByName: (name: string) => void;
}

export const HRContactsPage: React.FC<HRContactsPageProps> = ({ onOpenQuickCall, onSelectCompanyByName }) => {
  const { hrContacts, openQuickAction, globalSearch } = usePlaceComm();

  const [filterChannel, setFilterChannel] = useState('All');

  const filteredHRs = useMemo(() => {
    return hrContacts.filter(hr => {
      if (globalSearch) {
        const q = globalSearch.toLowerCase();
        const matchName = hr.name.toLowerCase().includes(q);
        const matchComp = hr.companyName.toLowerCase().includes(q);
        const matchEmail = hr.email.toLowerCase().includes(q);
        const matchPhone = hr.phone.toLowerCase().includes(q);
        if (!matchName && !matchComp && !matchEmail && !matchPhone) return false;
      }

      if (filterChannel !== 'All' && hr.preferredChannel !== filterChannel) return false;

      return true;
    });
  }, [hrContacts, globalSearch, filterChannel]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <UserCircle2 className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">HR &amp; Recruiter CRM Directory</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Directory of {filteredHRs.length} corporate talent acquisition partners and university relations leads
          </p>
        </div>

        <button
          onClick={() => openQuickAction('add-hr')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add HR Contact</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex items-center gap-2 text-xs">
        <Filter className="w-3.5 h-3.5 text-blue-600" />
        <span className="font-semibold text-slate-700">Preferred Channel:</span>
        <select
          value={filterChannel}
          onChange={(e) => setFilterChannel(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Channels</option>
          <option value="Email">Email</option>
          <option value="Call">Call</option>
          <option value="WhatsApp">WhatsApp</option>
        </select>
      </div>

      {/* HR Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredHRs.map(hr => (
          <div key={hr.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{hr.name}</h3>
                  <p className="text-xs text-slate-600 font-medium">{hr.designation}</p>
                </div>
                {hr.isPrimary && (
                  <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 shrink-0">
                    Primary
                  </span>
                )}
              </div>

              <button
                onClick={() => onSelectCompanyByName(hr.companyName)}
                className="text-xs font-semibold text-blue-900 hover:underline flex items-center gap-1"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{hr.companyName}</span>
              </button>

              <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${hr.email}`} className="text-blue-600 hover:underline truncate">{hr.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-800 font-medium">{hr.phone}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Channel: <strong>{hr.preferredChannel}</strong></span>
                  <span>PC Lead: {hr.relationshipOwner}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[10px] text-slate-400">
                {hr.lastContactDate ? `Contacted: ${formatDate(hr.lastContactDate)}` : 'No recent call'}
              </span>

              <button
                onClick={() => onOpenQuickCall(hr.companyId)}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors"
              >
                <PhoneCall className="w-3 h-3" />
                <span>Call HR</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
