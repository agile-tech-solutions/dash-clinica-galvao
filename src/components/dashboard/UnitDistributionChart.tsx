import { Card } from '../ui/Card';
import { Building2, Users } from 'lucide-react';
import type { UnitDistribution } from '../../types';
import clsx from 'clsx';

interface UnitDistributionChartProps {
    units: UnitDistribution[];
    loading?: boolean;
    className?: string;
}

export function UnitDistributionChart({ units, loading, className }: UnitDistributionChartProps) {
    const total = units.reduce((sum, unit) => sum + unit.count, 0);

    return (
        <Card className={clsx(className ||"col-span-1 border-none shadow-2xl bg-white/80 backdrop-blur-md")}>
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <Building2 className="text-[#056437]" />
                            Distribuição por Unidade
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Atendimentos por CRAS/CREAS</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#056437] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : units.length === 0 || (units.length === 1 && units[0].name === 'Nenhuma unidade atribuída') ? (
                    <div className="flex items-center justify-center py-20 text-center">
                        <div>
                            <Building2 size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold">Nenhuma unidade atribuída</p>
                            <p className="text-sm text-slate-400 mt-2">As unidades serão definidas pela IA durante o atendimento</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {units.map((unit) => (
                            <div
                                key={unit.name}
                                className="group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: unit.color }}
                                        ></div>
                                        <span className="font-bold text-slate-800 text-sm">
                                            {unit.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Users className="w-3 h-3" />
                                            <span>{unit.count}</span>
                                        </div>
                                        <span className="text-lg font-black" style={{ color: unit.color }}>
                                            {((unit.count / total) * 100).toFixed(0)}%
                                        </span>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${(unit.count / total) * 100}%`,
                                            backgroundColor: unit.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
}
