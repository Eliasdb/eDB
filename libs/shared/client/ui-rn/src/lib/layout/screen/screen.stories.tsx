import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { Screen } from './screen';

const meta: Meta<typeof Screen> = {
  title: 'Layout/Screen',
  component: Screen,
  args: {
    padding: 32,
    center: true,
  },
  argTypes: {
    children: { control: false }, // not serializable
  },
  parameters: {
    docs: {
      description: {
        component:
          'Screen wraps `ScrollView` with sane defaults: background, padding, optional centering. Use for top-level screens.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Screen>;

export const Basic: Story = {
  render: (args) => (
    <Screen {...args}>
      <Text className="text-[16px] text-text dark:text-text-dark">
        Hello from Screen 👋
      </Text>
    </Screen>
  ),
};

export const WithMultipleBlocks: Story = {
  render: (args) => (
    <Screen {...args} center={false}>
      <View style={{ gap: 16 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <View
            key={i}
            style={{
              height: 80,
              backgroundColor: i % 2 ? '#e5e7eb' : '#d1d5db',
              borderRadius: 8,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>Block {i + 1}</Text>
          </View>
        ))}
      </View>
    </Screen>
  ),
};

export const PaddedTight: Story = {
  render: (args) => (
    <Screen {...args} center padding={8}>
      <Text className="text-[14px] text-text-dim dark:text-text-dimDark">
        Tight padding (8). Great for compact forms or modal-style layouts.
      </Text>
    </Screen>
  ),
};
