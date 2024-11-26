import { Meta, StoryObj } from '@storybook/angular';
import { UiTagComponent } from './tag.component';

const meta: Meta<UiTagComponent> = {
  title: 'Components/Tag',
  component: UiTagComponent,
  args: {
    type: 'red',
    size: 'md',
    label: 'Error',
    icon: 'faExclamationCircle',
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'red',
        'magenta',
        'purple',
        'blue',
        'cyan',
        'teal',
        'green',
        'gray',
        'cool-gray',
        'warm-gray',
        'high-contrast',
        'outline',
      ],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
  },
};
export default meta;

type Story = StoryObj<UiTagComponent>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: 'faCheck',
    label: 'Success',
    type: 'green',
  },
};
