// libs/ui/composites/list-rows/task-row.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TaskRow, type TaskLike } from './task-row';

const meta: Meta<typeof TaskRow> = {
  title: 'Composites/List Rows/CRM/Task Row',
  component: TaskRow,
  args: {
    onToggle: () => alert('Toggle clicked'),
    onDelete: () => alert('Delete clicked'),
    onEdit: () => alert('Edit clicked'),
  },
};
export default meta;

type Story = StoryObj<typeof TaskRow>;

// Minimal domain-agnostic shape the UI expects
const baseTask: TaskLike = {
  id: '1',
  title: 'Write Storybook stories',
  done: false,
  // optional fields are fine to omit:
  // due: '2025-10-15',
  // source: 'Voice assistant',
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
