// apps/mobile/src/lib/ui/composites/list-rows/toggle-row.stories.tsx
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { ToggleRow } from './toggle-row';

const meta: Meta<typeof ToggleRow> = {
  title: 'Composites/List Rows/Toggle Row',
  component: ToggleRow,
  args: {
    label: 'Notifications',
    icon: 'notifications-outline',
    value: false,
    compact: false,
    showDividerTop: false,
    border: false,
    borderPosition: 'bottom',
  },
  argTypes: {
    icon: {
      control: 'text',
      description: 'Ionicon name (string)',
    },
    borderPosition: {
      control: { type: 'inline-radio' },
      options: ['top', 'bottom', 'y', 'all'],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A settings-style row with a label, leading icon and a trailing `Switch`.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof ToggleRow>;

export const BasicOff: Story = {
  args: {
    value: false,
    onValueChange: (v: boolean) => action('onValueChange')(v),
  },
};

export const CheckedOn: Story = {
  args: {
    value: true,
    onValueChange: (v: boolean) => action('onValueChange')(v),
  },
};

export const Compact: Story = {
  args: {
    compact: true,
    onValueChange: (v: boolean) => action('onValueChange')(v),
  },
};

export const WithDividerTop: Story = {
  args: {
    showDividerTop: true,
    onValueChange: (v: boolean) => action('onValueChange')(v),
  },
};

export const WithBordersInline: Story = {
  args: {
    border: true,
    borderPosition: 'y',
    onValueChange: (v: boolean) => action('onValueChange')(v),
  },
};
