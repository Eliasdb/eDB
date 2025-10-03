// apps/mobile/src/lib/ui/subheader.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Subheader, TextAction } from './subheader';

const meta: Meta<typeof Subheader> = {
  title: 'Navigation/Headers/Sub Header',
  component: Subheader,
  args: {
    title: 'Subpage',
    bordered: true,
    translucent: true,
    height: 56,
  },
  decorators: [
    (Story) => (
      <SafeAreaProvider>
        <View style={{ flex: 1, backgroundColor: '#0b0c0f' }}>
          {/* Fake content behind to see translucency */}
          <View style={{ height: 160, backgroundColor: '#111827' }} />
          <Story />
        </View>
      </SafeAreaProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Subheader>;

export const Default: Story = {
  args: {
    onBack: () => action('onBack')(),
  },
};

export const WithRightAction: Story = {
  render: (args) => (
    <Subheader
      {...args}
      onBack={() => action('onBack')()}
      right={<TextAction label="Save" onPress={() => action('Save')()} />}
    />
  ),
};

export const CustomCenterNode: Story = {
  render: (args) => (
    <Subheader
      {...args}
      onBack={() => action('onBack')()}
      center={
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.08)',
          }}
        >
          {/* You can drop a small search, segmented control, etc., here */}
        </View>
      }
    />
  ),
  args: {
    title: undefined,
  },
};

export const SolidBackgroundNoBorder: Story = {
  args: {
    title: 'Solid header',
    onBack: () => action('onBack')(),
    translucent: false,
    bordered: false,
  },
};

export const RespectSafeAreaTop: Story = {
  args: {
    title: 'Safe-area top',
    onBack: () => action('onBack')(),
    respectSafeAreaTop: true,
  },
};
