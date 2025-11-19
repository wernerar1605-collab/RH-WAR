import React, { useState, useEffect } from 'react';
import { LeaveRequest, Employee, LeaveType } from '../types';
import LeaveTimeline from './LeaveTimeline';
import Modal from './Modal';
import { EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, UndoIcon } from './icons';

// FIX: Added missing properties to each employee object to match the Employee type.
const mockEmployeesForLeave: Employee[] = [
    { id: 1, name: 'Rosa Maia', role: 'Desenvolvedora Frontend', department: 'Tecnologia', email: 'rosa.maia@example.com', avatar: 'https://i.pravatar.cc/150?u=rosa', status: 'Ativo', dataDeAdmissao: '2022-03-15', cpf: '111.111.111-11', rg: '11.111.111-1', dataDeNascimento: '1990-05-10', telefone: '(11) 98888-7777', salario: '8000,00', regimeDeTrabalho: 'CLT' },
    { id: 2, name: 'Rafael Salgado', role: 'Designer UX/UI', department: 'Produto', email: 'rafael.salgado@example.com', avatar: 'https://i.pravatar.cc/150?u=rafael', status: 'Ativo', dataDeAdmissao: '2021-11-20', cpf: '222.222.222-22', rg: '22.222.222-2', dataDeNascimento: '1992-08-25', telefone: '(11) 97777-6666', salario: '7500,00', regimeDeTrabalho: 'CLT' },
    { id: 3, name: 'João Ricardo', role: 'Gerente de Projetos', department: 'Tecnologia', email: 'joao.ricardo@example.com', avatar: 'https://i.pravatar.cc/150?u=joao', status: 'Ativo', dataDeAdmissao: '2020-01-10', cpf: '333.333.333-33', rg: '33.333.333-3', dataDeNascimento: '1988-02-14', telefone: '(11) 96666-5555', salario: '12000,00', regimeDeTrabalho: 'PJ' },
    { id: 4, name: 'Mariana Silva', role: 'Engenheira de Dados', department: 'Dados', email: 'mariana.silva@example.com', avatar: 'https://i.pravatar.cc/150?u=mariana', status: 'Ativo', dataDeAdmissao: '2023-05-01', cpf: '444.444.444-44', rg: '44.444.444-4', dataDeNascimento: '1995-12-01', telefone: '(11) 95555-4444', salario: '9500,00', regimeDeTrabalho: 'CLT' },
    { id: 5, name: 'Lorena Dias', role: 'Analista de RH', department: 'RH', email: 'lorena.dias@example.com', avatar: 'https://i.pravatar.cc/150?u=lorena', status: 'Ativo', dataDeAdmissao: '2022-09-05', cpf: '555.555.555-55', rg: '55.555.555-5', dataDeNascimento: '1993-07-30', telefone: '(11) 94444-3333', salario: '6000,00', regimeDeTrabalho: 'CLT' },
    { id: 6, name: 'Silvia Albuquerque', role: 'Desenvolvedora Backend', department: 'Tecnologia', email: 'silvia.albuquerque@example.com', avatar: 'https://i.pravatar.cc/150?u=silvia', status: 'Ativo', dataDeAdmissao: '2022-01-20', cpf: '666.666.666-66', rg: '66.666.666-6', dataDeNascimento: '1991-03-20', telefone: '(11) 93333-2222', salario: '8500,00', regimeDeTrabalho: 'CLT' },
    { id: 7, name: 'Tomas Guimarães', role: 'Analista de Marketing', department: 'Marketing', email: 'tomas.guimaraes@example.com', avatar: 'https://i.pravatar.cc/150?u=tomas', status: 'Ativo', dataDeAdmissao: '2023-02-10', cpf: '777.777.777-77', rg: '77.777.777-7', dataDeNascimento: '1996-01-15', telefone: '(11) 92222-1111', salario: '6500,00', regimeDeTrabalho: 'CLT' },
    { id: 8, name: 'Marina Avelar', role: 'Product Manager', department: 'Produto', email: 'marina.avelar@example.com', avatar: 'https://i.pravatar.cc/150?u=marina', status: 'Ativo', dataDeAdmissao: '2021-07-15', cpf: '888.888.888-88', rg: '88.888.888-8', dataDeNascimento: '1989-11-05', telefone: '(11) 91111-0000', salario: '11000,00', regimeDeTrabalho: 'PJ' },
    { id: 9, name: 'Joana Medeiros', role: 'Analista Financeiro', department: 'Financeiro', email: 'joana.medeiros@example.com', avatar: 'https://i.pravatar.cc/150?u=joana', status: 'Ativo', dataDeAdmissao: '2022-11-01', cpf: '999.999.999-99', rg: '99.999.999-9', dataDeNascimento: '1994-06-22', telefone: '(11) 99999-8888', salario: '6800,00', regimeDeTrabalho: 'CLT' },
    { id: 10, name: 'Ricardo Amorim', role: 'Desenvolvedor Full-Stack', department: 'Tecnologia', email: 'ricardo.amorim@example.com', avatar: 'https://i.pravatar.cc/150?u=ricardo', status: 'Ativo', dataDeAdmissao: '2020-05-25', cpf: '101.010.101-01', rg: '10.101.010-1', dataDeNascimento: '1987-09-12', telefone: '(11) 98888-7777', salario: '10000,00', regimeDeTrabalho: 'CLT' },
    { id: 11, name: 'Pedro Braga', role: 'Estagiário de Design', department: 'Produto', email: 'pedro.braga@example.com', avatar: 'https://i.pravatar.cc/150?u=pedro', status: 'Ativo', dataDeAdmissao: '2024-02-01', cpf: '121.212.121-21', rg: '12.121.212-1', dataDeNascimento: '2000-04-18', telefone: '(11) 97777-6666', salario: '2000,00', regimeDeTrabalho: 'Estágio' },
    { id: 12, name: 'Ana Maria Santos', role: 'Recrutadora', department: 'RH', email: 'ana.santos@example.com', avatar: 'https://i.pravatar.cc/150?u=ana', status: 'Ativo', dataDeAdmissao: '2021-09-18', cpf: '131.313.131-31', rg: '13.131.313-1', dataDeNascimento: '1992-10-03', telefone: '(11) 96666-5555', salario: '6200,00', regimeDeTrabalho: 'CLT' },
    { id: 13, name: 'Raquel Bouças', role: 'Engenheira de Software', department: 'Tecnologia', email: 'raquel.boucas@example.com', avatar: 'https://i.pravatar.cc/150?u=raquel', status: 'Ativo', dataDeAdmissao: '2022-06-30', cpf: '141.414.141-41', rg: '14.141.414-1', dataDeNascimento: '1993-08-28', telefone: '(11) 95555-4444', salario: '9000,00', regimeDeTrabalho: 'CLT' },
];

