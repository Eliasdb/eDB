// apps/mobile/src/app/(features)/profile/integrations.tsx
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PageContainer } from '@ui/layout/ResponsivePage';
import { Subheader } from '@ui/navigation/Subheader';
import { Card } from '@ui/primitives/Card';
import { ItemSwitch, Section } from '@ui/primitives/primitives';

import {
  getIntegrationSections,
  wideColumnLayout,
  type IntegrationSection,
} from '../../features/profile/config/integrations';

export default function IntegrationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = width >= 1024;

  // pull sections from config
  const sections = useMemo<IntegrationSection[]>(
    () => getIntegrationSections(),
    [],
  );

  // simple local toggle state (key -> boolean)
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const setToggle = (key: string, v: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: v }));

  // wide layout column mapping
  const layout = useMemo(
    () => wideColumnLayout(sections.map((s) => s.key)),
    [sections],
  );

  return (
    <View className="flex-1 bg-surface dark:bg-surface-dark">
      <Subheader title="External integrations" onBack={() => router.back()} />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 24 + insets.bottom,
          alignItems: isWide ? 'center' : undefined,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageContainer maxWidth={1100} paddingH={16}>
          {/* Intro / explainer */}
          <Card className="rounded-2xl px-4 py-4 bg-surface-2 dark:bg-surface-dark border border-border dark:border-border-dark shadow-none dark:shadow-card">
            <Text className="text-[16px] font-extrabold text-text dark:text-text-dark">
              Connect your tools
            </Text>
            <Text className="mt-1.5 text-[14px] leading-5 text-text-dim dark:text-text-dimDark">
              Toggle integrations to let Clara read and sync data with your CRM
              and support platforms. This is a preview; toggles don’t perform
              real connections yet.
            </Text>
          </Card>

          {/* Responsive grid for sections */}
          {isWide ? (
            <View className="flex-row -mx-2 mt-2">
              {/* Left column (CRM + Other) */}
              <View className="w-1/2 px-2">
                {layout.left.map((idx) => {
                  const s = sections[idx];
                  return (
                    <Section key={s.key} title={s.title}>
                      {s.items.map((it) => (
                        <ItemSwitch
                          key={it.key}
                          label={it.label}
                          icon={it.icon}
                          value={!!toggles[it.key]}
                          onValueChange={(v) => setToggle(it.key, v)}
                        />
                      ))}
                    </Section>
                  );
                })}
              </View>

              {/* Right column (Support) */}
              <View className="w-1/2 px-2">
                {layout.right.map((idx) => {
                  const s = sections[idx];
                  return (
                    <Section key={s.key} title={s.title}>
                      {s.items.map((it) => (
                        <ItemSwitch
                          key={it.key}
                          label={it.label}
                          icon={it.icon}
                          value={!!toggles[it.key]}
                          onValueChange={(v) => setToggle(it.key, v)}
                        />
                      ))}
                    </Section>
                  );
                })}
              </View>
            </View>
          ) : (
            // Mobile: single column in config order
            <View className="mt-2">
              {sections.map((s) => (
                <Section key={s.key} title={s.title}>
                  {s.items.map((it) => (
                    <ItemSwitch
                      key={it.key}
                      label={it.label}
                      icon={it.icon}
                      value={!!toggles[it.key]}
                      onValueChange={(v) => setToggle(it.key, v)}
                    />
                  ))}
                </Section>
              ))}
            </View>
          )}
        </PageContainer>
      </ScrollView>
    </View>
  );
}
