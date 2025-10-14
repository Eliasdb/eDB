// app/(tabs)/crm/(features)/companies/index.tsx
import { Link } from 'expo-router';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCompanies,
  usePrefetchCompanyOverview,
} from '@edb-clara/client-crm';

import {
  CompanyItemSkeleton,
  companyToEntityRowProps,
} from '@edb-clara/feature-crm';

import { Card, EmptyLine, EntityRow, List, Screen } from '@edb/shared-ui-rn';

export default function CompaniesScreen() {
  const { t } = useTranslation();
  const prefetchCompany = usePrefetchCompanyOverview();
  const { data: companies, isLoading } = useCompanies();

  const handlePressIn = useCallback(
    (id: string) => prefetchCompany(id),
    [prefetchCompany],
  );

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
        ) : !companies || companies.length === 0 ? (
          <EmptyLine
            text={t('crm.emptyCompanies', { defaultValue: 'No companies.' })}
          />
        ) : (
          <List inset>
            {companies.map((co, i) => (
              <List.Item key={co.id} first={i === 0}>
                <Link
                  href={{
                    pathname: '/(tabs)/crm/(features)/companies/[id]',
                    params: { id: co.id },
                  }}
                  onPressIn={() => handlePressIn(co.id)}
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
