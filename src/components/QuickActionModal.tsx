import React, { useState } from 'react';
import {
  X,
  UserPlus,
  Building2,
  UserCircle2,
  Briefcase,
  UserCheck,
  CalendarDays,
  FileCheck,
  Clock,
  PhoneCall,
  UploadCloud,
  Check
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { ProgramType, CampusType, SpecializationType, CompanyStatus, RecruitmentCycleType, InterviewRound } from '../types';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: string | null;
  onOpenQuickCall: () => void;
  onNavigateTab: (tab: string) => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  actionType,
  onOpenQuickCall,
  onNavigateTab
}) => {
  const {
    students,
    companies,
    drives,
    currentUser,
    addStudent,
    addCompany,
    addHRContact,
    addDrive,
    addShortlist,
    addInterview,
    addOffer,
    addFollowUp
  } = usePlaceComm();

  const [activeForm, setActiveForm] = useState<string | null>(actionType === 'menu' ? null : actionType);

  // Form states
  // 1. Add Student
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentProgram, setStudentProgram] = useState<ProgramType>('MBA-IB');
  const [studentCampus, setStudentCampus] = useState<CampusType>('Delhi');
  const [studentBatch, setStudentBatch] = useState('2024-26');
  const [studentSpec, setStudentSpec] = useState<SpecializationType>('Strategy & Consulting');
  const [studentCgpa, setStudentCgpa] = useState('7.8');
  const [studentExp, setStudentExp] = useState('18');
  const [studentDegree, setStudentDegree] = useState('B.Tech');
  const [studentCollege, setStudentCollege] = useState('IIT Roorkee');

  // 2. Add Company
  const [compName, setCompName] = useState('');
  const [compIndustry, setCompIndustry] = useState('Management Consulting');
  const [compType, setCompType] = useState<'MNC' | 'Conglomerate' | 'Startup' | 'Consulting Firm' | 'Investment Bank' | 'Indian Enterprise'>('Consulting Firm');
  const [compLocation, setCompLocation] = useState('New Delhi');
  const [compWebsite, setCompWebsite] = useState('https://');
  const [compRecType, setCompRecType] = useState<RecruitmentCycleType>('Both');
  const [compStatus, setCompStatus] = useState<CompanyStatus>('Interested');
  const [compExpectedDate, setCompExpectedDate] = useState('');

  // 3. Add HR Contact
  const [hrName, setHrName] = useState('');
  const [hrCompanyId, setHrCompanyId] = useState(companies[0]?.id || '');
  const [hrDesignation, setHrDesignation] = useState('Lead Campus Recruiter');
  const [hrEmail, setHrEmail] = useState('');
  const [hrPhone, setHrPhone] = useState('');
  const [hrChannel, setHrChannel] = useState<'Email' | 'Call' | 'WhatsApp'>('Email');

  // 4. Create Drive
  const [driveCompanyId, setDriveCompanyId] = useState(companies[0]?.id || '');
  const [driveCycle, setDriveCycle] = useState('Final Placement 2026');
  const [driveType, setDriveType] = useState<'Final' | 'Summer'>('Final');
  const [driveProfile, setDriveProfile] = useState('');
  const [driveCTC, setDriveCTC] = useState('28.0');
  const [driveStipend, setDriveStipend] = useState('180000');
  const [driveExpectedHires, setDriveExpectedHires] = useState('5');
  const [driveMinCgpa, setDriveMinCgpa] = useState('6.5');

  // 5. Add Shortlist
  const [shortlistDriveId, setShortlistDriveId] = useState(drives[0]?.id || '');
  const [shortlistStudentId, setShortlistStudentId] = useState(students[0]?.id || '');
  const [shortlistRound, setShortlistRound] = useState('Round 1 Interview');

  // 6. Schedule Interview
  const [intDriveId, setIntDriveId] = useState(drives[0]?.id || '');
  const [intStudentId, setIntStudentId] = useState(students[0]?.id || '');
  const [intRound, setIntRound] = useState<InterviewRound>('Case Interview');
  const [intDate, setIntDate] = useState('2026-10-04');
  const [intStartTime, setIntStartTime] = useState('10:00');
  const [intEndTime, setIntEndTime] = useState('10:45');
  const [intMode, setIntMode] = useState<'Online' | 'Offline - Campus' | 'Hybrid'>('Online');
  const [intVenue, setIntVenue] = useState('https://zoom.us/j/campus-panel');
  const [intInterviewer, setIntInterviewer] = useState('Partner / Senior Director');

  // 7. Add Offer
  const [offerDriveId, setOfferDriveId] = useState(drives[0]?.id || '');
  const [offerStudentId, setOfferStudentId] = useState(students[0]?.id || '');
  const [offerCTC, setOfferCTC] = useState('32.0');
  const [offerType, setOfferType] = useState<'Final Placement' | 'Summer Internship' | 'PPO'>('Final Placement');

  // 8. Add Follow-Up
  const [fupCompanyId, setFupCompanyId] = useState(companies[0]?.id || '');
  const [fupDueDate, setFupDueDate] = useState('2026-10-05');
  const [fupPriority, setFupPriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');
  const [fupAction, setFupAction] = useState<'Call' | 'Email' | 'WhatsApp' | 'Meeting' | 'Share Shortlist' | 'Confirm Dates'>('Call');
  const [fupNotes, setFupNotes] = useState('');

  if (!isOpen) return null;

  const quickActionsList = [
    { id: 'add-student', label: 'Add Student', icon: UserPlus, desc: 'Register student in master database' },
    { id: 'add-company', label: 'Add Company', icon: Building2, desc: 'Add corporate recruiter to CRM pipeline' },
    { id: 'add-hr', label: 'Add HR Contact', icon: UserCircle2, desc: 'Add recruiter designation, phone & email' },
    { id: 'create-drive', label: 'Create Recruitment Drive', icon: Briefcase, desc: 'Open profile, CTC, and eligibility drive' },
    { id: 'add-shortlist', label: 'Add Shortlist', icon: UserCheck, desc: 'Shortlist student for company drive' },
    { id: 'schedule-interview', label: 'Schedule Interview', icon: CalendarDays, desc: 'Set time, round & interview link' },
    { id: 'add-offer', label: 'Add Offer', icon: FileCheck, desc: 'Record placement or internship offer' },
    { id: 'add-followup', label: 'Add Follow-up', icon: Clock, desc: 'Schedule task for Placement Coordinator' },
    { id: 'log-call', label: 'Log HR Call (<20s)', icon: PhoneCall, desc: 'Record call outcome & next follow-up' },
    { id: 'upload-excel', label: 'Excel Import Engine', icon: UploadCloud, desc: 'Bulk import students, companies, or shortlists' }
  ];

  const handleActionSelect = (id: string) => {
    if (id === 'log-call') {
      onClose();
      onOpenQuickCall();
    } else if (id === 'upload-excel') {
      onClose();
      onNavigateTab('imports');
    } else {
      setActiveForm(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {activeForm ? `Quick Action: ${quickActionsList.find(a => a.id === activeForm)?.label}` : 'Placement Operations Quick Action'}
            </span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Menu View */}
        {!activeForm && (
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[80vh] overflow-y-auto">
            {quickActionsList.map(a => {
              const Icon = a.icon;
              return (
                <button
                  key={a.id}
                  onClick={() => handleActionSelect(a.id)}
                  className="p-3 text-left border border-slate-200 rounded-lg hover:border-blue-500 hover:bg-blue-50/50 transition-all group flex items-start gap-3"
                >
                  <div className="p-2 bg-slate-100 rounded-md text-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-900">{a.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{a.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* 1. Add Student Form */}
        {activeForm === 'add-student' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addStudent({
                rollNumber: studentRoll || `IB-2024-${Math.floor(100 + Math.random() * 900)}`,
                name: studentName,
                email: studentEmail || `${studentName.toLowerCase().replace(' ', '.')}.ib@iift.edu`,
                phone: studentPhone || '+91 98100 12345',
                gender: 'Male',
                program: studentProgram,
                campus: studentCampus,
                batch: studentBatch,
                specialization: studentSpec,
                workExpMonths: Number(studentExp) || 0,
                ugDegree: studentDegree,
                ugCollege: studentCollege,
                cgpa: Number(studentCgpa) || 7.5,
                tenthPercent: 90,
                twelfthPercent: 88,
                isEligible: true,
                skills: ['Strategy', 'Financial Modeling', 'International Trade'],
                summerStatus: 'Unplaced',
                finalStatus: 'Unplaced'
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Siddharth Menon"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g. IB-2024-118"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Program</label>
                <select
                  value={studentProgram}
                  onChange={(e) => setStudentProgram(e.target.value as ProgramType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="MBA-IB">MBA-IB</option>
                  <option value="MBA-BA">MBA-BA</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Batch</label>
                <select
                  value={studentBatch}
                  onChange={(e) => setStudentBatch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="2024-26">2024-26 (Final)</option>
                  <option value="2025-27">2025-27 (Summer)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campus</label>
                <select
                  value={studentCampus}
                  onChange={(e) => setStudentCampus(e.target.value as CampusType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="Delhi">Delhi (Main Campus)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialization</label>
                <select
                  value={studentSpec}
                  onChange={(e) => setStudentSpec(e.target.value as SpecializationType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="Strategy & Consulting">Strategy & Consulting</option>
                  <option value="Finance">Finance</option>
                  <option value="Trade & Logistics">Trade & Logistics</option>
                  <option value="Marketing">Marketing</option>
                  <option value="IT & Analytics">IT & Analytics</option>
                  <option value="Operations & Supply Chain">Operations & Supply Chain</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  value={studentCgpa}
                  onChange={(e) => setStudentCgpa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Work Exp (Months)</label>
                <input
                  type="number"
                  value={studentExp}
                  onChange={(e) => setStudentExp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Save Student
              </button>
            </div>
          </form>
        )}

        {/* 2. Add Company Form */}
        {activeForm === 'add-company' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addCompany({
                name: compName,
                industry: compIndustry,
                companyType: compType,
                website: compWebsite,
                location: compLocation,
                pcOwnerId: currentUser.id,
                pcOwnerName: currentUser.name,
                recruitmentType: compRecType,
                status: compStatus,
                expectedVisitDate: compExpectedDate || undefined,
                historicalHires: 0
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bain & Company"
                  value={compName}
                  onChange={(e) => setCompName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Management Consulting"
                  value={compIndustry}
                  onChange={(e) => setCompIndustry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recruitment Type</label>
                <select
                  value={compRecType}
                  onChange={(e) => setCompRecType(e.target.value as RecruitmentCycleType)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="Both">Both (Summer &amp; Final)</option>
                  <option value="Final">Final Placement</option>
                  <option value="Summer">Summer Placement</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
                <select
                  value={compStatus}
                  onChange={(e) => setCompStatus(e.target.value as CompanyStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-medium"
                >
                  <option value="Prospect">Prospect</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interested">Interested</option>
                  <option value="Discussion">Discussion</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Visit</label>
                <input
                  type="date"
                  value={compExpectedDate}
                  onChange={(e) => setCompExpectedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Save Company
              </button>
            </div>
          </form>
        )}

        {/* 3. Add HR Contact */}
        {activeForm === 'add-hr' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const comp = companies.find(c => c.id === hrCompanyId);
              addHRContact({
                companyId: hrCompanyId,
                companyName: comp?.name || 'Company',
                name: hrName,
                designation: hrDesignation,
                email: hrEmail,
                phone: hrPhone,
                preferredChannel: hrChannel,
                relationshipOwner: currentUser.name,
                isPrimary: true
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <select
                value={hrCompanyId}
                onChange={(e) => setHrCompanyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                required
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">HR Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shalini Roy"
                  value={hrName}
                  onChange={(e) => setHrName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input
                  type="text"
                  required
                  value={hrDesignation}
                  onChange={(e) => setHrDesignation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="hr@company.com"
                  value={hrEmail}
                  onChange={(e) => setHrEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98111 22334"
                  value={hrPhone}
                  onChange={(e) => setHrPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Save HR Contact
              </button>
            </div>
          </form>
        )}

        {/* 4. Create Drive Form */}
        {activeForm === 'create-drive' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const comp = companies.find(c => c.id === driveCompanyId);
              addDrive({
                companyId: driveCompanyId,
                companyName: comp?.name || 'Company',
                cycle: driveCycle,
                cycleType: driveType,
                jobProfile: driveProfile,
                expectedHires: Number(driveExpectedHires) || 1,
                ctcLpa: driveType === 'Final' ? Number(driveCTC) : undefined,
                stipendPerMonth: driveType === 'Summer' ? Number(driveStipend) : undefined,
                ppoOpportunity: driveType === 'Summer',
                allowedPrograms: ['MBA-IB', 'MBA-BA'],
                allowedSpecializations: ['Strategy & Consulting', 'Finance', 'Trade & Logistics'],
                minCgpa: Number(driveMinCgpa) || 6.5,
                status: 'Applications Open',
                ownerId: currentUser.id,
                ownerName: currentUser.name
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                <select
                  value={driveCompanyId}
                  onChange={(e) => setDriveCompanyId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Recruitment Cycle</label>
                <select
                  value={driveType}
                  onChange={(e) => {
                    const t = e.target.value as 'Final' | 'Summer';
                    setDriveType(t);
                    setDriveCycle(t === 'Final' ? 'Final Placement 2026' : 'Summer Placement 2027');
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  <option value="Final">Final Placement 2026</option>
                  <option value="Summer">Summer Placement 2027</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Profile Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Associate Consultant - Global Trade Strategy"
                value={driveProfile}
                onChange={(e) => setDriveProfile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {driveType === 'Final' ? 'CTC (in LPA)' : 'Stipend / Month'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={driveType === 'Final' ? driveCTC : driveStipend}
                  onChange={(e) => driveType === 'Final' ? setDriveCTC(e.target.value) : setDriveStipend(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expected Hires</label>
                <input
                  type="number"
                  value={driveExpectedHires}
                  onChange={(e) => setDriveExpectedHires(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Min CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={driveMinCgpa}
                  onChange={(e) => setDriveMinCgpa(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Open Drive
              </button>
            </div>
          </form>
        )}

        {/* 5. Add Shortlist */}
        {activeForm === 'add-shortlist' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const drive = drives.find(d => d.id === shortlistDriveId);
              const student = students.find(s => s.id === shortlistStudentId);
              if (!drive || !student) return;
              addShortlist({
                driveId: drive.id,
                companyName: drive.companyName,
                cycle: drive.cycle,
                profile: drive.jobProfile,
                studentId: student.id,
                studentRoll: student.rollNumber,
                studentName: student.name,
                studentSpecialization: student.specialization,
                studentCgpa: student.cgpa,
                roundName: shortlistRound,
                importedBy: currentUser.name
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Recruitment Drive</label>
              <select
                value={shortlistDriveId}
                onChange={(e) => setShortlistDriveId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              >
                {drives.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.companyName} · {d.jobProfile} ({d.cycle})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select Student</label>
              <select
                value={shortlistStudentId}
                onChange={(e) => setShortlistStudentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              >
                {students.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.rollNumber} — {s.name} ({s.specialization}, CGPA {s.cgpa})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Round Name</label>
              <input
                type="text"
                value={shortlistRound}
                onChange={(e) => setShortlistRound(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Add Shortlist Record
              </button>
            </div>
          </form>
        )}

        {/* 6. Schedule Interview */}
        {activeForm === 'schedule-interview' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const drive = drives.find(d => d.id === intDriveId);
              const student = students.find(s => s.id === intStudentId);
              if (!drive || !student) return;
              addInterview({
                driveId: drive.id,
                companyName: drive.companyName,
                profile: drive.jobProfile,
                studentId: student.id,
                studentRoll: student.rollNumber,
                studentName: student.name,
                round: intRound,
                date: intDate,
                startTime: intStartTime,
                endTime: intEndTime,
                mode: intMode,
                venueOrLink: intVenue,
                interviewerName: intInterviewer,
                status: 'Scheduled',
                result: 'Pending'
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Drive</label>
                <select
                  value={intDriveId}
                  onChange={(e) => setIntDriveId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  {drives.map(d => (
                    <option key={d.id} value={d.id}>{d.companyName} · {d.jobProfile}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Student</label>
                <select
                  value={intStudentId}
                  onChange={(e) => setIntStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.rollNumber} — {s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Round</label>
                <select
                  value={intRound}
                  onChange={(e) => setIntRound(e.target.value as InterviewRound)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="GD">Group Discussion</option>
                  <option value="Case Interview">Case Interview</option>
                  <option value="Technical 1">Technical 1</option>
                  <option value="Technical 2">Technical 2</option>
                  <option value="Partner Round">Partner Round</option>
                  <option value="HR">HR Round</option>
                  <option value="Final">Final Round</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                <input
                  type="date"
                  value={intDate}
                  onChange={(e) => setIntDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Time (Start - End)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={intStartTime}
                    onChange={(e) => setIntStartTime(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-300 rounded-md px-1.5 py-1.5 text-xs text-slate-900 font-mono text-center"
                  />
                  <input
                    type="text"
                    value={intEndTime}
                    onChange={(e) => setIntEndTime(e.target.value)}
                    className="w-1/2 bg-slate-50 border border-slate-300 rounded-md px-1.5 py-1.5 text-xs text-slate-900 font-mono text-center"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Meeting Link or Campus Venue</label>
              <input
                type="text"
                value={intVenue}
                onChange={(e) => setIntVenue(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Schedule Interview
              </button>
            </div>
          </form>
        )}

        {/* 7. Add Offer */}
        {activeForm === 'add-offer' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const drive = drives.find(d => d.id === offerDriveId);
              const student = students.find(s => s.id === offerStudentId);
              if (!drive || !student) return;
              addOffer({
                driveId: drive.id,
                companyId: drive.companyId,
                companyName: drive.companyName,
                studentId: student.id,
                studentRoll: student.rollNumber,
                studentName: student.name,
                profile: drive.jobProfile,
                offerType: offerType,
                ctcLpa: offerType !== 'Summer Internship' ? Number(offerCTC) : undefined,
                stipendPerMonth: offerType === 'Summer Internship' ? 220000 : undefined,
                fixedLpa: Number(offerCTC) * 0.8,
                variableLpa: Number(offerCTC) * 0.15,
                joiningBonusLpa: Number(offerCTC) * 0.05,
                status: 'Released'
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Drive</label>
                <select
                  value={offerDriveId}
                  onChange={(e) => setOfferDriveId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  {drives.map(d => (
                    <option key={d.id} value={d.id}>{d.companyName} · {d.jobProfile}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Selected Candidate</label>
                <select
                  value={offerStudentId}
                  onChange={(e) => setOfferStudentId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.rollNumber} — {s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Offer Type</label>
                <select
                  value={offerType}
                  onChange={(e) => setOfferType(e.target.value as 'Final Placement' | 'Summer Internship' | 'PPO')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
                >
                  <option value="Final Placement">Final Placement</option>
                  <option value="PPO">Pre-Placement Offer (PPO)</option>
                  <option value="Summer Internship">Summer Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Total CTC (in LPA)</label>
                <input
                  type="number"
                  step="0.1"
                  value={offerCTC}
                  onChange={(e) => setOfferCTC(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Release Offer
              </button>
            </div>
          </form>
        )}

        {/* 8. Add Follow-Up */}
        {activeForm === 'add-followup' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const comp = companies.find(c => c.id === fupCompanyId);
              if (!comp) return;
              addFollowUp({
                companyId: comp.id,
                companyName: comp.name,
                hrName: 'Campus TA Lead',
                pcOwnerId: currentUser.id,
                pcOwnerName: currentUser.name,
                priority: fupPriority,
                dueDate: fupDueDate,
                status: 'PENDING',
                actionType: fupAction,
                notes: fupNotes || 'Follow-up regarding upcoming placement schedule and slot confirmation'
              });
              onClose();
            }}
            className="p-5 space-y-3"
          >
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <select
                value={fupCompanyId}
                onChange={(e) => setFupCompanyId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              >
                {companies.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={fupDueDate}
                  onChange={(e) => setFupDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Priority</label>
                <select
                  value={fupPriority}
                  onChange={(e) => setFupPriority(e.target.value as 'HIGH' | 'MEDIUM' | 'LOW')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 font-semibold"
                >
                  <option value="HIGH">HIGH (Urgent)</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Action Type</label>
                <select
                  value={fupAction}
                  onChange={(e) => setFupAction(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Confirm Dates">Confirm Dates</option>
                  <option value="Share Shortlist">Share Shortlist</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Follow-up Task Description</label>
              <textarea
                rows={2}
                value={fupNotes}
                onChange={(e) => setFupNotes(e.target.value)}
                placeholder="What needs to be accomplished during this outreach?"
                className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button type="button" onClick={() => setActiveForm(null)} className="px-3 py-1.5 text-xs text-slate-600">Back</button>
              <button type="submit" className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-md flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Save Follow-up
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
