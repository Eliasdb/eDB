import { IntroHeader } from '@ui/composites/intro-header/intro-header';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { useCompanyOverview } from '../../../../../../lib/api/hooks/crm/useCompanyOverview';
import SnapshotCollection from '../../../../../../lib/features/crm/components/companies/SnapshotCollection';

export default function SnapshotPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useCompanyOverview(id);

  return (
    <View>
      <IntroHeader
        text="Snapshot — the essentials at a glance."
        variant="secondary"
      />
      <View style={{ height: 16 }} />
      <SnapshotCollection data={data} loading={isLoading} />
    </View>
  );
}
