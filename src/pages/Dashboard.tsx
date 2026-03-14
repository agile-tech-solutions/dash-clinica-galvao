import { useState, useEffect } from 'react';
import { KPICards, type KPICardConfig } from '../components/dashboard/KPICards';
import { StatusDonutChart } from '../components/dashboard/StatusDonutChart';
import { TopSpecialties } from '../components/dashboard/TopSpecialties';
import { RecentLeadsTable } from '../components/dashboard/RecentLeadsTable';
import {
    Users,
    UserRound,
    Hourglass,
    AlertCircle,
    Filter,
} from 'lucide-react';
import clsx from 'clsx';
import * as clinicaDB from '../lib/clinicaDatabase';
import type { ClinicaLead } from '../types';

type StatusFilter = 'todos' | 'resolvido' | 'encaminhado' | 'em_andamento' | 'pendente';

export function Dashboard() {
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos');
    const [loading, setLoading] = useState(true);

    // Real data from database
    const [leads, setLeads] = useState<ClinicaLead[]>([]);
    const [stats, setStats] = useState<Awaited<ReturnType<typeof clinicaDB.getDashboardStats>> | null>(null);
    const [specialties, setSpecialties] = useState<Awaited<ReturnType<typeof clinicaDB.getTopSpecialties>> | null>(null);
    const [statusDistribution, setStatusDistribution] = useState<Awaited<ReturnType<typeof clinicaDB.getStatusDistribution>> | null>(null);

    // Fetch data on mount
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                const [leadsData, statsData, specialtiesData, statusData] = await Promise.all([
                    clinicaDB.getLeads(),
                    clinicaDB.getDashboardStats(),
                    clinicaDB.getTopSpecialties(5),
                    clinicaDB.getStatusDistribution(),
                ]);

                console.log('[Dashboard] Dados carregados:', {
                    leads: leadsData.length,
                    stats: statsData,
                    specialties: specialtiesData,
                    statusDistribution: statusData,
                });

                setLeads(leadsData);
                setStats(statsData);
                setSpecialties(specialtiesData);
                setStatusDistribution(statusData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    // Filter leads based on status
    const filteredLeads = statusFilter === 'todos'
        ? leads
        : leads.filter(lead => lead.status_atendimento === statusFilter);

    console.log('[Dashboard] Leads filtrados:', {
        total: leads.length,
        filtrados: filteredLeads.length,
        filtro: statusFilter
    });

    // KPI configurations for the cards
    const kpiConfig: KPICardConfig[] = [
        {
            name: 'Total de Atendimentos',
            value: stats?.totalLeads || 0,
            label: 'Acumulado Total',
            icon: Users,
            color: 'bg-[#18A098]',
        },
        {
            name: 'Encaminhados',
            value: stats?.encaminhados || 0,
            label: 'Para outros profissionais',
            icon: UserRound,
            color: 'bg-blue-500',
        },
        {
            name: 'Em Andamento',
            value: stats?.emAndamento || 0,
            label: 'Em tratamento',
            icon: Hourglass,
            color: 'bg-orange-500',
        },
        {
            name: 'Pendentes',
            value: stats?.pendentes || 0,
            label: 'Aguardando atendimento',
            icon: AlertCircle,
            color: 'bg-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-2 sm:p-4 lg:p-4">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Clínica Galvão
                    </h1>
                    <p className="text-sm text-[#7A8084] mt-1">
                        Dashboard de Atendimentos
                    </p>
                </div>

                {/* Filter Controls */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-2xl shadow-sm border border-slate-100">
                        <Filter className="text-slate-400 w-4 h-4" />
                        <span className="text-xs font-bold text-slate-500">Filtros:</span>
                    </div>

                    {/* Status Filter */}
                    <div className="flex gap-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-1">
                        {(['todos', 'resolvido', 'encaminhado', 'em_andamento', 'pendente'] as StatusFilter[]).map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={clsx(
                                    "px-3 py-1.5 rounded-xl text-xs font-bold transition-all",
                                    statusFilter === status
                                        ? "bg-[#18A098] text-white shadow-md"
                                        : "text-slate-500 hover:bg-slate-50"
                                )}
                            >
                                {status === 'todos' ? 'Todos' :
                                 status === 'resolvido' ? 'Resolvidos' :
                                 status === 'encaminhado' ? 'Encaminhados' :
                                 status === 'em_andamento' ? 'Em Andamento' : 'Pendentes'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI Cards - Top Row */}
            <KPICards stats={kpiConfig} loading={loading} />

            {/* Charts Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Status Donut Chart - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <StatusDonutChart data={statusDistribution || []} loading={loading} />
                </div>

                {/* Top Specialties - Sidebar */}
                <div className="lg:col-span-1">
                    <TopSpecialties specialties={specialties || []} loading={loading} />
                </div>
            </div>

            {/* Recent Leads Table Section */}
            <div>
                <RecentLeadsTable leads={filteredLeads} loading={loading} />
            </div>
        </div>
    );
}
