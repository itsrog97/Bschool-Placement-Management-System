import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  UserPlus,
  Search,
  Filter,
  Users,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Edit2,
  Trash2,
  Lock,
  Unlock,
  Key,
  Briefcase,
  GraduationCap,
  Building2,
  Check,
  ChevronDown,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Eye,
  Sparkles,
  PhoneCall,
  Mail,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { CoordinatorUser, PCRole, CoordinatorPermissions } from '../types';
import { ROLE_PERMISSIONS_MAP } from '../context/PlaceCommContext';
import { formatDate } from '../utils/formatters';

interface AdminPanelPageProps {
  onNavigateTab?: (tab: string) => void;
}

export const AdminPanelPage: React.FC<AdminPanelPageProps> = ({ onNavigateTab }) => {
  const {
    coordinators,
    updateCoordinatorRole,
    addCoordinator,
    updateCoordinator,
    deleteCoordinator,
    toggleCoordinatorStatus,
    currentUser,
    isSuperAdmin,
    canAdmin,
    openAuthModal
  } = usePlaceComm();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [filterBatch, setFilterBatch] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCoordinator, setEditingCoordinator] = useState<CoordinatorUser | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] = useState<CoordinatorUser | null>(null);
  const [showPermissionsMatrix, setShowPermissionsMatrix] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Coordinator Form state
  const [newForm, setNewForm] = useState<{
    name: string;
    email: string;
    phone: string;
    role: PCRole;
    program: 'MBA-IB' | 'MBA-BA';
    batch: '2024-26' | '2025-27';
    sector: string;
  }>({
    name: '',
    email: '',
    phone: '+91 98',
    role: 'Junior Coordinator',
    program: 'MBA-IB',
    batch: '2024-26',
    sector: 'Strategy & Consulting'
  });

  const allRoles: PCRole[] = [
    'Super Admin',
    'Placement Secretary',
    'Lead Coordinator',
    'Sector Lead - Consulting',
    'Sector Lead - BFSI',
    'Sector Lead - Tech & Product',
    'Sector Lead - FMCG & Trade',
    'Senior Coordinator',
    'Junior Coordinator'
  ];

  const filteredCoordinators = useMemo(() => {
    return coordinators.filter(c => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchName = c.name.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchSector = c.sector.toLowerCase().includes(q);
        const matchRole = c.role.toLowerCase().includes(q);
        if (!matchName && !matchEmail && !matchSector && !matchRole) return false;
      }

      if (filterRole !== 'All' && c.role !== filterRole) return false;
      if (filterBatch !== 'All' && c.batch !== filterBatch) return false;
      if (filterStatus !== 'All' && c.status !== filterStatus) return false;

      return true;
    });
  }, [coordinators, searchQuery, filterRole, filterBatch, filterStatus]);

  const handleCreateCoordinator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name || !newForm.email) return;

    let systemRole: CoordinatorUser['systemRole'] = 'PLACEMENT_COORDINATOR';
    if (newForm.role === 'Super Admin') systemRole = 'SUPER_ADMIN';
    else if (newForm.role === 'Placement Secretary') systemRole = 'ADMIN';

    addCoordinator({
      name: newForm.name,
      email: newForm.email,
      phone: newForm.phone,
      role: newForm.role,
      systemRole,
      program: newForm.program,
      batch: newForm.batch,
      sector: newForm.sector,
      status: 'Active',
      permissions: ROLE_PERMISSIONS_MAP[newForm.role]
    });

    setIsAddModalOpen(false);
    setNewForm({
      name: '',
      email: '',
      phone: '+91 98',
      role: 'Junior Coordinator',
      program: 'MBA-IB',
      batch: '2024-26',
      sector: 'Strategy & Consulting'
    });

    setToastMessage(`Created coordinator account for ${newForm.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRoleChange = (coordinatorId: string, newRole: PCRole) => {
    updateCoordinatorRole(coordinatorId, newRole);
    setRoleChangeTarget(null);
    setToastMessage(`Assigned role '${newRole}' to coordinator.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getRoleBadgeStyle = (role: PCRole) => {
    switch (role) {
      case 'Super Admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Placement Secretary':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Lead Coordinator':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sector Lead - Consulting':
      case 'Sector Lead - BFSI':
      case 'Sector Lead - Tech & Product':
      case 'Sector Lead - FMCG & Trade':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Senior Coordinator':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-800 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-200 hover:text-white font-bold ml-3">
            ✕
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administration &amp; Access Governance</span>
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-300">IIFT Delhi PlaceComm OS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Placement Coordinator Management &amp; Roles
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage placement committee personnel, assign operational sector leads, and configure role-based permissions
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setShowPermissionsMatrix(!showPermissionsMatrix)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Permissions Matrix</span>
          </button>

          <button
            onClick={openAuthModal}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Auth Panel</span>
          </button>

          {canAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Coordinator</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Total Coordinators</p>
          <p className="text-xl font-bold text-slate-900 font-mono mt-0.5">{coordinators.length}</p>
          <p className="text-[10px] text-slate-500 mt-1">Both MBA-IB &amp; MBA-BA batches</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Active Accounts</p>
          <p className="text-xl font-bold text-emerald-700 font-mono mt-0.5">
            {coordinators.filter(c => c.status === 'Active').length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Operational access granted</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Google OAuth Linked</p>
          <p className="text-xl font-bold text-blue-700 font-mono mt-0.5">
            {coordinators.filter(c => c.isGoogleLinked).length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Authenticated via Google Sign-In</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <p className="text-[11px] font-medium text-slate-500">Sector Leads &amp; Admins</p>
          <p className="text-xl font-bold text-purple-700 font-mono mt-0.5">
            {coordinators.filter(c => c.role.includes('Lead') || c.role.includes('Admin') || c.role.includes('Secretary')).length}
          </p>
          <p className="text-[10px] text-slate-500 mt-1">Domain leadership roles</p>
        </div>
      </div>

      {/* Role Permissions Matrix Drawer / Panel */}
      {showPermissionsMatrix && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Role-Based Access Control (RBAC) Permissions Matrix</h3>
            </div>
            <button
              onClick={() => setShowPermissionsMatrix(false)}
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
            >
              ✕ Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Role Designation</th>
                  <th className="py-2.5 px-3 text-center">Manage Users</th>
                  <th className="py-2.5 px-3 text-center">Export Master CSV</th>
                  <th className="py-2.5 px-3 text-center">Manage Companies</th>
                  <th className="py-2.5 px-3 text-center">Modify Students</th>
                  <th className="py-2.5 px-3 text-center">Approve Offers</th>
                  <th className="py-2.5 px-3 text-center">Audit Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allRoles.map(r => {
                  const perm = ROLE_PERMISSIONS_MAP[r];
                  return (
                    <tr key={r} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRoleBadgeStyle(r)}`}>
                          {r}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {perm.canManageUsers ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {perm.canExportData ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {perm.canManageCompanies ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {perm.canModifyStudents ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {perm.canReleaseOffers ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {perm.canAccessAuditLogs ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search coordinator by name, email, sector..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Role:</span>
            <select
              value={filterRole}
              onChange={e => setFilterRole(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-medium"
            >
              <option value="All">All Roles</option>
              {allRoles.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Batch:</span>
            <select
              value={filterBatch}
              onChange={e => setFilterBatch(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-medium"
            >
              <option value="All">All Batches</option>
              <option value="2024-26">2024-26 (Final)</option>
              <option value="2025-27">2025-27 (Summer)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-xs font-medium"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coordinators Directory & Role Assignment Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Placement Coordinator</th>
                <th className="py-3 px-4">Contact &amp; OAuth</th>
                <th className="py-3 px-4">Program &amp; Batch</th>
                <th className="py-3 px-4">Assigned Sector</th>
                <th className="py-3 px-4">Assigned PlaceComm Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCoordinators.map(c => {
                const isCurrentUser = currentUser.id === c.id;
                return (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    {/* Coordinator Profile */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={c.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 text-xs">{c.name}</span>
                            {isCurrentUser && (
                              <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">{c.phone}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email & Google OAuth Badge */}
                    <td className="py-3 px-4">
                      <p className="font-mono text-[11px] text-slate-800">{c.email}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {c.isGoogleLinked ? (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full flex items-center gap-1">
                            {/* Google G logo */}
                            <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z" />
                              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.46 7.37 24 12 24z" />
                              <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.1z" />
                              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.54 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z" />
                            </svg>
                            <span>Google OAuth Linked</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                            Standard Login
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Program & Batch */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-800">
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                        <span>{c.program}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">Batch {c.batch}</p>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-semibold text-slate-800">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{c.sector}</span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {c.assignedCompaniesCount} corporate accounts
                      </span>
                    </td>

                    {/* Role Dropdown Assignment (Primary Feature) */}
                    <td className="py-3 px-4">
                      {canAdmin ? (
                        <div className="relative inline-block">
                          <select
                            value={c.role}
                            onChange={e => handleRoleChange(c.id, e.target.value as PCRole)}
                            className={`font-semibold text-xs py-1 px-2.5 rounded-lg border focus:ring-1 focus:ring-blue-600 focus:outline-none cursor-pointer ${getRoleBadgeStyle(
                              c.role
                            )}`}
                          >
                            {allRoles.map(r => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${getRoleBadgeStyle(c.role)}`}>
                          {c.role}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          c.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {canAdmin ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Toggle Status */}
                          <button
                            onClick={() =>
                              toggleCoordinatorStatus(c.id, c.status === 'Active' ? 'Suspended' : 'Active')
                            }
                            className={`p-1.5 rounded transition-colors ${
                              c.status === 'Active'
                                ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            }`}
                            title={c.status === 'Active' ? 'Suspend coordinator' : 'Reactivate coordinator'}
                          >
                            {c.status === 'Active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete Account */}
                          {!isCurrentUser && (
                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to remove coordinator account for ${c.name}?`)) {
                                  deleteCoordinator(c.id);
                                  setToastMessage(`Removed coordinator ${c.name}`);
                                  setTimeout(() => setToastMessage(null), 3000);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              title="Delete coordinator account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400">View Only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Placement Coordinator Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Add New Placement Coordinator</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Create a new PlaceComm account and assign initial institutional role
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCoordinator} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Coordinator Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Varun Chhabra"
                    value={newForm.name}
                    onChange={e => setNewForm({ ...newForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email / Google Account *</label>
                  <input
                    type="email"
                    required
                    placeholder="name_ib24@iift.edu or @gmail.com"
                    value={newForm.email}
                    onChange={e => setNewForm({ ...newForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98110 00000"
                    value={newForm.phone}
                    onChange={e => setNewForm({ ...newForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned PlaceComm Role *</label>
                  <select
                    value={newForm.role}
                    onChange={e => setNewForm({ ...newForm, role: e.target.value as PCRole })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 font-semibold text-slate-900 bg-white"
                  >
                    {allRoles.map(r => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Program</label>
                  <select
                    value={newForm.program}
                    onChange={e => setNewForm({ ...newForm, program: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="MBA-IB">MBA-IB (International Business)</option>
                    <option value="MBA-BA">MBA-BA (Business Analytics)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Batch Year</label>
                  <select
                    value={newForm.batch}
                    onChange={e => setNewForm({ ...newForm, batch: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                  >
                    <option value="2024-26">Batch 2024-26 (Final Placement)</option>
                    <option value="2025-27">Batch 2025-27 (Summer Internship)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Corporate Sector / Domain</label>
                <input
                  type="text"
                  placeholder="e.g. Strategy & Consulting, BFSI, Tech, FMCG"
                  value={newForm.sector}
                  onChange={e => setNewForm({ ...newForm, sector: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Create &amp; Assign Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
