import { Meta, StoryObj } from '@storybook/angular';
import {
  UiNzInputComponent,
  UiNzInputSize,
  UiNzInputType,
} from './ui-nz-input.component';

type Story = StoryObj<UiNzInputComponent>;

const meta: Meta<UiNzInputComponent> = {
  title: 'NG-Zorro/Input',
  component: UiNzInputComponent,
  args: {
    label: 'Name',
    placeholder: 'Enter a value',
    description: '',
    value: '',
    disabled: false,
    size: 'default',
    type: 'text',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'default', 'small'] as UiNzInputSize[],
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number'] as UiNzInputType[],
    },
    valueChange: { action: 'valueChange' },
  },
};

export default meta;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-nz-input
        [label]="label"
        [placeholder]="placeholder"
        [description]="description"
        [value]="value"
        [disabled]="disabled"
        [size]="size"
        [type]="type"
        (valueChange)="valueChange($event)"
      ></ui-nz-input>
    `,
  }),
};

export const WithDescription: Story = {
  args: {
    description: 'We will use this name to identify your workspace.',
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: 'Disabled input',
    description: 'Field is locked until permissions are granted.',
  },
  render: Default.render,
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter a secure password',
  },
  render: Default.render,
};
