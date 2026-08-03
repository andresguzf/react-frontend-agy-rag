import type { UploadResponse, ChatRequest, ChatResponse } from '../types/rag';

export const uploadPdfApi = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/rag/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al subir e indexar el archivo PDF.');
  }

  return response.json();
};

export const sendChatMessageApi = async (data: ChatRequest): Promise<ChatResponse> => {
  const response = await fetch('/api/rag/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error al procesar la pregunta con la IA.');
  }

  return response.json();
};
