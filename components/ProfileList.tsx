import React, { useState, useEffect } from 'react';
import { SystemUser } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon } from './icons';

const mockUsers: SystemUser[] = [
  { 
    id: 1, 
    name: 'Administrador', 
    login: 'admin', 
    password: 'admin', 
    avatar: 'https://picsum.photos/seed/admin/200', 
    role: 'Administrador' 
  },
];

// FIX: Correctly type emptyUser to include 'avatar' to match the form data shape.
const emptyUser: Omit<SystemUser, 'id'> = {
    name: '',
    login: '',
    password: '',
    avatar: '',
    role: 'Usuário',
};

const ProfileList: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState(emptyUser);

  useEffect(() => {
    if (modalMode === 'edit' && selectedUser) {
        const { password, ...userData } = selectedUser;
        setFormData({
            ...userData,
            password: '', // Não pré-preenche a senha por segurança
        });
    } else {
        setFormData(emptyUser);
    }
  }, [modalMode, selectedUser]);

  const openModal = (mode: 'create' | 'edit', user: SystemUser | null = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
        const newUser: SystemUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            avatar: formData.avatar || `https://picsum.photos/seed/${Math.random()}/200`,
            ...formData,
        };
        setUsers([newUser, ...users]);
    } else if (modalMode === 'edit' && selectedUser) {
        setUsers(users.map(u =>
            u.id === selectedUser.id ? { ...selectedUser, ...formData, password: formData.password || selectedUser.password } : u
        ));
    }
    closeModal();
  };
  
  const handleDelete = (userId: number) => {
    if (userId === 1) {
        alert('Não é possível excluir o usuário administrador padrão.');
        return;
    }
    if (window.confirm('Tem certeza que deseja excluir este perfil?')) {
        setUsers(users.filter(u => u.id !== userId));
    }
  };

  return (
    <>
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Perfis</h2>
                <button 
                    onClick={() => openModal('create')}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                >
                    Adicionar Perfil
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                    <th className="p-4 text-sm font-semibold text-gray-600">Usuário</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Login</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Nível de Acesso</th>
                    <th className="p-4 text-sm font-semibold text-gray-600">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">
                        <div className="flex items-center">
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full mr-4" />
                            <p className="font-semibold text-gray-900">{user.name}</p>
                        </div>
                        </td>
                        <td className="p-4 text-gray-700">{user.login}</td>
                        <td className="p-4 text-gray-700">{user.role}</td>
                        <td className="p-4">
                            <div className="flex items-center space-x-4">
                                <button onClick={() => openModal('edit', user)} className="text-gray-500 hover:text-indigo-600">
                                    <EditIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDelete(user.id)} className="text-gray-500 hover:text-rose-600" disabled={user.id === 1}>
                                    <TrashIcon className={`w-5 h-5 ${user.id === 1 ? 'text-gray-300' : ''}`} />
                                </button>
                            </div>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleFormSubmit} className="p-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Perfil' : 'Editar Perfil'}</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700">Login</label>
                        <input type="text" name="login" id="login" value={formData.login} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} placeholder={modalMode === 'edit' ? 'Deixe em branco para não alterar' : ''} required={modalMode === 'create'} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">URL da Foto</label>
                        <input type="text" name="avatar" id="avatar" value={formData.avatar} onChange={handleInputChange} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
                        <select name="role" id="role" value={formData.role} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option>Administrador</option>
                            <option>Usuário</option>
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

export default ProfileList;