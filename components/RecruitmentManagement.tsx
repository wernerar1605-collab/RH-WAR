
import React, { useState } from 'react';
import CandidateList from './CandidateList';
import JobList from './JobList';
import StageList from './StageList';
import HiringProcess from './HiringProcess';
import { Candidate, Job, Stage } from '../types';

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

const RecruitmentManagement: React.FC = () => {
    type Tab = 'candidates' | 'jobs' | 'stages' | 'process';
    const [activeTab, setActiveTab] = useState<Tab>('process');

    const [jobs, setJobs] = useState<Job[]>(mockJobs);
    const [stages, setStages] = useState<Stage[]>(mockStages);
    const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates);

    const TabButton: React.FC<{ tabName: Tab, label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tabName
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'process':
                return <HiringProcess candidates={candidates} jobs={jobs} stages={stages} setCandidates={setCandidates} />;
            case 'candidates':
                return <CandidateList candidates={candidates} setCandidates={setCandidates} jobs={jobs} stages={stages} />;
            case 'jobs':
                return <JobList jobs={jobs} setJobs={setJobs} />;
            case 'stages':
                return <StageList stages={stages} setStages={setStages} />;
            default:
                return <HiringProcess candidates={candidates} jobs={jobs} stages={stages} setCandidates={setCandidates} />;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Recrutamento</h1>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px px-6">
                        <TabButton tabName="process" label="Processo" />
                        <TabButton tabName="candidates" label="Candidatos" />
                        <TabButton tabName="jobs" label="Vagas" />
                        <TabButton tabName="stages" label="Etapas do Processo" />
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