import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  SunMedium,
  Award,
  CalendarDays,
  FileCheck,
  UserCheck,
  Clock,
  BarChart3,
  FileSpreadsheet,
  UploadCloud,
  History,
  Settings,
  Plus,
  Bell,
  Search,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Menu,
  X,
  PhoneCall,
  UserCircle2,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import { usePlaceComm } from '../context/PlaceCommContext';
import { CURRENT_USERS } from '../data/mockData';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenQuickCall: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, setCurrentTab, onOpenQuickCall }) => {
  const {
    currentUser,
    setCurrentUser,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    openQuickAction,
    globalSearch,
    setGlobalSearch,
    openAuthModal,
    canAdmin
  } = usePlaceComm();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Core' },
    { id: 'students', label: 'Students Master', icon: Users, section: 'Core' },
    { id: 'companies', label: 'Companies CRM', icon: Building2, section: 'Core' },
    { id: 'recruitment', label: 'Recruitment Drives', icon: Briefcase, section: 'Core' },
    { id: 'summer', label: 'Summer Placements', icon: SunMedium, section: 'Workspaces' },
    { id: 'final', label: 'Final Placements', icon: Award, section: 'Workspaces' },
    { id: 'interviews', label: 'Interviews & Schedule', icon: CalendarDays, section: 'Operations' },
    { id: 'offers', label: 'Offers & Conversions', icon: FileCheck, section: 'Operations' },
    { id: 'shortlists', label: 'Shortlists', icon: UserCheck, section: 'Operations' },
    { id: 'followups', label: 'Follow-up Queue', icon: Clock, section: 'CRM' },
    { id: 'hr', label: 'HR Directory', icon: UserCircle2, section: 'CRM' },
    { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3, section: 'Intelligence' },
    { id: 'reports', label: 'Reports Export', icon: FileSpreadsheet, section: 'Intelligence' },
    { id: 'imports', label: 'Excel Import Engine', icon: UploadCloud, section: 'Tools' },
    { id: 'admin', label: 'Admin Panel (PC Roles)', icon: ShieldCheck, section: 'Tools' },
    { id: 'audit', label: 'Audit Trail', icon: History, section: 'Tools' },
    { id: 'settings', label: 'Settings & Policy', icon: Settings, section: 'Tools' }
  ];

  return (
    <>
      {/* 1. TOP BAR CONTRACT: Zone 1 (Brand) — Zone 2 (Context/Nav) — Zone 3 (Actions) */}
      <header className="sticky top-0 z-30 h-14 bg-slate-900 border-b border-slate-800 text-white flex items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => setCurrentTab('dashboard')}
            className="text-left font-bold text-base tracking-tight text-white hover:text-blue-300 transition-colors flex items-center gap-2.5"
          >
            <div className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-md flex items-center justify-center font-bold text-white text-xs shadow-xs tracking-tight border border-blue-400/40">
              IIFT Delhi
            </div>
            <span className="font-bold text-slate-100 hidden sm:inline tracking-tight">PlaceComm OS</span>
          </button>
        </div>

        {/* Zone 2: Global Search with keyboard indicator */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search students, companies, HR contacts, drives..."
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                if (currentTab !== 'students' && currentTab !== 'companies' && currentTab !== 'hr') {
                  setCurrentTab('students');
                }
              }}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Zone 3: 1-2 Primary Actions & Profile Persona */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Call Button (Under 20 seconds) */}
          <button
            onClick={onOpenQuickCall}
            className="hidden lg:flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm transition-colors whitespace-nowrap"
            title="Log quick HR call outcome in under 20 seconds"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Log Call</span>
          </button>

          {/* Global Quick Action "+" Dropdown */}
          <div className="relative">
            <button
              onClick={() => openQuickAction('menu')}
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden md:inline">Quick Action</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative p-1.5 text-slate-300 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-rose-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl text-slate-900 z-50 overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">Notifications ({unreadNotificationsCount} unread)</span>
                  {unreadNotificationsCount > 0 && (
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No active notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          if (n.link) {
                            setCurrentTab(n.link.replace('/', ''));
                            setShowNotifications(false);
                          }
                        }}
                        className={`p-3 text-xs hover:bg-slate-50 cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/40' : ''}`}
                      >
                        <div className="flex items-start gap-2">
                          {n.type === 'URGENT' ? (
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          ) : n.type === 'SUCCESS' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <Clock className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900 leading-tight">{n.title}</p>
                            <p className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{n.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Google Sign In Quick Action / User Persona Switcher */}
          <div className="flex items-center gap-2">
            {!currentUser.isGoogleLinked && (
              <button
                onClick={openAuthModal}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-md shadow-xs transition-colors"
                title="Connect with Google OAuth"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.46 7.37 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.1z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.54 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z" />
                </svg>
                <span>Google Sign-In</span>
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-md hover:bg-slate-800 transition-colors text-left"
              >
                <div className="w-7 h-7 rounded-full bg-blue-700 border border-blue-500 flex items-center justify-center text-xs font-semibold text-white overflow-hidden">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <div className="hidden xl:block">
                  <p className="text-xs font-medium text-slate-100 truncate max-w-[110px] leading-none">{currentUser.name}</p>
                  <p className="text-[10px] text-blue-300 capitalize leading-none mt-1">
                    {currentUser.pcRole || currentUser.role.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-68 bg-white border border-slate-200 rounded-lg shadow-xl text-slate-900 z-50 p-2 space-y-2">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="inline-block text-[10px] uppercase font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {currentUser.pcRole || currentUser.role.replace('_', ' ')}
                      </span>
                      {currentUser.isGoogleLinked && (
                        <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Google Linked</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    {/* Google OAuth Login Button */}
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        openAuthModal();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-slate-100 flex items-center gap-2 text-slate-700 font-medium"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3h3.88c2.27-2.09 3.66-5.17 3.66-9.09z" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.1C3.27 21.46 7.37 24 12 24z" />
                        <path fill="#FBBC05" d="M5.28 14.32c-.25-.72-.38-1.49-.38-2.32s.13-1.6.38-2.32V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.1z" />
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.27 2.54 1.25 6.58l4.03 3.1c.95-2.83 3.6-4.93 6.72-4.93z" />
                      </svg>
                      <span>Google OAuth Sign-In / Register</span>
                    </button>

                    {/* Admin Panel Link */}
                    {canAdmin && (
                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setCurrentTab('admin');
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-purple-50 text-purple-900 font-semibold flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                        <span>Manage PC Roles (Admin Panel)</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">Switch Persona</p>
                    {CURRENT_USERS.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs rounded hover:bg-slate-100 flex items-center justify-between ${currentUser.id === u.id ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                      >
                        <span className="truncate">{u.name}</span>
                        <span className="text-[10px] text-slate-500 ml-2">{u.pcRole || u.role.split('_')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 2. SIDEBAR NAVIGATION: Desktop (Sticky Left) */}
      <aside className={`fixed inset-y-0 left-0 top-14 z-20 w-60 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex-1 overflow-y-auto py-3 px-2">
          {/* Batch Selector Kicker */}
          <div className="mx-2 mb-3 p-2 bg-slate-50 border border-slate-200 rounded-md">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">IIFT Delhi Placements 2026</span>
              <span className="text-emerald-700 font-semibold">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              MBA-IB · MBA-BA (IIFT Delhi)
            </div>
          </div>

          <nav className="space-y-4">
            {['Core', 'Workspaces', 'Operations', 'CRM', 'Intelligence', 'Tools'].map(section => {
              const items = navItems.filter(item => item.section === section);
              if (items.length === 0) return null;
              return (
                <div key={section}>
                  <p className="px-3 text-[10px] font-semibold tracking-wider text-slate-400 uppercase mb-1">
                    {section}
                  </p>
                  <div className="space-y-0.5">
                    {items.map(item => {
                      const Icon = item.icon;
                      const active = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentTab(item.id);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-md transition-colors text-left ${active ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-blue-700' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="font-mono">IIFT Delhi · C&PC</span>
          <span className="text-slate-400">v2.4</span>
        </div>
      </aside>

      {/* 3. MOBILE BOTTOM NAVIGATION (Crucial for mobile placement coordinators) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-3 py-1.5 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'dashboard' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </button>
        <button
          onClick={() => setCurrentTab('students')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'students' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
        >
          <Users className="w-4 h-4" />
          <span>Students</span>
        </button>
        <button
          onClick={() => openQuickAction('menu')}
          className="flex flex-col items-center justify-center -mt-4 w-10 h-10 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700"
          title="Quick Action"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentTab('companies')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'companies' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Companies</span>
        </button>
        <button
          onClick={() => setCurrentTab('interviews')}
          className={`flex flex-col items-center gap-0.5 text-[10px] ${currentTab === 'interviews' ? 'text-blue-600 font-semibold' : 'text-slate-500'}`}
        >
          <CalendarDays className="w-4 h-4" />
          <span>Interviews</span>
        </button>
      </nav>
    </>
  );
};
