// @ui/primitives/card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Card } from './card';

const meta: Meta<typeof Card> = {
  title: 'Primitives/Display/Card',
  component: Card,
  args: {
    inset: true,
    bordered: true,
    shadowOnDark: true,
    tone: 'raised',
    radius: 'all',
    title: 'Card title',
    subtitle: 'Small subtitle…',
  },
  argTypes: {
    tone: { control: 'radio', options: ['raised', 'flat', 'muted'] },
    radius: {
      control: 'radio',
      options: ['all', 'top-none', 'bottom-none', 'none'],
    },
    headerRight: { control: false, table: { disable: true } }, // React element – not serializable
    className: { control: false },
    bodyClassName: { control: false },
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

type Story = StoryObj<typeof Card>;

/* --- Basics ------------------------------------------------------------- */

export const Raised: Story = {
  name: 'Raised (default)',
  args: { tone: 'raised', bordered: true },
  render: (args) => <Card {...args}>Body content…</Card>,
};

export const FlatSurface: Story = {
  args: {
    tone: 'flat',
    bordered: false,
    inset: true,
    title: 'Flat surface',
    subtitle: 'No border for seamless panels',
  },
  render: (args) => <Card {...args}>This blends into the page.</Card>,
};

export const Muted: Story = {
  args: { tone: 'muted', title: 'Muted', subtitle: 'Subtle background' },
  render: (args) => <Card {...args}>Soft emphasis background.</Card>,
};

/* --- Header variations -------------------------------------------------- */

export const WithHeaderAction: Story = {
  args: { title: 'Card with action', subtitle: 'Tap the ⋯ icon' },
  render: (args) => (
    <Card
      {...args}
      headerRight={
        <Pressable
          accessibilityLabel="More options"
          onPress={() => console.log('more tapped')}
          style={{ paddingVertical: 6, paddingHorizontal: 8 }}
        >
          <Text style={{ fontSize: 18 }}>⋯</Text>
        </Pressable>
      }
    >
      Actions sit in the headerRight slot.
    </Card>
  ),
};

export const LongTitleTruncation: Story = {
  args: {
    title:
      'Very long title that should truncate gracefully at one line without destroying the layout of the header area',
    subtitle:
      'A smaller subtitle that also truncates when needed to keep rows tidy',
  },
  render: (args) => <Card {...args}>Truncation demo.</Card>,
};

/* --- Radius presets & list panes --------------------------------------- */

export const ListPaneTop: Story = {
  args: {
    tone: 'flat',
    bordered: true,
    radius: 'top-none',
    title: 'List pane (top-none)',
    subtitle: 'Good for stacked lists where the top edge is shared',
  },
  render: (args) => <Card {...args}>Top edge is square.</Card>,
};

export const ListPaneBottom: Story = {
  args: {
    tone: 'flat',
    bordered: true,
    radius: 'bottom-none',
    title: 'List pane (bottom-none)',
    subtitle: 'Good for stacked lists where the bottom edge is shared',
  },
  render: (args) => <Card {...args}>Bottom edge is square.</Card>,
};

/* --- Content variations ------------------------------------------------- */

export const NoInsetMedia: Story = {
  args: {
    inset: false,
    title: 'Media card (no inset)',
    subtitle: 'Edge-to-edge image',
  },
  render: (args) => (
    <Card {...args}>
      <Image
        source={{ uri: 'https://picsum.photos/800/420' }}
        style={{
          width: '100%',
          height: 180,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
        }}
        resizeMode="cover"
      />
      <View style={{ padding: 16 }}>
        <Text>Edge-to-edge media with separate padded text area.</Text>
      </View>
    </Card>
  ),
};

export const WithActionsRow: Story = {
  args: { title: 'Actions row', subtitle: 'Buttons inside body' },
  render: (args) => (
    <Card {...args}>
      <Text>Quick actions:</Text>
      <View style={{ height: 12 }} />
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={() => undefined}
          style={{ paddingVertical: 8, paddingHorizontal: 12 }}
        >
          <Text>Primary</Text>
        </Pressable>
        <Pressable
          onPress={() => undefined}
          style={{ paddingVertical: 8, paddingHorizontal: 12 }}
        >
          <Text>Secondary</Text>
        </Pressable>
      </View>
    </Card>
  ),
};

export const ScrollableContent: Story = {
  args: { title: 'Scrollable body', subtitle: 'Long content inside' },
  render: (args) => (
    <Card {...args} inset={false}>
      <ScrollView
        style={{ maxHeight: 180, paddingHorizontal: 16, paddingVertical: 12 }}
      >
        {[...Array(20)].map((_, i) => (
          <Text key={i} style={{ marginBottom: 8 }}>
            Item #{i + 1} — Lorem ipsum dolor sit amet.
          </Text>
        ))}
      </ScrollView>
    </Card>
  ),
};

/* --- States ------------------------------------------------------------- */

export const LoadingState: Story = {
  args: { title: 'Loading', subtitle: 'Fetching data…' },
  render: (args) => (
    <Card {...args}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <ActivityIndicator />
        <Text>Hold on, getting things ready…</Text>
      </View>
    </Card>
  ),
};

export const ErrorState: Story = {
  args: { title: 'Something went wrong', tone: 'muted' },
  render: (args) => (
    <Card {...args} bordered>
      <Text style={{ color: '#b00020' }}>
        Could not load the resource. Please try again.
      </Text>
    </Card>
  ),
};

/* --- “Playground” composite -------------------------------------------- */

export const DashboardPreview: Story = {
  name: 'Dashboard preview',
  render: () => (
    <View style={{ gap: 16 }}>
      <Card title="Today" subtitle="3 tasks due">
        <Text>• Call ACME about renewal</Text>
        <Text>• Prepare demo deck</Text>
        <Text>• Review contract redlines</Text>
      </Card>

      <Card
        title="Leads"
        subtitle="New this week"
        headerRight={<Text>See all</Text>}
      >
        <View style={{ gap: 8 }}>
          <Text>• Globex — discovery call scheduled</Text>
          <Text>• Soylent — requested pricing</Text>
          <Text>• Initech — awaiting NDA</Text>
        </View>
      </Card>

      <Card tone="flat" bordered={false} title="Notes">
        <Text>Meeting with Clara AI team at 2pm.</Text>
      </Card>
    </View>
  ),
};
