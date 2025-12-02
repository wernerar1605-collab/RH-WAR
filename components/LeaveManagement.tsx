
import React, { useState, useEffect } from 'react';
import { LeaveRequest, Employee, LeaveType } from '../types';
import LeaveTimeline from './LeaveTimeline';
import LeaveReports from './LeaveReports';
import Modal from './Modal';
import { EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, UndoIcon } from './icons';

interface LeaveManagementProps {
    employees: Employee[];
    leaveRequests: LeaveRequest[];
    setLeaveRequests: React.Dispatch<React.SetStateAction<LeaveRequest[]>>;
}

const emptyFormData = {
    employeeId: '',
    type: 'Férias' as LeaveType,
    startDate: '',
    endDate: '',
};

const LeaveManagement: React.FC<LeaveManagementProps> = ({ employees, leaveRequests, setLeaveRequests }) => {
    type Tab = 'requests' | 'reports';
    const [activeTab, setActiveTab] = useState<Tab>('requests');
    const [statusFilter, setStatusFilter] = useState<'all' | 'Pendente' | 'Aprovada' | 'Rejeitada'>('all');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
    const [currentRequest, setCurrentRequest] = useState<LeaveRequest | null>(null);
    const [formData, setFormData] = useState(emptyFormData);
    
    // Ensure we have a default employee ID for the form if employees exist
    useEffect(() => {
        if (employees.length > 0 && formData.employeeId === '') {
            setFormData(prev => ({ ...prev, employeeId: employees[0].id.toString() }));
        }
    }, [employees]);

    useEffect(() => {
        if (modalMode === 'edit' && currentRequest) {
            setFormData({
                employeeId: currentRequest.employee.id.toString(),
                type: currentRequest.type,
                startDate: currentRequest.startDate,
                endDate: currentRequest.endDate,
            });
        } else {
            setFormData({
                ...emptyFormData,
                employeeId: employees.length > 0 ? employees[0].id.toString() : ''
            });
        }
    }, [modalMode, currentRequest, employees]);

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
        const employee = employees.find(emp => emp.id === parseInt(formData.employeeId));
        if (!employee) return;

        if (modalMode === 'create') {
            const newRequest: LeaveRequest = {
                id: Math.max(...leaveRequests.map(r => r.id).concat(0)) + 1,
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Gestão de Licenças</h1>
                 {activeTab === 'requests' && (
                    <button 
                        onClick={() => openModal('create')} 
                        className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Nova Solicitação
                    </button>
                )}
            </div>

             <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                 <div className="border-b border-gray-200">
                    <nav className="flex flex-wrap -mb-px px-6">
                        <TabButton tabName="requests" label="Solicitações" />
                        <TabButton tabName="reports" label="Relatórios" />
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'requests' ? (
                         <div className="space-y-8">
                            <LeaveTimeline employees={employees} requests={leaveRequests} />
                            
                             <div className="bg-white pt-6 border-t border-gray-100">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                                    <h2 className="text-xl font-bold text-gray-800">Histórico de Solicitações</h2>
                                    <div className="flex flex-wrap gap-2">
                                       <FilterButton status="all" label="Todas" count={leaveRequests.length} />
                                       <FilterButton status="Pendente" label="Pendentes" count={leaveRequests.filter(r => r.status === 'Pendente').length} />
                                       <FilterButton status="Aprovada" label="Aprovadas" count={leaveRequests.filter(r => r.status === 'Aprovada').length} />
                                       <FilterButton status="Rejeitada" label="Rejeitadas" count={leaveRequests.filter(r => r.status === 'Rejeitada').length} />
                                    </div>
                                </div>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
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
                                                <tr key={request.id} className="border-b hover:bg-gray-50 last:border-0">
                                                    <td className="p-4">
                                                        <div className="flex items-center">
                                                            <img src={request.employee.avatar} alt={request.employee.name} className="h-9 w-9 rounded-full mr-3 object-cover" />
                                                            <p className="font-medium text-gray-900 text-sm">{request.employee.name}</p>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-700 text-sm">{request.type}</td>
                                                    <td className="p-4 text-gray-700 text-sm">
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
                                                                    <button onClick={() => handleStatusChange(request.id, 'Aprovada')} className="p-1.5 text-emerald-500 hover:bg-emerald-100 rounded-full transition-colors" title="Aprovar">
                                                                        <CheckCircleIcon className="w-5 h-5" />
                                                                    </button>
                                                                    <button onClick={() => handleStatusChange(request.id, 'Rejeitada')} className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-full transition-colors" title="Rejeitar">
                                                                        <XCircleIcon className="w-5 h-5" />
                                                                    </button>
                                                                </>
                                                            )}
                                                            {request.status !== 'Pendente' && (
                                                                <button onClick={() => handleStatusChange(request.id, 'Pendente')} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors" title="Reverter para Pendente">
                                                                    <UndoIcon className="w-5 h-5" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => openModal('edit', request)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-full transition-colors" title="Editar">
                                                                <EditIcon className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDelete(request.id)} className="p-1.5 text-gray-500 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors" title="Excluir">
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredRequests.length === 0 && (
                                                <tr>
                                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                                        Nenhuma solicitação encontrada.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <LeaveReports requests={leaveRequests} employees={employees} />
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <form onSubmit={handleFormSubmit} className="p-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">{modalMode === 'create' ? 'Nova Solicitação' : 'Editar Solicitação'}</h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">Funcionário</label>
                            <select name="employeeId" id="employeeId" value={formData.employeeId} onChange={handleInputChange} required className="mt-1 block w-full bg-white pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                                {employees.filter(e => e.status === 'Ativo').map(emp => (
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
