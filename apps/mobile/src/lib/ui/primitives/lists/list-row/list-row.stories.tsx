import { Ionicons } from '@expo/vector-icons';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text } from 'react-native';

import { ListRow } from './list-row';

const meta: Meta<typeof ListRow> = {
  title: 'Primitives/Lists/List Row',
  component: ListRow,
  args: {
    compact: false,
    showDividerTop: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A flexible row for list UIs with optional left, body, and right slots. Great for settings, profile menus, and dense lists.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ListRow>;

/* ------------------ Stories ------------------ */

export const Basic: Story = {
  render: (args) => (
    <ListRow
      {...args}
      body={
        <Text className="text-[16px] text-text dark:text-text-dark">
          Hello Row
        </Text>
      }
    />
  ),
};

export const WithIconAndChevron: Story = {
  render: (args) => (
    <ListRow
      {...args}
      left={<Ionicons name="person-outline" size={20} color="#6B7280" />}
      body={
        <Text className="text-[16px] text-text dark:text-text-dark">
          Profile
        </Text>
      }
      right={<Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
    />
  ),
};

export const WithSwitch: Story = {
  render: (args) => (
    <ListRow
      {...args}
      left={<Ionicons name="notifications-outline" size={20} color="#6B7280" />}
      body={
        <Text className="text-[16px] text-text dark:text-text-dark">
          Notifications
        </Text>
      }
      right={<Ionicons name="toggle-outline" size={28} color="#6C63FF" />}
    />
  ),
};

export const CompactMode: Story = {
  render: (args) => (
    <ListRow
      {...args}
      compact
      left={<Ionicons name="moon-outline" size={18} color="#6B7280" />}
      body={
        <Text className="text-[15px] text-text dark:text-text-dark">
          Dark Mode
        </Text>
      }
      right={<Ionicons name="checkmark-outline" size={18} color="#16a34a" />}
    />
  ),
};

export const WithDivider: Story = {
  render: (args) => (
    <ListRow
      {...args}
      showDividerTop
      body={
        <Text className="text-[16px] text-text dark:text-text-dark">
          Separated row
        </Text>
      }
    />
  ),
};

export const FullExampleList: Story = {
  render: (args) => (
    <>
      <ListRow
        {...args}
        left={<Ionicons name="person-outline" size={20} color="#6B7280" />}
        body={
          <Text className="text-[16px] text-text dark:text-text-dark">
            Profile
          </Text>
        }
        right={<Ionicons name="chevron-forward" size={18} color="#9CA3AF" />}
      />
      <ListRow
        {...args}
        showDividerTop
        left={
          <Ionicons name="notifications-outline" size={20} color="#6B7280" />
        }
        body={
          <Text className="text-[16px] text-text dark:text-text-dark">
            Notifications
          </Text>
        }
        right={<Ionicons name="toggle-outline" size={28} color="#6C63FF" />}
      />
      <ListRow
        {...args}
        showDividerTop
        left={<Ionicons name="moon-outline" size={20} color="#6B7280" />}
        body={
          <Text className="text-[16px] text-text dark:text-text-dark">
            Dark Mode
          </Text>
        }
        right={<Ionicons name="checkmark-outline" size={18} color="#16a34a" />}
      />
    </>
  ),
};
