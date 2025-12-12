import { useCompanyOverview } from '@edb-clara/client-crm';
import { useLocalSearchParams } from 'expo-router';

import { ResearchCollection } from '@edb-clara/feature-crm';

export default function ResearchPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);

  return (
    <ResearchCollection
      name={data?.company?.name}
      data={(data as any)?.research}
      loading={isLoading}
      onScan={() => {}}
      onOpenArticle={() => {}}
    />
  );
}
