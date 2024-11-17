import { Meta, StoryObj } from '@storybook/angular';
import { UiPlatformHeaderComponent } from '../platform/platform-header.component';

const meta: Meta<UiPlatformHeaderComponent> = {
  title: 'UI/Header/PlatformHeader',
  component: UiPlatformHeaderComponent,
};

export default meta;

type Story = StoryObj<UiPlatformHeaderComponent>;

// Default Story for Light Theme
export const LightTheme: Story = {
  render: () => ({
    template: `<ui-platform-header></ui-platform-header>`,
  }),
};

// Dark Theme Story
export const DarkTheme: Story = {
  render: () => ({
    template: `<ui-platform-header></ui-platform-header>`,
  }),
};
