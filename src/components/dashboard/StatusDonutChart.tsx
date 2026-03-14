import { Card } from '../ui/Card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Users, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import type { StatusDistribution } from '../../types';

interface StatusDonutChartProps {
    data: StatusDistribution[];
    loading?: boolean;
}

const statusLabels: Record<string, string> = {
    pendente: 'Pendente',
    em_andamento: 'Em Andamento',
    encaminhado: 'Encaminhado',
    resolvido: 'Resolvido',
};

export function StatusDonutChart({ data, loading }: StatusDonutChartProps) {
    if (loading) {
        return (
            <Card className="h-full">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
                        <div className="h-64 bg-slate-100 rounded-xl"></div>
                    </div>
                </div>
            </Card>
        );
    }

    // Calculate resolution rate
    const resolvedStatus = data.find(d => d.status === 'resolvido');
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const resolutionRate = total > 0 && resolvedStatus
        ? Math.round((resolvedStatus.count / total) * 100)
        : 0;

    // Custom tooltip
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">
                        {statusLabels[payload[0].name] || payload[0].name}
                    </p>
                    <p className="text-xs text-slate-600">
                        {payload[0].value} registros ({payload[0].payload.percentage}%)
                    </p>
                </div>
            );
        }
        return null;
    };

    // Custom legend
    const CustomLegend = ({ payload }: any) => {
        return (
            <div className="flex flex-wrap justify-center gap-4 mt-4">
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color || '#94A3B8' }}
                        ></div>
                        <span className="text-xs font-medium text-slate-600">
                            {statusLabels[entry.value] || entry.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <Card className="h-full">
            <div className="p-6">
                <div className="mb-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Distribuição de Status
                    </h3>
                    <p className="text-sm text-[#7A8084]">
                        Visão geral do atendimento
                    </p>
                </div>

                {data.length > 0 ? (
                    <>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.map(d => ({ ...d, name: d.status, value: d.count }))}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={2}
                                        dataKey="value"
                                        label={false}
                                    >
                                        {data.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.color || '#94A3B8'}
                                                stroke="#fff"
                                                strokeWidth={2}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend content={<CustomLegend />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 3 Cards Informativos */}
                        <div className="mt-6 pt-6 border-t border-slate-100">
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                {/* Em Andamento */}
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 border border-orange-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center shadow-sm">
                                            <Clock className="text-white w-5 h-5" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-xs text-orange-700 font-semibold uppercase">Em Andamento</span>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {data.find(d => d.status === 'em_andamento')?.count || 0}
                                    </p>
                                </div>

                                {/* Encaminhados */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm">
                                            <Users className="text-white w-5 h-5" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-xs text-blue-700 font-semibold uppercase">Encaminhados</span>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {data.find(d => d.status === 'encaminhado')?.count || 0}
                                    </p>
                                </div>

                                {/* Card com Ícones Melhores - Métricas Completas */}
                                <div className="bg-gradient-to-br from-[#18A098]/10 to-[#18A098]/20 rounded-xl p-4 border border-[#18A098]/30">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-9 h-9 rounded-lg bg-[#18A098] flex items-center justify-center shadow-sm">
                                                <TrendingUp className="text-white w-5 h-5" strokeWidth={2.5} />
                                            </div>
                                            <span className="text-xs text-[#18A098] font-semibold uppercase">Resolução</span>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-3xl font-bold text-[#18A098] leading-none">
                                                {resolutionRate}%
                                            </p>
                                            <p className="text-xs text-[#7A8084] mt-1">taxa</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-semibold text-slate-900 leading-none">
                                                {data.find(d => d.status === 'resolvido')?.count || 0}
                                            </p>
                                            <p className="text-xs text-[#7A8084] mt-1">resolvidos</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-[#18A098]/20">
                                        <CheckCircle2 className="text-[#18A098] w-3 h-3" strokeWidth={2.5} />
                                        <span className="text-xs text-[#7A8084] font-medium">
                                            {total} totais
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="h-64 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-slate-400 text-sm">Nenhum dado disponível</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
