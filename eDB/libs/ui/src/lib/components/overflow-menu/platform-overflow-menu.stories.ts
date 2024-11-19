import { Meta, StoryObj } from '@storybook/angular';
import { UiPlatformOverflowMenuComponent } from './overflow-menu.component';

const meta: Meta<UiPlatformOverflowMenuComponent> = {
  title: 'Components/Overflow Menu',
  component: UiPlatformOverflowMenuComponent,
  argTypes: {
    menuOptions: { control: 'object' }, // Interactive control for menu options
    placement: {
      control: 'radio',
      options: ['bottom', 'top'], // Allow selecting between 'bottom' and 'top'
    },
    flip: { control: 'boolean' }, // Toggle flipping of the menu
    offset: { control: 'object' }, // Adjust menu offset
    icon: { control: 'text' }, // Icon name
    iconSize: { control: 'text' }, // Icon size
    iconColor: { control: 'color' }, // Icon color picker
    menuOptionSelected: { action: 'menuOptionSelected' }, // Logs selected options
  },
};

export default meta;

type Story = StoryObj<UiPlatformOverflowMenuComponent>;

export const Default: Story = {
  args: {
    menuOptions: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'profile', label: 'Profile' },
      { id: 'logout', label: 'Logout' },
    ],
    placement: 'bottom',
    flip: true,
    offset: { x: 0, y: 7 },
    icon: 'faUser',
    iconSize: '1rem',
    iconColor: 'black',
  },
};

export const CustomOffset: Story = {
  args: {
    menuOptions: [
      { id: 'settings', label: 'Settings' },
      { id: 'help', label: 'Help' },
      { id: 'logout', label: 'Logout' },
    ],
    placement: 'top',
    flip: false,
    offset: { x: 10, y: 20 },
    icon: 'faCog',
    iconSize: '1.5rem',
    iconColor: 'blue',
  },
};

export const OnlyLogout: Story = {
  args: {
    menuOptions: [{ id: 'logout', label: 'Logout' }],
    placement: 'bottom',
    flip: true,
    offset: { x: 0, y: 7 },
    icon: 'faPowerOff',
    iconSize: '1.2rem',
    iconColor: 'red',
  },
};
