import { FlatList, View } from 'react-native';
import { MessageBubble } from './message-bubble';

export function ChatThread({
  messages,
  listRef,
}: {
  messages: any[];
  listRef: React.RefObject<FlatList<any>>;
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
