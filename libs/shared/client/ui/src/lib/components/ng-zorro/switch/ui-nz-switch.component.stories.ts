import { Meta, StoryObj } from '@storybook/angular';
import {
  UiNzSwitchComponent,
  UiNzSwitchSize,
} from './ui-nz-switch.component';

type Story = StoryObj<UiNzSwitchComponent>;

const meta: Meta<UiNzSwitchComponent> = {
  title: 'NG-Zorro/Switch',
  component: UiNzSwitchComponent,
  args: {
    label: 'Enable automation',
    checked: false,
    disabled: false,
    loading: false,
    size: 'default',
    checkedLabel: 'On',
    uncheckedLabel: 'Off',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'small'] as UiNzSwitchSize[],
    },
    checkedChange: { action: 'checkedChange' },
  },
};

export default meta;

const renderTemplate = (args: Record<string, unknown>) => ({
  props: args,
  template: `
    <ui-nz-switch
      [label]="label"
      [checked]="checked"
      [disabled]="disabled"
      [loading]="loading"
      [size]="size"
      [checkedLabel]="checkedLabel"
      [uncheckedLabel]="uncheckedLabel"
      (checkedChange)="checkedChange($event)"
    ></ui-nz-switch>
  `,
});

export const Default: Story = {
  render: (args) => renderTemplate(args),
};

export const Loading: Story = {
  args: {
    loading: true,
    checked: true,
  },
  render: (args) => renderTemplate(args),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: false,
  },
  render: (args) => renderTemplate(args),
};
