// apps/mobile/src/lib/components/ChatThread.tsx
import { FlatList, View } from 'react-native';
import type { Msg } from '../hooks/useConversation';
import MessageBubble from './MessageBubble';

export default function ChatThread({
  messages,
  listRef,
}: {
  messages: Msg[];
  listRef: React.RefObject<FlatList<Msg>>;
}) {
  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageBubble text={item.text} from={item.from} />
      )}
      contentContainerStyle={{ padding: 16, paddingBottom: 16 + 56 }}
      onContentSizeChange={() =>
        listRef.current?.scrollToEnd({ animated: true })
      }
      onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
      keyboardShouldPersistTaps="handled"
      ListFooterComponent={<View style={{ height: 4 }} />}
    />
  );
}
