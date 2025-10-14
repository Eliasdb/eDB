// apps/mobile/src/app/(tabs)/contacts/ContactsScreen.tsx
import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  ContactItemSkeleton,
  contactToEntityRowProps,
} from '@edb-clara/feature-crm';
import { Card, EmptyLine, EntityRow, List, Screen } from '@edb/shared-ui-rn';

import { contactKeys } from '@data-access/crm/contacts/keys';
import { useContacts } from '@data-access/crm/contacts/queries';
import { fetchContactOverview } from '@data-access/crm/contacts/service';

export default function ContactsScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const { data: contacts, isLoading } = useContacts();

  // (optional) keep your fake skeleton delay for nicer UX while wiring
  const [fakeLoading, setFakeLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setFakeLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  const loading = isLoading || fakeLoading;

  const prefetch = (id: string) =>
    qc.prefetchQuery({
      queryKey: contactKeys.overview(id),
      queryFn: () => fetchContactOverview(id),
      staleTime: 15_000,
    });

  return (
    <Screen
      center={false}
      padding={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      <Card tone="flat" bordered={false} inset={false} bodyClassName="gap-1.5">
        {loading ? (
          <List inset>
            <List.Placeholder
              rows={3}
              renderRow={() => <ContactItemSkeleton />}
            />
          </List>
        ) : !contacts || contacts.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyContacts', { defaultValue: 'No contacts.' })}
          />
        ) : (
          <List inset>
            {contacts
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((c, i) => (
                <List.Item key={c.id} first={i === 0}>
                  <Link
                    href={{
                      pathname: '/(tabs)/crm/(features)/contacts/[id]',
                      params: { id: c.id },
                    }}
                    onPressIn={() => prefetch(c.id)}
                    asChild
                  >
                    <EntityRow {...contactToEntityRowProps(c)} />
                  </Link>
                </List.Item>
              ))}
          </List>
        )}
      </Card>
    </Screen>
  );
}
