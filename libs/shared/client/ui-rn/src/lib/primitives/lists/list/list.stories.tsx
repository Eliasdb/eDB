// apps/mobile/src/lib/ui/primitives/list.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { List } from './list';

const meta: Meta<typeof List> = {
  title: 'Primitives/Lists/List',
  component: List,
  args: { inset: false },
  parameters: {
    docs: {
      description: {
        component:
          'A simple list container with optional inset styling. Use `List.Item` for each row.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof List>;

export const Basic: Story = {
  render: (args) => (
    <List {...args}>
      <List.Item first>
        <Text className="p-4">First item</Text>
      </List.Item>
      <List.Item>
        <Text className="p-4">Second item</Text>
      </List.Item>
      <List.Item>
        <Text className="p-4">Third item</Text>
      </List.Item>
    </List>
  ),
};

export const Inset: Story = {
  args: { inset: true },
  render: (args) => (
    <List {...args}>
      <List.Item first>
        <Text className="p-4">Inset first row</Text>
      </List.Item>
      <List.Item>
        <Text className="p-4">Inset second row</Text>
      </List.Item>
    </List>
  ),
};

export const WithCustomContent: Story = {
  render: (args) => (
    <List {...args} inset>
      <List.Item first>
        <View className="flex-row items-center justify-between p-4">
          <Text>User setting</Text>
          <Text className="text-text-dim">On</Text>
        </View>
      </List.Item>
      <List.Item>
        <View className="flex-row items-center justify-between p-4">
          <Text>Another option</Text>
          <Text className="text-text-dim">Off</Text>
        </View>
      </List.Item>
    </List>
  ),
};
