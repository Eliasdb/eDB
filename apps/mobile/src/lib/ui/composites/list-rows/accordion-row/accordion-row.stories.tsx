// apps/mobile/src/lib/ui/composites/list-rows/accordion-row/accordion-row.stories.tsx
import type { Decorator, Meta, StoryObj } from '@storybook/react';
import { colorScheme } from 'nativewind';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import AccordionRow, { AccordionRowProps } from './accordion-row';

/* ---------- helper: force theme per-story ---------- */
function forceTheme(mode: 'light' | 'dark'): Decorator {
  return (Story) => {
    useEffect(() => {
      const prev = colorScheme.get();
      colorScheme.set(mode);
      return () => colorScheme.set(prev ?? 'light');
    }, []);

    // Paint canvas to match so screenshots look right
    const bg = mode === 'dark' ? '#0b0c0f' : 'white';
    return (
      <View style={{ flex: 1, padding: 16, backgroundColor: bg }}>
        <Story />
      </View>
    );
  };
}

const meta: Meta<typeof AccordionRow> = {
  title: 'Composites/List Rows/Accordion Row',
  component: AccordionRow,
  tags: ['autodocs'],
  args: {
    label: 'Settings',
    icon: 'settings-outline',
    border: true,
    borderPosition: 'bottom',
  },
  argTypes: {
    onToggle: { control: false },
  },
  // default wrapper (no forced theme)
  decorators: [
    (Story) => (
      <View style={{ padding: 16, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    notes: `# Here I can add some markdown

mmmmm

Put a full new line between each element.`,
    docs: {
      description: {
        component:
          'AccordionRow is a list row with an icon, label, and chevron indicator. Typically used inside panels or grouped lists with collapsible content.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof AccordionRow>;

export const Basic: Story = { args: { open: false } };
export const Open: Story = { args: { open: true } };

export const Interactive: Story = {
  render: (args: AccordionRowProps) => {
    const [open, setOpen] = React.useState(false);
    return (
      <AccordionRow
        {...args}
        open={open}
        onToggle={() => setOpen((v) => !v)}
        label={open ? 'Collapse' : 'Expand'}
      />
    );
  },
};

/* ---------- themed variants ---------- */
export const Light: Story = {
  args: { open: false },
  decorators: [forceTheme('light')],
};

export const Dark: Story = {
  args: { open: false },
  decorators: [forceTheme('dark')],
};
