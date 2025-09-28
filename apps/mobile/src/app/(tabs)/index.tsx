// apps/mobile/src/app/(tabs)/HomeScreen.tsx
import { useRealtimeVoice } from '@features/voice/hooks/useRealtimeVoice';
import { Avatar, MicButton, PulseDot } from '@ui';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';

export default function HomeScreen() {
  const { start, stop, loading, connected, error } = useRealtimeVoice();
  const { t } = useTranslation();
  const onMicPress = () => (connected ? stop() : start());

  return (
    <ScrollView
      className="flex-1 bg-surface dark:bg-surface-dark"
      contentContainerStyle={{
        minHeight: '100%',
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Avatar */}
      <View className="items-center">
        <Avatar size={320} />
      </View>

      {/* Greeting */}
      <Text className="text-[22px] font-medium text-text dark:text-text-dark text-center my-6">
        {t('home.greeting')}
      </Text>

      {/* Mic button */}
      <MicButton onPress={onMicPress} loading={loading} active={connected} />

      {/* Status row */}
      <View className="mt-3 flex-row items-center gap-2 bg-muted dark:bg-muted-dark px-3 py-1.5 rounded-full self-center">
        <PulseDot on={connected} />
        <Text className="text-[13px] font-semibold text-text dark:text-text-dark">
          {loading
            ? t('home.status.connecting')
            : connected
              ? t('home.status.live')
              : t('home.status.tap')}
        </Text>
      </View>

      {/* Error */}
      {error ? <Text className="text-red-600 mt-2">{error}</Text> : null}
    </ScrollView>
  );
}
