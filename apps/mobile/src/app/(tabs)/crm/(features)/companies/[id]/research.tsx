import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import { ResearchCollection } from '@features/crm/components';

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
