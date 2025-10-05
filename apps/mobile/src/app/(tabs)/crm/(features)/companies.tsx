import { useHub } from '@api';
import { useTranslation } from 'react-i18next';

import { CompanyItemSkeleton, ListSkeleton } from '@features/crm';
import { EntityRow } from '@ui/composites';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';

// Mappers
import { companyToEntityRowProps } from '@features/crm/mappers/entity';

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
                <EntityRow {...companyToEntityRowProps(co)} />
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </Screen>
  );
}
