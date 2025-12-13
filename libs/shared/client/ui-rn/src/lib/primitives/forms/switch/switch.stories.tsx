// apps/mobile/src/lib/ui/primitives/switch.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Switch from './switch';

const meta: Meta<typeof Switch> = {
  title: 'Primitives/Forms/Switch',
  component: Switch,
  args: {
    value: false,
    size: 'sm',
    disabled: false,
  },
  argTypes: {
    onValueChange: { action: 'onValueChange' },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 24, alignItems: 'flex-start', gap: 16 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text>sm</Text>
        <Switch {...args} size="sm" onValueChange={action('sm change')} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text>md</Text>
        <Switch {...args} size="md" onValueChange={action('md change')} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text>lg</Text>
        <Switch {...args} size="lg" onValueChange={action('lg change')} />
      </View>
    </View>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, value: true },
};

export const CustomColors: Story = {
  args: {
    value: true,
    size: 'md',
    trackOnColor: '#22c55e', // green-500
    trackOffColor: '#e5e7eb', // gray-200
    trackBorderColor: '#d1d5db', // gray-300
    knobColor: '#ffffff',
  },
};

const ControlledPlaygroundRender = (args: Parameters<typeof Switch>[0]) => {
  const [on, setOn] = useState<boolean>(false);
  return (
    <View style={{ gap: 16 }}>
      <Text>Value: {on ? 'true' : 'false'}</Text>
      <Switch
        {...args}
        value={on}
        onValueChange={(v) => {
          setOn(v);
          action('onValueChange')(v);
        }}
        size="md"
      />
    </View>
  );
};

export const ControlledPlayground: Story = {
  render: (args) => <ControlledPlaygroundRender {...args} />,
};

export const DenseRow: Story = {
  render: (args) => (
    <View
      style={{
        width: 320,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        backgroundColor: '#fff',
        gap: 12,
      }}
    >
      {['Email alerts', 'Push notifications', 'Weekly summary'].map(
        (label, i) => (
          <View
            key={label}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 6,
            }}
          >
            <Text>{label}</Text>
            <Switch {...args} size="sm" onValueChange={action(`toggle ${i}`)} />
          </View>
        ),
      )}
    </View>
  ),
};
