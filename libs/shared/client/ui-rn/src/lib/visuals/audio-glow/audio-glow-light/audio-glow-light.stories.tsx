import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { colorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar } from '../../../primitives';
import AudioGlowLight from './audio-glow-light';

/* ---------------- helpers ---------------- */

// Force NativeWind’s light theme for all stories here
const ForceLightWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const prev = colorScheme.get();
    colorScheme.set('light');
    return () => colorScheme.set(prev ?? 'dark');
  }, []);

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f9fafb',
        }}
      >
        {children}
      </View>
    </SafeAreaProvider>
  );
};

const forceLight: Decorator = (Story) => (
  <ForceLightWrapper>
    <Story />
  </ForceLightWrapper>
);

/* ---------------- meta ---------------- */

const meta: Meta<typeof AudioGlowLight> = {
  title: 'Visuals/Audio Glow (Light)',
  component: AudioGlowLight,
  args: {
    level: 0.4,
    speaking: true,
    baseRadius: 140,
    color: '#6C63FF',
  },
  decorators: [forceLight],
  parameters: {
    docs: {
      description: {
        component:
          'Light-mode version of the AudioGlow rendered with SVG gradients. Optimized for white or very light backgrounds.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AudioGlowLight>;

/* ---------------- stories ---------------- */

/** 💡 Default glow on light background */
export const Basic: Story = {
  render: (args) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AudioGlowLight {...args} />
      <Avatar size={160} />
    </View>
  ),
};

/** 🤫 Quiet mode */
export const Quiet: Story = {
  args: { level: 0.1, speaking: true },
  render: Basic.render,
};

/** 🔊 Loud mode */
export const Loud: Story = {
  args: { level: 1.0, speaking: true },
  render: Basic.render,
};

/** 💤 Not speaking */
export const NotSpeaking: Story = {
  args: { level: 0.5, speaking: false },
  render: Basic.render,
};
