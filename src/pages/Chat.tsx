import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Cadastro, ChatHistory, ClinicaLead } from '../types';
import {
    Search,
    User,
    AlertCircle,
    Phone,
    MessageSquare,
    ChevronRight,
    Clock,
    FileText
} from 'lucide-react';
import clsx from 'clsx';

interface ClinicaLeadWithSource extends ClinicaLead {
    source: 'clinica';
}

export function Chat() {
    const navigate = useNavigate();
    const location = useLocation();
    const [citizens, setCitizens] = useState<Cadastro[]>([]);
    const [selectedCitizen, setSelectedCitizen] = useState<Cadastro | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [filter] = useState<'all' | 'repassado' | 'urgente'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [showMobileInfo, setShowMobileInfo] = useState(false);
    const [lastMessageTimes, setLastMessageTimes] = useState<Record<string, string>>({});
    const [lastMessageTimestamps, setLastMessageTimestamps] = useState<Record<string, Date>>({});
    const [clinicaLead, setClinicaLead] = useState<ClinicaLeadWithSource | null>(null);

    // Format timestamp for display (relative time) - America/Fortaleza timezone
    const formatMessageTime = (timestamp: string | undefined): string => {
        if (!timestamp) return '';

        // Convert UTC to America/Fortaleza (UTC-3)
        const utcDate = new Date(timestamp);
        const fortalezaDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);
        const now = new Date();
        const nowFortaleza = new Date(now.getTime() - 3 * 60 * 60 * 1000);

        const diffMs = nowFortaleza.getTime() - fortalezaDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'agora';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays === 1) return 'ontem';
        if (diffDays < 7) return `${diffDays}d`;

        return fortalezaDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };

    // Format full timestamp for message bubble - America/Fortaleza timezone
    const formatFullTime = (timestamp: string | undefined): string => {
        if (!timestamp) return '';
        // Convert UTC to America/Fortaleza (UTC-3)
        const utcDate = new Date(timestamp);
        const fortalezaDate = new Date(utcDate.getTime() - 3 * 60 * 60 * 1000);
        return fortalezaDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    useEffect(() => {
        fetchCitizens();
    }, []);

    // Check if a citizen was passed from navigation or search terms from dashboard
    useEffect(() => {
        // Handle clinica lead from dashboard
        if (location.state?.clinicaLead) {
            const passedClinicaLead = location.state.clinicaLead as ClinicaLeadWithSource;
            setClinicaLead(passedClinicaLead);

            // Fetch chat history for clinica lead using telefone
            if (passedClinicaLead.telefone) {
                fetchChatHistory(passedClinicaLead.telefone);
            }

            // Clear the location state
            navigate(location.pathname, { replace: true, state: {} });
            return;
        }

        if (citizens.length === 0) return;

        // Handle direct citizen selection
        if (location.state?.selectedCitizen) {
            const passedCitizen = location.state.selectedCitizen as Cadastro;

            // Find the citizen in our list (use the one from list to ensure consistency)
            const citizenInList = citizens.find(c => c.id === passedCitizen.id);

            if (citizenInList) {
                setSelectedCitizen(citizenInList);
            } else {
                // If not in list, use the passed one directly
                setSelectedCitizen(passedCitizen);
            }

            // Clear the location state to prevent re-selection on page refresh
            navigate(location.pathname, { replace: true, state: {} });
            return;
        }

        // Handle search from dashboard (by name) - only name, not phone
        if (location.state?.searchName) {
            const searchName = location.state.searchName?.trim();

            // Try to find by name
            const matchedCitizen = citizens.find(c =>
                c.nome?.trim().toLowerCase() === searchName.toLowerCase()
            );

            if (matchedCitizen) {
                setSelectedCitizen(matchedCitizen);
                setSearchTerm(''); // Clear search term after matching
            } else {
                // If no match, set the search term so user can see what was searched
                setSearchTerm(searchName || '');
            }

            // Clear the location state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, citizens, navigate, location.pathname]);

    useEffect(() => {
        if (selectedCitizen) {
            fetchChatHistory((selectedCitizen.telefone || '').trim());
        } else {
            setChatHistory([]);
        }
    }, [selectedCitizen]);

    async function fetchCitizens() {
        try {
            const { data: citizensData, error: citizensError } = await supabase
                .from('sec_acao_social_trairi_cadastros')
                .select('*')
                .order('data_ultima_interacao', { ascending: false, nullsFirst: false })
                .range(0, 4999);

            if (citizensError) throw citizensError;

            setCitizens(citizensData || []);

            // Fetch last message times for all citizens
            const lastTimes: Record<string, string> = {};
            const lastTimestamps: Record<string, Date> = {};
            for (const citizen of citizensData || []) {
                if (citizen.telefone) {
                    const phoneDigits = citizen.telefone.replace(/\D/g, '');
                    const possibleIds = [
                        citizen.telefone,
                        `${phoneDigits}@s.whatsapp.net`,
                        `+55${phoneDigits}@s.whatsapp.net`,
                        `55${phoneDigits}@s.whatsapp.net`,
                    ];

                    for (const tryId of possibleIds) {
                        const { data, error } = await supabase
                            .from('n8n_chat_histories_trairi_sec_acao_social')
                            .select('created_at')
                            .eq('session_id', tryId)
                            .order('created_at', { ascending: false })
                            .limit(1);

                        if (!error && data && data.length > 0) {
                            lastTimes[citizen.telefone] = formatMessageTime(data[0].created_at);
                            lastTimestamps[citizen.telefone] = new Date(data[0].created_at);
                            break;
                        }
                    }
                }
            }
            setLastMessageTimes(lastTimes);
            setLastMessageTimestamps(lastTimestamps);
        } catch (error) {
            console.error('Error fetching citizens:', error);
        }
    }

    async function fetchChatHistory(sessionId: string | null) {
        if (!sessionId) return;
        console.log('[Chat] Fetching chat history for session ID:', sessionId);
        try {
            const phoneDigits = sessionId.replace(/\D/g, '');

            const possibleSessionIds = [
                sessionId,
                sessionId.trim().toLowerCase(),
                phoneDigits,
                `${phoneDigits}@s.whatsapp.net`,
                `+55${phoneDigits}@s.whatsapp.net`,
                `55${phoneDigits}@s.whatsapp.net`,
                // Additional formats with/without @ suffix
                sessionId.includes('@') ? sessionId.split('@')[0] : null,
                phoneDigits.length === 11 ? phoneDigits.substring(2) : null, // Remove 55 from start
                phoneDigits.length === 11 ? `${phoneDigits.substring(2)}@s.whatsapp.net` : null,
            ].filter(Boolean);

            console.log('[Chat] Trying session_id formats:', possibleSessionIds);

            let messages = null;
            for (const tryId of possibleSessionIds) {
                const { data, error } = await supabase
                    .from('n8n_chat_histories_trairi_sec_acao_social')
                    .select('*')
                    .eq('session_id', tryId)
                    .order('id', { ascending: true });

                if (!error && data && data.length > 0) {
                    console.log('[Chat] Found messages with session_id format:', tryId, 'count:', data.length);
                    console.log('[Chat] First message:', data[0]);
                    messages = data;
                    break;
                } else if (error) {
                    console.log('[Chat] Error with session_id format:', tryId, 'error:', error.message);
                }
            }

            console.log('[Chat] Total messages fetched:', messages?.length || 0);
            setChatHistory(messages || []);

            // Store last message time for this session
            if (messages && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                const lastTime = formatMessageTime(lastMessage.created_at);
                setLastMessageTimes(prev => ({ ...prev, [sessionId]: lastTime }));
                setLastMessageTimestamps(prev => ({ ...prev, [sessionId]: new Date(lastMessage.created_at) }));
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    }

    const filteredCitizens = citizens.filter(citizen => {
        if (filter === 'repassado' && citizen.status !== 'encaminhado') return false;

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase().trim();
            const name = (citizen.nome || '').toLowerCase();
            const phone = (citizen.telefone || '').toLowerCase();

            const searchDigits = search.replace(/\D/g, '');
            const phoneDigits = phone.replace(/\D/g, '');

            return name.includes(search) ||
                phone.includes(search) ||
                (searchDigits && phoneDigits.includes(searchDigits));
        }

        return true;
    }).sort((a, b) => {
        // Sort by last message time (most recent first)
        const aTimestamp = lastMessageTimestamps[a.telefone || ''];
        const bTimestamp = lastMessageTimestamps[b.telefone || ''];

        // If both have message timestamps, sort by most recent
        if (aTimestamp && bTimestamp) {
            return bTimestamp.getTime() - aTimestamp.getTime();
        }

        // Citizens with messages come first
        if (aTimestamp && !bTimestamp) return -1;
        if (!aTimestamp && bTimestamp) return 1;

        // Fall back to citizen interaction time
        return new Date(b.data_ultima_interacao || 0).getTime() - new Date(a.data_ultima_interacao || 0).getTime();
    });

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6 relative animate-fade-in overflow-visible">
            {/* Conversations List */}
            <div className={clsx(
                "w-full md:w-80 flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden absolute md:static inset-0 z-10 transition-transform duration-300 border border-slate-100",
                selectedCitizen ? "-translate-x-full md:translate-x-0" : "translate-x-0"
            )}>
                <div className="p-4 border-b border-slate-100 bg-[#18A098]">
                    <h2 className="text-lg font-black text-white mb-4">Mensagens</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar conversa..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-teal-300 focus:ring-2 focus:ring-teal-100 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1 bg-slate-50/50">
                    {filteredCitizens.map((citizen) => (
                        <button
                            key={citizen.id}
                            onClick={() => setSelectedCitizen(citizen)}
                            className={clsx(
                                "w-full flex items-center p-3 rounded-2xl transition-all duration-200 group text-left",
                                selectedCitizen?.id === citizen.id
                                    ? "bg-gradient-to-r from-[#18A098] to-[#158a82] shadow-lg shadow-teal-200"
                                    : "hover:bg-white border border-transparent hover:border-slate-200 hover:shadow-md"
                            )}
                        >
                            <div className="relative">
                                <div className={clsx(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all",
                                    selectedCitizen?.id === citizen.id
                                        ? "bg-white/20 text-white backdrop-blur-sm"
                                        : "bg-[#18A098] text-white shadow-sm shadow-gray-900/60"
                                )}>
                                    {(citizen.nome || '?').charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full shadow-sm"></span>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={clsx(
                                        "font-bold truncate text-sm",
                                        selectedCitizen?.id === citizen.id ? "text-white" : "text-slate-900"
                                    )}>
                                        {citizen.nome || citizen.telefone || 'Sem Nome'}
                                    </span>
                                    <span className={clsx("text-[10px] font-medium", selectedCitizen?.id === citizen.id ? "text-white/80" : "text-slate-400")}>
                                        {lastMessageTimes[citizen.telefone || ''] || formatMessageTime(citizen.data_ultima_interacao || undefined)}
                                    </span>
                                </div>
                                <p className={clsx("text-xs truncate flex items-center gap-1",
                                    selectedCitizen?.id === citizen.id ? "text-white/70" : "text-slate-500"
                                )}>
                                    {citizen.status === 'pendente' && <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>}
                                    {citizen.assunto_principal || 'Sem assunto'}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className={clsx(
                "flex-1 flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden relative absolute md:static inset-0 z-20 transition-transform duration-300 border border-slate-100",
                selectedCitizen || clinicaLead ? "translate-x-0" : "translate-x-full md:translate-x-0"
            )}>
                {clinicaLead ? (
                    <>
                        {/* Chat Header - Clinica Lead */}
                        <div className="h-20 px-4 md:px-6 border-b border-slate-100 flex items-center justify-between bg-[#18A098]">
                            <div className="flex items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => {
                                        setClinicaLead(null);
                                        setChatHistory([]);
                                    }}
                                    className="md:hidden p-2 -ml-2 text-white hover:text-white/80"
                                >
                                    <ChevronRight size={24} className="rotate-180" />
                                </button>

                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-white/30 to-white/20 flex items-center justify-center text-white font-bold shadow-lg backdrop-blur-sm">
                                    {(clinicaLead.nome_completo || '?').charAt(0).toUpperCase()}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-base md:text-lg font-bold text-white truncate">
                                        {clinicaLead.nome_completo || 'Lead da Clínica Galvão'}
                                    </h3>
                                    {clinicaLead.especialidade_desejada && (
                                        <p className="text-xs text-white/70 truncate hidden md:block">
                                            {clinicaLead.especialidade_desejada}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        setClinicaLead(null);
                                        setChatHistory([]);
                                        navigate('/dashboard');
                                    }}
                                    className="p-2 text-white hover:text-white/80 hover:bg-white/10 rounded-xl transition-all"
                                    title="Voltar ao Dashboard"
                                >
                                    <span className="text-xs font-semibold">✕</span>
                                </button>
                            </div>
                        </div>

                        {/* Clinica Lead Info Banner */}
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-4 py-3 border-b border-teal-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm">
                                    <FileText className="w-4 h-4 text-[#18A098]" />
                                    <span className="text-slate-700">
                                        <strong>Status:</strong> <span className="capitalize">{clinicaLead.status_atendimento?.replace('_', ' ')}</span>
                                    </span>
                                </div>
                                {clinicaLead.horario_preferencia && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Clock className="w-4 h-4 text-[#18A098]" />
                                        <span className="text-slate-700">{clinicaLead.horario_preferencia}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                            {chatHistory.length === 0 ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-400 text-sm">Nenhuma mensagem encontrada</p>
                                        <p className="text-slate-300 text-xs mt-1">
                                            As conversas aparecerão aqui quando houver histórico
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                chatHistory.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={clsx(
                                            "flex animate-fade-in",
                                            msg.message.type === 'human' ? "justify-end" : "justify-start"
                                        )}
                                    >
                                        {msg.message.type === 'ai' && (
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#18A098] to-[#158a82] flex items-center justify-center text-white text-xs font-bold shadow-md flex-shrink-0 mr-2">
                                                AI
                                            </div>
                                        )}
                                        <div
                                            className={clsx(
                                                "max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm",
                                                msg.message.type === 'human'
                                                    ? "bg-gradient-to-r from-[#18A098] to-[#158a82] text-white"
                                                    : "bg-white text-slate-800 border border-slate-200"
                                            )}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                                {msg.message.content}
                                            </p>
                                            <p className={clsx(
                                                "text-[10px] mt-1 font-medium",
                                                msg.message.type === 'human' ? "text-white/70" : "text-slate-400"
                                            )}>
                                                {formatFullTime(msg.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </>
                ) : selectedCitizen ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 px-4 md:px-6 border-b border-slate-100 flex items-center justify-between bg-[#18A098]">
                            <div className="flex items-center gap-3 md:gap-4">
                                <button
                                    onClick={() => setSelectedCitizen(null)}
                                    className="md:hidden p-2 -ml-2 text-slate-400 hover:text-slate-900"
                                >
                                    <ChevronRight size={24} className="rotate-180" />
                                </button>

                                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#18A098] to-[#158a82] flex items-center justify-center text-white font-bold shadow-lg shadow-teal-200">
                                    {(selectedCitizen.nome || '?').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg">{selectedCitizen.nome || 'Sem Nome'}</h3>
                                    <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                                        <span className="flex items-center gap-1"><Phone size={12} /> {selectedCitizen.telefone?.split('@')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 relative">
                            <div className="absolute inset-0 opacity-[0.5] pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#E2E8F0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                            </div>

                            {chatHistory.length > 0 ? chatHistory.map((msg) => {
                                const isClient = msg.message.type === 'human';

                                return (
                                    <div
                                        key={msg.id}
                                        className={clsx(
                                            "flex w-full relative",
                                            isClient ? "justify-start" : "justify-end"
                                        )}
                                    >
                                        <div className={clsx(
                                            "flex max-w-[75%] gap-3",
                                            isClient ? "flex-row" : "flex-row-reverse"
                                        )}>
                                            <div className={clsx(
                                                "h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-sm mt-auto",
                                                isClient
                                                    ? "bg-slate-200 text-slate-600"
                                                    : "bg-gradient-to-br from-[#18A098] to-[#158a82] text-white shadow-teal-200"
                                            )}>
                                                {isClient ? 'C' : 'A'}
                                            </div>

                                            <div className={clsx(
                                                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed relative",
                                                isClient
                                                    ? "bg-white text-slate-700 rounded-bl-none border border-slate-200"
                                                    : "bg-gradient-to-br from-[#18A098] to-[#158a82] text-white rounded-br-none shadow-teal-200"
                                            )}>
                                                {msg.message.content}
                                                <span className={clsx(
                                                    "text-[10px] absolute bottom-1 font-medium",
                                                    isClient ? "right-3 text-slate-400" : "left-3 text-white/70"
                                                )}>
                                                    {formatFullTime(msg.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) : (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <MessageSquare size={64} className="text-slate-300 mx-auto mb-4" />
                                        <p className="text-slate-600 font-bold">Nenhuma mensagem encontrada</p>
                                        <p className="text-sm text-slate-400 mt-2">Esta é uma nova conversa</p>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-slate-100">
                            <MessageSquare size={48} className="text-[#18A098]" />
                        </div>
                        <p className="text-lg font-black text-slate-900">Selecione uma conversa</p>
                        <p className="text-sm text-slate-500 mt-2">Escolha um paciente da lista para iniciar o atendimento</p>
                    </div>
                )}
            </div>

            {/* Citizen Context Sidebar */}
            {selectedCitizen && (
                <>
                    {showMobileInfo && (
                        <div
                            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setShowMobileInfo(false)}
                        />
                    )}

                    <div className={clsx(
                        "fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:inset-auto lg:block lg:rounded-3xl lg:border lg:border-slate-100 lg:shadow-lg overflow-y-auto p-6 space-y-6",
                        showMobileInfo ? "translate-x-0" : "translate-x-full lg:translate-x-0"
                    )}>
                        <div className="text-center relative">
                            <button
                                onClick={() => setShowMobileInfo(false)}
                                className="absolute top-0 right-0 p-2 text-slate-400 hover:text-slate-900 lg:hidden"
                            >
                                <ChevronRight size={20} />
                            </button>

                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#18A098] to-[#158a82] rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-teal-200 mb-4">
                                {(selectedCitizen.nome || '?').charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-black text-slate-900">{selectedCitizen.nome}</h2>
                            <p className="text-slate-500 text-sm">Clínica Galvão</p>
                        </div>

                        <div className="space-y-3">
                            {/* Status */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors">
                                <div className="flex items-center gap-3 mb-1">
                                    <div className="p-1.5 bg-white rounded-xl text-[#18A098] shadow-sm">
                                        <AlertCircle size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className={clsx("px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                        selectedCitizen.status === 'resolvido' ? "bg-emerald-100 text-emerald-600 border-emerald-200" :
                                        selectedCitizen.status === 'encaminhado' ? "bg-green-100 text-green-600 border-green-200" :
                                        selectedCitizen.status === 'em_andamento' ? "bg-amber-100 text-amber-600 border-amber-200" :
                                            "bg-red-100 text-red-600 border-red-200"
                                    )}>
                                        {selectedCitizen.status === 'pendente' ? 'Pendente' :
                                         selectedCitizen.status === 'em_andamento' ? 'Em Andamento' :
                                         selectedCitizen.status === 'encaminhado' ? 'Encaminhado' :
                                         selectedCitizen.status === 'resolvido' ? 'Resolvido' :
                                         selectedCitizen.status}
                                    </span>
                                </div>
                            </div>

                            {/* Citizen Info */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-1.5 bg-white rounded-xl text-[#18A098] shadow-sm">
                                        <User size={16} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Informações do Paciente</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-white p-3 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Nome</span>
                                        <p className="text-sm font-bold text-slate-900 mt-1">{selectedCitizen.nome || '--'}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Telefone</span>
                                        <p className="text-sm font-bold text-slate-900 mt-1">{selectedCitizen.telefone || '--'}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white p-3 rounded-xl">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Distrito</span>
                                            <p className="text-sm font-bold text-slate-900 mt-1">{selectedCitizen.distrito || '--'}</p>
                                        </div>
                                        <div className="bg-white p-3 rounded-xl">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Unidade</span>
                                            <p className="text-sm font-bold text-slate-900 mt-1">{selectedCitizen.unidade || '--'}</p>
                                        </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Assunto Principal</span>
                                        <p className="text-sm font-semibold text-slate-600 mt-1">{selectedCitizen.assunto_principal || '--'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Details */}
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-teal-200 transition-colors">
                                <div className="space-y-4">
                                    <div className="bg-white p-3 rounded-xl">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última Interação</span>
                                            <span className="text-sm font-black text-[#18A098]">
                                                {selectedCitizen.data_ultima_interacao
                                                    ? new Date(selectedCitizen.data_ultima_interacao).toLocaleDateString('pt-BR')
                                                    : '--'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
