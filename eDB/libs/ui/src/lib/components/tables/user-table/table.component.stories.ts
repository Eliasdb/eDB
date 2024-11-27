// ui-table.component.stories.ts

import { Meta, StoryObj } from '@storybook/angular';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular/table';
import { UiTableComponent } from './table.component';

const meta: Meta<UiTableComponent> = {
  title: 'Components/Tables/Table',
  component: UiTableComponent,
};

export default meta;

type Story = StoryObj<UiTableComponent>;

const createTableModel = (): TableModel => {
  const model = new TableModel();

  model.header = [
    new TableHeaderItem({
      data: 'ID',
      metadata: { sortField: 'id' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: true,
      visible: true,
      title: 'ID Column',
    }),
    new TableHeaderItem({
      data: 'Name',
      metadata: { sortField: 'name' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: true,
      visible: true,
      title: 'Name Column',
    }),
    new TableHeaderItem({
      data: 'Email',
      metadata: { sortField: 'email' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: true,
      visible: true,
      title: 'Email Column',
    }),
    new TableHeaderItem({
      data: 'Role',
      metadata: { sortField: 'role' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: true,
      visible: true,
      title: 'Role Column',
    }),
    new TableHeaderItem({
      data: 'State/Province',
      metadata: { sortField: 'state' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: true,
      visible: true,
      title: 'State/Province Column',
    }),
  ];

  model.data = [
    [
      new TableItem({ data: 1 }),
      new TableItem({ data: 'John Doe' }),
      new TableItem({ data: 'john.doe@example.com' }),
      new TableItem({ data: 'Admin' }),
      new TableItem({ data: 'California' }),
    ],
    [
      new TableItem({ data: 2 }),
      new TableItem({ data: 'Jane Smith' }),
      new TableItem({ data: 'jane.smith@example.com' }),
      new TableItem({ data: 'User' }),
      new TableItem({ data: 'New York' }),
    ],
    [
      new TableItem({ data: 3 }),
      new TableItem({ data: 'Alice Brown' }),
      new TableItem({ data: 'alice.brown@example.com' }),
      new TableItem({ data: 'PremiumUser' }),
      new TableItem({ data: 'Texas' }),
    ],
  ];

  model.pageLength = 5;
  model.totalDataLength = 15;

  return model;
};

export const Default: Story = {
  args: {
    title: 'User Table',
    description: 'A table of users with sorting and pagination.',
    model: createTableModel(),
    sortable: true,
    showSelectionColumn: false,
    stickyHeader: false,
    isDataGrid: false,
    showPagination: true,
    skeleton: false,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    skeleton: true,
  },
};

export const WithoutPagination: Story = {
  args: {
    ...Default.args,
    showPagination: false,
  },
};

export const WithRowSelection: Story = {
  args: {
    ...Default.args,
    showSelectionColumn: true,
  },
};
