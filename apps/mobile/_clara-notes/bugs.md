# Clara — Bugs & Issues Log

## Voice Realtime (Native vs Web)

**Issue:**  
Voice worked fine on **web** builds but failed on **native** (iOS/Android):

- Mic capture was flaky.
- Model sometimes “talked to itself” or cut off mid-sentence.

**Root cause:**

- On native, WebRTC was negotiating **before the OS audio session** was configured for duplex/VoIP, so echo cancellation, noise suppression, and gain control weren’t reliably applied.

**Fix (expo-audio was the key change):**

- **Use `expo-audio`** to open a proper **voice/duplex** audio session **before** creating the `RTCPeerConnection` (this was the fix).
- Call `openAudioSession('speaker')` _before_ `getUserMedia()` and negotiation; call `closeAudioSession()` during teardown.
- Keep `session.update` consistent (tools, `server_vad`, modalities).
- Tweak VAD threshold/interval and wait for `response.completed` before flushing buffered audio/text.

**Relevant snippets:**

```ts
// audioSession.ts — expo-audio is what gave us parity with web
async function safeSetAudioModeAsync(mode: any) {
  try {
    const audio = await import('expo-audio'); // ← expo-audio unlocks config
    await audio.setAudioModeAsync(mode);
  } catch (e) {
    console.warn('[audioSession] expo-audio not available:', e);
  }
}

export async function openAudioSession(
  route: 'speaker' | 'earpiece' = 'speaker',
) {
  await safeSetAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    interruptionMode: 'doNotMix',
    mode: 'voiceChat' as any, // puts OS into duplex/VoIP mode
    shouldRouteThroughEarpiece:
      Platform.OS === 'android' && route === 'earpiece',
  });
  await new Promise((r) => setTimeout(r, 150)); // let CoreAudio settle
}
```

```ts
// realtimeClient.native.ts
// ✅ ensure OS audio session is active before WebRTC
await openAudioSession('speaker');

// later in close()
try {
  stream.getTracks().forEach((tr) => tr.stop());
} catch {}
await closeAudioSession();
```

```ts

// session.update (both web + native)
{
  type: 'session.update',
  session: {
    instructions: meta.instructions,
    tools: meta.tools,
    tool_choice: 'auto',
    modalities: ['audio', 'text'],
    turn_detection: { type: 'server_vad' },
    // voice: 'sage',
  }
}
```
