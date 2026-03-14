import { Card } from '../ui/Card';
import { Stethoscope } from 'lucide-react';
import type { SpecialtyData } from '../../types';

interface TopSpecialtiesProps {
    specialties: SpecialtyData[];
    loading?: boolean;
}

export function TopSpecialties({ specialties, loading }: TopSpecialtiesProps) {
    if (loading) {
        return (
            <Card className="h-full">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-slate-100 rounded w-1/2 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    const maxCount = specialties.length > 0 ? specialties[0].count : 1;

    return (
        <Card className="h-full">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#18A098] flex items-center justify-center text-white">
                        <Stethoscope className="w-5 h-5" strokeWidth={2} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">
                            Top Especialidades
                        </h3>
                        <p className="text-xs text-[#7A8084]">
                            Mais procuradas
                        </p>
                    </div>
                </div>

                {specialties.length > 0 ? (
                    <div className="space-y-4">
                        {specialties.map((specialty, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                                            index === 0 ? 'bg-[#18A098] text-white' :
                                            index === 1 ? 'bg-teal-100 text-[#18A098]' :
                                            index === 2 ? 'bg-teal-50 text-[#18A098]' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 truncate">
                                            {specialty.especialidade}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                                        <span className="text-xs font-medium text-[#7A8084]">
                                            {specialty.percentage}%
                                        </span>
                                        <span className="text-sm font-bold text-[#18A098]">
                                            {specialty.count}
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#18A098] to-[#15b5a8] rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${(specialty.count / maxCount) * 100}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex items-center justify-center">
                        <div className="text-center">
                            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-400 text-sm">Nenhuma especialidade registrada</p>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
