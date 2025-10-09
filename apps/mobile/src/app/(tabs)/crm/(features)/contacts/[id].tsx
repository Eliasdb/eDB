// apps/mobile/src/app/(tabs)/crm/(features)/contacts/[id].tsx
import { useContactOverview } from '@api';
import { ActivitiesOverview, KeyValueRow } from '@ui/composites';
import { Screen } from '@ui/layout';
import { Button, Card, EntityHero, IconButton, List } from '@ui/primitives';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';

export default function ContactDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useContactOverview(id);

  const contact = data?.contact;
  const company = data?.company;
  const activities = data?.activities ?? [];
  const isLoadingActivities = isLoading && !data;

  if (!contact && !isLoading) {
    return (
      <Screen center padding={16}>
        <Card inset bodyClassName="items-center py-10">
          <Text className="text-text dark:text-text-dark text-base font-semibold">
            Contact not found
          </Text>
        </Card>
      </Screen>
    );
  }

  return (
    <Screen center={false} padding={0}>
      <ScrollView contentContainerStyle={{ paddingBottom: 28 }}>
        {/* Hero */}
        <View className="px-4 pt-4">
          <EntityHero
            title={contact?.name ?? ' '}
            subtitle={contact?.email ?? undefined}
            avatarUrl={contact?.avatarUrl ?? null}
            initials={contact?.initials}
            avatarSize={56}
            avatarRadius={28}
          >
            <EntityHero.Actions>
              {contact?.email ? (
                <IconButton
                  name="mail-outline"
                  tint="neutral"
                  variant="ghost"
                  size="xs"
                  shape="rounded"
                  cornerRadius={10}
                  onPress={() => Linking.openURL(`mailto:${contact.email}`)}
                />
              ) : null}
              {contact?.phone ? (
                <IconButton
                  name="call-outline"
                  tint="neutral"
                  variant="ghost"
                  size="xs"
                  shape="rounded"
                  cornerRadius={10}
                  onPress={() => Linking.openURL(`tel:${contact.phone}`)}
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

          {/* Timeline */}
          <View className="mt-3">
            <ActivitiesOverview
              title="Timeline"
              activities={activities}
              emptyText={isLoadingActivities ? 'Loading …' : 'No activity yet'}
              headerActions={
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
                  onPress={() => {
                    /* open add-note sheet/modal */
                  }}
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
