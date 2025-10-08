import { Task } from '@api';
import type { Meta, StoryObj } from '@storybook/react';
import { TaskRow } from './task-row';

const meta: Meta<typeof TaskRow> = {
  title: 'Composites/List Rows/Task Row',
  component: TaskRow,
  args: {
    onToggle: () => alert('Toggle clicked'),
    onDelete: () => alert('Delete clicked'),
    onEdit: () => alert('Edit clicked'),
  },
};

export default meta;
type Story = StoryObj<typeof TaskRow>;

const baseTask: Task = {
  id: '1',
  title: 'Write Storybook stories',
  done: false,
  due: undefined,
  source: undefined,
};

export const Default: Story = {
  args: {
    task: { ...baseTask },
  },
};

export const Completed: Story = {
  args: {
    task: { ...baseTask, done: true },
  },
};

export const WithDueDate: Story = {
  args: {
    task: { ...baseTask, due: '2025-10-15' },
  },
};

export const WithSource: Story = {
  args: {
    task: { ...baseTask, source: 'Voice assistant' },
  },
};

export const WithDueDateAndSource: Story = {
  args: {
    task: {
      ...baseTask,
      due: '2025-10-15',
      source: 'Voice assistant',
    },
  },
};

export const Compact: Story = {
  args: {
    task: { ...baseTask, title: 'Compact row demo' },
    compact: true,
  },
};
