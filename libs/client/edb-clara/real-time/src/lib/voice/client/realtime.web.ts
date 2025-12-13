// apps/mobile/src/lib/voice/realtimeClient.web.ts
import { makeMessageHandler } from '../core/handlers';
import { getToken, negotiate } from '../core/signaling';
import { createExecuteOnce } from '../core/tools';
import type { RealtimeConnections, RealtimeOptions } from '../core/types';
import { buildAuthHeaders, createAudioSink } from '../core/utils';
import { attachRemoteLevelMeter } from './audioLevel';

export async function connectRealtime(
  getTokenUrl: string,
  apiBase: string,
  opts?: RealtimeOptions,
): Promise<RealtimeConnections> {
  const headers = buildAuthHeaders(opts?.bearer);
  const t = await getToken(getTokenUrl);

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  const dc = pc.createDataChannel('oai-events');

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  pc.addEventListener('track', (ev) => {
    const [remoteStream] = ev.streams;
    const el = createAudioSink();
    el.srcObject = remoteStream;
    el.play().catch(() => undefined);
  });

  const detachMeter = attachRemoteLevelMeter(pc as any, {
    onLevel: opts?.onLevel,
    onSpeakingChanged: opts?.onSpeakingChanged,
    threshold: 0.1,
  });

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
        },
      }),
    );
  });

  const executeOnce = createExecuteOnce(apiBase, headers, dc, {
    onToolEffect: (name, args, result) => {
      opts?.onToolEffect?.(name, args, result);
    },
    onInvalidate: () => {
      opts?.onInvalidate?.();
    },
    bearer: opts?.bearer,
  });

  const onMessage = makeMessageHandler(dc, executeOnce, {
    onToolEffect: (name, args, result) =>
      opts?.onToolEffect?.(name, args, result),
  });

  dc.addEventListener('message', onMessage);

  await negotiate(pc, t);

  const close = () => {
    dc.removeEventListener('message', onMessage);
    dc.close();
    pc.close();
    detachMeter();
    stream.getTracks().forEach((tr) => tr.stop());
  };

  return { pc, dc, close };
}
