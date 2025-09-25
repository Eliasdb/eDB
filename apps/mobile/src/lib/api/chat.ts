// apps/mobile/src/lib/api/chat.ts
import { api } from './client';
import { ChatResponse, ChatTurn } from './types';

export async function sendChat(turns: ChatTurn[]): Promise<ChatResponse> {
  return api<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: turns }),
  });
}
