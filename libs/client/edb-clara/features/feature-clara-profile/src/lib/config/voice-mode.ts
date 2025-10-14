// features/profile/config/voices.ts
import { DEFAULT_VOICE_KEY, VOICES, type VoiceKey } from '@edb-clara/realtime';
import type { VoiceCard } from '../types/voice-mode.types';

export function getDefaultVoiceCard(): VoiceCard {
  return {
    key: DEFAULT_VOICE_KEY,
    name: 'Clara',
    meta: 'default (provider)',
    gender: 'female',
    tone: 'Natural',
    isDefault: true,
  };
}

export function getOtherVoiceCards(): VoiceCard[] {
  return VOICES.map((v) => ({
    key: v.key as VoiceKey,
    name: v.name,
    meta: v.meta,
    gender: v.gender,
    tone: v.tone,
  }));
}
