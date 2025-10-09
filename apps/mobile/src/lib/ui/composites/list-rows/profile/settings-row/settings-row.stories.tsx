// @ui/composites/settings-row.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import SettingsRow, { type SettingsRowProps } from './settings-row';

const meta: Meta<SettingsRowProps> = {
  title: 'Composites/List Rows/Profile/Settings Row',
  component: SettingsRow,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    kind: {
      control: 'radio',
      options: ['item', 'toggle'],
    },
    icon: {
      control: 'text',
    },
    label: {
      control: 'text',
    },
    value: {
      control: 'text',
      if: { arg: 'kind', eq: 'item' },
    },
    onPress: {
      action: 'onPress',
      table: { category: 'Events' },
      if: { arg: 'kind', eq: 'item' },
    },
    onValueChange: {
      action: 'onValueChange',
      table: { category: 'Events' },
      if: { arg: 'kind', eq: 'toggle' },
    },
    border: { control: 'boolean' },
    borderPosition: {
      control: 'select',
      options: ['top', 'bottom', 'y', 'all'],
    },
    compact: { control: 'boolean' },
    showDividerTop: { control: 'boolean' },
    leftGap: { control: 'number' },
    leftInline: { control: 'boolean' },
  },
  args: {
    icon: 'settings-outline',
    label: 'Settings option',
    border: false,
    borderPosition: 'bottom',
    compact: false,
    showDividerTop: false,
    leftGap: 12,
    leftInline: true,
  },
};
export default meta;

type Story = StoryObj<SettingsRowProps>;

/* ---------------- Item variants ---------------- */

export const ItemBasic: Story = {
  args: {
    kind: 'item',
    label: 'Account',
    icon: 'person-circle-outline',
    value: 'john@acme.io',
    onPress: action('onPress'),
  },
};

export const ItemNoValue: Story = {
  args: {
    kind: 'item',
    label: 'Notifications',
    icon: 'notifications-outline',
    onPress: action('onPress'),
  },
};

export const ItemWithBorders: Story = {
  args: {
    kind: 'item',
    label: 'Appearance',
    icon: 'color-palette-outline',
    value: 'Dark',
    border: true,
    borderPosition: 'y',
    onPress: action('onPress'),
  },
};

export const ItemCompact: Story = {
  args: {
    kind: 'item',
    label: 'Storage',
    icon: 'cloud-outline',
    value: '12 GB',
    compact: true,
    onPress: action('onPress'),
  },
};

export const ItemCustomLeftGap: Story = {
  args: {
    kind: 'item',
    label: 'Security',
    icon: 'lock-closed-outline',
    value: '2FA enabled',
    leftGap: 20,
    onPress: action('onPress'),
  },
};

export const ItemWithDividerTop: Story = {
  args: {
    kind: 'item',
    label: 'Privacy',
    icon: 'shield-checkmark-outline',
    value: 'Standard',
    showDividerTop: true,
    onPress: action('onPress'),
  },
};

/* ---------------- Toggle variants ---------------- */

export const ToggleOn: Story = {
  args: {
    kind: 'toggle',
    label: 'Push notifications',
    icon: 'notifications-outline',
    value: true,
    onValueChange: action('onValueChange'),
  },
};

export const ToggleOff: Story = {
  args: {
    kind: 'toggle',
    label: 'Use cellular data',
    icon: 'cellular-outline',
    value: false,
    onValueChange: action('onValueChange'),
  },
};

export const ToggleWithBorders: Story = {
  args: {
    kind: 'toggle',
    label: 'Location services',
    icon: 'location-outline',
    value: true,
    border: true,
    borderPosition: 'all',
    onValueChange: action('onValueChange'),
  },
};

export const ToggleCompact: Story = {
  args: {
    kind: 'toggle',
    label: 'Background refresh',
    icon: 'refresh-outline',
    value: false,
    compact: true,
    onValueChange: action('onValueChange'),
  },
};
