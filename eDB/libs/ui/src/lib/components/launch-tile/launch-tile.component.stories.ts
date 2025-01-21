import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { TilesModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiTagComponent } from '../tag/tag.component';
import { UiLaunchTileComponent } from './launch-tile.component';

const meta: Meta<UiLaunchTileComponent> = {
  title: 'UI/Tile',
  component: UiLaunchTileComponent,
  decorators: [
    moduleMetadata({
      imports: [TilesModule, UiButtonComponent, UiTagComponent],
    }),
  ],
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    tags: { control: { type: 'object' } }, // Correct control for array-like inputs
  },
};

export default meta;

type Story = StoryObj<UiLaunchTileComponent>;

export const Default: Story = {
  args: {
    title: 'My Tile Title',
    description: 'This is a description for the tile.',
    tags: ['Tag 1', 'Tag 2', 'Tag 3'],
  },
};

export const WithFewTags: Story = {
  args: {
    title: 'Minimal Tile',
    description: 'This tile has only one tag.',
    tags: ['Single Tag'],
  },
};

export const NoTags: Story = {
  args: {
    title: 'No Tags Tile',
    description: 'This tile has no tags.',
    tags: [],
  },
};
