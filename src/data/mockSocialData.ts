// ========================================
// Mock Data - Ação Social Dashboard
// ========================================
// Simulated data for 100 fictional interactions distributed across Trairi neighborhoods

export interface NeighborhoodData {
    name: string;
    requestCount: number;
    region: 'Centro/Sede' | 'Mundaú/Litoral' | 'Canaã/Sede' | 'Outros';
    population: number;
}

export interface TopicData {
    topic: string;
    count: number;
    percentage: number;
    category: 'Bolsa Família' | 'Documentação' | 'Saúde' | 'Assistência Social' | 'Outros';
}

export interface TimeSavingsData {
    hoursSaved: number;
    estimatedAttendees: number;
    avgMinutesPerInteraction: number;
    timeSavedDisplay: string;
}

export interface SocialInteraction {
    id: string;
    citizenName: string;
    neighborhood: string;
    topic: string;
    date: string;
    status: 'resolvido' | 'encaminhado' | 'em_andamento' | 'pendente';
    unit: 'CRAS_1' | 'CRAS_2' | 'CadUnico' | 'Geral';
}

// Neighborhoods in Trairi
export const neighborhoods: NeighborhoodData[] = [
    { name: 'Trairi (Centro)', requestCount: 28, region: 'Centro/Sede', population: 12000 },
    { name: 'Mundaú', requestCount: 18, region: 'Mundaú/Litoral', population: 3500 },
    { name: 'Guajiru', requestCount: 15, region: 'Mundaú/Litoral', population: 2800 },
    { name: 'Canaã', requestCount: 12, region: 'Canaã/Sede', population: 2200 },
    { name: 'Flexeiras', requestCount: 9, region: 'Outros', population: 1800 },
    { name: 'Mataraca', requestCount: 7, region: 'Outros', population: 1500 },
    { name: 'São Vicente', requestCount: 6, region: 'Outros', population: 1200 },
    { name: 'Ipueiras', requestCount: 5, region: 'Outros', population: 900 },
];

// Top 5 Pain Points / Most Requested Topics
export const topTopics: TopicData[] = [
    { topic: 'Bolsa Família - Cadastro e Atualização', count: 35, percentage: 35, category: 'Bolsa Família' },
    { topic: 'Documentação Pessoal (RG, CPF, CNH)', count: 22, percentage: 22, category: 'Documentação' },
    { topic: 'Cadastro Único (CadÚnico)', count: 15, percentage: 15, category: 'Assistência Social' },
    { topic: 'Saúde - Marcação de Consultas', count: 12, percentage: 12, category: 'Saúde' },
    { topic: 'CRAS - Agendamento e Informações', count: 10, percentage: 10, category: 'Assistência Social' },
    { topic: 'Outros Assuntos', count: 6, percentage: 6, category: 'Outros' },
];

// Time Savings Calculation
export const timeSavings: TimeSavingsData = {
    hoursSaved: 147, // 100 interactions * ~15 minutes saved per interaction = 25 hours (scaled for demo)
    estimatedAttendees: 100,
    avgMinutesPerInteraction: 15,
    timeSavedDisplay: '147 horas',
};

