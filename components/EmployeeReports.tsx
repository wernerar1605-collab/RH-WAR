
import React, { useState, useMemo } from 'react';
import { Employee } from '../types';
import { FileTextIcon, UsersIcon, DollarSignIcon, ChartBarIcon, TrendingUpIcon, FilterIcon, DownloadIcon } from './icons';

declare global {
    interface Window {
        html2pdf: any;
    }
}

interface EmployeeReportsProps {
    employees: Employee[];
}

const EmployeeReports: React.FC<EmployeeReportsProps> = ({ employees }) => {
    
    // Filters State
    const [selectedDept, setSelectedDept] = useState<string>('Todos');
    const [selectedContract, setSelectedContract] = useState<string>('Todos');
    const [selectedStatus, setSelectedStatus] = useState<string>('Todos');

    // Extract unique values for filters
    const departments = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.department))).sort()], [employees]);
    const contracts = useMemo(() => ['Todos', ...Array.from(new Set(employees.map(e => e.regimeDeTrabalho))).sort()], [employees]);
    
    // Filtered Data
    const filteredEmployees = useMemo(() => {
        return employees.filter(emp => {
            const matchDept = selectedDept === 'Todos' || emp.department === selectedDept;
            const matchContract = selectedContract === 'Todos' || emp.regimeDeTrabalho === selectedContract;
            const matchStatus = selectedStatus === 'Todos' || emp.status === selectedStatus;
            return matchDept && matchContract && matchStatus;
        });
    }, [employees, selectedDept, selectedContract, selectedStatus]);

    const stats = useMemo(() => {
        const total = filteredEmployees.length;
        const active = filteredEmployees.filter(e => e.status === 'Ativo').length;
        const inactive = filteredEmployees.filter(e => e.status === 'Inativo').length;
        
        const parseSalary = (salaryStr: string) => {
            // Remove thousands separators (.) and replace decimal separator (,) with (.)
            return parseFloat(salaryStr.replace(/\./g, '').replace(',', '.')) || 0;
        };

        const totalSalary = filteredEmployees
            .filter(e => e.status === 'Ativo')
            .reduce((acc, curr) => acc + parseSalary(curr.salario), 0);

        const avgSalary = active > 0 ? totalSalary / active : 0;

        // Group by Department
        const byDept = filteredEmployees.reduce((acc, curr) => {
            const dept = curr.department;
            acc[dept] = (acc[dept] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Group by Contract
        const byContract = filteredEmployees.reduce((acc, curr) => {
            const contract = curr.regimeDeTrabalho;
            acc[contract] = (acc[contract] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            active,
            inactive,
            totalSalary,
            avgSalary,
            byDept: Object.entries(byDept).sort((a, b) => (b[1] as number) - (a[1] as number)),
            byContract: Object.entries(byContract).sort((a, b) => (b[1] as number) - (a[1] as number)),
        };
    }, [filteredEmployees]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Nome", "Cargo", "Departamento", "Admissão", "Salário", "Regime", "Status"];
        const rows = filteredEmployees.map(emp => [
            emp.id,
            `"${emp.name}"`,
            `"${emp.role}"`,
            `"${emp.department}"`,
            emp.dataDeAdmissao,
            `"${emp.salario}"`,
            emp.regimeDeTrabalho,
            emp.status
        ]);
        
        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio_funcionarios.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGeneratePDF = () => {
        const element = document.getElementById('report-container');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `Relatorio_Pessoal_RH-WAR_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
        };

        if (window.html2pdf) {
            window.html2pdf().set(opt).from(element).save();
        } else {
            // Fallback to native print if library fails to load
            window.print();
        }
    };

    return (
        <div id="report-container" className="space-y-6 animate-fade-in-up p-2 bg-white sm:bg-transparent">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Relatórios de Pessoal</h2>
                <div className="flex gap-3" data-html2canvas-ignore="true">
                    <button 
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                        onClick={handleExportCSV}
                    >
                        <DownloadIcon className="w-4 h-4" />
                        Exportar Dados
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

            {/* Filters Section */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:hidden">
                <div className="flex items-center mb-4 text-indigo-700">
                    <FilterIcon className="w-5 h-5 mr-2" />
                    <h3 className="font-semibold">Personalizar Relatório</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                        <select 
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Regime de Contrato</label>
                        <select 
                            value={selectedContract}
                            onChange={(e) => setSelectedContract(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            {contracts.map(contract => (
                                <option key={contract} value={contract}>{contract}</option>
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
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {/* Print Header - Visible only when printing or generating PDF */}
            <div className="hidden print:block mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório de Pessoal - RH-WAR</h1>
                <p className="text-gray-500">Gerado em {new Date().toLocaleDateString()}</p>
                <div className="mt-4 text-sm text-gray-600 border-t pt-2">
                    Filtros aplicados: Departamento: <b>{selectedDept}</b> | Contrato: <b>{selectedContract}</b> | Status: <b>{selectedStatus}</b>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 print:grid-cols-2">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Funcionários Ativos (Filtro)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.active}</h3>
                            <p className="text-xs text-gray-400 mt-1">de {stats.total} filtrados</p>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 print:bg-gray-100">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total da Folha (Filtro)</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.totalSalary)}</h3>
                            <p className="text-xs text-gray-400 mt-1">Mensal</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 print:bg-gray-100">
                            <DollarSignIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Média Salarial</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(stats.avgSalary)}</h3>
                            <p className="text-xs text-gray-400 mt-1">por funcionário ativo</p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600 print:bg-gray-100">
                            <TrendingUpIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Turnover / Inativos</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.inactive}</h3>
                            <p className="text-xs text-gray-400 mt-1">funcionários desligados</p>
                        </div>
                        <div className="p-2 bg-rose-50 rounded-lg text-rose-600 print:bg-gray-100">
                            <ChartBarIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
                {/* Department Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:break-inside-avoid">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Distribuição por Departamento</h3>
                    <div className="space-y-4">
                        {stats.byDept.map(([dept, count]) => (
                            <div key={dept}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 font-medium">{dept}</span>
                                    <span className="text-gray-500">{count} ({stats.total > 0 ? Math.round((count / stats.total) * 100) : 0}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden print:border print:border-gray-200">
                                    <div 
                                        className="bg-indigo-500 h-2.5 rounded-full print:bg-gray-800" 
                                        style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        {stats.byDept.length === 0 && <p className="text-gray-500 text-sm">Nenhum dado para exibir.</p>}
                    </div>
                </div>

                {/* Contract Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:break-inside-avoid">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Regime de Contratação</h3>
                    <div className="flex flex-col justify-center h-full pb-6">
                        {stats.byContract.map(([contract, count]) => (
                            <div key={contract} className="flex items-center py-3 border-b border-gray-50 last:border-0">
                                <div className="w-full flex justify-between items-center">
                                    <div className="flex items-center">
                                        <div className={`w-3 h-3 rounded-full mr-3 ${
                                            contract === 'CLT' ? 'bg-indigo-500' : 
                                            contract === 'PJ' ? 'bg-emerald-500' : 
                                            contract === 'Estágio' ? 'bg-amber-500' : 'bg-gray-400'
                                        } print:bg-gray-800`}></div>
                                        <span className="text-gray-700 font-medium">{contract}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-gray-900 font-bold mr-2">{count}</span>
                                        <span className="text-xs text-gray-400">funcionários</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                         {stats.byContract.length === 0 && <p className="text-gray-500 text-sm">Nenhum dado para exibir.</p>}
                    </div>
                </div>
            </div>

            {/* Detailed list - Visible on PDF/Print for reference */}
            <div className="mt-8 break-before-page" style={{ pageBreakBefore: 'always' }}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Listagem Detalhada</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse bg-white rounded-lg border border-gray-200 print:border-0">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                                <th className="p-3 font-semibold text-gray-700">Nome</th>
                                <th className="p-3 font-semibold text-gray-700">Cargo</th>
                                <th className="p-3 font-semibold text-gray-700">Departamento</th>
                                <th className="p-3 font-semibold text-gray-700">Regime</th>
                                <th className="p-3 font-semibold text-gray-700">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map(emp => (
                                <tr key={emp.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3">{emp.name}</td>
                                    <td className="p-3">{emp.role}</td>
                                    <td className="p-3">{emp.department}</td>
                                    <td className="p-3">{emp.regimeDeTrabalho}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${emp.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} print:bg-transparent print:text-black print:p-0`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EmployeeReports;
