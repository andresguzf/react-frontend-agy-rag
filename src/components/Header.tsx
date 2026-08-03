import React from 'react';
import { Bot, Sparkles, Database, Trash2 } from 'lucide-react';
import { useRagStore } from '../stores/useRagStore';

export const Header: React.FC = () => {
  const { clearChat } = useRagStore();

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
            <Bot className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            Spring AI RAG Studio
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              v1.0
            </span>
          </h1>
          <p className="text-xs text-slate-400 flex items-center gap-2">
            <span>LLM: Qwen 3 (Ollama)</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Database className="w-3 h-3" /> ChromaDB
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Embedding: nomic-embed-text</span>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
          title="Limpiar conversación"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Limpiar Chat</span>
        </button>
      </div>
    </header>
  );
};
