
import React, { useState, useMemo } from 'react';
import { Candidate, Job, Stage } from '../types';
import { FileTextIcon, DownloadIcon, FilterIcon, UsersIcon, BriefcaseIcon, TrendingUpIcon, ChartBarIcon } from './icons';

declare global {
    interface Window {
        html2pdf: any;
    }
}

interface RecruitmentReportsProps {
    candidates: Candidate[];
    jobs: Job[];
    stages: Stage[];
}

const RecruitmentReports: React.FC<RecruitmentReportsProps> = ({ candidates, jobs, stages }) => {
    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedJobId, setSelectedJobId] = useState<string>('all');
    const [selectedStageId, setSelectedStageId] = useState<string>('all');

    // Filter Logic
    const filteredCandidates = useMemo(() => {
        return candidates.filter(candidate => {
            const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesJob = selectedJobId === 'all' 
                ? true 
                : candidate.jobIds.includes(parseInt(selectedJobId));
            
            const matchesStage = selectedStageId === 'all' 
                ? true 
                : candidate.stageId === parseInt(selectedStageId);

            return matchesSearch && matchesJob && matchesStage;
        });
    }, [candidates, searchTerm, selectedJobId, selectedStageId]);

    // Statistics Calculation
    const stats = useMemo(() => {
        const total = filteredCandidates.length;
        
        // Count per stage (Funnel)
        const stageCounts = stages.map(stage => ({
            id: stage.id,
            name: stage.name,
            count: filteredCandidates.filter(c => c.stageId === stage.id).length
        }));

        // Count per Job
        const jobCounts = jobs.map(job => ({
            id: job.id,
            title: job.title,
            count: filteredCandidates.filter(c => c.jobIds.includes(job.id)).length
        })).sort((a, b) => b.count - a.count);

        // Calculate "Hired" count (Assuming last stage is 'Contratado' or based on name)
        const hiredCount = filteredCandidates.filter(c => {
            const stage = stages.find(s => s.id === c.stageId);
            return stage?.name.toLowerCase().includes('contratado');
        }).length;

        const conversionRate = total > 0 ? (hiredCount / total) * 100 : 0;

        return {
            total,
            hiredCount,
            conversionRate,
            stageCounts,
            jobCounts
        };
    }, [filteredCandidates, stages, jobs]);

    const getJobTitles = (candidateJobIds: number[]) => {
        return jobs.filter(j => candidateJobIds.includes(j.id)).map(j => j.title).join(', ');
    };

    const getStageName = (stageId: number) => {
        return stages.find(s => s.id === stageId)?.name || 'N/A';
    };

    const handleExportCSV = () => {
        const headers = ["ID", "Nome", "Vagas Aplicadas", "Etapa Atual"];
        const rows = filteredCandidates.map(c => [
            c.id,
            `"${c.name}"`,
            `"${getJobTitles(c.jobIds)}"`,
            `"${getStageName(c.stageId)}"`
        ]);

        const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio_recrutamento.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleGeneratePDF = () => {
        const element = document.getElementById('recruitment-report-container');
        if (!element) return;

        const opt = {
            margin: 10,
            filename: `Relatorio_Recrutamento_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`,
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

    return (
        <div id="recruitment-report-container" className="space-y-6 animate-fade-in-up p-2 bg-white sm:bg-transparent">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Relatórios de Recrutamento</h2>
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar Candidato</label>
                        <input 
                            type="text" 
                            placeholder="Nome do candidato..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Vaga</label>
                        <select 
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todas as Vagas</option>
                            {jobs.map(job => (
                                <option key={job.id} value={job.id.toString()}>{job.title}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Filtrar por Etapa</label>
                        <select 
                            value={selectedStageId}
                            onChange={(e) => setSelectedStageId(e.target.value)}
                            className="block w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Todas as Etapas</option>
                            {stages.map(stage => (
                                <option key={stage.id} value={stage.id.toString()}>{stage.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Print Header */}
             <div className="hidden print:block mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Relatório de Recrutamento - RH-WAR</h1>
                <p className="text-gray-500">Gerado em {new Date().toLocaleDateString()}</p>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Candidatos</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                            <p className="text-xs text-gray-400 mt-1">no filtro atual</p>
                        </div>
                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 print:bg-gray-100">
                            <UsersIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total de Contratados</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.hiredCount}</h3>
                            <p className="text-xs text-gray-400 mt-1">neste período</p>
                        </div>
                        <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 print:bg-gray-100">
                            <BriefcaseIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm print:border-gray-300">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Taxa de Conversão</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.conversionRate.toFixed(1)}%</h3>
                            <p className="text-xs text-gray-400 mt-1">candidatos para contratados</p>
                        </div>
                        <div className="p-2 bg-amber-50 rounded-lg text-amber-600 print:bg-gray-100">
                            <TrendingUpIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print:grid-cols-2">
                {/* Funnel Chart */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:break-inside-avoid">
                    <div className="flex items-center mb-6">
                         <ChartBarIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        <h3 className="text-lg font-bold text-gray-800">Funil de Contratação</h3>
                    </div>
                    <div className="space-y-3">
                        {stats.stageCounts.map((stage) => (
                            <div key={stage.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-700 font-medium">{stage.name}</span>
                                    <span className="text-gray-900 font-bold">{stage.count}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden print:border print:border-gray-200">
                                    <div 
                                        className="bg-indigo-500 h-3 rounded-full print:bg-gray-800" 
                                        style={{ width: `${stats.total > 0 ? (stage.count / stats.total) * 100 : 0}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Distribution */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm print:break-inside-avoid">
                     <div className="flex items-center mb-6">
                         <BriefcaseIcon className="w-5 h-5 mr-2 text-indigo-600" />
                        <h3 className="text-lg font-bold text-gray-800">Candidatos por Vaga</h3>
                    </div>
                    <div className="space-y-4 overflow-y-auto max-h-[300px]">
                        {stats.jobCounts.map((job) => (
                            <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <span className="text-sm font-medium text-gray-700 truncate mr-2">{job.title}</span>
                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                                    {job.count}
                                </span>
                            </div>
                        ))}
                         {stats.jobCounts.length === 0 && <p className="text-gray-500 text-sm">Nenhuma vaga encontrada.</p>}
                    </div>
                </div>
            </div>

            {/* Detailed Table */}
            <div className="mt-8 break-before-page" style={{ pageBreakBefore: 'always' }}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Listagem Detalhada</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse bg-white rounded-lg border border-gray-200 print:border-0">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 print:bg-gray-100">
                                <th className="p-3 font-semibold text-gray-700">Candidato</th>
                                <th className="p-3 font-semibold text-gray-700">Vagas Aplicadas</th>
                                <th className="p-3 font-semibold text-gray-700">Etapa Atual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCandidates.map(candidate => (
                                <tr key={candidate.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-3">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-gray-200 mr-2 overflow-hidden flex-shrink-0">
                                                 <img src={candidate.avatar} alt="" className="h-full w-full object-cover" />
                                            </div>
                                            <span className="font-medium text-gray-900">{candidate.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-3 text-gray-600">
                                        {getJobTitles(candidate.jobIds)}
                                    </td>
                                    <td className="p-3">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                                            {getStageName(candidate.stageId)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {filteredCandidates.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="p-6 text-center text-gray-500">
                                        Nenhum candidato encontrado com os filtros selecionados.
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

export default RecruitmentReports;
