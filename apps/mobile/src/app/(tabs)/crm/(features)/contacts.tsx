// Hooks
import { useHub } from '@api';
import { useTranslation } from 'react-i18next';

// UI
import { EntityRow } from '@ui/composites/list-rows';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';
// Skeletons
import { ContactItemSkeleton, ListSkeleton } from '@features/crm';

// Helpers
import { contactToEntityProps } from '@features/crm/mappers/entity';

export default function ContactsScreen() {
  const { t } = useTranslation();
  const { data, isLoading } = useHub();
  const hub = data ?? { tasks: [], contacts: [], companies: [] };

  return (
    <Screen
      center={false}
      padding={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 28 }}
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
    </Screen>
  );
}
