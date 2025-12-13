import { useCompanyOverview } from '@edb-clara/client-crm';
import { useLocalSearchParams } from 'expo-router';

import { ResearchCollection, type ResearchData } from '@edb-clara/feature-crm';

export default function ResearchPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);
  const research = (data as { research?: ResearchData } | undefined)?.research;

  return (
    <ResearchCollection
      name={data?.company?.name}
      data={research}
      loading={isLoading}
    />
  );
}
