// apps/mobile/src/app/(tabs)/crm/(features)/companies/[id].tsx
import { useCompanyOverview } from '@api';
import { KeyValueRow } from '@ui/composites/list-rows/info-rows/info-rows';
import { Screen } from '@ui/layout';
import { EntityHero } from '@ui/layout/hero/entity-hero';
import { Card, IconButton, List } from '@ui/primitives';
import { Link, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { CompanySections } from '../../../../../lib/features/crm/components/companies/CompanySections.comp';

export default function CompanyDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  const company = data?.company;

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
        <View className="px-4">
          <EntityHero
            title={company?.name ?? ' '}
            subtitle={company?.industry ?? undefined}
            avatarUrl={company?.logoUrl ?? null}
            initials={company?.name?.slice(0, 2)?.toUpperCase()}
            avatarRadius={12} // square corners for companies
            badges={
              company?.stage ? [{ label: company.stage, tint: '#6C63FF' }] : []
            }
            actions={
              <>
                {!!company?.domain && (
                  <IconButton
                    name="globe-outline"
                    tint="neutral"
                    onPress={() => Linking.openURL(`https://${company.domain}`)}
                  />
                )}
                <IconButton
                  name="create-outline"
                  tint="neutral"
                  onPress={() => {}}
                />
              </>
            }
          />
        </View>

        {/* Quick stats */}
        <View className="px-4 mt-3">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            <List>
              <List.Item first>
                <KeyValueRow
                  icon="time-outline"
                  label="Last activity"
                  value={data?.stats.lastActivityAt ?? '—'}
                />
              </List.Item>
              <List.Item>
                <KeyValueRow
                  icon="flash-outline"
                  label="Open tasks"
                  value={String(data?.stats.openTasks ?? 0)}
                />
              </List.Item>
              <List.Item>
                <KeyValueRow
                  icon="calendar-outline"
                  label="Next due task"
                  value={data?.stats.nextTaskDue ?? '—'}
                />
              </List.Item>
            </List>
          </Card>
        </View>

        {/* Sections (Contacts, Timeline, Tasks) */}
        <CompanySections data={data} />
      </ScrollView>
    </Screen>
  );
}
