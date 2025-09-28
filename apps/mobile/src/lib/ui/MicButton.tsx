// apps/mobile/src/app/components/MicButton.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';

type Props = {
  onPress?: () => void;
  loading?: boolean;
  active?: boolean;
  style?: any;
};

export default function MicButton({ onPress, loading, active, style }: Props) {
  const { t } = useTranslation();

  return (
    <View className="items-center mt-6">
      <Pressable
        onPress={onPress}
        disabled={loading}
        className={`
          w-16 h-16 rounded-full items-center justify-center
          shadow-lg
          ${active ? 'bg-danger' : 'bg-primary'}
        `}
        style={({ pressed }) => [
          {
            transform: [{ scale: pressed ? 0.95 : 1 }],
            shadowColor: active ? '#ef4444' : '#6C63FF',
            shadowOpacity: active ? 0.5 : 0.35,
            shadowRadius: active ? 14 : 10,
            shadowOffset: { width: 0, height: 6 },
          },
          style,
        ]}
      >
        <MaterialIcons name="mic" size={32} color="white" />
      </Pressable>

      <Text className="mt-2 text-[14px] font-semibold text-text dark:text-text-dark">
        {loading ? t('mic.connecting') : active ? t('mic.stop') : t('mic.talk')}
      </Text>
    </View>
  );
}
