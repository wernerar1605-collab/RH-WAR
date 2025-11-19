import React, { useState, useEffect } from 'react';
import { Stage } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

interface StageListProps {
    stages: Stage[];
    setStages: React.Dispatch<React.SetStateAction<Stage[]>>;
}

const StageList: React.FC<StageListProps> = ({ stages, setStages }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentStage, setCurrentStage] = useState<Stage | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if (modalMode === 'edit' && currentStage) {
            setFormData({ name: currentStage.name });
        } else {
            setFormData({ name: '' });
        }
    }, [modalMode, currentStage]);

    const openModal = (mode: 'create' | 'edit', stage: Stage | null = null) => {
        setModalMode(mode);
        setCurrentStage(stage);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            const newStage = { id: Date.now(), name: formData.name };
            setStages([newStage, ...stages]);
        } else if (currentStage) {
            setStages(stages.map(s => s.id === currentStage.id ? { ...s, name: formData.name } : s));
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta etapa?')) {
            setStages(stages.filter(s => s.id !== id));
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Etapas do Processo</h2>
                <button onClick={() => openModal('create')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Adicionar Etapa
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nome da Etapa</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 w-24">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stages.map((stage) => (
                            <tr key={stage.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{stage.name}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModal('edit', stage)} className="text-gray-500 hover:text-indigo-600">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(stage.id)} className="text-gray-500 hover:text-rose-600">
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Etapa' : 'Editar Etapa'}</h3>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Etapa</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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

export default StageList;