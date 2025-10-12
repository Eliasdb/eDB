import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import WorkCollection from '@features/crm/components/companies/WorkCollection';

export default function ContactsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return <WorkCollection data={data} loading={isLoading} />;
}
