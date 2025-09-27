// apps/mobile/src/app/(tabs)/index.tsx
import { StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import MicButton from '../components/MicButton';
import PulseDot from '../components/PulseDot';

// ⬇️ use the hook instead of calling connectRealtime directly
import { useRealtimeVoice } from '../../lib/voice/useRealtimeVoice';

export default function HomeScreen() {
  const { start, stop, loading, connected, error } = useRealtimeVoice();

  const onMicPress = () => {
    if (connected) stop();
    else start();
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Avatar size={320} />
      </View>

      <Text style={styles.text}>
        Hi, I’m Clara.{'\n'}What can I do for you today??
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
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
