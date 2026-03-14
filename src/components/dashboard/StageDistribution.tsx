import { Card } from '../ui/Card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import type { Lead } from '../../types';

interface StageData {
    name: string;
    value: number;
    percentage: number;
    color: string;
}

interface StageDistributionProps {
    leads: Lead[];
    loading?: boolean;
    className?: string;
}

const CADENCE_COLORS: Record<string, string> = {
    'dia 1': '#3B82F6', // blue-500
    'dia 2': '#F472B6', // blue-400
    'dia 3': '#A78BFA', // violet-400
    'dia 4': '#8B5CF6', // violet-500
    'dia 5': '#7C3AED', // violet-600
    'dia 6': '#C026D3', // fuchsia-600
    'dia 7': '#DB2777', // blue-600
    'dia 8': '#9333EA', // purple-600
    'dia 9': '#7E22CE', // purple-700
    'dia 10': '#6B21A8', // purple-800
    'sem cadencia': '#94A3B8', // slate-400
    default: '#3B82F6', // default blue
};

// Sort cadence days numerically
const CADENCE_ORDER: Record<string, number> = {
    'dia 1': 1,
    'dia 2': 2,
    'dia 3': 3,
    'dia 4': 4,
    'dia 5': 5,
    'dia 6': 6,
    'dia 7': 7,
    'dia 8': 8,
    'dia 9': 9,
    'dia 10': 10,
    'sem cadencia': 999,
};

const CADENCE_LABELS: Record<string, string> = {
    'dia 1': 'Dia 1',
    'dia 2': 'Dia 2',
    'dia 3': 'Dia 3',
    'dia 4': 'Dia 4',
    'dia 5': 'Dia 5',
    'dia 6': 'Dia 6',
    'dia 7': 'Dia 7',
    'dia 8': 'Dia 8',
    'dia 9': 'Dia 9',
    'dia 10': 'Dia 10',
    'sem cadencia': 'Sem Cadência',
};

export function StageDistribution({ leads, loading = false, className = '' }: StageDistributionProps) {
    const getStageData = (): StageData[] => {
        if (!leads || leads.length === 0) return [];

        const cadenceCount = new Map<string, number>();
        const totalLeads = leads.length;

        // Count leads by cadence day (dia_cadencia)
        leads.forEach((lead) => {
            // Normalize dia_cadencia - handle various formats like "dia 1", "Dia 1", "dia1", etc.
            let cadence = 'sem cadencia';

            if (lead.dia_cadencia) {
                const cadenceStr = lead.dia_cadencia.toString().toLowerCase().trim();
                // Extract the day number if it exists
                const dayMatch = cadenceStr.match(/dia\s*(\d+)/);
                if (dayMatch) {
                    const dayNum = parseInt(dayMatch[1], 10);
                    if (dayNum >= 1 && dayNum <= 10) {
                        cadence = `dia ${dayNum}`;
                    }
                }
            }

            cadenceCount.set(cadence, (cadenceCount.get(cadence) || 0) + 1);
        });

        // Convert to array and sort by cadence day order (numerically)
        const data: StageData[] = Array.from(cadenceCount.entries())
            .map(([cadence, count]) => ({
                name: CADENCE_LABELS[cadence] || cadence,
                value: count,
                percentage: Math.round((count / totalLeads) * 100),
                color: CADENCE_COLORS[cadence] || CADENCE_COLORS.default,
            }))
            .sort((a, b) => {
                const orderA = CADENCE_ORDER[a.name.toLowerCase()] ?? 999;
                const orderB = CADENCE_ORDER[b.name.toLowerCase()] ?? 999;
                return orderA - orderB;
            });

        return data;
    };

    const stageData = getStageData();

    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload || !payload.length) return null;

        const data = payload[0].payload;
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-xl">
                <p className="text-sm font-semibold text-slate-900">{data.name}</p>
                <p className="text-lg font-bold text-blue-500">{data.value} leads</p>
                <p className="text-xs text-slate-500">{data.percentage}% do total</p>
            </div>
        );
    };

    if (loading) {
        return (
            <Card className={`animate-fade-in ${className}`}>
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-100 rounded-lg w-48 mb-4"></div>
                    <div className="h-64 bg-slate-100 rounded-xl"></div>
                </div>
            </Card>
        );
    }

    return (
        <Card className={`animate-fade-in ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Distribuição por Dia de Cadência</h3>
                    <p className="text-sm text-slate-500">Leads agrupados por dia da cadência</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-slate-500">dia_cadencia</span>
                </div>
            </div>

            {stageData.length === 0 ? (
                <div className="flex items-center justify-center h-64 text-slate-400">
                    <p>Sem dados disponíveis</p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart
                        data={stageData}
                        layout="vertical"
                        margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
                        barCategoryGap={8}
                    >
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748B', fontSize: 11 }}
                            hide
                        />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#1E293B', fontSize: 12, fontWeight: 500 }}
                            width={140}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                        <Bar
                            dataKey="value"
                            radius={[0, 8, 8, 0]}
                            maxBarSize={32}
                            className="transition-all duration-300 hover:opacity-80"
                        >
                            {stageData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="transition-all duration-300 hover:brightness-110"
                                />
                            ))}
                            <LabelList
                                dataKey="value"
                                position="right"
                                className="fill-slate-600 text-sm font-semibold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}

            {/* Legend with counts */}
            {stageData.length > 0 && (
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {stageData.slice(0, 6).map((stage, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/50 hover:bg-slate-100 transition-colors"
                        >
                            <div
                                className="w-2 h-8 rounded-full"
                                style={{ backgroundColor: stage.color }}
                            ></div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-slate-700 truncate">{stage.name}</p>
                                <p className="text-sm font-bold text-slate-900">
                                    {stage.value} <span className="text-slate-400 font-normal">({stage.percentage}%)</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
