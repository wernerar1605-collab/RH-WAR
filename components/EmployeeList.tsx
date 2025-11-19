import React, { useState, useEffect, useRef } from 'react';
import { Employee, Department, Role, Contract } from '../types';
import Modal from './Modal';
import { EditIcon, TrashIcon, ProfileIcon } from './icons';

const mockEmployees: Employee[] = [
  { id: 1, name: 'Ana Silva', role: 'Desenvolvedora Frontend', department: 'Tecnologia', email: 'ana.silva@example.com', avatar: 'https://picsum.photos/seed/1/200', status: 'Ativo', dataDeAdmissao: '2022-03-15', cpf: '111.111.111-11', rg: '11.111.111-1', dataDeNascimento: '1990-05-10', telefone: '(11) 98888-7777', salario: '8000,00', regimeDeTrabalho: 'CLT' },
  { id: 2, name: 'Bruno Costa', role: 'Designer UX/UI', department: 'Produto', email: 'bruno.costa@example.com', avatar: 'https://picsum.photos/seed/2/200', status: 'Ativo', dataDeAdmissao: '2021-11-20', cpf: '222.222.222-22', rg: '22.222.222-2', dataDeNascimento: '1992-08-25', telefone: '(11) 97777-6666', salario: '7500,00', regimeDeTrabalho: 'CLT' },
  { id: 3, name: 'Carla Dias', role: 'Gerente de Projetos', department: 'Tecnologia', email: 'carla.dias@example.com', avatar: 'https://picsum.photos/seed/3/200', status: 'Ativo', dataDeAdmissao: '2020-01-10', cpf: '333.333.333-33', rg: '33.333.333-3', dataDeNascimento: '1988-02-14', telefone: '(11) 96666-5555', salario: '12000,00', regimeDeTrabalho: 'PJ' },
  { id: 4, name: 'Diego Faria', role: 'Engenheiro de Dados', department: 'Dados', email: 'diego.faria@example.com', avatar: 'https://picsum.photos/seed/4/200', status: 'Inativo', dataDeAdmissao: '2023-05-01', cpf: '444.444.444-44', rg: '44.444.444-4', dataDeNascimento: '1995-12-01', telefone: '(11) 95555-4444', salario: '9500,00', regimeDeTrabalho: 'CLT' },
  { id: 5, name: 'Elisa Rocha', role: 'Analista de RH', department: 'RH', email: 'elisa.rocha@example.com', avatar: 'https://picsum.photos/seed/5/200', status: 'Ativo', dataDeAdmissao: '2022-09-05', cpf: '555.555.555-55', rg: '55.555.555-5', dataDeNascimento: '1993-07-30', telefone: '(11) 94444-3333', salario: '6000,00', regimeDeTrabalho: 'CLT' },
];

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const emptyEmployee: Omit<Employee, 'id' | 'status'> = {
    name: '',
    cpf: '',
    rg: '',
    dataDeNascimento: '',
    email: '',
    telefone: '',
    role: '',
    department: '',
    dataDeAdmissao: '',
    salario: '',
    regimeDeTrabalho: '',
    avatar: '',
};

interface EmployeeListProps {
    departments: Department[];
    roles: Role[];
    contracts: Contract[];
}

