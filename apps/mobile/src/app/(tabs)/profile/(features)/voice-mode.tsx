import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

// Hooks
import { useVoicePreview } from '@voice/previews/useVoicePreview.web';
import { useRouter } from 'expo-router';
import { useMemo, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// UI
import { Ionicons } from '@expo/vector-icons';
import { SubHeader } from '@ui/navigation';
import { Card } from '@ui/primitives';

import {
  DEFAULT_VOICE_KEY,
  VOICES,
  type VoiceKey,
} from '@voice/previews/voices';

export default function VoiceModeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const isWide = width >= 900;
  const containerWidth = useMemo(
    () => (isWide ? Math.min(1040, width - 64) : '100%'),
    [isWide, width],
  );
  const gridCols = isWide ? 2 : 1;

  // Start with Clara (provider default) selected
  const [selected, setSelected] = useState<VoiceKey>(DEFAULT_VOICE_KEY);

  const { ready, busy, play } = useVoicePreview();

  // Local playing indicator
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
      }, 2500); // adjust if your samples differ
    }
  };

  useMemo(() => {
    return () => {
      if (clearTimerRef.current) clearTimeout(clearTimerRef.current);
    };
  }, []);

  // Special "Clara (Default)" card + the four existing voices
  const providerDefault: {
    key: VoiceKey;
    name: string;
    meta: string;
    gender: 'female' | 'male';
    tone: string;
  } = {
    key: 'providerDefault',
    name: 'Clara',
    meta: 'default (provider)',
    gender: 'female',
    tone: 'Natural',
  };

  const otherVoices = VOICES;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <SubHeader title="Voice mode" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={{
          alignItems: isWide ? 'center' : undefined,
          padding: 16,
          paddingBottom: 24 + insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ width: containerWidth as number | '100%' }}>
          {/* Intro */}
          <Card
            inset
            className="rounded-2xl bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark shadow-none dark:shadow-card"
          >
            <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
              Choose a voice
            </Text>
            <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
              Pick a voice that Clara will use when speaking to you. Tap{' '}
              <Text className="font-semibold">Preview</Text> to hear a short
              sample. This doesn’t affect your main session.
            </Text>
          </Card>

          {/* Clara (Provider Default) */}
          <Text className="mt-8 mb-2 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
            Default voice
          </Text>
          <DefaultVoiceRow
            voice={providerDefault}
            active={selected === providerDefault.key}
            isPlaying={playingKey === providerDefault.key}
            onSelect={() => setSelected(providerDefault.key)}
            onPreview={() => handlePreview(providerDefault.key)}
            ready={ready}
            busy={busy}
          />

          {/* Other voices */}
          <Text className="mt-12 mb-2 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
            Other voices
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: -6,
            }}
          >
            {otherVoices.map((v) => {
              const active = v.key === selected;
              const isPlaying = playingKey === v.key;

              return (
                <View
                  key={v.key}
                  style={{
                    width: gridCols === 2 ? '50%' : '100%',
                    paddingHorizontal: 6,
                    marginBottom: 12,
                  }}
                >
                  <Pressable
                    onPress={() => setSelected(v.key)}
                    className={`
                      rounded-2xl px-4 py-3
                      bg-surface dark:bg-surface-dark
                      border ${active ? 'border-primary' : 'border-border dark:border-border-dark'}
                      ${active ? 'shadow-card' : 'shadow-none'}
                      active:opacity-95
                    `}
                  >
                    {/* Top row */}
                    <View className="flex-row items-center">
                      <Avatar gender={v.gender} />
                      <View style={{ flex: 1 }} className="ml-3">
                        <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
                          {v.name}
                        </Text>
                        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
                          {v.meta}
                        </Text>
                      </View>
                      <Radio active={active} />
                    </View>

                    {/* Bottom row */}
                    <View className="mt-3 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Tag text={v.tone} />
                        <View style={{ width: 6 }} />
                        <Tag text={v.gender === 'female' ? 'F' : 'M'} />
                      </View>

                      <PreviewButton
                        isPlaying={isPlaying}
                        disabled={!ready || busy}
                        onPress={() => handlePreview(v.key)}
                      />
                    </View>
                  </Pressable>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------- small UI pieces ---------- */

function DefaultVoiceRow({
  voice,
  active,
  isPlaying,
  onSelect,
  onPreview,
  ready,
  busy,
}: {
  voice: {
    key: VoiceKey;
    name: string;
    meta: string;
    gender: 'female' | 'male';
    tone: string;
  };
  active: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onPreview: () => void;
  ready: boolean;
  busy: boolean;
}) {
  return (
    <Pressable
      onPress={onSelect}
      className={`
        rounded-2xl px-4 py-3
        bg-surface dark:bg-surface-dark
        border ${active ? 'border-primary' : 'border-border dark:border-border-dark'}
        ${active ? 'shadow-card' : 'shadow-none'}
        active:opacity-95
      `}
    >
      <View className="flex-row items-center">
        <Avatar gender={voice.gender} />
        <View style={{ flex: 1 }} className="ml-3">
          <Text className="text-[15px] font-extrabold text-text dark:text-text-dark">
            {voice.name}
            <Text className="text-[12px] font-semibold text-text-dim dark:text-text-dimDark">
              {'  •  Default'}
            </Text>
          </Text>
          <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
            {voice.meta}
          </Text>
        </View>
        <Radio active={active} />
      </View>

      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Tag text={voice.tone} />
          <View style={{ width: 6 }} />
          <Tag text={voice.gender === 'female' ? 'F' : 'M'} />
        </View>

        <PreviewButton
          isPlaying={isPlaying}
          disabled={!ready || busy}
          onPress={onPreview}
        />
      </View>
    </Pressable>
  );
}

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

function PreviewButton({
  isPlaying,
  disabled,
  onPress,
}: {
  isPlaying: boolean;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className="h-9 px-3 rounded-lg bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark flex-row items-center gap-2"
    >
      <View
        style={{
          width: 18,
          height: 18,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={isPlaying ? 'volume-high-outline' : 'play-circle-outline'}
          size={18}
          className="text-text dark:text-text-dark"
        />
      </View>
      <Text
        className="text-[13px] font-semibold text-text dark:text-text-dark"
        style={{ minWidth: 70, textAlign: 'left' }}
      >
        Preview
      </Text>
    </TouchableOpacity>
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
