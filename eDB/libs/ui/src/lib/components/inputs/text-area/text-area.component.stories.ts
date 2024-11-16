import { Meta, StoryObj } from '@storybook/angular';
import { TextAreaComponent } from './text-area.component';

const meta: Meta<TextAreaComponent> = {
  title: 'UI/Inputs/Textarea',
  component: TextAreaComponent,
  args: {
    label: 'Default Label',
    placeholder: 'Enter text...',
    value: '',
    disabled: false,
    invalid: false,
    helperText: 'This is a helper text.',
    invalidText: 'This field is required.',
    warn: false,
    warnText: 'This is a warning.',
    skeleton: false,
    size: 'md',
    theme: 'light',
    readonly: false,
    autocomplete: 'off',
    rows: 4,
    cols: 50,
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'The label for the textarea.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the textarea.',
    },
    value: {
      control: 'text',
      description: 'Value of the textarea.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the textarea is disabled.',
    },
    invalid: {
      control: 'boolean',
      description: 'Whether the textarea is in an invalid state.',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below the textarea.',
    },
    invalidText: {
      control: 'text',
      description: 'Text to be displayed when the textarea is invalid.',
    },
    warn: {
      control: 'boolean',
      description: 'Whether the textarea has a warning state.',
    },
    warnText: {
      control: 'text',
      description: 'Warning text displayed below the textarea.',
    },
    skeleton: {
      control: 'boolean',
      description: 'Whether to show a skeleton loader.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the textarea.',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme of the textarea.',
    },
    readonly: {
      control: 'boolean',
      description: 'Whether the textarea is read-only.',
    },
    autocomplete: {
      control: 'text',
      description: 'Autocomplete attribute for the textarea.',
    },
    rows: {
      control: 'number',
      description: 'Number of rows for the textarea.',
    },
    cols: {
      control: 'number',
      description: 'Number of columns for the textarea.',
    },
  },
};

export default meta;

type Story = StoryObj<TextAreaComponent>;

// Basic Textarea
export const BasicTextarea: Story = {
  args: {
    label: 'Basic Textarea',
    placeholder: 'Enter text here...',
    value: '',
    disabled: false,
    invalid: false,
    helperText: 'This is a helper text.',
    invalidText: 'This field is required.',
  },
  render: (args) => ({
    props: args,
    template: `<ui-textarea 
                [label]="label"
                [placeholder]="placeholder"
                [value]="value"
                [disabled]="disabled"
                [invalid]="invalid"
                [helperText]="helperText"
                [invalidText]="invalidText">
              </ui-textarea>`,
  }),
};

// Disabled Textarea
export const DisabledTextarea: Story = {
  args: {
    label: 'Disabled Textarea',
    placeholder: 'Cannot edit this textarea...',
    disabled: true,
    value: 'This is disabled.',
    helperText: 'You cannot edit this field.',
  },
  render: (args) => ({
    props: args,
    template: `<ui-textarea 
                [label]="label"
                [placeholder]="placeholder"
                [value]="value"
                [disabled]="disabled"
                [helperText]="helperText">
              </ui-textarea>`,
  }),
};

// Invalid Textarea
export const InvalidTextarea: Story = {
  args: {
    label: 'Invalid Textarea',
    placeholder: 'Please provide a valid input.',
    invalid: true,
    invalidText: 'This field is required.',
  },
  render: (args) => ({
    props: args,
    template: `<ui-textarea 
                [label]="label"
                [placeholder]="placeholder"
                [invalid]="invalid"
                [invalidText]="invalidText">
              </ui-textarea>`,
  }),
};

// Warn Textarea
export const WarnTextarea: Story = {
  args: {
    label: 'Warning Textarea',
    placeholder: 'This field has a warning.',
    warn: true,
    warnText: 'Please double-check your input.',
  },
  render: (args) => ({
    props: args,
    template: `<ui-textarea 
                [label]="label"
                [placeholder]="placeholder"
                [warn]="warn"
                [warnText]="warnText">
              </ui-textarea>`,
  }),
};

// Skeleton Loader Textarea
export const SkeletonTextarea: Story = {
  args: {
    label: 'Loading...',
    skeleton: true,
  },
  render: (args) => ({
    props: args,
    template: `<ui-textarea 
                [label]="label"
                [skeleton]="skeleton">
              </ui-textarea>`,
  }),
};
