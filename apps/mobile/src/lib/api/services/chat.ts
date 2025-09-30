import { api } from '../core/client';
import type { ChatResponse, ChatTurn } from '../core/types';

export async function sendChat(turns: ChatTurn[]): Promise<ChatResponse> {
  return api<ChatResponse>('/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: turns }),
  });
}
