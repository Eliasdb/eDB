import { useCompanyOverview } from '@edb-clara/client-crm';
import { useLocalSearchParams } from 'expo-router';

import { WorkCollection } from '@edb-clara/feature-crm';

export default function ContactsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return <WorkCollection data={data} loading={isLoading} />;
}
