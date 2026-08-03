export interface UploadResponse {
  fileName: string;
  totalPages: number;
  totalChunksCreated: number;
  message: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
}

export interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
}
