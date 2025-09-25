// apps/mobile/src/app/(tabs)/chat.tsx
import { useRef, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useChat } from '../../lib/api/hooks';
import MessageBubble from '../components/MessageBubble';

type Msg = { id: string; text: string; from: 'user' | 'clara' };

export default function ChatScreen() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: '1', text: 'Hi Elias, how can I help you today?', from: 'clara' },
  ]);
  const [input, setInput] = useState('');
  const listRef = useRef<FlatList<Msg>>(null);

  const m = useChat();

  const send = async () => {
    const text = input.trim();
    if (!text || m.isPending) return;

    const id = Date.now().toString();
    setMessages((prev) => [...prev, { id, text, from: 'user' }]);
    setInput('');

    // Build a clean history from current state (BEFORE adding the optimistic msg)
    const history = messages
      .filter((msg) => msg && typeof msg.text === 'string') // drop any weird items
      .map<{ role: 'user' | 'assistant'; content: string }>((msg) => ({
        role: msg.from === 'clara' ? 'assistant' : 'user',
        content: msg.text,
      }))
      // remove accidental empties
      .filter((t) => t.content && t.content.trim().length > 0);

    const turns = [...history, { role: 'user' as const, content: text }];

    // (optional) debug once
    // console.log('POST /chat payload:', JSON.stringify({ messages: turns }, null, 2));

    // apps/mobile/src/app/(tabs)/chat.tsx
    // ...
    try {
      const res = await m.mutateAsync(turns);
      const reply = res.reply ?? (res as any).message ?? ''; // fallback safety
      if (reply.trim().length) {
        setMessages((prev) => [
          ...prev,
          { id: `${Date.now()}-a`, text: reply, from: 'clara' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-e`,
          text: 'Sorry—there was a problem talking to Clara.',
          from: 'clara',
        },
      ]);
    } finally {
      requestAnimationFrame(() =>
        listRef.current?.scrollToEnd({ animated: true }),
      );
    }
  };

  return (
    <View style={styles.screen}>
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
      />

      <View style={styles.inputBar}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message…"
          returnKeyType="send"
          onSubmitEditing={send}
          blurOnSubmit={false}
          editable={!m.isPending}
          style={[styles.input, Platform.OS === 'ios' && styles.inputIOS]}
        />
        <TouchableOpacity
          style={[styles.sendBtn, m.isPending && { opacity: 0.7 }]}
          onPress={send}
          disabled={m.isPending}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>
            {m.isPending ? '…' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f6f7fb' },
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ececf2',
    height: 56,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f2f3f7',
    fontSize: 16,
  },
  inputIOS: { lineHeight: 20, paddingVertical: 10 },
  sendBtn: {
    marginLeft: 8,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#6C63FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
