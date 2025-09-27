// apps/mobile/src/app/(tabs)/chat.tsx
import ChatComposer from '@features/chat/components/ChatComposer';
import ChatThread from '@features/chat/components/ChatThread';
import { useConversation } from '@features/chat/hooks/useConversation';
import { StyleSheet, View } from 'react-native';

export default function ChatScreen() {
  const { messages, input, setInput, send, listRef, pending } =
    useConversation();

  return (
    <View style={styles.screen}>
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

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
});
