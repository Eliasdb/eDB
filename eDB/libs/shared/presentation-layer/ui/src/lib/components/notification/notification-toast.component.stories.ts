import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { NotificationModule } from 'carbon-components-angular';
import { UiNotificationToastComponent } from './notification-toast.component';

const meta: Meta<UiNotificationToastComponent> = {
  title: 'Components/Toast',
  component: UiNotificationToastComponent,
  decorators: [
    moduleMetadata({
      imports: [NotificationModule],
    }),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['toast', 'notification', 'actionable-notification'],
    },
    notificationType: {
      control: 'select',
      options: ['error', 'warning', 'success', 'info'],
    },
    showClose: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<UiNotificationToastComponent>;

export const Toast: Story = {
  args: {
    type: 'toast',
    notificationType: 'error',
    title: 'Error Toast',
    subtitle: 'Something went wrong!',
    caption: 'Check the details for more info.',
    showClose: true,
  },
};

export const Notification: Story = {
  args: {
    type: 'notification',
    notificationType: 'warning',
    title: 'Warning Notification',
    subtitle: 'Please be cautious about this.',
    showClose: true,
  },
};

export const ActionableNotification: Story = {
  args: {
    type: 'actionable-notification',
    notificationType: 'success',
    title: 'Success Notification',
    subtitle: 'Your changes were saved successfully.',
    showClose: true,
  },
};
