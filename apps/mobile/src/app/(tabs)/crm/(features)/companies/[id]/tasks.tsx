import { useCompanyOverview } from '@api';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import TasksCollection from '../../../../../../lib/features/crm/components/companies/TasksCollection';

export default function TasksPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return (
    <View className="px-0 mt-0">
      <TasksCollection data={data} loading={isLoading} />
    </View>
  );
}
