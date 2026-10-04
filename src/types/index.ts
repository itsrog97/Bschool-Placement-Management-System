export type UserRole = 'SUPER_ADMIN' | 'PLACEMENT_COORDINATOR' | 'ADMIN' | 'VIEWER';

export type PCRole = 
  | 'Super Admin'
  | 'Placement Secretary'
  | 'Lead Coordinator'
  | 'Sector Lead - Consulting'
  | 'Sector Lead - BFSI'
  | 'Sector Lead - Tech & Product'
  | 'Sector Lead - FMCG & Trade'
  | 'Senior Coordinator'
  | 'Junior Coordinator';

export interface CoordinatorPermissions {
  canManageUsers: boolean;
  canExportData: boolean;
  canManageCompanies: boolean;
  canModifyStudents: boolean;
  canReleaseOffers: boolean;
  canAccessAuditLogs: boolean;
}

export interface CoordinatorUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PCRole;
  systemRole: UserRole;
  program: 'MBA-IB' | 'MBA-BA';
  batch: '2024-26' | '2025-27';
  sector: string;
  assignedCompaniesCount: number;
  status: 'Active' | 'Invited' | 'Suspended';
  avatar?: string;
  googleUid?: string;
  isGoogleLinked?: boolean;
  createdAt: string;
  lastLogin?: string;
  permissions: CoordinatorPermissions;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  pcRole?: PCRole;
  rollNumber?: string;
  phone?: string;
  avatar?: string;
  title?: string;
  googleUid?: string;
  isGoogleLinked?: boolean;
  permissions?: CoordinatorPermissions;
}

export type ProgramType = 'MBA-IB' | 'MBA-BA';
export type CampusType = 'Delhi';
export type SpecializationType = 
  | 'Finance' 
  | 'Marketing' 
  | 'Strategy & Consulting' 
  | 'Trade & Logistics' 
  | 'IT & Analytics' 
  | 'Operations & Supply Chain';

export type PlacementStatus = 'Unplaced' | 'Shortlisted' | 'Interviewing' | 'Placed' | 'Opted Out';

export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  program: ProgramType;
  campus: CampusType;
  batch: string; // e.g. '2024-26', '2025-27'
  specialization: SpecializationType;
  workExpMonths: number;
  ugDegree: string;
  ugCollege: string;
  cgpa: number;
  tenthPercent: number;
  twelfthPercent: number;
  isEligible: boolean;
  skills: string[];
  cvUrl?: string;
  resumeSummary?: string;
  
  // Placement outcomes
  summerStatus: PlacementStatus;
  summerCompanyId?: string;
  summerCompanyName?: string;
  summerStipend?: number; // Monthly in INR
  summerPPO?: boolean;
  
  finalStatus: PlacementStatus;
  finalCompanyId?: string;
  finalCompanyName?: string;
  finalCTC?: number; // In LPA (e.g. 28.5)
  finalFixed?: number;
  finalVariable?: number;
  finalJoiningBonus?: number;
  
  // Counters (computed / synchronized)
  shortlistsCount: number;
  interviewsCount: number;
  offersCount: number;
  
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type CompanyStatus = 
  | 'Prospect' 
  | 'Contacted' 
  | 'Interested' 
  | 'Discussion' 
  | 'Negotiation' 
  | 'Confirmed' 
  | 'Schedule Finalized' 
  | 'Hiring Active' 
  | 'Process Completed' 
  | 'Offer Released' 
  | 'Converted' 
  | 'On Hold' 
  | 'Declined';

export type RecruitmentCycleType = 'Summer' | 'Final' | 'Both';

export interface Company {
  id: string;
  name: string;
  industry: string;
  companyType: 'MNC' | 'Conglomerate' | 'Startup' | 'Consulting Firm' | 'Investment Bank' | 'Indian Enterprise';
  website: string;
  location: string;
  pcOwnerId: string;
  pcOwnerName: string;
  recruitmentType: RecruitmentCycleType;
  status: CompanyStatus;
  expectedVisitDate?: string;
  hiringIntent?: string;
  notes?: string;
  historicalHires: number;
  createdAt: string;
  updatedAt: string;
}

export interface HRContact {
  id: string;
  companyId: string;
  companyName: string;
  name: string;
  designation: string;
  email: string;
  phone: string;
  alternatePhone?: string;
  linkedin?: string;
  preferredChannel: 'Email' | 'Call' | 'WhatsApp';
  relationshipOwner: string;
  lastContactDate?: string;
  nextFollowUpDate?: string;
  isPrimary: boolean;
  notes?: string;
}