const mockLeaveRequests: LeaveRequest[] = [
    // Data based on the provided image, assuming August 2024
    { id: 1, employee: mockEmployeesForLeave[0], type: 'Férias', startDate: '2024-08-01', endDate: '2024-08-08', status: 'Aprovada' },
    { id: 2, employee: mockEmployeesForLeave[1], type: 'Viagem de Trabalho', startDate: '2024-08-14', endDate: '2024-08-17', status: 'Aprovada' },
    { id: 3, employee: mockEmployeesForLeave[2], type: 'Home Office', startDate: '2024-08-07', endDate: '2024-08-10', status: 'Aprovada' },
    { id: 4, employee: mockEmployeesForLeave[3], type: 'Férias', startDate: '2024-08-07', endDate: '2024-08-14', status: 'Aprovada' },
    { id: 5, employee: mockEmployeesForLeave[4], type: 'Licença médica', startDate: '2024-08-16', endDate: '2024-08-20', status: 'Aprovada' },
    { id: 6, employee: mockEmployeesForLeave[5], type: 'Viagem de Trabalho', startDate: '2024-08-08', endDate: '2024-08-14', status: 'Aprovada' },
    { id: 7, employee: mockEmployeesForLeave[6], type: 'Férias', startDate: '2024-08-02', endDate: '2024-08-09', status: 'Aprovada' },
    { id: 8, employee: mockEmployeesForLeave[7], type: 'Férias', startDate: '2024-08-14', endDate: '2024-08-18', status: 'Aprovada' },
    { id: 9, employee: mockEmployeesForLeave[8], type: 'Licença médica', startDate: '2024-08-02', endDate: '2024-08-06', status: 'Aprovada' },
    { id: 10, employee: mockEmployeesForLeave[9], type: 'Home Office', startDate: '2024-08-09', endDate: '2024-08-15', status: 'Aprovada' },
    { id: 11, employee: mockEmployeesForLeave[10], type: 'Férias', startDate: '2024-08-02', endDate: '2024-08-09', status: 'Aprovada' },
    { id: 12, employee: mockEmployeesForLeave[11], type: 'Viagem de Trabalho', startDate: '2024-08-08', endDate: '2024-08-14', status: 'Aprovada' },
    { id: 13, employee: mockEmployeesForLeave[12], type: 'Viagem de Trabalho', startDate: '2024-08-01', endDate: '2024-08-04', status: 'Aprovada' },
    { id: 14, employee: mockEmployeesForLeave[12], type: 'Férias', startDate: '2024-08-14', endDate: '2024-08-17', status: 'Aprovada' },
    { id: 15, employee: mockEmployeesForLeave[1], type: 'Férias', startDate: '2024-09-02', endDate: '2024-09-06', status: 'Pendente' },
];

