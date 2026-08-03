import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Layers, BookOpen } from 'lucide-react';
import { uploadPdfApi } from '../services/ragApi';
import { useRagStore } from '../stores/useRagStore';

export const PdfUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadedFiles, addUploadedFile } = useRagStore();

  const handleFileSelection = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setUploadStatus({
        type: 'error',
        message: 'Por favor selecciona un archivo con formato .pdf',
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await uploadPdfApi(file);
      addUploadedFile(result);
      setUploadStatus({
        type: 'success',
        message: `¡Documento "${result.fileName}" procesado! ${result.totalPages} páginas, ${result.totalChunksCreated} chunks guardados en ChromaDB.`,
      });
    } catch (err: any) {
      setUploadStatus({
        type: 'error',
        message: err.message || 'Ocurrió un error al subir el PDF.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-5 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-white flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-indigo-400" />
          <span>Cargar Documentos PDF</span>
        </h2>
        <span className="text-xs text-slate-400">PDF Reader + Chroma</span>
      </div>

      {/* Zona de Drop */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 hover:border-slate-600'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
          disabled={isUploading}
        />

        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-indigo-400 shadow-inner">
          {isUploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          ) : (
            <FileText className="w-6 h-6" />
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-slate-200">
            {isUploading ? 'Procesando e indexando PDF...' : 'Haz clic o arrastra un archivo PDF'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Se extraerá el texto, fragmentará en chunks y almacenará en ChromaDB.
          </p>
        </div>
      </div>

      {/* Alertas de Estado */}
      {uploadStatus && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-3 border ${
            uploadStatus.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {uploadStatus.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{uploadStatus.message}</span>
        </div>
      )}

      {/* Historial de Documentos Procesados */}
      <div className="flex-1 flex flex-col min-h-0 bg-slate-800/30 rounded-2xl p-4 border border-slate-800">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-slate-400" />
          <span>Documentos Indexados ({uploadedFiles.length})</span>
        </h3>

        {uploadedFiles.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
            <FileText className="w-8 h-8 mb-2 stroke-[1.5] text-slate-600" />
            <span>No has cargado ningún PDF aún.</span>
          </div>
        ) : (
          <div className="overflow-y-auto space-y-2 pr-1 flex-1">
            {uploadedFiles.map((file, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs transition-all hover:border-indigo-500/40"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-slate-200 truncate">{file.fileName}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span>{file.totalPages} pág.</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-purple-300">
                        <Layers className="w-3 h-3" /> {file.totalChunksCreated} chunks
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
