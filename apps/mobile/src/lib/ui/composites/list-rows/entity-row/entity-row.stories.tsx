import { Ionicons } from '@expo/vector-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { IconButton } from '../../../primitives';
import { EntityRow } from './entity-row';

const meta: Meta<typeof EntityRow> = {
  title: 'Composites/List Rows/Entity Row',
  component: EntityRow,
  args: {
    name: 'Jane Doe',
    avatarShape: 'circle',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 12, backgroundColor: '#f8fafc' }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof EntityRow>;

/** Person with network avatar + two chips + trailing actions */
export const PersonWithAvatar: Story = {
  render: (args) => (
    <EntityRow
      {...args}
      name="Jane Doe"
      avatarUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80"
      chips={[
        {
          text: 'Owner',
          tone: 'primary',
          left: <Ionicons name="star" size={12} />,
        },
        { text: 'EN', tone: 'info' },
      ]}
      right={
        <>
          <IconButton
            name="chatbubble-ellipses-outline"
            variant="ghost"
            size="sm"
          />
          <IconButton name="call-outline" variant="ghost" size="sm" />
        </>
      }
    />
  ),
};

/** Person without avatar → initials fallback */
export const PersonWithInitials: Story = {
  render: (args) => (
    <EntityRow
      {...args}
      name="Liam Nguyen"
      initials="LN"
      chips={[{ text: 'VIP', tone: 'success' }]}
      right={
        <IconButton name="ellipsis-horizontal" variant="ghost" size="sm" />
      }
    />
  ),
};

/** Company row: rounded logo + tags */
export const CompanyRow: Story = {
  render: (args) => (
    <EntityRow
      {...args}
      name="Acme, Inc."
      avatarShape="rounded"
      avatarUrl="https://dummyimage.com/80x80/111827/ffffff&text=A"
      chips={[
        { text: 'SaaS', tone: 'primary' },
        { text: '€ Enterprise', tone: 'info' },
      ]}
      right={<IconButton name="open-outline" variant="ghost" size="sm" />}
    />
  ),
};

/** Dense list preview with multiple rows */
export const ListPreview: Story = {
  render: () => (
    <View
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
      }}
    >
      <EntityRow
        name="Jane Doe"
        avatarUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=128&q=80"
        chips={[{ text: 'Owner', tone: 'primary' }]}
        right={
          <IconButton name="ellipsis-horizontal" variant="ghost" size="sm" />
        }
        style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}
      />
      <EntityRow
        name="Acme, Inc."
        avatarShape="rounded"
        avatarUrl="https://dummyimage.com/80x80/111827/ffffff&text=A"
        chips={[
          { text: 'SaaS', tone: 'info' },
          { text: 'EU', tone: 'neutral' },
        ]}
        right={<IconButton name="open-outline" variant="ghost" size="sm" />}
        style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}
      />
      <EntityRow
        name="Liam Nguyen"
        initials="LN"
        chips={[
          {
            text: 'VIP',
            tone: 'success',
            left: <Ionicons name="ribbon" size={12} />,
          },
        ]}
        right={
          <IconButton
            name="chatbubble-ellipses-outline"
            variant="ghost"
            size="sm"
          />
        }
      />
    </View>
  ),
};

/** Minimal row: just a name */
export const Minimal: Story = {
  render: (args) => <EntityRow {...args} name="Unnamed Entity" />,
};
