import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Student,
  Company,
  HRContact,
  RecruitmentDrive,
  ShortlistRecord,
  Interview,
  Offer,
  FollowUp,
  CompanyActivity,
  AuditLog,
  NotificationItem,
  User,
  UserRole,
  CompanyStatus,
  InterviewStatus,
  InterviewResult,
  CoordinatorUser,
  PCRole,
  CoordinatorPermissions
} from '../types';
import {
  CURRENT_USERS,
  INITIAL_COMPANIES,
  INITIAL_HR_CONTACTS,
  INITIAL_DRIVES,
  INITIAL_STUDENTS,
  INITIAL_SHORTLISTS,
  INITIAL_INTERVIEWS,
  INITIAL_OFFERS,
  INITIAL_FOLLOW_UPS,
  INITIAL_ACTIVITIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_COORDINATORS
} from '../data/mockData';
import { googleSignIn, googleSignUp, signOutUser } from '../lib/firebaseAuth';

export const ROLE_PERMISSIONS_MAP: Record<PCRole, CoordinatorPermissions> = {
  'Super Admin': {
    canManageUsers: true,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: true,
    canAccessAuditLogs: true
  },
  'Placement Secretary': {
    canManageUsers: true,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: true,
    canAccessAuditLogs: true
  },
  'Lead Coordinator': {
    canManageUsers: false,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: true,
    canAccessAuditLogs: true
  },
  'Sector Lead - Consulting': {
    canManageUsers: false,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: false,
    canAccessAuditLogs: true
  },
  'Sector Lead - BFSI': {
    canManageUsers: false,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: false,
    canAccessAuditLogs: true
  },
  'Sector Lead - Tech & Product': {
    canManageUsers: false,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: false,
    canAccessAuditLogs: true
  },
  'Sector Lead - FMCG & Trade': {
    canManageUsers: false,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: true,
    canReleaseOffers: false,
    canAccessAuditLogs: true
  },
  'Senior Coordinator': {
    canManageUsers: false,
    canExportData: true,
    canManageCompanies: true,
    canModifyStudents: false,
    canReleaseOffers: false,
    canAccessAuditLogs: false
  },
  'Junior Coordinator': {
    canManageUsers: false,
    canExportData: false,
    canManageCompanies: true,
    canModifyStudents: false,
    canReleaseOffers: false,
    canAccessAuditLogs: false
  }
};

interface PlaceCommContextType {
  // Current user & authentication
  currentUser: User;
  setCurrentUser: (user: User) => void;
  canEdit: boolean;
  canAdmin: boolean;
  isSuperAdmin: boolean;
  isViewer: boolean;

  // Placement Coordinator Management & RBAC
  coordinators: CoordinatorUser[];
  updateCoordinatorRole: (coordinatorId: string, role: PCRole) => void;
  addCoordinator: (coordinator: Omit<CoordinatorUser, 'id' | 'createdAt' | 'assignedCompaniesCount'>) => CoordinatorUser;
  updateCoordinator: (id: string, updates: Partial<CoordinatorUser>) => void;
  deleteCoordinator: (id: string) => void;
  toggleCoordinatorStatus: (id: string, status: 'Active' | 'Suspended') => void;

  // Google OAuth & Auth Modals
  loginWithGoogle: () => Promise<void>;
  signUpWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
  loginWithPersona: (user: User) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  authError: string | null;

  // Master entities
  students: Student[];
  companies: Company[];
  hrContacts: HRContact[];
  drives: RecruitmentDrive[];
  shortlists: ShortlistRecord[];
  interviews: Interview[];
  offers: Offer[];
  followUps: FollowUp[];
  activities: CompanyActivity[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];

  // Entity operations
  addStudent: (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'shortlistsCount' | 'interviewsCount' | 'offersCount'>) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;

