import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { colorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Avatar } from '../../../primitives';
import { AudioGlowDark } from './audio-glow-dark';

/* ---------------- helpers ---------------- */

// Force NativeWind’s dark theme for all stories here
const ForceDarkWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  useEffect(() => {
    const prev = colorScheme.get();
    colorScheme.set('dark');
    return () => colorScheme.set(prev ?? 'light');
  }, []);

  return (
    <SafeAreaProvider>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0b0c0f',
        }}
      >
        {children}
      </View>
    </SafeAreaProvider>
  );
};

const forceDark: Decorator = (Story) => (
  <ForceDarkWrapper>
    <Story />
  </ForceDarkWrapper>
);

/* ---------------- meta ---------------- */

const meta: Meta<typeof AudioGlowDark> = {
  title: 'Visuals/Audio Glow (Dark)',
  component: AudioGlowDark,
  args: {
    level: 0.4,
    speaking: true,
    baseRadius: 140,
    color: 'rgba(108,99,255,1)',
  },
  decorators: [forceDark],
  parameters: {
    docs: {
      description: {
        component:
          'Dark-mode showcase of the Skia-based Audio Glow with a black background and avatar overlay.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AudioGlowDark>;

/* ---------------- stories ---------------- */

/** 🔥 Default glow (dark mode) */
export const Basic: Story = {
  render: (args) => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <AudioGlowDark {...args} />
      <Avatar size={160} />
    </View>
  ),
};

/** 🤫 Quiet mode */
export const Quiet: Story = {
  args: { level: 0.4, speaking: true },
  render: Basic.render,
};

/** 🔊 Loud mode */
export const Loud: Story = {
  args: { level: 1.0, speaking: true },
  render: Basic.render,
};

/** 💤 Not speaking */
export const NotSpeaking: Story = {
  args: { speaking: false },
  render: Basic.render,
};
