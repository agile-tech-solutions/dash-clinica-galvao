// ========================================
// Clínica Galvão - Database Helper
// ========================================

import { supabase } from './supabase';
import type { ClinicaLead, DashboardStats, SpecialtyData, StatusDistribution, StatusAtendimento } from '../types';

/**
 * Normalize status values from database (handles both "em andamento" and "em_andamento")
 */
function normalizeStatus(status: string | null): StatusAtendimento {
    if (!status) return 'pendente';
    // Replace spaces with underscores and handle common variations
    return status.replace(/\s+/g, '_').toLowerCase() as StatusAtendimento;
}

/**
 * Fetch all leads from clinica_galvao_leads table
 */
export async function getLeads(limit = 1000): Promise<ClinicaLead[]> {
    console.log('[clinicaDB] Buscando leads...');

    const { data, error } = await supabase
        .from('clinica_galvao_leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error('[clinicaDB] Erro ao buscar leads:', error);
        throw error;
    }

    // Normalize status values
    const normalizedData = (data as ClinicaLead[]).map(lead => ({
        ...lead,
        status_atendimento: normalizeStatus(lead.status_atendimento as string),
    }));

    console.log('[clinicaDB] Leads carregados:', normalizedData?.length || 0);
    return normalizedData || [];
}

/**
 * Fetch dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
    console.log('[clinicaDB] Buscando estatísticas...');

    const { data, error } = await supabase
        .from('clinica_galvao_leads')
        .select('status_atendimento');

    if (error) {
        console.error('[clinicaDB] Erro ao buscar stats:', error);
        throw error;
    }

    const stats: DashboardStats = {
        totalLeads: data?.length || 0,
        encaminhados: 0,
        emAndamento: 0,
        pendentes: 0,
        resolvidos: 0,
    };

    data?.forEach(item => {
        const normalizedStatus = normalizeStatus(item.status_atendimento);
        switch (normalizedStatus) {
            case 'resolvido':
                stats.resolvidos++;
                break;
            case 'em_andamento':
                stats.emAndamento++;
                break;
            case 'encaminhado':
                stats.encaminhados++;
                break;
            case 'pendente':
                stats.pendentes++;
                break;
        }
    });

    console.log('[clinicaDB] Stats:', stats);
    return stats;
}

/**
 * Fetch top specialties (especialidade_desejada)
 */
export async function getTopSpecialties(limit = 5): Promise<SpecialtyData[]> {
    console.log('[clinicaDB] Buscando especialidades...');

    const { data, error } = await supabase
        .from('clinica_galvao_leads')
        .select('especialidade_desejada');

    if (error) {
        console.error('[clinicaDB] Erro ao buscar especialidades:', error);
        throw error;
    }

    const specialties = new Map<string, number>();

    data?.forEach(item => {
        if (item.especialidade_desejada) {
            const count = specialties.get(item.especialidade_desejada) || 0;
            specialties.set(item.especialidade_desejada, count + 1);
        }
    });

    const totalCount = data?.filter(item => item.especialidade_desejada).length || 0;

    const result: SpecialtyData[] = Array.from(specialties.entries())
        .map(([especialidade, count]) => ({
            especialidade,
            count,
            percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    console.log('[clinicaDB] Top especialidades:', result);
    return result.length > 0 ? result : [];
}

/**
 * Fetch status distribution for donut chart
 */
export async function getStatusDistribution(): Promise<StatusDistribution[]> {
    console.log('[clinicaDB] Buscando distribuição de status...');

    const { data, error } = await supabase
        .from('clinica_galvao_leads')
        .select('status_atendimento');

    if (error) {
        console.error('[clinicaDB] Erro ao buscar distribuição:', error);
        throw error;
    }

    const statusCount = new Map<StatusAtendimento, number>();

    data?.forEach(item => {
        if (item.status_atendimento) {
            const normalizedStatus = normalizeStatus(item.status_atendimento);
            const count = statusCount.get(normalizedStatus) || 0;
            statusCount.set(normalizedStatus, count + 1);
        }
    });

    const totalCount = data?.length || 0;

    const statusColors: Record<StatusAtendimento, string> = {
        pendente: '#EF4444',
        em_andamento: '#F97316',
        encaminhado: '#3B82F6',
        resolvido: '#18A098',
    };

    const result: StatusDistribution[] = Array.from(statusCount.entries())
        .map(([status, count]) => ({
            status,
            count,
            percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
            color: statusColors[status],
        }))
        .sort((a, b) => b.count - a.count);

    console.log('[clinicaDB] Distribuição de status:', result);
    return result.length > 0 ? result : [];
}

/**
 * Filter leads by status
 */
export function filterLeadsByStatus(leads: ClinicaLead[], status: StatusAtendimento | 'todos'): ClinicaLead[] {
    if (status === 'todos') return leads;
    return leads.filter(lead => lead.status_atendimento === status);
}
