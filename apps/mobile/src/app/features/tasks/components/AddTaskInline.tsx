// apps/mobile/src/lib/components/AddTaskInline.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Keyboard,
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

  const disabled = !text.trim() || isSaving;

  return (
    <View className="flex-row items-center gap-2 mb-2.5">
      <Ionicons name="add-circle-outline" size={22} color="#6C63FF" />

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Add a task…"
        placeholderTextColor="#9CA3AF"
        returnKeyType="done"
        onSubmitEditing={submit}
        className="flex-1 rounded-lg px-3 py-2 text-[16px] border bg-muted dark:bg-muted-dark border-border dark:border-border-dark text-text dark:text-text-dark"
      />

      <TouchableOpacity
        onPress={submit}
        disabled={disabled}
        className={disabled ? 'opacity-50' : ''}
        activeOpacity={0.7}
      >
        <Text className="text-primary font-bold">Add</Text>
      </TouchableOpacity>
    </View>
  );
}
