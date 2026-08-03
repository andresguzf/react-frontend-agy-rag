import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { PdfUploader } from './components/PdfUploader';
import { ChatFeed } from './components/ChatFeed';
import { ChatInput } from './components/ChatInput';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
        <Header />

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 max-w-[1600px] w-full mx-auto min-h-0 overflow-hidden">
          {/* Panel Izquierdo: Carga e Historial de PDF (4 Cols en Desktop) */}
          <section className="lg:col-span-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 flex flex-col min-h-[400px] lg:min-h-0 shadow-2xl">
            <PdfUploader />
          </section>

          {/* Panel Derecho: Chat RAG (8 Cols en Desktop) */}
          <section className="lg:col-span-8 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col overflow-hidden min-h-[500px] lg:min-h-0 shadow-2xl">
            <ChatFeed />
            <ChatInput />
          </section>
        </main>
      </div>
    </QueryClientProvider>
  );
};

export default App;
