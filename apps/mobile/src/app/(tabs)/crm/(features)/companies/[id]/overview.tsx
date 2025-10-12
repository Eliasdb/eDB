import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import { CompanyActivityOverview } from '@features/crm/components';

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
