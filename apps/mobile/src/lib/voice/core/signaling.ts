import type { RealtimeToken } from './types';

/**
 * Get a short-lived Realtime session token + the target signaling URL from your server.
 * The server should already have authenticated the user and requested a Realtime token
 * from the model provider. If the token says `enabled: false`, we bail.
 */
export async function getToken(getTokenUrl: string): Promise<RealtimeToken> {
  const t: RealtimeToken = await fetch(getTokenUrl, { method: 'POST' }).then(
    (r) => r.json(),
  );
  if (!t?.enabled) throw new Error('Realtime not enabled');
  return t;
}

/**
 * Perform the **WebRTC SDP offer/answer** handshake with the Realtime endpoint.
 *
 * What this does, step by step:
 * 1) Create a local SDP **offer** from the RTCPeerConnection (`pc`) that
 *    describes our capabilities (audio codecs, ice-ufrag/pwd, candidates, etc.).
 * 2) Set that offer as our **local description** so ICE can start gathering.
 * 3) POST the offer SDP to the Realtime **signaling URL** (from the token),
 *    authenticated with `Bearer <token.token>` and `Content-Type: application/sdp`.
 *    The server returns a remote SDP **answer** describing its capabilities.
 * 4) Set the returned answer as the **remote description**, completing the
 *    negotiation. At this point, DTLS/SRTP setup proceeds and media/data
 *    can flow (your data channel + remote audio track events will start working).
 *
 * Notes:
 * - This is a **non-trickle** flow (single POST of the full offer; single answer back).
 *   If you ever switch to trickle ICE, you'd listen for `icecandidate` events and send
 *   candidates as they arrive; here the endpoint typically responds with enough info
 *   in the single answer for connectivity.
 * - `pc` should already have local tracks added (e.g., microphone) and any data
 *   channels created before calling `negotiate`, so they’re included in the offer.
 */
export async function negotiate(pc: RTCPeerConnection, token: RealtimeToken) {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);

  const resp = await fetch(token.url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token.token}`,
      'Content-Type': 'application/sdp',
    },
    body: offer.sdp ?? '',
  });

  const answerSDP = await resp.text();
  await pc.setRemoteDescription({ type: 'answer', sdp: answerSDP });
}
