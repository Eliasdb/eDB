// app/(tabs)/crm/(features)/companies/[id]/TabHeader.tsx
import { useCompanyOverview } from '@api';
import { Segmented } from '@ui/navigation';
import { EntityHero, IconButton } from '@ui/primitives';
import { router, useLocalSearchParams, usePathname } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

type TabKey = 'snapshot' | 'research' | 'work' | 'tasks' | 'overview';

const TABS = [
  { value: 'snapshot', label: 'Snapshot', iconName: 'grid-outline' },
  { value: 'research', label: 'Research', iconName: 'document-text-outline' },
  { value: 'work', label: 'Contacts', iconName: 'people-outline' },
  { value: 'tasks', label: 'Tasks', iconName: 'checkmark-done-outline' },
  { value: 'overview', label: 'Activity', iconName: 'list-outline' },
] as const;

export default function TabHeader() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useCompanyOverview(id);
  const last = (usePathname()?.split('/').pop() as TabKey) ?? 'snapshot';

  const go = (next: TabKey) =>
    router.replace({
      pathname: '/(tabs)/crm/(features)/companies/[id]/' + next,
      params: { id },
    });

  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
      {/* Top bar */}
      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Close"
            onPress={() => {
              // if this stack has history, pop; otherwise dismiss the presented sheet
              if (router.canGoBack()) router.back();
              else {
                try {
                  router.dismiss();
                } catch {
                  router.replace('/(tabs)/crm/(features)/companies');
                }
              }
            }}
          >
            <IconButton name="chevron-back" size="xs" tint="neutral" />
          </Pressable>
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
      <View className="px-2 sm:px-0">
        <Segmented<TabKey> value={last} onChange={go} options={TABS as any} />
      </View>
    </ScrollView>
  );
}
