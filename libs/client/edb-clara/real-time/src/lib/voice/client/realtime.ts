// apps/mobile/src/lib/voice/realtimeClient.native.ts
import { mediaDevices, RTCPeerConnection } from 'react-native-webrtc';

import { makeMessageHandler } from '../core/makeMessageHandler.native';
import { getToken, negotiate } from '../core/signaling';
import { createExecuteOnce } from '../core/tools';
import { buildAuthHeaders } from '../core/utils';
import { attachRemoteLevelMeter } from './audioLevel';

import { closeAudioSession, openAudioSession } from './audioSession';

import { invalidateToolLogs } from '@edb-clara/client-admin';
import { invalidateAfterTool } from '@edb-clara/client-crm';

import { Platform } from 'react-native';

import type { RealtimeConnections, RealtimeOptions } from '../core/types';

const TAG = 'realtime.native';

export async function connectRealtime(
  getTokenUrl: string,
  apiBase: string,
  opts?: RealtimeOptions,
): Promise<RealtimeConnections> {
  const headers = buildAuthHeaders(opts?.bearer);

  // 0) Ensure OS is in voice-chat mode BEFORE WebRTC
  await openAudioSession('speaker'); // or 'earpiece' if you want earpiece routing

  // 1) Token
  const t = await getToken(getTokenUrl);

  // 2) PeerConnection
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // 3) Data channel
  const dc = pc.createDataChannel('oai-events');

  // 4) Mic capture (AEC/NS/AGC now map correctly through OS)
  const stream = await mediaDevices.getUserMedia({
    audio: Platform.select({
      ios: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1,
        sampleRate: 48000,
      } as any,
      default: true, // Android & others: simple flag
    }),
    video: false,
  });
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  // 5) Remote audio (RN plays via system audio automatically)
  (pc as any).ontrack = () => {};
  (pc as any).onaddstream = () => {};

  // 🔊 Level meter
  const detachMeter = attachRemoteLevelMeter(pc as any, {
    onLevel: opts?.onLevel,
    onSpeakingChanged: opts?.onSpeakingChanged,
    threshold: 0.7,
    intervalMs: 250,
  });

  // 6) On open: send session.update (same as web)
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
          turn_detection: { type: 'server_vad' }, // same as web
          // voice: 'sage',
        },
      };

      console.log(TAG, '→ session.update', sessionUpdate);
      dc.send(JSON.stringify(sessionUpdate));
    } catch (e) {
      console.log(TAG, 'session.update failed', e);
    }
  };

  // 7) Messages + tool execution
  const executeOnce = createExecuteOnce(apiBase, headers, dc as any, {
    onToolEffect: (name, args, result) => {
      invalidateAfterTool(name, args, result); // ✅ precise invalidation
      opts?.onToolEffect?.(name, args, result);
    },
    onInvalidate: () => {
      invalidateToolLogs();
      opts?.onInvalidate?.();
    },
    bearer: opts?.bearer,
  });

  const onMessage = makeMessageHandler(dc as any, executeOnce, {
    onToolEffect: (name, args) => {},
  });

  (dc as any).onmessage = onMessage as any;

  // 8) Offer/Answer
  await negotiate(pc as any, t);

  // 9) Close helper
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
    // ✅ Reset OS audio back to passive
    closeAudioSession().catch(() => {});
  };

  return { pc: pc as any, dc: dc as any, close };
}
