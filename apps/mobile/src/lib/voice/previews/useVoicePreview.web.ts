// apps/mobile/src/lib/voice/useVoicePreview.web.ts
// Web-only hook to manage the preview session and expose simple actions.

import { useEffect, useRef, useState } from 'react';
import {
  connectPreviewRealtime,
  type PreviewSession,
} from './previewRealtime.web';
import type { VoiceKey } from './voices';

type Options = {
  /** Optional: pass a custom token URL, else env is used */
  getTokenUrl?: string;
  /** Whether to auto-connect on mount (default true) */
  autostart?: boolean;
};

export function useVoicePreview(opts?: Options) {
  const getTokenUrl =
    opts?.getTokenUrl ?? `${process.env.EXPO_PUBLIC_API_BASE}/realtime/token`;

  const autostart = opts?.autostart ?? true;

  const ref = useRef<PreviewSession | null>(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!autostart) return;

    let mounted = true;
    (async () => {
      try {
        const session = await connectPreviewRealtime(getTokenUrl);
        if (!mounted) {
          session.close();
          return;
        }
        ref.current = session;
        setReady(true);
      } catch (e) {
        console.warn('preview session failed', e);
      }
    })();

    return () => {
      mounted = false;
      ref.current?.close();
      ref.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTokenUrl, autostart]);

  const play = async (key: VoiceKey) => {
    if (!ref.current || !ready) return;
    try {
      setBusy(true);
      // New API: play takes a VoiceKey (session builds instructions internally)
      ref.current.play(key);
    } finally {
      // Keep it snappy; we just prevent rapid double-taps
      setBusy(false);
    }
  };

  return {
    ready,
    busy,
    play,
  };
}
