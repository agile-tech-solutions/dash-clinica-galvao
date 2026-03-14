import { Card } from '../ui/Card';
import { TrendingUp } from 'lucide-react';
import type { TopicData } from '../../types';

interface TopTopicsChartProps {
    topics: TopicData[];
    loading?: boolean;
}

const categoryColors: Record<string, string> = {
    'Bolsa Família': '#056437',      // Primary Green
    'Documentação': '#FAB11D',        // Secondary Gold
    'Saúde': '#10B981',               // Emerald
    'Assistência Social': '#065F46',  // Dark Green
    'Outros': '#64748B',              // Slate
};

export function TopTopicsChart({ topics, loading }: TopTopicsChartProps) {
    const top5Topics = topics.slice(0, 5);

    return (
        <Card className="col-span-1 border-none shadow-2xl bg-white/80 backdrop-blur-md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <TrendingUp className="text-[#FAB11D]" />
                            Top 5 Dores
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Assuntos mais perguntados</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#FAB11D] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : topics.length === 0 || (topics.length === 1 && topics[0].topic === 'Nenhum assunto registrado') ? (
                    <div className="flex items-center justify-center py-20 text-center">
                        <div>
                            <TrendingUp size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold">Nenhum assunto encontrado</p>
                            <p className="text-sm text-slate-400 mt-2">Os cadastros ainda não têm assunto principal informado</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {top5Topics.map((topic, index) => (
                            <div
                                key={topic.topic}
                                className="group"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Rank Number */}
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm
                                        ${index === 0 ? 'bg-gradient-to-br from-[#056437] to-[#044D2A] text-white' :
                                            index === 1 ? 'bg-gradient-to-br from-[#10B981] to-[#059669] text-white' :
                                                index === 2 ? 'bg-gradient-to-br from-[#FAB11D] to-[#E59F00] text-white' :
                                                    'bg-slate-100 text-slate-500'}`}>
                                        #{index + 1}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex h-fit items-center justify-between gap-2 mb-1">
                                            <div className='flex gap-2'>
                                                <p className="font-bold text-slate-800 text-lg leading-tight">
                                                    {topic.topic}
                                                </p>
                                                <span className="text-md font-bold text-green-800">
                                                    {topic.percentage}%
                                                </span>
                                            </div>
                                            <span className="flex-shrink-0 text-lg font-black text-[#056437]">
                                                {topic.count}
                                            </span>
                                        </div>

                                        {/* Category Badge */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span
                                                className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white"
                                                style={{ backgroundColor: categoryColors[topic.category] }}
                                            >
                                                {topic.category}
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500 ease-out"
                                                style={{
                                                    width: `${topic.percentage}%`,
                                                    backgroundColor: categoryColors[topic.category],
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
