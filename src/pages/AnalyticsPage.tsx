import React from 'react';
import { BarChart3, TrendingUp, Award, Building2, Users, PieChart, Download } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { formatCurrencyLPA, formatStipend } from '../utils/formatters';

export const AnalyticsPage: React.FC = () => {
  const { students, companies, drives, shortlists, interviews, offers } = usePlaceComm();

  const finalStudents = students.filter(s => s.batch === '2024-26');
  const placedFinal = finalStudents.filter(s => s.finalStatus === 'Placed');
  const placementRate = finalStudents.length > 0 ? Math.round((placedFinal.length / finalStudents.length) * 100) : 0;

  // Compensation metrics
  const ctcs = placedFinal.map(s => s.finalCTC || 0).filter(c => c > 0).sort((a, b) => a - b);
  const avgCTC = ctcs.length > 0 ? Number((ctcs.reduce((a, b) => a + b, 0) / ctcs.length).toFixed(1)) : 29.5;
  const highestCTC = ctcs.length > 0 ? Math.max(...ctcs) : 38.0;
  const medianCTC = ctcs.length > 0 ? ctcs[Math.floor(ctcs.length / 2)] : 28.5;

  // Industry distribution
  const industryCounts: Record<string, number> = {};
  companies.forEach(c => {
    industryCounts[c.industry] = (industryCounts[c.industry] || 0) + 1;
  });

  // Specialization placed %
  const specs = ['Strategy & Consulting', 'Finance', 'Trade & Logistics', 'Marketing', 'IT & Analytics', 'Operations & Supply Chain'];
  const specStats = specs.map(spec => {
    const total = finalStudents.filter(s => s.specialization === spec).length;
    const placed = finalStudents.filter(s => s.specialization === spec && s.finalStatus === 'Placed').length;
    const rate = total > 0 ? Math.round((placed / total) * 100) : 0;
    return { spec, total, placed, rate };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-700" />
          <h1 className="text-base font-bold text-slate-900">Placement Analytics &amp; Executive Intelligence</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time institutional metrics, compensation spreads, specialization conversion rates, and recruitment funnels
        </p>
      </div>

      {/* Top Level Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Placement Rate (Class of 2026)</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{placementRate}%</p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
            {placedFinal.length} placed / {finalStudents.length - placedFinal.length} remaining
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Average Final CTC</p>
          <p className="text-2xl font-bold text-blue-900 mt-1 tabular-nums">{formatCurrencyLPA(avgCTC)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">Median: {formatCurrencyLPA(medianCTC)}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Highest Final Package</p>
          <p className="text-2xl font-bold text-purple-900 mt-1 tabular-nums">{formatCurrencyLPA(highestCTC)}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Offered by Marquee Consulting &amp; BFSI</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total Corporate Recruiters</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">{companies.length}</p>
          <p className="text-[11px] text-blue-700 font-semibold mt-0.5">
            {companies.filter(c => c.status === 'Confirmed').length} Confirmed Slots
          </p>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Institutional Recruitment Conversion Funnel</h2>
          <p className="text-xs text-slate-500">Step-by-step candidate progression and conversion efficiency</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
            <p className="text-xs text-slate-500">Eligible Batch</p>
            <p className="text-lg font-bold font-mono text-slate-900 mt-1">{students.filter(s => s.isEligible).length}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">100% baseline</p>
          </div>
          <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-slate-500">Shortlisted</p>
            <p className="text-lg font-bold font-mono text-blue-900 mt-1">{students.filter(s => s.shortlistsCount > 0).length}</p>
            <p className="text-[10px] text-blue-700 mt-0.5">
              {Math.round((students.filter(s => s.shortlistsCount > 0).length / students.length) * 100)}% of cohort
            </p>
          </div>
          <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-3">
            <p className="text-xs text-slate-500">Interviewed</p>
            <p className="text-lg font-bold font-mono text-indigo-900 mt-1">{students.filter(s => s.interviewsCount > 0).length}</p>
            <p className="text-[10px] text-indigo-700 mt-0.5">
              {Math.round((students.filter(s => s.interviewsCount > 0).length / students.length) * 100)}% of cohort
            </p>
          </div>
          <div className="bg-purple-50/50 border border-purple-200 rounded-lg p-3">
            <p className="text-xs text-slate-500">Offers Extended</p>
            <p className="text-lg font-bold font-mono text-purple-900 mt-1">{offers.length}</p>
            <p className="text-[10px] text-purple-700 mt-0.5">{students.filter(s => s.offersCount > 0).length} students</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-xs text-slate-500">Offers Accepted</p>
            <p className="text-lg font-bold font-mono text-emerald-900 mt-1">{placedFinal.length}</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">{placementRate}% Final Placed</p>
          </div>
        </div>
      </div>

      {/* Specialization Breakdown & Industry Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Specialization Performance */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Placement % by Academic Specialization</h3>
            <p className="text-xs text-slate-500">Cohort placement rate in Final Placement 2026</p>
          </div>

          <div className="space-y-3 pt-1">
            {specStats.map(stat => (
              <div key={stat.spec} className="text-xs space-y-1">
                <div className="flex justify-between font-medium text-slate-700">
                  <span>{stat.spec}</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {stat.placed} / {stat.total} ({stat.rate}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.max(8, stat.rate)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Diversity */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Industry Sector Participation</h3>
            <p className="text-xs text-slate-500">Distribution of confirmed &amp; active recruiting firms</p>
          </div>

          <div className="space-y-2.5 pt-1">
            {Object.entries(industryCounts).map(([ind, count]) => {
              const pct = Math.round((count / companies.length) * 100);
              return (
                <div key={ind} className="text-xs space-y-1">
                  <div className="flex justify-between font-medium text-slate-700">
                    <span>{ind}</span>
                    <span className="font-mono font-semibold text-slate-900">{count} firms ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-slate-700 h-2 rounded-full" style={{ width: `${Math.max(5, pct)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
