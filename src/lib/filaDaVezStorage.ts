import { supabase } from './supabase';

export async function getAllConsultors() {
    return await supabase
        .from('sofhia_kids_filadavez')
        .select('*')
        .order('ultimo_lead', { ascending: true, nullsFirst: true });
}

export async function createConsultor(data: {
    consultor: string;
    remoteJid_consultor?: string;
}) {
    return await supabase
        .from('sofhia_kids_filadavez')
        .insert({
            consultor: data.consultor,
            status: 'sim',
            ultimo_lead: new Date().toISOString(),
            remoteJid_consultor: data.remoteJid_consultor || null
        })
        .select()
        .single();
}

export async function updateConsultorStatus(id: number, status: string) {
    return await supabase
        .from('sofhia_kids_filadavez')
        .update({ status })
        .eq('id', id);
}

export async function updateConsultorWhatsApp(id: number, remoteJid: string) {
    return await supabase
        .from('sofhia_kids_filadavez')
        .update({ remoteJid_consultor: remoteJid })
        .eq('id', id);
}

export async function deleteConsultor(id: number) {
    return await supabase
        .from('sofhia_kids_filadavez')
        .delete()
        .eq('id', id);
}
