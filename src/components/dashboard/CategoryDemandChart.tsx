import { Card } from '../ui/Card';
import { Wrench } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Lead } from '../../types';

interface CategoryData {
    name: string;
    value: number;
    color: string;
}

interface CategoryDemandChartProps {
    leads?: Lead[];
    loading?: boolean;
}

const PART_COLORS: Record<string, string> = {
    'motor': '#3B82F6',
    'freio': '#ef4444',
    'suspensão': '#a855f7',
    'suspencao': '#a855f7',
    'filtro': '#22c55e',
    'embreagem': '#f59e0b',
    'alternador': '#6366f1',
    'bomba': '#ec4899',
    'disco': '#8b5cf6',
    'pastilha': '#f97316',
    'amortecedor': '#14b8a6',
    'default': '#64748b',
};

const PART_LABELS: Record<string, string> = {
    'motor': 'Motor',
    'freio': 'Freio',
    'suspensão': 'Suspensão',
    'suspencao': 'Suspensão',
    'filtro': 'Filtro',
    'embreagem': 'Embreagem',
    'alternador': 'Alternador',
    'bomba': 'Bomba',
    'disco': 'Disco',
    'pastilha': 'Pastilha',
    'amortecedor': 'Amortecedor',
};

export function CategoryDemandChart({ leads = [], loading = false }: CategoryDemandChartProps) {
    const getCategoryData = (): CategoryData[] => {
        if (!leads || leads.length === 0) {
            return [
                { name: 'Motor', value: 0, color: '#3B82F6' },
                { name: 'Freio', value: 0, color: '#ef4444' },
                { name: 'Suspensão', value: 0, color: '#a855f7' },
            ];
        }

        const categoryCount = new Map<string, number>();

        leads.forEach((lead) => {
            const part = lead.peca_interesse?.toLowerCase() || 'outros';
            const normalizedKey = PART_LABELS[part] || part;
            categoryCount.set(normalizedKey, (categoryCount.get(normalizedKey) || 0) + 1);
        });

        const data: CategoryData[] = Array.from(categoryCount.entries())
            .map(([name, count]) => ({
                name,
                value: count,
                color: PART_COLORS[name.toLowerCase()] || PART_COLORS.default,
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);

        return data.length > 0 ? data : [
            { name: 'Motor', value: 0, color: '#3B82F6' },
            { name: 'Freio', value: 0, color: '#ef4444' },
            { name: 'Suspensão', value: 0, color: '#a855f7' },
        ];
    };

    const categoryData = getCategoryData();

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
                    <p className="text-sm font-bold text-slate-900">{data.name}</p>
                    <p className="text-lg font-black" style={{ color: data.color }}>{data.value} leads</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-1">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-500" />
                        Demanda por Peça
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Peças mais procuradas</p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={50}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        width={30}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={40}>
                        {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-2 mt-4">
                {categoryData.slice(0, 6).map((cat, idx) => (
                    <div key={idx} className="text-center p-2 rounded-lg bg-slate-50">
                        <div className="text-sm font-bold text-slate-900">{cat.value}</div>
                        <div className="text-[10px] font-medium text-slate-500 truncate">{cat.name}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
