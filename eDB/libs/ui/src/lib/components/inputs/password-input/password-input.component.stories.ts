import { Meta, StoryObj } from '@storybook/angular';
import { UiPasswordInputComponent } from './password-input.component';

const meta: Meta<UiPasswordInputComponent> = {
  title: 'UI/Inputs/PasswordInput',
  component: UiPasswordInputComponent,
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    value: '',
    disabled: false,
    invalid: false,
    helperText: 'Your password must be at least 8 characters.',
    invalidText: 'Password is required.',
    warn: false,
    warnText: 'Weak password.',
    skeleton: false,
    size: 'md',
    theme: 'light',
    readonly: false,
    autocomplete: 'off',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the password input field.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the password input.',
    },
    value: {
      control: 'text',
      description: 'Value of the password input.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the input is invalid.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below the input.',
    },
    invalidText: {
      control: 'text',
      description: 'Text shown when the input is invalid.',
    },
    warn: {
      control: 'boolean',
      description: 'Whether the input shows a warning.',
    },
    warnText: {
      control: 'text',
      description: 'Text shown when there is a warning.',
    },
    skeleton: {
      control: 'boolean',
      description: 'Whether to display a skeleton loader.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input.',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme of the input.',
    },

    readonly: {
      control: 'boolean',
      description: 'Whether the input is read-only.',
    },
    autocomplete: {
      control: 'text',
      description: 'Autocomplete setting for the input.',
    },
  },
};

export default meta;

type Story = StoryObj<UiPasswordInputComponent>;

export const Default: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    value: '',
    disabled: false,
    invalid: false,
    helperText: 'Your password must be at least 8 characters.',
    invalidText: 'Password is required.',
  },
  render: (args) => ({
    props: args,
    template: `<ui-password-input [label]="label" [placeholder]="placeholder" [value]="value" [disabled]="disabled" [invalid]="invalid" [helperText]="helperText" [invalidText]="invalidText"></ui-password-input>`,
  }),
};

export const Disabled: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `<ui-password-input [label]="label" [placeholder]="placeholder" [disabled]="disabled"></ui-password-input>`,
  }),
};

export const Invalid: Story = {
  args: {
    label: 'Password',
    placeholder: 'Enter your password',
    invalid: true,
    invalidText: 'Password is required.',
  },
  render: (args) => ({
    props: args,
    template: `<ui-password-input [label]="label" [placeholder]="placeholder" [invalid]="invalid" [invalidText]="invalidText"></ui-password-input>`,
  }),
};

export const Skeleton: Story = {
  args: {
    label: 'Password',
    skeleton: true,
  },
  render: (args) => ({
    props: args,
    template: `<ui-password-input [label]="label" [skeleton]="skeleton"></ui-password-input>`,
  }),
};
