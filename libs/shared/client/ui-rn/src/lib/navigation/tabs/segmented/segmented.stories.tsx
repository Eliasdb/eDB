import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Segmented } from './segmented';

const meta: Meta<typeof Segmented> = {
  title: 'Navigation/Segmented',
  component: Segmented,
};
export default meta;

type Story = StoryObj<typeof Segmented>;

const TabsBasicRender = () => {
  const [tab, setTab] = useState<'overview' | 'details' | 'activity'>(
    'overview',
  );

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <Segmented
        value={tab}
        onChange={(v) => setTab(v as any)}
        options={[
          { value: 'overview', label: 'Overview' },
          { value: 'details', label: 'Details' },
          { value: 'activity', label: 'Activity' },
        ]}
      />

      {tab === 'overview' && (
        <Text style={{ fontSize: 16 }}>Overview panel</Text>
      )}
      {tab === 'details' && (
        <Text style={{ fontSize: 16 }}>Details panel</Text>
      )}
      {tab === 'activity' && (
        <Text style={{ fontSize: 16 }}>Activity panel</Text>
      )}
    </View>
  );
};

export const TabsBasic: Story = {
  render: () => <TabsBasicRender />,
};
