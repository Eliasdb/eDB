// apps/mobile/src/features/crm/components/AddTaskInline.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Pressable, TextInput, TouchableOpacity } from 'react-native';

export default function AddTaskInline({
  onAdd,
  isSaving,
}: {
  onAdd: (title: string) => void;
  isSaving: boolean;
}) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    const tTitle = text.trim();
    if (!tTitle) return;
    onAdd(tTitle);
    setText('');
    Keyboard.dismiss();
  };

  const disabled = !text.trim() || isSaving;

  return (
    <Pressable
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

      {/* Input field */}
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={t('crm.addTaskPlaceholder')}
        placeholderTextColor="#9CA3AF"
        returnKeyType="done"
        onSubmitEditing={submit}
        className="flex-1 px-3 py-2 text-[15px] bg-transparent text-text dark:text-text-dark focus:outline-none"
      />
    </Pressable>
  );
}
