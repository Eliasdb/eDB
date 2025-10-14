// features/profile/components/voice-mode/VoiceGrid.tsx
import { ResponsiveGrid } from '@edb/shared-ui-rn';
import type { VoiceKey } from '@voice/previews/voices';
import { Text, View } from 'react-native';
import { VoiceCard } from '../../types/voice-mode.types';
import { VoiceRow } from './voice-row';

export function VoiceGrid({
  voices,
  selected,
  playingKey,
  previewDisabled,
  onSelect,
  onPreview,
  title,
}: {
  title: string;
  voices: VoiceCard[];
  selected: VoiceKey;
  playingKey: VoiceKey | null;
  previewDisabled: boolean;
  onSelect: (key: VoiceKey) => void;
  onPreview: (key: VoiceKey) => void;
}) {
  return (
    <View>
      <Text className="mt-12 mb-2 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
        {title}
      </Text>

      <ResponsiveGrid columns={2} gap={12} breakpoint={900}>
        {voices.map((v) => (
          <VoiceRow
            key={v.key}
            voice={v}
            active={selected === v.key}
            isPlaying={playingKey === v.key}
            previewDisabled={previewDisabled}
            onSelect={() => onSelect(v.key)}
            onPreview={() => onPreview(v.key)}
          />
        ))}
      </ResponsiveGrid>
    </View>
  );
}
