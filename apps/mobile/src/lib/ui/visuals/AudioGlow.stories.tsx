// apps/mobile/src/lib/ui/audio-glow.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AudioGlow } from './AudioGlow';

const meta: Meta<typeof AudioGlow> = {
  title: 'Visuals/Audio Glow',
  component: AudioGlow,
  args: {
    level: 0.4,
    speaking: true,
    baseRadius: 140,
    color: 'rgba(108,99,255,1)',
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0b0c0f',
          }}
        >
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof AudioGlow>;

export const Basic: Story = {
  render: (args) => <AudioGlow {...args} />,
};

export const Quiet: Story = {
  args: { level: 0.1, speaking: true },
  render: Basic.render,
};

export const Loud: Story = {
  args: { level: 1.0, speaking: true },
  render: Basic.render,
};

export const NotSpeaking: Story = {
  args: { level: 0.6, speaking: false },
  render: Basic.render,
};
