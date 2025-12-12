import { Meta, StoryObj } from '@storybook/angular';
import {
  UiNzDatePickerComponent,
  UiNzDatePickerSize,
} from './ui-nz-date-picker.component';

type Story = StoryObj<UiNzDatePickerComponent>;

const meta: Meta<UiNzDatePickerComponent> = {
  title: 'NG-Zorro/Date Picker',
  component: UiNzDatePickerComponent,
  args: {
    value: null,
    placeholder: 'Select date',
    disabled: false,
    allowClear: true,
    showTime: false,
    size: 'default',
    format: 'yyyy-MM-dd',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'default', 'small'] as UiNzDatePickerSize[],
    },
    valueChange: { action: 'valueChange' },
  },
};

export default meta;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-nz-date-picker
        [value]="value"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [allowClear]="allowClear"
        [showTime]="showTime"
        [size]="size"
        [format]="format"
        (valueChange)="valueChange($event)"
      ></ui-nz-date-picker>
    `,
  }),
};

export const PresetValue: Story = {
  args: {
    value: new Date('2025-01-15T00:00:00'),
  },
  render: Default.render,
};

export const WithTime: Story = {
  args: {
    showTime: true,
    format: 'yyyy-MM-dd HH:mm',
  },
  render: Default.render,
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: new Date('2024-07-01T00:00:00'),
  },
  render: Default.render,
};
