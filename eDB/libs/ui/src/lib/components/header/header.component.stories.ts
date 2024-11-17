import { Meta, StoryObj } from '@storybook/angular';
import { UiHeaderComponent } from './header.component';

const meta: Meta<UiHeaderComponent> = {
  title: 'UI/Header',
  component: UiHeaderComponent,
};

export default meta;

type Story = StoryObj<UiHeaderComponent>;

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
