
import React from 'react';
import { HomeIcon, UsersIcon, BriefcaseIcon, LeaveIcon, StarIcon, LogOutIcon, ProfileIcon, XIcon, ChartBarIcon } from './icons';

type View = 'dashboard' | 'employees' | 'recruitment' | 'leaves' | 'performance' | 'profiles' | 'reports';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userRole: string;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, isOpen, setIsOpen, userRole }) => {
  const allNavItems = [
    { id: 'dashboard', label: 'Visão Geral', icon: HomeIcon, allowedRoles: ['Administrador', 'Gestora'] },
    { id: 'employees', label: 'Funcionários', icon: UsersIcon, allowedRoles: ['Administrador', 'Gestora', 'Coordenadora'] },
    { id: 'recruitment', label: 'Recrutamento', icon: BriefcaseIcon, allowedRoles: ['Administrador', 'Gestora'] },
    { id: 'leaves', label: 'Licenças', icon: LeaveIcon, allowedRoles: ['Administrador', 'Gestora', 'Coordenadora', 'Usuário'] },
    { id: 'performance', label: 'Avaliações', icon: StarIcon, allowedRoles: ['Administrador', 'Gestora', 'Usuário'] },
    { id: 'reports', label: 'Relatórios', icon: ChartBarIcon, allowedRoles: ['Administrador', 'Gestora', 'Coordenadora'] },
    { id: 'profiles', label: 'Perfis', icon: ProfileIcon, allowedRoles: ['Administrador'] },
  ] as const;

  const filteredNavItems = allNavItems.filter(item => 
      !userRole || item.allowedRoles.includes(userRole)
  );

  const handleNavigation = (view: View) => {
    setActiveView(view);
    setIsOpen(false); // Close sidebar on navigation
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <aside 
        id="sidebar"
        className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-40 transform transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">RH-WAR</h1>
          <button className="md:hidden text-gray-500 hover:text-gray-800" onClick={() => setIsOpen(false)} aria-label="Fechar menu">
             <XIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="px-6 mb-4">
             <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Menu ({userRole})</span>
        </div>
        <nav className="flex-1 px-4 py-2">
          <ul className="space-y-2">
            {filteredNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigation(item.id as View)}
                  className={`w-full flex items-center py-2 px-4 rounded-lg text-left transition-colors duration-200 ${
                    activeView === item.id
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-800'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
              onClick={onLogout}
              className="w-full flex items-center py-2 px-4 rounded-lg text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors duration-200"
          >
              <LogOutIcon className="w-5 h-5 mr-3" />
              <span className="font-medium">Sair</span>
          </button>
          <p className="text-xs text-gray-500 mt-4">© 2024 RH-WAR Inc.</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
