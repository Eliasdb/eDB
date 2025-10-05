import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Ionicons } from '@expo/vector-icons';
import { Keyboard, Pressable, TextInput, TouchableOpacity } from 'react-native';

type Props = {
  onAdd: (title: string) => void;
  isSaving: boolean;
  placeholder?: string;
};

export function AddTaskRow({ onAdd, isSaving, placeholder }: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const title = text.trim();
    if (!title) return;
    onAdd(title);
    setText('');
    Keyboard.dismiss();
  };

  const disabled = !text.trim() || isSaving;

  return (
    <Pressable
      onPress={() => {}}
      accessible={false} // 👈 important so the TextInput is the target
      className={`
        flex-row items-center px-3 py-2
        border ${focused ? 'border-primary/60' : 'border-border dark:border-border-dark'}
        bg-muted dark:bg-muted-dark
        rounded-t-sm rounded-b-none
      `}
    >
      {/* Plus button */}
      <TouchableOpacity onPress={submit} disabled={disabled}>
        <Ionicons
          name="add"
          size={20}
          color={disabled ? '#9CA3AF' : '#6C63FF'}
        />
      </TouchableOpacity>

      {/* Input */}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={placeholder ?? t('crm.addTaskPlaceholder')}
        placeholderTextColor="#9CA3AF"
        returnKeyType="done"
        onSubmitEditing={submit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        testID="task-input" // ✅ iOS
        accessibilityLabel="task-input"
        className="flex-1 px-3 py-2 text-[15px] bg-transparent text-text dark:text-text-dark focus:outline-none"
      />
    </Pressable>
  );
}
