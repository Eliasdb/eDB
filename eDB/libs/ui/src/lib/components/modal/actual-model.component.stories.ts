import { Meta, StoryObj } from '@storybook/angular';
import { UiModalComponent } from './actual-modal.component';

const meta: Meta<UiModalComponent> = {
  title: 'Components/Modal/DynamicModal',
  component: UiModalComponent,
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<UiModalComponent>;

// Basic Modal Story
export const BasicModal: Story = {
  args: {},
  render: (args) => ({
    props: args,
    template: `
      <app-dynamic-modal></app-dynamic-modal>
    `,
  }),
};
