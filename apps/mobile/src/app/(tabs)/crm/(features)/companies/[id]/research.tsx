import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useCompanyOverview } from '../../../../../../lib/api/hooks/crm/useCompanyOverview';
import ResearchCollection from '../../../../../../lib/features/crm/components/companies/ResearchCollection';

export default function ResearchPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);

  return (
    <View>
      <ResearchCollection
        name={data?.company?.name}
        data={(data as any)?.research}
        loading={isLoading}
        onScan={() => {}}
        onOpenArticle={() => {}}
      />
    </View>
  );
}
