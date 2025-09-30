// apps/mobile/src/lib/voice/realtimeClient.web.ts
import { attachRemoteLevelMeter } from './audioLevel.web';
import { makeMessageHandler } from './handlers';
import { getToken, negotiate } from './signaling';
import { createExecuteOnce } from './tools';
import type { RealtimeConnections, RealtimeOptions } from './types';
import { buildAuthHeaders, createAudioSink } from './utils';

import {
  applyToolEffectToCache,
  invalidateHub,
  invalidateToolLogs,
} from '@api';

export async function connectRealtime(
  getTokenUrl: string,
  apiBase: string,
  opts?: RealtimeOptions,
): Promise<RealtimeConnections> {
  const headers = buildAuthHeaders(opts?.bearer);

  // 1) Token
  const t = await getToken(getTokenUrl);

  // 2) PeerConnection (web)
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // 3) Data channel
  const dc = pc.createDataChannel('oai-events');

  // 4) Mic capture
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  // 5) Remote audio playback
  pc.addEventListener('track', (ev) => {
    const [remoteStream] = ev.streams;
    const el = createAudioSink();
    el.srcObject = remoteStream;
    el.play().catch(() => {});
  });

  // 🔊 Attach remote level meter (extracted helper)
  const detachMeter = attachRemoteLevelMeter(pc, {
    onLevel: opts?.onLevel,
    onSpeakingChanged: opts?.onSpeakingChanged,
    threshold: 0.7, // tweak as desired
    fftSize: 2048,
  });

  // 6) On open: session tools
  dc.addEventListener('open', async () => {
    const meta = await fetch(`${apiBase}/realtime/tools`).then((r) => r.json());
    dc.send(
      JSON.stringify({
        type: 'session.update',
        session: {
          instructions: meta.instructions,
          tools: meta.tools,
          tool_choice: 'auto',
          modalities: ['audio', 'text'],
          turn_detection: { type: 'server_vad' },
          // voice: 'sage', // cedar, ash, sage, verse, coral, ballad, marin
        },
      }),
    );
  });

  // 7) Messages + tool execution
  const executeOnce = createExecuteOnce(apiBase, headers, dc, {
    onToolEffect: (name, args, result) => {
      applyToolEffectToCache(name, args, result);
      opts?.onToolEffect?.(name, args, result);
    },
    onInvalidate: () => {
      invalidateHub();
      invalidateToolLogs();
      opts?.onInvalidate?.();
    },
    bearer: opts?.bearer,
  });

  const onMessage = makeMessageHandler(dc, executeOnce, {
    onToolEffect: (name, args) => {
      applyToolEffectToCache(name, args);
    },
  });

  dc.addEventListener('message', onMessage);

  // 8) Offer/Answer
  await negotiate(pc, t);

  // 9) Close helper
  const close = () => {
    try {
      dc.removeEventListener('message', onMessage);
    } catch {}
    try {
      dc.close();
    } catch {}
    try {
      pc.close();
    } catch {}
    try {
      detachMeter();
    } catch {}
    stream.getTracks().forEach((tr) => tr.stop());
  };

  return { pc, dc, close };
}
