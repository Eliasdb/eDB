import { Meta, StoryObj } from '@storybook/angular';
import { ButtonComponent } from './button.component';

const meta: Meta<ButtonComponent> = {
  title: 'UI/Button',
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
      options: ['primary', 'secondary', 'danger', 'ghost'],
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
    icon: 'add',
    iconPosition: 'left',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    icon: 'delete',
    iconPosition: 'right',
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    loading: true,
    icon: 'add',
    iconPosition: 'left',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'danger',
    size: 'medium',
    disabled: true,
    icon: 'delete',
    iconPosition: 'right',
  },
};

export const WithoutIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'small',
    icon: undefined,
  },
};
