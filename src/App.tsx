import React, { useState } from 'react';
import { PlaceCommProvider, usePlaceComm } from './context/PlaceCommContext';
import { Navigation } from './components/Navigation';
import { QuickActionModal } from './components/QuickActionModal';
import { QuickCallModal } from './components/QuickCallModal';
import { DashboardPage } from './pages/DashboardPage';
import { StudentsPage } from './pages/StudentsPage';
import { StudentProfilePage } from './pages/StudentProfilePage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyProfilePage } from './pages/CompanyProfilePage';
import { RecruitmentDrivesPage } from './pages/RecruitmentDrivesPage';
import { SummerPlacementsPage } from './pages/SummerPlacementsPage';
import { FinalPlacementsPage } from './pages/FinalPlacementsPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { OffersPage } from './pages/OffersPage';
import { ShortlistsPage } from './pages/ShortlistsPage';
import { FollowUpsPage } from './pages/FollowUpsPage';
import { HRContactsPage } from './pages/HRContactsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportsPage } from './pages/ReportsPage';
import { ImportEnginePage } from './pages/ImportEnginePage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Student, Company } from './types';

const MainAppContent: React.FC = () => {
  const { quickActionType, closeQuickAction, companies, students } = usePlaceComm();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Quick Call Modal
  const [quickCallOpen, setQuickCallOpen] = useState(false);
  const [quickCallCompanyId, setQuickCallCompanyId] = useState<string | undefined>(undefined);

  const handleOpenQuickCall = (companyId?: string) => {
    setQuickCallCompanyId(companyId);
    setQuickCallOpen(true);
  };

  const handleCloseQuickCall = () => {
    setQuickCallOpen(false);
    setQuickCallCompanyId(undefined);
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompany(company);
  };

  const handleSelectCompanyByName = (name: string) => {
    const comp = companies.find(c => c.name.toLowerCase() === name.toLowerCase()) || companies[0];
    if (comp) {
      setSelectedCompany(comp);
      setCurrentTab('companies');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Navigation (Top bar + Desktop Sidebar + Mobile Bottom bar) */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          setSelectedStudent(null);
          setSelectedCompany(null);
        }}
        onOpenQuickCall={() => handleOpenQuickCall()}
      />

      {/* Main Content Area */}
      <main className="md:ml-60 flex-1 p-4 sm:p-6 pb-24 md:pb-12 max-w-7xl w-full mx-auto">
        {/* Detail Pages or Tab Views */}
        {selectedStudent ? (
          <StudentProfilePage
            student={selectedStudent}
            onBack={() => setSelectedStudent(null)}
          />
        ) : selectedCompany ? (
          <CompanyProfilePage
            company={selectedCompany}
            onBack={() => setSelectedCompany(null)}
            onOpenQuickCall={handleOpenQuickCall}
          />
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <DashboardPage
                onNavigateTab={(tab) => {
                  setCurrentTab(tab);
                  setSelectedStudent(null);
                  setSelectedCompany(null);
                }}
                onOpenQuickCallWithCompany={handleOpenQuickCall}
              />
            )}

            {currentTab === 'students' && (
              <StudentsPage
                onSelectStudent={handleSelectStudent}
                onNavigateTab={(tab) => setCurrentTab(tab)}
              />
            )}

            {currentTab === 'companies' && (
              <CompaniesPage
                onSelectCompany={handleSelectCompany}
                onOpenQuickCall={handleOpenQuickCall}
              />
            )}

            {currentTab === 'recruitment' && (
              <RecruitmentDrivesPage
                onSelectCompanyByName={handleSelectCompanyByName}
              />
            )}

            {currentTab === 'summer' && <SummerPlacementsPage />}

            {currentTab === 'final' && <FinalPlacementsPage />}

            {currentTab === 'interviews' && <InterviewsPage />}

            {currentTab === 'offers' && <OffersPage />}

            {currentTab === 'shortlists' && (
              <ShortlistsPage onNavigateTab={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'followups' && (
              <FollowUpsPage onOpenQuickCall={handleOpenQuickCall} />
            )}

            {currentTab === 'hr' && (
              <HRContactsPage
                onOpenQuickCall={handleOpenQuickCall}
                onSelectCompanyByName={handleSelectCompanyByName}
              />
            )}

            {currentTab === 'analytics' && <AnalyticsPage />}

            {currentTab === 'reports' && <ReportsPage />}

            {currentTab === 'imports' && (
              <ImportEnginePage onNavigateTab={(tab) => setCurrentTab(tab)} />
            )}

            {currentTab === 'audit' && <AuditLogsPage />}

            {currentTab === 'settings' && <SettingsPage />}
          </>
        )}
      </main>

      {/* Global Quick Action Modal ("+" button) */}
      <QuickActionModal
        isOpen={quickActionType !== null}
        actionType={quickActionType}
        onClose={closeQuickAction}
        onOpenQuickCall={() => handleOpenQuickCall()}
        onNavigateTab={(tab) => {
          setCurrentTab(tab);
          setSelectedStudent(null);
          setSelectedCompany(null);
        }}
      />

      {/* Global Rapid 20-Second HR Call Logger Modal */}
      <QuickCallModal
        isOpen={quickCallOpen}
        onClose={handleCloseQuickCall}
        preselectedCompanyId={quickCallCompanyId}
      />
    </div>
  );
};

export default function App() {
  return (
    <PlaceCommProvider>
      <MainAppContent />
    </PlaceCommProvider>
  );
}
