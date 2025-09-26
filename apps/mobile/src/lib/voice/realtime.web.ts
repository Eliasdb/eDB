// apps/mobile/src/lib/voice/realtime-web.ts

export type RealtimeToken = { enabled: boolean; url: string; token: string };

function safeParseJSON(s: unknown) {
  try {
    return typeof s === 'string' ? JSON.parse(s) : (s ?? {});
  } catch {
    return {};
  }
}

export async function connectRealtime(
  getTokenUrl: string,
  apiBase: string,
  opts?: { bearer?: string }, // <-- add this
) {
  const headers: HeadersInit = {};
  if (opts?.bearer) headers['Authorization'] = `Bearer ${opts.bearer}`;

  // 1) Get short-lived token + target URL from your server
  const t: RealtimeToken = await fetch(getTokenUrl, { method: 'POST' }).then(
    (r) => r.json(),
  );
  if (!t?.enabled) throw new Error('Realtime not enabled');

  // 2) Browser RTCPeerConnection
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  });

  // 3) Data channel for events
  const dc = pc.createDataChannel('oai-events');

  // Buffer for streamed (delta) function-call args
  const argBuffers = new Map<string, { name: string; argsText: string }>();

  // Track which call_ids we already executed to prevent duplicates
  const executedCalls = new Set<string>();

  // Helper: run the tool exactly once
  // Helper: run the tool exactly once
  async function executeOnce(call_id: string, name: string, args: any) {
    if (executedCalls.has(call_id)) return;
    executedCalls.add(call_id);

    const exec = await fetch(`${apiBase}/realtime/execute-tool`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name, args }),
    }).then((r) => r.json());

    // Protocol wants a string for function_call_output.output
    const outputString =
      typeof exec === 'string' ? exec : JSON.stringify(exec ?? {}, null, 2);

    // 1) Append the tool output to the conversation
    dc.send(
      JSON.stringify({
        type: 'conversation.item.create',
        item: { type: 'function_call_output', call_id, output: outputString },
      }),
    );

    // 2) Ask the model to respond (follow-up)
    dc.send(
      JSON.stringify({
        type: 'response.create',
        response: {
          modalities: ['audio', 'text'],
          instructions:
            'Summarize the tool result in one sentence, then ask exactly ONE short follow-up question under 15 words.',
        },
      }),
    );
  }

  dc.addEventListener('open', async () => {
    console.log('[RT] datachannel open');

    // Pull canonical tool specs + instructions from the server
    const meta = await fetch(`${apiBase}/realtime/tools`).then((r) => r.json());
    console.log(
      '[RT] loaded tools:',
      meta.tools?.map((t: any) => t.name),
    );

    // Register the session config (instructions + tools)
    dc.send(
      JSON.stringify({
        type: 'session.update',
        session: {
          instructions: meta.instructions,
          tools: meta.tools, // server-supplied tool specs
          tool_choice: 'auto',
          modalities: ['audio', 'text'],
          turn_detection: { type: 'server_vad' },
        },
      }),
    );
  });

  dc.addEventListener('message', async (e) => {
    const evt = safeParseJSON(e.data);
    if (!evt?.type) return;

    // Noise filter: keep logs useful
    if (
      evt.type !== 'response.audio.delta' &&
      evt.type !== 'input_audio_buffer.speech_started' &&
      evt.type !== 'input_audio_buffer.speech_stopped'
    ) {
      console.log('[RT evt]', evt.type, evt);
    }

    switch (evt.type) {
      /* ✅ Streamed args deltas */
      case 'response.function_call_arguments.delta': {
        const { call_id, name, delta } = evt;
        const cur = argBuffers.get(call_id) ?? { name, argsText: '' };
        cur.argsText += delta ?? '';
        argBuffers.set(call_id, cur);
        break;
      }

      /* ✅ Canonical place to execute: when args are DONE */
      case 'response.function_call_arguments.done': {
        const { call_id } = evt;
        const buf = argBuffers.get(call_id);
        if (!buf) break;
        argBuffers.delete(call_id);

        const args = safeParseJSON(buf.argsText || '{}');
        console.log('[RT tool – args done]', buf.name, args);

        await executeOnce(call_id, buf.name, args);
        break;
      }

      /* ℹ️ Item surfaced — just initialize buffer; DO NOT execute here */
      case 'response.output_item.added': {
        const item = evt.item;
        if (item?.type !== 'function_call') break;

        const { call_id, name } = item;

        // If args might stream, prep buffer. We won't execute here.
        if (!argBuffers.has(call_id)) {
          argBuffers.set(call_id, { name, argsText: '' });
        }
        break;
      }

      /* ✅ Fallback execution if we never got args deltas/done */
      case 'response.output_item.done': {
        const item = evt.item;
        if (item?.type !== 'function_call') break;

        const { call_id, name, arguments: fullArgs } = item;

        // Prefer buffered args if present; otherwise parse fullArgs
        const buffered = argBuffers.get(call_id);
        const args = buffered
          ? safeParseJSON(buffered.argsText || '{}')
          : safeParseJSON(fullArgs || '{}');

        argBuffers.delete(call_id);

        await executeOnce(call_id, name, args);
        break;
      }
    }
  });
  /* end dc.addEventListener('message', …) */

  // 4) Mic capture
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false,
  });
  stream.getTracks().forEach((track) => pc.addTrack(track, stream));

  // 5) Remote audio playback
  pc.addEventListener('track', (ev) => {
    const [remoteStream] = ev.streams;
    const el = new Audio();
    el.autoplay = true;
    el.setAttribute('playsinline', 'true'); // iOS Safari
    el.srcObject = remoteStream;
    el.play().catch(() => {});
  });

  // 6) Offer/Answer with OpenAI
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
