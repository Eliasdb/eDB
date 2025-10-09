// libs/ui/primitives/info-rows.stories.tsx
import { Ionicons } from '@expo/vector-icons';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Text, View } from 'react-native';
import { KeyValueRow, TwoLineRow } from './info-row';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

/** Proxy so we can preview both components with one default export */
type ProxyProps =
  | {
      which: 'key';
      icon: IconName;
      label: string;
      value?: string | number | null;
      primary?: never;
      secondary?: never;
    }
  | {
      which: 'two';
      icon: IconName;
      primary: string; // keep args serializable
      secondary?: string | null; // keep args serializable
      label?: never;
      value?: never;
    };

const InfoRowProxy = (p: ProxyProps) => {
  if (p.which === 'key') {
    return <KeyValueRow icon={p.icon} label={p.label} value={p.value} />;
  }
  // Note: when we need React nodes, we'll override via render()
  return (
    <TwoLineRow
      icon={p.icon}
      primary={p.primary}
      secondary={p.secondary ?? undefined}
    />
  );
};

const meta: Meta<typeof InfoRowProxy> = {
  title: 'Composites/List Rows/CRM/Info Row',
  component: InfoRowProxy,
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: 'rgba(0,0,0,0.02)' }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    which: { control: 'inline-radio', options: ['key', 'two'] },
    icon: { control: 'text' },
    // key-value specific
    label: { control: 'text' },
    value: { control: 'text' },
    // two-line specific (kept as strings)
    primary: { control: 'text' },
    secondary: { control: 'text' },
  },
};
export default meta;

type Story = StoryObj<typeof InfoRowProxy>;

/* ---------------- KeyValueRow stories ---------------- */

export const Key_Basic: Story = {
  args: {
    which: 'key',
    icon: 'time-outline',
    label: 'Last activity',
    value: '2025-10-09 10:30',
  },
};

export const Key_WithNumber: Story = {
  args: {
    which: 'key',
    icon: 'flash-outline',
    label: 'Open tasks',
    value: 7,
  },
};

export const Key_EmptyValue: Story = {
  args: {
    which: 'key',
    icon: 'calendar-outline',
    label: 'Next due task',
    value: null, // renders "—"
  },
};

export const Key_LongValue: Story = {
  args: {
    which: 'key',
    icon: 'information-circle-outline',
    label: 'Status',
    value:
      'Waiting on customer response — SLA 48h, follow-up scheduled for tomorrow',
  },
};

/* ---------------- TwoLineRow stories (string args only) ---------------- */

export const Two_Basic: Story = {
  args: {
    which: 'two',
    icon: 'person-outline',
    primary: 'Jane Doe',
    secondary: 'Head of Ops • jane@acme.io',
  },
};

export const Two_SecondaryOnly: Story = {
  args: {
    which: 'two',
    icon: 'call-outline',
    primary: 'Kickoff call',
    secondary: 'call • 2025-10-09T09:45Z',
  },
};

export const Two_LongTextTruncation: Story = {
  args: {
    which: 'two',
    icon: 'chatbubble-ellipses-outline',
    primary:
      'Very long contact name with multiple middle names and suffixes that should still render nicely',
    secondary:
      'Some additional descriptive text that may wrap to the next line on small screens',
  },
};

/* ---------------- TwoLineRow stories with React nodes via render() ------- */

export const Two_WithReactNodePrimary: Story = {
  args: {
    which: 'two',
    icon: 'flag-outline',
    primary: 'Deal: ACME Renewal', // placeholder so controls stay happy
    secondary: 'status • In negotiation',
  },
  // Use render to inject React nodes (not serializable)
  render: (args) => (
    <TwoLineRow
      icon={args.icon as IconName}
      primary={
        <Text style={{ fontSize: 16, fontWeight: '700' }}>
          <Text style={{ opacity: 0.7 }}>Deal:</Text> ACME Renewal
        </Text>
      }
      secondary={args.secondary ?? undefined}
    />
  ),
  parameters: {
    controls: {
      exclude: ['primary'], // avoid confusion since we override it
    },
  },
};

export const Two_WithReactNodeSecondary: Story = {
  args: {
    which: 'two',
    icon: 'mail-outline',
    primary: 'Sent pricing deck',
    secondary: 'email • today 14:20', // placeholder for controls
  },
  render: (args) => (
    <TwoLineRow
      icon={args.icon as IconName}
      primary={args.primary}
      secondary={
        <Text style={{ fontSize: 12 }}>
          email • <Text style={{ fontWeight: '600' }}>today 14:20</Text>
        </Text>
      }
    />
  ),
  parameters: {
    controls: {
      exclude: ['secondary'], // we render our own node
    },
  },
};

/* ---------------- Bonus: multi-item preview ---------------- */

export const Two_DifferentIcons: Story = {
  args: {
    which: 'two',
    icon: 'person-outline',
    primary: '',
    secondary: null,
  },
  render: () => (
    <View>
      <TwoLineRow
        icon="chatbubble-ellipses-outline"
        primary="Left a note"
        secondary="note • yesterday"
      />
      <TwoLineRow
        icon="mail-outline"
        primary="Follow-up email"
        secondary="email • just now"
      />
      <TwoLineRow
        icon="call-outline"
        primary="Call with CTO"
        secondary="call • Monday"
      />
    </View>
  ),
  parameters: {
    controls: { disable: true },
  },
};
