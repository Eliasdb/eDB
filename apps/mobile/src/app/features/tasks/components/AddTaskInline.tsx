import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AddTaskInline({
  onAdd,
  isSaving,
}: {
  onAdd: (title: string) => void;
  isSaving: boolean;
}) {
  const [text, setText] = useState('');
  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText('');
    Keyboard.dismiss();
  };

  return (
    <View style={styles.addRow}>
      <Ionicons name="add-circle-outline" size={22} color="#6C63FF" />
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a task…"
        returnKeyType="done"
        onSubmitEditing={submit}
        style={styles.addInput}
      />
      <TouchableOpacity onPress={submit} disabled={!text.trim() || isSaving}>
        <Text
          style={[
            styles.addBtn,
            (!text.trim() || isSaving) && { opacity: 0.5 },
          ]}
        >
          Add
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#f2f3f7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ececf2',
  },
  addBtn: { color: '#6C63FF', fontWeight: '700' },
});
