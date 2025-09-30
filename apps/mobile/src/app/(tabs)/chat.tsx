import { View } from 'react-native';

import { useConversation } from '@api';
import { ChatComposer, ChatThread } from '@features/chat';

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
