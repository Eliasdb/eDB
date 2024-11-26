import { Meta, StoryObj } from '@storybook/angular';
import { UiTileComponent } from './tile.component';

const meta: Meta<UiTileComponent> = {
  title: 'Components/Tile',
  component: UiTileComponent,
  args: {
    title: 'Sample Tile Title',
    description: 'This is a description of the tile content.',
    tags: [
      {
        type: 'red',
        label: 'Important',
        icon: 'faExclamationCircle',
        size: 'md',
      },
      { type: 'green', label: 'Success', icon: 'faCheck', size: 'sm' },
      { type: 'blue', label: 'Info', icon: 'faInfoCircle', size: 'md' },
    ],
  },
};
export default meta;

type Story = StoryObj<UiTileComponent>;

export const Default: Story = {};

export const WithTags: Story = {
  args: {
    tags: [
      { type: 'green', label: 'New Feature', icon: 'faCheck', size: 'md' },
      { type: 'blue', label: 'Beta', icon: 'faInfoCircle', size: 'sm' },
    ],
  },
};

export const LongDescription: Story = {
  args: {
    description: `This is a much longer description to show how the tile handles additional text. It should gracefully wrap and not overflow or distort the layout.`,
  },
};

export const WithoutTags: Story = {
  args: {
    tags: [],
  },
};
