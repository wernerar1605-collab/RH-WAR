
import React, { useState, useEffect } from 'react';
import { AccessLevel } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon, ShieldIcon, CheckCircleIcon } from './icons';

const ALL_PERMISSIONS = [
    { id: 'manage_employees', label: 'Gerenciar Funcionários' },
    { id: 'manage_recruitment', label: 'Gerenciar Recrutamento' },
    { id: 'manage_leaves', label: 'Gerenciar Licenças' },
    { id: 'manage_reviews', label: 'Gerenciar Avaliações' },
    { id: 'view_reports', label: 'Visualizar Relatórios' },
    { id: 'manage_users', label: 'Gerenciar Usuários' },
    { id: 'manage_access', label: 'Gerenciar Níveis de Acesso' },
];

const mockAccessLevels: AccessLevel[] = [
    { 
        id: 1, 
        name: 'Administrador', 
        description: 'Acesso total ao sistema', 
        permissions: ALL_PERMISSIONS.map(p => p.id) 
    },
    { 
        id: 2, 
        name: 'Gestora', 
        description: 'Gerencia equipe, recrutamento e avaliações', 
        permissions: ['manage_employees', 'manage_recruitment', 'manage_leaves', 'manage_reviews', 'view_reports'] 
    },
    { 
        id: 3, 
        name: 'Coordenadora', 
        description: 'Gerencia operações do dia a dia e licenças', 
        permissions: ['manage_employees', 'manage_leaves', 'view_reports'] 
    },
    { 
        id: 4, 
        name: 'Usuário', 
        description: 'Acesso básico de visualização', 
        permissions: [] 
    },
];

const emptyAccessLevel: Omit<AccessLevel, 'id'> = {
    name: '',
    description: '',
    permissions: []
};

const AccessLevelList: React.FC = () => {
    const [accessLevels, setAccessLevels] = useState<AccessLevel[]>(mockAccessLevels);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [selectedLevel, setSelectedLevel] = useState<AccessLevel | null>(null);
    const [formData, setFormData] = useState(emptyAccessLevel);

    useEffect(() => {
        if (modalMode === 'edit' && selectedLevel) {
            setFormData({
                name: selectedLevel.name,
                description: selectedLevel.description,
                permissions: selectedLevel.permissions
            });
        } else {
            setFormData(emptyAccessLevel);
        }
    }, [modalMode, selectedLevel]);

    const openModal = (mode: 'create' | 'edit', level: AccessLevel | null = null) => {
        setModalMode(mode);
        setSelectedLevel(level);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedLevel(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePermissionToggle = (permissionId: string) => {
        setFormData(prev => {
            const hasPermission = prev.permissions.includes(permissionId);
            return {
                ...prev,
                permissions: hasPermission 
                    ? prev.permissions.filter(p => p !== permissionId)
                    : [...prev.permissions, permissionId]
            };
        });
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            const newLevel: AccessLevel = {
                id: Math.max(...accessLevels.map(a => a.id), 0) + 1,
                ...formData
            };
            setAccessLevels([...accessLevels, newLevel]);
        } else if (modalMode === 'edit' && selectedLevel) {
            setAccessLevels(accessLevels.map(a => 
                a.id === selectedLevel.id ? { ...selectedLevel, ...formData } : a
            ));
        }
        closeModal();
    };

    const handleDelete = (id: number) => {
        if (id === 1) {
            alert('Não é possível excluir o nível de Administrador.');
            return;
        }
        if (window.confirm('Tem certeza que deseja excluir este nível de acesso?')) {
            setAccessLevels(accessLevels.filter(a => a.id !== id));
        }
    };

    return (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Níveis de Acesso</h2>
                <button 
                    onClick={() => openModal('create')}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Novo Nível de Acesso
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {accessLevels.map((level) => (
                    <div key={level.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center">
                                <div className="p-2 bg-indigo-50 rounded-lg mr-3 text-indigo-600">
                                    <ShieldIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{level.name}</h3>
                                    <p className="text-xs text-gray-500">{level.permissions.length} permissões</p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button onClick={() => openModal('edit', level)} className="text-gray-400 hover:text-indigo-600">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(level.id)} className={`text-gray-400 hover:text-rose-600 ${level.id === 1 ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={level.id === 1}>
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 h-10 line-clamp-2">{level.description}</p>
                        
                        <div className="border-t border-gray-100 pt-3">
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Permissões principais</p>
                            <div className="flex flex-wrap gap-2">
                                {level.permissions.slice(0, 3).map(p => (
                                    <span key={p} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                        {ALL_PERMISSIONS.find(ap => ap.id === p)?.label || p}
                                    </span>
                                ))}
                                {level.permissions.length > 3 && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                                        +{level.permissions.length - 3} mais
                                    </span>
                                )}
                                {level.permissions.length === 0 && (
                                    <span className="text-xs text-gray-400 italic">Nenhuma permissão</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleFormSubmit} className="p-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Novo Nível de Acesso' : 'Editar Nível de Acesso'}</h3>
                    
                    <div className="space-y-4 mb-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Nível</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input type="text" name="description" id="description" value={formData.description} onChange={handleInputChange} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h4 className="font-semibold text-gray-800 mb-3">Permissões do Sistema</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
                            {ALL_PERMISSIONS.map(permission => (
                                <div key={permission.id} className="relative flex items-start">
                                    <div className="flex items-center h-5">
                                        <input
                                            id={`perm-${permission.id}`}
                                            name={`perm-${permission.id}`}
                                            type="checkbox"
                                            checked={formData.permissions.includes(permission.id)}
                                            onChange={() => handlePermissionToggle(permission.id)}
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`perm-${permission.id}`} className="font-medium text-gray-700 select-none cursor-pointer">
                                            {permission.label}
                                        </label>
                                    </div>
                                </div>
                            ))}
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

export default AccessLevelList;