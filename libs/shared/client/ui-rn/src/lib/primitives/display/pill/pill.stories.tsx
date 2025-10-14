// apps/mobile/src/lib/ui/primitives/pill.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Icon } from '../icon/icon';
import { Pill } from './pill';

const meta: Meta<typeof Pill> = {
  title: 'Primitives/Display/Pill',
  component: Pill,
  args: {
    text: 'Status',
    tone: 'neutral',
    variant: 'soft',
    size: 'md',
    textWeight: 'medium',
    preset: 'default',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, gap: 16 }}>
        <Story />
      </View>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Pill>;

/* --- Basics --------------------------------------------------- */

export const Default: Story = {};

export const SolidPrimary: Story = {
  args: { tone: 'primary', variant: 'solid' },
};

export const OutlineDanger: Story = {
  args: { text: 'Delete', tone: 'danger', variant: 'outline' },
};

export const Sizes: Story = {
  render: () => (
    <View style={{ gap: 12, flexDirection: 'row', flexWrap: 'wrap' }}>
      <Pill text="Small" size="sm" />
      <Pill text="Medium" size="md" />
      <Pill text="Large" size="lg" />
    </View>
  ),
};

/* --- With icons (use render so args stay serializable) -------- */

export const WithLeftIcon: Story = {
  args: { text: 'Online', tone: 'success', variant: 'soft' },
  render: (args) => <Pill {...args} left={<Icon name="checkmark-circle" />} />,
};

export const WithRightIcon: Story = {
  args: { text: 'Info', tone: 'info', variant: 'soft' },
  render: (args) => (
    <Pill {...args} right={<Icon name="information-circle" />} />
  ),
};

export const WithBothIcons: Story = {
  args: { text: 'Upload', tone: 'primary', variant: 'outline' },
  render: (args) => (
    <Pill
      {...args}
      left={<Icon name="cloud-upload" />}
      right={<Icon name="chevron-forward" />}
    />
  ),
};

/* --- Tag preset ----------------------------------------------- */

export const TagDefault: Story = {
  args: { preset: 'tag', text: 'CRM', muted: false },
};

export const TagMuted: Story = {
  args: { preset: 'tag', text: 'internal', muted: true },
};

export const TagWithIcon: Story = {
  args: { preset: 'tag', text: 'Voice' },
  render: (args) => <Pill {...args} left={<Icon name="mic" />} />,
};

/* --- Interactive (toggle tone/variant) ------------------------ */

export const Toggleable: Story = {
  render: () => {
    const [solid, setSolid] = useState(false);
    return (
      <View style={{ gap: 12 }}>
        <Pill
          text={solid ? 'Solid / Primary' : 'Soft / Success'}
          tone={solid ? 'primary' : 'success'}
          variant={solid ? 'solid' : 'soft'}
          onPress={() => setSolid((s) => !s)}
          left={<Icon name={solid ? 'flash' : 'leaf'} />}
        />
        <Pill
          text="Outline / Danger"
          tone="danger"
          variant="outline"
          right={<Icon name="close" />}
        />
      </View>
    );
  },
};

/* --- Density grid (quick visual matrix) ----------------------- */

export const ToneVariantMatrix: Story = {
  render: () => {
    const tones: Array<'neutral' | 'success' | 'danger' | 'info' | 'primary'> =
      ['neutral', 'success', 'danger', 'info', 'primary'];
    const variants: Array<'soft' | 'solid' | 'outline'> = [
      'soft',
      'solid',
      'outline',
    ];
    return (
      <View style={{ gap: 12 }}>
        {variants.map((v) => (
          <View
            key={v}
            style={{ gap: 8, flexDirection: 'row', flexWrap: 'wrap' }}
          >
            {tones.map((t) => (
              <Pill key={`${v}-${t}`} text={`${t}/${v}`} tone={t} variant={v} />
            ))}
          </View>
        ))}
      </View>
    );
  },
};
