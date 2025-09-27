// apps/mobile/src/app/(tabs)/chat.tsx
import ChatComposer from '@features/chat/components/ChatComposer';
import ChatThread from '@features/chat/components/ChatThread';
import { useConversation } from '@features/chat/hooks/useConversation';
import { View } from 'react-native';

export default function ChatScreen() {
  const { messages, input, setInput, send, listRef, pending } =
    useConversation();

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <ChatThread messages={messages} listRef={listRef} />
      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={send}
        disabled={pending}
      />
    </View>
  );
}
