import React, { useState, useMemo } from 'react';
import { FileCheck, Plus, Filter, Check, X, Award, AlertCircle } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { Offer, OfferStatus } from '../types';
import { formatCurrencyLPA, formatStipend, formatDate } from '../utils/formatters';

export const OffersPage: React.FC = () => {
  const { offers, acceptOffer, declineOffer, openQuickAction, canEdit } = usePlaceComm();

  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredOffers = useMemo(() => {
    return offers.filter(o => {
      if (filterType !== 'All' && o.offerType !== filterType) return false;
      if (filterStatus !== 'All' && o.status !== filterStatus) return false;
      return true;
    });
  }, [offers, filterType, filterStatus]);

  const acceptedCount = offers.filter(o => o.status === 'Accepted').length;
  const releasedCount = offers.filter(o => o.status === 'Released').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-700" />
            <h1 className="text-base font-bold text-slate-900">Offers &amp; Conversion Engine</h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Tracking {offers.length} offers ({acceptedCount} accepted conversions, {releasedCount} awaiting decision)
          </p>
        </div>

        <button
          onClick={() => openQuickAction('add-offer')}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Record New Offer</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center gap-2 text-xs">
        <div className="flex items-center gap-1 text-slate-500 mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filter Offers:</span>
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Offer Types</option>
          <option value="Final Placement">Final Placement</option>
          <option value="PPO">Pre-Placement Offer (PPO)</option>
          <option value="Summer Internship">Summer Internship</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
        >
          <option value="All">All Statuses</option>
          <option value="Released">Released / Pending</option>
          <option value="Accepted">Accepted (Placed)</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {/* Offers Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Company</th>
                <th className="py-2.5 px-3">Role / Profile</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Offer Type</th>
                <th className="py-2.5 px-3 text-right">Compensation</th>
                <th className="py-2.5 px-3">Offer Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Placement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOffers.map(offer => (
                <tr key={offer.id} className="hover:bg-blue-50/30">
                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">{offer.companyName}</td>
                  <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">{offer.profile}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-medium text-slate-900">{offer.studentName}</span>
                    <span className="font-mono text-slate-500 text-[11px] ml-1.5">({offer.studentRoll})</span>
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-800 font-semibold text-[10px]">
                      {offer.offerType}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-right font-bold text-blue-900 whitespace-nowrap">
                    {offer.ctcLpa ? formatCurrencyLPA(offer.ctcLpa) : formatStipend(offer.stipendPerMonth)}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">{formatDate(offer.offerDate)}</td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      offer.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' :
                      offer.status === 'Released' ? 'bg-blue-50 text-blue-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {offer.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap">
                    {offer.status === 'Released' && canEdit ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => acceptOffer(offer.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-[11px] flex items-center gap-1 shadow-xs"
                          title="Accept Offer: updates student status to Placed"
                        >
                          <Check className="w-3 h-3" />
                          <span>Accept &amp; Place</span>
                        </button>
                        <button
                          onClick={() => declineOffer(offer.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px]"
                          title="Decline Offer"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {offer.acceptedAt ? `Accepted on ${formatDate(offer.acceptedAt)}` : 'Processed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
