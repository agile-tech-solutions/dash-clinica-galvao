import { Card } from '../ui/Card';
import { Instagram, Facebook, Globe } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { Lead } from '../../types';

interface SourceData {
    name: string;
    value: number;
    icon: any;
    color: string;
}

interface SourcePerformanceChartProps {
    leads?: Lead[];
    loading?: boolean;
}

const SOURCE_CONFIG = {
    instagram: { name: 'Instagram', icon: Instagram, color: '#E1306C', gradient: 'from-yellow-400 via-blue-500 to-purple-600' },
    facebook: { name: 'Facebook', icon: Facebook, color: '#1877F2' },
    organic: { name: 'Orgânico', icon: Globe, color: '#64748b' },
};

export function SourcePerformanceChart({ leads = [], loading = false }: SourcePerformanceChartProps) {
    const getSourceData = (): SourceData[] => {
        if (!leads || leads.length === 0) {
            return [
                { name: 'Instagram', value: 0, icon: Instagram, color: SOURCE_CONFIG.instagram.color },
                { name: 'Facebook', value: 0, icon: Facebook, color: SOURCE_CONFIG.facebook.color },
                { name: 'Orgânico', value: 0, icon: Globe, color: SOURCE_CONFIG.organic.color },
            ];
        }

        const sourceCount = { instagram: 0, facebook: 0, organic: 0 };

        leads.forEach((lead) => {
            // Safely parse metadata
            let metadata = null;
            if (lead.metadata) {
                try {
                    metadata = typeof lead.metadata === 'string'
                        ? JSON.parse(lead.metadata)
                        : lead.metadata;
                } catch (e) {
                    metadata = null;
                }
            }

            const source = metadata?.sourceApp?.toLowerCase();
            if (source === 'instagram') {
                sourceCount.instagram++;
            } else if (source === 'facebook') {
                sourceCount.facebook++;
            } else {
                sourceCount.organic++;
            }
        });

        return [
            { name: 'Instagram', value: sourceCount.instagram, icon: Instagram, color: SOURCE_CONFIG.instagram.color },
            { name: 'Facebook', value: sourceCount.facebook, icon: Facebook, color: SOURCE_CONFIG.facebook.color },
            { name: 'Orgânico', value: sourceCount.organic, icon: Globe, color: SOURCE_CONFIG.organic.color },
        ].sort((a, b) => b.value - a.value);
    };

    const sourceData = getSourceData();
    const pieData = sourceData.map(s => ({ name: s.name, value: s.value, color: s.color }));
    const totalLeads = sourceData.reduce((sum, s) => sum + s.value, 0);

    if (loading) {
        return (
            <Card className="col-span-1">
                <div className="h-72 animate-pulse bg-slate-100 rounded-xl"></div>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            const percentage = totalLeads > 0 ? ((data.value / totalLeads) * 100).toFixed(1) : 0;
            return (
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-900">{data.name}</p>
                    <p className="text-lg font-black" style={{ color: data.color }}>{data.value} leads</p>
                    <p className="text-xs text-slate-500">{percentage}% do total</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900">Performance por Origem</h3>
                    <p className="text-sm text-slate-500 mt-1">Distribuição de fontes</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            <div className="space-y-3 mt-4">
                {sourceData.map((source) => {
                    const percentage = totalLeads > 0 ? ((source.value / totalLeads) * 100).toFixed(1) : '0.0';
                    const Icon = source.icon;

                    return (
                        <div key={source.name} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${source.color}15` }}>
                                <Icon className="w-5 h-5" style={{ color: source.color }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{source.name}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full"
                                            style={{
                                                width: `${percentage}%`,
                                                backgroundColor: source.color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 min-w-[45px] text-right">{percentage}%</span>
                                </div>
                            </div>
                            <span className="text-lg font-black text-slate-900">{source.value}</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
