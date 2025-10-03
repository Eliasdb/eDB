// app/(tabs)/crm/contacts.tsx
import { useHub } from '@api';
import { contactToEntityProps } from '@features/crm/mappers/entity';
import {
  ContactItemSkeleton,
  ListSkeleton,
} from '@features/crm/skeletons/ItemSkeletons';
import { EntityRow } from '@ui/composites/list-rows';
import { Card, List } from '@ui/primitives';
import { EmptyLine } from '@ui/primitives/primitives';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

export default function ContactsPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useHub();
  const hub = data ?? { tasks: [], contacts: [], companies: [] };

  return (
    <ScrollView
      className="flex-1 bg-surface dark:bg-surface-dark"
      contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      showsVerticalScrollIndicator={false}
    >
      <Card tone="flat" inset={false} bodyClassName="gap-1.5">
        {isLoading ? (
          <ListSkeleton
            rows={3}
            rowHeight={60}
            renderRow={() => <ContactItemSkeleton />}
          />
        ) : hub.contacts.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyContacts', { defaultValue: 'No contacts.' })}
          />
        ) : (
          <List>
            {hub.contacts.map((c, i) => (
              <List.Item key={c.id} first={i === 0}>
                <EntityRow {...contactToEntityProps(c)} />
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </ScrollView>
  );
}
