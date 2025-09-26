// apps/mobile/src/app/(tabs)/index.tsx
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { API_BASE } from '../../lib/api/client';
import { connectRealtime } from '../../lib/voice/realtime.web';
import Avatar from '../components/Avatar';
import MicButton from '../components/MicButton';
import PulseDot from '../components/PulseDot';

type SessionHandle = { close(): void };

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const sessionRef = useRef<SessionHandle | null>(null);

  const tokenUrl = `${API_BASE}/realtime/token`;

  async function onMicPress() {
    try {
      if (sessionRef.current) {
        // Stop session
        sessionRef.current.close();
        sessionRef.current = null;
        setConnected(false);
        return;
      }
      setError(null);
      setLoading(true);

      // Start session
      const sess = await connectRealtime(tokenUrl, API_BASE);
      sessionRef.current = sess;
      setConnected(true);
    } catch (e: any) {
      setError(e?.message ?? String(e));
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }

  // Clean up if leaving the screen
  useEffect(() => {
    return () => {
      try {
        sessionRef.current?.close();
      } catch {}
      sessionRef.current = null;
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Avatar + live status */}
      <View style={{ alignItems: 'center' }}>
        <Avatar size={320} />
      </View>

      <Text style={styles.text}>
        Hi, I’m Clara.{'\n'}What can I do for you today?
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

      <Text style={{ marginTop: 6, color: '#666' }}>{API_BASE}</Text>
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
  statusText: {
    color: '#111827',
    fontSize: 13,
    fontWeight: '600',
  },
});
