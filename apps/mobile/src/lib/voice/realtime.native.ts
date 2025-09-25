import { mediaDevices, RTCPeerConnection } from 'react-native-webrtc';

type RealtimeToken = { enabled: boolean; url: string; token: string };

export async function connectRealtime(getTokenUrl: string) {
  const t: RealtimeToken = await fetch(getTokenUrl, { method: 'POST' }).then(
    (r) => r.json(),
  );
  if (!t?.enabled) throw new Error('Realtime not enabled');

  const pc = new RTCPeerConnection({
    iceServers: [{ urls: ['stun:stun.l.google.com:19302'] }],
  });

  const dc = pc.createDataChannel('oai-events');
  dc.addEventListener('open', () => {});
  dc.addEventListener('message', (e: any) => {
    /* handle events */
  });

  const stream = await mediaDevices.getUserMedia({ audio: true, video: false });
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  pc.addEventListener('track', (_ev: any) => {
    /* RN webrtc auto-plays remote audio */
  });

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const resp = await fetch(t.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${t.token}`,
      'Content-Type': 'application/sdp',
    },
    body: offer.sdp ?? '',
  });
  const answerSDP = await resp.text();
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });

  return {
    pc,
    dc,
    close: () => {
      try {
        dc.close();
      } catch {}
      try {
        pc.close();
      } catch {}
      stream.getTracks().forEach((tr) => tr.stop());
    },
  };
}
