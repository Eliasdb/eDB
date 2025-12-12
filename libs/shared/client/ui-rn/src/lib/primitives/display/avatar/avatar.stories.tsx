// @ui/primitives/avatar.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Avatar } from './avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Primitives/Display/Avatar',
  component: Avatar,
  args: { size: 160 },
  argTypes: {
    size: { control: { type: 'range', min: 32, max: 256, step: 8 } },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: { size: 160 },
};

export const Small: Story = {
  args: { size: 48 },
};

export const Medium: Story = {
  args: { size: 96 },
};

export const Large: Story = {
  args: { size: 200 },
};

/**
 * Composite example showing a "team row"
 */
export const Group: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Avatar size={48} />
      <Avatar size={96} />
      <Avatar size={200} />
    </View>
  ),
};
