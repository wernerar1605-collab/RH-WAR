import React, { useState, useEffect, useMemo } from 'react';
import { Candidate, Job, Stage } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

interface CandidateListProps {
    candidates: Candidate[];
    setCandidates: React.Dispatch<React.SetStateAction<Candidate[]>>;
    jobs: Job[];
    stages: Stage[];
}

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const CandidateList: React.FC<CandidateListProps> = ({ candidates, setCandidates, jobs, stages }) => {
  
  type ModalMode = 'details' | 'edit' | 'create';
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('details');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const emptyCandidate = useMemo<Omit<Candidate, 'id' | 'avatar' | 'resumeSummary'>>(() => ({
    name: '',
    jobId: jobs.length > 0 ? jobs[0].id : 0,
    stageId: stages.length > 0 ? stages[0].id : 0,
    resume: '',
  }), [jobs, stages]);
  
  const [formData, setFormData] = useState(emptyCandidate);

  useEffect(() => {
    if (modalMode === 'edit' && selectedCandidate) {
      setFormData({
        name: selectedCandidate.name,
        jobId: selectedCandidate.jobId,
        stageId: selectedCandidate.stageId,
        resume: selectedCandidate.resume,
      });
    } else {
      setFormData(emptyCandidate);
    }
  }, [modalMode, selectedCandidate, emptyCandidate]);

  const openModal = (mode: ModalMode, candidate: Candidate | null = null) => {
    setModalMode(mode);
    setSelectedCandidate(candidate);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCandidate(null);
  };
  
  const handleDelete = (candidateId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este candidato?')) {
        setCandidates(candidates.filter(c => c.id !== candidateId));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({...prev, [name]: name === 'jobId' || name === 'stageId' ? parseInt(value) : value}));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const base64 = await toBase64(e.target.files[0]);
            setFormData(prev => ({ ...prev, resume: base64 }));
        } catch (err) {
            console.error(err);
        }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
        const newCandidate: Candidate = {
            id: Math.max(...candidates.map(c => c.id).concat(0)) + 1,
            avatar: `https://picsum.photos/seed/${Math.random()}/200`,
            resumeSummary: '',
            ...formData,
        };
        setCandidates([...candidates, newCandidate]);
    } else if (modalMode === 'edit' && selectedCandidate) {
        setCandidates(candidates.map(c => 
            c.id === selectedCandidate.id ? { ...c, ...formData } : c
        ));
    }
    closeModal();
  };

  const getJobTitle = (jobId: number) => jobs.find(j => j.id === jobId)?.title || 'N/A';
  const getStageName = (stageId: number) => stages.find(s => s.id === stageId)?.name || 'N/A';
  
  const getStageColor = (stageId: number) => {
    const stageName = getStageName(stageId)?.toLowerCase();
    if (stageName?.includes('triagem')) return 'bg-sky-100 text-sky-800';
    if (stageName?.includes('entrevista')) return 'bg-amber-100 text-amber-800';
    if (stageName?.includes('oferta')) return 'bg-violet-100 text-violet-800';
    if (stageName?.includes('contratado')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  const renderModalContent = () => {
    if (!selectedCandidate && modalMode !== 'create') return null;

    if (modalMode === 'details') {
      return (
        <div className="p-2">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedCandidate!.name}</h3>
            <p className="text-gray-600 mb-1"><span className="font-semibold">Vaga:</span> {getJobTitle(selectedCandidate!.jobId)}</p>
            <p className="text-gray-600 mb-4"><span className="font-semibold">Etapa:</span> {getStageName(selectedCandidate!.stageId)}</p>
            
            {selectedCandidate!.resume ? (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                     <h4 className="font-semibold text-gray-800 mb-2">Currículo</h4>
                     <a 
                        href={selectedCandidate!.resume} 
                        download={`curriculo_${selectedCandidate!.name.replace(/\s+/g, '_')}`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                     >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Baixar Currículo
                     </a>
                </div>
            ) : (
                <p className="mt-4 text-gray-500 italic">Nenhum currículo anexado.</p>
            )}
        </div>
      );
    }

    if (modalMode === 'create' || modalMode === 'edit') {
        return (
            <form onSubmit={handleFormSubmit} className="p-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'edit' ? 'Editar Candidato' : 'Adicionar Candidato'}</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="jobId" className="block text-sm font-medium text-gray-700">Vaga Aplicada</label>
                        <select name="jobId" id="jobId" value={formData.jobId} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="stageId" className="block text-sm font-medium text-gray-700">Etapa</label>
                        <select name="stageId" id="stageId" value={formData.stageId} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {stages.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Currículo</label>
                        <div className="mt-1 flex items-center">
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx"
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            />
                        </div>
                        {formData.resume && (
                            <p className="mt-2 text-xs text-green-600 flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Arquivo anexado
                            </p>
                        )}
                    </div>
                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Salvar</button>
                </div>
            </form>
        )
    }
  };

  return (
    <>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Pipeline de Candidatos</h2>
          <button onClick={() => openModal('create')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto">
            Adicionar Candidato
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Candidato</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Vaga</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Etapa</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <img src={candidate.avatar} alt={candidate.name} className="h-10 w-10 rounded-full mr-4" />
                      <p className="font-semibold text-gray-900">{candidate.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{getJobTitle(candidate.jobId)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(candidate.stageId)}`}>
                      {getStageName(candidate.stageId)}
                    </span>
                  </td>
                  <td className="p-4 space-x-4 flex items-center">
                    <button onClick={() => openModal('details', candidate)} className="text-indigo-600 hover:text-indigo-900 font-medium">Ver Detalhes</button>
                    <button onClick={() => openModal('edit', candidate)} className="text-gray-500 hover:text-indigo-800"><EditIcon className="w-5 h-5" /></button>
                    <button onClick={() => handleDelete(candidate.id)} className="text-gray-500 hover:text-rose-600"><TrashIcon className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default CandidateList;