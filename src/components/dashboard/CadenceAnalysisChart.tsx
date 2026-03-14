import { Card } from '../ui/Card';
import { Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Lead } from '../../types';

interface CadenceData {
    day: string;
    value: number;
    conversionRate: number;
    color: string;
}

interface CadenceAnalysisChartProps {
    leads?: Lead[];
    loading?: boolean;
}

const CADENCE_COLORS: Record<string, string> = {
    '1': '#10b981', // emerald - converted on day 1
    '2': '#34d399',
    '3': '#6ee7b7',
    '4': '#a7f3d0',
    '5': '#fbbf24', // amber - taking longer
    '6': '#f59e0b',
    '7': '#f97316', // orange - at risk
    '8+': '#ef4444', // red - high risk
};

// Extract day number from various formats: 'dia 1', 'Dia 1', '1', 1, etc.
function extractDayNumber(dayValue: string | number | null | undefined): number {
    if (dayValue === null || dayValue === undefined) return 0;

    // Convert to string and remove 'dia' prefix (case insensitive) and trim spaces
    const cleaned = String(dayValue).toLowerCase().replace(/^dia\s*/, '').trim();

    // Extract first number found
    const match = cleaned.match(/\d+/);
    if (match) {
        return parseInt(match[0], 10);
    }

    return 0;
}

export function CadenceAnalysisChart({ leads = [], loading = false }: CadenceAnalysisChartProps) {
    const getCadenceData = (): CadenceData[] => {
        // Track total leads and converted leads per cadence day
        const cadenceTotalCount = new Map<string, number>();
        const cadenceConvertedCount = new Map<string, number>();

        if (!leads || leads.length === 0) {
            return [
                { day: 'Dia 1', value: 0, conversionRate: 0, color: CADENCE_COLORS['1'] },
                { day: 'Dia 2', value: 0, conversionRate: 0, color: CADENCE_COLORS['2'] },
                { day: 'Dia 3', value: 0, conversionRate: 0, color: CADENCE_COLORS['3'] },
                { day: 'Dia 4', value: 0, conversionRate: 0, color: CADENCE_COLORS['4'] },
                { day: 'Dia 5', value: 0, conversionRate: 0, color: CADENCE_COLORS['5'] },
                { day: 'Dia 6', value: 0, conversionRate: 0, color: CADENCE_COLORS['6'] },
                { day: 'Dia 7', value: 0, conversionRate: 0, color: CADENCE_COLORS['7'] },
                { day: '8+', value: 0, conversionRate: 0, color: CADENCE_COLORS['8+'] },
            ];
        }

        leads.forEach((lead) => {
            const dayNum = extractDayNumber(lead.dia_cadencia);
            let key: string;

            if (dayNum >= 8) {
                key = '8+';
            } else if (dayNum <= 0) {
                key = '1'; // Default to day 1 if not set
            } else {
                key = dayNum.toString();
            }

            // Count total leads for this cadence day
            cadenceTotalCount.set(key, (cadenceTotalCount.get(key) || 0) + 1);

            // Count converted leads (status_lead === 'repassado')
            if (lead.status_lead === 'repassado') {
                cadenceConvertedCount.set(key, (cadenceConvertedCount.get(key) || 0) + 1);
            }
        });

        const data: CadenceData[] = [];
        for (let i = 1; i <= 7; i++) {
            const key = i.toString();
            const total = cadenceTotalCount.get(key) || 0;
            const converted = cadenceConvertedCount.get(key) || 0;
            const conversionRate = total > 0 ? (converted / total) * 100 : 0;

            data.push({
                day: `Dia ${i}`,
                value: total,
                conversionRate,
                color: CADENCE_COLORS[key] || CADENCE_COLORS['1'],
            });
        }

        // Add 8+ category
        const total8Plus = cadenceTotalCount.get('8+') || 0;
        const converted8Plus = cadenceConvertedCount.get('8+') || 0;
        const conversionRate8Plus = total8Plus > 0 ? (converted8Plus / total8Plus) * 100 : 0;

        data.push({
            day: '8+',
            value: total8Plus,
            conversionRate: conversionRate8Plus,
            color: CADENCE_COLORS['8+'],
        });

        return data;
    };

    const cadenceData = getCadenceData();

    // Check if there's any actual data to display
    const hasData = cadenceData.some(d => d.value > 0);

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
            return (
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-900">{data.day}</p>
                    <p className="text-lg font-black" style={{ color: data.color }}>{data.value} leads</p>
                    {data.conversionRate > 0 && (
                        <p className="text-xs font-medium text-slate-500">
                            {data.conversionRate.toFixed(1)}% conversão
                        </p>
                    )}
                </div>
            );
        }
        return null;
    };

    const totalLeads = cadenceData.reduce((sum, d) => sum + d.value, 0);
    const avgCadenceDay = hasData
        ? cadenceData.reduce((sum, d, idx) => {
            const dayNum = idx < 7 ? idx + 1 : 8;
            return sum + (d.value * dayNum);
        }, 0) / totalLeads
        : 0;

    // Get overall conversion rate across all cadence days
    const overallConversionRate = hasData
        ? ((leads?.filter(l => l.status_lead === 'repassado').length || 0) / (leads?.length || 1)) * 100
        : 0;

    return (
        <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-500" />
                        Análise de Cadência
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                        {hasData ? `Média: ${avgCadenceDay.toFixed(1)} dias` : 'Sem dados disponíveis'}
                    </p>
                </div>
                {hasData && overallConversionRate > 0 && (
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Conversão Geral</p>
                        <p className="text-lg font-black text-emerald-500">{overallConversionRate.toFixed(1)}%</p>
                    </div>
                )}
            </div>

            {!hasData ? (
                <div className="h-48 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-medium">Sem dados de cadência</p>
                    </div>
                </div>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={cadenceData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <XAxis
                                dataKey="day"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10 }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 10 }}
                                width={25}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={28}>
                                {cadenceData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {cadenceData.map((item, idx) => {
                            const dayNum = idx < 7 ? idx + 1 : 8;
                            const bgClass = dayNum <= 4 ? 'bg-emerald-50' :
                                dayNum <= 6 ? 'bg-amber-50' :
                                dayNum === 7 ? 'bg-orange-50' : 'bg-red-50';
                            return (
                                <div key={idx} className={`text-center p-2 rounded-lg ${bgClass}`}>
                                    <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
                                    <div className="text-[10px] font-medium text-slate-500">{item.day.replace('Dia ', '')}</div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </Card>
    );
}
