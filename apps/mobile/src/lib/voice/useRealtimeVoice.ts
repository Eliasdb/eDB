import { useCallback, useRef, useState } from 'react';
import { connectRealtime } from './realtime.web'; // or './realtime' on device

export function useRealtimeVoice() {
  const sessionRef = useRef<null | Awaited<ReturnType<typeof connectRealtime>>>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = useCallback(async () => {
    if (sessionRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const base = process.env.EXPO_PUBLIC_API_BASE!;
      const session = await connectRealtime(`${base}/realtime/token`, base);
      sessionRef.current = session;
      setConnected(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to start voice');
    } finally {
      setLoading(false);
    }
  }, []);

  const stop = useCallback(() => {
    try {
      sessionRef.current?.close();
    } catch {}
    sessionRef.current = null;
    setConnected(false);
  }, []);

  return { start, stop, loading, connected, error };
}
