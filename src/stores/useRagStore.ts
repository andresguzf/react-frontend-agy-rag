import { create } from 'zustand';
import type { MessageItem, UploadResponse } from '../types/rag';

interface RagStore {
  messages: MessageItem[];
  uploadedFiles: UploadResponse[];
  addMessage: (message: MessageItem) => void;
  updateMessageStatus: (id: string, status: 'sent' | 'error', text?: string, sources?: string[]) => void;
  addUploadedFile: (fileInfo: UploadResponse) => void;
  clearChat: () => void;
}

export const useRagStore = create<RagStore>((set) => ({
  messages: [
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: '¡Hola! Soy tu asistente de Inteligencia Artificial RAG. Sube tus documentos PDF en el panel lateral y realizaré búsquedas vectoriales en ChromaDB para responder tus preguntas de forma exacta.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ],
  uploadedFiles: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessageStatus: (id, status, text, sources) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              status,
              ...(text ? { text } : {}),
              ...(sources ? { sources } : {}),
            }
          : msg
      ),
    })),
  addUploadedFile: (fileInfo) => set((state) => ({ uploadedFiles: [fileInfo, ...state.uploadedFiles] })),
  clearChat: () =>
    set({
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: 'assistant',
          text: 'Chat reiniciado. ¿En qué puedo ayudarte con tus documentos cargados?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }),
}));
