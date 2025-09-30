// apps/mobile/src/lib/voice/previewRealtime.web.ts
// Web-only: isolated WebRTC session for voice previews (no mic, no tools).
// Uses your existing getToken() + negotiate() helpers so auth matches the main client.

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
  // 1) Short-lived token (reuses your server’s auth logic)
  const t = await getToken(getTokenUrl);
  if (!t?.url) throw new Error('Token missing url');

  // Expect an HTTP(s) negotiate endpoint for WebRTC (NOT a ws/wss URL)
  if (t.url.startsWith('wss://') || t.url.startsWith('ws://')) {
    throw new Error(
      `Preview expects a WebRTC HTTP negotiate URL, got WebSocket: ${t.url}.
Make your token endpoint return an HTTPS negotiate URL for WebRTC on web (not wss).`,
    );
  }

  // 2) PeerConnection (no mic tracks added for preview)
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // Ask to receive audio even without a local track (creates m=audio recvonly)
  pc.addTransceiver('audio', { direction: 'recvonly' });

  // 3) Data channel for preview commands
  const dc = pc.createDataChannel('oai-preview');

  // 4) Remote audio sink
  pc.addEventListener('track', (ev) => {
    const [remoteStream] = ev.streams;
    const el = createAudioSink(); // should be autoplay/playsInline already
    el.srcObject = remoteStream;
    el.play().catch(() => {});
  });

  // Optional: ignore benign cancel-race errors to keep console clean
  dc.addEventListener('message', (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg?.type === 'error' && msg.code === 'response_cancel_not_active') {
        return; // preview finished before we tried to cancel (benign)
      }
    } catch {}
  });

  // 5) Negotiate (mutates pc; returns void)
  await negotiate(pc, t);

  // 6) Wait until the data channel is OPEN before resolving (prevents send() InvalidStateError)
  await waitForChannelOpen(pc, dc);

  // Track the most recent preview response id so we can soft-cancel if user spam-clicks
  let lastPreviewId: string | null = null;

  dc.addEventListener('message', (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg?.type === 'response.created' && msg.response?.id) {
        lastPreviewId = msg.response.id;
      }
      // Auto-clear the handle when the response completes
      if (
        msg?.type === 'response.completed' &&
        msg.response?.id === lastPreviewId
      ) {
        lastPreviewId = null;
      }
    } catch {}
  });

  const play = (voiceKey: VoiceKey) => {
    // Hard guard: if channel isn't open, ignore the tap (UI already disables until ready)
    if (!dc || dc.readyState !== 'open') return;

    const explicitVoiceId = resolveVoiceId(voiceKey); // undefined for providerDefault (Clara)
    const name = getVoiceName(voiceKey);
    const tone = getVoiceTone(voiceKey);

    // Ensure any tiny overlap is stopped best-effort (it's fine if nothing is active)
    if (lastPreviewId) {
      safeSend(dc, {
        type: 'response.cancel',
        response_id: lastPreviewId,
      });
      lastPreviewId = null;
    } else {
      safeSend(dc, { type: 'response.cancel' });
    }

    // --- SESSION UPDATE ---
    // If explicitVoiceId exists (sofia/daniel/ava/liam), pin that voice.
    // If not (Clara/provider default), **omit the voice field entirely**
    // so the server resets to provider's default (fixes "stuck on previous voice").
    if (explicitVoiceId) {
      safeSend(dc, {
        type: 'session.update',
        session: {
          modalities: ['audio', 'text'],
          turn_detection: null,
          tools: [],
          tool_choice: 'none',
          voice: explicitVoiceId,
        },
      });
    } else {
      safeSend(dc, {
        type: 'session.update',
        session: {
          modalities: ['audio', 'text'],
          turn_detection: null,
          tools: [],
          tool_choice: 'none',
          // 🚫 No `voice` property here on purpose (Clara provider default)
        },
      });
    }

    // --- RESPONSE CREATE ---
    // Keep identity/tone constraints scoped to this single response to avoid carry-over.
    const line = buildPreviewLine(voiceKey);
    safeSend(dc, {
      type: 'response.create',
      response: {
        modalities: ['audio', 'text'],
        instructions: [
          `You are giving a short voice preview in English.`,
          `You are the assistant speaking to the user, not the user.`,
          `Introduce yourself as "${name}".`,
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
    const onError = (ev: any) =>
      cleanup(undefined, new Error(ev?.message || 'DataChannel error'));
    const onState = () => {
      const s = pc.connectionState;
      if (s === 'failed' || s === 'closed' || s === 'disconnected') {
        cleanup(undefined, new Error(`PeerConnection ${s}`));
      }
    };

    function cleanup(res?: () => void, err?: Error) {
      try {
        dc.removeEventListener('open', onOpen);
      } catch {}
      try {
        dc.removeEventListener('error', onError);
      } catch {}
      try {
        pc.removeEventListener('connectionstatechange', onState);
      } catch {}
      if (err) reject(err);
      else resolve();
    }

    dc.addEventListener('open', onOpen);
    dc.addEventListener('error', onError);
    pc.addEventListener('connectionstatechange', onState);
  });
}

function safeSend(dc: RTCDataChannel, payload: any) {
  if (!dc || dc.readyState !== 'open') return;
  try {
    dc.send(JSON.stringify(payload));
  } catch {
    // swallow send errors; preview UX should be fire-and-forget
  }
}
