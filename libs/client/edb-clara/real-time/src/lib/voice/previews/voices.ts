// apps/mobile/src/lib/voice/voices.ts

// Add a special key for the provider's default voice (Clara).
export type VoiceKey = 'providerDefault' | 'sofia' | 'daniel' | 'ava' | 'liam';

export type VoiceItem = {
  key: VoiceKey;
  name: string; // What the assistant should call itself in the preview
  meta: string; // short descriptor for UI
  gender: 'female' | 'male';
  tone: string; // high-level vibe to hint at delivery
};

/**
 * Start with the provider default (Clara) selected.
 */
export const DEFAULT_VOICE_KEY: VoiceKey = 'providerDefault';

/**
 * Map UI keys to actual model voice ids used by your Realtime session.
 * NOTE: We deliberately DO NOT map 'providerDefault' — leaving voice unset
 * lets the provider choose its current default.
 */
export const VOICE_ID_BY_KEY: Partial<Record<VoiceKey, string>> = {
  sofia: 'sage',
  daniel: 'verse',
  ava: 'coral',
  liam: 'ballad',
};

export function resolveVoiceId(key: VoiceKey): string | undefined {
  return VOICE_ID_BY_KEY[key as keyof typeof VOICE_ID_BY_KEY];
}

// Your four explicit voices
export const VOICES: VoiceItem[] = [
  {
    key: 'sofia',
    name: 'Sofia',
    meta: 'female, calm',
    gender: 'female',
    tone: 'Calm',
  },
  {
    key: 'daniel',
    name: 'Daniel',
    meta: 'male, clear',
    gender: 'male',
    tone: 'Clear',
  },
  {
    key: 'ava',
    name: 'Ava',
    meta: 'female, energetic',
    gender: 'female',
    tone: 'Energetic',
  },
  {
    key: 'liam',
    name: 'Liam',
    meta: 'male, warm',
    gender: 'male',
    tone: 'Warm',
  },
];

// Helpers for names/tones
export function getVoiceName(key: VoiceKey): string {
  if (key === 'providerDefault') return 'Clara';
  return VOICES.find((v) => v.key === key)?.name ?? 'Your Assistant';
}
export function getVoiceTone(key: VoiceKey): string {
  if (key === 'providerDefault') return 'Natural';
  return VOICES.find((v) => v.key === key)?.tone ?? 'Natural';
}

/**
 * A tiny, deterministic one-liner per voice.
 * Clara (provider default) explicitly introduces herself as "Clara".
 */
export function buildPreviewLine(key: VoiceKey): string {
  if (key === 'providerDefault') return '“Hi, I’m Clara.”';
  const name = getVoiceName(key);
  return `“Hi, I'm ${name}.”`;
}

/**
 * Preview-specific session instructions to stop role confusion.
 * Clara is explicitly named in the prompt.
 */
export function buildPreviewInstructions(key: VoiceKey): string {
  const name = key === 'providerDefault' ? 'Clara' : getVoiceName(key);
  const tone = getVoiceTone(key);
  return [
    `You are providing a short voice *preview* in English.`,
    `You are the assistant speaking to the user, not the user.`,
    `For this preview only, introduce yourself as ${name}.`,
    `Deliver it in a ${tone.toLowerCase()} tone.`,
    `Speak exactly the quoted line you are given. Do not add anything else.`,
  ].join(' ');
}
