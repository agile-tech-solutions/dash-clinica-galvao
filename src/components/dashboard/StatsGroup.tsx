import { Card } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface StatConfig {
    name: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
    color: string;
    label?: string;
}

interface StatsGroupProps {
    customStats?: StatConfig[];
    loading?: boolean;
}

const getTrendIcon = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
        case 'up':
            return <TrendingUp className="w-3 h-3 mr-1" />;
        case 'down':
            return <TrendingDown className="w-3 h-3 mr-1" />;
        case 'neutral':
            return <Minus className="w-3 h-3 mr-1" />;
        default:
            return null;
    }
};

const getTrendColor = (trend?: 'up' | 'down' | 'neutral') => {
    switch (trend) {
        case 'up':
            return 'text-emerald-600';
        case 'down':
            return 'text-red-500';
        case 'neutral':
            return 'text-slate-400';
        default:
            return 'text-slate-400';
    }
};

export function StatsGroup({ customStats, loading }: StatsGroupProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-24 bg-slate-100 rounded-xl"></div>
                    </Card>
                ))}
            </div>
        );
    }

    if (!customStats || customStats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {customStats.map((stat) => (
                <Card key={stat.name} hoverEffect>
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-slate-500 mb-1 truncate">{stat.name}</p>
                            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                            {stat.label && (
                                <p className="text-xs text-slate-400 mb-1">{stat.label}</p>
                            )}
                            {stat.change && (
                                <div className={`flex items-center text-xs font-medium ${getTrendColor(stat.trend)}`}>
                                    {getTrendIcon(stat.trend)}
                                    {stat.change}
                                    {stat.trend !== 'neutral' && (
                                        <span className="text-slate-400 ml-1 font-normal">vs. período anterior</span>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg shadow-gray-200/50 flex-shrink-0 ml-2`}>
                            <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
