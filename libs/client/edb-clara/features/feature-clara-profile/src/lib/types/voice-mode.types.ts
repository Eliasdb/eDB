import { VoiceKey } from '@edb-clara/realtime';

export type VoiceCard = {
  key: VoiceKey;
  name: string;
  meta: string;
  gender: 'female' | 'male';
  tone: string;
  isDefault?: boolean;
};
