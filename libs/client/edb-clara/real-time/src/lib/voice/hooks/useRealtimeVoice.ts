// apps/mobile/src/lib/voice/hooks/useRealtimeVoice.ts
import { useCallback, useRef, useState } from 'react';
import { attachRemoteLevelMeter } from '../client/audioLevel';
import { connectRealtime } from '../client/realtime';
import type { RealtimeOptions } from '../core/types';

type Adapters = Pick<RealtimeOptions, 'onToolEffect' | 'onInvalidate'>;

export function useRealtimeVoice(adapters?: Adapters) {
  const sessionRef = useRef<Awaited<ReturnType<typeof connectRealtime>> | null>(
    null,
  );
  const meterCleanupRef = useRef<null | (() => void)>(null);

  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [level, setLevel] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  const [bands, setBands] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const start = useCallback(async () => {
    if (sessionRef.current) return;
    setLoading(true);
    setError(null);
    try {
      const base = process.env['EXPO_PUBLIC_API_BASE']!;
      const bearer = undefined;

      const session = await connectRealtime(`${base}/realtime/token`, base, {
        bearer,
        onToolEffect: adapters?.onToolEffect,
        onInvalidate: adapters?.onInvalidate,
        onLevel: setLevel,
        onSpeakingChanged: setSpeaking,
      });
      sessionRef.current = session;
      setConnected(true);

      // Attach meter (native/web minor differences handled in attachRemoteLevelMeter)
      meterCleanupRef.current = attachRemoteLevelMeter(session.pc as any, {
        onLevel: setLevel,
        onSpeakingChanged: setSpeaking,
        threshold: 0.05,
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to start voice');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  }, [adapters?.onInvalidate, adapters?.onToolEffect]);

  const stop = useCallback(() => {
    try {
      meterCleanupRef.current?.();
    } catch {}
    meterCleanupRef.current = null;
    try {
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
