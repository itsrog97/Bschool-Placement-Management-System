import React, { useState } from 'react';
import { X, PhoneCall, Check, Calendar } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { CompanyStatus } from '../types';

interface QuickCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedCompanyId?: string;
}

export const QuickCallModal: React.FC<QuickCallModalProps> = ({ isOpen, onClose, preselectedCompanyId }) => {
  const { companies, hrContacts, logQuickCall } = usePlaceComm();

  const [companyId, setCompanyId] = useState(preselectedCompanyId || (companies[0]?.id || ''));
  const [hrContactId, setHrContactId] = useState('');
  const [outcome, setOutcome] = useState('Interested');
  const [notes, setNotes] = useState('');
  const [nextFollowUpDate, setNextFollowUpDate] = useState('');
  const [updateStatus, setUpdateStatus] = useState<CompanyStatus | ''>('');

  if (!isOpen) return null;

  const relevantHRs = hrContacts.filter(h => h.companyId === companyId);
  const selectedCompany = companies.find(c => c.id === companyId);

  const outcomes = [
    'Interested',
    'Confirmed',
    'Requested JD',
    'Requested Student Data',
    'Call Back Later',
    'Negotiation',
    'No Response',
    'Not Interested',
    'Declined',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;

    logQuickCall({
      companyId,
      hrContactId: hrContactId || undefined,
      outcome,
      notes: notes || `Call outcome recorded: ${outcome}`,
      nextFollowUpDate: nextFollowUpDate || undefined,
      newCompanyStatus: updateStatus ? (updateStatus as CompanyStatus) : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm">Quick HR Call Logger (&lt;20s)</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Company</label>
            <select
              value={companyId}
              onChange={(e) => {
                setCompanyId(e.target.value);
                setHrContactId('');
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              required
            >
              {companies.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.status})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HR Contact</label>
              <select
                value={hrContactId}
                onChange={(e) => setHrContactId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="">General HR Desk</option>
                {relevantHRs.map(hr => (
                  <option key={hr.id} value={hr.id}>
                    {hr.name} ({hr.designation})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Call Outcome</label>
              <select
                value={outcome}
                onChange={(e) => {
                  setOutcome(e.target.value);
                  if (e.target.value === 'Confirmed') setUpdateStatus('Confirmed');
                  else if (e.target.value === 'Interested') setUpdateStatus('Interested');
                  else if (e.target.value === 'Declined') setUpdateStatus('Declined');
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600 font-medium"
                required
              >
                {outcomes.map(o => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Conversation Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Spoke to HR. Sent updated batch brochure. Need slot confirmation by Wednesday."
              className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Next Follow-up Due Date</span>
              </label>
              <input
                type="date"
                value={nextFollowUpDate}
                onChange={(e) => setNextFollowUpDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Update Company Stage</label>
              <select
                value={updateStatus}
                onChange={(e) => setUpdateStatus(e.target.value as CompanyStatus)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="">Keep current ({selectedCompany?.status})</option>
                <option value="Interested">Move to Interested</option>
                <option value="Discussion">Move to Discussion</option>
                <option value="Confirmed">Move to Confirmed</option>
                <option value="Schedule Finalized">Move to Schedule Finalized</option>
                <option value="Hiring Active">Move to Hiring Active</option>
                <option value="On Hold">Move to On Hold</option>
                <option value="Declined">Move to Declined</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-md shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Log Call &amp; Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
