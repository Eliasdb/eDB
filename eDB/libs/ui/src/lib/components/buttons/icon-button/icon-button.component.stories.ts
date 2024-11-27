import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UiIconComponent } from '../../icon/icon.component';
import { UiIconButtonComponent } from './icon-button.component';

const meta: Meta<UiIconButtonComponent> = {
  title: 'Components/Buttons/Icon Button',
  component: UiIconButtonComponent,
  decorators: [
    moduleMetadata({
      imports: [UiIconButtonComponent, UiIconComponent],
    }),
  ],
  args: {
    buttonId: 'icon-button',
    type: 'button',
    disabled: false,
    description: 'Icon button for actions',
    icon: 'faCopy',
    iconSize: '16px',
    iconColor: '#0072c3',
    showTooltipWhenDisabled: false,
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
    },
    icon: {
      control: 'text',
      description: 'FontAwesome icon name',
    },
    iconSize: {
      control: 'text',
      description: 'Size of the icon',
    },
    iconColor: {
      control: 'color',
      description: 'Color of the icon',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    showTooltipWhenDisabled: {
      control: 'boolean',
      description: 'Show tooltip even when button is disabled',
    },
    description: {
      control: 'text',
      description: 'ARIA label for accessibility',
    },
  },
};
export default meta;

type Story = StoryObj<UiIconButtonComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-icon-button
        [buttonId]="buttonId"
        [type]="type"
        [icon]="icon"
        [iconSize]="iconSize"
        [iconColor]="iconColor"
        [description]="description"
        [disabled]="disabled"
        [showTooltipWhenDisabled]="showTooltipWhenDisabled"
        (click)="onClick($event)"
      ></ui-icon-button>
    `,
  }),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    showTooltipWhenDisabled: true,
    description: 'Subscribe',
  },
};

export const CustomIcon: Story = {
  args: {
    icon: 'faTrash',
    iconColor: '#FFFFFF',
    description: 'Delete action',
  },
};
