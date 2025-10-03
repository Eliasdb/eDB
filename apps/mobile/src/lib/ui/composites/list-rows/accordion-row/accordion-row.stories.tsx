import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import AccordionRow, { AccordionRowProps } from './accordion-row';

const meta: Meta<typeof AccordionRow> = {
  title: 'Composites/List Rows/Accordion Row',
  component: AccordionRow,
  args: {
    label: 'Settings',
    icon: 'settings-outline',
    border: true,
    borderPosition: 'bottom',
  },
  argTypes: {
    onToggle: { control: false },
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: 'white', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
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

export const Basic: Story = {
  args: {
    open: false,
  },
};

export const Open: Story = {
  args: {
    open: true,
  },
};

export const Interactive: Story = {
  render: (args: AccordionRowProps) => {
    const [open, setOpen] = useState(false);
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
