import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import DepartmentList from './DepartmentList';
import RoleList from './RoleList';
import ContractList from './ContractList';
import { Department, Role, Contract } from '../types';

// Mock data moved here from child components to be managed by the parent
const mockDepartments: Department[] = [
    { id: 1, name: 'Tecnologia' },
    { id: 2, name: 'Produto' },
    { id: 3, name: 'Dados' },
    { id: 4, name: 'RH' },
    { id: 5, name: 'Marketing' },
    { id: 6, name: 'Financeiro' },
];

const mockRoles: Role[] = [
    { id: 1, name: 'Desenvolvedor Frontend', departmentId: 1 },
    { id: 2, name: 'Designer UX/UI', departmentId: 2 },
    { id: 3, name: 'Gerente de Projetos', departmentId: 1 },
    { id: 4, name: 'Engenheiro de Dados', departmentId: 3 },
    { id: 5, name: 'Analista de RH', departmentId: 4 },
    { id: 6, name: 'Product Manager', departmentId: 2 },
    { id: 7, name: 'Desenvolvedor Backend', departmentId: 1 },
    { id: 8, name: 'Analista de Marketing', departmentId: 5 },
    { id: 9, name: 'Analista Financeiro', departmentId: 6 },
];

const mockContracts: Contract[] = [
    { id: 1, name: 'CLT', description: 'Consolidação das Leis do Trabalho' },
    { id: 2, name: 'PJ', description: 'Pessoa Jurídica' },
    { id: 3, name: 'Estágio', description: 'Contrato de Estágio' },
    { id: 4, name: 'Temporário', description: 'Contrato de Trabalho Temporário' },
];


const EmployeeManagement: React.FC = () => {
    type Tab = 'employees' | 'departments' | 'roles' | 'contracts';
    const [activeTab, setActiveTab] = useState<Tab>('employees');

    const [departments, setDepartments] = useState<Department[]>(mockDepartments);
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [contracts, setContracts] = useState<Contract[]>(mockContracts);


    const TabButton: React.FC<{ tabName: Tab, label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tabName
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'employees':
                return <EmployeeList departments={departments} roles={roles} contracts={contracts} />;
            case 'departments':
                return <DepartmentList departments={departments} setDepartments={setDepartments} />;
            case 'roles':
                return <RoleList roles={roles} setRoles={setRoles} departments={departments} />;
            case 'contracts':
                return <ContractList contracts={contracts} setContracts={setContracts} />;
            default:
                return <EmployeeList departments={departments} roles={roles} contracts={contracts} />;
        }
    };

    return (
         <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900">Funcionários</h1>
            <div className="bg-white rounded-xl shadow-sm">
                <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px px-6">
                        <TabButton tabName="employees" label="Funcionários" />
                        <TabButton tabName="departments" label="Departamentos" />
                        <TabButton tabName="roles" label="Cargos" />
                        <TabButton tabName="contracts" label="Contratos" />
                    </nav>
                </div>
                <div className="p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default EmployeeManagement;