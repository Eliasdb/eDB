import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

import { useRealtimeVoice } from '@voice';
import { useTranslation } from 'react-i18next';

import { Screen } from '@ui/layout';
import { Avatar, Button, Dot, Pill } from '@ui/primitives';
import { AudioGlow } from '@ui/visuals';

export default function HomeScreen() {
  const { start, stop, loading, connected, error, level, speaking, bands } =
    useRealtimeVoice();
  const { t } = useTranslation();
  const onMicPress = () => (connected ? stop() : start());

  return (
    <Screen>
      {/* Avatar + Glow */}
      <View
        style={{
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AudioGlow level={level} speaking={speaking} />
        <Avatar size={220} />
      </View>

      {/* Greeting */}
      <Text className="mt-4 text-[22px] font-medium text-text dark:text-text-dark text-center">
        {t('home.greeting')}
      </Text>

      {/* Mic (circle) */}
      <View className="mt-8">
        <Button
          shape="circle"
          size="md"
          tint={connected ? 'danger' : 'primary'}
          icon={<MaterialIcons name="mic" size={32} color="#fff" />}
          onPress={onMicPress}
          helperText={
            loading
              ? t('mic.connecting')
              : connected
                ? t('mic.stop')
                : t('mic.talk')
          }
        />
      </View>

      {/* Status pill */}
      <Pill
        className="mt-4 self-center"
        tone="neutral"
        variant="soft"
        size="sm"
        left={<Dot on={connected} />}
        text={
          loading
            ? 'Connecting…'
            : connected
              ? speaking
                ? 'Speaking…'
                : 'Live — you can speak'
              : 'Tap to talk'
        }
      />

      {/* Equalizer */}
      {/* <EqualizerBars values={bands} /> */}

      {/* Error */}
      {error ? <Text className="text-red-600 mt-2">{error}</Text> : null}
    </Screen>
  );
}
