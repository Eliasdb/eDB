import { Meta, StoryObj } from '@storybook/angular';
import { UiNzModalComponent } from './ui-nz-modal.component';

type Story = StoryObj<UiNzModalComponent>;

const meta: Meta<UiNzModalComponent> = {
  title: 'NG-Zorro/Modal',
  component: UiNzModalComponent,
  args: {
    open: false,
    title: 'Archive Workspace',
    okText: 'Archive',
    cancelText: 'Cancel',
    okLoading: false,
    width: '480px',
    closable: true,
    maskClosable: true,
  },
  argTypes: {
    ok: { action: 'ok' },
    cancel: { action: 'cancel' },
    openChange: { action: 'openChange' },
  },
};

export default meta;

export const Basic: Story = {
  render: (args) => ({
    props: {
      ...args,
      isOpen: args.open,
    },
    template: `
      <button
        type="button"
        class="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-slate-300"
        (click)="isOpen = true"
      >
        Open Modal
      </button>
      <ui-nz-modal
        [open]="isOpen"
        [title]="title"
        [okText]="okText"
        [cancelText]="cancelText"
        [okLoading]="okLoading"
        [width]="width"
        [closable]="closable"
        [maskClosable]="maskClosable"
        (ok)="ok()"
        (cancel)="cancel()"
        (openChange)="isOpen = $event; openChange($event)"
      >
        <p class="text-sm leading-6 text-slate-600">
          Once archived, team members retain read-only access. You can restore the workspace anytime.
        </p>
      </ui-nz-modal>
    `,
  }),
};

export const LoadingState: Story = {
  args: {
    okLoading: true,
    open: true,
  },
  render: (args) => ({
    props: {
      ...args,
      isOpen: true,
    },
    template: `
      <ui-nz-modal
        [open]="isOpen"
        [title]="title"
        [okText]="okText"
        [cancelText]="cancelText"
        [okLoading]="okLoading"
        (ok)="ok()"
        (cancel)="cancel()"
        (openChange)="openChange($event)"
      >
        <p class="text-sm text-slate-600">Processing request…</p>
      </ui-nz-modal>
    `,
  }),
};
