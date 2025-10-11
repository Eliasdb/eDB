import { CompanyActivityOverview } from '@features/crm/components';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useCompanyOverview } from '../../../../../../lib/api/hooks/crm/useCompanyOverview';

export default function ActivityPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return (
    <CompanyActivityOverview
      activities={data?.activities}
      loading={isLoading}
    />
  );
}
