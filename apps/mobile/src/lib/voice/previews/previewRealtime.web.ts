// apps/mobile/src/lib/voice/previewRealtime.web.ts

import { getToken, negotiate } from '../core/signaling';
import { createAudioSink } from '../core/utils';
import {
  buildPreviewLine,
  getVoiceName,
  getVoiceTone,
  resolveVoiceId,
  type VoiceKey,
} from './voices';

export type PreviewSession = {
  pc: RTCPeerConnection;
  dc: RTCDataChannel;
  play: (voiceKey: VoiceKey) => void;
  close: () => void;
};

export async function connectPreviewRealtime(
  getTokenUrl: string,
): Promise<PreviewSession> {
  const t = await getToken(getTokenUrl);
  if (!t?.url) throw new Error('Token missing url');
  if (t.url.startsWith('ws')) {
    throw new Error('Preview expects HTTPS negotiate URL, not ws/wss');
  }

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  pc.addTransceiver('audio', { direction: 'recvonly' });

  const dc = pc.createDataChannel('oai-preview');

  pc.addEventListener('track', (ev) => {
    const [remoteStream] = ev.streams;
    const el = createAudioSink();
    el.srcObject = remoteStream;
    el.play().catch(() => {});
  });

  await negotiate(pc, t);
  await waitForChannelOpen(pc, dc);

  let lastPreviewId: string | null = null;
  dc.addEventListener('message', (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg?.type === 'response.created') {
        lastPreviewId = msg.response?.id ?? null;
      }
      if (
        msg?.type === 'response.completed' &&
        msg.response?.id === lastPreviewId
      ) {
        lastPreviewId = null;
      }
    } catch {}
  });

  const play = (voiceKey: VoiceKey) => {
    if (dc.readyState !== 'open') return;

    const voiceId = resolveVoiceId(voiceKey);
    const name = getVoiceName(voiceKey);
    const tone = getVoiceTone(voiceKey);

    // Cancel any overlap
    if (lastPreviewId) {
      safeSend(dc, { type: 'response.cancel', response_id: lastPreviewId });
      lastPreviewId = null;
    } else {
      safeSend(dc, { type: 'response.cancel' });
    }

    // Keep session minimal
    safeSend(dc, {
      type: 'session.update',
      session: {
        modalities: ['audio', 'text'],
        turn_detection: null,
        tools: [],
        tool_choice: 'none',
        voice: voiceId,
      },
    });

    // Put identity/tone + line together here so the model only uses it once
    const line = buildPreviewLine(voiceKey);
    safeSend(dc, {
      type: 'response.create',
      response: {
        modalities: ['audio', 'text'],
        instructions: [
          `You are giving a short **voice preview** in English.`,
          `Introduce yourself **as the assistant named "${name}"**, not the user.`,
          `Deliver it in a ${tone.toLowerCase()} tone.`,
          `Say exactly this line and nothing more: ${line}`,
        ].join(' '),
        conversation: 'none',
      },
    });
  };

  const close = () => {
    try {
      dc.close();
    } catch {}
    try {
      pc.close();
    } catch {}
  };

  return { pc, dc, play, close };
}

/* ---------- helpers ---------- */

function waitForChannelOpen(pc: RTCPeerConnection, dc: RTCDataChannel) {
  if (dc.readyState === 'open') return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const onOpen = () => cleanup(resolve);
    const onErr = () => cleanup(undefined, new Error('DataChannel error'));
    const onState = () => {
      const s = pc.connectionState;
      if (['failed', 'closed', 'disconnected'].includes(s)) {
        cleanup(undefined, new Error(`PeerConnection ${s}`));
      }
    };
    function cleanup(res?: () => void, err?: Error) {
      dc.removeEventListener('open', onOpen);
      dc.removeEventListener('error', onErr);
      pc.removeEventListener('connectionstatechange', onState);
      err ? reject(err) : resolve();
    }
    dc.addEventListener('open', onOpen);
    dc.addEventListener('error', onErr);
    pc.addEventListener('connectionstatechange', onState);
  });
}

function safeSend(dc: RTCDataChannel, payload: any) {
  if (dc.readyState !== 'open') return;
  try {
    dc.send(JSON.stringify(payload));
  } catch {}
}
