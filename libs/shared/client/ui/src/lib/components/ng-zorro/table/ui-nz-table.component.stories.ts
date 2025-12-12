// ui-nz-table.stories.ts
import { Meta, StoryObj } from '@storybook/angular';
import { NzTableSize } from 'ng-zorro-antd/table';
import { UiNzTableColumn, UiNzTableComponent } from './ui-nz-table.component';

interface ExampleRow extends Record<string, unknown> {
  name: string;
  role: string;
  location: string;
  budget: number;
}

type Story = StoryObj<UiNzTableComponent<ExampleRow>>;

const COLUMNS: UiNzTableColumn<ExampleRow>[] = [
  { key: 'name', title: 'Name' },
  { key: 'role', title: 'Role' },
  { key: 'location', title: 'Location' },
  {
    key: 'budget',
    title: 'Budget',
    align: 'right',
    render: (row) => `$${row.budget.toLocaleString()}`,
  },
];

const DATA: ExampleRow[] = [
  {
    name: 'Aurora Labs',
    role: 'Implementation',
    location: 'Berlin',
    budget: 120000,
  },
  {
    name: 'Cedar & Co.',
    role: 'Pilot Partner',
    location: 'Austin',
    budget: 85000,
  },
  { name: 'Northwind', role: 'Operations', location: 'Toronto', budget: 99000 },
];

const meta: Meta<UiNzTableComponent<ExampleRow>> = {
  title: 'NG-Zorro/Table',
  component: UiNzTableComponent,
  args: {
    columns: COLUMNS,
    data: DATA,
    bordered: false,
    size: 'default' as NzTableSize, // 'small' | 'middle' | 'default'
    scrollX: null,
    showPagination: false,
    emptyState: 'No projects available',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'middle', 'default'] as NzTableSize[],
    },
  },
};

export default meta;

const renderTemplate = (args: Record<string, unknown>) => ({
  props: args,
  template: `
    <ui-nz-table
      [columns]="columns"
      [data]="data"
      [bordered]="bordered"
      [size]="size"
      [scrollX]="scrollX"
      [showPagination]="showPagination"
      [emptyState]="emptyState"
    ></ui-nz-table>
  `,
});

export const Default: Story = {
  render: (args) => renderTemplate(args),
};

export const Bordered: Story = {
  args: { bordered: true },
  render: (args) => renderTemplate(args),
};

export const Scrollable: Story = {
  args: { scrollX: '720px' },
  render: (args) => renderTemplate(args),
};

export const Empty: Story = {
  args: { data: [] },
  render: (args) => renderTemplate(args),
};
