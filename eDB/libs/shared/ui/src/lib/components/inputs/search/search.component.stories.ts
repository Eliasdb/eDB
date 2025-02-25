import { Meta, StoryObj } from '@storybook/angular';
import { UiSearchComponent } from './search.component';

const meta: Meta<UiSearchComponent> = {
  title: 'Components/Inputs/Search',
  component: UiSearchComponent,
  argTypes: {
    theme: {
      control: { type: 'select' },
      options: ['light', 'dark'],
      description: 'The theme of the search input.',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the search input.',
    },
    autocomplete: {
      control: { type: 'select' },
      options: ['on', 'off'],
      description: 'Autocomplete behavior for the search input.',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the search input is disabled.',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the search input.',
    },
    skeleton: {
      control: 'boolean',
      description: 'Whether to display a skeleton state.',
    },
    expandable: {
      control: 'boolean',
      description: 'Whether the search input is expandable.',
    },
    valueChange: {
      action: 'valueChange',
      description: 'Emits the current value of the search input on change.',
    },
    clear: {
      action: 'clear',
      description: 'Emits when the search input is cleared.',
    },
  },
};

export default meta;
type Story = StoryObj<UiSearchComponent>;

export const Default: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Search',
    autocomplete: 'off',
    disabled: false,
    size: 'md',
    skeleton: false,
    expandable: false,
  },
};

export const LightTheme: Story = {
  args: {
    theme: 'light',
    placeholder: 'Search...',
    autocomplete: 'on',
    size: 'lg',
    skeleton: false,
    expandable: true,
  },
};

export const Disabled: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Disabled search',
    autocomplete: 'off',
    disabled: true,
    size: 'md',
    skeleton: false,
    expandable: false,
  },
};

export const Skeleton: Story = {
  args: {
    theme: 'dark',
    placeholder: 'Skeleton state',
    autocomplete: 'off',
    disabled: false,
    size: 'md',
    skeleton: true,
    expandable: false,
  },
};
