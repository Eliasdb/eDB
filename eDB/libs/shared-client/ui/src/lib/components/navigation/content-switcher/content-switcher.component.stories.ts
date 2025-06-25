import { Meta, StoryObj } from '@storybook/angular';
import { UiContentSwitcherComponent } from './content-switcher.component';

const meta: Meta<UiContentSwitcherComponent> = {
  title: 'Components/Navigation/ContentSwitcher',
  component: UiContentSwitcherComponent,
};

export default meta;

type Story = StoryObj<UiContentSwitcherComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <app-content-switcher>
        <div section1>
          <p>Content for the First Section</p>
        </div>
        <div section2>
          <p>Content for the Second Section</p>
        </div>
      </app-content-switcher>
    `,
  }),
};
