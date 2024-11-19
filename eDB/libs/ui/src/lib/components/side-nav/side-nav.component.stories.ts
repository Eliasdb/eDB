import { Meta, StoryObj } from '@storybook/angular';
import { UiSidenavComponent } from './side-nav.component';

const meta: Meta<UiSidenavComponent> = {
  title: 'Components/Side Navigation',
  component: UiSidenavComponent,
  argTypes: {
    links: { control: 'object' }, // Allows interactive configuration of links
    linkClick: { action: 'linkClick' }, // Logs linkClick events in Storybook actions
  },
};

export default meta;

type Story = StoryObj<UiSidenavComponent>;

export const Default: Story = {
  args: {
    links: [
      { id: 'dashboard', label: 'Dashboard', active: true },
      { id: 'profile', label: 'Profile' },
      { id: 'settings', label: 'Settings' },
      { id: 'logout', label: 'Logout' },
    ],
  },
};

export const ActiveLink: Story = {
  args: {
    links: [
      { id: 'home', label: 'Home' },
      { id: 'about', label: 'About', active: true },
      { id: 'contact', label: 'Contact' },
    ],
  },
};

export const NoLinks: Story = {
  args: {
    links: [],
  },
};
