
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Candidate, Job, Stage } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon, FileTextIcon, XIcon, ProfileIcon } from './icons';

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
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [filterStageId, setFilterStageId] = useState<number | 'all'>('all');

  const emptyCandidate = useMemo<Omit<Candidate, 'id'>>(() => ({
    name: '',
    jobIds: [],
    stageId: stages.length > 0 ? stages[0].id : 0,
    resume: '',
    resumeName: '',
    avatar: ''
  }), [stages]);
  
  const [formData, setFormData] = useState(emptyCandidate);

  useEffect(() => {
    if (modalMode === 'edit' && selectedCandidate) {
      setFormData({
        name: selectedCandidate.name,
        jobIds: selectedCandidate.jobIds,
        stageId: selectedCandidate.stageId,
        resume: selectedCandidate.resume || '',
        resumeName: selectedCandidate.resumeName || '',
        avatar: selectedCandidate.avatar || ''
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
    setFormData(prev => ({...prev, [name]: name === 'stageId' ? parseInt(value) : value}));
  };

  const handleAddJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jobId = parseInt(e.target.value);
    if (!isNaN(jobId) && !formData.jobIds.includes(jobId)) {
        setFormData(prev => ({ ...prev, jobIds: [...prev.jobIds, jobId] }));
    }
  };

  const handleRemoveJob = (jobId: number) => {
    setFormData(prev => ({ ...prev, jobIds: prev.jobIds.filter(id => id !== jobId) }));
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const file = e.target.files[0];
              const base64 = await toBase64(file);
              setFormData(prev => ({ 
                  ...prev, 
                  resume: base64,
                  resumeName: file.name
              }));
          } catch (error) {
              console.error("Error processing file", error);
          }
      }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          try {
              const file = e.target.files[0];
              const base64 = await toBase64(file);
              setFormData(prev => ({ 
                  ...prev, 
                  avatar: base64
              }));
          } catch (error) {
              console.error("Error processing photo", error);
          }
      }
  };

  const handleRemoveResume = () => {
      setFormData(prev => ({ ...prev, resume: '', resumeName: '' }));
      if (resumeInputRef.current) {
          resumeInputRef.current.value = '';
      }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
        const newCandidate: Candidate = {
            id: Math.max(...candidates.map(c => c.id).concat(0)) + 1,
            ...formData,
            avatar: formData.avatar || `https://picsum.photos/seed/${Math.random()}/200`,
        };
        setCandidates([...candidates, newCandidate]);
    } else if (modalMode === 'edit' && selectedCandidate) {
        setCandidates(candidates.map(c => 
            c.id === selectedCandidate.id ? { ...c, ...formData } : c
        ));
    }
    closeModal();
  };

  const getJobTitles = (jobIds: number[]) => {
      if (!jobIds || jobIds.length === 0) return 'Nenhuma vaga selecionada';
      const titles = jobIds.map(id => jobs.find(j => j.id === id)?.title || 'N/A');
      return titles.join(', ');
  };

  const getStageName = (stageId: number) => stages.find(s => s.id === stageId)?.name || 'N/A';
  
  const getStageColor = (stageId: number) => {
    const stageName = getStageName(stageId)?.toLowerCase();
    if (stageName?.includes('triagem')) return 'bg-sky-100 text-sky-800';
    if (stageName?.includes('entrevista')) return 'bg-amber-100 text-amber-800';
    if (stageName?.includes('oferta')) return 'bg-violet-100 text-violet-800';
    if (stageName?.includes('contratado')) return 'bg-emerald-100 text-emerald-800';
    return 'bg-gray-100 text-gray-800';
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (filterStageId === 'all') return true;
    return candidate.stageId === filterStageId;
  });

  const renderModalContent = () => {
    if (!selectedCandidate && modalMode !== 'create') return null;

    if (modalMode === 'details') {
      return (
        <div className="p-2">
            <div className="flex items-center gap-4 mb-6">
                 <img src={selectedCandidate!.avatar} alt={selectedCandidate!.name} className="h-16 w-16 rounded-full object-cover" />
                 <div>
                     <h3 className="text-2xl font-bold text-gray-900">{selectedCandidate!.name}</h3>
                     <p className="text-gray-600">{getJobTitles(selectedCandidate!.jobIds)}</p>
                 </div>
            </div>
            
            <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                     <p className="text-sm text-gray-500 uppercase font-semibold mb-1">Status do Processo</p>
                     <p className="font-medium text-gray-900">{getStageName(selectedCandidate!.stageId)}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 uppercase font-semibold mb-2">Currículo</p>
                    {selectedCandidate!.resume ? (
                        <a 
                            href={selectedCandidate!.resume} 
                            download={selectedCandidate!.resumeName || "curriculo.pdf"}
                            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            <FileTextIcon className="w-5 h-5 mr-2" />
                            {selectedCandidate!.resumeName || "Baixar Currículo"}
                        </a>
                    ) : (
                        <p className="text-gray-400 italic">Nenhum currículo anexado.</p>
                    )}
                </div>
            </div>
        </div>
      );
    }

    if (modalMode === 'create' || modalMode === 'edit') {
        const availableJobs = jobs.filter(job => !formData.jobIds.includes(job.id) && job.status === 'Aberto');

        return (
            <form onSubmit={handleFormSubmit} className="p-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'edit' ? 'Editar Candidato' : 'Adicionar Candidato'}</h3>
                
                <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden border">
                        {formData.avatar ? (
                            <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            <ProfileIcon className="w-12 h-12 text-gray-400" />
                        )}
                    </div>
                    <input 
                        type="file" 
                        ref={photoInputRef} 
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => photoInputRef.current?.click()}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                        {formData.avatar ? 'Alterar Foto' : 'Adicionar Foto'}
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vagas Aplicadas</label>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                            {formData.jobIds.map(jobId => {
                                const job = jobs.find(j => j.id === jobId);
                                return (
                                    <span key={jobId} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                                        {job?.title}
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemoveJob(jobId)}
                                            className="ml-1.5 inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600 focus:outline-none"
                                        >
                                            <XIcon className="h-4 w-4" />
                                        </button>
                                    </span>
                                );
                            })}
                             {formData.jobIds.length === 0 && (
                                <span className="text-sm text-gray-400 italic">Nenhuma vaga selecionada</span>
                            )}
                        </div>

                        <select 
                            onChange={handleAddJob}
                            value="" 
                            className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            disabled={availableJobs.length === 0}
                        >
                            <option value="" disabled>
                                {availableJobs.length === 0 ? 'Todas as vagas disponíveis foram selecionadas' : 'Adicionar vaga...'}
                            </option>
                            {availableJobs.map(job => (
                                <option key={job.id} value={job.id}>{job.title}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="stageId" className="block text-sm font-medium text-gray-700">Etapa</label>
                        <select name="stageId" id="stageId" value={formData.stageId} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            {stages.map(stage => <option key={stage.id} value={stage.id}>{stage.name}</option>)}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Currículo</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:bg-gray-50 transition-colors relative">
                            <div className="space-y-1 text-center">
                                <FileTextIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 justify-center">
                                    <label htmlFor="resume-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload de arquivo</span>
                                        <input id="resume-upload" name="resume-upload" type="file" ref={resumeInputRef} className="sr-only" onChange={handleResumeChange} accept=".pdf,.doc,.docx" />
                                    </label>
                                    <p className="pl-1">ou arraste e solte</p>
                                </div>
                                <p className="text-xs text-gray-500">PDF, DOC, DOCX até 5MB</p>
                            </div>
                        </div>
                        {formData.resumeName && (
                            <div className="mt-2 flex items-center justify-between bg-indigo-50 px-3 py-2 rounded-md">
                                <div className="flex items-center text-sm text-indigo-700 truncate">
                                    <FileTextIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    <span className="truncate max-w-[200px]">{formData.resumeName}</span>
                                </div>
                                <button type="button" onClick={handleRemoveResume} className="text-indigo-500 hover:text-indigo-800 text-sm font-medium">
                                    Remover
                                </button>
                            </div>
                        )}
                    </div>

                </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
                    <button type="submit" disabled={formData.jobIds.length === 0} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed">Salvar</button>
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

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            <button
                onClick={() => setFilterStageId('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors ${
                    filterStageId === 'all' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
                Todas
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                    filterStageId === 'all' ? 'bg-indigo-800 text-indigo-100' : 'bg-gray-200 text-gray-500'
                }`}>
                    {candidates.length}
                </span>
            </button>
            {stages.map(stage => {
                const count = candidates.filter(c => c.stageId === stage.id).length;
                return (
                    <button
                        key={stage.id}
                        onClick={() => setFilterStageId(stage.id)}
                         className={`px-4 py-2 rounded-full text-sm font-medium flex items-center transition-colors whitespace-nowrap ${
                            filterStageId === stage.id 
                            ? 'bg-indigo-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {stage.name}
                        <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                            filterStageId === stage.id ? 'bg-indigo-800 text-indigo-100' : 'bg-gray-200 text-gray-500'
                        }`}>
                            {count}
                        </span>
                    </button>
                )
            })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Candidato</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Vagas</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Etapa</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Currículo</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCandidates.map((candidate) => (
                <tr key={candidate.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <img src={candidate.avatar} alt={candidate.name} className="h-10 w-10 rounded-full mr-4 object-cover" />
                      <p className="font-semibold text-gray-900">{candidate.name}</p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 max-w-xs truncate" title={getJobTitles(candidate.jobIds)}>{getJobTitles(candidate.jobIds)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStageColor(candidate.stageId)}`}>
                      {getStageName(candidate.stageId)}
                    </span>
                  </td>
                   <td className="p-4">
                      {candidate.resume ? (
                          <a href={candidate.resume} download={candidate.resumeName || "resume.pdf"} className="text-gray-500 hover:text-indigo-600" title="Baixar Currículo">
                              <FileTextIcon className="w-5 h-5" />
                          </a>
                      ) : (
                          <span className="text-gray-300">-</span>
                      )}
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
          {filteredCandidates.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                  Nenhum candidato encontrado nesta etapa.
              </div>
          )}
        </div>
      </div>
      
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {renderModalContent()}
      </Modal>
    </>
  );
};

export default CandidateList;
