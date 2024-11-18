// cds-structured-list.component.stories.ts
import { Meta, moduleMetadata, StoryObj } from '@storybook/angular';
import { StructuredListModule } from 'carbon-components-angular';
import { UiStructuredListComponent } from './structured-list.component';

export default {
  title: 'Ui/UiStructuredListComponent',
  component: UiStructuredListComponent,
  decorators: [
    moduleMetadata({
      imports: [StructuredListModule],
    }),
  ],
} as Meta<UiStructuredListComponent>;

export const Default: StoryObj<UiStructuredListComponent> = {
  render: (args: UiStructuredListComponent) => ({
    component: UiStructuredListComponent,
    props: args,
  }),
  args: {
    // Here you can define any default properties for your component
  },
};
