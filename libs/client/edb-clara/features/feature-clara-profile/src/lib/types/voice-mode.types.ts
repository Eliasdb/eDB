import { VoiceKey } from '../../../voice/previews/voices';

export type VoiceCard = {
  key: VoiceKey;
  name: string;
  meta: string;
  gender: 'female' | 'male';
  tone: string;
  isDefault?: boolean;
};
