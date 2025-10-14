import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import { WorkCollection } from '@edb-clara/feature-crm';

export default function ContactsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return <WorkCollection data={data} loading={isLoading} />;
}