// Mock Interactions for detailed view (25 sample interactions)
export const mockInteractions: SocialInteraction[] = [
    { id: '1', citizenName: 'Maria Silva', neighborhood: 'Trairi (Centro)', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-15', status: 'resolvido', unit: 'CadUnico' },
    { id: '2', citizenName: 'João Santos', neighborhood: 'Mundaú', topic: 'Documentação Pessoal (RG, CPF, CNH)', date: '2025-01-15', status: 'encaminhado', unit: 'CRAS_1' },
    { id: '3', citizenName: 'Ana Oliveira', neighborhood: 'Guajiru', topic: 'Cadastro Único (CadÚnico)', date: '2025-01-15', status: 'resolvido', unit: 'CadUnico' },
    { id: '4', citizenName: 'Carlos Lima', neighborhood: 'Canaã', topic: 'Saúde - Marcação de Consultas', date: '2025-01-15', status: 'em_andamento', unit: 'CRAS_2' },
    { id: '5', citizenName: 'Fernanda Costa', neighborhood: 'Trairi (Centro)', topic: 'CRAS - Agendamento e Informações', date: '2025-01-14', status: 'resolvido', unit: 'CRAS_1' },
    { id: '6', citizenName: 'Roberto Alves', neighborhood: 'Flexeiras', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-14', status: 'pendente', unit: 'CadUnico' },
    { id: '7', citizenName: 'Juliana Pereira', neighborhood: 'Mataraca', topic: 'Documentação Pessoal (RG, CPF, CNH)', date: '2025-01-14', status: 'resolvido', unit: 'CRAS_2' },
    { id: '8', citizenName: 'Marcos Rocha', neighborhood: 'São Vicente', topic: 'Cadastro Único (CadÚnico)', date: '2025-01-13', status: 'encaminhado', unit: 'CadUnico' },
    { id: '9', citizenName: 'Beatriz Nunes', neighborhood: 'Mundaú', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-13', status: 'resolvido', unit: 'CadUnico' },
    { id: '10', citizenName: 'Pedro Henrique', neighborhood: 'Guajiru', topic: 'Saúde - Marcação de Consultas', date: '2025-01-13', status: 'em_andamento', unit: 'CRAS_1' },
    { id: '11', citizenName: 'Luana Souza', neighborhood: 'Trairi (Centro)', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-12', status: 'resolvido', unit: 'CadUnico' },
    { id: '12', citizenName: 'Ricardo Ferreira', neighborhood: 'Canaã', topic: 'Documentação Pessoal (RG, CPF, CNH)', date: '2025-01-12', status: 'resolvido', unit: 'CRAS_1' },
    { id: '13', citizenName: 'Camila Rodrigues', neighborhood: 'Ipueiras', topic: 'Saúde - Marcação de Consultas', date: '2025-01-12', status: 'encaminhado', unit: 'CRAS_2' },
    { id: '14', citizenName: 'Felipe Martins', neighborhood: 'Trairi (Centro)', topic: 'Cadastro Único (CadÚnico)', date: '2025-01-11', status: 'resolvido', unit: 'CadUnico' },
    { id: '15', citizenName: 'Patricia Araujo', neighborhood: 'Mundaú', topic: 'CRAS - Agendamento e Informações', date: '2025-01-11', status: 'em_andamento', unit: 'CRAS_1' },
    { id: '16', citizenName: 'Eduardo Lima', neighborhood: 'Flexeiras', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-10', status: 'pendente', unit: 'CadUnico' },
    { id: '17', citizenName: 'Larissa Costa', neighborhood: 'Guajiru', topic: 'Documentação Pessoal (RG, CPF, CNH)', date: '2025-01-10', status: 'resolvido', unit: 'CRAS_2' },
    { id: '18', citizenName: 'Gustavo Alves', neighborhood: 'Trairi (Centro)', topic: 'Saúde - Marcação de Consultas', date: '2025-01-09', status: 'resolvido', unit: 'CRAS_2' },
    { id: '19', citizenName: 'Mariana Pereira', neighborhood: 'Canaã', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-09', status: 'em_andamento', unit: 'CadUnico' },
    { id: '20', citizenName: 'Lucas Rocha', neighborhood: 'São Vicente', topic: 'Cadastro Único (CadÚnico)', date: '2025-01-08', status: 'encaminhado', unit: 'CadUnico' },
    { id: '21', citizenName: 'Isabella Nunes', neighborhood: 'Mataraca', topic: 'CRAS - Agendamento e Informações', date: '2025-01-08', status: 'resolvido', unit: 'CRAS_1' },
    { id: '22', citizenName: 'Rafael Silva', neighborhood: 'Mundaú', topic: 'Bolsa Família - Cadastro e Atualização', date: '2025-01-07', status: 'resolvido', unit: 'CadUnico' },
    { id: '23', citizenName: 'Bruna Santos', neighborhood: 'Trairi (Centro)', topic: 'Documentação Pessoal (RG, CPF, CNH)', date: '2025-01-07', status: 'pendente', unit: 'CRAS_1' },
    { id: '24', citizenName: 'Thiago Oliveira', neighborhood: 'Ipueiras', topic: 'Saúde - Marcação de Consultas', date: '2025-01-06', status: 'resolvido', unit: 'CRAS_2' },
    { id: '25', citizenName: 'Carla Costa', neighborhood: 'Flexeiras', topic: 'Cadastro Único (CadÚnico)', date: '2025-01-06', status: 'em_andamento', unit: 'CadUnico' },
];

// CRAS/CREAS Unit Distribution
export const unitDistribution = [
    { name: 'CRAS 1 (Centro/Sede)', count: 45, color: '#056437' },
    { name: 'CRAS 2 (Mundaú/Litoral)', count: 30, color: '#FAB11D' },
    { name: 'CadÚnico (Canaã/Sede)', count: 15, color: '#10B981' },
    { name: 'Geral/Outros', count: 10, color: '#64748B' },
];

// Statistics for summary cards
export const socialStats = {
    totalInteractions: 100,
    resolved: 62,
    forwarded: 18,
    inProgress: 12,
    pending: 8,
    satisfactionRate: 94.5, // percentage
    avgResponseTime: '3 minutos',
    activeUnits: 3,
};

// Heat map data for neighborhoods (intensity 0-100)
export const neighborhoodHeatMap: NeighborhoodData[] = neighborhoods.map(n => ({
    ...n,
    intensity: Math.round((n.requestCount / 30) * 100), // Normalize to 0-100
}));

// Export all data as a single object for easy importing
export const mockSocialData = {
    neighborhoods,
    topTopics,
    timeSavings,
    mockInteractions,
    unitDistribution,
    socialStats,
    neighborhoodHeatMap,
};

// Default export
export default mockSocialData;
