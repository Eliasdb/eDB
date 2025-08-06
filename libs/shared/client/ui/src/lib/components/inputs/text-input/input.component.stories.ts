import { Meta, StoryObj } from '@storybook/angular';
import { UiTextInputComponent } from './input.component';

const meta: Meta<UiTextInputComponent> = {
  title: 'Components/Inputs/Text Input',
  component: UiTextInputComponent,
  args: {
    label: 'Input Label',
    placeholder: 'Enter text...',
    value: '',
    disabled: false,
    invalid: false,
    helperText: 'Helper text here.',
    invalidText: 'This field is required.',
    warn: false,
    warnText: 'Warning text.',
    skeleton: false,
    size: 'md',
    theme: 'dark',
    readonly: false,
    autocomplete: 'on',
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the input field.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text in the input field.',
    },
    value: {
      control: 'text',
      description: 'The value of the input field.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the input is in an invalid state.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the input.',
    },
    invalidText: {
      control: 'text',
      description: 'Error text shown when the input is invalid.',
    },
    warn: {
      control: 'boolean',
      description: 'Whether the input has a warning state.',
    },
    warnText: {
      control: 'text',
      description: 'Text to be displayed for warning.',
    },
    skeleton: {
      control: 'boolean',
      description: 'Whether to show the skeleton loader.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the input field.',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme of the input field.',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the input is read-only.',
    },
    autocomplete: {
      control: 'text',
      description: 'Autocomplete attribute of the input.',
    },
  },
};

export default meta;

type Story = StoryObj<UiTextInputComponent>;

// Default Input
export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter some text...',
    value: '',
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
};

// Invalid Input
export const Invalid: Story = {
  args: {
    label: 'Invalid Input',
    placeholder: 'Enter text...',
    invalid: true,
    invalidText: 'This field is required.',
  },
};

// Input with Helper Text
export const WithHelperText: Story = {
  args: {
    label: 'Input with Helper Text',
    placeholder: 'Enter text...',
    helperText: 'This is some helpful information.',
  },
};

// Input with Warning State
export const WithWarning: Story = {
  args: {
    label: 'Input with Warning',
    placeholder: 'Enter text...',
    warn: true,
    warnText: 'Warning: Check this input.',
  },
};

// Input with Skeleton Loader
export const SkeletonLoader: Story = {
  args: {
    label: 'Loading Input',
    placeholder: 'Please wait...',
    skeleton: true,
  },
};

// Small Input
export const SmallInput: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size input...',
    size: 'sm',
  },
};

// Large Input
export const LargeInput: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size input...',
    size: 'lg',
  },
};

// Read-only Input
export const ReadOnly: Story = {
  args: {
    label: 'Read-only Input',
    placeholder: 'This input is read-only',
    readonly: true,
  },
};

// Dark Themed Input
export const DarkTheme: Story = {
  args: {
    label: 'Dark Themed Input',
    placeholder: 'Dark theme input...',
    theme: 'dark',
  },
};
