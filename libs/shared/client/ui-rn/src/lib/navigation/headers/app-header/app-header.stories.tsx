// apps/mobile/src/lib/ui/app-header.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { colorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppHeader } from './app-header';

/* ---------------- helpers ---------------- */

// Force NativeWind’s theme for a single story (light/dark)
const forceTheme =
  (mode: 'light' | 'dark'): Decorator =>
  (Story) => {
    useEffect(() => {
      const prev = colorScheme.get();
      colorScheme.set(mode);
      return () => colorScheme.set(prev ?? 'light');
    }, []);

    const bg = mode === 'dark' ? '#0b0c0f' : '#f6f7fb';
    return (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: bg }}>
          <Story />
        </View>
      </SafeAreaProvider>
    );
  };

/* ---------------- meta ---------------- */

const meta: Meta<typeof AppHeader> = {
  title: 'Navigation/Headers/App Header',
  component: AppHeader,
  args: {
    title: 'Dashboard',
  },
  // Default to light mode for all stories here
  decorators: [forceTheme('light')],
  parameters: {
    docs: {
      description: {
        component:
          'App header with Safe Area. Stories are theme-aware via NativeWind colorScheme.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AppHeader>;

/** Basic header with a short title */
export const Basic: Story = {
  render: (args) => (
    <AppHeader
      title={args.title as string}
      onNavigate={(path, opts) => action('onNavigate')({ path, opts })}
    />
  ),
};

/** Longer title to verify truncation/spacing */
export const LongTitle: Story = {
  args: {
    title: 'Customer Relationship Overview & Pipeline Health',
  },
  render: Basic.render,
};

/** Header on a dark-ish background to preview contrast (still light theme) */
export const OnDarkBackground: Story = {
  args: { title: 'Inbox' },
  render: (args) => (
    <>
      {/* Reuse the default (light) theme but with a darker page bg */}
      {/* We still wrap in SafeArea via the default meta decorator */}
      <View style={{ flex: 1, backgroundColor: '#0b0c0f' }}>
        <AppHeader
          title={args.title as string}
          onNavigate={(path, opts) => action('onNavigate')({ path, opts })}
        />
      </View>
    </>
  ),
};

/** Full dark mode preview (forces NativeWind dark) */
export const DarkMode: Story = {
  args: { title: 'Projects' },
  decorators: [forceTheme('dark')],
  render: (args) => (
    <AppHeader
      title={args.title as string}
      onNavigate={(path, opts) => action('onNavigate')({ path, opts })}
    />
  ),
};

/** Simulated navigation use: clicking items in HeaderUserMenu should log */
export const WithNavigationAction: Story = {
  args: { title: 'Projects' },
  render: Basic.render,
};
