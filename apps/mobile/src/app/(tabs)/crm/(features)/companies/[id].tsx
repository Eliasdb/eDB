// apps/mobile/src/app/(tabs)/crm/(features)/companies/[id].tsx
import { useCompanyOverview } from '@api';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { CompanyActivityOverview } from '@features/crm/components';
import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import { Screen } from '@ui/layout';
import { Segmented } from '@ui/navigation';
import { Card, EntityHero, IconButton } from '@ui/primitives';
import ResearchCollection from './ResearchCollection';
import SnapshotCollection from './SnapshotCollection';
import TasksCollection from './TasksCollection';
import WorkCollection from './WorkCollection';

type TabKey = 'snapshot' | 'research' | 'work' | 'tasks' | 'overview';

export default function CompanyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  const company = data?.company;

  const [tab, setTab] = useState<TabKey>('snapshot');

  const aboutText = useMemo(() => {
    const n = company?.name ?? 'This company';
    const industry = company?.industry || 'No industry';
    return `${n} — ${industry}.`;
  }, [company?.name, company?.industry]);

  if (!company && !isLoading) {
    return (
      <Screen center padding={16}>
        <Card inset bodyClassName="items-center py-10">
          <Text className="text-text dark:text-text-dark text-base font-semibold">
            Company not found
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen center={false} padding={0} showsVerticalScrollIndicator={false}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Top bar */}
        <View className="px-4 pt-3 pb-2">
          <View className="flex-row items-center justify-between">
            <Link href="/(tabs)/crm/(features)/companies" asChild>
              <Pressable accessibilityLabel="Back to companies">
                <IconButton name="chevron-back" size="xs" tint="neutral" />
              </Pressable>
            </Link>
          </View>
        </View>

        {/* Hero */}
        <View className="px-0 pb-4">
          <EntityHero
            title={company?.name ?? ' '}
            avatarUrl={company?.logoUrl ?? null}
            initials={company?.initials}
            avatarRadius={12}
            industry={company?.industry ?? undefined}
            stage={company?.stage ?? undefined}
          />
        </View>

        {/* Tabs */}
        <View className="px-2 sm:px-0 mt-0">
          <Segmented<TabKey>
            value={tab}
            onChange={setTab}
            options={[
              {
                value: 'snapshot',
                label: 'Snapshot',
                iconName: 'grid-outline',
              },
              {
                value: 'research',
                label: 'Research',
                iconName: 'document-text-outline',
              },
              { value: 'work', label: 'Contacts', iconName: 'people-outline' },
              {
                value: 'tasks',
                label: 'Tasks',
                iconName: 'checkmark-done-outline',
              },
              {
                value: 'overview',
                label: 'Activity',
                iconName: 'list-outline',
              },
            ]}
          />
        </View>

        {/* SNAPSHOT (formerly Profile/Main) */}
        {tab === 'snapshot' && (
          <>
            <IntroHeader
              text="Snapshot — the essentials at a glance."
              variant="secondary"
            />
            <View style={{ height: 16 }} />
            <SnapshotCollection data={data} loading={isLoading} />
          </>
        )}

        {/* RESEARCH */}
        {tab === 'research' && (
          <ResearchCollection
            name={company?.name}
            data={(data as any)?.research}
            loading={isLoading}
            onScan={() => {}}
            onOpenArticle={() => {}}
          />
        )}

        {/* CONTACTS */}
        {tab === 'work' && <WorkCollection data={data} loading={isLoading} />}

        {/* TASKS */}
        {tab === 'tasks' && (
          <View className="px-0 mt-0">
            <TasksCollection data={data} loading={isLoading} />
          </View>
        )}

        {/* ACTIVITY */}
        {tab === 'overview' && (
          <CompanyActivityOverview
            activities={data?.activities}
            loading={isLoading}
          />
        )}
      </ScrollView>
    </Screen>
  );
}
