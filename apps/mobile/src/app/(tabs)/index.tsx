import { useRealtimeVoice } from '@voice';
import { useTranslation } from 'react-i18next';

import { Screen } from '@ui/layout';
import { Avatar, Dot, MicButton, Pill } from '@ui/primitives';
import { AudioGlowAdaptive } from '@ui/visuals';
import { Text, View } from 'react-native';
import { GoToSkeletonPlaygroundButton } from '../../lib/features/btnt';

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
        <AudioGlowAdaptive level={level} speaking={speaking} />
        <Avatar size={220} />
      </View>

      {/* Greeting */}
      <Text className="mt-4 mb-8 text-center text-[22px] font-medium text-text dark:text-text-dark">
        {t('home.greeting')}
      </Text>

      <GoToSkeletonPlaygroundButton />

      {/* Mic button */}
      <MicButton
        level={level}
        connected={connected}
        speaking={speaking}
        loading={loading}
        onPress={onMicPress}
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