const EmployeeList: React.FC<EmployeeListProps> = ({ departments, roles, contracts }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState(emptyEmployee);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (modalMode === 'edit' && selectedEmployee) {
        const { id, status, ...employeeData } = selectedEmployee;
        setFormData(employeeData);
    } else {
        setFormData(emptyEmployee);
    }
  }, [modalMode, selectedEmployee]);

  const openModal = (mode: 'create' | 'edit', employee: Employee | null = null) => {
    setModalMode(mode);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'department') {
        // When department changes, reset the role
        setFormData(prev => ({ ...prev, department: value, role: '' }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
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
        const newEmployee: Employee = {
            id: Math.max(...employees.map(e => e.id), 0) + 1,
            status: 'Ativo',
            ...formData,
            avatar: formData.avatar || `https://picsum.photos/seed/${Math.random()}/200`,
        };
        setEmployees([newEmployee, ...employees]);
    } else if (modalMode === 'edit' && selectedEmployee) {
        setEmployees(employees.map(emp =>
            emp.id === selectedEmployee.id ? { ...selectedEmployee, ...formData } : emp
        ));
    }
    closeModal();
  };
  
  const handleDelete = (employeeId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
        setEmployees(employees.filter(emp => emp.id !== employeeId));
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDepartmentObj = departments.find(d => d.name === formData.department);
  const filteredRoles = selectedDepartmentObj 
    ? roles.filter(r => r.departmentId === selectedDepartmentObj.id) 
    : [];

  return (
    <>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 shrink-0">Lista de Funcionários</h2>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <input
                    type="text"
                    placeholder="Pesquisar..."
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button 
                    onClick={() => openModal('create')}
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Adicionar Funcionário
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b">
                <tr>
                <th className="p-4 text-sm font-semibold text-gray-600">Nome</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Cargo</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Departamento</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Admissão</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-600">Ações</th>
                </tr>
            </thead>
            <tbody>
                {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                    <div className="flex items-center">
                        <img src={employee.avatar} alt={employee.name} className="h-10 w-10 rounded-full mr-4 object-cover" />
                        <div>
                        <p className="font-semibold text-gray-900">{employee.name}</p>
                        <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                    </div>
                    </td>
                    <td className="p-4 text-gray-700">{employee.role}</td>
                    <td className="p-4 text-gray-700">{employee.department}</td>
                    <td className="p-4 text-gray-700">
                        {new Date(employee.dataDeAdmissao + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </td>
                    <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${employee.status === 'Ativo' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {employee.status}
                    </span>
                    </td>
                    <td className="p-4">
                        <div className="flex items-center space-x-4">
                            <button onClick={() => openModal('edit', employee)} className="text-gray-500 hover:text-indigo-600">
                                <EditIcon className="w-5 h-5" />
                            </button>
                            <button onClick={() => handleDelete(employee.id)} className="text-gray-500 hover:text-rose-600">
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
            <form onSubmit={handleFormSubmit} className="p-2">
                <h3 className="text-xl font-bold text-gray-900">{modalMode === 'create' ? 'Cadastrar Novo Funcionário' : 'Editar Funcionário'}</h3>
                <p className="text-sm text-gray-500 mb-6">Preencha os dados do novo funcionário abaixo.</p>

                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Dados Pessoais</h4>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome completo *</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required placeholder="Nome completo" className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF *</label>
                            <input type="text" name="cpf" id="cpf" value={formData.cpf} onChange={handleInputChange} required placeholder="000.000.000-00" className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="rg" className="block text-sm font-medium text-gray-700">RG</label>
                            <input type="text" name="rg" id="rg" value={formData.rg} onChange={handleInputChange} placeholder="00.000.000-0" className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="dataDeNascimento" className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
                            <input type="date" name="dataDeNascimento" id="dataDeNascimento" value={formData.dataDeNascimento} onChange={handleInputChange} className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email *</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required placeholder="email@empresa.com" className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                            <input type="text" name="telefone" id="telefone" value={formData.telefone} onChange={handleInputChange} placeholder="(11) 99999-9999" className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                </div>

                <div>
                    <h4 className="text-sm font-semibold text-indigo-700 border-b border-indigo-200 pb-2 mb-4">Dados Profissionais</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                         <div>
                            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Departamento *</label>
                            <select name="department" id="department" value={formData.department} onChange={handleInputChange} required className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">Selecione o departamento</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo *</label>
                            <select name="role" id="role" value={formData.role} onChange={handleInputChange} required disabled={!formData.department} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100">
                                <option value="">{formData.department ? 'Selecione o cargo' : 'Selecione um departamento primeiro'}</option>
                                {filteredRoles.map(role => (
                                    <option key={role.id} value={role.name}>{role.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="dataDeAdmissao" className="block text-sm font-medium text-gray-700">Data de Admissão *</label>
                            <input type="date" name="dataDeAdmissao" id="dataDeAdmissao" value={formData.dataDeAdmissao} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="salario" className="block text-sm font-medium text-gray-700">Salário *</label>
                            <input type="text" name="salario" id="salario" value={formData.salario} onChange={handleInputChange} required placeholder="0,00" className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="regimeDeTrabalho" className="block text-sm font-medium text-gray-700">Regime de Trabalho</label>
                            <select name="regimeDeTrabalho" id="regimeDeTrabalho" value={formData.regimeDeTrabalho} onChange={handleInputChange} className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option value="">Selecione o regime</option>
                                {contracts.map(contract => (
                                    <option key={contract.id} value={contract.name}>{contract.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                    <button type="button" onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        {modalMode === 'create' ? 'Cadastrar Funcionário' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </Modal>
    </>
  );
};

export default EmployeeList;