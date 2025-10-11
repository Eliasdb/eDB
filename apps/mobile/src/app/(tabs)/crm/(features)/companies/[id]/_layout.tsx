// app/(tabs)/crm/(features)/companies/[id]/_layout.tsx
import { Screen } from '@ui/layout';
import { Segmented } from '@ui/navigation';
import { EntityHero, IconButton } from '@ui/primitives';
import { router, Slot, useLocalSearchParams, usePathname } from 'expo-router';
import { Platform, ScrollView, Text, View } from 'react-native';
import { useCompanyOverview } from '../../../../../../lib/api/hooks/crm/useCompanyOverview';

type TabKey = 'snapshot' | 'research' | 'work' | 'tasks' | 'overview';

const TABS: { value: TabKey; label: string; iconName: any }[] = [
  { value: 'snapshot', label: 'Snapshot', iconName: 'grid-outline' },
  { value: 'research', label: 'Research', iconName: 'document-text-outline' },
  { value: 'work', label: 'Contacts', iconName: 'people-outline' },
  { value: 'tasks', label: 'Tasks', iconName: 'checkmark-done-outline' },
  { value: 'overview', label: 'Activity', iconName: 'list-outline' },
];

export default function CompanyDetailLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useCompanyOverview(id);

  const last = (usePathname()?.split('/').pop() as TabKey) ?? 'snapshot';

  const go = (next: TabKey) =>
    router.replace({
      pathname: '/(tabs)/crm/(features)/companies/[id]/' + next,
      params: { id },
    });

  const COMPANIES_LIST = '/(tabs)/crm/(features)/companies';

  function handleClose() {
    if (Platform.OS === 'web') {
      // Avoid browser history weirdness after refresh/deep links
      router.replace(COMPANIES_LIST);
      return;
    }

    // Native (works with pageSheet): pop if possible, else hard replace
    if (router.canGoBack()) {
      router.back(); // ✅ gives you the pageSheet slide-down animation
    } else {
      router.replace(COMPANIES_LIST);
    }
  }
  return (
    <Screen center={false} padding={0} showsVerticalScrollIndicator={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Top bar */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            {/* ⬇️ Put the handler directly on IconButton (no outer Pressable) */}
            <IconButton
              name="chevron-back"
              size="xs"
              tint="neutral"
              onPress={handleClose}
              accessibilityLabel="Close"
            />
            <Text>Back</Text>
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
          <Segmented<TabKey> value={last} onChange={go} options={TABS} />
        </View>

        {/* Body */}
        <Slot />
      </ScrollView>
    </Screen>
  );
}
