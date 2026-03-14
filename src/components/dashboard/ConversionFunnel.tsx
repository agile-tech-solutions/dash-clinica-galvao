import { Card } from '../ui/Card';
import { Funnel } from 'lucide-react';
import type { Lead } from '../../types';

interface FunnelData {
    stage: string;
    value: number;
    color: string;
}

interface ConversionFunnelProps {
    leads?: Lead[];
    loading?: boolean;
}

export function ConversionFunnel({ leads = [], loading = false }: ConversionFunnelProps) {
    const getFunnelData = (): FunnelData[] => {
        if (!leads || leads.length === 0) {
            return [];
        }

        const totalLeads = leads.length;

        // Count by status for the funnel stages
        const statusCounts = new Map<string, number>();
        leads.forEach(lead => {
            const status = lead.status_lead || 'novo';
            statusCounts.set(status, (statusCounts.get(status) || 0) + 1);
        });

        // Build funnel stages based on status_lead values
        const funnelData: FunnelData[] = [];

        // Stage 1: Total Leads (all)
        funnelData.push({
            stage: 'Todos os Leads',
            value: totalLeads,
            color: '#3B82F6'
        });

        // Stage 2: Em Contato (not 'repassado' yet)
        const inContact = leads.filter(l => l.status_lead !== 'repassado').length;
        funnelData.push({
            stage: 'Em Andamento',
            value: inContact,
            color: '#a855f7'
        });

        // Stage 3: Com Interação (have data_ultima_interacao)
        const withInteraction = leads.filter(l => l.data_ultima_interacao).length;
        funnelData.push({
            stage: 'Com Interação',
            value: withInteraction,
            color: '#6366f1'
        });

        // Stage 4: Repassados (status_lead === 'repassado')
        const repassed = leads.filter(l => l.status_lead === 'repassado').length;
        funnelData.push({
            stage: 'Repassados',
            value: repassed,
            color: '#10b981'
        });

        return funnelData;
    };

    const funnelData = getFunnelData();

    if (loading) {
        return (
            <Card className="col-span-2">
                <div className="h-80 animate-pulse bg-slate-100 rounded-xl"></div>
            </Card>
        );
    }

    const hasData = funnelData.length > 0;
    const totalValue = funnelData[0]?.value || 0;
    const conversionRate = totalValue > 0
        ? ((funnelData[funnelData.length - 1]?.value || 0) / totalValue * 100).toFixed(1)
        : '0.0';

    return (
        <Card className="col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Funnel className="w-5 h-5 text-blue-500" />
                        Funil de Conversão
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {hasData ? `Taxa de conversão: ${conversionRate}%` : 'Sem dados'}
                    </p>
                </div>
            </div>

            {!hasData ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Funnel className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">Sem dados disponíveis</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-3">
                    {funnelData.map((item, index) => {
                        const percentage = totalValue > 0 ? ((item.value / totalValue) * 100) : 0;
                        const prevPercentage = index > 0 ? ((funnelData[index - 1].value / totalValue) * 100) : 100;
                        const dropRate = index > 0 && prevPercentage > 0
                            ? (((prevPercentage - percentage) / prevPercentage) * 100).toFixed(1)
                            : null;

                        return (
                            <div key={item.stage} className="relative">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-bold text-slate-700">{item.stage}</span>
                                    <div className="flex items-center gap-3">
                                        {dropRate && parseFloat(dropRate) > 0 && (
                                            <span className="text-xs font-medium text-orange-500">
                                                -{dropRate}%
                                            </span>
                                        )}
                                        <span className="text-lg font-black" style={{ color: item.color }}>
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-10 bg-slate-100 rounded-xl overflow-hidden">
                                    <div
                                        className="h-full rounded-xl flex items-center justify-end pr-4 transition-all duration-1000"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: item.color,
                                            minWidth: percentage > 0 ? '60px' : '0px'
                                        }}
                                    >
                                        {percentage > 10 && (
                                            <span className="text-xs font-bold text-white drop-shadow">
                                                {percentage.toFixed(0)}%
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}
