// apps/mobile/src/lib/ui/collapsible.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Collapsible } from './collapsible';

const meta: Meta<typeof Collapsible> = {
  title: 'Layout/Collapsible',
  component: Collapsible,
  args: {
    open: false,
    duration: 180,
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, maxWidth: 480 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Animated show/hide that measures its content once and animates height (useNativeDriver: false) and opacity.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Collapsible>;

const Paragraph = ({ children }: { children: React.ReactNode }) => (
  <Text style={{ fontSize: 14, lineHeight: 20, color: '#374151' }}>
    {children}
  </Text>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View
    style={{
      borderWidth: 1,
      borderColor: '#e5e7eb',
      borderRadius: 12,
      marginBottom: 12,
      overflow: 'hidden',
    }}
  >
    <View style={{ padding: 12, backgroundColor: '#f9fafb' }}>
      <Text style={{ fontWeight: '700', fontSize: 16 }}>{title}</Text>
    </View>
    <View style={{ padding: 12 }}>{children}</View>
  </View>
);

/* --- Simple states ------------------------------------------------------- */

export const Closed: Story = {
  args: { open: false },
  render: (args) => (
    <Section title="Closed">
      <Collapsible {...args}>
        <Paragraph>This should be hidden initially.</Paragraph>
      </Collapsible>
    </Section>
  ),
};

export const Open: Story = {
  args: { open: true },
  render: (args) => (
    <Section title="Open">
      <Collapsible {...args}>
        <Paragraph>Visible content with a short paragraph.</Paragraph>
      </Collapsible>
    </Section>
  ),
};

/* --- Interactive toggle -------------------------------------------------- */

const ToggleLiveRender = (args: Parameters<typeof Collapsible>[0]) => {
  const [open, setOpen] = useState(false);
  return (
    <Section title="Toggle">
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        activeOpacity={0.85}
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
          borderRadius: 10,
          backgroundColor: '#eef2ff',
          marginBottom: 10,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: '#3730a3', fontWeight: '600' }}>
          {open ? 'Hide' : 'Show'} details
        </Text>
      </TouchableOpacity>

      <Collapsible {...args} open={open}>
        <View style={{ gap: 8 }}>
          <Paragraph>
            This block expands and collapses. Height & opacity animate over{' '}
            {args.duration ?? 180}ms.
          </Paragraph>
          <Paragraph>
            Tip: The component measures once via{' '}
            <Text style={{ fontFamily: 'monospace' }}>onLayout</Text>. If your
            inner content size changes drastically later, close & re-open or
            mount a new instance to re-measure.
          </Paragraph>
        </View>
      </Collapsible>
    </Section>
  );
};

export const ToggleLive: Story = {
  render: (args) => <ToggleLiveRender {...args} />,
};

/* --- Accordion-like list ------------------------------------------------- */

const MultiSectionsAccordionRender = (args: Parameters<typeof Collapsible>[0]) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const rows = [
    { h: 'Overview', c: 'High-level summary of the entity.' },
    { h: 'Details', c: 'Fields, metadata and extended properties go here.' },
    { h: 'Activity', c: 'Recent actions, interactions and status changes.' },
  ];
  return (
    <View style={{ gap: 8 }}>
      {rows.map((r, i) => {
        const on = openIdx === i;
        return (
          <View
            key={r.h}
            style={{
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            <TouchableOpacity
              onPress={() => setOpenIdx((v) => (v === i ? null : i))}
              activeOpacity={0.9}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 14,
                backgroundColor: '#f9fafb',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontWeight: '700' }}>{r.h}</Text>
              <Text style={{ color: '#6b7280' }}>{on ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            <Collapsible {...args} open={on}>
              <View style={{ padding: 14 }}>
                <Paragraph>{r.c}</Paragraph>
              </View>
            </Collapsible>
          </View>
        );
      })}
    </View>
  );
};

export const MultiSectionsAccordion: Story = {
  render: (args) => <MultiSectionsAccordionRender {...args} />,
};

/* --- Long content (scroll inside) --------------------------------------- */

export const LongContent: Story = {
  args: { open: true, duration: 220 },
  render: (args) => (
    <Section title="Long content">
      <Collapsible {...args}>
        <View style={{ gap: 8 }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <Paragraph key={i}>
              Line {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit. Praesent commodo.
            </Paragraph>
          ))}
        </View>
      </Collapsible>
    </Section>
  ),
};
