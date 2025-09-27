// Chat
import { useMutation } from '@tanstack/react-query';
import { sendChat } from '../../../../lib/api/chat';
import { type ChatTurn } from '../../../../lib/api/types';

export function useChat() {
  return useMutation({
    mutationFn: (turns: ChatTurn[]) => sendChat(turns),
  });
}
