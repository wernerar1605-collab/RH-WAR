
import React, { useState, useMemo } from 'react';
import { FileTextIcon, TrendingUpIcon, UsersIcon, DollarSignIcon, ClockIcon } from './icons';

const MetricCard: React.FC<{
    title: string;
    value: string;
    trend: string;
    trendUp: boolean;
    icon: React.ElementType;
}> = ({ title, value, trend, trendUp, icon: Icon }) => (
    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
        <div className="flex items-center text-sm">
            <TrendingUpIcon className={`w-4 h-4 mr-1 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`} />
            <span className={`font-medium ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {trend}
            </span>
            <span className="text-gray-500 ml-1">vs mês anterior</span>
        </div>
    </div>
);

const Reports: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('Todos');
    const [filterStatus, setFilterStatus] = useState('Todos');

    const reportList = [
        { id: 1, name: 'Folha de Pagamento - Maio 2024', type: 'Financeiro', date: '01/05/2024', status: 'Gerado' },
        { id: 2, name: 'Relatório de Absenteísmo Q1', type: 'RH', date: '15/04/2024', status: 'Gerado' },
        { id: 3, name: 'Avaliação de Desempenho Anual', type: 'Performance', date: '10/04/2024', status: 'Pendente' },
        { id: 4, name: 'Relatório de Recrutamento', type: 'Recrutamento', date: '01/04/2024', status: 'Gerado' },
        { id: 5, name: 'Turnover Departamental', type: 'RH', date: '30/03/2024', status: 'Gerado' },
        { id: 6, name: 'Custos Operacionais - RH', type: 'Financeiro', date: '28/03/2024', status: 'Gerado' },
        { id: 7, name: 'Pesquisa de Clima Organizacional', type: 'RH', date: '15/03/2024', status: 'Pendente' },
    ];

    const distributionData = [
        { label: 'Tecnologia', value: 35, color: 'bg-indigo-500' },
        { label: 'Produto', value: 25, color: 'bg-emerald-500' },
        { label: 'Vendas', value: 20, color: 'bg-amber-500' },
        { label: 'RH', value: 10, color: 'bg-rose-500' },
        { label: 'Outros', value: 10, color: 'bg-gray-400' },
    ];

    const reportTypes = ['Todos', 'Financeiro', 'RH', 'Performance', 'Recrutamento'];
    const reportStatuses = ['Todos', 'Gerado', 'Pendente', 'Erro'];

    const filteredReports = useMemo(() => {
        return reportList.filter(report => {
            const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = filterType === 'Todos' || report.type === filterType;
            const matchesStatus = filterStatus === 'Todos' || report.status === filterStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [searchTerm, filterType, filterStatus]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Central de Relatórios</h1>
                <button className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                    <FileTextIcon className="w-5 h-5 mr-2" />
                    Gerar Novo Relatório
                </button>
            </div>

            {/* Filters Section */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wider">Filtros de Pesquisa</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar por nome</label>
                        <div className="relative">
                            <input 
                                type="text"
                                placeholder="Ex: Folha de Pagamento..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
                        <select 
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {reportTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {reportStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    title="Turnover Mensal" 
                    value="2.4%" 
                    trend="-0.5%" 
                    trendUp={true} 
                    icon={UsersIcon} 
                />
                <MetricCard 
                    title="Custo por Contratação" 
                    value="R$ 1.250" 
                    trend="+12%" 
                    trendUp={false} 
                    icon={DollarSignIcon} 
                />
                <MetricCard 
                    title="Tempo Médio de Contratação" 
                    value="18 dias" 
                    trend="-2 dias" 
                    trendUp={true} 
                    icon={ClockIcon} 
                />
                <MetricCard 
                    title="Satisfação Interna (eNPS)" 
                    value="78" 
                    trend="+4 pts" 
                    trendUp={true} 
                    icon={TrendingUpIcon} 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Distribution Chart Simulation */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-1">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Distribuição por Departamento</h3>
                    <div className="space-y-4">
                        {distributionData.map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">{item.label}</span>
                                    <span className="text-gray-900 font-bold">{item.value}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className={`h-2.5 rounded-full ${item.color}`} 
                                        style={{ width: `${item.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reports List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 lg:col-span-2 flex flex-col">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">
                            Resultados ({filteredReports.length})
                        </h3>
                    </div>
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Nome do Relatório</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Tipo</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Data</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    <th className="p-4 text-xs font-semibold text-gray-500 uppercase text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredReports.length > 0 ? (
                                    filteredReports.map((report) => (
                                        <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900 flex items-center">
                                                <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-600">
                                                    <FileTextIcon className="w-4 h-4" />
                                                </div>
                                                {report.name}
                                            </td>
                                            <td className="p-4 text-sm text-gray-600">{report.type}</td>
                                            <td className="p-4 text-sm text-gray-600">{report.date}</td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    report.status === 'Gerado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">Download</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            Nenhum relatório encontrado com os filtros selecionados.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
