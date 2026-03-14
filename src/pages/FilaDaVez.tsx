import { useEffect, useState } from 'react';
import {
    Users,
    Plus,
    Trash2,
    Edit,
    Save,
    X,
    Clock,
    Crown,
    User
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Switch } from '../components/ui/Switch';
import type { FilaDaVezConsultor } from '../types';
import * as filaDaVezStorage from '../lib/filaDaVezStorage';

export function FilaDaVez() {
    const [consultors, setConsultors] = useState<FilaDaVezConsultor[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newConsultorName, setNewConsultorName] = useState('');
    const [newConsultorWhatsApp, setNewConsultorWhatsApp] = useState('');
    const [adding, setAdding] = useState(false);
    const [editingWhatsApp, setEditingWhatsApp] = useState<number | null>(null);
    const [editWhatsAppValue, setEditWhatsAppValue] = useState('');

    useEffect(() => {
        loadConsultors();
    }, []);

    async function loadConsultors() {
        setLoading(true);
        const { data, error } = await filaDaVezStorage.getAllConsultors();
        if (data && !error) {
            setConsultors(data);
        }
        setLoading(false);
    }

    async function handleAddConsultor() {
        if (!newConsultorName.trim()) return;

        setAdding(true);
        try {
            const { error } = await filaDaVezStorage.createConsultor({
                consultor: newConsultorName.trim(),
                remoteJid_consultor: newConsultorWhatsApp.trim() || undefined
            });

            if (error) throw error;

            // Reset form and reload
            setNewConsultorName('');
            setNewConsultorWhatsApp('');
            setIsAddModalOpen(false);
            await loadConsultors();
        } catch (error) {
            console.error('Add consultor error:', error);
            alert('Erro ao adicionar consultor. Tente novamente.');
        } finally {
            setAdding(false);
        }
    }

    async function handleToggleStatus(consultor: FilaDaVezConsultor) {
        const newStatus = consultor.status === 'sim' ? 'não' : 'sim';
        const { error } = await filaDaVezStorage.updateConsultorStatus(consultor.id, newStatus);
        if (!error) {
            await loadConsultors();
        }
    }

    async function handleDelete(consultor: FilaDaVezConsultor) {
        if (!confirm(`Tem certeza que deseja remover "${consultor.consultor}" da fila?`)) return;

        const { error } = await filaDaVezStorage.deleteConsultor(consultor.id);
        if (!error) {
            await loadConsultors();
        } else {
            alert('Erro ao remover consultor.');
        }
    }

    async function handleSaveWhatsApp(id: number) {
        const { error } = await filaDaVezStorage.updateConsultorWhatsApp(id, editWhatsAppValue.trim());
        if (!error) {
            setEditingWhatsApp(null);
            setEditWhatsAppValue('');
            await loadConsultors();
        } else {
            alert('Erro ao atualizar WhatsApp.');
        }
    }

    function getNextInLine(): FilaDaVezConsultor | null {
        const activeConsultors = consultors.filter(c => c.status === 'sim');
        if (activeConsultors.length === 0) return null;
        // Sort by ultimo_lead ascending - oldest first
        return activeConsultors.sort((a, b) => {
            const dateA = a.ultimo_lead ? new Date(a.ultimo_lead).getTime() : 0;
            const dateB = b.ultimo_lead ? new Date(b.ultimo_lead).getTime() : 0;
            return dateA - dateB;
        })[0];
    }

    function formatLastLead(dateString: string | null): string {
        if (!dateString) return 'Nunca';
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Agora';
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays === 1) return 'Ontem';
        if (diffDays < 7) return `${diffDays} dias atrás`;

        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    const nextInLine = getNextInLine();

    return (
        <div className="space-y-8 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Fila da vez</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Gerencie a equipe de vendas em round robin.</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Consultor
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total</p>
                            <p className="text-2xl font-bold text-slate-900">{consultors.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Ativos</p>
                            <p className="text-2xl font-bold text-slate-900">{consultors.filter(c => c.status === 'sim').length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Pausados</p>
                            <p className="text-2xl font-bold text-slate-900">{consultors.filter(c => c.status === 'não').length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Consultants List */}
            {loading ? (
                <Card className="p-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">Carregando consultores...</p>
                    </div>
                </Card>
            ) : consultors.length === 0 ? (
                <Card className="p-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <Users className="w-10 h-10 text-slate-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-700">Nenhum consultor na fila</h3>
                            <p className="text-slate-400">Comece adicionando seu primeiro consultor.</p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {consultors.map((consultor) => {
                        const isNext = nextInLine?.id === consultor.id;
                        const isActive = consultor.status === 'sim';

                        return (
                            <Card
                                key={consultor.id}
                                hoverEffect
                                className={`${!isActive ? 'opacity-70' : ''} ${isNext ? 'ring-2 ring-blue-500/50 bg-blue-50/30' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    {/* Avatar/Icon */}
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-blue-500/10' : 'bg-slate-100'}`}>
                                        <User className={`w-6 h-6 ${isActive ? 'text-blue-500' : 'text-slate-400'}`} />
                                    </div>

                                    {/* Next Badge */}
                                    {isNext && (
                                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                                            <Crown className="w-3 h-3 text-amber-500" />
                                            <span className="text-xs font-semibold text-amber-600">Próximo</span>
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-slate-900">{consultor.consultor || 'Sem nome'}</h3>
                                            <Badge variant={isActive ? 'success' : 'neutral'}>
                                                {isActive ? 'Ativo' : 'Pausado'}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            {editingWhatsApp === consultor.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        value={editWhatsAppValue}
                                                        onChange={(e) => setEditWhatsAppValue(e.target.value)}
                                                        placeholder="55XX@s.whatsapp.net"
                                                        className="h-8 text-xs px-2 py-1"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveWhatsApp(consultor.id)}
                                                        className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                                                    >
                                                        <Save className="w-3 h-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingWhatsApp(null);
                                                            setEditWhatsAppValue('');
                                                        }}
                                                        className="p-1 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-sm text-slate-500 truncate">
                                                    {consultor.remoteJid_consultor || 'Sem WhatsApp'}
                                                </p>
                                            )}
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Último lead: {formatLastLead(consultor.ultimo_lead)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingWhatsApp(consultor.id);
                                                setEditWhatsAppValue(consultor.remoteJid_consultor || '');
                                            }}
                                            className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Editar WhatsApp"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <Switch
                                            checked={isActive}
                                            onCheckedChange={() => handleToggleStatus(consultor)}
                                        />
                                        <button
                                            onClick={() => handleDelete(consultor)}
                                            className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                            title="Remover"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Add Modal */}
            <Modal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="Adicionar Novo Consultor"
                size="md"
            >
                <div className="space-y-6">
                    <div>
                        <Input
                            label="Nome do Consultor *"
                            placeholder="Ex: Mariana Silva"
                            value={newConsultorName}
                            onChange={(e) => setNewConsultorName(e.target.value)}
                        />
                    </div>

                    <div>
                        <Input
                            label="WhatsApp ID"
                            placeholder="Ex: 558597270084@s.whatsapp.net"
                            value={newConsultorWhatsApp}
                            onChange={(e) => setNewConsultorWhatsApp(e.target.value)}
                        />
                        <p className="text-xs text-slate-400 mt-1 ml-1">Formato: número@s.whatsapp.net</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAddConsultor}
                            disabled={!newConsultorName.trim() || adding}
                            isLoading={adding}
                            className="flex-1"
                        >
                            {adding ? 'Adicionando...' : 'Adicionar Consultor'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
