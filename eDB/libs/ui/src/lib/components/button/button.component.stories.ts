import { Meta, StoryObj } from '@storybook/angular';
import { UiButtonComponent } from './button.component';

const meta: Meta<UiButtonComponent> = {
  title: 'Components/Buttons',
  component: UiButtonComponent,
  args: {
    type: 'button',
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    icon: 'faCableCar', // Default icon name
    isExpressive: true,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: 'The type attribute of the button.',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description: 'The visual style of the button.',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', '2xl'],
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
    isExpressive: {
      control: 'boolean',
      description:
        'If set to true, the button will apply expressive styles, which generally provide a bolder visual style, including enhanced hover and focus states, and additional padding to increase the prominence of the button.',
    },
    buttonClick: {
      action: 'buttonClick',
      description: 'Event emitted when the button is clicked.',
    },
  },
};

export default meta;

type Story = StoryObj<UiButtonComponent>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [isExpressive]="isExpressive">Primary Button</ui-button>`,
  }),
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [size]="size" [isExpressive]="isExpressive">Secondary Button</ui-button>`,
  }),
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    icon: 'faExclamationTriangle',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [isExpressive]="isExpressive">Danger Button</ui-button>`,
  }),
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [variant]="variant" [isExpressive]="isExpressive">Ghost Button</ui-button>`,
  }),
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    icon: 'faPlus',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [isExpressive]="isExpressive">With Icon</ui-button>`,
  }),
};

export const LoadingState: Story = {
  render: (args) => ({
    template: `<ui-button [loading]="true" [size]="size" [isExpressive]="isExpressive">Loading Button</ui-button>`,
  }),
};

export const DisabledState: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    icon: 'faLock',
  },
  render: (args) => ({
    props: args,
    template: `<ui-button [type]="type" [variant]="variant" [size]="size" [disabled]="disabled" [loading]="loading" [icon]="icon" [isExpressive]="isExpressive">Disabled Button</ui-button>`,
  }),
};
