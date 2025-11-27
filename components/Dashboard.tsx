
import React from 'react';
import { UsersIcon, DollarSignIcon, CalendarIcon, TrendingUpIcon, ClockIcon, AlertTriangleIcon, FileTextIcon, ExternalLinkIcon, LogOutIcon } from './icons';

interface DashboardProps {
  totalEmployees: number;
  inactiveCount: number;
  onNavigate: (view: any) => void;
}

const StatCard: React.FC<{
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  change?: string;
  isPositive?: boolean;
  onClick?: () => void;
  className?: string;
}> = ({ icon: Icon, title, value, subtitle, change, isPositive, onClick, className }) => (
  <div 
    onClick={onClick}
    className={`bg-white p-5 rounded-lg border border-gray-200 flex flex-col justify-between hover:shadow-md transition-all duration-300 ${className || ''}`}
  >
    <div className="flex justify-between items-start">
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <Icon className="w-6 h-6 text-gray-400" />
    </div>
    <div>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
      {change && (
        <div className="flex items-center text-sm mt-1">
          <TrendingUpIcon className={`w-4 h-4 mr-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`} />
          <span className={`font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {change}
          </span>
        </div>
      )}
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ totalEmployees, inactiveCount, onNavigate }) => {
  const departmentsData = [
    { name: 'Desenvolvimento', count: 42, total: 117 },
    { name: 'Vendas', count: 35, total: 117 },
    { name: 'Marketing', count: 28, total: 117 },
    { name: 'RH', count: 12, total: 117 },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Visão Geral</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          icon={UsersIcon}
          title="Total de Funcionários"
          value={totalEmployees.toString()}
          subtitle="Funcionários no sistema"
          change="+5 este mês"
          isPositive={true}
          onClick={() => onNavigate('employees')}
          className="cursor-pointer ring-2 ring-transparent hover:ring-indigo-500"
        />
        <StatCard
          icon={LogOutIcon}
          title="Funcionários Inativos"
          value={inactiveCount.toString()}
          subtitle="Desligados ou afastados"
          change="Acessar lista"
          isPositive={false}
          onClick={() => onNavigate('employees')}
          className="cursor-pointer ring-2 ring-transparent hover:ring-indigo-500"
        />
        <StatCard
          icon={DollarSignIcon}
          title="Folha de Pagamento"
          value="R$ 245.680"
          subtitle="Custo mensal total"
          change="+3.2% vs mês anterior"
          isPositive={true}
        />
        <StatCard
          icon={CalendarIcon}
          title="Férias Pendentes"
          value="23"
          subtitle="Solicitações para aprovar"
          onClick={() => onNavigate('leaves')}
          className="cursor-pointer ring-2 ring-transparent hover:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-5 xl:col-span-1 bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <ClockIcon className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Ações Rápidas</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Acesso rápido às funcionalidades mais usadas</p>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('employees')}
              className="w-full flex justify-between items-center text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700">Cadastrar Funcionário</span>
              <UsersIcon className="w-5 h-5 text-gray-400" />
            </button>
            <button 
              onClick={() => onNavigate('leaves')}
              className="w-full flex justify-between items-center text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-700">Aprovar Solicitações</span>
              <ExternalLinkIcon className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-2 bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <AlertTriangleIcon className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Notificações</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Itens que precisam da sua atenção</p>
          <div className="space-y-3">
            <div className="flex items-start p-3 rounded-lg bg-amber-50 border-l-4 border-amber-400">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-gray-800">5 solicitações de férias</p>
                <p className="text-sm text-gray-600">Aguardando aprovação</p>
              </div>
            </div>
            <div className="flex items-start p-3 rounded-lg bg-indigo-50 border-l-4 border-indigo-400">
              <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>
              <div>
                <p className="font-semibold text-gray-800">3 documentos vencendo</p>
                <p className="text-sm text-gray-600">Próximos 30 dias</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-2 bg-white p-5 rounded-lg border border-gray-200">
          <div className="flex items-center mb-2">
            <FileTextIcon className="w-5 h-5 text-indigo-600 mr-2" />
            <h3 className="text-lg font-bold text-gray-800">Departamentos</h3>
          </div>
          <p className="text-sm text-gray-500 mb-4">Distribuição por área</p>
          <div className="space-y-4">
            {departmentsData.map(dept => (
              <div key={dept.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                  <span className="text-sm text-gray-500">{dept.count} funcionários</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${(dept.count / dept.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
