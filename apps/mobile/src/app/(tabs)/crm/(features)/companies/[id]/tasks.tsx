import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import { TasksCollection } from '@edb-clara/feature-crm';

export default function TasksPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return <TasksCollection data={data} loading={isLoading} />;
}
