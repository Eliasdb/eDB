import { FlatList, View } from 'react-native';
import { MessageBubble } from './message-bubble';

export type ChatMessage = {
  id: string;
  text: string;
  from: 'user' | 'clara';
};

export function ChatThread({
  messages,
  listRef,
}: {
  messages: ChatMessage[];
  listRef: React.RefObject<FlatList<ChatMessage>>;
}) {
  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <MessageBubble text={item.text} from={item.from} />
      )}
      // px-4 = 16, pt-4 = 16, pb = 16 + 56 (composer height)
      onContentSizeChange={() =>
        listRef.current?.scrollToEnd({ animated: true })
      }
      onLayout={() => listRef.current?.scrollToEnd({ animated: false })}
      keyboardShouldPersistTaps="handled"
      ListFooterComponent={<View className="h-1" />}
    />
  );
}
