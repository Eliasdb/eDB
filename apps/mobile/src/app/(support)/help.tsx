// Hooks
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// UI
import { Card } from '@edb/shared-ui-rn';
import { Ionicons } from '@expo/vector-icons';

import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  CONTACT_LINKS,
  FAQ_ITEMS,
  GUIDE_SECTIONS,
} from '@features/support/config/help.config';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 920;
  const contentPaddingH = isWide ? 24 : 16;
  const maxWidth = 1100;

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
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

          {/* Grid */}
          <View
            style={{
              flexDirection: isWide ? 'row' : 'column',
              gap: isWide ? 16 : 12,
            }}
          >
            {/* Left: Guides */}
            <View style={{ flex: 1, minWidth: 0 }}>
              {GUIDE_SECTIONS.map((s) => (
                <SectionCard key={s.title} title={s.title}>
                  {s.bullets.map((b, i) => (
                    <Bullet key={i}>{b}</Bullet>
                  ))}
                </SectionCard>
              ))}
            </View>

            {/* Right: FAQ + Contact */}
            <View style={{ width: isWide ? 380 : '100%' }}>
              <Card className="rounded-2xl border border-border dark:border-border-dark overflow-hidden">
                <Header
                  title="Common questions"
                  subtitle="Quick answers to the top issues."
                />
                <View className="px-2 pb-3">
                  <Accordion items={FAQ_ITEMS} />
                </View>
              </Card>

              <Card className="mt-3 rounded-2xl border border-border dark:border-border-dark overflow-hidden">
                <Header
                  title="Contact support"
                  subtitle="We usually reply within one business day."
                />
                <View className="px-4 pb-4 gap-2">
                  {CONTACT_LINKS.map((link) => (
                    <PrimaryLink
                      key={link.label}
                      label={link.label}
                      icon={link.icon}
                      onPress={link.onPress}
                    />
                  ))}
                </View>
              </Card>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/* ---------------- UI helpers ---------------- */

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
