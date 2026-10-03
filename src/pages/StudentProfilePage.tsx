import React, { useState } from 'react';
import {
  ArrowLeft,
  Mail,
  Phone,
  GraduationCap,
  Briefcase,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Award,
  Edit,
  Save,
  FileCheck
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { Student } from '../types';
import { formatCurrencyLPA, formatStipend, formatDate, getPlacementStatusStyle } from '../utils/formatters';

interface StudentProfilePageProps {
  student: Student;
  onBack: () => void;
}

export const StudentProfilePage: React.FC<StudentProfilePageProps> = ({ student, onBack }) => {
  const { shortlists, interviews, offers, updateStudent, canEdit } = usePlaceComm();
  const [activeTab, setActiveTab] = useState<'overview' | 'resume' | 'companies' | 'interviews' | 'offers' | 'notes'>('overview');
  
  const [editingNotes, setEditingNotes] = useState(false);
  const [noteContent, setNoteContent] = useState(student.notes || '');

  // Associated records
  const studentShortlists = shortlists.filter(s => s.studentId === student.id || s.studentRoll === student.rollNumber);
  const studentInterviews = interviews.filter(i => i.studentId === student.id || i.studentRoll === student.rollNumber);
  const studentOffers = offers.filter(o => o.studentId === student.id || o.studentRoll === student.rollNumber);

  const statusBadge = getPlacementStatusStyle(student.finalStatus);

  const handleSaveNotes = () => {
    updateStudent(student.id, { notes: noteContent });
    setEditingNotes(false);
  };

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Student Directory</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
              {student.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{student.name}</h1>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                  {student.finalStatus}
                </span>
                {student.isEligible ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">Eligible</span>
                ) : (
                  <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-medium">Hold / Ineligible</span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Roll No: {student.rollNumber} · {student.program} ({student.batch}) · IIFT Delhi
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.email}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.phone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span>Specialization: {student.specialization}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Placement outcome tag if placed */}
          {student.finalStatus === 'Placed' && student.finalCompanyName && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-right shrink-0">
              <p className="text-[10px] uppercase font-semibold text-emerald-800">Placed At</p>
              <p className="text-sm font-bold text-emerald-950">{student.finalCompanyName}</p>
              <p className="text-xs font-mono font-semibold text-emerald-800">{formatCurrencyLPA(student.finalCTC)}</p>
            </div>
          )}
        </div>

        {/* Operational Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 mt-5 pt-4 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">CGPA</p>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{student.cgpa.toFixed(2)}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Work Experience</p>
            <p className="text-base font-bold font-mono text-slate-900 mt-0.5">{student.workExpMonths} Mo</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Shortlists</p>
            <p className="text-base font-bold font-mono text-blue-900 mt-0.5">{student.shortlistsCount}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Interviews</p>
            <p className="text-base font-bold font-mono text-indigo-900 mt-0.5">{student.interviewsCount}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Offers Received</p>
            <p className="text-base font-bold font-mono text-purple-900 mt-0.5">{student.offersCount}</p>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg text-center">
            <p className="text-[10px] text-slate-500">Summer Internship</p>
            <p className="text-xs font-semibold text-slate-900 mt-1 truncate">
              {student.summerCompanyName || 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex items-center gap-1 overflow-x-auto text-xs font-medium">
        {[
          { id: 'overview', label: 'Overview & Academics' },
          { id: 'resume', label: 'CV / Resume' },
          { id: 'companies', label: `Shortlists (${studentShortlists.length})` },
          { id: 'interviews', label: `Interviews (${studentInterviews.length})` },
          { id: 'offers', label: `Offers (${studentOffers.length})` },
          { id: 'notes', label: 'PlaceComm Notes' }
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

      {/* Tab 1: Overview & Academics */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Academic Background</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Undergraduate Degree:</span>
                <span className="font-semibold text-slate-900">{student.ugDegree}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Undergraduate College:</span>
                <span className="font-semibold text-slate-900">{student.ugCollege}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">IIFT Cumulative CGPA:</span>
                <span className="font-bold text-blue-900 font-mono">{student.cgpa.toFixed(2)} / 10.0</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Class 12th Percentage:</span>
                <span className="font-mono text-slate-800">{student.twelfthPercent}%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Class 10th Percentage:</span>
                <span className="font-mono text-slate-800">{student.tenthPercent}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Professional Skills &amp; Profile</h3>
            <div>
              <p className="text-xs text-slate-500 mb-1.5 font-medium">Verified Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {student.skills.map(s => (
                  <span key={s} className="px-2 py-1 bg-slate-100 text-slate-800 rounded text-[11px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-slate-500 mb-1 font-medium">Candidate Profile Summary:</p>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-200">
                {student.resumeSummary || 'Standard IIFT MBA candidate profile.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Resume */}
      {activeTab === 'resume' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Verified One-Page Placement CV</h3>
              <p className="text-xs text-slate-500">Standardized Placement Committee CV format</p>
            </div>
            <a
              href={student.cvUrl || '#'}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium"
            >
              Download PDF CV
            </a>
          </div>

          <div className="border border-slate-300 rounded-lg p-6 bg-slate-50 font-serif max-w-2xl mx-auto space-y-4 shadow-xs">
            <div className="text-center border-b border-slate-300 pb-3">
              <h2 className="text-base font-bold tracking-wider text-slate-900 uppercase">{student.name}</h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                {student.email} · {student.phone} · Indian Institute of Foreign Trade, New Delhi
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">Education</h4>
              <p className="text-xs text-slate-800 mt-1 font-sans">
                <strong>MBA (International Business)</strong>, IIFT Delhi · CGPA: {student.cgpa} ({student.batch})
              </p>
              <p className="text-xs text-slate-700 font-sans">
                <strong>{student.ugDegree}</strong>, {student.ugCollege} · 12th: {student.twelfthPercent}% · 10th: {student.tenthPercent}%
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">Work Experience</h4>
              <p className="text-xs text-slate-800 mt-1 font-sans">
                {student.workExpMonths > 0 ? (
                  <span>Prior Professional Experience: {student.workExpMonths} months in engineering and corporate consulting before MBA.</span>
                ) : (
                  <span>Fresher with proven academic and collegiate leadership distinction.</span>
                )}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-200 pb-1">Placement Focus</h4>
              <p className="text-xs text-slate-700 font-sans mt-1">
                Specialized in {student.specialization}. Strong analytical problem solving, financial evaluation, and cross-border commercial strategy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Shortlists */}
      {activeTab === 'companies' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Shortlisted Drives ({studentShortlists.length})</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {studentShortlists.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No active shortlist records on file.</div>
            ) : (
              studentShortlists.map(sh => (
                <div key={sh.id} className="p-3 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{sh.companyName}</p>
                    <p className="text-slate-600">{sh.profile} · <span className="font-mono text-slate-500">{sh.cycle}</span></p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-500">
                    <p>{sh.roundName}</p>
                    <p className="text-[10px] text-slate-400">{formatDate(sh.shortlistedAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Interviews */}
      {activeTab === 'interviews' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Interview History ({studentInterviews.length})</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {studentInterviews.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No scheduled or completed interviews recorded.</div>
            ) : (
              studentInterviews.map(i => (
                <div key={i.id} className="p-3 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900">{i.companyName} ({i.round})</p>
                    <p className="text-slate-600">{formatDate(i.date)} at {i.startTime} · {i.mode}</p>
                    {i.feedback && <p className="text-[11px] text-slate-500 mt-0.5">Feedback: {i.feedback}</p>}
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                      {i.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Offers */}
      {activeTab === 'offers' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">Offers Extended ({studentOffers.length})</span>
          </div>
          <div className="divide-y divide-slate-100 text-xs">
            {studentOffers.length === 0 ? (
              <div className="p-6 text-center text-slate-500">No offers currently logged for this student.</div>
            ) : (
              studentOffers.map(o => (
                <div key={o.id} className="p-3 hover:bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{o.companyName}</span>
                      <span className="text-[10px] bg-purple-50 text-purple-800 font-semibold px-1.5 py-0.2 rounded">
                        {o.offerType}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{o.profile}</p>
                    <p className="text-blue-900 font-mono font-semibold mt-1">
                      {o.ctcLpa ? formatCurrencyLPA(o.ctcLpa) : formatStipend(o.stipendPerMonth)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      o.status === 'Accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {o.status}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(o.offerDate)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 6: PlaceComm Notes */}
      {activeTab === 'notes' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Internal Committee Notes</h3>
            {canEdit && (
              editingNotes ? (
                <button
                  onClick={handleSaveNotes}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              ) : (
                <button
                  onClick={() => setEditingNotes(true)}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 text-xs font-medium flex items-center gap-1 border border-slate-300 rounded"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Notes
                </button>
              )
            )}
          </div>

          {editingNotes ? (
            <textarea
              rows={4}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-md p-3 text-xs text-slate-900 focus:bg-white"
              placeholder="Record candidate prep progress, company feedback, preference order, etc."
            />
          ) : (
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 min-h-[60px]">
              {student.notes || 'No internal committee notes recorded yet. Click Edit Notes to add observations.'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
