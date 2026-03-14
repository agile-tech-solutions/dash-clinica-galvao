// ========================================
// Clínica Galvão - Type Definitions
// ========================================

export type StatusAtendimento = 'pendente' | 'em_andamento' | 'encaminhado' | 'resolvido';

export interface ClinicaLead {
    id: string | number;
    cpf: string | null;
    nome_completo: string | null;
    data_nascimento: string | null;
    telefone: string | null;
    especialidade_desejada: string | null;
    resumo_sintomas: string | null;
    status_atendimento: StatusAtendimento;
    ultima_interacao: string | null;
    created_at: string | null;
    etapa_follow: string | null;
    dia_cadencia: string | null;
    horario_preferencia: string | null;
}

export interface DashboardStats {
    totalLeads: number;
    encaminhados: number;
    emAndamento: number;
    pendentes: number;
    resolvidos: number;
}

export interface SpecialtyData {
    especialidade: string;
    count: number;
    percentage: number;
}

export interface StatusDistribution {
    status: StatusAtendimento;
    count: number;
    percentage: number;
    color: string;
}

// ========================================
// Legacy Types - For other pages
// ========================================

export interface Lead {
    id: string | number;
    lead_name: string | null;
    telefone: string | null;
    status_lead: string | null;
    cidade_lead?: string | null;
    peca_interesse: string | null;
    lado_peca: string | null;
    carro_modelo: string | null;
    carro_ano: number | null;
    carro_motor: string | null;
    etapa_follow: string | null;
    dia_cadencia?: string | number | null;
    data_ultima_interacao: string | null;
    created_at?: string;
    metadata?: Record<string, unknown> | string;
    repassado?: boolean | null;
    observacoes?: string | null;
}

export interface ChatMessage {
    type: 'human' | 'ai';
    content: string;
}

export interface ChatHistory {
    id: number;
    session_id: string;
    message: ChatMessage;
    created_at?: string;
}

export type FileType = 'catalogo' | 'prova_social' | 'guia_medidas' | 'geral';

export interface CatalogFile {
    id: string;
    nome_arquivo: string;
    tipo: FileType;
    file_url: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
    ativo: boolean;
    created_at: string;
    updated_at: string;
}

export interface FilaDaVezConsultor {
    id: number;
    created_at: string;
    consultor: string | null;
    status: string | null;
    ultimo_lead: string | null;
    remoteJid_consultor: string | null;
}

export interface NeighborhoodData {
    name: string;
    requestCount: number;
    region: 'Centro/Sede' | 'Mundaú/Litoral' | 'Canaã/Sede' | 'Outros';
    population: number;
    intensity?: number;
}

export interface TopicData {
    topic: string;
    count: number;
    percentage: number;
    category: 'Bolsa Família' | 'Documentação' | 'Saúde' | 'Assistência Social' | 'Outros';
}

export interface SocialInteraction {
    id: string;
    citizenName: string;
    neighborhood: string;
    topic: string;
    date: string;
    status: 'resolvido' | 'encaminhado' | 'em_andamento' | 'pendente';
    unit: 'CRAS 1' | 'CRAS 2' | 'CRAS 3' | 'CadUnico' | 'Geral';
}

export interface SocialStats {
    totalInteractions: number;
    resolved: number;
    forwarded: number;
    inProgress: number;
    pending: number;
}

export interface UnitDistribution {
    name: string;
    count: number;
    color: string;
}

export type DistritoTrairi = 'Trairi' | 'Córrego Fundo' | 'Flecheiras' | 'Gualdrapas' | 'Canaã' | 'Mundaú' | 'Munguba';

export type StatusSolicitacao = 'pendente' | 'em_andamento' | 'encaminhado' | 'resolvido';

export type UnidadeCRAS = 'CRAS 1' | 'CRAS 2' | 'CRAS 3' | 'CadUnico' | 'Geral';

export interface Cadastro {
    id: number;
    nome: string | null;
    telefone: string | null;
    distrito: DistritoTrairi;
    assunto_principal: string | null;
    data_ultima_interacao: string | null;
    status: StatusSolicitacao;
    unidade: UnidadeCRAS | null;
    created_at?: string;
    updated_at?: string;
}

export interface N8NChatHistory {
    id: number;
    session_id: string;
    message: ChatMessage;
    created_at: string;
    id_cadastro?: number | null;
}
