// ui-table.component.stories.ts

import { Meta, StoryObj } from '@storybook/angular';
import { OverflowTableStoryComponent } from './overflow-table-story.component';

const meta: Meta<OverflowTableStoryComponent> = {
  title: 'Components/Tables/Table with Overflow Menu',
  component: OverflowTableStoryComponent,
  parameters: {
    controls: {
      include: [
        'size',
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

type Story = StoryObj<OverflowTableStoryComponent>;

export const Default: Story = {
  args: {
    size: 'md',
    showSelectionColumn: false,
    striped: true,
    isDataGrid: false,
    sortable: true,
    stickyHeader: false,
    skeleton: false,
  },
};
