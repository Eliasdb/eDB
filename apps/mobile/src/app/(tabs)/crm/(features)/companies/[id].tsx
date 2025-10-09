// apps/mobile/src/app/(tabs)/crm/(features)/companies/[id].tsx
import { useCompanyOverview } from '@api';
import { Link, useLocalSearchParams } from 'expo-router';

import { CompanySections } from '@features/crm/components';
import { Screen } from '@ui/layout';
import { Card, EntityHero, IconButton } from '@ui/primitives';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

// ⬇️ import the new config
import CompanyQuickStats from '@features/crm/components/companies/company-quick-stats';

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
            initials={company?.initials}
            avatarRadius={12}
            badges={
              company?.stage ? [{ label: company.stage, tint: '#6C63FF' }] : []
            }
          >
            <EntityHero.Actions>
              {company?.domain ? (
                <IconButton
                  name="globe-outline"
                  tint="neutral"
                  variant="ghost"
                  size="xs"
                  shape="rounded"
                  cornerRadius={10}
                  onPress={() => Linking.openURL(`https://${company.domain}`)}
                  accessibilityLabel="Open website"
                />
              ) : null}
              <IconButton
                name="create-outline"
                tint="neutral"
                variant="ghost"
                size="xs"
                shape="rounded"
                cornerRadius={10}
                onPress={() => {}}
              />
            </EntityHero.Actions>
          </EntityHero>
        </View>

        {/* Quick stats */}
        <CompanyQuickStats data={data} loading={isLoading} />

        {/* Sections (Contacts, Timeline, Tasks) */}
        <CompanySections data={data} />
      </ScrollView>
    </Screen>
  );
}
