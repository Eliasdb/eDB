import { useCompanyOverview } from '@data-access/crm/companies';
import { Slot, useLocalSearchParams, usePathname } from 'expo-router';

import { EntityHero, IconButton, Screen, Segmented } from '@edb/shared-ui-rn';
import { ScrollView, Text, View } from 'react-native';

import {
  COMPANY_DETAIL_TABS,
  activeTabFromPathname,
  closeToList,
  pathForCompanyTab,
  type TabKey,
} from '@edb-clara/feature-crm';

export default function CompanyDetailLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useCompanyOverview(id);
  const pathname = usePathname();

  const current = activeTabFromPathname(pathname);

  const go = (next: TabKey) => {
    if (!id) return;
    // replace to keep a single history entry inside the sheet
    // (use push if you explicitly want back/forward within tabs)
    window.requestAnimationFrame(() => {
      // rAF keeps the transition smooth when switching quickly
      location.assign(pathForCompanyTab(String(id), next));
    });
  };

  return (
    <Screen center={false} padding={0} showsVerticalScrollIndicator={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Header */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <IconButton
              name="chevron-back"
              size="xs"
              tint="neutral"
              onPress={closeToList}
              accessibilityLabel="Close"
            />
            <Text className="opacity-60 text-xs">Company</Text>
          </View>
        </View>

        {/* Hero */}
        <View className="px-0 pb-4">
          <EntityHero
            title={data?.company?.name ?? ' '}
            avatarUrl={data?.company?.logoUrl ?? null}
            initials={data?.company?.initials}
            avatarRadius={12}
            industry={data?.company?.industry ?? undefined}
            stage={data?.company?.stage ?? undefined}
          />
        </View>

        {/* Tabs */}
        <View className="px-2 sm:px-0 mt-0">
          <Segmented<TabKey>
            value={current}
            onChange={go}
            options={COMPANY_DETAIL_TABS.map((t) => ({
              value: t.value,
              label: t.label,
            }))}
          />
        </View>

        {/* Body (child routes render here) */}
        <Slot />
      </ScrollView>
    </Screen>
  );
}
