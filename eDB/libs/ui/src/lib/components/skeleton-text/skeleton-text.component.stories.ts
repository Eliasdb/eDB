import { Meta, StoryObj } from '@storybook/angular';
import { UiSkeletonTextComponent } from './skeleton-text.component';

const meta: Meta<UiSkeletonTextComponent> = {
  title: 'Components/Skeleton Text',
  component: UiSkeletonTextComponent,
  argTypes: {
    lines: {
      control: { type: 'number' },
      description: 'Number of skeleton lines to display.',
      defaultValue: 3,
    },
    minLineWidth: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Minimum width of each line as a percentage.',
      defaultValue: 50,
    },
    maxLineWidth: {
      control: { type: 'number', min: 0, max: 100 },
      description: 'Maximum width of each line as a percentage.',
      defaultValue: 100,
    },
  },
};

export default meta;

type Story = StoryObj<UiSkeletonTextComponent>;

export const Default: Story = {
  args: {
    lines: 3,
    minLineWidth: 50,
    maxLineWidth: 100,
  },
};

export const FiveLines: Story = {
  args: {
    lines: 5,
    minLineWidth: 60,
    maxLineWidth: 90,
  },
};

export const WideLines: Story = {
  args: {
    lines: 3,
    minLineWidth: 80,
    maxLineWidth: 100,
  },
};

export const NarrowLines: Story = {
  args: {
    lines: 4,
    minLineWidth: 30,
    maxLineWidth: 50,
  },
};
