import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import Card from '../primitives/Card';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Card',
  component: Card,
  args: { inset: true, title: 'Card title', subtitle: 'Small subtitle' },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Raised: Story = {
  args: { tone: 'raised', bordered: true },
  render: (args) => <Card {...args}>Body content</Card>,
};

export const FlatNoBorder: Story = {
  args: {
    tone: 'flat',
    bordered: false,
    inset: false,
    title: undefined,
    subtitle: undefined,
  },
  render: (args) => (
    <View style={{ maxWidth: 960 }}>
      <Card {...args}>Clean list surface</Card>
    </View>
  ),
};
