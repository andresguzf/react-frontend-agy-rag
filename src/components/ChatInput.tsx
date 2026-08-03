import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2, MessageSquare } from 'lucide-react';
import { sendChatMessageApi } from '../services/ragApi';
import { useRagStore } from '../stores/useRagStore';

const chatSchema = z.object({
  message: z.string().min(1, 'Escribe una pregunta para consultar los documentos'),
});

type ChatFormData = z.infer<typeof chatSchema>;

export const ChatInput: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, updateMessageStatus } = useRagStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChatFormData>({
    resolver: zodResolver(chatSchema),
  });

  const onSubmit = async (data: ChatFormData) => {
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Agregar mensaje del usuario
    addMessage({
      id: userMessageId,
      sender: 'user',
      text: data.message,
      timestamp: timeStr,
    });

    // Agregar marcador del asistente cargando
    addMessage({
      id: assistantMessageId,
      sender: 'assistant',
      text: 'Buscando contexto en ChromaDB...',
      timestamp: timeStr,
      status: 'sending',
    });

    reset();
    setIsLoading(true);

    try {
      const response = await sendChatMessageApi({ message: data.message });
      updateMessageStatus(assistantMessageId, 'sent', response.answer, response.sources);
    } catch (err: any) {
      updateMessageStatus(
        assistantMessageId,
        'error',
        err.message || 'Error al comunicarse con la IA.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-slate-900/90 border-t border-slate-800">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <MessageSquare className="w-5 h-5" />
        </div>

        <input
          {...register('message')}
          placeholder="Escribe tu pregunta sobre los documentos PDF cargados..."
          disabled={isLoading}
          className="w-full bg-slate-800/80 text-slate-100 placeholder-slate-500 rounded-xl pl-12 pr-14 py-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/50 border border-slate-700/80 transition-all disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="absolute right-2 p-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </div>

      {errors.message && (
        <span className="text-[11px] text-rose-400 mt-1 block px-2">
          {errors.message.message}
        </span>
      )}
    </form>
  );
};
