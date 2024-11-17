import { Meta, StoryObj } from '@storybook/angular';
import { UiLoadingSpinnerComponent } from './loading-spinner.component';

const meta: Meta<UiLoadingSpinnerComponent> = {
  title: 'UI/Loading spinner',
  component: UiLoadingSpinnerComponent,
  args: {
    isActive: true,
    size: 'normal',
    overlay: false,
  },
  argTypes: {
    isActive: {
      control: 'boolean',
      description: 'Controls the visibility of the spinner.',
    },
    size: {
      control: 'select',
      options: ['normal', 'sm'],
      description: 'Sets the size of the spinner.',
    },
    overlay: {
      control: 'boolean',
      description: 'Determines if the spinner has an overlay.',
    },
  },
};

export default meta;

type Story = StoryObj<UiLoadingSpinnerComponent>;

export const Loading: Story = {
  args: {
    isActive: true,
    size: 'normal',
    overlay: false,
  },
};

export const SmallSize: Story = {
  args: {
    isActive: true,
    size: 'sm',
    overlay: false,
  },
};

export const WithOverlay: Story = {
  args: {
    isActive: true,
    size: 'normal',
    overlay: true,
  },
};
