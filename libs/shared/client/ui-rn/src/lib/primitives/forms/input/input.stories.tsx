// apps/mobile/src/lib/ui/primitives/input.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { Input } from './input';

const meta: Meta<typeof Input> = {
  title: 'Primitives/Forms/Input',
  component: Input,
  args: {
    placeholder: 'Type something…',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Input>;

/* --- Base ------------------------------------------------------ */

export const Default: Story = {};

export const WithValue: Story = {
  args: { value: 'Hello Clara!' },
};

export const Password: Story = {
  args: { placeholder: 'Enter password', secureTextEntry: true },
};

export const Disabled: Story = {
  args: { editable: false, value: 'Read-only value' },
};

export const Multiline: Story = {
  args: {
    multiline: true,
    numberOfLines: 4,
    placeholder: 'Write a longer message…',
    style: { textAlignVertical: 'top' },
  },
};

/* --- Variants ------------------------------------------------- */

export const DifferentBorders: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Input placeholder="Default border" />
      <Input placeholder="Custom border color" className="border-danger" />
      <Input placeholder="No border" className="border-0" />
    </View>
  ),
};

export const WithCustomTextColor: Story = {
  args: { placeholder: 'Custom text color', className: 'text-success' },
};
