import { Platform } from 'react-native';

// Lazy import so Expo Go doesn’t explode if someone opens the app there.
async function safeSetAudioModeAsync(mode: any) {
  try {
    const audio = await import('expo-audio');
    await audio.setAudioModeAsync(mode);
  } catch (e) {
    console.warn('[audioSession] expo-audio not available:', e);
  }
}

type Route = 'speaker' | 'earpiece';

export async function openAudioSession(route: Route = 'speaker') {
  // Configure **iOS** too to avoid the simulator deadlock.
  await safeSetAudioModeAsync({
    allowsRecording: true,
    playsInSilentMode: true,
    shouldPlayInBackground: false,

    // Don’t try to mix while we’re doing RTC
    interruptionMode: 'doNotMix',

    // Prefer a VoIP/duplex-friendly mode if present (expo-audio accepts string union)
    // If your installed version doesn’t support 'voiceChat', it will ignore it.
    mode: 'voiceChat' as any,

    // Android-only: earpiece vs speaker
    shouldRouteThroughEarpiece:
      Platform.OS === 'android' && route === 'earpiece',
  });

  // Give CoreAudio a breath so WebRTC doesn’t race the session change.
  await new Promise((r) => setTimeout(r, 200));
}

export async function closeAudioSession() {
  await safeSetAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode: false,
    shouldPlayInBackground: false,
    interruptionMode: 'mixWithOthers',
    // leave mode/defaults alone on close
    shouldRouteThroughEarpiece: false,
  });
}
