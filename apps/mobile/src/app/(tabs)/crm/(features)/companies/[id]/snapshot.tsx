import { useCompanyOverview } from '@data-access/crm/companies';
import { useLocalSearchParams } from 'expo-router';

import { SnapshotCollection } from '@edb-clara/feature-crm';
import { IntroHeader } from '@edb/shared-ui-rn';

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
