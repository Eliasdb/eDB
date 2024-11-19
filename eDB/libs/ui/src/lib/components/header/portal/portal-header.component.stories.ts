import { Meta, StoryObj } from '@storybook/angular';
import { UiPortalHeaderComponent } from './portal-header.component';

export default {
  title: 'Components/Headers/Portal Header',
  component: UiPortalHeaderComponent,
  argTypes: {
    name: {
      control: 'text',
      description: 'Name displayed in the header.',
      defaultValue: 'eDB', // Default name
    },
    logo: {
      control: 'text',
      description: 'Name of the logo to display.',
      defaultValue: 'carbon', // Default logo name
    },
  },
} as Meta<UiPortalHeaderComponent>;

type Story = StoryObj<UiPortalHeaderComponent>;

export const Default: Story = {
  args: {
    name: 'eDB', // Default platform name
  },
};

export const CustomHeader: Story = {
  args: {
    name: 'My Platform', // Custom platform name
  },
};
