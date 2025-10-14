// apps/mobile/src/app/components/pulse-dot.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { PulseDot } from './dot';

const meta: Meta<typeof PulseDot> = {
  title: 'Indicators/Pulse Dot',
  component: PulseDot,
  args: {
    on: true,
    size: 14,
    color: '#10B981', // success green
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: 24,
          gap: 20,
        }}
      >
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A small animated dot that pulses when `on` is true. Useful for online indicators, activity states, or recording status.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof PulseDot>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <PulseDot size={8} on />
      <PulseDot size={14} on />
      <PulseDot size={20} on />
    </View>
  ),
};

export const Colors: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <PulseDot size={14} on color="#10B981" />
      <PulseDot size={14} on color="#3B82F6" />
      <PulseDot size={14} on color="#EF4444" />
      <PulseDot size={14} on color="#F59E0B" />
    </View>
  ),
};

export const Static: Story = {
  args: {
    on: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'When `on` is false, the dot renders static (no animation).',
      },
    },
  },
};
