import { Meta, StoryObj } from '@storybook/angular';
import { UiNzCheckboxComponent } from './ui-nz-checkbox.component';

type Story = StoryObj<UiNzCheckboxComponent>;

const meta: Meta<UiNzCheckboxComponent> = {
  title: 'NG-Zorro/Checkbox',
  component: UiNzCheckboxComponent,
  args: {
    label: 'Receive launch updates',
    checked: false,
    disabled: false,
    indeterminate: false,
    autoFocus: false,
  },
  argTypes: {
    checkedChange: { action: 'checkedChange' },
  },
};

export default meta;

const renderTemplate = (args: Record<string, unknown>) => ({
  props: args,
  template: `
    <ui-nz-checkbox
      [label]="label"
      [checked]="checked"
      [disabled]="disabled"
      [indeterminate]="indeterminate"
      [autoFocus]="autoFocus"
      (checkedChange)="checkedChange($event)"
    ></ui-nz-checkbox>
  `,
});

export const Default: Story = {
  render: (args) => renderTemplate(args),
};

export const Indeterminate: Story = {
  args: {
    indeterminate: true,
  },
  render: (args) => renderTemplate(args),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    checked: true,
  },
  render: (args) => renderTemplate(args),
};
