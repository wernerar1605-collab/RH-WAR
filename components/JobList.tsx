import React, { useState, useEffect } from 'react';
import { Job } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

interface JobListProps {
    jobs: Job[];
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

const emptyJob: Omit<Job, 'id'> = {
    title: '',
    department: '',
    description: '',
    status: 'Aberto',
};

const JobList: React.FC<JobListProps> = ({ jobs, setJobs }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentJob, setCurrentJob] = useState<Job | null>(null);
    const [formData, setFormData] = useState(emptyJob);

    useEffect(() => {
        if(modalMode === 'edit' && currentJob) {
            setFormData(currentJob);
        } else {
            setFormData(emptyJob);
        }
    }, [modalMode, currentJob]);

    const openModal = (mode: 'create' | 'edit', job: Job | null = null) => {
        setModalMode(mode);
        setCurrentJob(job);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(modalMode === 'create') {
            const newJob = { id: Date.now(), ...formData };
            setJobs([newJob, ...jobs]);
        } else if (currentJob) {
            setJobs(jobs.map(j => j.id === currentJob.id ? { ...currentJob, ...formData } : j));
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta vaga?')) {
            setJobs(jobs.filter(j => j.id !== id));
        }
    }
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Vagas</h2>
                <button onClick={() => openModal('create')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Adicionar Vaga
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Título da Vaga</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Departamento</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 w-24">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map((job) => (
                            <tr key={job.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{job.title}</td>
                                <td className="p-4 text-gray-700">{job.department}</td>
                                <td className="p-4">
                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Aberto' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                        {job.status}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModal('edit', job)} className="text-gray-500 hover:text-indigo-600">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(job.id)} className="text-gray-500 hover:text-rose-600">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                 <form onSubmit={handleSubmit} className="p-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Vaga' : 'Editar Vaga'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título da Vaga</label>
                            <input type="text" name="title" id="title" value={formData.title} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento</label>
                            <input type="text" name="department" id="department" value={formData.department} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} required rows={4} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                            <select name="status" id="status" value={formData.status} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option>Aberto</option>
                                <option>Fechado</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Salvar</button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default JobList;