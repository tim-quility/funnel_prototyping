
import React, { useState } from 'react';
import HeaderBar from './HeaderBar';
import SideBar from './SideBar';
import DashboardPage from './dashboard/DashboardPage';
import { mockWarmMarketContacts } from '../constants';
import ImportLeadsPage from './import/ImportLeadsPage';
import RecruitingPage from './recruiting/RecruitingPage';

const PlaceholderPage = ({ title }: { title: string }) => (
    <div className="p-8">
        <h1 className="text-2xl font-bold text-quility-dark-text">{title}</h1>
        <p className="text-quility-dark-grey mt-2">
            This is a placeholder for the {title} page.
        </p>
    </div>
);

const MainPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('dash');

  const pendingTriageCount = mockWarmMarketContacts.filter(c => c.status === 'pending').length;

  const renderContent = () => {
    switch (currentPage) {
      case 'dash':
        return <DashboardPage onViewLead={() => {}} fetchPage={setCurrentPage} />;
      case 'Import_Leads':
        return <ImportLeadsPage />;
      case 'Recruiting':
        return <RecruitingPage />;
      default:
        return <PlaceholderPage title={currentPage.replace(/_/g, ' ')} />;
    }
  };

  return (
    <div className="h-screen bg-background font-mont flex flex-col">
      <HeaderBar
        fetchPage={setCurrentPage}
        setShowVoicemailsPage={() => setCurrentPage('Voicemail')}
        unheardCount={0}
      />
      <div className="flex flex-1 overflow-hidden" style={{marginTop: '50px'}}>
        <SideBar
          fetchPage={setCurrentPage}
          pendingTriageCount={pendingTriageCount}
          onTakeBreak={() => {}}
        />
        <div className="flex-1 flex flex-col" style={{ marginLeft: '50px', width: 'calc(100% - 50px)' }}>
          <main className="flex-1 overflow-y-auto bg-quility-accent-bg">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
