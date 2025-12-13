import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import type { TabDef } from '../../tab.types';
import { TabBarTop } from './tab-bar-top';

type K = 'overview' | 'activity' | 'settings';

const sampleTabs: TabDef<K>[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'activity', label: 'Activity' },
  { key: 'settings', label: 'Settings' },
];

const meta: Meta<typeof TabBarTop<K>> = {
  title: 'Navigation/Tab Bar Top',
  component: TabBarTop,
  args: {
    tabs: sampleTabs,
    value: 'overview',
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          backgroundColor: '#f9fafb',
          paddingVertical: 20,
        }}
      >
        <Story />
      </View>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TabBarTop<K>>;

const DefaultRender = (args: Parameters<typeof TabBarTop<K>>[0]) => {
  const [value, setValue] = useState<K>('overview');
  return <TabBarTop<K> {...args} value={value} onChange={(k) => setValue(k)} />;
};

/** Basic usage with three tabs */
export const Default: Story = {
  render: (args) => <DefaultRender {...args} />,
};

const StartWithActivityRender = (args: Parameters<typeof TabBarTop<K>>[0]) => {
  const [value, setValue] = useState<K>('activity');
  return <TabBarTop<K> {...args} value={value} onChange={(k) => setValue(k)} />;
};

/** Start with a different active tab */
export const StartWithActivity: Story = {
  render: (args) => <StartWithActivityRender {...args} />,
};

const LongLabelsRender = (args: Parameters<typeof TabBarTop<K>>[0]) => {
  const [value, setValue] = useState('overview');
  return <TabBarTop {...args} value={value} onChange={(k) => setValue(k)} />;
};

/** Long labels to test spacing and truncation */
export const LongLabels: Story = {
  args: {
    tabs: [
      { key: 'overview', label: 'Overview of your dashboard' },
      { key: 'activity', label: 'Recent activity and logs' },
      { key: 'settings', label: 'Application & User Settings' },
    ],
  },
  render: (args) => <LongLabelsRender {...args} />,
};

const ManyTabsRender = (args: Parameters<typeof TabBarTop<K>>[0]) => {
  const [value, setValue] = useState('billing');
  return <TabBarTop {...args} value={value} onChange={(k) => setValue(k)} />;
};

/** Four or more tabs */
export const ManyTabs: Story = {
  args: {
    tabs: [
      { key: 'overview', label: 'Overview' },
      { key: 'activity', label: 'Activity' },
      { key: 'settings', label: 'Settings' },
      { key: 'billing', label: 'Billing' },
      { key: 'support', label: 'Support' },
    ],
  },
  render: (args) => <ManyTabsRender {...args} />,
};
