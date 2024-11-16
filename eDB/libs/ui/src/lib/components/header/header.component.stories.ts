import { Meta, StoryObj } from '@storybook/angular';
import { HeaderComponent } from './header.component';

const meta: Meta<HeaderComponent> = {
  title: 'UI/Header',
  component: HeaderComponent,
};

export default meta;

type Story = StoryObj<HeaderComponent>;

// Default Story for Light Theme
export const LightTheme: Story = {
  render: () => ({
    template: `<ui-header></ui-header>`,
  }),
};

// Dark Theme Story
export const DarkTheme: Story = {
  render: () => ({
    template: `<ui-header></ui-header>`,
  }),
};
