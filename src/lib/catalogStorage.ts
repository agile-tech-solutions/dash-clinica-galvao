import { supabase } from './supabase';
import type { CatalogFile, FileType } from '../types';

const BUCKET_NAME = 'catalog-files';

// Função auxiliar para sanitizar nomes de arquivos para o Storage
function sanitizeFileName(fileName: string): string {
    return fileName
        .normalize('NFD')                    // Decompõe acentos
        .replace(/[\u0300-\u036f]/g, '')     // Remove marcas de acento
        .replace(/[^a-zA-Z0-9._-]/g, '_')    // Substitui caracteres inválidos por _
        .replace(/_{2,}/g, '_')              // Remove underscores duplicados
        .toLowerCase();
}

export async function uploadFile(file: File, tipo: FileType, customName?: string) {
    const timestamp = Date.now();
    const originalName = customName || file.name;

    // Extrair extensão do nome original (último ponto)
    const lastDotIndex = originalName.lastIndexOf('.');
    const nameWithoutExt = lastDotIndex > 0 ? originalName.slice(0, lastDotIndex) : originalName;
    const extension = lastDotIndex > 0 ? originalName.slice(lastDotIndex + 1) : '';

    // Usar nome sanitizado para o path do storage
    const sanitizedName = sanitizeFileName(nameWithoutExt);
    const path = `${tipo}/${timestamp}-${sanitizedName}.${extension}`;

    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file);

    if (error) return { data: null, error };

    // Get public URL
    const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return {
        data: {
            path: data.path,
            publicUrl: urlData.publicUrl,
            fileName: originalName  // Nome original preservado para exibição
        },
        error: null
    };
}

export async function deleteFile(path: string) {
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    return { error };
}

export async function getPublicUrl(path: string): Promise<string> {
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}

export async function createFileRecord(fileData: {
    nome_arquivo: string;
    tipo: FileType;
    file_url: string;
    file_path: string;
    file_size?: number;
    mime_type?: string;
}) {
    const { data, error } = await supabase
        .from('catalog_files_sofhia_kids')
        .insert(fileData)
        .select()
        .single();

    return { data, error };
}

export async function getFiles(tipo?: FileType, onlyActive: boolean = true) {
    let query = supabase
        .from('catalog_files_sofhia_kids')
        .select('*')
        .order('created_at', { ascending: false });

    if (tipo) {
        query = query.eq('tipo', tipo);
    }

    if (onlyActive) {
        query = query.eq('ativo', true);
    }

    const { data, error } = await query;

    return { data: data as CatalogFile[] | null, error };
}

export async function getAllFiles() {
    const { data, error } = await supabase
        .from('catalog_files_sofhia_kids')
        .select('*')
        .order('created_at', { ascending: false });

    return { data: data as CatalogFile[] | null, error };
}

export async function toggleFileActive(id: string, ativo: boolean) {
    const { data, error } = await supabase
        .from('catalog_files_sofhia_kids')
        .update({ ativo, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

    return { data: data as CatalogFile | null, error };
}

export async function deleteFileRecord(id: string) {
    const { error } = await supabase
        .from('catalog_files_sofhia_kids')
        .delete()
        .eq('id', id);

    return { error };
}
