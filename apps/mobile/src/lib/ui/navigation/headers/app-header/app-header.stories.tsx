// apps/mobile/src/lib/ui/app-header.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppHeader } from './app-header';

const meta: Meta<typeof AppHeader> = {
  title: 'Navigation/Headers/App Header',
  component: AppHeader,
  args: {
    title: 'Dashboard',
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#f6f7fb' }}>
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
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

/** Header on a dark-ish background to preview contrast */
export const OnDarkBackground: Story = {
  args: { title: 'Inbox' },
  render: (args) => (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#0b0c0f' }}>
        <AppHeader
          title={args.title as string}
          onNavigate={(path, opts) => action('onNavigate')({ path, opts })}
        />
      </View>
    </SafeAreaProvider>
  ),
};

/** Simulated navigation use: clicking items in HeaderUserMenu should log */
export const WithNavigationAction: Story = {
  args: { title: 'Projects' },
  render: (args) => (
    <AppHeader
      title={args.title as string}
      onNavigate={(path, opts) => action('onNavigate')({ path, opts })}
    />
  ),
};
