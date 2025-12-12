import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { Badge } from './badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Display/Badge',
  component: Badge,
  args: {
    label: 'Beta',
    tint: '#6C63FF', // primary
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: 'transparent' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A tiny label chip styled via a single `tint` color. Background uses the tint with ~12% alpha, text uses the solid tint.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {};

export const Danger: Story = {
  args: { label: 'Failing', tint: '#ef4444' },
};

export const Success: Story = {
  args: { label: 'Passed', tint: '#16a34a' },
};

export const Neutral: Story = {
  args: { label: 'Muted', tint: '#6B7280' },
};

export const LongLabel: Story = {
  args: {
    label: 'Extremely verbose status label',
    tint: '#1f9cf0',
  },
};

export const OnDarkBackground: Story = {
  render: (args) => (
    <View
      style={{
        padding: 16,
        backgroundColor: '#0b0c0f',
        borderRadius: 12,
      }}
    >
      <Badge {...args} />
    </View>
  ),
  args: { label: 'Dark BG', tint: '#c7c2ff' },
};
