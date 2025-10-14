import { useVoicePreview } from '@voice/previews/useVoicePreview.web';
import { useMemo, useRef, useState } from 'react';

import { IntroCard, VoiceGrid, VoiceRow } from '@edb-clara/feature-profile';
import { PageContainer, Screen } from '@edb/shared-ui-rn';
import { Text } from 'react-native';

import {
  getDefaultVoiceCard,
  getOtherVoiceCards,
} from '@edb-clara/feature-profile';
import { DEFAULT_VOICE_KEY, type VoiceKey } from '@voice/previews/voices';

export default function VoiceModeScreen() {
  const [selected, setSelected] = useState<VoiceKey>(DEFAULT_VOICE_KEY);
  const { ready, busy, play } = useVoicePreview();
  const [playingKey, setPlayingKey] = useState<VoiceKey | null>(null);
  const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handlePreview = (key: VoiceKey) => {
    if (!ready || busy) return;
    setPlayingKey(key);
    try {
      play(key);
    } finally {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
      clearTimerRef.current = setTimeout(() => {
        setPlayingKey((curr) => (curr === key ? null : curr));
      }, 2500);
    }
  };

  const providerDefault = getDefaultVoiceCard();
  const otherVoices = useMemo(getOtherVoiceCards, []);

  return (
    <Screen
      center={false}
      padding={{ h: 4, top: 16, bottom: 24 }}
      safeBottom
      showsVerticalScrollIndicator={false}
    >
      <PageContainer maxWidth={1040} paddingH={16}>
        <IntroCard title="Choose a voice">
          Pick a voice that Clara will use when speaking to you. Tap{' '}
          <Text className="font-semibold">Preview</Text> to hear a short sample.
          This doesn’t affect your main session.
        </IntroCard>

        {/* Default voice (single) */}
        <Text className="mt-8 mb-2 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
          Default voice
        </Text>
        <VoiceRow
          voice={providerDefault}
          active={selected === providerDefault.key}
          isPlaying={playingKey === providerDefault.key}
          previewDisabled={!ready || busy}
          onSelect={() => setSelected(providerDefault.key)}
          onPreview={() => handlePreview(providerDefault.key)}
        />

        {/* Others via a clean grid */}
        <VoiceGrid
          title="Other voices"
          voices={otherVoices}
          selected={selected}
          playingKey={playingKey}
          previewDisabled={!ready || busy}
          onSelect={setSelected}
          onPreview={handlePreview}
        />
      </PageContainer>
    </Screen>
  );
}
