import { Meta, StoryObj } from '@storybook/angular';
import { DynamicModalComponent } from './actual-modal.component';

const meta: Meta<DynamicModalComponent> = {
  title: 'Components/Modal/DynamicModal',
  component: DynamicModalComponent,
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<DynamicModalComponent>;

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
