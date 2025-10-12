import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import SnapshotCollection from '@features/crm/components/companies/SnapshotCollection';
import { IntroHeader } from '@ui/composites/intro-header/intro-header';

import { View } from 'react-native';

export default function SnapshotPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);

  return (
    <>
      <IntroHeader
        text="Snapshot — the essentials at a glance."
        variant="secondary"
      />
      <View style={{ height: 16 }} />
      <SnapshotCollection data={data} loading={isLoading} />
    </>
  );
}
