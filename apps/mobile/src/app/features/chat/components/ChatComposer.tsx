// apps/mobile/src/lib/components/ChatComposer.tsx
import { useTranslation } from 'react-i18next';
import {
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export function ChatComposer({
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
  const { t } = useTranslation();

  return (
    <View className="absolute left-0 right-0 bottom-0 flex-row items-center px-3 h-14 bg-surface dark:bg-surface-dark border-t border-border dark:border-border-dark">
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={t('chat.placeholder')}
        placeholderTextColor="#9CA3AF"
        returnKeyType="send"
        onSubmitEditing={onSend}
        blurOnSubmit={false}
        editable={!disabled}
        className={`
          flex-1 h-10 px-3.5 rounded-full text-[16px]
          bg-muted dark:bg-muted-dark
          text-text dark:text-text-dark
          ${Platform.OS === 'ios' ? 'py-2 leading-5' : ''}
        `}
      />
      <TouchableOpacity
        disabled={disabled}
        onPress={onSend}
        className={`
          ml-2 h-10 px-4 rounded-full flex-row items-center justify-center
          bg-primary ${disabled ? 'opacity-70' : ''}
        `}
        activeOpacity={0.8}
      >
        <Text className="text-white font-semibold">
          {disabled ? '…' : t('chat.send')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
