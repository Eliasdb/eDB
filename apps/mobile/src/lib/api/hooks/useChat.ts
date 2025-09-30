// Chat
import { useMutation } from '@tanstack/react-query';
import { type ChatTurn } from '../core/types';
import { sendChat } from '../services/chat';

export function useChat() {
  return useMutation({
    mutationFn: (turns: ChatTurn[]) => sendChat(turns),
  });
}
