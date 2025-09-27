import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ChatComposer({
  value,
  onChange,
  onSend,
  disabled,
}: {
  value: string;
  onChange: (t: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.inputBar}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Type a message…"
        returnKeyType="send"
        onSubmitEditing={onSend}
        blurOnSubmit={false}
        editable={!disabled}
        style={[styles.input, Platform.OS === 'ios' && styles.inputIOS]}
      />
      <TouchableOpacity
        style={[styles.sendBtn, disabled && { opacity: 0.7 }]}
        onPress={onSend}
        disabled={disabled}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {disabled ? '…' : 'Send'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
