import { Meta, StoryObj } from '@storybook/angular';
import { UiTitleComponent } from './title.component';

const meta: Meta<UiTitleComponent> = {
  title: 'Ui/Title',
  component: UiTitleComponent,
  argTypes: {
    text: { control: 'text' }, // Enables a text control in Storybook
  },
};

export default meta;

type Story = StoryObj<UiTitleComponent>;

export const Default: Story = {
  args: {
    text: 'Hello World',
  },
};

export const CustomTitle: Story = {
  args: {
    text: 'Custom Title Text',
  },
};

export const LongTitle: Story = {
  args: {
    text: 'This is a very long title text to demonstrate how the component handles longer strings.',
  },
};
