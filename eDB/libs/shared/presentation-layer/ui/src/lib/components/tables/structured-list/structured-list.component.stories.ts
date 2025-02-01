import { Meta, StoryObj } from '@storybook/angular';
import { UiStructuredListComponent } from './structured-list.component';

const meta: Meta<UiStructuredListComponent> = {
  title: 'Components/Tables/Structured List',
  component: UiStructuredListComponent,
  argTypes: {
    header: { control: 'text' },
    headerIcon: { control: 'text' },
    rows: { control: 'object' },
  },
};

export default meta;

type Story = StoryObj<UiStructuredListComponent>;

export const Default: Story = {
  args: {
    header: 'User Information',
    headerIcon: 'faUser',
    rows: [
      ['Name', 'John Doe'],
      ['Email', 'john.doe@example.com'],
      ['Password', '********'],
    ],
  },
};

export const Editable: Story = {
  args: {
    header: 'Editable Fields',
    headerIcon: 'faEdit',
    rows: [
      ['Name', 'Jane Smith'],
      ['Email', 'jane.smith@example.com'],
      ['Password', '********'],
    ],
  },
};

export const Skeleton: Story = {
  args: {
    header: 'Editable Fields',
    headerIcon: 'faEdit',
    rows: [
      ['Name', 'Jane Smith'],
      ['Email', 'jane.smith@example.com'],
      ['Password', '********'],
    ],
  },
};
