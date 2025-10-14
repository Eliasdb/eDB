// apps/mobile/src/lib/ui/primitives/checkbox.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Checkbox } from './checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Primitives/Forms/Checkbox',
  component: Checkbox,
  args: {
    checked: false,
    size: 'sm',
    tintChecked: 'success',
    tintUnchecked: 'primary',
    accessibilityLabel: 'Agree to terms',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md'] },
    tintChecked: {
      control: 'inline-radio',
      options: ['primary', 'success', 'danger', 'neutral'],
    },
    tintUnchecked: {
      control: 'inline-radio',
      options: ['primary', 'success', 'danger', 'neutral'],
    },
    onChange: { action: 'onChange' },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 12 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Checkbox>;

/* --- Simple controlled examples ----------------------------------------- */

export const Unchecked: Story = {
  args: { checked: false },
};

export const Checked: Story = {
  args: { checked: true },
};

export const DangerUnchecked: Story = {
  args: { checked: false, tintUnchecked: 'danger' },
};

export const SuccessChecked: Story = {
  args: { checked: true, tintChecked: 'success' },
};

export const SizesRow: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
      <Checkbox {...args} size="xs" />
      <Checkbox {...args} size="sm" />
      <Checkbox {...args} size="md" />
    </View>
  ),
  args: { checked: true },
};

/* --- With label (layout demo) ------------------------------------------- */

export const WithTextLabel: Story = {
  render: (args) => {
    const [val, setVal] = useState(!!args.checked);
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Checkbox {...args} checked={val} onChange={setVal} />
        <Text style={{ fontSize: 16 }}>Receive updates by email</Text>
      </View>
    );
  },
};

/* --- Playground (fully interactive) ------------------------------------- */

export const Playground: Story = {
  render: (args) => {
    const [val, setVal] = useState(!!args.checked);
    return (
      <View style={{ gap: 12 }}>
        <Checkbox
          {...args}
          checked={val}
          onChange={(next) => {
            setVal(next);
            args.onChange?.(next);
          }}
        />
        <Text>Checked: {val ? 'true' : 'false'}</Text>
      </View>
    );
  },
  args: { checked: false, tintChecked: 'primary', tintUnchecked: 'neutral' },
};
