// apps/mobile/src/app/(tabs)/contacts/ContactsScreen.tsx
import { useHub } from '@api';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { contactToEntityRowProps } from '@features/crm/mappers/entity';
import { EntityRow } from '@ui/composites';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';
import { Link } from 'expo-router';
import { ContactItemSkeleton } from '../../../../../lib/features/crm/skeletons/contact-row-skeleton';

export default function ContactsScreen() {
  const { t } = useTranslation();
  const { data, isLoading } = useHub();

  // 🕒 fake delay for testing skeleton phase
  const [fakeLoading, setFakeLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setFakeLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const loading = isLoading || fakeLoading;
  const hub = data;

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
        ) : hub?.contacts.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyContacts', { defaultValue: 'No contacts.' })}
          />
        ) : (
          <List inset>
            {hub?.contacts.map((c, i) => (
              <List.Item key={c.id} first={i === 0}>
                <Link
                  // relative to app/(tabs)/crm/(features)/contacts
                  href={{
                    pathname: '/(tabs)/crm/(features)/contacts/[id]',
                    params: { id: c.id },
                  }}
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
