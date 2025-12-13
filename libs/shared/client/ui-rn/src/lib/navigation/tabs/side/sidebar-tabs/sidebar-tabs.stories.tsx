import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SidebarTabs } from './sidebar-tabs';

type K = 'profile' | 'work' | 'notifications' | 'billing';

const sampleTabs: { key: K; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'work', label: 'Work' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'billing', label: 'Billing' },
];

const meta: Meta<typeof SidebarTabs<K>> = {
  title: 'Navigation/Sidebar Tabs',
  component: SidebarTabs,
  args: {
    tabs: sampleTabs,
    value: 'profile',
  },
  decorators: [
    (Story) => (
      // Frame it so the 240px sidebar looks natural
      <View style={{ height: 520, borderWidth: 1, borderColor: '#e5e7eb' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof SidebarTabs<K>>;

const DefaultRender = (args: Parameters<typeof SidebarTabs<K>>[0]) => {
  const [value, setValue] = useState<K>(args.value as K);
  return (
    <SidebarTabs<K> {...args} value={value} onChange={(k) => setValue(k)} />
  );
};

/** Basic interactive example. */
export const Default: Story = {
  render: (args) => <DefaultRender {...args} />,
};

const WithTitleRender = (args: Parameters<typeof SidebarTabs<K>>[0]) => {
  const [value, setValue] = useState<K>('work');
  return (
    <SidebarTabs<K>
      {...args}
      title="Settings"
      value={value}
      onChange={(k) => setValue(k)}
    />
  );
};

/** With a section title above the tabs. */
export const WithTitle: Story = {
  render: (args) => <WithTitleRender {...args} />,
};

const WithFooterRender = (args: Parameters<typeof SidebarTabs<K>>[0]) => {
  const [value, setValue] = useState<K>('notifications');
  return (
    <SidebarTabs<K>
      {...args}
      value={value}
      onChange={(k) => setValue(k)}
      footer={
        <View>
          <Text style={{ fontSize: 12, opacity: 0.8 }}>v1.0.0</Text>
          <Text style={{ fontSize: 12, opacity: 0.8 }}>© Clara Labs</Text>
        </View>
      }
    />
  );
};

/** With a footer (e.g., version, help link area). */
export const WithFooter: Story = {
  render: (args) => <WithFooterRender {...args} />,
};

const LongLabelsRender = (args: Parameters<typeof SidebarTabs<K>>[0]) => {
  const [value, setValue] = useState<K>('profile');
  return (
    <SidebarTabs<K>
      {...args}
      value={value}
      onChange={(k) => setValue(k)}
      title="Account"
      footer={<Text style={{ fontSize: 12, opacity: 0.8 }}>Need help?</Text>}
    />
  );
};

/** Longer labels to see truncation and spacing. */
export const LongLabels: Story = {
  args: {
    tabs: [
      { key: 'profile', label: 'Personal Profile' },
      { key: 'work', label: 'Company & Role Details' },
      { key: 'notifications', label: 'Notifications & Alerts' },
      { key: 'billing', label: 'Billing & Invoices' },
    ] as any,
  },
  render: (args) => <LongLabelsRender {...args} />,
};
