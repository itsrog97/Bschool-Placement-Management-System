import React, { useState, useMemo } from 'react';
import { History, Filter, User, Search } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatDate } from '../utils/formatters';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = usePlaceComm();

  const [filterEntity, setFilterEntity] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const entities = useMemo(() => {
    return Array.from(new Set(auditLogs.map(l => l.entity))).sort();
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (filterEntity !== 'All' && log.entity !== filterEntity) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchUser = log.userName.toLowerCase().includes(q);
        const matchAction = log.action.toLowerCase().includes(q);
        const matchDetails = log.details.toLowerCase().includes(q);
        if (!matchUser && !matchAction && !matchDetails) return false;
      }
      return true;
    }).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }, [auditLogs, filterEntity, searchQuery]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-blue-700" />
          <h1 className="text-base font-bold text-slate-900">Placement Operations Audit Trail</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Tamper-evident system activity log capturing student status updates, offer approvals, shortlist imports, and HR calls
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-blue-600" />
          <span className="font-semibold text-slate-700">Filter Entity:</span>
          <select
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-medium"
          >
            <option value="All">All Entities</option>
            {entities.map(e => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>

        <input
          type="text"
          placeholder="Filter by user or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900 placeholder-slate-400 focus:bg-white"
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/80 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor / User</th>
                <th className="py-2.5 px-3">Action Type</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-3">Detailed Modification Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                    {log.userName}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className="font-mono text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-800 border border-slate-200">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-blue-900 whitespace-nowrap">
                    {log.entity}
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 leading-relaxed">
                    {log.details}
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
