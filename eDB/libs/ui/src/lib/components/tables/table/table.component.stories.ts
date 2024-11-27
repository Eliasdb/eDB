// ui-table.component.stories.ts

import { Meta, StoryObj } from '@storybook/angular';
import {
  TableHeaderItem,
  TableItem,
  TableModel,
} from 'carbon-components-angular/table';
import { UiTableComponent } from './table.component';

const meta: Meta<UiTableComponent> = {
  title: 'Components/Tables/Expandable Table',
  component: UiTableComponent,
};

export default meta;

type Story = StoryObj<UiTableComponent>;

const createExpandableTableModel = (): TableModel => {
  const model = new TableModel();

  model.header = [
    new TableHeaderItem({
      data: 'Main Column',
      metadata: { sortField: 'mainColumn' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: true,
      visible: true,
      title: 'Main Column',
    }),
    new TableHeaderItem({
      data: 'Additional Info',
      metadata: { sortField: 'additionalInfo' },
      sorted: false,
      ascending: true,
      descending: false,
      sortable: false,
      visible: true,
      title: 'Additional Info',
    }),
  ];

  model.data = [
    [
      new TableItem({ data: 'Name 1' }),
      new TableItem({
        data: { name: 'Lessy', link: '#' },
        template: null, // Add custom template here if needed
      }),
    ],

    [
      new TableItem({
        data: 'Name 3',
      }),
      new TableItem({ data: 'swer' }),
    ],
    [
      new TableItem({
        data: 'Name 3.1',
        expandedData: [
          [
            new TableItem({ data: 'More names', expandedData: 'No template' }),
            new TableItem({
              data: { name: 'Morey', link: '#' },
              // template: null, // Add custom template here if needed
            }),
          ],
          [
            new TableItem({ data: 'Core names', expandedData: 'No template' }),
            new TableItem({
              data: { name: 'Corey', link: '#' },
              // template: null, // Add custom template here if needed
            }),
          ],
        ],
        expandAsTable: true,
      }),
      new TableItem({ data: 'swer' }),
    ],
  ];

  model.pageLength = 5;
  model.totalDataLength = 15;

  return model;
};

export const Expandable: Story = {
  args: {
    title: 'Expandable Table',
    description: 'A table with expandable rows for additional information.',
    model: createExpandableTableModel(),
    sortable: true,
    showSelectionColumn: false,
    stickyHeader: false,
    isDataGrid: false,
    showPagination: false,
    skeleton: false,
  },
};
