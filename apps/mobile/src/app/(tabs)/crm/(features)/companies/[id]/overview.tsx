import { useCompanyOverview } from '@edb-clara/client-crm';
import { useLocalSearchParams } from 'expo-router';

import { CompanyActivityOverview } from '@edb-clara/feature-crm';

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
