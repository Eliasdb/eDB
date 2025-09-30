// apps/mobile/src/lib/chat/useConversation.ts
import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useChat } from './useChat';

export type Msg = { id: string; text: string; from: 'user' | 'clara' };

export function useConversation() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', text: 'Hi Elias, how can I help you today?', from: 'clara' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<Msg>>(null!); // <-- non-null assertion

  const chat = useChat();

  async function send() {
    const text = input.trim();
    if (!text || chat.isPending) return;

    const id = Date.now().toString();
    setMessages((prev) => [...prev, { id, text, from: 'user' }]);
    setInput('');

    // build clean history from current state (BEFORE the optimistic msg)
    const history = messages
      .filter((m) => m && typeof m.text === 'string')
      .map<{ role: 'user' | 'assistant'; content: string }>((m) => ({
        role: m.from === 'clara' ? 'assistant' : 'user',
        content: m.text,
      }))
      .filter((t) => t.content && t.content.trim().length > 0);

    const turns = [...history, { role: 'user' as const, content: text }];

    try {
      const res = await chat.mutateAsync(turns);
      const reply = res.reply ?? (res as any).message ?? '';
      if (reply.trim()) {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-a`, text: reply, from: 'clara' },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-e`,
          text: 'Sorry—there was a problem talking to Clara.',
          from: 'clara',
        },
      ]);
    } finally {
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd({ animated: true }),
      );
    }
  }

  return {
    messages,
    setMessages,
    input,
    setInput,
    send,
    listRef,
    pending: chat.isPending,
  };
}
