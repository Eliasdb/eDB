// features/profile/components/voice-mode/VoiceRow.tsx
import { Ionicons } from '@expo/vector-icons';
import { Button } from '@ui/primitives';
import { Pressable, Text, View } from 'react-native';
import { VoiceCard } from '../../types/voice-mode.types';

export function VoiceRow({
  voice,
  active,
  isPlaying,
  previewDisabled, // <-- renamed
  onSelect,
  onPreview,
}: {
  voice: VoiceCard;
  active: boolean;
  isPlaying: boolean;
  previewDisabled: boolean; // <-- renamed
  onSelect: () => void;
  onPreview: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      // keep the row tappable for selection even if preview isn't ready
      className={`
        rounded-2xl px-4 py-3
        bg-surface dark:bg-surface-dark
        border ${active ? 'border-primary' : 'border-border dark:border-border-dark'}
        ${active ? 'shadow-card' : 'shadow-none'}
      `}
    >
      {/* Top row */}
      <View className="flex-row items-center">
        <Avatar gender={voice.gender} />
        <View style={{ flex: 1 }} className="ml-3">
          <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
            {voice.name}
            {voice.isDefault ? (
              <Text className="text-[12px] font-semibold text-text-dim dark:text-text-dimDark">
                {'  •  Default'}
              </Text>
            ) : null}
          </Text>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            {voice.meta}
          </Text>
        </View>
        <Radio active={active} />
      </View>

      {/* Bottom row */}
      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Tag text={voice.tone} />
          <View style={{ width: 6 }} />
          <Tag text={voice.gender === 'female' ? 'F' : 'M'} />
        </View>

        <Button
          onPress={onPreview}
          disabled={previewDisabled} // <-- only the button is disabled
          variant="outline"
          tint="neutral"
          size="sm"
          className="px-3"
          iconLeft={isPlaying ? 'volume-high-outline' : 'play-circle-outline'}
          label="Preview"
        />
      </View>
    </Pressable>
  );
}

/* ---------- tiny internals kept local to the component ---------- */

function Avatar({ gender }: { gender: 'female' | 'male' }) {
  return (
    <View className="w-9 h-9 rounded-full items-center justify-center bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
      <Ionicons
        name={gender === 'female' ? 'female-outline' : 'male-outline'}
        size={16}
        className="text-text dark:text-text-dark"
      />
    </View>
  );
}

function Radio({ active }: { active: boolean }) {
  return (
    <View
      className={`
        w-5 h-5 rounded-full border
        ${active ? 'border-primary' : 'border-border dark:border-border-dark'}
        items-center justify-center
      `}
    >
      {active ? <View className="w-2.5 h-2.5 rounded-full bg-primary" /> : null}
    </View>
  );
}

function Tag({ text }: { text: string }) {
  return (
    <View className="px-2 py-0.5 rounded-md bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
      <Text className="text-[11px] font-semibold text-text dark:text-text-dark">
        {text}
      </Text>
    </View>
  );
}
