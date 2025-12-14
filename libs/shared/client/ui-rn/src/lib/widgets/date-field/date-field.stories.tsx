// apps/mobile/src/lib/ui/widgets/DateField.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { DateField } from './date-field';

const meta: Meta<typeof DateField> = {
  title: 'Widgets/DateField',
  component: DateField,
  args: { placeholder: 'YYYY-MM-DD' },
  argTypes: { onChange: { control: false } },
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 16, backgroundColor: 'transparent' }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Cross-platform date input. Web uses a hidden <input type='date'>; native shows the RN community date picker on tap.",
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof DateField>;

const EmptyRender = (args: Parameters<typeof DateField>[0]) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return <DateField {...args} value={value} onChange={setValue} />;
};

export const Empty: Story = {
  render: (args) => <EmptyRender {...args} />,
};

const WithValueRender = (args: Parameters<typeof DateField>[0]) => {
  const [value, setValue] = useState<string | undefined>('2025-10-15');
  return <DateField {...args} value={value} onChange={setValue} />;
};

export const WithValue: Story = {
  render: (args) => <WithValueRender {...args} />,
};

const WithMinMaxRender = (args: Parameters<typeof DateField>[0]) => {
  const [value, setValue] = useState<string | undefined>('2025-10-15');

  const { min, max } = useMemo(() => {
    const base = new Date(2025, 9, 15); // Oct (0-based)
    const min = new Date(base);
    min.setDate(min.getDate() - 7);
    const max = new Date(base);
    max.setDate(max.getDate() + 7);
    return { min, max };
  }, []);

  return (
    <DateField
      {...args}
      value={value}
      onChange={setValue}
      minimumDate={min}
      maximumDate={max}
    />
  );
};

export const WithMinMax: Story = {
  render: (args) => <WithMinMaxRender {...args} />,
};

const LabeledRender = (args: Parameters<typeof DateField>[0]) => {
  const [value, setValue] = useState<string | undefined>(undefined);
  return (
    <DateField {...args} label="Due date" value={value} onChange={setValue} />
  );
};

export const Labeled: Story = {
  render: (args) => <LabeledRender {...args} />,
};

const ClearableDemoRender = (args: Parameters<typeof DateField>[0]) => {
  const [value, setValue] = useState<string | undefined>('2025-12-01');

  return (
    <View style={{ gap: 12 }}>
      <DateField {...args} label="Pick a date" value={value} onChange={setValue} />

      {/* Small RN button to clear */}
      <TouchableOpacity
        onPress={() => setValue(undefined)}
        style={{
          alignSelf: 'flex-start',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.1)',
        }}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 12, opacity: 0.85 }}>Clear date</Text>
      </TouchableOpacity>
    </View>
  );
};

export const ClearableDemo: Story = {
  render: (args) => <ClearableDemoRender {...args} />,
};
