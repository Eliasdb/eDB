import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { Section } from './section';

const meta: Meta<typeof Section> = {
  title: 'Layout/Section',
  component: Section,
  args: {
    title: 'Profile',
  },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: 'transparent' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Section is a simple titled block that uses a Card for its body. Great for grouping settings or form areas.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Section>;

export const Basic: Story = {
  args: {
    children: (
      <View style={{ padding: 12, gap: 8 }}>
        <Text className="text-[14px] text-text dark:text-text-dark">
          This is a basic section body. Put any content here.
        </Text>
      </View>
    ),
  },
};

export const WithFormishContent: Story = {
  args: {
    title: 'Account',
    children: (
      <View style={{ padding: 12, gap: 12 }}>
        <Text className="text-[14px] text-text dark:text-text-dark">Email</Text>
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          me@example.com
        </Text>
        <View style={{ height: 1, backgroundColor: 'rgba(0,0,0,0.08)' }} />
        <Text className="text-[14px] text-text dark:text-text-dark">
          Password
        </Text>
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          Updated 2 days ago
        </Text>
      </View>
    ),
  },
};

export const DenseContent: Story = {
  args: {
    title: 'Billing',
    children: (
      <View style={{ padding: 12 }}>
        <Text className="text-[14px] text-text dark:text-text-dark">
          Current plan: Pro
        </Text>
        <Text className="text-[12px] text-text-dim dark:text-text-dimDark">
          Renews on 2025-11-20
        </Text>
      </View>
    ),
  },
};
