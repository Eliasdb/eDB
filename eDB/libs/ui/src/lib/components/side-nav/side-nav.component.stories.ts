import { Meta, StoryObj } from '@storybook/angular';
import { UiSidenavComponent } from './side-nav.component';

const meta: Meta<UiSidenavComponent> = {
  title: 'Components/SideNav',
  component: UiSidenavComponent,
  tags: ['autodocs'], // Enable automatic documentation
  args: {
    links: [
      { id: 'section1', label: 'Section 1', active: true },
      { id: 'section2', label: 'Section 2', active: false },
      { id: 'section3', label: 'Section 3', active: false },
    ],
  },
};

export default meta;

type Story = StoryObj<UiSidenavComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <div style="display: flex; height: 100vh; width: 100%;">
        <ui-sidenav [links]="links" style="flex: 0 0 250px;"></ui-sidenav>
        <div style="flex: 1; padding: 1rem; overflow-y: scroll;">
          <section id="section1" style="height: 100vh; border-bottom: 1px solid #ccc;">
            <h2>Section 1</h2>
            <p>Content for Section 1...</p>
          </section>
          <section id="section2" style="height: 100vh; border-bottom: 1px solid #ccc;">
            <h2>Section 2</h2>
            <p>Content for Section 2...</p>
          </section>
          <section id="section3" style="height: 100vh; border-bottom: 1px solid #ccc;">
            <h2>Section 3</h2>
            <p>Content for Section 3...</p>
          </section>
        </div>
      </div>
    `,
  }),
};
