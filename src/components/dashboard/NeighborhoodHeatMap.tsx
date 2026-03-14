import { Card } from '../ui/Card';
import { MapPin, Users } from 'lucide-react';
import type { NeighborhoodData } from '../../types';

interface NeighborhoodHeatMapProps {
    neighborhoods: NeighborhoodData[];
    loading?: boolean;
}

export function NeighborhoodHeatMap({ neighborhoods, loading }: NeighborhoodHeatMapProps) {
    // Sort by request count
    const sortedNeighborhoods = [...neighborhoods].sort((a, b) => b.requestCount - a.requestCount);
    const maxRequests = Math.max(...neighborhoods.map(n => n.requestCount));

    // Calculate color intensity based on request count
    const getIntensityColor = (count: number) => {
        const intensity = count / maxRequests;
        // Interpolate between light green (#E8F5ED) and primary green (#056437)
        const lightGreen = { r: 232, g: 245, b: 237 };
        const darkGreen = { r: 5, g: 100, b: 55 };
        const r = Math.round(lightGreen.r + (darkGreen.r - lightGreen.r) * intensity);
        const g = Math.round(lightGreen.g + (darkGreen.g - lightGreen.g) * intensity);
        const b = Math.round(lightGreen.b + (darkGreen.b - lightGreen.b) * intensity);
        return `rgb(${r}, ${g}, ${b})`;
    };

    return (
        <Card className="col-span-1 lg:col-span-2 border-none shadow-2xl bg-white/80 backdrop-blur-md">
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                            <MapPin className="text-[#056437]" />
                            Mapa de Calor - Solicitações por Distrito
                        </h3>
                        <p className="text-sm text-slate-500 mt-1">Volume de solicitações distribuídas pelos distritos de Trairi</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[#056437] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : sortedNeighborhoods.length === 0 ? (
                    <div className="flex items-center justify-center py-20 text-center">
                        <div>
                            <MapPin size={48} className="text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-bold">Nenhum distrito encontrado</p>
                            <p className="text-sm text-slate-400 mt-2">Os cadastros ainda não têm distrito informado</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {sortedNeighborhoods.map((neighborhood) => (
                            <div
                                key={neighborhood.name}
                                className="relative group"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#056437]" />
                                        <span className="font-bold text-slate-800">{neighborhood.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <Users className="w-3 h-3" />
                                            <span>{neighborhood.population.toLocaleString()} hab.</span>
                                        </div>
                                        <span className="text-lg font-black text-[#056437]">
                                            {neighborhood.requestCount}
                                        </span>
                                    </div>
                                </div>
                                {/* Heat Map Bar */}
                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 ease-out"
                                        style={{
                                            width: `${(neighborhood.requestCount / maxRequests) * 100}%`,
                                            backgroundColor: getIntensityColor(neighborhood.requestCount),
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Total and Legend */}
                {!loading && (
                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#E8F5ED]"></div>
                                    <span className="text-xs text-slate-500">Baixa demanda</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#056437]"></div>
                                    <span className="text-xs text-slate-500">Alta demanda</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-black text-[#056437]">
                                    {neighborhoods.reduce((sum, n) => sum + n.requestCount, 0)}
                                </span>
                                <span className="text-sm text-slate-500 ml-1">solicitações totais</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
