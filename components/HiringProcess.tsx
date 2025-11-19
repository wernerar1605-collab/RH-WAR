import React, { useState, useMemo } from 'react';
import { Candidate, Job, Stage } from '../types';

interface HiringProcessProps {
    candidates: Candidate[];
    jobs: Job[];
    stages: Stage[];
    setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
}

const HiringProcess: React.FC<HiringProcessProps> = ({ candidates, jobs, stages, setCandidates }) => {
    const [selectedJobId, setSelectedJobId] = useState<number | 'all'>('all');
    const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);
    const [dragOverStageId, setDragOverStageId] = useState<number | null>(null);

    const filteredCandidates = useMemo(() => {
        if (selectedJobId === 'all') {
            return candidates;
        }
        return candidates.filter(c => c.jobId === selectedJobId);
    }, [candidates, selectedJobId]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, candidateId: number) => {
        e.dataTransfer.setData('candidateId', candidateId.toString());
        setDraggedCandidateId(candidateId);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDragEnter = (stageId: number) => {
        setDragOverStageId(stageId);
    };

    const handleDragLeave = () => {
        setDragOverStageId(null);
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStageId: number) => {
        e.preventDefault();
        const candidateId = parseInt(e.dataTransfer.getData('candidateId'));
        if (candidateId) {
             setCandidates(prevCandidates =>
                prevCandidates.map(c =>
                    c.id === candidateId ? { ...c, stageId: targetStageId } : c
                )
            );
        }
        setDraggedCandidateId(null);
        setDragOverStageId(null);
    };
    
    const handleDragEnd = () => {
        setDraggedCandidateId(null);
        setDragOverStageId(null);
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Processo de Contratação</h2>
                <div className="flex items-center gap-2">
                    <label htmlFor="jobFilter" className="text-sm font-medium text-gray-600">Filtrar por Vaga:</label>
                    <select
                        id="jobFilter"
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                        className="bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Todas as Vagas</option>
                        {jobs.filter(j => j.status === 'Aberto').map(job => (
                            <option key={job.id} value={job.id}>{job.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
                {stages.map(stage => (
                    <div 
                        key={stage.id} 
                        className={`w-72 bg-gray-100 rounded-lg p-3 flex-shrink-0 transition-colors duration-200 ${dragOverStageId === stage.id ? 'bg-indigo-100' : ''}`}
                        onDragOver={handleDragOver}
                        onDragEnter={() => handleDragEnter(stage.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, stage.id)}
                    >
                        <h3 className="font-bold text-gray-700 mb-4 text-center">{stage.name} ({filteredCandidates.filter(c => c.stageId === stage.id).length})</h3>
                        <div className="space-y-3 min-h-[100px]">
                            {filteredCandidates
                                .filter(candidate => candidate.stageId === stage.id)
                                .map(candidate => (
                                    <div 
                                        key={candidate.id} 
                                        className={`bg-white p-3 rounded-md shadow border border-gray-200 cursor-grab hover:shadow-lg transition-shadow ${draggedCandidateId === candidate.id ? 'opacity-50 ring-2 ring-indigo-600' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, candidate.id)}
                                        onDragEnd={handleDragEnd}
                                    >
                                        <div className="flex items-center">
                                            <img src={candidate.avatar} alt={candidate.name} className="h-9 w-9 rounded-full mr-3" />
                                            <div>
                                                <p className="font-semibold text-sm text-gray-900">{candidate.name}</p>
                                                {selectedJobId === 'all' && (
                                                    <p className="text-xs text-gray-500">{jobs.find(j => j.id === candidate.jobId)?.title || 'Vaga não encontrada'}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {filteredCandidates.filter(candidate => candidate.stageId === stage.id).length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-sm text-gray-400 text-center py-4">Nenhum candidato.</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HiringProcess;