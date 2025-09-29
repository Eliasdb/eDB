// apps/mobile/src/app/(tabs)/HomeScreen.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { useRealtimeVoice } from '@features/voice/hooks/useRealtimeVoice';
import { Screen } from '@ui/layout';
import { Avatar, Button, Pill, PulseDot } from '@ui/primitives';
import AudioGlow from '@ui/visuals/AudioGlow';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native';

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
          size="md" // web => w-16 h-16 (4rem), native => 64px
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
        tone="neutral" // or "primary" to match your nav accent
        variant="soft"
        size="sm"
        left={<PulseDot on={connected} />} // aligns properly in the row
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
