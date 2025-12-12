// ui-nz-select.stories.ts
import { Meta, StoryObj } from '@storybook/angular';
import {
  UiNzSelectComponent,
  UiNzSelectGroup,
  UiNzSelectMode,
  UiNzSelectOption,
  UiNzSelectSize,
  UiNzSelectValue,
} from './ui-nz-select.component';

type Story = StoryObj<UiNzSelectComponent>;

const BASE_OPTIONS: UiNzSelectOption[] = [
  { label: 'Alpha', value: 'alpha' },
  { label: 'Bravo', value: 'bravo' },
  { label: 'Charlie', value: 'charlie' },
];

// Optional: strongly-typed grouped options
const GROUPED_OPTIONS: UiNzSelectGroup[] = [
  {
    label: 'Team A',
    options: [
      { label: 'Alice', value: 'alice' },
      { label: 'Aaron', value: 'aaron' },
    ],
  },
  {
    label: 'Team B',
    options: [
      { label: 'Bella', value: 'bella' },
      { label: 'Ben', value: 'ben' },
    ],
  },
];

const meta: Meta<UiNzSelectComponent> = {
  title: 'NG-Zorro/Select',
  component: UiNzSelectComponent,
  args: {
    placeholder: 'Select value',
    disabled: false,
    allowClear: true,
    showSearch: false,
    size: 'default' as UiNzSelectSize,
    mode: 'default' as UiNzSelectMode,
    options: BASE_OPTIONS, // UiNzSelectOption[]
    value: null as UiNzSelectValue,
    maxTagCount: undefined,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['large', 'default', 'small'] as UiNzSelectSize[],
    },
    mode: {
      control: 'select',
      options: ['default', 'multiple', 'tags'] as UiNzSelectMode[],
    },
    valueChange: { action: 'valueChange' },
  },
};

export default meta;

const renderTemplate = (templateArgs: Record<string, unknown>) => ({
  props: templateArgs,
  template: `
    <ui-nz-select
      [placeholder]="placeholder"
      [disabled]="disabled"
      [allowClear]="allowClear"
      [showSearch]="showSearch"
      [size]="size"
      [mode]="mode"
      [options]="options"
      [value]="value"
      [maxTagCount]="maxTagCount"
      (valueChange)="valueChange($event)"
    ></ui-nz-select>
  `,
});

export const Default: Story = { render: (a) => renderTemplate(a) };

export const Searchable: Story = {
  args: { showSearch: true },
  render: (a) => renderTemplate(a),
};

export const Multiple: Story = {
  args: {
    mode: 'multiple' as UiNzSelectMode,
    value: ['alpha', 'charlie'] as UiNzSelectValue,
    maxTagCount: 2,
  },
  render: (a) => renderTemplate(a),
};

export const Grouped: Story = {
  args: {
    // Use the group type (or a union) instead of UiNzSelectOption[]
    options: GROUPED_OPTIONS as Array<UiNzSelectOption | UiNzSelectGroup>,
  },
  render: (a) => renderTemplate(a),
};
