import { Meta, StoryFn } from '@storybook/angular';
import { ButtonComponent } from './button.component';

export default {
  title: 'Components/Button',
  component: ButtonComponent,
} as Meta<ButtonComponent>;

const Template: StoryFn<ButtonComponent> = (args: ButtonComponent) => ({
  props: args,
});

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary Button',
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  label: 'Disabled Button',
  disabled: true,
};
