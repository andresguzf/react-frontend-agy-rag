import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, User, ChevronDown, ChevronUp, Database, FileText, Bookmark, Sparkles, AlertCircle } from 'lucide-react';
import type { MessageItem } from '../types/rag';

interface Props {
  message: MessageItem;
}

export const ChatMessageItem: React.FC<Props> = ({ message }) => {
  const [showSources, setShowSources] = useState(false);
  const isAssistant = message.sender === 'assistant';

  return (
    <div className={`flex gap-3 my-4 ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shrink-0 mt-1 shadow-lg shadow-indigo-500/10">
          <div className="w-full h-full bg-slate-900 rounded-[9px] flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
      )}

      <div
        className={`max-w-[90%] sm:max-w-[80%] rounded-2xl p-5 shadow-lg border transition-all ${
          isAssistant
            ? 'bg-slate-900/90 text-slate-100 border-slate-800 rounded-tl-sm backdrop-blur-md'
            : 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white border-indigo-500/30 rounded-tr-sm'
        }`}
      >
        {/* Cabecera del Mensaje */}
        <div className="flex items-center justify-between gap-4 mb-3 border-b border-slate-800/80 pb-2 text-[11px] text-slate-400">
          <span className="font-semibold tracking-wide flex items-center gap-1.5 text-indigo-300">
            {isAssistant ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Asistente RAG (Qwen 3)
              </>
            ) : (
              'Usuario'
            )}
          </span>
          <span className="opacity-75">{message.timestamp}</span>
        </div>

        {/* Contenido del Mensaje */}
        {message.status === 'sending' ? (
          <div className="flex items-center gap-3 py-3 text-xs text-indigo-300 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
            <span>Consultando ChromaDB y generando respuesta estructurada...</span>
          </div>
        ) : message.status === 'error' ? (
          <div className="flex items-center gap-2 py-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{message.text}</span>
          </div>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none text-xs leading-relaxed font-normal text-slate-200">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => <h1 className="text-base font-bold text-white mt-4 mb-2 pb-1 border-b border-slate-700/60">{children}</h1>,
                h2: ({ children }) => <h2 className="text-sm font-semibold text-indigo-300 mt-3 mb-1.5">{children}</h2>,
                h3: ({ children }) => <h3 className="text-xs font-semibold text-purple-300 mt-2 mb-1">{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed text-slate-200">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1.5 my-2 pl-2 text-slate-200">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1.5 my-2 pl-2 text-slate-200">{children}</ol>,
                li: ({ children }) => <li className="leading-normal">{children}</li>,
                strong: ({ children }) => <strong className="font-semibold text-indigo-200">{children}</strong>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-indigo-500 pl-3 py-1 my-2 bg-slate-800/40 text-slate-300 italic rounded-r-md">
                    {children}
                  </blockquote>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-3">
                    <table className="w-full text-left text-[11px] border-collapse border border-slate-700">{children}</table>
                  </div>
                ),
                th: ({ children }) => <th className="bg-slate-800 px-3 py-2 border border-slate-700 font-semibold text-indigo-300">{children}</th>,
                td: ({ children }) => <td className="px-3 py-1.5 border border-slate-800 text-slate-300">{children}</td>,
                code: ({ children }) => (
                  <code className="bg-slate-800 text-purple-300 px-1.5 py-0.5 rounded text-[11px] font-mono border border-slate-700">
                    {children}
                  </code>
                ),
              }}
            >
              {message.text}
            </ReactMarkdown>
          </div>
        )}

        {/* Sección de Fuentes y Metadatos Recuperados */}
        {isAssistant && message.sources && message.sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => setShowSources(!showSources)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-xs text-indigo-300 transition-all font-medium"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                <span>📚 Fuentes y Metadatos del Contexto ({message.sources.length})</span>
              </div>
              {showSources ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showSources && (
              <div className="mt-3 space-y-2.5">
                {message.sources.map((src, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1 shadow-inner"
                  >
                    <div className="flex items-center gap-2 text-indigo-300 font-medium">
                      <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">{src.split('|')[0] || src}</span>
                    </div>

                    {src.includes('|') && (
                      <div className="flex items-center gap-2 text-[10px] text-purple-300">
                        <Bookmark className="w-3 h-3 text-purple-400 shrink-0" />
                        <span>{src.split('|')[1]}</span>
                      </div>
                    )}

                    <div className="text-[10px] text-slate-400 bg-slate-900/90 p-2 rounded-lg border border-slate-800/80 font-mono mt-1 leading-relaxed">
                      {src.includes('🔍 Extracto:') ? src.split('🔍 Extracto:')[1] : src}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!isAssistant && (
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 mt-1 shadow-md text-white">
          <User className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
