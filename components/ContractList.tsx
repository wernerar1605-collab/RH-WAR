import React, { useState, useEffect } from 'react';
import { Contract } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

interface ContractListProps {
    contracts: Contract[];
    setContracts: React.Dispatch<React.SetStateAction<Contract[]>>;
}

const emptyContract = { name: '', description: '' };

const ContractList: React.FC<ContractListProps> = ({ contracts, setContracts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentContract, setCurrentContract] = useState<Contract | null>(null);
    const [formData, setFormData] = useState(emptyContract);

    useEffect(() => {
        if (modalMode === 'edit' && currentContract) {
            setFormData({ name: currentContract.name, description: currentContract.description });
        } else {
            setFormData(emptyContract);
        }
    }, [modalMode, currentContract]);

    const openModal = (mode: 'create' | 'edit', contract: Contract | null = null) => {
        setModalMode(mode);
        setCurrentContract(contract);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            const newContract = { id: Date.now(), ...formData };
            setContracts([newContract, ...contracts]);
        } else if (currentContract) {
            setContracts(contracts.map(c => c.id === currentContract.id ? { ...c, ...formData } : c));
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este tipo de contrato?')) {
            setContracts(contracts.filter(c => c.id !== id));
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Tipos de Contrato</h2>
                <button onClick={() => openModal('create')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Adicionar Contrato
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nome</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Descrição</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 w-24">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contracts.map((contract) => (
                            <tr key={contract.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{contract.name}</td>
                                <td className="p-4 text-gray-700">{contract.description}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModal('edit', contract)} className="text-gray-500 hover:text-indigo-600">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(contract.id)} className="text-gray-500 hover:text-rose-600">
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Contrato' : 'Editar Contrato'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Contrato</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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

export default ContractList;