  addCompany: (company: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => Company;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  updateCompanyStatus: (id: string, newStatus: CompanyStatus, notes?: string) => void;

  addHRContact: (contact: Omit<HRContact, 'id'>) => HRContact;
  updateHRContact: (id: string, updates: Partial<HRContact>) => void;
  deleteHRContact: (id: string) => void;

  addDrive: (drive: Omit<RecruitmentDrive, 'id' | 'createdAt'>) => RecruitmentDrive;
  updateDrive: (id: string, updates: Partial<RecruitmentDrive>) => void;
  deleteDrive: (id: string) => void;

  addShortlist: (shortlist: Omit<ShortlistRecord, 'id' | 'shortlistedAt'>) => void;
  bulkAddShortlists: (records: Omit<ShortlistRecord, 'id' | 'shortlistedAt'>[]) => number;
  removeShortlist: (id: string) => void;

  addInterview: (interview: Omit<Interview, 'id'>) => Interview;
  updateInterview: (id: string, updates: Partial<Interview>) => void;
  updateInterviewStatus: (id: string, status: InterviewStatus, result?: InterviewResult, feedback?: string) => void;
  deleteInterview: (id: string) => void;

  addOffer: (offer: Omit<Offer, 'id' | 'offerDate'>) => Offer;
  acceptOffer: (offerId: string) => void;
  declineOffer: (offerId: string) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;

  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => FollowUp;
  completeFollowUp: (id: string, nextFollowUpDate?: string, notes?: string) => void;
  updateFollowUp: (id: string, updates: Partial<FollowUp>) => void;
  deleteFollowUp: (id: string) => void;

  logQuickCall: (params: {
    companyId: string;
    hrContactId?: string;
    outcome: string;
    notes: string;
    nextFollowUpDate?: string;
    newCompanyStatus?: CompanyStatus;
  }) => void;

  upsertStudents: (incomingStudents: Partial<Student>[]) => { updated: number; created: number };
  upsertCompaniesWithHR: (incomingData: {
    company: Partial<Company>;
    hr?: Partial<HRContact>;
  }[]) => { updatedCompanies: number; createdCompanies: number; updatedHRs: number; createdHRs: number };

  addActivity: (activity: Omit<CompanyActivity, 'id' | 'timestamp'>) => void;
  addAuditLog: (action: string, entity: string, entityId: string, details: string) => void;

  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Global Quick Action Modal state
  quickActionType: string | null;
  openQuickAction: (type: string) => void;
  closeQuickAction: () => void;

  // Global search query
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Reset to original demo data
  resetToDemoData: () => void;
}

const PlaceCommContext = createContext<PlaceCommContextType | undefined>(undefined);

const STORAGE_KEY = 'iift_placecomm_delhi_v2';

export const PlaceCommProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or localStorage
  const [currentUser, setCurrentUser] = useState<User>(() => {
    return CURRENT_USERS[0]; // Default: Aditya Sheetal (SUPER_ADMIN)
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_students`);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_companies`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [hrContacts, setHRContacts] = useState<HRContact[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hr`);
    return saved ? JSON.parse(saved) : INITIAL_HR_CONTACTS;
  });

  const [drives, setDrives] = useState<RecruitmentDrive[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_drives`);
    return saved ? JSON.parse(saved) : INITIAL_DRIVES;
  });

