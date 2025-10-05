// apps/mobile/src/app/(tabs)/home/index.tsx
import { useRealtimeVoice } from '@voice';
import { useTranslation } from 'react-i18next';

import { Screen } from '@ui/layout';
import { Avatar, Button, Dot, Pill } from '@ui/primitives';
import { Text, View } from 'react-native';
import { AudioGlow } from '../../lib/ui/visuals/AudioGlow';

export default function HomeScreen() {
  const { start, stop, loading, connected, error, level, speaking } =
    useRealtimeVoice();
  const { t } = useTranslation();

  const onMicPress = () => (connected ? stop() : start());

  const statusText = loading
    ? t('mic.connecting', 'Connecting…')
    : connected
      ? speaking
        ? t('home.speaking', 'Speaking…')
        : t('home.live', 'Live — you can speak')
      : t('home.tapToTalk', 'Tap to talk');

  return (
    <Screen>
      {/* Glow + Avatar */}
      <View className="relative items-center justify-center">
        <AudioGlow level={level} speaking={speaking} />
        <Avatar size={220} />
      </View>

      {/* Greeting */}
      <Text className="mt-4 mb-8 text-center text-[22px] font-medium text-text dark:text-text-dark">
        {t('home.greeting')}
      </Text>

      {/* Mic button */}
      <Button
        className="mt-8 self-center"
        shape="circle"
        tint={connected ? 'danger' : 'primary'}
        size="md"
        icon="mic"
        testID="micButton"
        accessibilityLabel="Mic button"
        onPress={onMicPress}
        helperText={
          loading
            ? t('mic.connecting')
            : connected
              ? t('mic.stop')
              : t('mic.talk')
        }
      />

      {/* Status */}
      <Pill
        className="mt-4 self-center"
        tone="neutral"
        variant="soft"
        size="sm"
        left={<Dot on={connected} />}
        text={statusText}
      />

      {/* Error */}
      {error ? (
        <Text className="mt-2 text-center text-red-600">{error}</Text>
      ) : null}
    </Screen>
  );
}
