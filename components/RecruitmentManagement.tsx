
import React, { useState } from 'react';
import CandidateList from './CandidateList';
import JobList from './JobList';
import StageList from './StageList';
import HiringProcess from './HiringProcess';
import RecruitmentReports from './RecruitmentReports';
import { Candidate, Job, Stage } from '../types';
import { LayoutIcon, ListIcon } from './icons';

interface RecruitmentManagementProps {
    jobs: Job[];
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    stages: Stage[];
    setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
    candidates: Candidate[];
    setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

const RecruitmentManagement: React.FC<RecruitmentManagementProps> = ({ 
    jobs, 
    setJobs, 
    stages, 
    setStages, 
    candidates, 
    setCandidates 
}) => {
    type Tab = 'candidates' | 'jobs' | 'stages' | 'reports';
    type ViewMode = 'board' | 'list';
    
    const [activeTab, setActiveTab] = useState<Tab>('candidates');
    const [viewMode, setViewMode] = useState<ViewMode>('board');

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
            case 'candidates':
                return (
                    <div className="space-y-4">
                        <div className="flex justify-end">
                            <div className="bg-gray-100 p-1 rounded-lg inline-flex items-center space-x-1">
                                <button
                                    onClick={() => setViewMode('board')}
                                    className={`p-2 rounded-md flex items-center transition-all ${viewMode === 'board' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Visualização em Quadro"
                                >
                                    <LayoutIcon className="w-5 h-5 mr-2" />
                                    <span className="text-sm font-medium">Quadro</span>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md flex items-center transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                                    title="Visualização em Lista"
                                >
                                    <ListIcon className="w-5 h-5 mr-2" />
                                    <span className="text-sm font-medium">Lista</span>
                                </button>
                            </div>
                        </div>
                        {viewMode === 'board' ? (
                            <HiringProcess candidates={candidates} jobs={jobs} stages={stages} setCandidates={setCandidates} />
                        ) : (
                            <CandidateList candidates={candidates} setCandidates={setCandidates} jobs={jobs} stages={stages} />
                        )}
                    </div>
                );
            case 'jobs':
                return <JobList jobs={jobs} setJobs={setJobs} />;
            case 'stages':
                return <StageList stages={stages} setStages={setStages} />;
            case 'reports':
                return <RecruitmentReports candidates={candidates} jobs={jobs} stages={stages} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Recrutamento</h1>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px px-6">
                        <TabButton tabName="candidates" label="Candidatos" />
                        <TabButton tabName="jobs" label="Vagas" />
                        <TabButton tabName="stages" label="Etapas do Processo" />
                        <TabButton tabName="reports" label="Relatórios" />
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
