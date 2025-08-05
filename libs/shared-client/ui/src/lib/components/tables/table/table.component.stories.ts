// // ui-table.component.stories.ts

import { Meta, StoryObj } from '@storybook/angular';
import { UiTableComponent } from './table.component';

const meta: Meta<UiTableComponent> = {
  title: 'Components/Tables/Table with Overflow Menu',
  component: UiTableComponent,
  parameters: {
    controls: {
      include: [
        'showSelectionColumn',
        'striped',
        'isDataGrid',
        'sortable',
        'stickyHeader',
        'skeleton',
      ],
    },
  },
};

export default meta;

type Story = StoryObj<UiTableComponent>;

export const Default: Story = {
  args: {
    showSelectionColumn: false,
    striped: true,
    isDataGrid: false,
    sortable: true,
    stickyHeader: false,
    skeleton: false,
  },
};
