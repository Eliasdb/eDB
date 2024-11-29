import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { ModalModule, ModalService } from 'carbon-components-angular';
import { UiModalComponent } from './actual-modal.component';
import { DataPassingModal } from './modal.component';

const meta: Meta<DataPassingModal> = {
  title: 'Components/DataPassingModal',
  component: DataPassingModal,
  decorators: [
    moduleMetadata({
      declarations: [],
      imports: [ModalModule, UiModalComponent],
      providers: [ModalService], // Add ModalService here
    }),
  ],
  argTypes: {
    modalText: {
      control: 'text',
      description: 'Text displayed in the modal header',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the modal',
    },
  },
};

export default meta;

type Story = StoryObj<DataPassingModal>;

export const Default: Story = {
  args: {
    modalText: 'Add Application',
    size: 'md',
  },
  play: async ({ canvasElement }) => {
    const button = canvasElement.querySelector('button') as HTMLButtonElement;
    if (button) button.click(); // Simulate clicking the "Open Modal" button
  },
};
