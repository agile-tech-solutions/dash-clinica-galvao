import { Card } from '../ui/Card';
import { AlertTriangle, Clock, MessageCircle } from 'lucide-react';
import type { Lead } from '../../types';

interface LostLead {
    id: string | number;
    name: string;
    phone: string | null;
    riskDays: number;
    lastInteraction: string;
    stage: string;
}

interface LeadsPerdidosCardProps {
    leads?: Lead[];
    loading?: boolean;
}

const RISK_THRESHOLD = 7;    // 7+ days without interaction = lost lead

export function LeadsPerdidosCard({ leads = [], loading = false }: LeadsPerdidosCardProps) {
    const getLostLeads = (): LostLead[] => {
        if (!leads || leads.length === 0) return [];

        const lost: LostLead[] = leads
            .filter(lead => {
                // Only include leads that are not repassado
                if (lead.status_lead === 'repassado') return false;
                // No interaction OR last interaction was 7+ days ago
                if (!lead.data_ultima_interacao) return true;

                const lastInteraction = new Date(lead.data_ultima_interacao);
                const daysSince = Math.floor((Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));
                return daysSince >= RISK_THRESHOLD;
            })
            .map(lead => {
                const lastInteraction = lead.data_ultima_interacao || lead.created_at
                    ? new Date(lead.data_ultima_interacao || lead.created_at || Date.now())
                    : new Date();

                const daysSince = Math.floor((Date.now() - lastInteraction.getTime()) / (1000 * 60 * 60 * 24));

                return {
                    id: lead.id,
                    name: lead.lead_name || lead.telefone || 'Sem nome',
                    phone: lead.telefone,
                    riskDays: daysSince,
                    lastInteraction: lastInteraction.toLocaleDateString('pt-BR'),
                    stage: lead.etapa_follow || lead.status_lead || 'novo',
                };
            })
            .sort((a, b) => b.riskDays - a.riskDays);

        return lost;
    };

    const lostLeads = getLostLeads();

    if (loading) {
        return (
            <Card className="col-span-1">
                <div className="h-72 animate-pulse bg-slate-100 rounded-xl"></div>
            </Card>
        );
    }

    return (
        <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-rose-500" />
                        Leads Perdidos
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {lostLeads.length} sem interacao (7+ dias)
                    </p>
                </div>
            </div>

            {lostLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <MessageCircle className="w-12 h-12 mb-2 opacity-50" />
                    <p className="text-sm font-medium">Nenhum lead perdido</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {lostLeads.map((lead) => (
                        <div
                            key={lead.id}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">
                                        {lead.name}
                                    </p>
                                    <p className="text-xs text-slate-500 truncate">
                                        {lead.phone || lead.stage}
                                    </p>
                                </div>
                                <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-rose-50 text-rose-600">
                                    Perdido
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{lead.riskDays} dias sem interacao</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {lostLeads.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium">Total perdido</span>
                        <span className="text-lg font-black text-rose-600">{lostLeads.length}</span>
                    </div>
                </div>
            )}
        </Card>
    );
}
