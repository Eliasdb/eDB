// apps/mobile/src/lib/voice/useRealtimeVoice.ts
import { connectRealtime } from '@voice';
import { useCallback, useRef, useState } from 'react';

export function useRealtimeVoice() {
  const sessionRef = useRef<Awaited<ReturnType<typeof connectRealtime>> | null>(
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
      // If you have an auth token for your API, pass it here:
      const bearer = undefined; // e.g. authStore.token
      const session = await connectRealtime(`${base}/realtime/token`, base, {
        bearer,
      });
      sessionRef.current = session;
      setConnected(true);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to start voice');
      setConnected(false);
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
