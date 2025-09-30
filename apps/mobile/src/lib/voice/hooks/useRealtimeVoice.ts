import { useCallback, useRef, useState } from 'react';
import { attachRemoteLevelMeter } from '../client/audioLevel.web';
import { connectRealtime } from '../client/realtime.web';

export function useRealtimeVoice() {
  const sessionRef = useRef<Awaited<ReturnType<typeof connectRealtime>> | null>(
    null,
  );
  const meterCleanupRef = useRef<null | (() => void)>(null);

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [level, setLevel] = useState(0); // 0..1
  const [speaking, setSpeaking] = useState(false);
  const [bands, setBands] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const start = useCallback(async () => {
    if (sessionRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const base = process.env.EXPO_PUBLIC_API_BASE!;
      const bearer = undefined;

      const session = await connectRealtime(`${base}/realtime/token`, base, {
        bearer,
      });
      sessionRef.current = session;
      setConnected(true);

      // Attach the audio level meter to remote track
      meterCleanupRef.current = attachRemoteLevelMeter(session.pc, {
        onLevel: setLevel,
        onBands: setBands,
        onSpeakingChanged: setSpeaking,
        threshold: 0.05,
        smoothing: 0.85,
        falloff: 0.65,
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to start voice');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      meterCleanupRef.current?.(); // detach meter first
      meterCleanupRef.current = null;
      sessionRef.current?.close();
    } catch {}
    sessionRef.current = null;
    setConnected(false);
    setSpeaking(false);
    setLevel(0);
    setBands([0, 0, 0, 0, 0, 0, 0]);
  }, []);

  return { start, stop, loading, connected, error, level, speaking, bands };
}
