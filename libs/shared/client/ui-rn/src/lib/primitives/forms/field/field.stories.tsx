// apps/mobile/src/lib/ui/primitives/field.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from '../checkbox/checkbox';
import { Input } from '../input/input';
import Switch from '../switch/switch';
import { Field } from './field';

const meta: Meta<typeof Field> = {
  title: 'Primitives/Forms/Field',
  component: Field,
  args: {
    label: 'Label',
    helpText: '',
    errorText: '',
    className: '',
  },
  decorators: [
    (Story) => (
      <View style={{ padding: 20, gap: 20 }}>
        <Story />
      </View>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'A wrapper for form controls that provides label, help text, and error messaging. Use it around inputs, switches, checkboxes, etc.',
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: (args) => (
    <Field {...args} label="Username">
      <Input placeholder="Enter username" />
    </Field>
  ),
};

export const WithHelpText: Story = {
  render: (args) => (
    <Field {...args} label="Email" helpText="We’ll never share your email.">
      <Input placeholder="Enter email" keyboardType="email-address" />
    </Field>
  ),
};

export const WithError: Story = {
  render: (args) => (
    <Field
      {...args}
      label="Password"
      errorText="Password must be at least 8 characters"
    >
      <Input placeholder="Enter password" secureTextEntry />
    </Field>
  ),
};

export const WithSwitch: Story = {
  render: () => {
    const [enabled, setEnabled] = useState(false);
    return (
      <Field
        label="Enable notifications"
        helpText="Turn this on to receive alerts."
      >
        <Switch value={enabled} onValueChange={setEnabled} />
      </Field>
    );
  },
};

export const WithCheckbox: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Field label="Accept terms">
        <Checkbox checked={checked} onChange={setChecked} />
      </Field>
    );
  },
};

export const AllTogether: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <Field label="First name">
        <Input placeholder="John" />
      </Field>
      <Field label="Email" helpText="We’ll never share your email.">
        <Input placeholder="example@domain.com" keyboardType="email-address" />
      </Field>
      <Field label="Password" errorText="Too short">
        <Input placeholder="••••••" secureTextEntry />
      </Field>
      <Field label="Enable notifications">
        <Switch value />
      </Field>
    </View>
  ),
};
