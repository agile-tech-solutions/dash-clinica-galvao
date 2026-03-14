import { useState, useRef, useCallback } from 'react';
import { Upload, File, Image as ImageIcon, X, FileText, Film } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface FileUploadProps {
    onFileSelect: (file: File) => void;
    accept?: string;
    maxSize?: number; // in bytes
    className?: string;
    selectedFile?: File | null;
    onClear?: () => void;
}

export function FileUpload({
    onFileSelect,
    accept = 'image/*,application/pdf,video/*',
    maxSize = 10 * 1024 * 1024, // 10MB
    className,
    selectedFile,
    onClear
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileIcon = (file: File) => {
        if (file.type.startsWith('image/')) return ImageIcon;
        if (file.type.startsWith('video/')) return Film;
        if (file.type === 'application/pdf') return FileText;
        return File;
    };

    const validateFile = (file: File): string | null => {
        if (file.size > maxSize) {
            return `Arquivo muito grande. Máximo: ${maxSize / 1024 / 1024}MB`;
        }
        return null;
    };

    const processFile = useCallback((file: File) => {
        const validationError = validateFile(file);
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);
        onFileSelect(file);

        // Create preview for images
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    }, [maxSize, onFileSelect]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    }, [processFile]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleClear = () => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClear?.();
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1024 / 1024).toFixed(1) + ' MB';
    };

    return (
        <div className={twMerge("w-full", className)}>
            {!selectedFile ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={twMerge(
                        "relative border-2 border-dashed rounded-2xl p-8",
                        "transition-all duration-200 cursor-pointer",
                        "flex flex-col items-center justify-center gap-3",
                        isDragging
                            ? "border-blue-500 bg-blue-50/30"
                            : "border-slate-200 hover:border-blue-300 hover:bg-blue-50/10"
                    )}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={accept}
                        onChange={handleFileInput}
                        className="hidden"
                    />
                    <div className={twMerge(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                        isDragging ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                        <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-semibold text-slate-700">
                            Arraste e solte ou clique para selecionar
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            Imagens, PDF ou vídeos (máx. {formatFileSize(maxSize)})
                        </p>
                    </div>
                </div>
            ) : (
                <div className="border border-slate-200 rounded-2xl p-4 bg-white">
                    <div className="flex items-center gap-4">
                        {preview ? (
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 flex items-center justify-center">
                                {(() => {
                                    const Icon = getFileIcon(selectedFile);
                                    return <Icon className="w-8 h-8 text-slate-400" />;
                                })()}
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                                {selectedFile.name}
                            </p>
                            <p className="text-sm text-slate-500">
                                {formatFileSize(selectedFile.size)}
                            </p>
                        </div>
                        <button
                            onClick={handleClear}
                            className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
            {error && (
                <p className="mt-2 text-xs text-red-500 font-medium flex items-center gap-1">
                    <span>⚠️</span> {error}
                </p>
            )}
        </div>
    );
}
