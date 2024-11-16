import { Meta, StoryObj } from '@storybook/angular';
import { SelectComponent } from './select.component';

const meta: Meta<SelectComponent> = {
  title: 'UI/Select',
  component: SelectComponent,
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
    model: null,
    display: 'default',
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
    model: {
      control: 'object',
      description: 'The model for ngModel binding.',
    },
    display: {
      control: 'select',
      options: ['inline', 'default'],
      description: 'The display type of the select input.',
    },
  },
};

export default meta;

type Story = StoryObj<SelectComponent>;

// Default select
export const DefaultSelect: Story = {
  args: {
    label: 'Choose a category',
    model: null,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-select 
        [label]="label" 
        [helperText]="helperText"
        [invalidText]="invalidText" 
        [warnText]="warnText"
        [theme]="theme"
        [size]="size"
        [fluid]="fluid"
        [disabled]="disabled"
        [readonly]="readonly"
        [invalid]="invalid"
        [warn]="warn"
        [skeleton]="skeleton"
        [(ngModel)]="model"
        [display]="display">
        <option value="default" disabled selected hidden>Choose an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </ui-select>
    `,
  }),
};

// Disabled select
export const DisabledSelect: Story = {
  args: {
    label: 'Choose a category',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-select 
        [label]="label" 
        [helperText]="helperText"
        [invalidText]="invalidText" 
        [warnText]="warnText"
        [theme]="theme"
        [size]="size"
        [fluid]="fluid"
        [disabled]="disabled"
        [readonly]="readonly"
        [invalid]="invalid"
        [warn]="warn"
        [skeleton]="skeleton"
        [(ngModel)]="model"
        [display]="display">
        <option value="default" disabled selected hidden>Choose an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </ui-select>
    `,
  }),
};

// Invalid state select
export const InvalidSelect: Story = {
  args: {
    label: 'Choose a category',
    invalid: true,
    invalidText: 'This selection is invalid.',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-select 
        [label]="label" 
        [helperText]="helperText"
        [invalidText]="invalidText" 
        [warnText]="warnText"
        [theme]="theme"
        [size]="size"
        [fluid]="fluid"
        [disabled]="disabled"
        [readonly]="readonly"
        [invalid]="invalid"
        [warn]="warn"
        [skeleton]="skeleton"
        [(ngModel)]="model"
        [display]="display">
        <option value="default" disabled selected hidden>Choose an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </ui-select>
    `,
  }),
};

// With a warning state select
export const WarningSelect: Story = {
  args: {
    label: 'Choose a category',
    warn: true,
    warnText: 'Please note this option.',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-select 
        [label]="label" 
        [helperText]="helperText"
        [invalidText]="invalidText" 
        [warnText]="warnText"
        [theme]="theme"
        [size]="size"
        [fluid]="fluid"
        [disabled]="disabled"
        [readonly]="readonly"
        [invalid]="invalid"
        [warn]="warn"
        [skeleton]="skeleton"
        [(ngModel)]="model"
        [display]="display">
        <option value="default" disabled selected hidden>Choose an option</option>
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
        <option value="option3">Option 3</option>
      </ui-select>
    `,
  }),
};
