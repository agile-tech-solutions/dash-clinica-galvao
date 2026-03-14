import { useEffect, useState } from 'react';
import {
    FolderOpen,
    Plus,
    Search,
    FileText,
    Image as ImageIcon,
    Film,
    File,
    Eye,
    Trash2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { FileUpload } from '../components/ui/FileUpload';
import { Select } from '../components/ui/Select';
import { Switch } from '../components/ui/Switch';
import { Input } from '../components/ui/Input';
import type { CatalogFile, FileType } from '../types';
import * as catalogStorage from '../lib/catalogStorage';

const FILE_TYPE_LABELS: Record<FileType, string> = {
    catalogo: 'Catálogo',
    prova_social: 'Prova Social',
    guia_medidas: 'Guia de Medidas',
    geral: 'Geral'
};

const FILE_TYPE_BADGES: Record<FileType, 'primary' | 'success' | 'warning' | 'neutral'> = {
    catalogo: 'primary',
    prova_social: 'success',
    guia_medidas: 'warning',
    geral: 'neutral'
};

type FilterType = 'all' | FileType;

export function CatalogFiles() {
    const [files, setFiles] = useState<CatalogFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadNome, setUploadNome] = useState('');
    const [uploadTipo, setUploadTipo] = useState<FileType>('catalogo');
    const [uploading, setUploading] = useState(false);
    const [filterType, setFilterType] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        loadFiles();
    }, []);

    async function loadFiles() {
        setLoading(true);
        const { data } = await catalogStorage.getAllFiles();
        if (data) {
            setFiles(data);
        }
        setLoading(false);
    }

    const filteredFiles = files.filter(file => {
        const matchesType = filterType === 'all' || file.tipo === filterType;
        const matchesSearch = file.nome_arquivo.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesActive = showInactive || file.ativo;
        return matchesType && matchesSearch && matchesActive;
    });

    async function handleUpload() {
        if (!uploadFile) return;

        setUploading(true);
        try {
            // Upload file to storage
            const { data: uploadData, error: uploadError } = await catalogStorage.uploadFile(
                uploadFile,
                uploadTipo,
                uploadNome || uploadFile.name
            );

            if (uploadError) throw uploadError;

            // Create database record
            const { error: dbError } = await catalogStorage.createFileRecord({
                nome_arquivo: uploadNome || uploadFile.name,
                tipo: uploadTipo,
                file_url: uploadData?.publicUrl || '',
                file_path: uploadData?.path || '',
                file_size: uploadFile.size,
                mime_type: uploadFile.type
            });

            if (dbError) throw dbError;

            // Reset form and reload
            setUploadFile(null);
            setUploadNome('');
            setUploadTipo('catalogo');
            setIsUploadModalOpen(false);
            await loadFiles();
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao fazer upload. Tente novamente.');
        } finally {
            setUploading(false);
        }
    }

    async function handleToggleActive(file: CatalogFile) {
        const { error } = await catalogStorage.toggleFileActive(file.id, !file.ativo);
        if (!error) {
            await loadFiles();
        }
    }

    async function handleDelete(file: CatalogFile) {
        if (!confirm(`Tem certeza que deseja excluir "${file.nome_arquivo}"?`)) return;

        try {
            // Delete from storage
            await catalogStorage.deleteFile(file.file_path);
            // Delete from database
            await catalogStorage.deleteFileRecord(file.id);
            await loadFiles();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Erro ao excluir arquivo.');
        }
    }

    function getFileIcon(mimeType?: string) {
        if (!mimeType) return File;
        if (mimeType.startsWith('image/')) return ImageIcon;
        if (mimeType.startsWith('video/')) return Film;
        if (mimeType === 'application/pdf') return FileText;
        return File;
    }

    function formatFileSize(bytes?: number) {
        if (!bytes) return '-';
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    }

    return (
        <div className="space-y-8 animate-fade-in p-2">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Catálogo e Arquivos</h1>
                    <p className="text-slate-500 mt-1 font-medium italic">Gerencie catálogos, provas sociais e outros arquivos.</p>
                </div>
                <Button onClick={() => setIsUploadModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Arquivo
                </Button>
            </div>

            {/* Filters */}
            <Card className="p-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                        <Input
                            placeholder="Buscar arquivos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<Search className="w-4 h-4" />}
                        />
                    </div>
                    <div className="sm:w-48">
                        <Select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as FilterType)}
                        >
                            <option value="all">Todos os Tipos</option>
                            <option value="catalogo">Catálogo</option>
                            <option value="prova_social">Prova Social</option>
                            <option value="guia_medidas">Guia de Medidas</option>
                            <option value="geral">Geral</option>
                        </Select>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                        <Switch
                            checked={showInactive}
                            onCheckedChange={(checked) => {
                                console.log('Switch changed:', checked);
                                setShowInactive(checked);
                            }}
                        />
                        <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                            Mostrar inativos
                        </span>
                        {/* Debug info */}
                        <span className="text-xs text-slate-400">
                            ({files.filter(f => !f.ativo).length} inativos)
                        </span>
                    </div>
                </div>
            </Card>

            {/* Files Grid */}
            {loading ? (
                <Card className="p-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-medium">Carregando arquivos...</p>
                    </div>
                </Card>
            ) : filteredFiles.length === 0 ? (
                <Card className="p-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                            <FolderOpen className="w-10 h-10 text-slate-300" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-slate-700">Nenhum arquivo encontrado</h3>
                            <p className="text-slate-400">
                                {searchQuery || filterType !== 'all'
                                    ? 'Tente ajustar os filtros de busca.'
                                    : 'Comece adicionando seu primeiro arquivo.'}
                            </p>
                        </div>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredFiles.map((file) => {
                        const FileIcon = getFileIcon(file.mime_type);
                        const isImage = file.mime_type?.startsWith('image/');
                        const isPdf = file.mime_type === 'application/pdf';
                        const isVideo = file.mime_type?.startsWith('video/');

                        return (
                            <Card
                                key={file.id}
                                hoverEffect
                                className={!file.ativo ? 'opacity-60' : ''}
                            >
                                {/* Preview Area */}
                                <div className="aspect-video rounded-2xl overflow-hidden bg-slate-100 mb-4 relative group">
                                    {isImage ? (
                                        <img
                                            src={file.file_url}
                                            alt={file.nome_arquivo}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : isPdf ? (
                                        <object
                                            data={file.file_url}
                                            type="application/pdf"
                                            className="w-full h-full"
                                        >
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                                                <FileText className="w-12 h-12 text-red-400" />
                                                <span className="ml-2 text-sm font-medium text-red-600">PDF</span>
                                            </div>
                                        </object>
                                    ) : isVideo ? (
                                        <video
                                            src={file.file_url}
                                            className="w-full h-full object-cover"
                                            controls
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                                            <FileIcon className="w-12 h-12 text-slate-300" />
                                        </div>
                                    )}
                                </div>

                                {/* File Info */}
                                <div className="space-y-3">
                                    <div>
                                        <h3 className="font-bold text-slate-900 truncate">{file.nome_arquivo}</h3>
                                        <p className="text-xs text-slate-500">{formatFileSize(file.file_size)}</p>
                                    </div>

                                    <Badge variant={FILE_TYPE_BADGES[file.tipo]}>
                                        {FILE_TYPE_LABELS[file.tipo]}
                                    </Badge>

                                    {/* Actions */}
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={file.ativo}
                                                onCheckedChange={() => handleToggleActive(file)}
                                            />
                                            <span className="text-xs text-slate-500">
                                                {file.ativo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <a
                                                href={file.file_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </a>
                                            <button
                                                onClick={() => handleDelete(file)}
                                                className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Upload Modal */}
            <Modal
                isOpen={isUploadModalOpen}
                onClose={() => setIsUploadModalOpen(false)}
                title="Adicionar Novo Arquivo"
                size="lg"
            >
                <div className="space-y-6">
                    <FileUpload
                        onFileSelect={setUploadFile}
                        selectedFile={uploadFile}
                        onClear={() => setUploadFile(null)}
                    />

                    <div>
                        <Input
                            label="Nome do Arquivo"
                            placeholder="Deixe vazio para usar o nome original"
                            value={uploadNome}
                            onChange={(e) => setUploadNome(e.target.value)}
                        />
                    </div>

                    <div>
                        <Select
                            label="Tipo de Arquivo"
                            value={uploadTipo}
                            onChange={(e) => setUploadTipo(e.target.value as FileType)}
                        >
                            <option value="catalogo">Catálogo</option>
                            <option value="prova_social">Prova Social</option>
                            <option value="guia_medidas">Guia de Medidas</option>
                            <option value="geral">Geral</option>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="secondary"
                            onClick={() => setIsUploadModalOpen(false)}
                            className="flex-1"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleUpload}
                            disabled={!uploadFile || uploading}
                            isLoading={uploading}
                            className="flex-1"
                        >
                            {uploading ? 'Fazendo Upload...' : 'Adicionar Arquivo'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
