import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useCompanyOverview } from '../../../../../../lib/api/hooks/crm/useCompanyOverview';
import WorkCollection from '../../../../../../lib/features/crm/components/companies/WorkCollection';

export default function ContactsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  return (
    <View>
      <WorkCollection data={data} loading={isLoading} />
    </View>
  );
}
