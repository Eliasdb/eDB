// apps/mobile/src/app/(tabs)/crm/(features)/companies/index.tsx
import { useHub } from '@api';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { CompanyItemSkeleton } from '@features/crm/skeletons';
import { EntityRow } from '@ui/composites';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';

import { companyToEntityRowProps } from '@features/crm/mappers/entity';

export default function CompaniesScreen() {
  const { t } = useTranslation();
  const { data, isLoading } = useHub();

  const hub = data;

  return (
    <Screen
      center={false}
      padding={16}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 28 }}
    >
      <Card tone="flat" bordered={false} inset={false} bodyClassName="gap-1.5">
        {isLoading ? (
          <List inset>
            <List.Placeholder
              rows={3}
              renderRow={() => <CompanyItemSkeleton />}
            />
          </List>
        ) : hub?.companies.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyCompanies', { defaultValue: 'No companies.' })}
          />
        ) : (
          <List inset>
            {hub?.companies.map((co, i) => (
              <List.Item key={co.id} first={i === 0}>
                <Link
                  href={{
                    pathname: '/(tabs)/crm/(features)/companies/[id]',
                    params: { id: co.id },
                  }}
                  asChild
                >
                  <EntityRow {...companyToEntityRowProps(co)} />
                </Link>
              </List.Item>
            ))}
          </List>
        )}
      </Card>
    </Screen>
  );
}
