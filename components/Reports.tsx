
import React from 'react';
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
    const reportList = [
        { id: 1, name: 'Folha de Pagamento - Maio 2024', type: 'Financeiro', date: '01/05/2024', status: 'Gerado' },
        { id: 2, name: 'Relatório de Absenteísmo Q1', type: 'RH', date: '15/04/2024', status: 'Gerado' },
        { id: 3, name: 'Avaliação de Desempenho Anual', type: 'Performance', date: '10/04/2024', status: 'Pendente' },
        { id: 4, name: 'Relatório de Recrutamento', type: 'Recrutamento', date: '01/04/2024', status: 'Gerado' },
        { id: 5, name: 'Turnover Departamental', type: 'RH', date: '30/03/2024', status: 'Gerado' },
    ];

    const distributionData = [
        { label: 'Tecnologia', value: 35, color: 'bg-indigo-500' },
        { label: 'Produto', value: 25, color: 'bg-emerald-500' },
        { label: 'Vendas', value: 20, color: 'bg-amber-500' },
        { label: 'RH', value: 10, color: 'bg-rose-500' },
        { label: 'Outros', value: 10, color: 'bg-gray-400' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Central de Relatórios</h1>
                <button className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center">
                    <FileTextIcon className="w-5 h-5 mr-2" />
                    Gerar Novo Relatório
                </button>
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
                        <h3 className="text-lg font-bold text-gray-800">Relatórios Recentes</h3>
                        <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Ver todos</button>
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
                                {reportList.map((report) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
