import { Card } from '../ui/Card';
import { TrendingUp } from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from 'recharts';
import type { Lead } from '../../types';

interface VelocityData {
    date: string;
    leads: number;
    repassed: number;
    dateObj: Date;
}

interface LeadVelocityChartProps {
    leads?: Lead[];
    loading?: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4">
                <p className="text-sm font-bold text-slate-500 mb-2">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        ></div>
                        <span className="text-sm font-medium text-slate-700">{entry.name}:</span>
                        <span className="text-sm font-bold text-slate-900">{entry.value}</span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

export function LeadVelocityChart({ leads = [], loading = false }: LeadVelocityChartProps) {
    const getVelocityData = (): VelocityData[] => {
        if (!leads || leads.length === 0) {
            return [];
        }

        // Group leads by date (using created_at, or "Sem Data" for missing dates)
        const dailyStats = new Map<string, { leads: number; repassed: number }>();
        let leadsWithoutDate = 0;
        let repassedWithoutDate = 0;

        leads.forEach((lead) => {
            // Use created_at if available
            if (lead.created_at) {
                const date = new Date(lead.created_at);
                // Format date as DD/MM
                const dateKey = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!dailyStats.has(dateKey)) {
                    dailyStats.set(dateKey, { leads: 0, repassed: 0 });
                }

                const stats = dailyStats.get(dateKey)!;
                stats.leads++;
                if (lead.status_lead === 'repassado') {
                    stats.repassed++;
                }
            } else {
                // Count leads without created_at
                leadsWithoutDate++;
                if (lead.status_lead === 'repassado') {
                    repassedWithoutDate++;
                }
            }
        });

        // Convert to array and sort by date
        const data: VelocityData[] = Array.from(dailyStats.entries())
            .map(([date, stats]) => ({
                date,
                leads: stats.leads,
                repassed: stats.repassed,
                dateObj: new Date(2025, parseInt(date.split('/')[1]) - 1, parseInt(date.split('/')[0]))
            }))
            .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime())
            .slice(-7); // Last 7 days with data

        // Add "Sem Data" category if there are leads without created_at
        if (leadsWithoutDate > 0) {
            data.push({
                date: 'Sem Data',
                leads: leadsWithoutDate,
                repassed: repassedWithoutDate,
                dateObj: new Date(0) // Sort first
            });
        }

        return data;
    };

    const velocityData = getVelocityData();

    if (loading) {
        return (
            <Card className="col-span-2">
                <div className="h-72 animate-pulse bg-slate-100 rounded-xl"></div>
            </Card>
        );
    }

    const totalLeads = velocityData.reduce((sum, d) => sum + d.leads, 0);
    const totalRepassed = velocityData.reduce((sum, d) => sum + d.repassed, 0);
    const avgConversion = totalLeads > 0 ? ((totalRepassed / totalLeads) * 100).toFixed(1) : '0.0';

    const hasData = velocityData.length > 0;

    return (
        <Card className="col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-violet-500" />
                        Geração de Demanda
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {hasData ? `Média de conversão: ${avgConversion}%` : 'Aguardando dados...'}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-xs font-bold text-slate-600">Novos Leads</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-xs font-bold text-slate-600">Repassados</span>
                    </div>
                </div>
            </div>

            {!hasData ? (
                <div className="h-64 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-sm font-medium">Sem dados de leads com data de criação</p>
                        <p className="text-xs text-slate-300 mt-1">Os leads precisam ter o campo created_at preenchido</p>
                    </div>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={velocityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="repassedGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="leads"
                            name="Novos Leads"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            fill="url(#leadsGradient)"
                            animationDuration={1000}
                        />
                        <Area
                            type="monotone"
                            dataKey="repassed"
                            name="Repassados"
                            stroke="#10b981"
                            strokeWidth={3}
                            fill="url(#repassedGradient)"
                            animationDuration={1000}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}
