import React, { useState } from 'react';
import { Settings, Shield, RefreshCw, CheckCircle2, School, Database, Users } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';

export const SettingsPage: React.FC = () => {
  const { currentUser, resetToDemoData, isSuperAdmin } = usePlaceComm();
  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    if (confirm('Reset entire system state back to factory demo dataset?')) {
      resetToDemoData();
      setResetDone(true);
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-700" />
          <h1 className="text-base font-bold text-slate-900">Placement Policy &amp; System Configuration</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Campus placement rules, active academic cycles, role privileges, and persistence controls
        </p>
      </div>

      {/* Institution Info */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <School className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">Institutional Identity &amp; Campuses</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Institution Name</label>
            <input
              type="text"
              readOnly
              value="Indian Institute of Foreign Trade (IIFT), New Delhi"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
            />
          </div>
          <div>
            <label className="block text-slate-500 font-medium mb-1">Campus Location</label>
            <input
              type="text"
              readOnly
              value="Delhi (Main Campus, Qutab Institutional Area)"
              className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-slate-900 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Academic Cycles & Specializations */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-900">Configured Academic Programs &amp; Batches</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900">MBA (International Business)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">Flagship 2-year residential program</p>
            <span className="inline-block mt-2 text-[10px] bg-blue-100 text-blue-800 font-semibold px-1.5 py-0.2 rounded">
              Batches: 2024-26, 2025-27
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <p className="font-bold text-slate-900">MBA (Business Analytics)</p>
            <p className="text-[11px] text-slate-500 mt-0.5">STEM-focused analytics &amp; AI trade models</p>
            <span className="inline-block mt-2 text-[10px] bg-indigo-100 text-indigo-800 font-semibold px-1.5 py-0.2 rounded">
              Batches: 2024-26, 2025-27
            </span>
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs font-semibold text-slate-700 mb-1.5">Approved Specializations:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'Strategy & Consulting',
              'Finance',
              'Trade & Logistics',
              'Marketing',
              'IT & Analytics',
              'Operations & Supply Chain'
            ].map(s => (
              <span key={s} className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded text-slate-800 font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Role Privileges */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Matrix</h3>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
              <tr>
                <th className="py-2 px-3">Role</th>
                <th className="py-2 px-3">Student Master</th>
                <th className="py-2 px-3">Company CRM</th>
                <th className="py-2 px-3">Interviews &amp; Offers</th>
                <th className="py-2 px-3">Audit Logs &amp; Imports</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3 font-bold text-blue-900">SUPER_ADMIN</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full CRUD</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full CRUD</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full Access</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full Access</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-900">PLACEMENT_COORDINATOR</td>
                <td className="py-2 px-3 text-emerald-700">Read &amp; Status Edit</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full CRM &amp; Calls</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full Operational</td>
                <td className="py-2 px-3 text-emerald-700">Upload &amp; Export</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-900">ADMIN (Faculty Chair)</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full CRUD</td>
                <td className="py-2 px-3 text-emerald-700">Audit &amp; Review</td>
                <td className="py-2 px-3 text-emerald-700">Approvals</td>
                <td className="py-2 px-3 text-emerald-700 font-semibold">Full Access</td>
              </tr>
              <tr>
                <td className="py-2 px-3 font-semibold text-slate-500">VIEWER (Auditor)</td>
                <td className="py-2 px-3 text-slate-500">Read-only</td>
                <td className="py-2 px-3 text-slate-500">Read-only</td>
                <td className="py-2 px-3 text-slate-500">Read-only</td>
                <td className="py-2 px-3 text-slate-500">Read-only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Demo Data Reset */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-rose-900">Factory Data Reset</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Restore initial IIFT Delhi master dataset (105 students, 35 top companies, drives, shortlists, partner interviews, offers, and follow-ups).
        </p>

        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          {resetDone && (
            <span className="text-xs font-medium text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Data reset successfully!</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
