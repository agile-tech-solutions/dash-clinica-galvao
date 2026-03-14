import { Card } from '../ui/Card';
import { MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Lead } from '../../types';

interface GeoData {
    city: string;
    value: number;
    color: string;
}

interface GeoDistributionChartProps {
    leads?: Lead[];
    loading?: boolean;
}

const CITY_COLORS = [
    '#3B82F6', '#a855f7', '#6366f1', '#8b5cf6', '#d946ef',
    '#f472b6', '#c084fc', '#a78bfa', '#f0abfc', '#e879f9'
];

const isClothingSizeOrState = (city: string): boolean => {
    if (!city) return true;

    const trimmed = city.trim().toLowerCase();

    // Filter out 2-letter state abbreviations (RN, BA, SP, etc.)
    if (/^[a-z]{2}$/.test(trimmed)) return true;

    // Filter out clothing size patterns
    const sizePatterns = [
        /\d+a\s*\d*/i,        // "2a 12", "4a", etc.
        /\d+\s*a\s*\d*/i,      // "2 a 12", "4 a 6"
        /a\s*\d+/i,            // "a 16"
        /anos/i,               // "2 a 12 anos"
        /^\d+a$/i,             // "2a", "4a", "6a", etc.
        /^pp$/i, /^p$/i, /^m$/i, /^g$/i, /^gg$/i,  // Size abbreviations
    ];

    return sizePatterns.some(pattern => pattern.test(trimmed));
};

export function GeoDistributionChart({ leads = [], loading = false }: GeoDistributionChartProps) {
    const getGeoData = (): GeoData[] => {
        if (!leads || leads.length === 0) {
            return [
                { city: 'São Paulo', value: 0, color: CITY_COLORS[0] },
                { city: 'Rio de Janeiro', value: 0, color: CITY_COLORS[1] },
                { city: 'Belo Horizonte', value: 0, color: CITY_COLORS[2] },
                { city: 'Brasília', value: 0, color: CITY_COLORS[3] },
            ];
        }

        const cityCount = new Map<string, number>();

        leads.forEach((lead) => {
            const city = lead.cidade_lead;

            // Skip if no city or if it matches clothing size/state patterns
            if (!city || isClothingSizeOrState(city)) return;

            cityCount.set(city, (cityCount.get(city) || 0) + 1);
        });

        const data: GeoData[] = Array.from(cityCount.entries())
            .map(([city, count], idx) => ({
                city,
                value: count,
                color: CITY_COLORS[idx % CITY_COLORS.length],
            }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);

        return data;
    };

    const geoData = getGeoData();

    if (loading) {
        return (
            <Card className="col-span-2">
                <div className="h-80 animate-pulse bg-slate-100 rounded-xl"></div>
            </Card>
        );
    }

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-3">
                    <p className="text-sm font-bold text-slate-900">{data.city}</p>
                    <p className="text-lg font-black" style={{ color: data.color }}>{data.value} leads</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="col-span-2">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        Distribuição Geográfica
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Top cidades por origem</p>
                </div>
                <div className="text-sm font-bold text-slate-600">
                    {geoData.length} cidades
                </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
                <BarChart data={geoData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} layout="vertical">
                    <XAxis
                        type="number"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                    />
                    <YAxis
                        type="category"
                        dataKey="city"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#1e293b', fontSize: 12, fontWeight: 500 }}
                        width={120}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]} maxBarSize={32}>
                        {geoData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-4 gap-2 mt-4">
                {geoData.slice(0, 8).map((city, idx) => (
                    <div key={idx} className="text-center p-2 rounded-lg bg-slate-50">
                        <div className="text-sm font-bold text-slate-900">{city.value}</div>
                        <div className="text-[10px] font-medium text-slate-500 truncate">{city.city}</div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
