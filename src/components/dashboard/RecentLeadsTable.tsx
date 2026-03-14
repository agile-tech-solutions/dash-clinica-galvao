import { Card } from '../ui/Card';
import { Phone, Clock, Calendar } from 'lucide-react';
import clsx from 'clsx';
import type { ClinicaLead } from '../../types';
import { useNavigate } from 'react-router-dom';

interface RecentLeadsTableProps {
    leads: ClinicaLead[];
    loading?: boolean;
}

interface LeadWithSource extends ClinicaLead {
    source: 'clinica';
}

const statusConfig = {
    pendente: {
        label: 'Pendente',
        className: 'bg-red-50 text-red-600 border-red-100',
    },
    em_andamento: {
        label: 'Em Andamento',
        className: 'bg-orange-50 text-orange-600 border-orange-100',
    },
    encaminhado: {
        label: 'Encaminhado',
        className: 'bg-blue-50 text-blue-600 border-blue-100',
    },
    resolvido: {
        label: 'Resolvido',
        className: 'bg-teal-50 text-[#18A098] border-teal-100',
    },
};

export function RecentLeadsTable({ leads, loading }: RecentLeadsTableProps) {
    const navigate = useNavigate();

    // Handle click on lead row to navigate to chat
    const handleLeadClick = (lead: ClinicaLead) => {
        // Navigate to chat page with the complete lead
        const leadWithSource: LeadWithSource = {
            ...lead,
            source: 'clinica'
        };

        navigate('/chat', {
            state: {
                clinicaLead: leadWithSource
            }
        });
    };

    if (loading) {
        return (
            <Card className="overflow-hidden">
                <div className="p-6">
                    <div className="animate-pulse">
                        <div className="h-6 bg-slate-100 rounded w-1/3 mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>
        );
    }

    // Get initials from name
    const getInitials = (name: string | null) => {
        if (!name) return '?';
        const parts = name.trim().split(' ');
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    };

    return (
        <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/30">
                <div>
                    <h3 className="text-xl font-bold text-slate-900">Leads Recentes</h3>
                    <p className="text-sm text-[#7A8084]">
                        Acompanhamento de pacientes
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="text-slate-400 w-4 h-4" />
                    <span className="text-sm font-semibold text-slate-600">
                        {leads.length} registros
                    </span>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-left text-slate-600">
                                Nome
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-left text-slate-600">
                                Telefone
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-left text-slate-600">
                                Especialidade
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center text-slate-600">
                                Horário Preferência
                            </th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center text-slate-600">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {leads.map((lead) => {
                            const config = statusConfig[lead.status_atendimento] || {
                                label: lead.status_atendimento || 'Desconhecido',
                                className: 'bg-gray-50 text-gray-600 border-gray-100',
                            };

                            return (
                                <tr
                                    key={lead.id}
                                    onClick={() => handleLeadClick(lead)}
                                    className="hover:bg-slate-50/50 transition-colors duration-200 cursor-pointer"
                                >
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#18A098] to-[#158a82] text-white flex items-center justify-center font-bold text-sm shadow-md flex-shrink-0">
                                                {getInitials(lead.nome_completo)}
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-semibold text-slate-900 truncate">
                                                    {lead.nome_completo || 'Sem Nome'}
                                                </div>
                                                {lead.cpf && (
                                                    <div className="text-xs text-[#7A8084]">
                                                        CPF: {lead.cpf}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-[#18A098] flex-shrink-0" />
                                            <span className="text-sm font-medium text-slate-700">
                                                {lead.telefone || '-'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-sm font-medium text-slate-700 max-w-xs truncate">
                                            {lead.especialidade_desejada || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        {lead.horario_preferencia ? (
                                            <div className="flex items-center justify-center gap-1">
                                                <Clock className="w-4 h-4 text-slate-400" />
                                                <span className="text-sm font-medium text-slate-700">
                                                    {lead.horario_preferencia}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span
                                            className={clsx(
                                                'px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border inline-block',
                                                config.className
                                            )}
                                        >
                                            {config.label}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {!loading && leads.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="text-slate-300 mb-4 flex justify-center">
                            <Calendar size={48} />
                        </div>
                        <h4 className="text-lg font-semibold text-slate-400">Nenhum lead encontrado</h4>
                        <p className="text-sm text-slate-300 mt-2">
                            Os dados aparecerão aqui quando houver registros
                        </p>
                    </div>
                )}
            </div>
        </Card>
    );
}
