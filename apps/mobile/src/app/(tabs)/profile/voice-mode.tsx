import { Ionicons } from '@expo/vector-icons';
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { Subheader } from '@ui/navigation';
import { Card } from '@ui/primitives';

type VoiceKey = 'sofia' | 'daniel' | 'ava' | 'liam';

const VOICES: Array<{
  key: VoiceKey;
  name: string;
  meta: string; // small descriptor
  gender: 'female' | 'male';
  tone: string;
}> = [
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

export default function VoiceModeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();

  // responsive: center + grid on desktop-ish widths
  const isWide = width >= 900;
  const containerWidth = useMemo(
    () => (isWide ? Math.min(1040, width - 64) : '100%'),
    [isWide, width],
  );
  const gridCols = isWide ? 2 : 1;

  const [selected, setSelected] = useState<VoiceKey>('sofia');
  const [previewing, setPreviewing] = useState<VoiceKey | null>(null);

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Reusable subheader */}
      <Subheader title="Voice mode" onBack={() => router.back()} />

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
            className="rounded-2xl bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark shadow-none dark:shadow-card px-4 py-4"
          >
            <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
              Choose a voice
            </Text>
            <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
              Pick a voice that Clara will use when speaking to you. These are
              mock options for now — switching them won’t change audio yet, but
              they show how selection will work.
            </Text>
          </Card>

          {/* Voice selector grid */}
          <Text className="mt-8 mb-2 text-[12px] uppercase tracking-wide text-text-dim dark:text-text-dimDark">
            Available voices
          </Text>

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginHorizontal: -6,
            }}
          >
            {VOICES.map((v) => {
              const active = v.key === selected;
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
                    {/* Top row: avatar-ish icon, name + meta, radio */}
                    <View className="flex-row items-center">
                      <View className="w-9 h-9 rounded-full items-center justify-center bg-muted dark:bg-muted-dark border border-border dark:border-border-dark">
                        <Ionicons
                          name={
                            v.gender === 'female'
                              ? 'female-outline'
                              : 'male-outline'
                          }
                          size={16}
                          className="text-text dark:text-text-dark"
                        />
                      </View>

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

                    {/* Bottom row: tags + preview button */}
                    <View className="mt-3 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Tag text={v.tone} />
                        <View style={{ width: 6 }} />
                        <Tag text={v.gender === 'female' ? 'F' : 'M'} />
                      </View>

                      <TouchableOpacity
                        onPress={() =>
                          setPreviewing((curr) =>
                            curr === v.key ? null : v.key,
                          )
                        }
                        activeOpacity={0.9}
                        className="h-9 px-3 rounded-lg bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark flex-row items-center gap-2"
                      >
                        <Ionicons
                          name={
                            previewing === v.key
                              ? 'stop-circle-outline'
                              : 'play-circle-outline'
                          }
                          size={18}
                          className="text-text dark:text-text-dark"
                        />
                        <Text className="text-[13px] font-semibold text-text dark:text-text-dark">
                          {previewing === v.key ? 'Stop' : 'Preview'}
                        </Text>
                      </TouchableOpacity>
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

/* ---------- little UI helpers ---------- */

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
