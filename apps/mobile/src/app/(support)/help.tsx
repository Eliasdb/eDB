import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card } from '../../lib/ui/primitives';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const contentPaddingH = isWide ? 24 : 16;
  const maxWidth = 1100;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      {/* Header with back */}
      <View style={{ paddingTop: insets.top }}>
        <View className="h-14 flex-row items-center justify-between px-3 border-b border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
          <TouchableOpacity
            onPress={() => router.back()}
            className="h-11 min-w-11 items-center justify-center"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="chevron-back" size={24} color="#6B7280" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-text dark:text-text-dark">
            Help & Support
          </Text>

          {/* spacer */}
          <View className="h-11 min-w-11" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24 + insets.bottom,
          paddingHorizontal: contentPaddingH,
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth }}>
          {/* Intro */}
          <View className="mb-4 px-1">
            <Text className="text-[20px] font-extrabold text-text dark:text-text-dark">
              How can we help?
            </Text>
            <Text className="mt-1 text-[13px] leading-5 text-text-dim dark:text-text-dimDark">
              Find quick answers about Clara’s voice, tools, privacy and
              troubleshooting. If you’re stuck, contact us—happy to help.
            </Text>
          </View>

          {/* Grid: left column (guides) / right column (FAQ + contact) */}
          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              gap: isWide ? 16 : 12,
            }}
          >
            {/* Left: Guides */}
            <View style={{ flex: 1, minWidth: 0 }}>
              <SectionCard title="Getting started">
                <Bullet>
                  Open the chat tab and start typing—or tap the mic to talk.
                </Bullet>
                <Bullet>
                  Clara can create, update and delete tasks and contacts via
                  built-in tools.
                </Bullet>
                <Bullet>
                  See everything Clara did in{' '}
                  <Text className="font-semibold">Admin → Logs</Text>.
                </Bullet>
              </SectionCard>

              <SectionCard title="Voice & Realtime">
                <Bullet>
                  Choose a voice under{' '}
                  <Text className="font-semibold">Profile → Voice mode</Text>.
                </Bullet>
                <Bullet>
                  Clara uses OpenAI Realtime with server VAD to detect when you
                  talk and reply.
                </Bullet>
                <Bullet>
                  If audio is silent on web, ensure the page has playback
                  permission and volume is up.
                </Bullet>
              </SectionCard>

              <SectionCard title="Tools & Permissions">
                <Bullet>
                  Tools are listed in{' '}
                  <Text className="font-semibold">Admin → Capabilities</Text>{' '}
                  with parameters.
                </Bullet>
                <Bullet>
                  Every execution is logged—duration, inputs, outputs, and any
                  errors.
                </Bullet>
                <Bullet>
                  Disable integrations you don’t want in{' '}
                  <Text className="font-semibold">Profile → Integrations</Text>.
                </Bullet>
              </SectionCard>

              <SectionCard title="Privacy & data">
                <Bullet>
                  Exports and deletion live in{' '}
                  <Text className="font-semibold">Profile → Security</Text>.
                </Bullet>
                <Bullet>
                  We keep a thin audit trail (tools & outcomes) so you can
                  review what happened.
                </Bullet>
                <Bullet>
                  Contact us for DSRs (access, rectification, erasure).
                </Bullet>
              </SectionCard>
            </View>

            {/* Right: FAQ + Contact */}
            <View style={{ width: isWide ? 380 : '100%' }}>
              <Card className="rounded-2xl border border-border dark:border-border-dark overflow-hidden">
                <Header
                  title="Common questions"
                  subtitle="Quick answers to the top issues."
                />
                <View className="px-2 pb-3">
                  <Accordion
                    items={[
                      {
                        q: 'Why can’t I hear the voice reply?',
                        a: 'On the web, browsers may block auto-play until you interact. Click anywhere, ensure your output device and tab volume are enabled, then try again.',
                      },
                      {
                        q: 'How do I change Clara’s voice?',
                        a: 'Go to Profile → Voice mode and pick a voice. The Realtime session uses that selection for subsequent calls.',
                      },
                      {
                        q: 'Where can I see what Clara did?',
                        a: 'Open Admin → Logs for a card or terminal view of every tool run—inputs, outputs, timing and any errors.',
                      },
                      {
                        q: 'Can I disable certain tools?',
                        a: 'Yes—visit Profile → Integrations to turn off platforms you do not want Clara to access.',
                      },
                    ]}
                  />
                </View>
              </Card>

              <Card className="mt-3 rounded-2xl border border-border dark:border-border-dark overflow-hidden">
                <Header
                  title="Contact support"
                  subtitle="We usually reply within one business day."
                />
                <View className="px-4 pb-4 gap-2">
                  <PrimaryLink
                    label="Email support"
                    icon="mail-outline"
                    onPress={() =>
                      Linking.openURL('mailto:support@claralabs.example')
                    }
                  />
                  <PrimaryLink
                    label="Status page"
                    icon="pulse-outline"
                    onPress={() =>
                      Linking.openURL('https://status.example.com')
                    }
                  />
                  <PrimaryLink
                    label="Developer docs"
                    icon="code-slash-outline"
                    onPress={() => Linking.openURL('https://docs.example.com')}
                  />
                </View>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ----------------- tiny UI bits ----------------- */

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded-2xl border border-border dark:border-border-dark overflow-hidden mb-3">
      <Header title={title} />
      <View className="px-4 pb-4">{children}</View>
    </Card>
  );
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="px-4 pt-4 pb-3">
      <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-[12px] mt-1 text-text-dim dark:text-text-dimDark">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row gap-2 mb-2">
      <Text className="text-[16px] text-text-dim dark:text-text-dimDark">
        •
      </Text>
      <Text className="text-[14px] leading-5 text-text dark:text-text-dark flex-1">
        {children}
      </Text>
    </View>
  );
}

function PrimaryLink({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="h-11 rounded-xl bg-primary/10 border border-primary/25 px-3 flex-row items-center gap-2"
      style={Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined}
    >
      <Ionicons name={icon} size={18} color="#6C63FF" />
      <Text className="text-[15px] font-semibold text-primary">{label}</Text>
    </TouchableOpacity>
  );
}

function Accordion({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <View className="rounded-xl overflow-hidden bg-surface dark:bg-surface-dark border border-border dark:border-border-dark">
      {items.map((it, i) => {
        const active = open === i;
        return (
          <View
            key={it.q}
            className={
              i > 0 ? 'border-t border-border dark:border-border-dark' : ''
            }
          >
            <TouchableOpacity
              onPress={() => setOpen((prev) => (prev === i ? null : i))}
              className="px-3 py-3 flex-row items-center justify-between active:opacity-95"
            >
              <Text className="text-[14px] font-semibold text-text dark:text-text-dark">
                {it.q}
              </Text>
              <Ionicons
                name={active ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#6B7280"
              />
            </TouchableOpacity>
            {active ? (
              <View className="px-3 pb-3">
                <Text className="text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
                  {it.a}
                </Text>
              </View>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}
