import { Text, View } from 'react-native';

export function MessageBubble({
  text,
  from,
}: {
  text: string;
  from: 'user' | 'clara';
}) {
  const isUser = from === 'user';

  return (
    <View
      className={`
        px-3 py-2 my-1.5 rounded-2xl max-w-[75%]
        ${isUser ? 'bg-primary self-end' : 'bg-muted dark:bg-muted-dark self-start'}
      `}
    >
      <Text
        className={`
          text-[15px]
          ${isUser ? 'text-white' : 'text-text dark:text-text-dark'}
        `}
      >
        {text}
      </Text>
    </View>
  );
}
