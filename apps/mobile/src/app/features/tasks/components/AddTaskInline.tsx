// apps/mobile/src/lib/components/AddTaskInline.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const submit = () => {
    const tTitle = text.trim();
    if (!tTitle) return;
    onAdd(tTitle);
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
        placeholder={t('crm.addTaskPlaceholder')}
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
        <Text className="text-primary font-bold">{t('crm.addTaskButton')}</Text>
      </TouchableOpacity>
    </View>
  );
}
