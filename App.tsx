
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EmployeeManagement from './components/EmployeeManagement';
import RecruitmentManagement from './components/RecruitmentManagement';
import LeaveManagement from './components/LeaveManagement';
import PerformanceReview from './components/PerformanceReview';
import Login from './components/Login';
import ProfileList from './components/ProfileList';
import Reports from './components/Reports';
import { MenuIcon } from './components/icons';

type View = 'dashboard' | 'employees' | 'recruitment' | 'leaves' | 'performance' | 'profiles' | 'reports';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>('employees');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'employees':
        return <EmployeeManagement />;
      case 'recruitment':
        return <RecruitmentManagement />;
      case 'leaves':
        return <LeaveManagement />;
      case 'performance':
        return <PerformanceReview />;
      case 'reports':
        return <Reports />;
      case 'profiles':
        return <ProfileList />;
      default:
        return <Dashboard />;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen} 
      />
      <main className="flex-1 flex flex-col h-full relative w-full transition-all duration-300 ease-in-out">
         {/* Mobile Header */}
         <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0 shadow-sm z-20">
            <span className="text-lg font-bold text-indigo-700">RH-WAR</span>
            <button
                className="p-2 text-gray-600 hover:text-gray-900 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Abrir menu"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
         </div>

         {/* Scrollable Content Area */}
         <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
            {renderContent()}
         </div>
      </main>
    </div>
  );
};

export default App;
