import type { Meta, StoryObj } from '@storybook/react';
import { ItemRow } from './item-row';

const meta: Meta<typeof ItemRow> = {
  title: 'Composites/List Rows/Item Row',
  component: ItemRow,
  args: {
    label: 'Settings',
    icon: 'settings-outline',
  },
};

export default meta;
type Story = StoryObj<typeof ItemRow>;

export const Default: Story = {};

export const WithValue: Story = {
  args: {
    value: 'Enabled',
  },
};

export const Clickable: Story = {
  args: {
    onPress: () => alert('Row pressed!'),
  },
};

export const Compact: Story = {
  args: {
    compact: true,
  },
};

export const WithTopDivider: Story = {
  args: {
    showDividerTop: true,
  },
};

export const WithBorders: Story = {
  args: {
    border: true,
    borderPosition: 'all',
  },
};
