// apps/mobile/src/lib/ui/segmented.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { Segmented } from './segmented';

type TVal =
  | 'all'
  | 'active'
  | 'archived'
  | 'day'
  | 'week'
  | 'month'
  | 'alpha'
  | 'beta'
  | 'gamma'
  | 'delta'
  | 'epsilon';

const meta: Meta<typeof Segmented<TVal>> = {
  title: 'Primitives/Forms/Segmented',
  component: Segmented as any, // TS generic appeasement for Storybook
  args: {
    value: 'all',
    options: [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
    ],
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Segmented<TVal>>;

export const Basic: Story = {
  render: (args) => {
    const [val, setVal] = React.useState<TVal>(args.value as TVal);
    return (
      <Segmented<TVal>
        value={val}
        options={args.options as { value: TVal; label: string }[]}
        onChange={(v) => {
          setVal(v);
          // If a consumer passes an onChange via args later, call it:
          args.onChange?.(v);
        }}
      />
    );
  },
};

export const ThreeOptions: Story = {
  args: {
    value: 'week',
    options: [
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ],
  },
  render: Basic.render,
};

export const WithLongLabels: Story = {
  args: {
    value: 'active',
    options: [
      { value: 'all', label: 'Everything' },
      { value: 'active', label: 'Currently Active' },
      { value: 'archived', label: 'Archived Items' },
    ],
  },
  render: Basic.render,
};

export const ManyOptions: Story = {
  args: {
    value: 'alpha',
    options: [
      { value: 'alpha', label: 'Alpha' },
      { value: 'beta', label: 'Beta' },
      { value: 'gamma', label: 'Gamma' },
      { value: 'delta', label: 'Delta' },
      { value: 'epsilon', label: 'Epsilon' },
    ],
  },
  render: (args) => {
    const [val, setVal] = React.useState<TVal>(args.value as TVal);
    return (
      <View style={{ gap: 12 }}>
        <Segmented<TVal>
          value={val}
          options={args.options as any}
          onChange={setVal}
        />
        {/* Show current value for quick visual feedback */}
        <View>
          {/* Use a basic RN Text here if you want a label, omitted to avoid extra imports */}
        </View>
      </View>
    );
  },
};
