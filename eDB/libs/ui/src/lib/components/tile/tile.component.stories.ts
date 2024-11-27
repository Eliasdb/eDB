import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { UiTagComponent } from '../tag/tag.component';
import { UiTileComponent } from './tile.component';

const meta: Meta<UiTileComponent> = {
  title: 'Components/Tile',
  component: UiTileComponent,
  decorators: [
    moduleMetadata({
      imports: [UiTileComponent, UiTagComponent],
    }),
  ],
};
export default meta;

type Story = StoryObj<UiTileComponent>;

export const Default: Story = {
  render: () => ({
    template: `
        <ui-tile
          title="Project Dashboard"
          description="View all the key metrics and project updates in one place. This tile provides an overview of your ongoing projects and highlights critical information."
          [tags]="[
            { type: 'red', label: 'Critical', icon: 'faExclamationCircle', size: 'sm' },
            { type: 'purple', label: 'In Progress', icon: 'faSync', size: 'sm' }
          ]"
        ></ui-tile>
      `,
  }),
};

export const WithCustomTags: Story = {
  render: () => ({
    template: `
        <ui-tile
          title="Deployment Status"
          description="Track the current status of your application deployment. This tile shows the environment updates and their progress."
          [tags]="[
            { type: 'purple', label: 'Staging', icon: 'faSync', size: 'sm' },
            { type: 'green', label: 'Deployed', icon: 'faCheck', size: 'sm' }
          ]"
        ></ui-tile>
      `,
  }),
};

export const WithoutTags: Story = {
  render: () => ({
    template: `
        <ui-tile
          title="Task Overview"
          description="A general overview of the assigned tasks. This tile provides a summary without additional tags."
          [tags]="[]"
        ></ui-tile>
      `,
  }),
};
