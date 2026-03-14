// ========================================
// Social Assistance Database Helper
// ========================================

import { supabase } from './supabase';
import type { Cadastro, StatusSolicitacao, NeighborhoodData, TopicData } from '../types';

export interface DashboardFilters {
    status: StatusSolicitacao | 'all';
    dateRange: '7d' | '30d' | '90d' | 'all';
}

export interface DashboardStats {
    totalInteractions: number;
    resolved: number;
    inProgress: number;
    forwarded: number;
    pending: number;
}

/**
 * Fetch all cadastros with optional filters
 */
export async function getCadastros(filters: DashboardFilters = { status: 'all', dateRange: 'all' }) {
    console.log('[socialDB] Buscando cadastros com filtros:', filters);

    let query = supabase
        .from('sec_acao_social_trairi_cadastros')
        .select('*')
        .order('data_ultima_interacao', { ascending: false, nullsFirst: false });

    // Apply status filter
    if (filters.status !== 'all') {
        query = query.eq('status', filters.status);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
        const days = parseInt(filters.dateRange);
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        query = query.gte('data_ultima_interacao', dateLimit.toISOString());
    }

    const { data, error } = await query.limit(1000);

    console.log('[socialDB] Resultado:', { data: data?.length || 0, error });

    if (error) {
        console.error('[socialDB] Erro na query:', error);
        throw error;
    }

    return (data as Cadastro[]) || [];
}

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    console.log('[socialDB] Buscando estatísticas...');

    const { data, error } = await supabase
        .from('sec_acao_social_trairi_cadastros')
        .select('status');

    console.log('[socialDB] Stats raw data:', { count: data?.length || 0, data, error });

    if (error) {
        console.error('[socialDB] Erro ao buscar stats:', error);
        throw error;
    }

    const stats: DashboardStats = {
        totalInteractions: data.length || 0,
        resolved: 0,
        inProgress: 0,
        forwarded: 0,
        pending: 0,
    };

    data?.forEach(item => {
        if (item.status === 'resolvido') stats.resolved++;
        else if (item.status === 'em_andamento') stats.inProgress++;
        else if (item.status === 'encaminhado') stats.forwarded++;
        else if (item.status === 'pendente') stats.pending++;
    });

    console.log('[socialDB] Stats processadas:', stats);

    return stats;
}

/**
 * Fetch neighborhood distribution
 */
export async function getNeighborhoodDistribution(): Promise<NeighborhoodData[]> {
    const { data, error } = await supabase
        .from('sec_acao_social_trairi_cadastros')
        .select('distrito');

    if (error) throw error;

    const distribution = new Map<string, number>();

    data?.forEach(item => {
        if (item.distrito) {  // Only count if distrito is not null
            const count = distribution.get(item.distrito) || 0;
            distribution.set(item.distrito, count + 1);
        }
    });

    // Map districts to regions and estimated population
    const districtInfo: Record<string, { region: string, population: number }> = {
        'Trairi': { region: 'Centro/Sede', population: 15000 },
        'Córrego Fundo': { region: 'Centro/Sede', population: 2000 },
        'Flecheiras': { region: 'Mundaú/Litoral', population: 3000 },
        'Gualdrapas': { region: 'Canaã/Sede', population: 1500 },
        'Canaã': { region: 'Canaã/Sede', population: 2500 },
        'Mundaú': { region: 'Mundaú/Litoral', population: 4000 },
        'Munguba': { region: 'Mundaú/Litoral', population: 1200 },
    };

    const result: NeighborhoodData[] = Array.from(distribution.entries())
        .map(([neighborhood, requestCount]) => ({
            name: neighborhood,
            requestCount,
            region: (districtInfo[neighborhood]?.region || 'Outros') as NeighborhoodData['region'],
            population: districtInfo[neighborhood]?.population || 1000,
        }))
        .sort((a, b) => b.requestCount - a.requestCount);

    // If no neighborhoods found, return empty array
    if (result.length === 0) {
        return [];
    }

    return result;
}

/**
 * Fetch top topics
 */
export async function getTopTopics(limit = 5): Promise<TopicData[]> {
    const { data, error } = await supabase
        .from('sec_acao_social_trairi_cadastros')
        .select('assunto_principal');

    if (error) throw error;

    const topics = new Map<string, number>();

    data?.forEach(item => {
        if (item.assunto_principal) {
            const count = topics.get(item.assunto_principal) || 0;
            topics.set(item.assunto_principal, count + 1);
        }
    });

    const totalCount = data?.filter(item => item.assunto_principal).length || 0;

    const result: TopicData[] = Array.from(topics.entries())
        .map(([topic, count]) => {
            // Categorize topics based on keywords
            let category: TopicData['category'] = 'Outros';
            const topicLower = topic.toLowerCase();

            if (topicLower.includes('bolsa') || topicLower.includes('família') || topicLower.includes('auxílio')) {
                category = 'Bolsa Família';
            } else if (topicLower.includes('documento') || topicLower.includes('rg') || topicLower.includes('cpf') || topicLower.includes('identidade')) {
                category = 'Documentação';
            } else if (topicLower.includes('saúde') || topicLower.includes('médico') || topicLower.includes('remédio') || topicLower.includes('hospital')) {
                category = 'Saúde';
            } else if (topicLower.includes('cesta') || topicLower.includes('alimento') || topicLower.includes('creas') || topicLower.includes('cras')) {
                category = 'Assistência Social';
            }

            return {
                topic,
                count,
                percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
                category
            };
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    // If no topics found, return default message
    if (result.length === 0) {
        return [{
            topic: 'Nenhum assunto registrado',
            count: 0,
            percentage: 0,
            category: 'Outros'
        }];
    }

    return result;
}

/**
 * Fetch unit distribution
 */
export async function getUnitDistribution() {
    const { data, error } = await supabase
        .from('sec_acao_social_trairi_cadastros')
        .select('unidade');

    if (error) throw error;

    const distribution = new Map<string, number>();

    data?.forEach(item => {
        if (item.unidade) {
            const count = distribution.get(item.unidade) || 0;
            distribution.set(item.unidade, count + 1);
        }
    });

    const result = Array.from(distribution.entries())
        .map(([unit, count]) => {
            // Assign colors based on unit
            const colorMap: Record<string, string> = {
                'CRAS 1': '#056437',
                'CRAS 2': '#10B981',
                'CRAS 3': '#3B82F6',
                'CadUnico': '#FAB11D',
                'Geral': '#6B7280',
            };
            return {
                name: unit,
                count,
                color: colorMap[unit] || '#6B7280'
            };
        })
        .sort((a, b) => b.count - a.count);

    // If no units assigned, return default message
    if (result.length === 0) {
        return [{
            name: 'Nenhuma unidade atribuída',
            count: 0,
            color: '#9CA3AF'
        }];
    }

    return result;
}

/**
 * Fetch chat history for a session
 */
export async function getChatHistory(sessionId: string) {
    const { data, error } = await supabase
        .from('n8n_chat_histories_trairi_sec_acao_social')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
}

/**
 * Fetch all citizens (for Chat component)
 */
export async function getCitizens() {
    const { data, error } = await supabase
        .from('sec_acao_social_trairi_cadastros')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5000);

    if (error) throw error;
    return (data as Cadastro[]) || [];
}
