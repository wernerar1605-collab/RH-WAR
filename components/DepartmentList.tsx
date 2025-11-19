import React, { useState, useEffect } from 'react';
import { Department } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

interface DepartmentListProps {
    departments: Department[];
    setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
}

const DepartmentList: React.FC<DepartmentListProps> = ({ departments, setDepartments }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentDept, setCurrentDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        if(modalMode === 'edit' && currentDept) {
            setFormData({ name: currentDept.name });
        } else {
            setFormData({ name: '' });
        }
    }, [modalMode, currentDept]);

    const openModal = (mode: 'create' | 'edit', dept: Department | null = null) => {
        setModalMode(mode);
        setCurrentDept(dept);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(modalMode === 'create') {
            const newDept = { id: Date.now(), name: formData.name };
            setDepartments([newDept, ...departments]);
        } else if (currentDept) {
            setDepartments(departments.map(d => d.id === currentDept.id ? {...d, name: formData.name} : d));
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este departamento? Funcionários associados não serão atualizados automaticamente.')) {
            setDepartments(departments.filter(d => d.id !== id));
        }
    }
    
    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Departamentos</h2>
                <button onClick={() => openModal('create')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Adicionar Departamento
                </button>
            </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nome</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 w-24">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departments.map((dept) => (
                            <tr key={dept.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{dept.name}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModal('edit', dept)} className="text-gray-500 hover:text-indigo-600">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(dept.id)} className="text-gray-500 hover:text-rose-600">
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Departamento' : 'Editar Departamento'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Departamento</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={(e) => setFormData({name: e.target.value})} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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

export default DepartmentList;