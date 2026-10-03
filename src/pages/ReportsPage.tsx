import React from 'react';
import { FileSpreadsheet, Download, CheckCircle2, FileText, Calendar, Building2 } from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { downloadCSV } from '../utils/exportEngine';

export const ReportsPage: React.FC = () => {
  const { students, companies, drives, shortlists, offers, followUps } = usePlaceComm();

  const handleDownloadFinalReport = () => {
    const finalBatch = students.filter(s => s.batch === '2024-26');
    const data = finalBatch.map(s => ({
      'Roll Number': s.rollNumber,
      'Student Name': s.name,
      'Email': s.email,
      'Program': s.program,
      'Specialization': s.specialization,
      'CGPA': s.cgpa,
      'Work Experience (Mo)': s.workExpMonths,
      'Placement Status': s.finalStatus,
      'Placed Company': s.finalCompanyName || 'Unplaced',
      'CTC (LPA)': s.finalCTC || 'N/A',
      'Fixed Pay (LPA)': s.finalFixed || 'N/A',
      'Variable Pay (LPA)': s.finalVariable || 'N/A'
    }));
    downloadCSV('IIFT_Final_Placement_Report_2026', data);
  };

  const handleDownloadSummerReport = () => {
    const summerBatch = students.filter(s => s.batch === '2025-27');
    const data = summerBatch.map(s => ({
      'Roll Number': s.rollNumber,
      'Student Name': s.name,
      'Program': s.program,
      'Specialization': s.specialization,
      'CGPA': s.cgpa,
      'Summer Status': s.summerStatus,
      'Internship Company': s.summerCompanyName || 'Pending',
      'Monthly Stipend': s.summerStipend || 'N/A',
      'PPO Track': s.summerPPO ? 'Yes' : 'No'
    }));
    downloadCSV('IIFT_Summer_Placement_Report_2027', data);
  };

  const handleDownloadCompanyReport = () => {
    const data = companies.map(c => ({
      'Company Name': c.name,
      'Industry': c.industry,
      'Company Type': c.companyType,
      'Recruitment Cycle': c.recruitmentType,
      'Status': c.status,
      'Expected Visit Date': c.expectedVisitDate || 'TBD',
      'PlaceComm Owner': c.pcOwnerName,
      'Historical Alum Hires': c.historicalHires
    }));
    downloadCSV('IIFT_Company_Participation_Report', data);
  };

  const handleDownloadShortlistReport = () => {
    const data = shortlists.map(sh => ({
      'Company': sh.companyName,
      'Job Profile': sh.profile,
      'Recruitment Cycle': sh.cycle,
      'Roll Number': sh.studentRoll,
      'Candidate Name': sh.studentName,
      'Specialization': sh.studentSpecialization,
      'CGPA': sh.studentCgpa,
      'Round': sh.roundName,
      'Shortlisted Date': sh.shortlistedAt,
      'Imported By': sh.importedBy
    }));
    downloadCSV('IIFT_Shortlist_Master_Report', data);
  };

  const handleDownloadFollowUpReport = () => {
    const data = followUps.map(f => ({
      'Company': f.companyName,
      'HR Contact': f.hrName,
      'Phone': f.hrPhone || 'N/A',
      'Email': f.hrEmail || 'N/A',
      'Action Type': f.actionType,
      'Priority': f.priority,
      'Due Date': f.dueDate,
      'Status': f.status,
      'Assigned Coordinator': f.pcOwnerName,
      'Task Notes': f.notes
    }));
    downloadCSV('IIFT_HR_Followup_Task_Report', data);
  };

  const reportsList = [
    {
      title: 'Final Placement Comprehensive Master',
      desc: 'All graduating MBA students with placement status, placed companies, CTC, fixed/variable breakdowns, and contact information.',
      badge: 'Batch 2024-26',
      action: handleDownloadFinalReport
    },
    {
      title: 'Summer Placement Internship Report',
      desc: 'Summer internship allocation list, monthly stipends, participating companies, and PPO eligibility tracking.',
      badge: 'Batch 2025-27',
      action: handleDownloadSummerReport
    },
    {
      title: 'Company Outreach & Recruiter Directory',
      desc: 'Comprehensive register of corporate recruiters, hiring statuses, industry categories, and historical institutional hiring volumes.',
      badge: 'CRM Master',
      action: handleDownloadCompanyReport
    },
    {
      title: 'Shortlist Master Verification Report',
      desc: 'Consolidated records of all candidate shortlists mapped across corporate recruitment drives, CGPAs, and rounds.',
      badge: 'Verification',
      action: handleDownloadShortlistReport
    },
    {
      title: 'Corporate Relations Follow-up Audit',
      desc: 'Status log of Placement Coordinator outreach tasks, due dates, priority levels, and HR recruiter contact details.',
      badge: 'Operations',
      action: handleDownloadFollowUpReport
    }
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-700" />
          <h1 className="text-base font-bold text-slate-900">Official Placement Committee Reports</h1>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          One-click institutional data exports in CSV / Excel compatible format for leadership reporting and corporate verification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map(rep => (
          <div key={rep.title} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">{rep.title}</h3>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 shrink-0">
                  {rep.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{rep.desc}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Format: UTF-8 CSV / Excel</span>
              <button
                onClick={rep.action}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
