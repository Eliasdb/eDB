import { Ionicons } from '@expo/vector-icons';
import type { Meta, StoryObj } from '@storybook/react';
import { Text, View } from 'react-native';

import {
  Panel,
  PanelGroup,
  PanelGroupItemAccordionRow,
  PanelGroupItemRow,
  PanelGroupItemSwitch,
  PanelSectionHeader,
} from './panel';

const meta: Meta<typeof Panel> = {
  title: 'Layout/Panel',
  component: Panel,
  parameters: {
    docs: {
      description: {
        component:
          'Panel is a soft, card-like container. Use PanelGroup to group rows, and the PanelGroupItem* helpers (`Row`, `Switch`, `AccordionRow`) for consistent dividers.',
      },
    },
  },
  decorators: [
    (Story) => (
      <View
        style={{
          flex: 1,
          padding: 16,
          backgroundColor: 'transparent',
          alignItems: 'stretch',
        }}
      >
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Panel>;

/* -------------------------------- Stories -------------------------------- */

export const Basic: Story = {
  render: () => (
    <Panel>
      <PanelSectionHeader
        title="Simple panel"
        subtitle="Just a header + body."
      />
      <View style={{ padding: 16 }}>
        <Text className="text-[14px] text-text dark:text-text-dark">
          Put any content here — forms, paragraphs, etc.
        </Text>
      </View>
    </Panel>
  ),
};

export const WithRows: Story = {
  render: () => (
    <Panel>
      <PanelSectionHeader title="Settings" />
      <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
        <PanelGroup>
          <PanelGroupItemRow
            first
            label="Profile"
            icon="person-outline"
            onPress={() => undefined}
          />
          <PanelGroupItemRow
            label="Notifications"
            icon="notifications-outline"
            value="Enabled"
            onPress={() => undefined}
          />
          <PanelGroupItemRow
            label="Storage"
            icon="folder-outline"
            value="512 MB"
          />
        </PanelGroup>
      </View>
    </Panel>
  ),
};

export const WithToggleAndAccordion: Story = {
  render: () => (
    <Panel>
      <PanelSectionHeader title="Preferences" />
      <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
        <PanelGroup>
          <PanelGroupItemSwitch
            first
            label="Dark mode"
            icon="moon-outline"
            value={true}
            onValueChange={() => undefined}
          />
          <PanelGroupItemAccordionRow
            label="Appearance"
            icon="color-palette-outline"
          >
            <Text className="text-[14px] text-text dark:text-text-dark">
              Theme picker / appearance controls go here.
            </Text>
          </PanelGroupItemAccordionRow>
          <PanelGroupItemAccordionRow label="Language" icon="language-outline">
            <Text className="text-[14px] text-text dark:text-text-dark">
              Language picker goes here.
            </Text>
          </PanelGroupItemAccordionRow>
        </PanelGroup>
      </View>
    </Panel>
  ),
};

export const DenseGroup: Story = {
  render: () => (
    <Panel>
      <PanelSectionHeader title="Compact list" subtitle="Uses compact rows." />
      <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
        <PanelGroup>
          <PanelGroupItemRow
            first
            compact
            label="Quick action"
            icon="flash-outline"
          />
          <PanelGroupItemRow
            compact
            label="Shortcuts"
            icon="key-outline"
            value="3"
          />
          <PanelGroupItemRow
            compact
            label="Integrations"
            icon="sparkles-outline"
            onPress={() => undefined}
          />
        </PanelGroup>
      </View>
    </Panel>
  ),
};

export const MixedExample: Story = {
  render: () => (
    <Panel>
      <PanelSectionHeader
        title="Account"
        subtitle="Manage your account and connected services."
      />
      <View style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
        <PanelGroup>
          <PanelGroupItemRow
            first
            label="Email"
            icon="mail-outline"
            value="me@example.com"
          />
          <PanelGroupItemRow
            label="Password"
            icon="lock-closed-outline"
            value="Updated 2d ago"
          />
          <PanelGroupItemSwitch
            label="2-factor authentication"
            icon="shield-checkmark-outline"
            value
            onValueChange={() => undefined}
          />
          <PanelGroupItemAccordionRow
            label="Connected apps"
            icon="link-outline"
          >
            <View style={{ gap: 8 }}>
              <RowLine icon="logo-github" text="GitHub" />
              <RowLine icon="logo-slack" text="Slack" />
              <RowLine icon="logo-google" text="Google" />
            </View>
          </PanelGroupItemAccordionRow>
        </PanelGroup>
      </View>
    </Panel>
  ),
};

/* ----------------------------- tiny helpers ------------------------------ */

function RowLine({
  icon,
  text,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  text: string;
}) {
  return (
    <View className="flex-row items-center" style={{ gap: 8 }}>
      <Ionicons name={icon} size={16} color="#6B7280" />
      <Text className="text-[14px] text-text dark:text-text-dark">{text}</Text>
    </View>
  );
}
