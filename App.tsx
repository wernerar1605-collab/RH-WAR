
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
import { Employee } from './types';

const mockEmployees: Employee[] = [
  { id: 1, name: 'Ana Silva', role: 'Desenvolvedora Frontend', department: 'Tecnologia', email: 'ana.silva@example.com', avatar: 'https://picsum.photos/seed/1/200', status: 'Ativo', dataDeAdmissao: '2022-03-15', cpf: '111.111.111-11', rg: '11.111.111-1', dataDeNascimento: '1990-05-10', telefone: '(11) 98888-7777', salario: '8000,00', regimeDeTrabalho: 'CLT' },
  { id: 2, name: 'Bruno Costa', role: 'Designer UX/UI', department: 'Produto', email: 'bruno.costa@example.com', avatar: 'https://picsum.photos/seed/2/200', status: 'Ativo', dataDeAdmissao: '2021-11-20', cpf: '222.222.222-22', rg: '22.222.222-2', dataDeNascimento: '1992-08-25', telefone: '(11) 97777-6666', salario: '7500,00', regimeDeTrabalho: 'CLT' },
  { id: 3, name: 'Carla Dias', role: 'Gerente de Projetos', department: 'Tecnologia', email: 'carla.dias@example.com', avatar: 'https://picsum.photos/seed/3/200', status: 'Ativo', dataDeAdmissao: '2020-01-10', cpf: '333.333.333-33', rg: '33.333.333-3', dataDeNascimento: '1988-02-14', telefone: '(11) 96666-5555', salario: '12000,00', regimeDeTrabalho: 'PJ' },
  { id: 4, name: 'Diego Faria', role: 'Engenheiro de Dados', department: 'Dados', email: 'diego.faria@example.com', avatar: 'https://picsum.photos/seed/4/200', status: 'Inativo', dataDeAdmissao: '2023-05-01', cpf: '444.444.444-44', rg: '44.444.444-4', dataDeNascimento: '1995-12-01', telefone: '(11) 95555-4444', salario: '9500,00', regimeDeTrabalho: 'CLT' },
  { id: 5, name: 'Elisa Rocha', role: 'Analista de RH', department: 'RH', email: 'elisa.rocha@example.com', avatar: 'https://picsum.photos/seed/5/200', status: 'Ativo', dataDeAdmissao: '2022-09-05', cpf: '555.555.555-55', rg: '55.555.555-5', dataDeNascimento: '1993-07-30', telefone: '(11) 94444-3333', salario: '6000,00', regimeDeTrabalho: 'CLT' },
];

type View = 'dashboard' | 'employees' | 'recruitment' | 'leaves' | 'performance' | 'profiles' | 'reports';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const inactiveCount = employees.filter(e => e.status === 'Inativo').length;

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <Dashboard 
            totalEmployees={employees.length} 
            inactiveCount={inactiveCount}
            onNavigate={setActiveView} 
          />
        );
      case 'employees':
        return <EmployeeManagement employees={employees} setEmployees={setEmployees} />;
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
        return (
          <Dashboard 
            totalEmployees={employees.length} 
            inactiveCount={inactiveCount}
            onNavigate={setActiveView} 
          />
        );
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
