import { Meta, StoryObj } from '@storybook/angular';
import { UiNzCardComponent } from './ui-nz-card.component';

type Story = StoryObj<UiNzCardComponent>;

const meta: Meta<UiNzCardComponent> = {
  title: 'NG-Zorro/Card',
  component: UiNzCardComponent,
  args: {
    title: 'Executive Brief',
    extra: 'View details',
    bordered: true,
    hoverable: false,
    loading: false,
    coverImage: null,
  },
};

export default meta;

const renderTemplate = (args: Record<string, unknown>) => ({
  props: args,
  template: `
    <ui-nz-card
      [title]="title"
      [extra]="extra"
      [bordered]="bordered"
      [hoverable]="hoverable"
      [loading]="loading"
      [coverImage]="coverImage"
      [coverAlt]="coverAlt"
    >
      <p>
        Consolidated metrics for ARR, pipeline health, and adoption trends. Update weekly at minimum.
      </p>
    </ui-nz-card>
  `,
});

export const Default: Story = {
  render: (args) => renderTemplate(args),
};

export const Hoverable: Story = {
  args: {
    hoverable: true,
  },
  render: (args) => renderTemplate(args),
};

export const Loading: Story = {
  args: {
    loading: true,
  },
  render: (args) => renderTemplate(args),
};

export const WithCover: Story = {
  args: {
    coverImage:
      'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?fit=crop&w=1200&q=80',
    coverAlt: 'Team working session',
  },
  render: (args) => renderTemplate(args),
};
