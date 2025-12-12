// ui-nz-button.stories.ts
import { Meta, StoryObj } from '@storybook/angular';
import {
  UiNzButtonComponent,
  UiNzButtonSize,
  UiNzButtonType,
  UiNzIconTheme,
} from './ui-nz-button.component';

type Story = StoryObj<UiNzButtonComponent>;

const meta: Meta<UiNzButtonComponent> = {
  title: 'NG-Zorro/Button',
  component: UiNzButtonComponent,
  args: {
    type: 'primary' as UiNzButtonType,
    size: 'default' as UiNzButtonSize,
    shape: null, // <- match component: NzButtonShape | null
    danger: false,
    loading: false,
    disabled: false,
    icon: null,
    iconTheme: 'outline' as UiNzIconTheme,
  },
  argTypes: {
    type: {
      control: 'select',
      options: [
        'primary',
        'default',
        'dashed',
        'text',
        'link',
      ] as UiNzButtonType[],
    },
    size: {
      control: 'select',
      options: ['large', 'default', 'small'] as UiNzButtonSize[],
    },
    // NG-Zorro only supports 'circle' | 'round' for nzShape; null means "default"
    shape: {
      control: 'select',
      options: [null, 'circle', 'round'], // <- no "default"
    },
    iconTheme: {
      control: 'select',
      options: ['outline', 'fill', 'twotone'] as UiNzIconTheme[],
    },
    buttonClick: { action: 'buttonClick' },
  },
};

export default meta;

export const Primary: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-nz-button
        [type]="type"
        [size]="size"
        [shape]="shape"
        [danger]="danger"
        [loading]="loading"
        [disabled]="disabled"
        [icon]="icon"
        [iconTheme]="iconTheme"
        (buttonClick)="buttonClick($event)"
      >
        Primary Action
      </ui-nz-button>
    `,
  }),
};

export const WithIcon: Story = {
  args: { icon: 'download', type: 'default' },
  render: (args) => ({
    props: args,
    template: `
      <ui-nz-button
        [type]="type"
        [size]="size"
        [shape]="shape"
        [danger]="danger"
        [loading]="loading"
        [disabled]="disabled"
        [icon]="icon"
        [iconTheme]="iconTheme"
      >
        Download
      </ui-nz-button>
    `,
  }),
};

export const Danger: Story = {
  args: { type: 'primary', danger: true },
  render: (args) => ({
    props: args,
    template: `
      <ui-nz-button
        [type]="type"
        [size]="size"
        [shape]="shape"
        [danger]="danger"
        [loading]="loading"
        [disabled]="disabled"
      >
        Delete
      </ui-nz-button>
    `,
  }),
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => ({
    props: args,
    template: `
      <ui-nz-button
        [type]="type"
        [size]="size"
        [shape]="shape"
        [danger]="danger"
        [loading]="loading"
        [disabled]="disabled"
      >
        Saving...
      </ui-nz-button>
    `,
  }),
};
