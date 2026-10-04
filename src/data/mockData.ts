import {
  Student,
  Company,
  HRContact,
  RecruitmentDrive,
  Interview,
  Offer,
  FollowUp,
  CompanyActivity,
  AuditLog,
  User,
  ShortlistRecord,
  CoordinatorUser
} from '../types';

export const CURRENT_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Aditya Sheetal',
    email: 'adityasheetal.0092@gmail.com',
    role: 'SUPER_ADMIN',
    pcRole: 'Super Admin',
    rollNumber: 'IB-2024-042',
    phone: '+91 98112 34567',
    title: 'Senior Placement Coordinator (Strategy & Tech)',
    isGoogleLinked: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    permissions: {
      canManageUsers: true,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: true,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-2',
    name: 'Tanya Verma',
    email: 'tanya.verma_ib24@iift.edu',
    role: 'PLACEMENT_COORDINATOR',
    pcRole: 'Placement Secretary',
    rollNumber: 'IB-2024-089',
    phone: '+91 98765 43210',
    title: 'Corporate Relations Coordinator (FMCG & Trade)',
    isGoogleLinked: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    permissions: {
      canManageUsers: true,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: true,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-3',
    name: 'Rahul Mehta',
    email: 'rahul.mehta_ba24@iift.edu',
    role: 'PLACEMENT_COORDINATOR',
    pcRole: 'Sector Lead - BFSI',
    rollNumber: 'BA-2024-015',
    phone: '+91 91234 56780',
    title: 'Corporate Relations Coordinator (BFSI & Analytics)',
    isGoogleLinked: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    permissions: {
      canManageUsers: false,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: false,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-4',
    name: 'Dr. R. K. Wadhwa',
    email: 'head.placements@iift.edu',
    role: 'ADMIN',
    pcRole: 'Super Admin',
    phone: '+91 11 3914 7200',
    title: 'Professor & Chairperson, Placements',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: false,
    permissions: {
      canManageUsers: true,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: true,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-5',
    name: 'Auditor & Observer',
    email: 'audit.placements@iift.edu',
    role: 'VIEWER',
    pcRole: 'Junior Coordinator',
    title: 'Institutional Placement Observer',
    permissions: {
      canManageUsers: false,
      canExportData: false,
      canManageCompanies: false,
      canModifyStudents: false,
      canReleaseOffers: false,
      canAccessAuditLogs: false
    }
  }
];

export const INITIAL_COORDINATORS: CoordinatorUser[] = [
  {
    id: 'user-1',
    name: 'Aditya Sheetal',
    email: 'adityasheetal.0092@gmail.com',
    phone: '+91 98112 34567',
    role: 'Super Admin',
    systemRole: 'SUPER_ADMIN',
    program: 'MBA-IB',
    batch: '2024-26',
    sector: 'Strategy & Consulting / Tech',
    assignedCompaniesCount: 8,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: true,
    createdAt: '2026-08-01T09:00:00Z',
    lastLogin: '2026-10-03T18:30:00Z',
    permissions: {
      canManageUsers: true,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: true,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-2',
    name: 'Tanya Verma',
    email: 'tanya.verma_ib24@iift.edu',
    phone: '+91 98765 43210',
    role: 'Placement Secretary',
    systemRole: 'ADMIN',
    program: 'MBA-IB',
    batch: '2024-26',
    sector: 'FMCG & Consumer Goods',
    assignedCompaniesCount: 6,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: true,
    createdAt: '2026-08-01T09:00:00Z',
    lastLogin: '2026-10-03T17:15:00Z',
    permissions: {
      canManageUsers: true,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: true,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-3',
    name: 'Rahul Mehta',
    email: 'rahul.mehta_ba24@iift.edu',
    phone: '+91 91234 56780',
    role: 'Sector Lead - BFSI',
    systemRole: 'PLACEMENT_COORDINATOR',
    program: 'MBA-BA',
    batch: '2024-26',
    sector: 'Investment Banking & Markets',
    assignedCompaniesCount: 5,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: true,
    createdAt: '2026-08-01T09:00:00Z',
    lastLogin: '2026-10-02T19:40:00Z',
    permissions: {
      canManageUsers: false,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: false,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-4',
    name: 'Dr. R. K. Wadhwa',
    email: 'head.placements@iift.edu',
    phone: '+91 11 3914 7200',
    role: 'Super Admin',
    systemRole: 'SUPER_ADMIN',
    program: 'MBA-IB',
    batch: '2024-26',
    sector: 'Executive Chairperson',
    assignedCompaniesCount: 16,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: false,
    createdAt: '2026-07-15T09:00:00Z',
    lastLogin: '2026-10-01T11:00:00Z',
    permissions: {
      canManageUsers: true,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: true,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-5',
    name: 'Priya Sundaram',
    email: 'priya.sundaram_ib25@iift.edu',
    phone: '+91 99401 22334',
    role: 'Sector Lead - Consulting',
    systemRole: 'PLACEMENT_COORDINATOR',
    program: 'MBA-IB',
    batch: '2025-27',
    sector: 'Strategy & Management Consulting',
    assignedCompaniesCount: 4,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: true,
    createdAt: '2026-08-20T10:00:00Z',
    lastLogin: '2026-10-03T14:10:00Z',
    permissions: {
      canManageUsers: false,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: false,
      canAccessAuditLogs: true
    }
  },
  {
    id: 'user-6',
    name: 'Aniket Sen',
    email: 'aniket.sen_ba25@iift.edu',
    phone: '+91 98300 77889',
    role: 'Sector Lead - Tech & Product',
    systemRole: 'PLACEMENT_COORDINATOR',
    program: 'MBA-BA',
    batch: '2025-27',
    sector: 'Cloud & Tech Analytics',
    assignedCompaniesCount: 4,
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isGoogleLinked: false,
    createdAt: '2026-08-22T11:00:00Z',
    lastLogin: '2026-10-02T16:20:00Z',
    permissions: {
      canManageUsers: false,
      canExportData: true,
      canManageCompanies: true,
      canModifyStudents: true,
      canReleaseOffers: false,
      canAccessAuditLogs: false
    }
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'McKinsey & Company',
    industry: 'Management Consulting',
    companyType: 'Consulting Firm',
    website: 'https://mckinsey.com',
    location: 'Gurugram / Mumbai',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Both',
    status: 'Confirmed',
    expectedVisitDate: '2026-10-15',
    hiringIntent: 'Seeking top 5% analytical minds for Associate & Junior Consultant roles.',
    notes: 'Case prep workshop conducted on 18 Sep. 42 shortlisted for Round 1.',
    historicalHires: 14,
    createdAt: '2026-08-01T10:00:00Z',
    updatedAt: '2026-10-02T14:30:00Z'
  },
  {
    id: 'comp-2',
    name: 'Boston Consulting Group (BCG)',
    industry: 'Management Consulting',
    companyType: 'Consulting Firm',
    website: 'https://bcg.com',
    location: 'New Delhi / Bengaluru',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Both',
    status: 'Schedule Finalized',
    expectedVisitDate: '2026-10-16',
    hiringIntent: 'Looking for Management Consultants with international trade & digital acumen.',
    notes: 'HR requested student CV books with verified CGPA and consulting club recommendations.',
    historicalHires: 12,
    createdAt: '2026-08-05T11:00:00Z',
    updatedAt: '2026-10-01T09:15:00Z'
  },
  {
    id: 'comp-3',
    name: 'Goldman Sachs',
    industry: 'Banking & Financial Services',
    companyType: 'Investment Bank',
    website: 'https://goldmansachs.com',
    location: 'Bengaluru / Mumbai',
    pcOwnerId: 'user-3',
    pcOwnerName: 'Rahul Mehta',
    recruitmentType: 'Both',
    status: 'Confirmed',
    expectedVisitDate: '2026-10-18',
    hiringIntent: 'Global Investment Research & Investment Banking Division analysts.',
    notes: 'Aptitude test completed on 25 Sep. 38 students cleared for Technical interviews.',
    historicalHires: 18,
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-10-03T11:00:00Z'
  },
  {
    id: 'comp-4',
    name: 'J.P. Morgan Chase & Co.',
    industry: 'Banking & Financial Services',
    companyType: 'Investment Bank',
    website: 'https://jpmorgan.com',
    location: 'Mumbai',
    pcOwnerId: 'user-3',
    pcOwnerName: 'Rahul Mehta',
    recruitmentType: 'Both',
    status: 'Hiring Active',
    expectedVisitDate: '2026-10-14',
    hiringIntent: 'Corporate Banking, Treasury Services, and Markets.',
    notes: 'Round 1 GDs finished today. Shortlisted 16 candidates for Partner Round.',
    historicalHires: 22,
    createdAt: '2026-08-12T09:30:00Z',
    updatedAt: '2026-10-03T16:00:00Z'
  },
  {
    id: 'comp-5',
    name: 'Hindustan Unilever Limited (HUL)',
    industry: 'FMCG',
    companyType: 'MNC',
    website: 'https://hul.co.in',
    location: 'Mumbai / Pan India',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    recruitmentType: 'Both',
    status: 'Confirmed',
    expectedVisitDate: '2026-10-22',
    hiringIntent: 'UFLP (Unilever Future Leaders Program) in Sales, Marketing & Supply Chain.',
    notes: 'HR confirmed Day 1 slot. Stipend INR 2,20,000/mo for summer interns.',
    historicalHires: 20,
    createdAt: '2026-08-14T14:00:00Z',
    updatedAt: '2026-09-29T15:20:00Z'
  },
  {
    id: 'comp-6',
    name: 'Maersk Line',
    industry: 'Shipping & International Logistics',
    companyType: 'MNC',
    website: 'https://maersk.com',
    location: 'Mumbai / Copenhagen / Singapore',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    recruitmentType: 'Both',
    status: 'Hiring Active',
    expectedVisitDate: '2026-10-12',
    hiringIntent: 'Global Trade Operations Manager & Ocean Freight Logistics Strategy.',
    notes: 'IIFT is Marquee campus for Maersk trade & supply chain leadership program.',
    historicalHires: 26,
    createdAt: '2026-08-15T10:00:00Z',
    updatedAt: '2026-10-03T13:45:00Z'
  },
  {
    id: 'comp-7',
    name: 'Amazon India',
    industry: 'E-commerce & Tech',
    companyType: 'MNC',
    website: 'https://amazon.jobs',
    location: 'Bengaluru / Hyderabad / Gurugram',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Both',
    status: 'Confirmed',
    expectedVisitDate: '2026-10-20',
    hiringIntent: 'Program Manager, Operations Manager & Category Manager.',
    notes: 'Amazon Leadership Principles assessment link dispatched to 140 applicants.',
    historicalHires: 32,
    createdAt: '2026-08-18T16:00:00Z',
    updatedAt: '2026-10-02T18:10:00Z'
  },
  {
    id: 'comp-8',
    name: 'Microsoft',
    industry: 'Information Technology',
    companyType: 'MNC',
    website: 'https://microsoft.com',
    location: 'Hyderabad / Bengaluru',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Final',
    status: 'Offer Released',
    expectedVisitDate: '2026-10-05',
    hiringIntent: 'Product Marketing Manager & Cloud Business Solutions Specialist.',
    notes: '6 offers extended with 36.5 LPA CTC. 4 accepted, 2 pending confirmation.',
    historicalHires: 10,
    createdAt: '2026-08-20T11:00:00Z',
    updatedAt: '2026-10-03T10:00:00Z'
  },
  {
    id: 'comp-9',
    name: 'Tata Steel',
    industry: 'Conglomerate & Heavy Industries',
    companyType: 'Indian Enterprise',
    website: 'https://tatasteel.com',
    location: 'New Delhi / Jamshedpur / Mumbai',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    recruitmentType: 'Both',
    status: 'Confirmed',
    expectedVisitDate: '2026-10-24',
    hiringIntent: 'International Trading & Raw Material Supply Chain division.',
    notes: 'Preference for MBA International Business with manufacturing or export background.',
    historicalHires: 16,
    createdAt: '2026-08-22T08:30:00Z',
    updatedAt: '2026-09-30T17:00:00Z'
  },
  {
    id: 'comp-10',
    name: 'ITC Limited',
    industry: 'Conglomerate & FMCG',
    companyType: 'Indian Enterprise',
    website: 'https://itcportal.com',
    location: 'Gurugram / Bengaluru',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    recruitmentType: 'Both',
    status: 'Schedule Finalized',
    expectedVisitDate: '2026-10-26',
    hiringIntent: 'Agri-Business & FMCG Brand Management roles.',
    notes: 'Agri Business Division offers international grain trading desks.',
    historicalHires: 15,
    createdAt: '2026-08-25T13:00:00Z',
    updatedAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'comp-11',
    name: 'Deloitte USI',
    industry: 'Consulting & Advisory',
    companyType: 'Consulting Firm',
    website: 'https://deloitte.com',
    location: 'Hyderabad / Bengaluru / Gurugram',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Both',
    status: 'Hiring Active',
    expectedVisitDate: '2026-10-10',
    hiringIntent: 'Strategy & Operations Consultant and Tech Strategy.',
    notes: 'Slot 1 finalized. 48 students in Technical Round 2 ongoing right now.',
    historicalHires: 35,
    createdAt: '2026-08-28T10:00:00Z',
    updatedAt: '2026-10-03T15:20:00Z'
  },
  {
    id: 'comp-12',
    name: 'Citibank N.A.',
    industry: 'Banking & Financial Services',
    companyType: 'Investment Bank',
    website: 'https://citigroup.com',
    location: 'Mumbai',
    pcOwnerId: 'user-3',
    pcOwnerName: 'Rahul Mehta',
    recruitmentType: 'Both',
    status: 'Discussion',
    expectedVisitDate: '2026-11-02',
    hiringIntent: 'Treasury & Trade Solutions (TTS) and Commercial Banking.',
    notes: 'HR asked for slot realignment with IIM Ahmedabad dates. Follow-up pending.',
    historicalHires: 12,
    createdAt: '2026-09-01T14:00:00Z',
    updatedAt: '2026-10-02T16:40:00Z'
  },
  {
    id: 'comp-13',
    name: 'DP World',
    industry: 'Ports & Global Trade Logistics',
    companyType: 'MNC',
    website: 'https://dpworld.com',
    location: 'Dubai / Mumbai',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    recruitmentType: 'Both',
    status: 'Confirmed',
    expectedVisitDate: '2026-10-28',
    hiringIntent: 'International Port Logistics Management & Trade Corridors.',
    notes: 'Providing international postings in UAE after 1 year training.',
    historicalHires: 8,
    createdAt: '2026-09-03T11:00:00Z',
    updatedAt: '2026-09-28T14:10:00Z'
  },
  {
    id: 'comp-14',
    name: 'Bain & Company',
    industry: 'Management Consulting',
    companyType: 'Consulting Firm',
    website: 'https://bain.com',
    location: 'Gurugram / Mumbai / Bengaluru',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Both',
    status: 'Discussion',
    expectedVisitDate: '2026-10-21',
    hiringIntent: 'Consultant & Senior Associate Consultant.',
    notes: 'Bain Capability Network (BCN) and Core Consulting JD under review.',
    historicalHires: 9,
    createdAt: '2026-09-05T09:00:00Z',
    updatedAt: '2026-10-01T15:00:00Z'
  },
  {
    id: 'comp-15',
    name: 'Google India',
    industry: 'Technology',
    companyType: 'MNC',
    website: 'https://careers.google.com',
    location: 'Gurugram / Hyderabad',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    recruitmentType: 'Final',
    status: 'Prospect',
    expectedVisitDate: '2026-11-10',
    hiringIntent: 'Large Customer Sales Strategy & Partner Solutions.',
    notes: 'Initial outreach email sent to Campus Lead. Need alumni referral hook.',
    historicalHires: 6,
    createdAt: '2026-09-10T12:00:00Z',
    updatedAt: '2026-09-27T10:00:00Z'
  },
  {
    id: 'comp-16',
    name: 'Adani Enterprises (Global Trade)',
    industry: 'Trading & Infrastructure',
    companyType: 'Conglomerate',
    website: 'https://adani.com',
    location: 'Ahmedabad / Singapore',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    recruitmentType: 'Both',
    status: 'Interested',
    expectedVisitDate: '2026-11-05',
    hiringIntent: 'Coal & Agri-Commodity International Trade Desks.',
    notes: 'Requested specialized batch profiles with International Economics / Trade background.',
    historicalHires: 14,
    createdAt: '2026-09-12T15:00:00Z',
    updatedAt: '2026-10-02T11:20:00Z'
  }
];

export const INITIAL_HR_CONTACTS: HRContact[] = [
  {
    id: 'hr-1',
    companyId: 'comp-1',
    companyName: 'McKinsey & Company',
    name: 'Radhika Sen',
    designation: 'Lead Campus Talent Acquisition (India B-Schools)',
    email: 'radhika_sen@mckinsey.com',
    phone: '+91 98101 23456',
    linkedin: 'https://linkedin.com/in/radhika-sen-talent',
    preferredChannel: 'Email',
    relationshipOwner: 'Aditya Sheetal',
    lastContactDate: '2026-10-01',
    nextFollowUpDate: '2026-10-04',
    isPrimary: true,
    notes: 'Very responsive on emails before 10 AM. Prefers consolidated shortlist sheets.'
  },
  {
    id: 'hr-2',
    companyId: 'comp-2',
    companyName: 'Boston Consulting Group (BCG)',
    name: 'Karan Malhotra',
    designation: 'Director - University & MBA Relations',
    email: 'malhotra.karan@bcg.com',
    phone: '+91 99200 44556',
    linkedin: 'https://linkedin.com/in/karan-malhotra-bcg',
    preferredChannel: 'WhatsApp',
    relationshipOwner: 'Aditya Sheetal',
    lastContactDate: '2026-09-28',
    nextFollowUpDate: '2026-10-03', // Due today
    isPrimary: true,
    notes: 'Urgent: Follow up regarding confirmed interview panel slots for 16th Oct.'
  },
  {
    id: 'hr-3',
    companyId: 'comp-3',
    companyName: 'Goldman Sachs',
    name: 'Ananya Saxena',
    designation: 'Vice President, Campus Recruitment (India)',
    email: 'ananya.saxena@gs.com',
    phone: '+91 98330 11223',
    alternatePhone: '+91 22 6616 8000',
    linkedin: 'https://linkedin.com/in/ananya-saxena-gs',
    preferredChannel: 'Call',
    relationshipOwner: 'Rahul Mehta',
    lastContactDate: '2026-10-02',
    nextFollowUpDate: '2026-10-05',
    isPrimary: true,
    notes: 'Requires candidate verification forms signed by Placement Office before test results release.'
  },
  {
    id: 'hr-4',
    companyId: 'comp-4',
    companyName: 'J.P. Morgan Chase & Co.',
    name: 'Vikramaditya Roy',
    designation: 'Head of Campus Engagement & Diversity',
    email: 'vikram.roy@jpmorgan.com',
    phone: '+91 98205 99887',
    preferredChannel: 'WhatsApp',
    relationshipOwner: 'Rahul Mehta',
    lastContactDate: '2026-10-03',
    nextFollowUpDate: '2026-10-04',
    isPrimary: true,
    notes: 'Currently on campus/virtual room overseeing Round 2 interviews.'
  },
  {
    id: 'hr-5',
    companyId: 'comp-5',
    companyName: 'Hindustan Unilever Limited (HUL)',
    name: 'Shruti Bhattacharya',
    designation: 'Senior Manager - Employer Branding & Early Careers',
    email: 'shruti.bhattacharya@unilever.com',
    phone: '+91 97110 55443',
    linkedin: 'https://linkedin.com/in/shruti-bhattacharya-hul',
    preferredChannel: 'Email',
    relationshipOwner: 'Tanya Verma',
    lastContactDate: '2026-09-25',
    nextFollowUpDate: '2026-10-02', // Overdue!
    isPrimary: true,
    notes: 'Follow-up overdue for UFLP slot allocation confirmation and JD sharing.'
  },
  {
    id: 'hr-6',
    companyId: 'comp-6',
    companyName: 'Maersk Line',
    name: 'Henrik Vestergaard',
    designation: 'Global Head of Maritime & Logistics Graduate Hiring',
    email: 'henrik.vestergaard@maersk.com',
    phone: '+45 3363 3363',
    alternatePhone: '+91 22 6658 9000',
    preferredChannel: 'Email',
    relationshipOwner: 'Tanya Verma',
    lastContactDate: '2026-10-02',
    nextFollowUpDate: '2026-10-06',
    isPrimary: true,
    notes: 'Speaks with Indian team via Mumbai HR desk (contact: Pooja Nair, pooja.nair@maersk.com).'
  },
  {
    id: 'hr-7',
    companyId: 'comp-7',
    companyName: 'Amazon India',
    name: 'Nikhil Kashyap',
    designation: 'Principal Campus Recruiter - MBA Programs',
    email: 'kashyapn@amazon.com',
    phone: '+91 98450 12399',
    preferredChannel: 'WhatsApp',
    relationshipOwner: 'Aditya Sheetal',
    lastContactDate: '2026-10-02',
    nextFollowUpDate: '2026-10-04',
    isPrimary: true,
    notes: 'Wants to double check if students have stable internet for ProctorU online test.'
  },
  {
    id: 'hr-8',
    companyId: 'comp-11',
    companyName: 'Deloitte USI',
    name: 'Meenakshi Sundaram',
    designation: 'Talent Acquisition Partner',
    email: 'msundaram@deloitte.com',
    phone: '+91 98711 77665',
    preferredChannel: 'Call',
    relationshipOwner: 'Aditya Sheetal',
    lastContactDate: '2026-10-03',
    nextFollowUpDate: '2026-10-04',
    isPrimary: true,
    notes: 'Conducting Round 2 interviews right now. Final shortlist list to be released tonight.'
  },
  {
    id: 'hr-9',
    companyId: 'comp-12',
    companyName: 'Citibank N.A.',
    name: 'Gaurav Singhal',
    designation: 'Campus Relationship Manager',
    email: 'gaurav.singhal@citi.com',
    phone: '+91 98212 33441',
    preferredChannel: 'Call',
    relationshipOwner: 'Rahul Mehta',
    lastContactDate: '2026-09-24',
    nextFollowUpDate: '2026-10-01', // Overdue!
    isPrimary: true,
    notes: 'Need to negotiate Day 2 slot vs Day 1 slot. Highly overdue.'
  }
];

export const INITIAL_DRIVES: RecruitmentDrive[] = [
  {
    id: 'drive-1',
    companyId: 'comp-1',
    companyName: 'McKinsey & Company',
    cycle: 'Final Placement 2026',
    cycleType: 'Final',
    jobProfile: 'Junior Associate - Management Consulting',
    jobDescription: 'Engage with C-suite executives on strategic business transformation, M&A due diligence, and growth strategies.',
    expectedHires: 6,
    ctcLpa: 35.0,
    fixedLpa: 28.0,
    variableLpa: 5.0,
    joiningBonusLpa: 2.0,
    ppoOpportunity: false,
    minWorkExpMonths: 0,
    maxWorkExpMonths: 60,
    allowedPrograms: ['MBA-IB', 'MBA-BA'],
    allowedSpecializations: ['Strategy & Consulting', 'Finance', 'Trade & Logistics'],
    minCgpa: 7.0,
    applicationDeadline: '2026-09-20',
    shortlistDate: '2026-09-28',
    interviewDate: '2026-10-15',
    offerDate: '2026-10-15',
    status: 'Shortlisting',
    ownerId: 'user-1',
    ownerName: 'Aditya Sheetal',
    createdAt: '2026-08-15T10:00:00Z'
  },
  {
    id: 'drive-2',
    companyId: 'comp-1',
    companyName: 'McKinsey & Company',
    cycle: 'Summer Placement 2027',
    cycleType: 'Summer',
    jobProfile: 'Summer Associate Intern - Consulting',
    jobDescription: '8-10 week high-impact client engagement with pre-placement interview (PPI/PPO) opportunity.',
    expectedHires: 8,
    stipendPerMonth: 250000,
    ppoOpportunity: true,
    minWorkExpMonths: 0,
    allowedPrograms: ['MBA-IB', 'MBA-BA'],
    allowedSpecializations: ['Strategy & Consulting', 'Finance', 'Marketing', 'Operations & Supply Chain'],
    minCgpa: 6.5,
    applicationDeadline: '2026-09-22',
    shortlistDate: '2026-09-30',
    interviewDate: '2026-10-15',
    offerDate: '2026-10-15',
    status: 'Shortlisting',
    ownerId: 'user-1',
    ownerName: 'Aditya Sheetal',
    createdAt: '2026-08-16T11:00:00Z'
  },
  {
    id: 'drive-3',
    companyId: 'comp-3',
    companyName: 'Goldman Sachs',
    cycle: 'Final Placement 2026',
    cycleType: 'Final',
    jobProfile: 'Investment Banking & Research Analyst',
    jobDescription: 'Financial modeling, valuation analysis, debt & equity capital markets underwriting, and global macroeconomic research.',
    expectedHires: 8,
    ctcLpa: 38.0,
    fixedLpa: 30.0,
    variableLpa: 6.0,
    joiningBonusLpa: 2.0,
    ppoOpportunity: false,
    minWorkExpMonths: 0,
    allowedPrograms: ['MBA-IB', 'MBA-BA'],
    allowedSpecializations: ['Finance', 'Strategy & Consulting'],
    minCgpa: 7.2,
    applicationDeadline: '2026-09-18',
    shortlistDate: '2026-09-25',
    interviewDate: '2026-10-18',
    offerDate: '2026-10-18',
    status: 'Interviews Scheduled',
    ownerId: 'user-3',
    ownerName: 'Rahul Mehta',
    createdAt: '2026-08-18T12:00:00Z'
  },
  {
    id: 'drive-4',
    companyId: 'comp-4',
    companyName: 'J.P. Morgan Chase & Co.',
    cycle: 'Final Placement 2026',
    cycleType: 'Final',
    jobProfile: 'Associate - Corporate & Investment Banking (CIB)',
    jobDescription: 'Deal execution, syndicated finance, structured trade finance, and treasury management for Fortune 500 corporations.',
    expectedHires: 10,
    ctcLpa: 36.0,
    fixedLpa: 29.0,
    variableLpa: 5.0,
    joiningBonusLpa: 2.0,
    ppoOpportunity: false,
    minWorkExpMonths: 0,
    allowedPrograms: ['MBA-IB', 'MBA-BA'],
    allowedSpecializations: ['Finance', 'Trade & Logistics'],
    minCgpa: 6.8,
    applicationDeadline: '2026-09-15',
    shortlistDate: '2026-09-24',
    interviewDate: '2026-10-03', // Today!
    offerDate: '2026-10-04',
    status: 'In Progress',
    ownerId: 'user-3',
    ownerName: 'Rahul Mehta',
    createdAt: '2026-08-20T14:00:00Z'
  },
  {
    id: 'drive-5',
    companyId: 'comp-5',
    companyName: 'Hindustan Unilever Limited (HUL)',
    cycle: 'Summer Placement 2027',
    cycleType: 'Summer',
    jobProfile: 'UFLP Summer Intern - Brand & Customer Development',
    jobDescription: 'Brand building, customer marketing, channel strategy, and consumer insights across marquee brands.',
    expectedHires: 10,
    stipendPerMonth: 220000,
    ppoOpportunity: true,
    minWorkExpMonths: 0,
    allowedPrograms: ['MBA-IB'],
    allowedSpecializations: ['Marketing', 'Operations & Supply Chain', 'Strategy & Consulting'],
    minCgpa: 6.5,
    applicationDeadline: '2026-09-28',
    shortlistDate: '2026-10-05',
    interviewDate: '2026-10-22',
    offerDate: '2026-10-22',
    status: 'Applications Open',
    ownerId: 'user-2',
    ownerName: 'Tanya Verma',
    createdAt: '2026-08-25T15:00:00Z'
  },
  {
    id: 'drive-6',
    companyId: 'comp-6',
    companyName: 'Maersk Line',
    cycle: 'Final Placement 2026',
    cycleType: 'Final',
    jobProfile: 'Manager - Global Trade Corridors & Supply Chain Strategy',
    jobDescription: 'Leading container fleet optimization, customs & tariff optimization, and ocean trade lanes management.',
    expectedHires: 12,
    ctcLpa: 29.5,
    fixedLpa: 24.5,
    variableLpa: 3.5,
    joiningBonusLpa: 1.5,
    ppoOpportunity: false,
    minWorkExpMonths: 12,
    allowedPrograms: ['MBA-IB'],
    allowedSpecializations: ['Trade & Logistics', 'Operations & Supply Chain', 'Finance'],
    minCgpa: 6.5,
    applicationDeadline: '2026-09-22',
    shortlistDate: '2026-09-29',
    interviewDate: '2026-10-12',
    offerDate: '2026-10-12',
    status: 'In Progress',
    ownerId: 'user-2',
    ownerName: 'Tanya Verma',
    createdAt: '2026-08-28T09:00:00Z'
  },
  {
    id: 'drive-7',
    companyId: 'comp-8',
    companyName: 'Microsoft',
    cycle: 'Final Placement 2026',
    cycleType: 'Final',
    jobProfile: 'Product Marketing Manager - Azure & AI Solutions',
    jobDescription: 'Go-to-market strategy, cloud ecosystem partnerships, customer storytelling for enterprise AI portfolio.',
    expectedHires: 6,
    ctcLpa: 36.5,
    fixedLpa: 28.5,
    variableLpa: 5.0,
    joiningBonusLpa: 3.0,
    ppoOpportunity: false,
    minWorkExpMonths: 12,
    allowedPrograms: ['MBA-IB', 'MBA-BA'],
    allowedSpecializations: ['IT & Analytics', 'Marketing', 'Strategy & Consulting'],
    minCgpa: 7.0,
    applicationDeadline: '2026-09-10',
    shortlistDate: '2026-09-18',
    interviewDate: '2026-10-02',
    offerDate: '2026-10-03',
    status: 'Completed',
    ownerId: 'user-1',
    ownerName: 'Aditya Sheetal',
    createdAt: '2026-08-22T10:30:00Z'
  },
  {
    id: 'drive-8',
    companyId: 'comp-11',
    companyName: 'Deloitte USI',
    cycle: 'Final Placement 2026',
    cycleType: 'Final',
    jobProfile: 'Consultant - Strategy & Business Design',
    jobDescription: 'Supply chain network redesign, M&A operations integration, and corporate strategy advisory.',
    expectedHires: 15,
    ctcLpa: 26.0,
    fixedLpa: 22.0,
    variableLpa: 3.0,
    joiningBonusLpa: 1.0,
    ppoOpportunity: false,
    minWorkExpMonths: 0,
    allowedPrograms: ['MBA-IB', 'MBA-BA'],
    allowedSpecializations: ['Strategy & Consulting', 'Operations & Supply Chain', 'Finance', 'IT & Analytics'],
    minCgpa: 6.5,
    applicationDeadline: '2026-09-16',
    shortlistDate: '2026-09-24',
    interviewDate: '2026-10-03', // Today!
    offerDate: '2026-10-04',
    status: 'In Progress',
    ownerId: 'user-1',
    ownerName: 'Aditya Sheetal',
    createdAt: '2026-08-30T11:00:00Z'
  }
];

// Helper to generate 105 realistic IIFT Delhi students
export function generateStudents(): Student[] {
  const firstNames = [
    'Aarav', 'Aditi', 'Akash', 'Ananya', 'Aryan', 'Ayush', 'Bhavya', 'Chetan', 'Devansh', 'Disha',
    'Divya', 'Gaurav', 'Harsh', 'Isha', 'Ishaan', 'Jatin', 'Kavya', 'Kunal', 'Manish', 'Megha',
    'Mohit', 'Naveen', 'Neha', 'Nikhil', 'Pooja', 'Pranav', 'Prerna', 'Rahul', 'Rhea', 'Rishabh',
    'Ritika', 'Rohan', 'Sakshi', 'Sameer', 'Sanaya', 'Sarthak', 'Shivam', 'Shreya', 'Siddharth', 'Simran',
    'Sneha', 'Sourav', 'Sparsh', 'Tanvi', 'Tarun', 'Urvashi', 'Utkarsh', 'Vaibhav', 'Varun', 'Vidhi',
    'Vikas', 'Yash', 'Zoya', 'Abhishek', 'Alok', 'Ankit', 'Archit', 'Avinash', 'Deepak', 'Girish'
  ];
  
  const lastNames = [
    'Sharma', 'Verma', 'Gupta', 'Malhotra', 'Mehta', 'Iyer', 'Patel', 'Kapoor', 'Singh', 'Chopra',
    'Jain', 'Bansal', 'Saxena', 'Bhatt', 'Nair', 'Reddy', 'Chauhan', 'Mishra', 'Agarwal', 'Chatterjee',
    'Sen', 'Ghosh', 'Rao', 'Deshmukh', 'Kulkarni', 'Joshi', 'Trivedi', 'Pandey', 'Shukla', 'Yadav'
  ];

  const colleges = [
    'IIT Delhi', 'IIT Bombay', 'IIT Kharagpur', 'IIT Roorkee', 'BITS Pilani',
    'SRCC Delhi', 'St. Stephen\'s College', 'LSR College', 'Hindu College',
    'DTU Delhi', 'NSUT Delhi', 'NIT Trichy', 'NIT Surathkal', 'Jadavpur University',
    'St. Xavier\'s Mumbai', 'Christ University', 'Symbiosis Pune', 'Presidency College'
  ];

  const specializations: Student['specialization'][] = [
    'Strategy & Consulting',
    'Finance',
    'Trade & Logistics',
    'Marketing',
    'IT & Analytics',
    'Operations & Supply Chain'
  ];

  const students: Student[] = [];

  for (let i = 1; i <= 105; i++) {
    const fName = firstNames[(i * 3 + 7) % firstNames.length];
    const lName = lastNames[(i * 5 + 11) % lastNames.length];
    const rollSuffix = String(i).padStart(3, '0');
    
    // Batch distribution: 65 in 2024-26 (Final), 40 in 2025-27 (Summer)
    const isFinalBatch = i <= 65;
    const batch = isFinalBatch ? '2024-26' : '2025-27';
    const program: Student['program'] = i % 3 === 0 ? 'MBA-BA' : 'MBA-IB';
    const campus: Student['campus'] = 'Delhi';
    const rollNumber = `${program === 'MBA-IB' ? 'IB' : 'BA'}-${batch.slice(0, 4)}-${rollSuffix}`;
    const specialization = specializations[i % specializations.length];
    const workExpMonths = (i % 6 === 0) ? 0 : (i % 6) * 8 + (i % 5);
    const cgpa = Number((7.0 + (i % 30) * 0.09).toFixed(2));
    const tenthPercent = Number((86.0 + (i % 14) * 0.9).toFixed(1));
    const twelfthPercent = Number((84.0 + (i % 15) * 1.0).toFixed(1));
    const college = colleges[i % colleges.length];
    const ugDegree = (i % 3 === 0) ? 'B.Com (Hons)' : (i % 4 === 0) ? 'B.A. (Hons) Economics' : 'B.Tech / B.E.';
    const gender: Student['gender'] = (i % 3 === 0) ? 'Female' : 'Male';

    // Status logic
    let finalStatus: Student['finalStatus'] = 'Unplaced';
    let summerStatus: Student['summerStatus'] = 'Unplaced';
    let finalCompanyName: string | undefined;
    let finalCTC: number | undefined;
    let finalFixed: number | undefined;
    let finalVariable: number | undefined;
    let summerCompanyName: string | undefined;
    let summerStipend: number | undefined;
    let summerPPO = false;

    // Placements logic
    if (isFinalBatch) {
      if (i <= 28) {
        finalStatus = 'Placed';
        if (i % 4 === 0) {
          finalCompanyName = 'Microsoft';
          finalCTC = 36.5;
          finalFixed = 28.5;
          finalVariable = 5.0;
        } else if (i % 3 === 0) {
          finalCompanyName = 'Goldman Sachs';
          finalCTC = 38.0;
          finalFixed = 30.0;
          finalVariable = 6.0;
        } else if (i % 2 === 0) {
          finalCompanyName = 'Maersk Line';
          finalCTC = 29.5;
          finalFixed = 24.5;
          finalVariable = 3.5;
        } else {
          finalCompanyName = 'Deloitte USI';
          finalCTC = 26.0;
          finalFixed = 22.0;
          finalVariable = 3.0;
        }
      } else if (i <= 45) {
        finalStatus = 'Interviewing';
      } else if (i <= 55) {
        finalStatus = 'Shortlisted';
      } else {
        finalStatus = 'Unplaced';
      }

      // Final batch already completed summer
      summerStatus = 'Placed';
      summerCompanyName = (i % 2 === 0) ? 'McKinsey & Company' : 'HUL';
      summerStipend = (i % 2 === 0) ? 250000 : 220000;
      summerPPO = i <= 20;
    } else {
      // Junior summer batch
      if (i <= 80) {
        summerStatus = 'Interviewing';
      } else if (i <= 95) {
        summerStatus = 'Shortlisted';
      } else {
        summerStatus = 'Unplaced';
      }
      finalStatus = 'Unplaced';
    }

    const shortlistsCount = isFinalBatch 
      ? (finalStatus === 'Placed' ? (3 + (i % 5)) : (1 + (i % 4))) 
      : (i % 4);
    const interviewsCount = isFinalBatch
      ? (finalStatus === 'Placed' ? (2 + (i % 3)) : (finalStatus === 'Interviewing' ? 2 : 1))
      : (summerStatus === 'Interviewing' ? 1 : 0);
    const offersCount = finalStatus === 'Placed' ? 1 + (i % 2) : 0;

    students.push({
      id: `student-${i}`,
      rollNumber,
      name: `${fName} ${lName}`,
      email: `${fName.toLowerCase()}.${lName.toLowerCase()}_${rollSuffix}@iift.edu`,
      phone: `+91 ${98100 + (i % 800)} ${String(10000 + i * 73).slice(-5)}`,
      gender,
      program,
      campus,
      batch,
      specialization,
      workExpMonths,
      ugDegree,
      ugCollege: college,
      cgpa,
      tenthPercent,
      twelfthPercent,
      isEligible: cgpa >= 6.0,
      skills: [
        'Financial Modeling',
        'International Trade Regulations',
        'Market Entry Strategy',
        'Python for Analytics',
        'Supply Chain Optimization',
        'Cross-Cultural Negotiations'
      ].slice(0, 3 + (i % 4)),
      cvUrl: `/resumes/${rollNumber}.pdf`,
      resumeSummary: `${fName} holds a ${ugDegree} from ${college} with ${workExpMonths} months experience. Focuses on ${specialization} with key strengths in trade finance, case analysis, and client presentations.`,
      summerStatus,
      summerCompanyName,
      summerStipend,
      summerPPO,
      finalStatus,
      finalCompanyName,
      finalCTC,
      finalFixed,
      finalVariable,
      shortlistsCount,
      interviewsCount,
      offersCount,
      notes: i % 10 === 0 ? 'Member of Placement Prep Cell & Consulting Club.' : undefined,
      createdAt: '2026-07-20T10:00:00Z',
      updatedAt: '2026-10-02T12:00:00Z'
    });
  }

  return students;
}

export const INITIAL_STUDENTS = generateStudents();

export const INITIAL_SHORTLISTS: ShortlistRecord[] = [
  {
    id: 'shortlist-1',
    driveId: 'drive-1',
    companyName: 'McKinsey & Company',
    cycle: 'Final Placement 2026',
    profile: 'Junior Associate - Management Consulting',
    studentId: 'student-1',
    studentRoll: INITIAL_STUDENTS[0].rollNumber,
    studentName: INITIAL_STUDENTS[0].name,
    studentSpecialization: INITIAL_STUDENTS[0].specialization,
    studentCgpa: INITIAL_STUDENTS[0].cgpa,
    shortlistedAt: '2026-09-28T14:00:00Z',
    roundName: 'Round 1 Case Interview',
    importedBy: 'Aditya Sheetal'
  },
  {
    id: 'shortlist-2',
    driveId: 'drive-1',
    companyName: 'McKinsey & Company',
    cycle: 'Final Placement 2026',
    profile: 'Junior Associate - Management Consulting',
    studentId: 'student-2',
    studentRoll: INITIAL_STUDENTS[1].rollNumber,
    studentName: INITIAL_STUDENTS[1].name,
    studentSpecialization: INITIAL_STUDENTS[1].specialization,
    studentCgpa: INITIAL_STUDENTS[1].cgpa,
    shortlistedAt: '2026-09-28T14:00:00Z',
    roundName: 'Round 1 Case Interview',
    importedBy: 'Aditya Sheetal'
  },
  {
    id: 'shortlist-3',
    driveId: 'drive-4',
    companyName: 'J.P. Morgan Chase & Co.',
    cycle: 'Final Placement 2026',
    profile: 'Associate - Corporate & Investment Banking (CIB)',
    studentId: 'student-3',
    studentRoll: INITIAL_STUDENTS[2].rollNumber,
    studentName: INITIAL_STUDENTS[2].name,
    studentSpecialization: INITIAL_STUDENTS[2].specialization,
    studentCgpa: INITIAL_STUDENTS[2].cgpa,
    shortlistedAt: '2026-09-24T10:00:00Z',
    roundName: 'Partner Round',
    importedBy: 'Rahul Mehta'
  },
  {
    id: 'shortlist-4',
    driveId: 'drive-4',
    companyName: 'J.P. Morgan Chase & Co.',
    cycle: 'Final Placement 2026',
    profile: 'Associate - Corporate & Investment Banking (CIB)',
    studentId: 'student-4',
    studentRoll: INITIAL_STUDENTS[3].rollNumber,
    studentName: INITIAL_STUDENTS[3].name,
    studentSpecialization: INITIAL_STUDENTS[3].specialization,
    studentCgpa: INITIAL_STUDENTS[3].cgpa,
    shortlistedAt: '2026-09-24T10:00:00Z',
    roundName: 'Partner Round',
    importedBy: 'Rahul Mehta'
  },
  {
    id: 'shortlist-5',
    driveId: 'drive-8',
    companyName: 'Deloitte USI',
    cycle: 'Final Placement 2026',
    profile: 'Consultant - Strategy & Business Design',
    studentId: 'student-5',
    studentRoll: INITIAL_STUDENTS[4].rollNumber,
    studentName: INITIAL_STUDENTS[4].name,
    studentSpecialization: INITIAL_STUDENTS[4].specialization,
    studentCgpa: INITIAL_STUDENTS[4].cgpa,
    shortlistedAt: '2026-09-24T11:30:00Z',
    roundName: 'Technical Round 2',
    importedBy: 'Aditya Sheetal'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    driveId: 'drive-4',
    companyName: 'J.P. Morgan Chase & Co.',
    profile: 'Associate - Corporate & Investment Banking (CIB)',
    studentId: 'student-3',
    studentRoll: INITIAL_STUDENTS[2].rollNumber,
    studentName: INITIAL_STUDENTS[2].name,
    round: 'Partner Round',
    date: '2026-10-03', // Today
    startTime: '16:30',
    endTime: '17:15',
    mode: 'Online',
    venueOrLink: 'https://jpmc.zoom.us/j/88392019482',
    interviewerName: 'Vikramaditya Roy (Executive Director)',
    status: 'In Progress',
    result: 'Pending',
    feedback: 'Strong understanding of sovereign trade credit insurance and balance sheet structuring.',
    notes: 'Placement Coordinator monitoring candidate connectivity.'
  },
  {
    id: 'int-2',
    driveId: 'drive-4',
    companyName: 'J.P. Morgan Chase & Co.',
    profile: 'Associate - Corporate & Investment Banking (CIB)',
    studentId: 'student-4',
    studentRoll: INITIAL_STUDENTS[3].rollNumber,
    studentName: INITIAL_STUDENTS[3].name,
    round: 'Partner Round',
    date: '2026-10-03', // Today
    startTime: '17:30',
    endTime: '18:15',
    mode: 'Online',
    venueOrLink: 'https://jpmc.zoom.us/j/88392019482',
    interviewerName: 'Shalini Nair (Managing Director)',
    status: 'Confirmed',
    result: 'Pending',
    notes: 'Candidate waiting in Zoom lobby.'
  },
  {
    id: 'int-3',
    driveId: 'drive-8',
    companyName: 'Deloitte USI',
    profile: 'Consultant - Strategy & Business Design',
    studentId: 'student-5',
    studentRoll: INITIAL_STUDENTS[4].rollNumber,
    studentName: INITIAL_STUDENTS[4].name,
    round: 'Technical 2',
    date: '2026-10-03', // Today
    startTime: '18:00',
    endTime: '18:45',
    mode: 'Offline - Campus',
    venueOrLink: 'Board Room 2, IIFT Bhawan, Qutab Institutional Area',
    interviewerName: 'Meenakshi Sundaram & Amit Tandon',
    status: 'Scheduled',
    result: 'Pending',
    notes: 'In-person panel interview on campus.'
  },
  {
    id: 'int-4',
    driveId: 'drive-1',
    companyName: 'McKinsey & Company',
    profile: 'Junior Associate - Management Consulting',
    studentId: 'student-1',
    studentRoll: INITIAL_STUDENTS[0].rollNumber,
    studentName: INITIAL_STUDENTS[0].name,
    round: 'Case Interview',
    date: '2026-10-15',
    startTime: '09:00',
    endTime: '10:00',
    mode: 'Online',
    venueOrLink: 'https://mckinsey.webex.com/meet/india.mba',
    interviewerName: 'Abhishek Singhania (Partner)',
    status: 'Scheduled',
    result: 'Pending'
  },
  {
    id: 'int-5',
    driveId: 'drive-6',
    companyName: 'Maersk Line',
    profile: 'Manager - Global Trade Corridors & Supply Chain Strategy',
    studentId: 'student-12',
    studentRoll: INITIAL_STUDENTS[11].rollNumber,
    studentName: INITIAL_STUDENTS[11].name,
    round: 'Final',
    date: '2026-10-12',
    startTime: '11:00',
    endTime: '12:00',
    mode: 'Offline - Campus',
    venueOrLink: 'Conference Hall A, IIFT Delhi',
    interviewerName: 'Henrik Vestergaard',
    status: 'Scheduled',
    result: 'Pending'
  }
];

export const INITIAL_OFFERS: Offer[] = [
  {
    id: 'offer-1',
    driveId: 'drive-7',
    companyId: 'comp-8',
    companyName: 'Microsoft',
    studentId: 'student-4',
    studentRoll: INITIAL_STUDENTS[3].rollNumber,
    studentName: INITIAL_STUDENTS[3].name,
    profile: 'Product Marketing Manager - Azure & AI Solutions',
    offerType: 'Final Placement',
    offerDate: '2026-10-02',
    ctcLpa: 36.5,
    fixedLpa: 28.5,
    variableLpa: 5.0,
    joiningBonusLpa: 3.0,
    status: 'Accepted',
    acceptedAt: '2026-10-02T18:00:00Z'
  },
  {
    id: 'offer-2',
    driveId: 'drive-7',
    companyId: 'comp-8',
    companyName: 'Microsoft',
    studentId: 'student-8',
    studentRoll: INITIAL_STUDENTS[7].rollNumber,
    studentName: INITIAL_STUDENTS[7].name,
    profile: 'Product Marketing Manager - Azure & AI Solutions',
    offerType: 'Final Placement',
    offerDate: '2026-10-02',
    ctcLpa: 36.5,
    fixedLpa: 28.5,
    variableLpa: 5.0,
    joiningBonusLpa: 3.0,
    status: 'Accepted',
    acceptedAt: '2026-10-03T09:30:00Z'
  },
  {
    id: 'offer-3',
    driveId: 'drive-7',
    companyId: 'comp-8',
    companyName: 'Microsoft',
    studentId: 'student-12',
    studentRoll: INITIAL_STUDENTS[11].rollNumber,
    studentName: INITIAL_STUDENTS[11].name,
    profile: 'Product Marketing Manager - Azure & AI Solutions',
    offerType: 'Final Placement',
    offerDate: '2026-10-02',
    ctcLpa: 36.5,
    fixedLpa: 28.5,
    variableLpa: 5.0,
    joiningBonusLpa: 3.0,
    status: 'Released',
    validTill: '2026-10-06'
  },
  {
    id: 'offer-4',
    driveId: 'drive-3',
    companyId: 'comp-3',
    companyName: 'Goldman Sachs',
    studentId: 'student-6',
    studentRoll: INITIAL_STUDENTS[5].rollNumber,
    studentName: INITIAL_STUDENTS[5].name,
    profile: 'Investment Banking & Research Analyst',
    offerType: 'PPO',
    offerDate: '2026-08-30',
    ctcLpa: 38.0,
    fixedLpa: 30.0,
    variableLpa: 6.0,
    joiningBonusLpa: 2.0,
    ppoOpportunity: true,
    status: 'Accepted',
    acceptedAt: '2026-09-02T11:00:00Z'
  }
];

export const INITIAL_FOLLOW_UPS: FollowUp[] = [
  {
    id: 'fup-1',
    companyId: 'comp-5',
    companyName: 'Hindustan Unilever Limited (HUL)',
    hrContactId: 'hr-5',
    hrName: 'Shruti Bhattacharya',
    hrPhone: '+91 97110 55443',
    hrEmail: 'shruti.bhattacharya@unilever.com',
    pcOwnerId: 'user-2',
    pcOwnerName: 'Tanya Verma',
    priority: 'HIGH',
    dueDate: '2026-10-02', // Overdue!
    status: 'PENDING',
    actionType: 'Call',
    notes: 'Follow-up regarding UFLP Day 1 slot confirmation and JD release for Marketing interns.',
    lastContactDate: '2026-09-25'
  },
  {
    id: 'fup-2',
    companyId: 'comp-12',
    companyName: 'Citibank N.A.',
    hrContactId: 'hr-9',
    hrName: 'Gaurav Singhal',
    hrPhone: '+91 98212 33441',
    hrEmail: 'gaurav.singhal@citi.com',
    pcOwnerId: 'user-3',
    pcOwnerName: 'Rahul Mehta',
    priority: 'HIGH',
    dueDate: '2026-10-01', // Overdue!
    status: 'PENDING',
    actionType: 'Call',
    notes: 'Negotiate Day 2 vs Day 1 slots. Confirm if Treasury & Trade Solutions can visit on 2nd Nov.',
    lastContactDate: '2026-09-24'
  },
  {
    id: 'fup-3',
    companyId: 'comp-2',
    companyName: 'Boston Consulting Group (BCG)',
    hrContactId: 'hr-2',
    hrName: 'Karan Malhotra',
    hrPhone: '+91 99200 44556',
    hrEmail: 'malhotra.karan@bcg.com',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    priority: 'HIGH',
    dueDate: '2026-10-03', // Due Today!
    status: 'PENDING',
    actionType: 'Confirm Dates',
    notes: 'Confirm final interviewer room count and whether dinner reception is planned for campus team.',
    lastContactDate: '2026-09-28'
  },
  {
    id: 'fup-4',
    companyId: 'comp-7',
    companyName: 'Amazon India',
    hrContactId: 'hr-7',
    hrName: 'Nikhil Kashyap',
    hrPhone: '+91 98450 12399',
    hrEmail: 'kashyapn@amazon.com',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    priority: 'MEDIUM',
    dueDate: '2026-10-04', // Tomorrow
    status: 'PENDING',
    actionType: 'Share Shortlist',
    notes: 'Share consolidated batch list with Work Experience & Operations specialization tags.',
    lastContactDate: '2026-10-02'
  },
  {
    id: 'fup-5',
    companyId: 'comp-14',
    companyName: 'Bain & Company',
    hrName: 'Campus Lead',
    pcOwnerId: 'user-1',
    pcOwnerName: 'Aditya Sheetal',
    priority: 'MEDIUM',
    dueDate: '2026-10-06',
    status: 'PENDING',
    actionType: 'Email',
    notes: 'Send follow-up on Bain Capability Network JD and campus PPT dates.',
    lastContactDate: '2026-10-01'
  }
];

export const INITIAL_ACTIVITIES: CompanyActivity[] = [
  {
    id: 'act-1',
    companyId: 'comp-1',
    companyName: 'McKinsey & Company',
    actorId: 'user-1',
    actorName: 'Aditya Sheetal',
    type: 'Status Change',
    title: 'Company confirmed visit dates',
    outcome: 'Confirmed',
    notes: 'Confirmed 15th October for Round 1 interviews and 16th October for Partner round.',
    timestamp: '2026-10-01T14:30:00Z'
  },
  {
    id: 'act-2',
    companyId: 'comp-4',
    companyName: 'J.P. Morgan Chase & Co.',
    actorId: 'user-3',
    actorName: 'Rahul Mehta',
    type: 'Interview Scheduled',
    title: 'Partner round scheduled for 16 shortlisted candidates',
    outcome: 'Scheduled',
    notes: 'Zoom rooms configured and candidate timings dispatched via PlaceComm WhatsApp broadcast.',
    timestamp: '2026-10-03T11:00:00Z'
  },
  {
    id: 'act-3',
    companyId: 'comp-8',
    companyName: 'Microsoft',
    actorId: 'user-1',
    actorName: 'Aditya Sheetal',
    type: 'Offer Released',
    title: '6 Offers officially rolled out with 36.5 LPA CTC',
    outcome: 'Offers Extended',
    notes: 'Letters verified and sent to student portals. 4 accepted immediately.',
    timestamp: '2026-10-02T17:45:00Z'
  },
  {
    id: 'act-4',
    companyId: 'comp-5',
    companyName: 'HUL',
    actorId: 'user-2',
    actorName: 'Tanya Verma',
    type: 'Call',
    title: 'Call with Shruti Bhattacharya regarding Summer UFLP',
    outcome: 'Call Back Later',
    notes: 'HR was traveling. Asked to ping back on Monday with verified student batch count.',
    timestamp: '2026-09-25T16:15:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    userId: 'user-1',
    userName: 'Aditya Sheetal',
    action: 'STATUS_CHANGE',
    entity: 'Company',
    entityId: 'comp-1',
    details: 'Updated McKinsey & Company status from "Interested" to "Confirmed"',
    timestamp: '2026-10-01T14:30:00Z'
  },
  {
    id: 'audit-2',
    userId: 'user-1',
    userName: 'Aditya Sheetal',
    action: 'OFFER_ACCEPTED',
    entity: 'Offer',
    entityId: 'offer-1',
    details: 'Student Priya Iyer (IB-2024-004) accepted Microsoft offer (CTC 36.5 LPA). Student marked as Placed.',
    timestamp: '2026-10-02T18:00:00Z'
  },
  {
    id: 'audit-3',
    userId: 'user-3',
    userName: 'Rahul Mehta',
    action: 'SHORTLIST_IMPORTED',
    entity: 'Shortlist',
    entityId: 'drive-4',
    details: 'Imported 16 candidates for J.P. Morgan Chase Partner Round from verified Excel sheet.',
    timestamp: '2026-10-03T10:45:00Z'
  },
  {
    id: 'audit-4',
    userId: 'user-2',
    userName: 'Tanya Verma',
    action: 'CALL_LOGGED',
    entity: 'HRContact',
    entityId: 'hr-6',
    details: 'Logged phone call with Henrik Vestergaard (Maersk Line). Agreed on 12th Oct offline campus visit.',
    timestamp: '2026-10-02T13:45:00Z'
  }
];
