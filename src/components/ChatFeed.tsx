import React, { useEffect, useRef } from 'react';
import { useRagStore } from '../stores/useRagStore';
import { ChatMessageItem } from './ChatMessageItem';

export const ChatFeed: React.FC = () => {
  const { messages } = useRagStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
      {messages.map((msg) => (
        <ChatMessageItem key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
