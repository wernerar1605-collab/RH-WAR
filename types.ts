
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
  salario: string;
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
  jobIds: number[];
  stageId: number;
  avatar: string;
  resume?: string; // Base64 encoded file
  resumeName?: string; // Original filename
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
  role: 'Administrador' | 'Gestora' | 'Coordenadora' | 'Usuário';
}

export interface AccessLevel {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

export interface Department {
  id: number;
  name: string;
  departmentId?: number; // Optional for backward compatibility if needed, though strictly Role has departmentId
}

// Fixed definition to match usage in components
export interface Role {
  id: number;
  name: string;
  departmentId: number;
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