import { StyleSheet, Text, View } from 'react-native';

export default function MessageBubble({
  text,
  from,
}: {
  text: string;
  from: 'user' | 'clara';
}) {
  const isUser = from === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.clara]}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 12,
    marginVertical: 6,
    borderRadius: 16,
    maxWidth: '75%',
  },
  user: {
    backgroundColor: '#6C63FF',
    alignSelf: 'flex-end',
  },
  clara: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  text: { color: 'black' },
});