  const [shortlists, setShortlists] = useState<ShortlistRecord[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_shortlists`);
    return saved ? JSON.parse(saved) : INITIAL_SHORTLISTS;
  });

  const [interviews, setInterviews] = useState<Interview[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_interviews`);
    return saved ? JSON.parse(saved) : INITIAL_INTERVIEWS;
  });

  const [offers, setOffers] = useState<Offer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_offers`);
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [followUps, setFollowUps] = useState<FollowUp[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_followups`);
    return saved ? JSON.parse(saved) : INITIAL_FOLLOW_UPS;
  });

  const [activities, setActivities] = useState<CompanyActivity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_audit`);
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Partner Interviews Today',
      message: 'J.P. Morgan Chase & Co. Partner Round interviews running for 16 shortlisted candidates.',
      type: 'URGENT',
      link: '/interviews',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif-2',
      title: 'HR Follow-up Overdue',
      message: 'HUL & Citibank HR follow-ups require immediate coordinator attention.',
      type: 'WARNING',
      link: '/followups',
      read: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'notif-3',
      title: 'New Offer Rolled Out',
      message: 'Microsoft rolled out 6 final placement offers at 36.5 LPA CTC.',
      type: 'SUCCESS',
      link: '/offers',
      read: true,
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ]);

  const [quickActionType, setQuickActionType] = useState<string | null>(null);
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Persist state to localStorage on changes
  const [coordinators, setCoordinators] = useState<CoordinatorUser[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_coordinators`);
    return saved ? JSON.parse(saved) : INITIAL_COORDINATORS;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_students`, JSON.stringify(students));
      localStorage.setItem(`${STORAGE_KEY}_companies`, JSON.stringify(companies));
      localStorage.setItem(`${STORAGE_KEY}_hr`, JSON.stringify(hrContacts));
      localStorage.setItem(`${STORAGE_KEY}_drives`, JSON.stringify(drives));
      localStorage.setItem(`${STORAGE_KEY}_shortlists`, JSON.stringify(shortlists));
      localStorage.setItem(`${STORAGE_KEY}_interviews`, JSON.stringify(interviews));
      localStorage.setItem(`${STORAGE_KEY}_offers`, JSON.stringify(offers));
      localStorage.setItem(`${STORAGE_KEY}_followups`, JSON.stringify(followUps));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_audit`, JSON.stringify(auditLogs));
      localStorage.setItem(`${STORAGE_KEY}_coordinators`, JSON.stringify(coordinators));
    } catch {
      // ignore storage quota issues
    }
  }, [students, companies, hrContacts, drives, shortlists, interviews, offers, followUps, activities, auditLogs, coordinators]);

  // Permissions helpers
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN' || currentUser.pcRole === 'Super Admin';
  const canAdmin = isSuperAdmin || currentUser.role === 'ADMIN' || currentUser.pcRole === 'Placement Secretary';
  const canEdit = currentUser.role !== 'VIEWER';
  const isViewer = currentUser.role === 'VIEWER';

  // Placement Coordinator Account Management
  const updateCoordinatorRole = (coordinatorId: string, role: PCRole) => {
    const permissions = ROLE_PERMISSIONS_MAP[role];
    let newSystemRole: UserRole = 'PLACEMENT_COORDINATOR';
    if (role === 'Super Admin') newSystemRole = 'SUPER_ADMIN';
    else if (role === 'Placement Secretary') newSystemRole = 'ADMIN';

    setCoordinators(prev => prev.map(c => {
      if (c.id === coordinatorId) {
        return {
          ...c,
          role,
          systemRole: newSystemRole,
          permissions
        };
      }
      return c;
    }));

    if (currentUser.id === coordinatorId) {
      setCurrentUser(prev => ({
        ...prev,
        role: newSystemRole,
        pcRole: role,
        title: role,
        permissions
      }));
    }

    addAuditLog(
      'UPDATE_COORDINATOR_ROLE',
      'Coordinator',
      coordinatorId,
      `Assigned role '${role}' to placement coordinator ID ${coordinatorId}`
    );
  };

  const addCoordinator = (data: Omit<CoordinatorUser, 'id' | 'createdAt' | 'assignedCompaniesCount'>): CoordinatorUser => {
    const id = `user-${Date.now()}`;
    const newCoord: CoordinatorUser = {
      ...data,
      id,
      assignedCompaniesCount: 0,
      createdAt: new Date().toISOString(),
      permissions: data.permissions || ROLE_PERMISSIONS_MAP[data.role]
    };
    setCoordinators(prev => [newCoord, ...prev]);
    addAuditLog('CREATE_COORDINATOR', 'Coordinator', id, `Created coordinator account for ${newCoord.name} (${newCoord.email}) with role ${newCoord.role}`);
    return newCoord;
  };

  const updateCoordinator = (id: string, updates: Partial<CoordinatorUser>) => {
    setCoordinators(prev => prev.map(c => {
      if (c.id === id) {
        const updated = { ...c, ...updates };
        if (updates.role && !updates.permissions) {
          updated.permissions = ROLE_PERMISSIONS_MAP[updates.role];
        }
        return updated;
      }
      return c;
    }));
    addAuditLog('UPDATE_COORDINATOR', 'Coordinator', id, `Updated coordinator details for ID ${id}`);
  };

  const deleteCoordinator = (id: string) => {
    setCoordinators(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE_COORDINATOR', 'Coordinator', id, `Removed coordinator account ID ${id}`);
  };

  const toggleCoordinatorStatus = (id: string, status: 'Active' | 'Suspended') => {
    updateCoordinator(id, { status });
    addAuditLog('STATUS_CHANGE_COORDINATOR', 'Coordinator', id, `Changed coordinator account status to ${status}`);
  };

  // Google OAuth Methods
  const loginWithGoogle = async () => {
    try {
      setAuthError(null);
      const res = await googleSignIn();
      const existing = coordinators.find(c => c.email.toLowerCase() === res.email.toLowerCase());
      
      let coordUser: CoordinatorUser;
      if (existing) {
        coordUser = {
          ...existing,
          googleUid: res.uid,
          isGoogleLinked: true,
          avatar: res.photoURL || existing.avatar,
          lastLogin: new Date().toISOString()
        };
        updateCoordinator(existing.id, coordUser);
      } else {
        coordUser = {
          id: `user-${Date.now()}`,
          name: res.displayName,
          email: res.email,
          phone: '+91 98000 00000',
          role: 'Junior Coordinator',
          systemRole: 'PLACEMENT_COORDINATOR',
          program: 'MBA-IB',
          batch: '2025-27',
          sector: 'General Outreach',
          assignedCompaniesCount: 0,
          status: 'Active',
          avatar: res.photoURL,
          googleUid: res.uid,
          isGoogleLinked: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          permissions: ROLE_PERMISSIONS_MAP['Junior Coordinator']
        };
        setCoordinators(prev => [coordUser, ...prev]);
      }

      setCurrentUser({
        id: coordUser.id,
        name: coordUser.name,
        email: coordUser.email,
        role: coordUser.systemRole,
        pcRole: coordUser.role,
        avatar: coordUser.avatar,
        phone: coordUser.phone,
        title: coordUser.role,
        googleUid: res.uid,
        isGoogleLinked: true,
        permissions: coordUser.permissions
      });

      addAuditLog('GOOGLE_OAUTH_LOGIN', 'User', coordUser.id, `Coordinator ${coordUser.name} (${coordUser.email}) authenticated via Google OAuth`);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Google Auth error:', err);
      setAuthError(err.message || 'Google Sign-in failed. Please try again.');
      throw err;
    }
  };

  const signUpWithGoogle = async () => {
    return loginWithGoogle();
  };

  const logoutUser = async () => {
    try {
      await signOutUser();
    } catch (e) {
      console.warn('Sign out warning:', e);
    }
    setCurrentUser(CURRENT_USERS[0]);
    addAuditLog('USER_LOGOUT', 'User', currentUser.id, `Coordinator signed out`);
  };

  const loginWithPersona = (user: User) => {
    setCurrentUser(user);
    addAuditLog('SWITCH_PERSONA', 'User', user.id, `Switched persona to ${user.name}`);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthError(null);
  };

  const addAuditLog = (action: string, entity: string, entityId: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Student CRUD
  const addStudent = (studentData: Omit<Student, 'id' | 'createdAt' | 'updatedAt' | 'shortlistsCount' | 'interviewsCount' | 'offersCount'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `student-${Date.now()}`,
      shortlistsCount: 0,
      interviewsCount: 0,
      offersCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setStudents(prev => [newStudent, ...prev]);
    addAuditLog('CREATE', 'Student', newStudent.id, `Created student ${newStudent.name} (${newStudent.rollNumber})`);
    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, ...updates, updatedAt: new Date().toISOString() };
      }
      return s;
    }));
    addAuditLog('UPDATE', 'Student', id, `Updated student details`);
  };

  const deleteStudent = (id: string) => {
    const student = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    addAuditLog('DELETE', 'Student', id, `Deleted student ${student?.name || id}`);
  };

  // Company CRUD
  const addCompany = (companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newCompany: Company = {
      ...companyData,
      id: `comp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setCompanies(prev => [newCompany, ...prev]);
    addAuditLog('CREATE', 'Company', newCompany.id, `Added company ${newCompany.name}`);
    return newCompany;
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, ...updates, updatedAt: new Date().toISOString() };
      }
      return c;
    }));
    addAuditLog('UPDATE', 'Company', id, `Updated company profile`);
  };

  const deleteCompany = (id: string) => {
    const company = companies.find(c => c.id === id);
    setCompanies(prev => prev.filter(c => c.id !== id));
    addAuditLog('DELETE', 'Company', id, `Deleted company ${company?.name || id}`);
  };

  const updateCompanyStatus = (id: string, newStatus: CompanyStatus, notes?: string) => {
    const company = companies.find(c => c.id === id);
    if (!company) return;
    const oldStatus = company.status;
    updateCompany(id, { status: newStatus });
    
    // Add activity
    addActivity({
      companyId: id,
      companyName: company.name,
      actorId: currentUser.id,
      actorName: currentUser.name,
      type: 'Status Change',
      title: `Status changed to ${newStatus}`,
      outcome: newStatus,
      notes: notes || `Changed status from ${oldStatus} to ${newStatus}`
    });

    addAuditLog('STATUS_CHANGE', 'Company', id, `Changed ${company.name} status from ${oldStatus} to ${newStatus}`);
  };

  // HR Contacts
  const addHRContact = (contactData: Omit<HRContact, 'id'>) => {
    const newHR: HRContact = {
      ...contactData,
      id: `hr-${Date.now()}`
    };
    setHRContacts(prev => [newHR, ...prev]);
    addAuditLog('CREATE', 'HRContact', newHR.id, `Added HR contact ${newHR.name} (${newHR.companyName})`);
    return newHR;
  };

  const updateHRContact = (id: string, updates: Partial<HRContact>) => {
    setHRContacts(prev => prev.map(hr => hr.id === id ? { ...hr, ...updates } : hr));
    addAuditLog('UPDATE', 'HRContact', id, `Updated HR contact`);
  };

  const deleteHRContact = (id: string) => {
    setHRContacts(prev => prev.filter(hr => hr.id !== id));
    addAuditLog('DELETE', 'HRContact', id, `Deleted HR contact`);
  };

  // Recruitment Drives
  const addDrive = (driveData: Omit<RecruitmentDrive, 'id' | 'createdAt'>) => {
    const newDrive: RecruitmentDrive = {
      ...driveData,
      id: `drive-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setDrives(prev => [newDrive, ...prev]);
    addAuditLog('CREATE', 'RecruitmentDrive', newDrive.id, `Created drive for ${newDrive.companyName} (${newDrive.jobProfile})`);
    return newDrive;
  };

  const updateDrive = (id: string, updates: Partial<RecruitmentDrive>) => {
    setDrives(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    addAuditLog('UPDATE', 'RecruitmentDrive', id, `Updated drive configuration`);
  };

  const deleteDrive = (id: string) => {
    setDrives(prev => prev.filter(d => d.id !== id));
    addAuditLog('DELETE', 'RecruitmentDrive', id, `Deleted recruitment drive`);
  };

  // Shortlists
  const addShortlist = (recordData: Omit<ShortlistRecord, 'id' | 'shortlistedAt'>) => {
    const newRecord: ShortlistRecord = {
      ...recordData,
      id: `shortlist-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      shortlistedAt: new Date().toISOString()
    };
    setShortlists(prev => [newRecord, ...prev]);

    // Recalculate student shortlists
    setStudents(prev => prev.map(s => {
      if (s.id === recordData.studentId) {
        return {
          ...s,
          shortlistsCount: s.shortlistsCount + 1,
          finalStatus: s.finalStatus === 'Unplaced' ? 'Shortlisted' : s.finalStatus
        };
      }
      return s;
    }));

    addAuditLog('SHORTLIST', 'ShortlistRecord', newRecord.id, `Shortlisted ${recordData.studentName} for ${recordData.companyName}`);
  };

  const bulkAddShortlists = (records: Omit<ShortlistRecord, 'id' | 'shortlistedAt'>[]) => {
    const created: ShortlistRecord[] = records.map((r, i) => ({
      ...r,
      id: `shortlist-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
      shortlistedAt: new Date().toISOString()
    }));

    setShortlists(prev => [...created, ...prev]);

    // Update counts
    const countsMap: { [studentId: string]: number } = {};
    records.forEach(r => {
      countsMap[r.studentId] = (countsMap[r.studentId] || 0) + 1;
    });

    setStudents(prev => prev.map(s => {
      const added = countsMap[s.id];
      if (added) {
        return {
          ...s,
          shortlistsCount: s.shortlistsCount + added,
          finalStatus: s.finalStatus === 'Unplaced' ? 'Shortlisted' : s.finalStatus
        };
      }
      return s;
    }));

    if (records.length > 0) {
      addAuditLog('BULK_SHORTLIST', 'ShortlistRecord', records[0].driveId, `Bulk uploaded ${records.length} shortlists for ${records[0].companyName}`);
    }

    return records.length;
  };

  const removeShortlist = (id: string) => {
    const target = shortlists.find(s => s.id === id);
    if (!target) return;
    setShortlists(prev => prev.filter(s => s.id !== id));

    setStudents(prev => prev.map(s => {
      if (s.id === target.studentId) {
        return {
          ...s,
          shortlistsCount: Math.max(0, s.shortlistsCount - 1)
        };
      }
      return s;
    }));

    addAuditLog('REMOVE_SHORTLIST', 'ShortlistRecord', id, `Removed shortlist for ${target.studentName}`);
  };

  // Interviews
  const addInterview = (interviewData: Omit<Interview, 'id'>) => {
    const newInt: Interview = {
      ...interviewData,
      id: `int-${Date.now()}`
    };
    setInterviews(prev => [newInt, ...prev]);

    // Update student interview count and status
    setStudents(prev => prev.map(s => {
      if (s.id === interviewData.studentId) {
        return {
          ...s,
          interviewsCount: s.interviewsCount + 1,
          finalStatus: s.finalStatus !== 'Placed' ? 'Interviewing' : s.finalStatus
        };
      }
      return s;
    }));

    addAuditLog('SCHEDULE_INTERVIEW', 'Interview', newInt.id, `Scheduled ${newInt.round} for ${newInt.studentName} with ${newInt.companyName}`);
    return newInt;
  };

  const updateInterview = (id: string, updates: Partial<Interview>) => {
    setInterviews(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    addAuditLog('UPDATE_INTERVIEW', 'Interview', id, `Updated interview details`);
  };

  const updateInterviewStatus = (id: string, status: InterviewStatus, result?: InterviewResult, feedback?: string) => {
    const int = interviews.find(i => i.id === id);
    if (!int) return;
    updateInterview(id, {
      status,
      result: result || int.result,
      feedback: feedback !== undefined ? feedback : int.feedback
    });
    addAuditLog('INTERVIEW_STATUS', 'Interview', id, `Marked interview for ${int.studentName} as ${status} (Result: ${result || int.result})`);
  };

  const deleteInterview = (id: string) => {
    const int = interviews.find(i => i.id === id);
    setInterviews(prev => prev.filter(i => i.id !== id));
    if (int) {
      setStudents(prev => prev.map(s => s.id === int.studentId ? { ...s, interviewsCount: Math.max(0, s.interviewsCount - 1) } : s));
    }
  };

  // Offers
  const addOffer = (offerData: Omit<Offer, 'id' | 'offerDate'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `offer-${Date.now()}`,
      offerDate: new Date().toISOString().split('T')[0]
    };
    setOffers(prev => [newOffer, ...prev]);

    setStudents(prev => prev.map(s => {
      if (s.id === offerData.studentId) {
        return {
          ...s,
          offersCount: s.offersCount + 1
        };
      }
      return s;
    }));

    addAuditLog('OFFER_RELEASED', 'Offer', newOffer.id, `Released ${newOffer.offerType} offer to ${newOffer.studentName} from ${newOffer.companyName}`);
    return newOffer;
  };

  const acceptOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;

    // Update offer
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'Accepted', acceptedAt: new Date().toISOString() } : o));

    // Update student placement status
    setStudents(prev => prev.map(s => {
      if (s.id === offer.studentId) {
        if (offer.offerType === 'Summer Internship') {
          return {
            ...s,
            summerStatus: 'Placed',
            summerCompanyId: offer.companyId,
            summerCompanyName: offer.companyName,
            summerStipend: offer.stipendPerMonth,
            summerPPO: offer.ppoOpportunity || false
          };
        } else {
          return {
            ...s,
            finalStatus: 'Placed',
            finalCompanyId: offer.companyId,
            finalCompanyName: offer.companyName,
            finalCTC: offer.ctcLpa,
            finalFixed: offer.fixedLpa,
            finalVariable: offer.variableLpa,
            finalJoiningBonus: offer.joiningBonusLpa
          };
        }
      }
      return s;
    }));

    addAuditLog('OFFER_ACCEPTED', 'Offer', offerId, `Student ${offer.studentName} accepted offer from ${offer.companyName} (${offer.ctcLpa ? `${offer.ctcLpa} LPA` : `${offer.stipendPerMonth}/mo`}). Status updated to Placed.`);
  };

  const declineOffer = (offerId: string) => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return;
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'Declined' } : o));
    addAuditLog('OFFER_DECLINED', 'Offer', offerId, `Offer from ${offer.companyName} declined by ${offer.studentName}`);
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
    addAuditLog('UPDATE_OFFER', 'Offer', id, `Updated offer record`);
  };

  // Follow-ups
  const addFollowUp = (followUpData: Omit<FollowUp, 'id'>) => {
    const newFup: FollowUp = {
      ...followUpData,
      id: `fup-${Date.now()}`
    };
    setFollowUps(prev => [newFup, ...prev]);
    addAuditLog('CREATE_FOLLOWUP', 'FollowUp', newFup.id, `Created follow-up for ${newFup.companyName} due ${newFup.dueDate}`);
    return newFup;
  };

  const completeFollowUp = (id: string, nextFollowUpDate?: string, notes?: string) => {
    const fup = followUps.find(f => f.id === id);
    if (!fup) return;

    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: 'COMPLETED',
          lastContactDate: new Date().toISOString().split('T')[0],
          notes: notes ? `${f.notes} | Completed: ${notes}` : f.notes
        };
      }
      return f;
    }));

    // Update HR contact last contact date
    if (fup.hrContactId) {
      updateHRContact(fup.hrContactId, {
        lastContactDate: new Date().toISOString().split('T')[0],
        nextFollowUpDate: nextFollowUpDate
      });
    }

    // Optionally schedule next follow-up
    if (nextFollowUpDate) {
      addFollowUp({
        companyId: fup.companyId,
        companyName: fup.companyName,
        hrContactId: fup.hrContactId,
        hrName: fup.hrName,
        hrPhone: fup.hrPhone,
        hrEmail: fup.hrEmail,
        pcOwnerId: currentUser.id,
        pcOwnerName: currentUser.name,
        priority: fup.priority,
        dueDate: nextFollowUpDate,
        status: 'PENDING',
        actionType: fup.actionType,
        notes: notes ? `Follow up on: ${notes}` : 'Scheduled next follow-up cycle'
      });
    }

    addAuditLog('COMPLETE_FOLLOWUP', 'FollowUp', id, `Marked follow-up with ${fup.hrName} (${fup.companyName}) as completed`);
  };

  const updateFollowUp = (id: string, updates: Partial<FollowUp>) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
  };

  // Quick Call Logger (under 20-sec workflow)
  const logQuickCall = (params: {
    companyId: string;
    hrContactId?: string;
    outcome: string;
    notes: string;
    nextFollowUpDate?: string;
    newCompanyStatus?: CompanyStatus;
  }) => {
    const company = companies.find(c => c.id === params.companyId);
    if (!company) return;

    const hr = hrContacts.find(h => h.id === params.hrContactId) || hrContacts.find(h => h.companyId === params.companyId);
    const today = new Date().toISOString().split('T')[0];

    // 1. Add activity entry
    addActivity({
      companyId: params.companyId,
      companyName: company.name,
      actorId: currentUser.id,
      actorName: currentUser.name,
      type: 'Call',
      title: `Call with ${hr?.name || 'HR'}: ${params.outcome}`,
      outcome: params.outcome,
      notes: params.notes
    });

    // 2. Update company status if provided
    if (params.newCompanyStatus && params.newCompanyStatus !== company.status) {
      updateCompany(company.id, {
        status: params.newCompanyStatus,
        updatedAt: new Date().toISOString()
      });
    }

    // 3. Update HR contact dates
    if (hr) {
      updateHRContact(hr.id, {
        lastContactDate: today,
        nextFollowUpDate: params.nextFollowUpDate
      });
    }

    // 4. Create or update follow-up if next follow-up date requested
    if (params.nextFollowUpDate) {
      addFollowUp({
        companyId: company.id,
        companyName: company.name,
        hrContactId: hr?.id,
        hrName: hr?.name || 'HR Lead',
        hrPhone: hr?.phone,
        hrEmail: hr?.email,
        pcOwnerId: currentUser.id,
        pcOwnerName: currentUser.name,
        priority: params.outcome === 'Interested' || params.outcome === 'Confirmed' ? 'HIGH' : 'MEDIUM',
        dueDate: params.nextFollowUpDate,
        status: 'PENDING',
        actionType: 'Call',
        notes: `Follow up on call outcome: "${params.outcome}". Notes: ${params.notes}`
      });
    }

    addAuditLog('LOG_CALL', 'Company', company.id, `Logged HR call with ${hr?.name || 'HR'} (${company.name}). Outcome: ${params.outcome}`);
  };

  // Batch Upsert Students from Excel / CSV (Auto-update in portal)
  const upsertStudents = (incomingStudents: Partial<Student>[]) => {
    let updated = 0;
    let created = 0;

    setStudents(prev => {
      const copy = [...prev];
      const rollMap = new Map<string, number>();
      copy.forEach((s, idx) => rollMap.set(s.rollNumber.trim().toUpperCase(), idx));

      incomingStudents.forEach(item => {
        if (!item.rollNumber) return;
        const normalizedRoll = item.rollNumber.trim().toUpperCase();
        if (rollMap.has(normalizedRoll)) {
          const index = rollMap.get(normalizedRoll)!;
          copy[index] = {
            ...copy[index],
            ...item,
            updatedAt: new Date().toISOString()
          };
          updated++;
        } else {
          const newStudent: Student = {
            id: `student-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            rollNumber: item.rollNumber.trim(),
            name: item.name || 'Student Candidate',
            email: item.email || `${item.rollNumber.toLowerCase()}@iift.edu`,
            phone: item.phone || '+91 98000 00000',
            gender: item.gender || 'Male',
            program: item.program || 'MBA-IB',
            campus: 'Delhi',
            batch: item.batch || '2024-26',
            specialization: item.specialization || 'Strategy & Consulting',
            workExpMonths: item.workExpMonths || 0,
            ugDegree: item.ugDegree || 'B.Tech',
            ugCollege: item.ugCollege || 'IIT / SRCC / University',
            cgpa: item.cgpa || 7.5,
            tenthPercent: item.tenthPercent || 88,
            twelfthPercent: item.twelfthPercent || 88,
            isEligible: item.isEligible !== undefined ? item.isEligible : true,
            skills: item.skills || ['Corporate Strategy', 'Financial Analysis'],
            summerStatus: item.summerStatus || 'Unplaced',
            finalStatus: item.finalStatus || 'Unplaced',
            finalCompanyName: item.finalCompanyName,
            finalCTC: item.finalCTC,
            shortlistsCount: item.shortlistsCount || 0,
            interviewsCount: item.interviewsCount || 0,
            offersCount: item.offersCount || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          copy.push(newStudent);
          rollMap.set(normalizedRoll, copy.length - 1);
          created++;
        }
      });
      return copy;
    });

    addAuditLog('EXCEL_AUTO_UPDATE', 'Student', 'batch', `Excel Ingestion: ${updated} students auto-updated, ${created} new students created in portal.`);
    return { updated, created };
  };

  // Batch Upsert Companies with HR details & phone number from Excel / CSV (Auto-update in portal)
  const upsertCompaniesWithHR = (incomingData: { company: Partial<Company>; hr?: Partial<HRContact> }[]) => {
    let updatedCompanies = 0;
    let createdCompanies = 0;
    let updatedHRs = 0;
    let createdHRs = 0;

    const companiesMap = new Map<string, string>(); // companyName (upper) -> companyId
    companies.forEach(c => companiesMap.set(c.name.trim().toUpperCase(), c.id));

    // 1. Upsert companies
    setCompanies(prevCompanies => {
      const copy = [...prevCompanies];
      const localMap = new Map<string, number>();
      copy.forEach((c, idx) => localMap.set(c.name.trim().toUpperCase(), idx));

      incomingData.forEach(({ company }) => {
        if (!company.name) return;
        const normalizedName = company.name.trim().toUpperCase();

        if (localMap.has(normalizedName)) {
          const idx = localMap.get(normalizedName)!;
          copy[idx] = {
            ...copy[idx],
            ...company,
            updatedAt: new Date().toISOString()
          };
          companiesMap.set(normalizedName, copy[idx].id);
          updatedCompanies++;
        } else {
          const newComp: Company = {
            id: `comp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            name: company.name.trim(),
            industry: company.industry || 'Management Consulting',
            companyType: company.companyType || 'MNC',
            website: company.website || 'https://company.com',
            location: company.location || 'New Delhi / Gurugram',
            pcOwnerId: currentUser.id,
            pcOwnerName: currentUser.name,
            recruitmentType: company.recruitmentType || 'Both',
            status: company.status || 'Interested',
            expectedVisitDate: company.expectedVisitDate,
            hiringIntent: company.hiringIntent,
            notes: company.notes,
            historicalHires: company.historicalHires || 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          copy.push(newComp);
          localMap.set(normalizedName, copy.length - 1);
          companiesMap.set(normalizedName, newComp.id);
          createdCompanies++;
        }
      });
      return copy;
    });

    // 2. Upsert HR contacts with phone numbers
    setHRContacts(prevHRs => {
      const hrCopy = [...prevHRs];

      incomingData.forEach(({ company, hr }) => {
        if (!company.name || !hr || (!hr.name && !hr.phone && !hr.email)) return;
        const normalizedName = company.name.trim().toUpperCase();
        const targetCompId = companiesMap.get(normalizedName) || `comp-${Date.now()}`;

        // Find existing HR by companyId + (email or phone or name)
        const existingIdx = hrCopy.findIndex(h => 
          (h.companyId === targetCompId || h.companyName.trim().toUpperCase() === normalizedName) &&
          ((hr.email && h.email.toLowerCase() === hr.email.toLowerCase()) ||
           (hr.phone && h.phone === hr.phone) ||
           (hr.name && h.name.toLowerCase() === hr.name.toLowerCase()))
        );

        if (existingIdx !== -1) {
          hrCopy[existingIdx] = {
            ...hrCopy[existingIdx],
            companyId: targetCompId,
            companyName: company.name.trim(),
            ...hr,
            phone: hr.phone || hrCopy[existingIdx].phone,
            name: hr.name || hrCopy[existingIdx].name,
            email: hr.email || hrCopy[existingIdx].email
          };
          updatedHRs++;
        } else {
          const newHR: HRContact = {
            id: `hr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            companyId: targetCompId,
            companyName: company.name.trim(),
            name: hr.name || 'Campus Recruiter',
            designation: hr.designation || 'Talent Acquisition Lead',
            email: hr.email || `campus@${company.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            phone: hr.phone || '+91 98000 12345',
            preferredChannel: hr.preferredChannel || 'Call',
            relationshipOwner: currentUser.name,
            isPrimary: true,
            notes: hr.notes
          };
          hrCopy.push(newHR);
          createdHRs++;
        }
      });
      return hrCopy;
    });

    addAuditLog(
      'EXCEL_AUTO_UPDATE',
      'Company/HR',
      'batch',
      `Excel Ingestion: ${updatedCompanies} companies updated, ${createdCompanies} added. ${updatedHRs} HR contacts updated, ${createdHRs} new HR recruiters with phone numbers auto-updated in portal.`
    );

    return { updatedCompanies, createdCompanies, updatedHRs, createdHRs };
  };

  const addActivity = (actData: Omit<CompanyActivity, 'id' | 'timestamp'>) => {
    const newAct: CompanyActivity = {
      ...actData,
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newAct, ...prev]);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  // Global Quick Action
  const openQuickAction = (type: string) => setQuickActionType(type);
  const closeQuickAction = () => setQuickActionType(null);

  // Reset demo data
  const resetToDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_students`);
    localStorage.removeItem(`${STORAGE_KEY}_companies`);
    localStorage.removeItem(`${STORAGE_KEY}_hr`);
    localStorage.removeItem(`${STORAGE_KEY}_drives`);
    localStorage.removeItem(`${STORAGE_KEY}_shortlists`);
    localStorage.removeItem(`${STORAGE_KEY}_interviews`);
    localStorage.removeItem(`${STORAGE_KEY}_offers`);
    localStorage.removeItem(`${STORAGE_KEY}_followups`);
    localStorage.removeItem(`${STORAGE_KEY}_activities`);
    localStorage.removeItem(`${STORAGE_KEY}_audit`);

    setStudents(INITIAL_STUDENTS);
    setCompanies(INITIAL_COMPANIES);
    setHRContacts(INITIAL_HR_CONTACTS);
    setDrives(INITIAL_DRIVES);
    setShortlists(INITIAL_SHORTLISTS);
    setInterviews(INITIAL_INTERVIEWS);
    setOffers(INITIAL_OFFERS);
    setFollowUps(INITIAL_FOLLOW_UPS);
    setActivities(INITIAL_ACTIVITIES);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setCurrentUser(CURRENT_USERS[0]);
  };

  return (
    <PlaceCommContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        canEdit,
        canAdmin,
        isSuperAdmin,
        isViewer,
        coordinators,
        updateCoordinatorRole,
        addCoordinator,
        updateCoordinator,
        deleteCoordinator,
        toggleCoordinatorStatus,
        loginWithGoogle,
        signUpWithGoogle,
        logoutUser,
        loginWithPersona,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        authError,
        students,
        companies,
        hrContacts,
        drives,
        shortlists,
        interviews,
        offers,
        followUps,
        activities,
        auditLogs,
        notifications,
        addStudent,
        updateStudent,
        deleteStudent,
        addCompany,
        updateCompany,
        deleteCompany,
        updateCompanyStatus,
        addHRContact,
        updateHRContact,
        deleteHRContact,
        addDrive,
        updateDrive,
        deleteDrive,
        addShortlist,
        bulkAddShortlists,
        removeShortlist,
        addInterview,
        updateInterview,
        updateInterviewStatus,
        deleteInterview,
        addOffer,
        acceptOffer,
        declineOffer,
        updateOffer,
        addFollowUp,
        completeFollowUp,
        updateFollowUp,
        deleteFollowUp,
        logQuickCall,
        upsertStudents,
        upsertCompaniesWithHR,
        addActivity,
        addAuditLog,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        quickActionType,
        openQuickAction,
        closeQuickAction,
        globalSearch,
        setGlobalSearch,
        resetToDemoData
      }}
    >
      {children}
    </PlaceCommContext.Provider>
  );
};

export const usePlaceComm = () => {
  const context = useContext(PlaceCommContext);
  if (!context) {
    throw new Error('usePlaceComm must be used within a PlaceCommProvider');
  }
  return context;
};