export type DriveStatus = 
  | 'Draft' 
  | 'Applications Open' 
  | 'Shortlisting' 
  | 'Interviews Scheduled' 
  | 'In Progress' 
  | 'Completed' 
  | 'Cancelled';

export interface RecruitmentDrive {
  id: string;
  companyId: string;
  companyName: string;
  cycle: string; // e.g. 'Final Placement 2026', 'Summer 2027'
  cycleType: 'Summer' | 'Final';
  jobProfile: string;
  jobDescription?: string;
  expectedHires: number;
  ctcLpa?: number;
  stipendPerMonth?: number;
  fixedLpa?: number;
  variableLpa?: number;
  joiningBonusLpa?: number;
  ppoOpportunity: boolean;
  minWorkExpMonths?: number;
  maxWorkExpMonths?: number;
  allowedPrograms: ProgramType[];
  allowedSpecializations: SpecializationType[];
  minCgpa: number;
  applicationDeadline?: string;
  shortlistDate?: string;
  interviewDate?: string;
  offerDate?: string;
  status: DriveStatus;
  ownerId: string;
  ownerName: string;
  createdAt: string;
}

export type FunnelStage = 
  | 'Eligible' 
  | 'Applied' 
  | 'Shortlisted' 
  | 'Interview 1' 
  | 'Interview 2' 
  | 'Final Round' 
  | 'Selected' 
  | 'Offer Received' 
  | 'Accepted' 
  | 'Placed' 
  | 'Rejected' 
  | 'Withdrawn';

export interface StudentApplication {
  id: string;
  driveId: string;
  companyName: string;
  profile: string;
  cycle: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  stage: FunnelStage;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
}

export interface ShortlistRecord {
  id: string;
  driveId: string;
  companyName: string;
  cycle: string;
  profile: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  studentSpecialization: string;
  studentCgpa: number;
  shortlistedAt: string;
  roundName: string;
  importedBy: string;
}

export type InterviewRound = 'GD' | 'Technical 1' | 'Technical 2' | 'Case Interview' | 'HR' | 'Partner Round' | 'Final';
export type InterviewStatus = 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Rescheduled' | 'No Show';
export type InterviewResult = 'Pending' | 'Selected' | 'Rejected' | 'Waitlisted';

export interface Interview {
  id: string;
  driveId: string;
  companyName: string;
  profile: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  round: InterviewRound;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string;
  mode: 'Online' | 'Offline - Campus' | 'Hybrid';
  venueOrLink: string;
  interviewerName?: string;
  status: InterviewStatus;
  result: InterviewResult;
  feedback?: string;
  notes?: string;
}

export type OfferStatus = 'Released' | 'Accepted' | 'Declined' | 'Withdrawn' | 'Pending';
export type OfferType = 'Summer Internship' | 'Final Placement' | 'PPO';

export interface Offer {
  id: string;
  driveId: string;
  companyId: string;
  companyName: string;
  studentId: string;
  studentRoll: string;
  studentName: string;
  profile: string;
  offerType: OfferType;
  offerDate: string;
  ctcLpa?: number;
  stipendPerMonth?: number;
  fixedLpa?: number;
  variableLpa?: number;
  joiningBonusLpa?: number;
  ppoOpportunity?: boolean;
  status: OfferStatus;
  acceptedAt?: string;
  validTill?: string;
}

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type FollowUpStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED';

export interface FollowUp {
  id: string;
  companyId: string;
  companyName: string;
  hrContactId?: string;
  hrName: string;
  hrPhone?: string;
  hrEmail?: string;
  pcOwnerId: string;
  pcOwnerName: string;
  priority: PriorityLevel;
  dueDate: string;
  status: FollowUpStatus;
  actionType: 'Call' | 'Email' | 'WhatsApp' | 'Meeting' | 'Share Shortlist' | 'Confirm Dates';
  notes: string;
  lastContactDate?: string;
}

export type ActivityType = 
  | 'Call' 
  | 'Email' 
  | 'WhatsApp' 
  | 'Meeting' 
  | 'JD Received' 
  | 'Shortlist Shared' 
  | 'Interview Scheduled' 
  | 'Offer Released' 
  | 'Status Change' 
  | 'Note';

export interface CompanyActivity {
  id: string;
  companyId: string;
  companyName: string;
  actorId: string;
  actorName: string;
  type: ActivityType;
  title: string;
  outcome?: string;
  notes: string;
  timestamp: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT';
  link?: string;
  read: boolean;
  createdAt: string;
}
