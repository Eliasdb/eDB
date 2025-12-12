import { Meta, StoryObj } from '@storybook/angular';
import {
  UiNzTab,
  UiNzTabPosition,
  UiNzTabsComponent,
  UiNzTabsSize,
} from './ui-nz-tabs.component';

type Story = StoryObj<UiNzTabsComponent>;

const TAB_CONTENT: UiNzTab[] = [
  {
    key: 'overview',
    label: 'Overview',
    description: 'Snapshot of KPIs and current initiatives.',
    content: 'Use this space to highlight project pulse metrics and blockers.',
  },
  {
    key: 'team',
    label: 'Team',
    description: 'View roster, roles, and availability.',
    content: 'Assign owners and set expectations for each milestone.',
  },
  {
    key: 'activity',
    label: 'Activity',
    description: 'Recent updates across connected systems.',
    content: 'Surface the latest syncs from CRM, tickets, and meeting notes.',
  },
];

const meta: Meta<UiNzTabsComponent> = {
  title: 'NG-Zorro/Tabs',
  component: UiNzTabsComponent,
  args: {
    tabs: TAB_CONTENT,
    selectedIndex: 0,
    tabPosition: 'top',
    animated: true,
    size: 'default',
  },
  argTypes: {
    selectedIndexChange: { action: 'selectedIndexChange' },
    tabPosition: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'] as UiNzTabPosition[],
    },
    size: {
      control: 'select',
      options: ['large', 'default', 'small'] as UiNzTabsSize[],
    },
  },
};

export default meta;

const renderTemplate = (args: Record<string, unknown>) => ({
  props: args,
  template: `
    <ui-nz-tabs
      [tabs]="tabs"
      [selectedIndex]="selectedIndex"
      [tabPosition]="tabPosition"
      [animated]="animated"
      [size]="size"
      (selectedIndexChange)="selectedIndexChange($event)"
    ></ui-nz-tabs>
  `,
});

export const Default: Story = {
  render: (args) => renderTemplate(args),
};

export const NonAnimated: Story = {
  args: {
    animated: false,
  },
  render: (args) => renderTemplate(args),
};

export const Vertical: Story = {
  args: {
    tabPosition: 'left',
    size: 'large',
  },
  render: (args) => renderTemplate(args),
};
