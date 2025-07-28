import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { ComboBoxModule } from 'carbon-components-angular';
import { UiComboboxComponent } from './combobox.component';

const meta: Meta<UiComboboxComponent> = {
  title: 'Components/Combo Box',
  component: UiComboboxComponent,
  decorators: [
    moduleMetadata({
      imports: [ComboBoxModule, UiComboboxComponent],
    }),
  ],
  args: {
    invalid: false,
    invalidText: '',
    label: 'Select an option',
    hideLabel: false,
    warn: false,
    disabled: false,
    readonly: false,
    size: 'md',
    helperText: 'Helper text goes here',
    appendInline: false,
    // Here, we pass items as a function returning a list of ListItem objects.
    items: [
      { content: 'Abacus', selected: false },
      { content: 'Byte', selected: false },
      { content: 'Cherry', selected: false },
    ],
    theme: 'light',
    selectionFeedback: 'top',
    dropUp: false,
    fluid: false,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
    },
    selectionFeedback: {
      control: 'select',
      options: ['top', 'fixed', 'top-after-reopen'],
    },
    invalid: { control: 'boolean' },
    hideLabel: { control: 'boolean' },
    warn: { control: 'boolean' },
    disabled: { control: 'boolean' },
    readonly: { control: 'boolean' },
    appendInline: { control: 'boolean' },
    dropUp: { control: 'boolean' },
    fluid: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<UiComboboxComponent>;

export const Default: Story = {
  render: (args) => ({
    props: args,
    template: `
      <ui-combobox
        [invalid]="invalid"
        [invalidText]="invalidText"
        [label]="label"
        [hideLabel]="hideLabel"
        [warn]="warn"
        [disabled]="disabled"
        [readonly]="readonly"
        [size]="size"
        [helperText]="helperText"
        [appendInline]="appendInline"
        [items]="items"
        [theme]="theme"
        [selectionFeedback]="selectionFeedback"
        [dropUp]="dropUp"
        [fluid]="fluid"
        (selected)="selected($event)"
        (submit)="submit($event)"
        (clear)="clear($event)"
      ></ui-combobox>
    `,
  }),
};

export const WithDifferentItems: Story = {
  args: {
    // Override items to show a different set of list items.
    items: [
      { content: 'Alpha', selected: false },
      { content: 'Beta', selected: false },
      { content: 'Gamma', selected: false },
      { content: 'Delta', selected: false },
    ],
    label: 'Greek Letters',
    helperText: 'Select your favorite letter',
  },
};
