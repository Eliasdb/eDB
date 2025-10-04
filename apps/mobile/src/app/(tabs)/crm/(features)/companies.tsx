// Hooks
import { useHub } from '@api';
import { useTranslation } from 'react-i18next';

// UI
import { EntityRow } from '@ui/composites/list-rows';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';
// Skeletons
import { CompanyItemSkeleton, ListSkeleton } from '@features/crm';

// Helpers
import { companyToEntityProps } from '@features/crm/mappers/entity';

export default function CompaniesScreen() {
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
            renderRow={() => <CompanyItemSkeleton />}
          />
        ) : hub.companies.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyCompanies', { defaultValue: 'No companies.' })}
          />
        ) : (
          <List>
            {hub.companies.map((co, i) => (
              <List.Item key={co.id} first={i === 0}>
                <EntityRow {...companyToEntityProps(co)} />
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </Screen>
  );
}
