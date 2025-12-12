// apps/mobile/src/lib/voice/realtimeClient.native.ts
import { Platform } from 'react-native';
import { mediaDevices, RTCPeerConnection } from 'react-native-webrtc';

import { makeMessageHandler } from '../core/makeMessageHandler.native';
import { getToken, negotiate } from '../core/signaling';
import { createExecuteOnce } from '../core/tools';
import { buildAuthHeaders } from '../core/utils';
import { attachRemoteLevelMeter } from './audioLevel';
import { closeAudioSession, openAudioSession } from './audioSession';

import type { RealtimeConnections, RealtimeOptions } from '../core/types';

const TAG = 'realtime.native';

export async function connectRealtime(
  getTokenUrl: string,
  apiBase: string,
  opts?: RealtimeOptions, // contains onToolEffect / onInvalidate / bearer / onLevel / onSpeakingChanged
): Promise<RealtimeConnections> {
  const headers = buildAuthHeaders(opts?.bearer);

  // Ensure OS audio session is active before WebRTC
  await openAudioSession('speaker');

  const t = await getToken(getTokenUrl);

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  const dc = pc.createDataChannel('oai-events');

  // Mic
  const stream = await mediaDevices.getUserMedia({
    audio: Platform.select({
      ios: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
      } as any,
      default: true,
    }),
    video: false,
  });
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  // Remote audio: handled by RN automatically
  (pc as any).ontrack = () => {};
  (pc as any).onaddstream = () => {};

  // 🔊 Level meter to consumer
  const detachMeter = attachRemoteLevelMeter(pc as any, {
    onLevel: opts?.onLevel,
    onSpeakingChanged: opts?.onSpeakingChanged,
    threshold: 0.7,
    intervalMs: 250,
  });

  // Session tooling on open
  (dc as any).onopen = async () => {
    try {
      const meta = await fetch(`${apiBase}/realtime/tools`).then((r) =>
        r.json(),
      );
      const sessionUpdate = {
        type: 'session.update',
        session: {
          instructions: meta.instructions,
          tools: meta.tools,
          tool_choice: 'auto',
          modalities: ['audio', 'text'],
          turn_detection: { type: 'server_vad' },
        },
      };
      console.log(TAG, '→ session.update', sessionUpdate);
      dc.send(JSON.stringify(sessionUpdate));
    } catch (e) {
      console.log(TAG, 'session.update failed', e);
    }
  };

  // Tool execution pipeline — delegate effects/invalidation to adapters provided by the app
  const executeOnce = createExecuteOnce(apiBase, headers, dc as any, {
    onToolEffect: (name, args, result) => {
      opts?.onToolEffect?.(name, args, result);
    },
    onInvalidate: () => {
      opts?.onInvalidate?.();
    },
    bearer: opts?.bearer,
  });

  const onMessage = makeMessageHandler(dc as any, executeOnce, {
    onToolEffect: (name, args) => {
      // Additional per-message hooks can go here if you need
    },
  });

  (dc as any).onmessage = onMessage as any;

  await negotiate(pc as any, t);

  const close = () => {
    try {
      (dc as any).onmessage = undefined;
      (dc as any).onopen = undefined;
      (dc as any).close();
    } catch {}
    try {
      (pc as any).ontrack = undefined;
      (pc as any).onaddstream = undefined;
      (pc as any).close();
    } catch {}
    try {
      detachMeter();
    } catch {}
    try {
      stream.getTracks().forEach((tr) => tr.stop());
    } catch {}
    closeAudioSession().catch(() => {});
  };

  return { pc: pc as any, dc: dc as any, close };
}
