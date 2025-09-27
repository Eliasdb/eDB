import { useRealtimeVoice } from '@features/voice/hooks/useRealtimeVoice';
import { Avatar, MicButton, PulseDot } from '@ui';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { start, stop, loading, connected, error } = useRealtimeVoice();
  const onMicPress = () => (connected ? stop() : start());

  return (
    <ScrollView
      // 👇 let vertical panning scroll even when touching children (RN Web)
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ alignItems: 'center' }}>
        <Avatar size={320} />
      </View>

      <View className="flex-1 items-center justify-center bg-red-500 dark:bg-black">
        <Text className="text-xl font-bold text-red-500 dark:text-red-500">
          Hello Tailwind + NativeWind
        </Text>
      </View>

      <Text style={styles.text}>
        Hi, I’m Clara.{'\n'}What can I do for you today???
      </Text>

      <MicButton onPress={onMicPress} loading={loading} active={connected} />

      <View style={styles.statusRow}>
        <PulseDot on={connected} />
        <Text style={styles.statusText}>
          {loading
            ? 'Connecting…'
            : connected
              ? 'Live — you can speak'
              : 'Tap to talk'}
        </Text>
      </View>

      {error ? (
        <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: '100%',
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 22,
    marginVertical: 24,
    textAlign: 'center',
    fontWeight: '500',
    color: '#333',
  },
  statusRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignSelf: 'center',
  },
  statusText: { color: '#111827', fontSize: 13, fontWeight: '600' },
});
