
import React, { useState } from 'react';
import UserList from './UserList';
import AccessLevelList from './AccessLevelList';

const ProfileList: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'access_levels'>('users');

    const TabButton: React.FC<{ tab: 'users' | 'access_levels', label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
        >
            {label}
        </button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Gerenciamento de Perfis</h1>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px px-6">
                        <TabButton tab="users" label="Usuários" />
                        <TabButton tab="access_levels" label="Níveis de Acesso" />
                    </nav>
                </div>
                <div className="p-6">
                    {activeTab === 'users' ? <UserList /> : <AccessLevelList />}
                </div>
            </div>
        </div>
    );
};

export default ProfileList;