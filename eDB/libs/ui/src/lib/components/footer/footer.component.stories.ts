import { Meta, StoryObj } from '@storybook/angular';
import { FooterComponent } from './footer.component';

const meta: Meta<FooterComponent> = {
  title: 'UI/Footer',
  component: FooterComponent,
  argTypes: {
    backgroundColor: {
      control: 'color',
      description: 'Set the background color of the footer.',
    },
    textColor: {
      control: 'color',
      description: 'Set the text color of the footer.',
    },
  },
};

export default meta;

type Story = StoryObj<FooterComponent>;

// Default footer
export const DefaultFooter: Story = {
  args: {
    backgroundColor: '#333', // Default background color
    textColor: '#fff', // Default text color
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-footer></ui-footer>
    `,
  }),
};

// Footer with customized background and text colors
export const CustomFooter: Story = {
  args: {
    backgroundColor: '#4CAF50', // Custom background color
    textColor: '#fff', // Custom text color
  },
  render: (args) => ({
    props: args,
    template: `
      <ui-footer></ui-footer>
    `,
  }),
};
