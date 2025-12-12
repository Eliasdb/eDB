// apps/mobile/src/lib/ui/primitives/icon.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { View } from 'react-native';
import { DimIcon, Icon } from './icon';

const meta: Meta<typeof Icon> = {
  title: 'Primitives/Display/Icon',
  component: Icon,
  args: {
    name: 'star',
    size: 24,
  },
  argTypes: {
    name: {
      control: 'select',
      options: ['star', 'home', 'heart', 'person', 'settings', 'checkmark'],
    },
    size: { control: { type: 'range', min: 12, max: 64, step: 4 } },
  },
  decorators: [
    (Story) => (
      <View
        style={{ padding: 16, gap: 20, flexDirection: 'row', flexWrap: 'wrap' }}
      >
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Icon>;

/* --- Base Icon ------------------------------------------------------ */

export const Default: Story = {};

export const Large: Story = {
  args: { size: 48, name: 'home' },
};

export const Colored: Story = {
  args: { name: 'heart', size: 32, style: { color: '#ef4444' } },
};

/* --- Variants (multiple) -------------------------------------------- */

export const MultipleIcons: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <Icon name="person" size={28} style={{ color: '#6C63FF' }} />
      <Icon name="settings" size={28} style={{ color: '#16a34a' }} />
      <Icon name="star" size={28} style={{ color: '#facc15' }} />
    </View>
  ),
};

/* --- Dimmed variant ------------------------------------------------- */

export const DimmedDefault: Story = {
  render: () => <DimIcon name="star" size={28} />,
};

export const DimmedCustomColor: Story = {
  render: () => <DimIcon name="star" size={28} color="#0ea5e9" />,
};
