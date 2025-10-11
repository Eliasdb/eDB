import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { useCompanyOverview } from '../../../../../../lib/api/hooks/crm/useCompanyOverview';
import TasksCollection from '../../../../../../lib/features/crm/components/companies/TasksCollection';

export default function TasksPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return <TasksCollection data={data} loading={isLoading} />;
}