const emptyFormData = {
    employeeId: mockEmployeesForLeave.length > 0 ? mockEmployeesForLeave[0].id.toString() : '',
    type: 'Férias' as LeaveType,
    startDate: '',
    endDate: '',
};

const LeaveManagement: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
    const [statusFilter, setStatusFilter] = useState<'all' | 'Pendente' | 'Aprovada' | 'Rejeitada'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentRequest, setCurrentRequest] = useState<LeaveRequest | null>(null);
    const [formData, setFormData] = useState(emptyFormData);
    
    useEffect(() => {
        if (modalMode === 'edit' && currentRequest) {
            setFormData({
                employeeId: currentRequest.employee.id.toString(),
                type: currentRequest.type,
                startDate: currentRequest.startDate,
                endDate: currentRequest.endDate,
            });
        } else {
            setFormData(emptyFormData);
        }
    }, [modalMode, currentRequest]);

    const openModal = (mode: 'create' | 'edit', request: LeaveRequest | null = null) => {
        setModalMode(mode);
        setCurrentRequest(request);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRequest(null);
    };
        
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const employee = mockEmployeesForLeave.find(emp => emp.id === parseInt(formData.employeeId));
        if (!employee) return;

        if (modalMode === 'create') {
            const newRequest: LeaveRequest = {
                id: Math.max(...leaveRequests.map(r => r.id), 0) + 1,
                employee,
                status: 'Pendente',
                ...formData,
                type: formData.type as LeaveType
            };
            setLeaveRequests([newRequest, ...leaveRequests]);
        } else if (modalMode === 'edit' && currentRequest) {
            setLeaveRequests(leaveRequests.map(req =>
                req.id === currentRequest.id ? { ...req, employee, ...formData, type: formData.type as LeaveType } : req
            ));
        }
        closeModal();
    };

    const handleDelete = (requestId: number) => {
        if (window.confirm('Tem certeza que deseja excluir esta solicitação?')) {
            setLeaveRequests(leaveRequests.filter(req => req.id !== requestId));
        }
    };

    const handleStatusChange = (requestId: number, status: 'Aprovada' | 'Rejeitada' | 'Pendente') => {
        setLeaveRequests(leaveRequests.map(req => 
            req.id === requestId ? { ...req, status } : req
        ));
    };

    const filteredRequests = leaveRequests.filter(req => {
        if (statusFilter === 'all') return true;
        return req.status === statusFilter;
    }).sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const getStatusColor = (status: LeaveRequest['status']) => {
        switch (status) {
            case 'Pendente': return 'bg-amber-100 text-amber-800';
            case 'Aprovada': return 'bg-emerald-100 text-emerald-800';
            case 'Rejeitada': return 'bg-rose-100 text-rose-800';
        }
    };

    const FilterButton: React.FC<{ status: typeof statusFilter, label: string, count: number }> = ({ status, label, count }) => (
        <button
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors ${
                statusFilter === status
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
            {label} <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${statusFilter === status ? 'bg-indigo-800 text-white' : 'bg-gray-300 text-gray-600'}`}>{count}</span>
        </button>
    );

    return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row justify-between sm:items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Licenças</h1>
                <button 
                    onClick={() => openModal('create')} 
                    className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Nova Solicitação
                </button>
            </div>

            <LeaveTimeline employees={mockEmployeesForLeave} requests={leaveRequests} />
            
             <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-800">Todas as Solicitações</h2>
                    <div className="flex flex-wrap gap-2">
                       <FilterButton status="all" label="Todas" count={leaveRequests.length} />
                       <FilterButton status="Pendente" label="Pendentes" count={leaveRequests.filter(r => r.status === 'Pendente').length} />
                       <FilterButton status="Aprovada" label="Aprovadas" count={leaveRequests.filter(r => r.status === 'Aprovada').length} />
                       <FilterButton status="Rejeitada" label="Rejeitadas" count={leaveRequests.filter(r => r.status === 'Rejeitada').length} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-sm font-semibold text-gray-600">Funcionário</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Tipo</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Período</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="p-4 text-sm font-semibold text-gray-600">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="flex items-center">
                                            <img src={request.employee.avatar} alt={request.employee.name} className="h-10 w-10 rounded-full mr-4" />
                                            <p className="font-semibold text-gray-900">{request.employee.name}</p>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-700">{request.type}</td>
                                    <td className="p-4 text-gray-700">
                                        {new Date(request.startDate + 'T00:00:00').toLocaleDateString('pt-BR')} - {new Date(request.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center space-x-2">
                                            {request.status === 'Pendente' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(request.id, 'Aprovada')} className="p-2 text-emerald-500 hover:bg-emerald-100 rounded-full" title="Aprovar">
                                                        <CheckCircleIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleStatusChange(request.id, 'Rejeitada')} className="p-2 text-rose-500 hover:bg-rose-100 rounded-full" title="Rejeitar">
                                                        <XCircleIcon className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            {request.status !== 'Pendente' && (
                                                <button onClick={() => handleStatusChange(request.id, 'Pendente')} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" title="Reverter para Pendente">
                                                    <UndoIcon className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button onClick={() => openModal('edit', request)} className="p-2 text-gray-500 hover:bg-gray-200 rounded-full" title="Editar">
                                                <EditIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(request.id)} className="p-2 text-gray-500 hover:bg-rose-100 hover:text-rose-600 rounded-full" title="Excluir">
                                                <TrashIcon className="w-5 h-5" />
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Nova Solicitação' : 'Editar Solicitação'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Funcionário</label>
                            <select name="employeeId" id="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {mockEmployeesForLeave.filter(e => e.status === 'Ativo').map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Licença</label>
                            <select name="type" id="type" value={formData.type} onChange={handleInputChange} required className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                <option>Férias</option>
                                <option>Licença médica</option>
                                <option>Home Office</option>
                                <option>Viagem de Trabalho</option>
                                <option>Pessoal</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
                            <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                         <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Fim</label>
                            <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleInputChange} required className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-3">
                        <button type="button" onClick={closeModal} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Cancelar</button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LeaveManagement;