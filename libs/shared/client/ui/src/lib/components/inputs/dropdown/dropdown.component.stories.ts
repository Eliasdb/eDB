import { Meta, StoryObj } from '@storybook/angular';
import { UiDropdownComponent } from './dropdown.component';

const meta: Meta<UiDropdownComponent> = {
  title: 'Components/Dropdown/Carbon Dropdown',
  component: UiDropdownComponent,
  args: {
    label: 'Dropdown',
    hideLabel: false,
    skeleton: false,
    helperText: 'Optional helper text',
    size: 'md',
    dropUp: false,
    invalid: false,
    invalidText: 'Invalid selection',
    warn: false,
    warnText: 'Warning: Check your selection',
    theme: 'light',
    disabled: false,
    readonly: false,
    fluid: false,
    items: [
      { content: 'Option 1', selected: false },
      { content: 'Option 2', selected: false },
      { content: 'Option 3', selected: false },
    ],
  },
  argTypes: {
    label: {
      control: 'text',
      description: 'Label for the dropdown component.',
    },
    hideLabel: {
      control: 'boolean',
      description: 'Determines whether the label is visually hidden.',
    },
    skeleton: {
      control: 'boolean',
      description: 'Displays a skeleton loading state for the dropdown.',
    },
    helperText: {
      control: 'text',
      description: 'Optional helper text displayed below the dropdown.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the size of the dropdown.',
    },
    dropUp: {
      control: 'boolean',
      description: 'Determines if the dropdown menu should open upward.',
    },
    invalid: {
      control: 'boolean',
      description: 'Sets the error state of the dropdown.',
    },
    invalidText: {
      control: 'text',
      description: 'Text shown when the dropdown is invalid.',
    },
    warn: {
      control: 'boolean',
      description: 'Sets the warning state of the dropdown.',
    },
    warnText: {
      control: 'text',
      description: 'Text shown when the dropdown has a warning.',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'The theme of the dropdown.',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the dropdown when true.',
    },
    readonly: {
      control: 'boolean',
      description: 'Makes the dropdown read-only when true.',
    },
    fluid: {
      control: 'boolean',
      description:
        'If true, the dropdown will take up the full width of its container.',
    },
    items: {
      control: 'object',
      description:
        'The list of items for the dropdown. Each item should have `content` and `selected` properties.',
    },
  },
};

export default meta;
type Story = StoryObj<UiDropdownComponent>;

export const Default: Story = {
  args: {
    label: 'Dropdown',
    hideLabel: false,
    skeleton: false,
    helperText: 'Optional helper text',
    size: 'md',
    dropUp: false,
    invalid: false,
    invalidText: 'Invalid selection',
    warn: false,
    warnText: 'Warning: Check your selection',
    theme: 'light',
    disabled: false,
    readonly: false,
    fluid: false,
    items: [
      { content: 'Option 1', selected: false },
      { content: 'Option 2', selected: false },
      { content: 'Option 3', selected: false },
    ],
  },
  render: (args) => ({
    props: args,
    template: `
      <app-carbon-dropdown
        [label]="label"
        [hideLabel]="hideLabel"
        [skeleton]="skeleton"
        [helperText]="helperText"
        [size]="size"
        [dropUp]="dropUp"
        [invalid]="invalid"
        [invalidText]="invalidText"
        [warn]="warn"
        [warnText]="warnText"
        [theme]="theme"
        [disabled]="disabled"
        [readonly]="readonly"
        [fluid]="fluid"
        [items]="items"
      ></app-carbon-dropdown>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    label: 'Dropdown',
    disabled: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-dropdown
        [label]="label"
        [disabled]="disabled"
      ></ui-dropdown>
    `,
  }),
};

export const Invalid: Story = {
  args: {
    label: 'Dropdown',
    invalid: true,
    invalidText: 'Invalid selection',
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-dropdown
        [label]="label"
        [invalid]="invalid"
        [invalidText]="invalidText"
      ></ui-dropdown>
    `,
  }),
};

export const Skeleton: Story = {
  args: {
    label: 'Dropdown',
    skeleton: true,
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-dropdown
        [label]="label"
        [skeleton]="skeleton"
      ></ui-dropdown>
    `,
  }),
};
