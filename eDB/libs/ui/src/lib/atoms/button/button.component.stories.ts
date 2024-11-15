import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'UI/Buttons/Button',
  component: ButtonComponent,
  args: {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
    icon: 'add', // Default icon name
    iconPosition: 'left',
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'The type attribute of the button.',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost', 'success'],
      description: 'The visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'The size of the button.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled.',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state.',
    },
    icon: {
      control: 'text',
      description: 'The name of the icon to render.',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'The position of the icon relative to the button text.',
    },
    buttonClick: {
      action: 'buttonClick',
      description: 'Event emitted when the button is clicked.',
    },
  },
};

export default meta;

type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    icon: 'faPlus',
    iconPosition: 'left',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [iconPosition]="iconPosition">Primary Button</ui-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    icon: 'faTrash',
    iconPosition: 'right',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [iconPosition]="iconPosition">Secondary Button</ui-button>`,
  }),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'medium',
    icon: 'faExclamationTriangle',
    iconPosition: 'left',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [iconPosition]="iconPosition">Danger Button</ui-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    size: 'medium',
    icon: 'faSearch',
    iconPosition: 'left',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [iconPosition]="iconPosition">Ghost Button</ui-button>`,
  }),
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    icon: 'faPlus',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" aria-label="Add"></ui-button>`,
  }),
};

export const WithoutIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'medium',
    icon: undefined,
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading">Button Without Icon</ui-button>`,
  }),
};
