import { Card } from '../ui/Card';
import type { LucideIcon } from 'lucide-react';

export interface KPICardConfig {
    name: string;
    value: string | number;
    label?: string;
    icon: LucideIcon;
    color: string;
}

interface KPICardsProps {
    stats: KPICardConfig[];
    loading?: boolean;
}

export function KPICards({ stats, loading }: KPICardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="animate-pulse">
                        <div className="h-28 bg-slate-100 rounded-xl"></div>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {stats.map((stat) => (
                <Card
                    key={stat.name}
                    className="hover:shadow-lg transition-shadow duration-300"
                    hoverEffect
                >
                    <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-[#7A8084] mb-2 truncate">
                                {stat.name}
                            </p>
                            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
                                {stat.value}
                            </h3>
                            {stat.label && (
                                <p className="text-xs text-[#7A8084]">{stat.label}</p>
                            )}
                        </div>
                        <div
                            className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0 ml-3`}
                        >
                            <stat.icon className="w-6 h-6" strokeWidth={2} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}
