
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
import { Employee, Candidate, Job, Stage, LeaveRequest } from './types';

// Helper to generate dynamic dates
const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();

const getDate = (day: number, monthOffset: number = 0) => {
    const date = new Date(currentYear, currentMonth + monthOffset, day);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

const mockEmployees: Employee[] = [
    { id: 1, name: 'Rosa Maia', role: 'Desenvolvedora Frontend', department: 'Tecnologia', email: 'rosa.maia@example.com', avatar: 'https://i.pravatar.cc/150?u=rosa', status: 'Ativo', dataDeAdmissao: '2022-03-15', cpf: '111.111.111-11', rg: '11.111.111-1', dataDeNascimento: '1990-05-10', telefone: '(11) 98888-7777', salario: '8000,00', regimeDeTrabalho: 'CLT' },
    { id: 2, name: 'Rafael Salgado', role: 'Designer UX/UI', department: 'Produto', email: 'rafael.salgado@example.com', avatar: 'https://i.pravatar.cc/150?u=rafael', status: 'Ativo', dataDeAdmissao: '2021-11-20', cpf: '222.222.222-22', rg: '22.222.222-2', dataDeNascimento: '1992-08-25', telefone: '(11) 97777-6666', salario: '7500,00', regimeDeTrabalho: 'CLT' },
    { id: 3, name: 'João Ricardo', role: 'Gerente de Projetos', department: 'Tecnologia', email: 'joao.ricardo@example.com', avatar: 'https://i.pravatar.cc/150?u=joao', status: 'Ativo', dataDeAdmissao: '2020-01-10', cpf: '333.333.333-33', rg: '33.333.333-3', dataDeNascimento: '1988-02-14', telefone: '(11) 96666-5555', salario: '12000,00', regimeDeTrabalho: 'PJ' },
    { id: 4, name: 'Mariana Silva', role: 'Engenheira de Dados', department: 'Dados', email: 'mariana.silva@example.com', avatar: 'https://i.pravatar.cc/150?u=mariana', status: 'Ativo', dataDeAdmissao: '2023-05-01', cpf: '444.444.444-44', rg: '44.444.444-4', dataDeNascimento: '1995-12-01', telefone: '(11) 95555-4444', salario: '9500,00', regimeDeTrabalho: 'CLT' },
    { id: 5, name: 'Lorena Dias', role: 'Analista de RH', department: 'RH', email: 'lorena.dias@example.com', avatar: 'https://i.pravatar.cc/150?u=lorena', status: 'Ativo', dataDeAdmissao: '2022-09-05', cpf: '555.555.555-55', rg: '55.555.555-5', dataDeNascimento: '1993-07-30', telefone: '(11) 94444-3333', salario: '6000,00', regimeDeTrabalho: 'CLT' },
    { id: 6, name: 'Silvia Albuquerque', role: 'Desenvolvedora Backend', department: 'Tecnologia', email: 'silvia.albuquerque@example.com', avatar: 'https://i.pravatar.cc/150?u=silvia', status: 'Ativo', dataDeAdmissao: '2022-01-20', cpf: '666.666.666-66', rg: '66.666.666-6', dataDeNascimento: '1991-03-20', telefone: '(11) 93333-2222', salario: '8500,00', regimeDeTrabalho: 'CLT' },
    { id: 7, name: 'Tomas Guimarães', role: 'Analista de Marketing', department: 'Marketing', email: 'tomas.guimaraes@example.com', avatar: 'https://i.pravatar.cc/150?u=tomas', status: 'Ativo', dataDeAdmissao: '2023-02-10', cpf: '777.777.777-77', rg: '77.777.777-7', dataDeNascimento: '1996-01-15', telefone: '(11) 92222-1111', salario: '6500,00', regimeDeTrabalho: 'CLT' },
    { id: 8, name: 'Marina Avelar', role: 'Product Manager', department: 'Produto', email: 'marina.avelar@example.com', avatar: 'https://i.pravatar.cc/150?u=marina', status: 'Ativo', dataDeAdmissao: '2021-07-15', cpf: '888.888.888-88', rg: '88.888.888-8', dataDeNascimento: '1989-11-05', telefone: '(11) 91111-0000', salario: '11000,00', regimeDeTrabalho: 'PJ' },
    { id: 9, name: 'Joana Medeiros', role: 'Analista Financeiro', department: 'Financeiro', email: 'joana.medeiros@example.com', avatar: 'https://i.pravatar.cc/150?u=joana', status: 'Ativo', dataDeAdmissao: '2022-11-01', cpf: '999.999.999-99', rg: '99.999.999-9', dataDeNascimento: '1994-06-22', telefone: '(11) 99999-8888', salario: '6800,00', regimeDeTrabalho: 'CLT' },
    { id: 10, name: 'Ricardo Amorim', role: 'Desenvolvedor Full-Stack', department: 'Tecnologia', email: 'ricardo.amorim@example.com', avatar: 'https://i.pravatar.cc/150?u=ricardo', status: 'Ativo', dataDeAdmissao: '2020-05-25', cpf: '101.010.101-01', rg: '10.101.010-1', dataDeNascimento: '1987-09-12', telefone: '(11) 98888-7777', salario: '10000,00', regimeDeTrabalho: 'CLT' },
    { id: 11, name: 'Pedro Braga', role: 'Estagiário de Design', department: 'Produto', email: 'pedro.braga@example.com', avatar: 'https://i.pravatar.cc/150?u=pedro', status: 'Ativo', dataDeAdmissao: '2024-02-01', cpf: '121.212.121-21', rg: '12.121.212-1', dataDeNascimento: '2000-04-18', telefone: '(11) 97777-6666', salario: '2000,00', regimeDeTrabalho: 'Estágio' },
    { id: 12, name: 'Ana Maria Santos', role: 'Recrutadora', department: 'RH', email: 'ana.santos@example.com', avatar: 'https://i.pravatar.cc/150?u=ana', status: 'Ativo', dataDeAdmissao: '2021-09-18', cpf: '131.313.131-31', rg: '13.131.313-1', dataDeNascimento: '1992-10-03', telefone: '(11) 96666-5555', salario: '6200,00', regimeDeTrabalho: 'CLT' },
    { id: 13, name: 'Raquel Bouças', role: 'Engenheira de Software', department: 'Tecnologia', email: 'raquel.boucas@example.com', avatar: 'https://i.pravatar.cc/150?u=raquel', status: 'Ativo', dataDeAdmissao: '2022-06-30', cpf: '141.414.141-41', rg: '14.141.414-1', dataDeNascimento: '1993-08-28', telefone: '(11) 95555-4444', salario: '9000,00', regimeDeTrabalho: 'CLT' },
    { id: 14, name: 'Diego Faria', role: 'Engenheiro de Dados', department: 'Dados', email: 'diego.faria@example.com', avatar: 'https://picsum.photos/seed/4/200', status: 'Inativo', dataDeAdmissao: '2023-05-01', cpf: '444.444.444-44', rg: '44.444.444-4', dataDeNascimento: '1995-12-01', telefone: '(11) 95555-4444', salario: '9500,00', regimeDeTrabalho: 'CLT' },
];

const mockJobs: Job[] = [
    { id: 1, title: 'Desenvolvedor Backend', department: 'Tecnologia', status: 'Aberto', description: 'Vaga para desenvolvedor backend com experiência em Node.js.' },
    { id: 2, title: 'Product Manager', department: 'Produto', status: 'Aberto', description: 'Vaga para gerente de produto para nosso novo app.' },
    { id: 3, title: 'Designer UX/UI', department: 'Produto', status: 'Fechado', description: 'Vaga para designer de interfaces.' },
];

const mockStages: Stage[] = [
    { id: 1, name: 'Triagem' },
    { id: 2, name: 'Entrevista com RH' },
    { id: 3, name: 'Teste Técnico' },
    { id: 4, name: 'Entrevista Técnica' },
    { id: 5, name: 'Oferta' },
    { id: 6, name: 'Contratado' },
];

const mockCandidates: Candidate[] = [
  { id: 1, name: 'Fernando Lima', jobIds: [1], stageId: 4, avatar: 'https://picsum.photos/seed/6/200' },
  { id: 2, name: 'Gabriela Mendes', jobIds: [1], stageId: 1, avatar: 'https://picsum.photos/seed/7/200' },
  { id: 3, name: 'Heloísa Pinto', jobIds: [2], stageId: 5, avatar: 'https://picsum.photos/seed/8/200' },
  { id: 4, name: 'Ivan Gomes', jobIds: [1], stageId: 2, avatar: 'https://picsum.photos/seed/9/200' },
  { id: 5, name: 'Juliana Alves', jobIds: [2], stageId: 2, avatar: 'https://picsum.photos/seed/10/200' },
  { id: 6, name: 'Kleber Souza', jobIds: [1, 2], stageId: 1, avatar: 'https://picsum.photos/seed/11/200' },
  { id: 7, name: 'Lívia Andrade', jobIds: [2, 3], stageId: 3, avatar: 'https://picsum.photos/seed/12/200' },
];

const mockLeaveRequests: LeaveRequest[] = [
    { id: 1, employee: mockEmployees[0], type: 'Férias', startDate: getDate(1), endDate: getDate(8), status: 'Aprovada' },
    { id: 2, employee: mockEmployees[1], type: 'Viagem de Trabalho', startDate: getDate(14), endDate: getDate(17), status: 'Aprovada' },
    { id: 3, employee: mockEmployees[2], type: 'Home Office', startDate: getDate(7), endDate: getDate(10), status: 'Aprovada' },
    { id: 4, employee: mockEmployees[3], type: 'Férias', startDate: getDate(7), endDate: getDate(14), status: 'Aprovada' },
    { id: 5, employee: mockEmployees[4], type: 'Licença médica', startDate: getDate(16), endDate: getDate(20), status: 'Aprovada' },
    { id: 6, employee: mockEmployees[5], type: 'Viagem de Trabalho', startDate: getDate(8), endDate: getDate(14), status: 'Aprovada' },
    { id: 7, employee: mockEmployees[6], type: 'Férias', startDate: getDate(2), endDate: getDate(9), status: 'Aprovada' },
    { id: 8, employee: mockEmployees[7], type: 'Férias', startDate: getDate(14), endDate: getDate(18), status: 'Aprovada' },
    { id: 9, employee: mockEmployees[8], type: 'Licença médica', startDate: getDate(2), endDate: getDate(6), status: 'Aprovada' },
    { id: 10, employee: mockEmployees[9], type: 'Home Office', startDate: getDate(9), endDate: getDate(15), status: 'Aprovada' },
    { id: 11, employee: mockEmployees[10], type: 'Férias', startDate: getDate(2), endDate: getDate(9), status: 'Aprovada' },
    { id: 12, employee: mockEmployees[11], type: 'Viagem de Trabalho', startDate: getDate(8), endDate: getDate(14), status: 'Aprovada' },
    { id: 13, employee: mockEmployees[12], type: 'Viagem de Trabalho', startDate: getDate(1), endDate: getDate(4), status: 'Aprovada' },
    { id: 14, employee: mockEmployees[12], type: 'Férias', startDate: getDate(14), endDate: getDate(17), status: 'Aprovada' },
    { id: 15, employee: mockEmployees[1], type: 'Férias', startDate: getDate(2, 1), endDate: getDate(6, 1), status: 'Pendente' },
];

type View = 'dashboard' | 'employees' | 'recruitment' | 'leaves' | 'performance' | 'profiles' | 'reports';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Lifted States
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [stages, setStages] = useState<Stage[]>(mockStages);
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);

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
        return (
            <RecruitmentManagement 
                jobs={jobs} 
                setJobs={setJobs}
                stages={stages}
                setStages={setStages}
                candidates={candidates}
                setCandidates={setCandidates}
            />
        );
      case 'leaves':
        return (
            <LeaveManagement 
                employees={employees}
                leaveRequests={leaveRequests}
                setLeaveRequests={setLeaveRequests}
            />
        );
      case 'performance':
        return <PerformanceReview />;
      case 'reports':
        return (
            <Reports 
                employees={employees}
                candidates={candidates}
                jobs={jobs}
                stages={stages}
                leaveRequests={leaveRequests}
            />
        );
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
