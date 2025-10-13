import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import { TasksCollection } from '@features/crm/components';

export default function TasksPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return <TasksCollection data={data} loading={isLoading} />;
}
