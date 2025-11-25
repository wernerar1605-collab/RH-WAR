import React, { useState, useEffect } from 'react';
import { Role, Department } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

interface RoleListProps {
    roles: Role[];
    setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
    departments: Department[];
}

const RoleList: React.FC<RoleListProps> = ({ roles, setRoles, departments }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [formData, setFormData] = useState({ 
        name: '', 
        departmentId: departments.length > 0 ? departments[0].id : 0,
        salary: '' 
    });

    useEffect(() => {
        if (modalMode === 'edit' && currentRole) {
            setFormData({ 
                name: currentRole.name, 
                departmentId: currentRole.departmentId,
                salary: currentRole.salary 
            });
        } else {
            setFormData({ 
                name: '', 
                departmentId: departments.length > 0 ? departments[0].id : 0,
                salary: '' 
            });
        }
    }, [modalMode, currentRole, departments]);

    const openModal = (mode: 'create' | 'edit', role: Role | null = null) => {
        setModalMode(mode);
        setCurrentRole(role);
        setIsModalOpen(true);
    };
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'departmentId' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            const newRole: Role = { id: Date.now(), ...formData };
            setRoles([newRole, ...roles]);
        } else if (currentRole) {
            setRoles(roles.map(r => r.id === currentRole.id ? { ...r, ...formData } : r));
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
            setRoles(roles.filter(r => r.id !== id));
        }
    };

    const getDepartmentName = (departmentId: number) => {
        return departments.find(d => d.id === departmentId)?.name || 'N/A';
    }

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Cargos</h2>
                <button onClick={() => openModal('create')} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                    Adicionar Cargo
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-gray-600">Nome do Cargo</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Departamento</th>
                            <th className="p-4 text-sm font-semibold text-gray-600">Salário Base</th>
                            <th className="p-4 text-sm font-semibold text-gray-600 w-24">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-medium text-gray-800">{role.name}</td>
                                <td className="p-4 text-gray-700">{getDepartmentName(role.departmentId)}</td>
                                <td className="p-4 text-gray-700">R$ {role.salary}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-4">
                                        <button onClick={() => openModal('edit', role)} className="text-gray-500 hover:text-indigo-600">
                                            <EditIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(role.id)} className="text-gray-500 hover:text-rose-600">
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Cargo' : 'Editar Cargo'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Cargo</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700">Departamento</label>
                            <select name="departmentId" id="departmentId" value={formData.departmentId} onChange={handleInputChange} required className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salário Base</label>
                            <input type="text" name="salary" id="salary" value={formData.salary} onChange={handleInputChange} placeholder="0,00" required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
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

export default RoleList;