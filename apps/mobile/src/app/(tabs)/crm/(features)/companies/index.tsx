import { useQueryClient } from '@tanstack/react-query';
import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { companyToEntityRowProps } from '@features/crm/mappers/entity';
import { CompanyItemSkeleton } from '@features/crm/skeletons';
import { EntityRow } from '@ui/composites';
import { Screen } from '@ui/layout';
import { Card, EmptyLine, List } from '@ui/primitives';

import { companyKeys } from '@api/core/keys';
import { useCompanies } from '@api/hooks/crm/useCompanies';
import { fetchCompanyOverview } from '@api/services';

export default function CompaniesScreen() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const { data: companies, isLoading } = useCompanies();

  const prefetch = (id: string) =>
    qc.prefetchQuery({
      queryKey: companyKeys.overview(id),
      queryFn: () => fetchCompanyOverview(id),
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
            {companies
              .slice()
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((co, i) => (
                <List.Item key={co.id} first={i === 0}>
                  <Link
                    href={{
                      pathname: '/(tabs)/crm/(features)/companies/[id]',
                      params: { id: co.id },
                    }}
                    // nice perf on native + web
                    onPressIn={() => prefetch(co.id)}
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
