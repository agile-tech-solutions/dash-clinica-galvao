import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { SocialStats } from '../../types';
import { AlertCircle, Hourglass } from 'lucide-react';

interface StatusDistributionChartProps {
    stats: SocialStats | null;
    loading?: boolean;
}

const STATUS_COLORS = {
    resolvido: '#10B981',      // Emerald Green
    encaminhado: '#3B82F6',   // Gold
    em_andamento: '#FAB11D',  // Blue
    pendente: '#EF4444',      // Red
};

const STATUS_LABELS = {
    resolvido: 'Resolvidos',
    encaminhado: 'Encaminhados',
    em_andamento: 'Em Andamento',
    pendente: 'Pendentes',
};

interface ChartData {
    [key: string]: any;
    name: string;
    value: number;
    color: string;
}

export function StatusDistributionChart({ stats, loading }: StatusDistributionChartProps) {
    // Default stats to prevent null errors
    const safeStats: SocialStats = stats || {
        resolved: 0,
        forwarded: 0,
        inProgress: 0,
        pending: 0,
        totalInteractions: 0,
    };

    // Filter out empty values for the chart
    const chartData: ChartData[] = [
        { name: STATUS_LABELS.resolvido, value: safeStats.resolved, color: STATUS_COLORS.resolvido },
        { name: STATUS_LABELS.encaminhado, value: safeStats.forwarded, color: STATUS_COLORS.encaminhado },
        { name: STATUS_LABELS.em_andamento, value: safeStats.inProgress, color: STATUS_COLORS.em_andamento },
        { name: STATUS_LABELS.pendente, value: safeStats.pending, color: STATUS_COLORS.pendente },
    ].filter(item => item.value > 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                    <p className="font-bold text-slate-800">{payload[0].name}</p>
                    <p className="text-sm text-slate-600">
                        {payload[0].value} solicitações
                    </p>
                    <p className="text-xs text-slate-400">
                        {((payload[0].value / safeStats.totalInteractions) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    const renderCustomLabel = ({ cx, cy, midAngle, outerRadius, name, percent, value }: any) => {
        if (value === 0) return null;

        const RADIAN = Math.PI / 180;
        // Posicionar labels fora do gráfico (externo)
        const radius = outerRadius + 30;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        const percentage = (percent * 100).toFixed(0);
        const textAnchor = x > cx ? 'start' : 'end';

        return (
            <text
                x={x}
                y={y}
                fill="#000000"
                textAnchor={textAnchor}
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="bold"
            >
                {`${name} ${percentage}%`}
            </text>
        );
    };

    return (
        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md h-full">
            <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">Status dos Atendimentos</h3>
                        <p className="text-sm text-slate-500 mt-1">Distribuição por situação atual</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20 flex-1">
                        <div className="w-10 h-10 border-4 border-[#056437] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : safeStats.totalInteractions === 0 ? (
                    <div className="flex items-center justify-center py-20 text-center flex-1">
                        <div>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                <AlertCircle size={32} className="text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold">Nenhum atendimento registrado</p>
                            <p className="text-sm text-slate-400 mt-2">Os dados aparecerão aqui quando houver solicitações</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex flex-col">
                        {/* Chart Area - Expanded */}
                        <div className="flex-1 min-h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={110}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={renderCustomLabel}
                                        labelLine={{
                                            stroke: '#94a3b8',
                                            strokeWidth: 1.5,
                                        }}
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Stats Cards - 2x2 Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            {/* Card 1: Taxa de Resolução */}
                            <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-xs font-semibold text-emerald-600 mb-1">
                                    Taxa de Resolução
                                </div>
                                <div className="text-2xl font-black text-emerald-700">
                                    {safeStats.totalInteractions > 0
                                        ? ((safeStats.resolved / safeStats.totalInteractions) * 100).toFixed(0)
                                        : 0}%
                                </div>
                            </div>

                            {/* Card 2: Total de Atendimentos */}
                            <div className="bg-blue-50 rounded-xl p-3 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-xs font-semibold text-blue-600 mb-1">
                                    Total de Atendimentos
                                </div>
                                <div className="text-2xl font-black text-blue-700">
                                    {safeStats.totalInteractions}
                                </div>
                            </div>

                            {/* Card 3: Em Andamento (NOVO) */}
                            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-yellow-500 text-white text-[10px] flex items-center justify-center">
                                        <Hourglass size={15} />
                                    </div>
                                    <div className="text-[10px] font-bold text-yellow-600 uppercase tracking-wider">Em Andamento</div>
                                </div>
                                <div className="text-2xl font-black text-yellow-700">
                                    {safeStats.inProgress}
                                </div>
                                <div className="text-[10px] text-yellow-500">atendimentos ativos</div>
                            </div>

                            {/* Card 4: Pendentes (NOVO) */}
                            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-6 h-6 rounded-lg bg-red-500 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Pendentes</div>
                                </div>
                                <div className="text-2xl font-black text-red-700">
                                    {safeStats.pending}
                                </div>
                                <div className="text-[10px] text-red-500">aguardando atendimento</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
