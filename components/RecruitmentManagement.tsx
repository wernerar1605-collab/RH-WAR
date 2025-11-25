import React, { useState } from 'react';
import CandidateList from './CandidateList';
import JobList from './JobList';
import StageList from './StageList';
import HiringProcess from './HiringProcess';
import { Candidate, Job, Stage } from '../types';

const mockJobs: Job[] = [
    { id: 1, title: 'Desenvolvedor Frontend', department: 'Tecnologia', description: 'Desenvolvimento de interfaces modernas com React.', status: 'Aberto' },
    { id: 2, title: 'Designer UX/UI', department: 'Produto', description: 'Criação de experiências de usuário intuitivas.', status: 'Aberto' },
    { id: 3, title: 'Tech Lead', department: 'Tecnologia', description: 'Liderança técnica da equipe de desenvolvimento.', status: 'Aberto' },
];

const mockStages: Stage[] = [
    { id: 1, name: 'Triagem' },
    { id: 2, name: 'Entrevista Inicial' },
    { id: 3, name: 'Desafio Técnico' },
    { id: 4, name: 'Entrevista Final' },
    { id: 5, name: 'Oferta' },
    { id: 6, name: 'Contratado' },
];

const mockCandidates: Candidate[] = [
    { id: 1, name: 'Lucas Mendes', jobId: 1, stageId: 2, resumeSummary: '', avatar: 'https://picsum.photos/seed/lucas/200', resume: '' },
    { id: 2, name: 'Fernanda Oliveira', jobId: 2, stageId: 3, resumeSummary: '', avatar: 'https://picsum.photos/seed/fernanda/200', resume: '' },
    { id: 3, name: 'Paulo Souza', jobId: 1, stageId: 1, resumeSummary: '', avatar: 'https://picsum.photos/seed/paulo/200', resume: '' },
    { id: 4, name: 'Juliana Costa', jobId: 3, stageId: 4, resumeSummary: '', avatar: 'https://picsum.photos/seed/juliana/200', resume: '' },
];

const RecruitmentManagement: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'candidates' | 'board' | 'jobs' | 'stages'>('board');
    const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);
    const [jobs, setJobs] = useState<Job[]>(mockJobs);
    const [stages, setStages] = useState<Stage[]>(mockStages);

    const renderContent = () => {
        switch (activeTab) {
            case 'candidates':
                return <CandidateList candidates={candidates} setCandidates={setCandidates} jobs={jobs} stages={stages} />;
            case 'board':
                return <HiringProcess candidates={candidates} setCandidates={setCandidates} jobs={jobs} stages={stages} />;
            case 'jobs':
                return <JobList jobs={jobs} setJobs={setJobs} />;
            case 'stages':
                return <StageList stages={stages} setStages={setStages} />;
            default:
                return <HiringProcess candidates={candidates} setCandidates={setCandidates} jobs={jobs} stages={stages} />;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Recrutamento e Seleção</h1>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px px-6 gap-6">
                         <button
                            onClick={() => setActiveTab('board')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'board'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Quadro Kanban
                        </button>
                        <button
                            onClick={() => setActiveTab('candidates')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'candidates'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Candidatos
                        </button>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'jobs'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Vagas
                        </button>
                        <button
                            onClick={() => setActiveTab('stages')}
                            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === 'stages'
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            Etapas
                        </button>
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default RecruitmentManagement;