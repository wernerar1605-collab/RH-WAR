
import React, { useState, useEffect, useRef } from 'react';
import { SystemUser } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon, ProfileIcon } from './icons';

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

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

// FIX: Correctly type emptyUser to include 'avatar' to match the form data shape.
const emptyUser: Omit<SystemUser, 'id'> = {
    name: '',
    login: '',
    password: '',
    avatar: '',
    role: 'Gestora',
};

const UserList: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(mockUsers);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [formData, setFormData] = useState(emptyUser);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const file = e.target.files[0];
            const base64 = await toBase64(file);
            setFormData(prev => ({ ...prev, avatar: base64 }));
        } catch (error) {
            console.error("Error converting file to base64", error);
        }
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
        const newUser: SystemUser = {
            id: Math.max(...users.map(u => u.id), 0) + 1,
            avatar: formData.avatar || `https://picsum.photos/seed/${Math.random()}/200`,
            ...formData,
            role: formData.role as SystemUser['role']
        };
        setUsers([newUser, ...users]);
    } else if (modalMode === 'edit' && selectedUser) {
        setUsers(users.map(u =>
            u.id === selectedUser.id ? { 
                ...selectedUser, 
                ...formData, 
                role: formData.role as SystemUser['role'],
                password: formData.password || selectedUser.password 
            } : u
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
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Usuários do Sistema</h2>
            <button 
                onClick={() => openModal('create')}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                Adicionar Usuário
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
                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full mr-4 object-cover" />
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

        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <form onSubmit={handleFormSubmit} className="p-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Adicionar Usuário' : 'Editar Usuário'}</h3>
                
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
                        ref={fileInputRef} 
                        onChange={handlePhotoChange}
                        accept="image/*"
                        className="hidden" 
                    />
                    <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
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
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700">Login</label>
                        <input type="text" name="login" id="login" value={formData.login} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} placeholder={modalMode === 'edit' ? 'Deixe em branco para não alterar' : ''} required={modalMode === 'create'} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Nível de Acesso</label>
                        <select name="role" id="role" value={formData.role} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="Gestora">Gestora</option>
                            <option value="Coordenadora">Coordenadora</option>
                            <option value="Administrador">Administrador</option>
                            <option value="Usuário">Usuário</option>
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

export default UserList;