// apps/mobile/src/lib/ui/skeleton.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { Skeleton } from './skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Indicators/Skeleton',
  component: Skeleton,
  args: {
    radius: 6,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

/** A single line — common for text placeholders */
export const TextLine: Story = {
  args: {
    width: '80%',
    height: 14,
  },
};

/** Circle — for avatar placeholders */
export const Circle: Story = {
  args: {
    width: 64,
    height: 64,
    radius: 32,
  },
};

/** Block card — simulates a card surface while loading */
export const CardBlock: Story = {
  render: (args) => (
    <View style={{ width: '100%', gap: 10 }}>
      <Skeleton {...args} width="100%" height={180} radius={12} />
      <Skeleton {...args} width="60%" height={14} />
      <Skeleton {...args} width="40%" height={14} />
    </View>
  ),
};

/** List of items — repeated skeleton rows */
export const List: Story = {
  render: (args) => (
    <View style={{ width: '100%', gap: 12 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} {...args} width="100%" height={18} radius={8} />
      ))}
    </View>
  ),
};
