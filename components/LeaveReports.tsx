
import React, { useState, useMemo } from 'react';
import { LeaveRequest, Employee, LeaveType } from '../types';
import { FileTextIcon, DownloadIcon, FilterIcon, CalendarIcon, CheckCircleIcon, AlertTriangleIcon, TrendingUpIcon, ChartBarIcon } from './icons';

declare global {
    interface Window {
        html2pdf: any;
    }
}

interface LeaveReportsProps {
    requests: LeaveRequest[];
    employees: Employee[];
}

const LeaveReports: React.FC<LeaveReportsProps> = ({ requests, employees }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('Todos');
    const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

    // Extract unique types
    const leaveTypes: LeaveType[] = ['Férias', 'Licença médica', 'Home Office', 'Viagem de Trabalho', 'Pessoal'];
    
    // Filter Logic
    const filteredRequests = useMemo(() => {
        return requests.filter(req => {
            const matchesSearch = req.employee.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = selectedType === 'Todos' || req.type === selectedType;
            const matchesStatus = selectedStatus === 'Todos' || req.status === selectedStatus;
            return matchesSearch && matchesType && matchesStatus;
        });
    }, [requests, searchTerm, selectedType, selectedStatus]);

    // Statistics
    const stats = useMemo(() => {
        const total = filteredRequests.length;
        const pending = filteredRequests.filter(r => r.status === 'Pendente').length;
        const approved = filteredRequests.filter(r => r.status === 'Aprovada').length;
        const rejected = filteredRequests.filter(r => r.status === 'Rejeitada').length;
        
        const approvalRate = total > 0 ? (approved / (approved + rejected || 1)) * 100 : 0;

        // Group by Type
        const byType = leaveTypes.map(type => ({
            name: type,
            count: filteredRequests.filter(r => r.type === type).length
        })).sort((a, b) => b.count - a.count);

        return {
            total,
            pending,
            approved,
            rejected,
            approvalRate,
            byType
        };
    }, [filteredRequests, leaveTypes]);

    const handleExportCSV = () => {
        const headers = ["ID", "Funcionário", "Tipo", "Início", "Fim", "Status"];
        const rows = filteredRequests.map(req => [
            req.id,
            `"${req.employee.name}"`,
            `"${req.type}"`,
            req.startDate,
            req.endDate,
            req.status
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio_licencas.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGeneratePDF = () => {
        const element = document.getElementById('leave-report-container');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `Relatorio_Licencas_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            window.print();
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Aprovada': return 'bg-emerald-100 text-emerald-800';
            case 'Rejeitada': return 'bg-rose-100 text-rose-800';
            default: return 'bg-amber-100 text-amber-800';
        }
    };

    return (
        <div id="leave-report-container" className="space-y-6 animate-fade-in-up p-2 bg-white sm:bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Relatórios de Licenças</h2>
                <div className="flex gap-3" data-html2canvas-ignore="true">
                    <button 
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        onClick={handleExportCSV}
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Exportar CSV
                    </button>
                    <button 
                        className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium text-sm"
                        onClick={handleGeneratePDF}
                    >
                        <FileTextIcon className="w-4 h-4" />
                        Gerar PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:hidden">
                <div className="flex items-center mb-4 text-indigo-700">
                    <FilterIcon className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold">Filtros de Pesquisa</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Funcionário</label>
                        <input 
                            type="text" 
                            placeholder="Buscar por nome..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Licença</label>
                        <select 
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Todos">Todos</option>
                            {leaveTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select 
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Todos">Todos</option>
                            <option value="Pendente">Pendente</option>
                            <option value="Aprovada">Aprovada</option>
                            <option value="Rejeitada">Rejeitada</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Print Header */}
             <div className="hidden print:block mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório de Licenças e Férias - RH-WAR</h1>
                <p className="text-gray-500">Gerado em {new Date().toLocaleDateString()}</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Solicitações</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 print:bg-gray-100">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Pendentes</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600 print:bg-gray-100">
                            <AlertTriangleIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Aprovadas</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.approved}</h3>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 print:bg-gray-100">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Taxa de Aprovação</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.approvalRate.toFixed(1)}%</h3>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600 print:bg-gray-100">
                            <TrendingUpIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:break-inside-avoid">
                     <div className="flex items-center mb-6">
                         <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        <h3 className="text-lg font-bold text-gray-800">Solicitações por Tipo</h3>
                    </div>
                    <div className="space-y-4">
                        {stats.byType.map((item) => (
                            <div key={item.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 font-medium">{item.name}</span>
                                    <span className="text-gray-900 font-bold">{item.count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden print:border print:border-gray-200">
                                    <div 
                                        className="bg-indigo-500 h-3 rounded-full print:bg-gray-800" 
                                        style={{ width: `${stats.total > 0 ? (item.count / stats.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:break-inside-avoid">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Status das Solicitações</h3>
                    <div className="flex items-center justify-center h-48 space-x-8">
                         <div className="text-center">
                             <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-2 text-amber-600 font-bold text-xl border-4 border-amber-200">
                                 {stats.pending}
                             </div>
                             <span className="text-sm font-medium text-gray-600">Pendentes</span>
                         </div>
                         <div className="text-center">
                             <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2 text-emerald-600 font-bold text-xl border-4 border-emerald-200">
                                 {stats.approved}
                             </div>
                             <span className="text-sm font-medium text-gray-600">Aprovadas</span>
                         </div>
                         <div className="text-center">
                             <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-2 text-rose-600 font-bold text-xl border-4 border-rose-200">
                                 {stats.rejected}
                             </div>
                             <span className="text-sm font-medium text-gray-600">Rejeitadas</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="mt-8 break-before-page" style={{ pageBreakBefore: 'always' }}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Detalhamento das Solicitações</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse bg-white rounded-lg border border-gray-200 print:border-0">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                                <th className="p-3 font-semibold text-gray-700">Funcionário</th>
                                <th className="p-3 font-semibold text-gray-700">Tipo</th>
                                <th className="p-3 font-semibold text-gray-700">Período</th>
                                <th className="p-3 font-semibold text-gray-700">Duração</th>
                                <th className="p-3 font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map(req => {
                                const start = new Date(req.startDate);
                                const end = new Date(req.endDate);
                                const diffTime = Math.abs(end.getTime() - start.getTime());
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 

                                return (
                                    <tr key={req.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="p-3">
                                            <div className="flex items-center">
                                                <div className="h-6 w-6 rounded-full bg-gray-200 mr-2 overflow-hidden flex-shrink-0">
                                                    <img src={req.employee.avatar} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <span className="font-medium text-gray-900">{req.employee.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-600">{req.type}</td>
                                        <td className="p-3 text-gray-600">
                                            {new Date(req.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} - {new Date(req.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="p-3 text-gray-600">{diffDays} dias</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(req.status)} print:bg-transparent print:text-black print:p-0`}>
                                                {req.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredRequests.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">
                                        Nenhuma solicitação encontrada com os filtros selecionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LeaveReports;
