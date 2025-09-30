// apps/mobile/src/lib/voice/voices.ts

export type VoiceKey = 'sofia' | 'daniel' | 'ava' | 'liam';

export type VoiceItem = {
  key: VoiceKey;
  name: string; // What the assistant should call itself
  meta: string; // short descriptor for UI
  gender: 'female' | 'male';
  tone: string; // high-level vibe to hint at delivery
};

/**
 * Map UI keys to actual model voice ids used by your Realtime session.
 * Replace these with the IDs your provider supports (e.g. 'sage', 'verse', ...).
 */
export const VOICE_ID_BY_KEY: Record<VoiceKey, string> = {
  sofia: 'sage',
  daniel: 'verse',
  ava: 'coral',
  liam: 'ballad',
};

export function resolveVoiceId(key: VoiceKey): string {
  return VOICE_ID_BY_KEY[key] ?? 'sage';
}

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
  return VOICES.find((v) => v.key === key)?.name ?? 'Your Assistant';
}
export function getVoiceTone(key: VoiceKey): string {
  return VOICES.find((v) => v.key === key)?.tone ?? 'Natural';
}

/**
 * A tiny, deterministic one-liner per voice.
 * Keeping it quoted avoids the model “getting creative.”
 */
export function buildPreviewLine(key: VoiceKey): string {
  const name = getVoiceName(key);
  return `“Hi, I'm ${name}.”`;
}

/**
 * Preview-specific session instructions to stop the model from
 * role-confusing with the user and to keep the line short.
 */
export function buildPreviewInstructions(key: VoiceKey): string {
  const name = getVoiceName(key);
  const tone = getVoiceTone(key);
  return [
    `You are providing a short voice *preview* for the app in English.`,
    `You are the assistant speaking to the user, not the user.`,
    `For this preview only, introduce yourself as the voice named "${name}".`,
    `Deliver it in a ${tone.toLowerCase()} tone.`,
    `Speak exactly the quoted line you are given. Do not add anything else.`,
  ].join(' ');
}
