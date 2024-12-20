import { Meta, StoryObj } from '@storybook/angular';
import { UiSelectComponent } from './select.component';

const meta: Meta<UiSelectComponent> = {
  title: 'Components/Inputs/Select',
  component: UiSelectComponent,
  args: {
    label: 'Choose an option',
    helperText: 'Please select an option from the dropdown.',
    invalidText: 'This field is required.',
    warnText: 'This is a warning message.',
    theme: 'light',
    size: 'md',
    disabled: false,
    readonly: false,
    invalid: false,
    warn: false,
    skeleton: false,
    display: 'default',
    placeholder: 'Choose an option',
    options: [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
      {
        label: 'Group 1',
        group: true,
        options: [
          { value: 'suboption1', label: 'Sub Option 1' },
          { value: 'suboption2', label: 'Sub Option 2' },
        ],
      },
    ],
    model: 'option1',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the select input.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text for the select input.',
    },
    invalidText: {
      control: 'text',
      description: 'Text to show when the select input is invalid.',
    },
    warnText: {
      control: 'text',
      description: 'Text to show when the select input has a warning.',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'The theme of the select input.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the select input.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the select input is disabled.',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the select input is readonly.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the select input is in an invalid state.',
    },
    warn: {
      control: 'boolean',
      description: 'Whether the select input has a warning state.',
    },
    skeleton: {
      control: 'boolean',
      description: 'Whether to show a skeleton loader for the select input.',
    },
    display: {
      control: 'select',
      options: ['inline', 'default'],
      description: 'The display type of the select input.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the select input.',
    },
    options: {
      control: 'object',
      description: 'Array of options or option groups to display.',
    },
    model: {
      control: 'text',
      description: 'The selected value of the select input.',
    },
  },
};

export default meta;

type Story = StoryObj<UiSelectComponent>;

export const DefaultSelect: Story = {
  args: {
    label: 'Choose a category',
  },
};

export const DisabledSelect: Story = {
  args: {
    label: 'Choose a category',
    disabled: true,
  },
};

export const InvalidSelect: Story = {
  args: {
    label: 'Choose a category',
    invalid: true,
    invalidText: 'This selection is invalid.',
  },
};

export const WarningSelect: Story = {
  args: {
    label: 'Choose a category',
    warn: true,
    warnText: 'Please note this option.',
  },
};
