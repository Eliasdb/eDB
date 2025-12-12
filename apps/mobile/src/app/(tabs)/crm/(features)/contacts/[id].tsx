// apps/mobile/src/app/(tabs)/crm/(features)/contacts/[id].tsx
import { useContactOverview, useCreateActivity } from '@edb-clara/client-crm';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';

import {
  ActivityComposer,
  ActivityTimeline,
  Button,
  Card,
  EntityHero,
  KeyValueRow,
  List,
  Screen,
} from '@edb/shared-ui-rn';

import { ScrollView, Text, View } from 'react-native';

export default function ContactDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useContactOverview(id);

  const contact = data?.contact;
  const company = data?.company;
  const activities = data?.activities ?? [];
  const isLoadingActivities = isLoading && !data;

  const [adding, setAdding] = useState(false);
  const createMutation = useCreateActivity({
    contactId: contact?.id,
    companyId: company?.id,
  });

  if (!contact && !isLoading) {
    return (
      <Screen center padding={16}>
        <Card inset bodyClassName="items-center py-10">
          <Text className="text-text dark:text-text-dark text-base font-semibold">
            Contact not found...
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen center={false} padding={0}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Hero */}
        <View className="px-4 py-4">
          <EntityHero
            title={contact?.name ?? ' '}
            // subtitle={contact?.email ?? undefined}
            avatarUrl={contact?.avatarUrl ?? null}
            initials={contact?.initials}
            // avatarSize={56}
            avatarRadius={28}
          ></EntityHero>
        </View>

        {/* Info */}
        <View className="px-4 mt-3">
          <Card tone="flat" inset={false} bodyClassName="p-0 overflow-hidden">
            <List>
              {!!contact?.phone && (
                <List.Item first>
                  <KeyValueRow
                    icon="call-outline"
                    label="Phone"
                    value={contact.phone}
                  />
                </List.Item>
              )}

              {!!contact?.source && (
                <List.Item first={!contact?.phone}>
                  <KeyValueRow
                    icon="sparkles-outline"
                    label="Source"
                    value={contact.source}
                  />
                </List.Item>
              )}

              {!!contact?.title && (
                <List.Item>
                  <KeyValueRow
                    icon="briefcase-outline"
                    label="Title"
                    value={contact.title}
                  />
                </List.Item>
              )}

              {!!company && (
                <List.Item>
                  <KeyValueRow
                    icon="business-outline"
                    label="Company"
                    value={company.name}
                  />
                </List.Item>
              )}
            </List>
          </Card>

          {/* Inline add activity composer */}
          {adding ? (
            <View className="mt-3">
              <ActivityComposer
                contactId={contact?.id}
                companyId={company?.id}
                onCancel={() => setAdding(false)}
                submitting={createMutation.isPending}
                onSubmit={(payload) => {
                  createMutation.mutate(payload, {
                    onSuccess: () => setAdding(false),
                  });
                }}
              />
            </View>
          ) : null}

          {/* Timeline (re-uses ActivityTimeline) */}
          <View className="mt-3">
            <ActivityTimeline
              title="Timeline"
              activities={activities}
              loading={isLoadingActivities}
              headerActions={
                !adding ? (
                  <Button
                    variant="outline"
                    tint="primary"
                    shape="rounded"
                    size="xs"
                    label="Add note"
                    iconLeft="add-outline"
                    style={{
                      backgroundColor: 'rgba(108,99,255,0.12)',
                      borderColor: 'rgba(108,99,255,0.26)',
                      borderWidth: 1,
                      borderRadius: 10,
                    }}
                    onPress={() => setAdding(true)}
                  />
                ) : undefined
              }
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
