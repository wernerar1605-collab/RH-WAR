
export interface Employee {
  id: number;
  name: string;
  cpf: string;
  rg: string;
  dataDeNascimento: string;
  email: string;
  telefone: string;
  role: string;
  department: string;
  dataDeAdmissao: string;
  regimeDeTrabalho: string;
  avatar: string;
  status: 'Ativo' | 'Inativo';
}

export type LeaveType = 'Férias' | 'Licença médica' | 'Home Office' | 'Viagem de Trabalho' | 'Pessoal';


export interface LeaveRequest {
  id: number;
  employee: Employee;
  type: LeaveType;
  startDate: string;
  endDate: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
}

export interface Candidate {
  id: number;
  name: string;
  jobId: number;
  stageId: number;
  resumeSummary: string;
  avatar: string;
  resume: string; // Base64 string of the uploaded file
}

export interface PerformanceReview {
  id: number;
  employee: Employee;
  date: string;
  reviewer: string;
  feedback: string;
  rating: number;
  aiSuggestion: string;
}

export interface SystemUser {
  id: number;
  name: string;
  login: string;
  password?: string; // Senha pode ser opcional ao exibir
  avatar: string;
  role: 'Administrador' | 'Usuário';
}

export interface Department {
  id: number;
  name: string;
}

export interface Role {
  id: number;
  name: string;
  departmentId: number;
  salary: string;
}

export interface Contract {
  id: number;
  name: string;
  description: string;
}

export interface Job {
  id: number;
  title: string;
  department: string;
  description: string;
  status: 'Aberto' | 'Fechado';
}

export interface Stage {
  id: number;
  name: string;
}