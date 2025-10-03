// app/(tabs)/crm/companies.tsx
import { useHub } from '@api';
import { companyToEntityProps } from '@features/crm/mappers/entity';
import {
  CompanyItemSkeleton,
  ListSkeleton,
} from '@features/crm/skeletons/ItemSkeletons';
import { EntityRow } from '@ui/composites/list-rows';
import { Card, List } from '@ui/primitives';
import { EmptyLine } from '@ui/primitives/primitives';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';

export default function CompaniesPage() {
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
    </ScrollView>
  );
}
