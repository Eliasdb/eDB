import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { Meta, StoryObj } from '@storybook/angular';
import { UiModalComponent } from './modal.component';

const meta: Meta<UiModalComponent> = {
  title: 'Components/Modal',
  component: UiModalComponent,
  args: {
    header: 'Default Header',
    content: 'This is a confirmation modal.',
    cancelRoute: undefined,
  },
  argTypes: {
    header: {
      control: 'text',
      description: 'The header of the modal.',
    },
    content: {
      control: 'text',
      description: 'The content of the modal if no form is present.',
    },
    cancelRoute: {
      control: 'text',
      description: 'The route to navigate to on cancel.',
    },
    template: {
      control: false,
      description: 'Custom template to render in the modal.',
    },
    context: {
      control: false,
      description: 'Context to pass to the custom template.',
    },
  },
};

export default meta;

type Story = StoryObj<UiModalComponent>;

// Wrapper component to pass the `TemplateRef`
@Component({
  selector: 'ui-story-custom-template-wrapper',
  template: `
    <ng-template #customTemplate let-data>
      <p>{{ data.message }}</p>
    </ng-template>
    <ui-modal
      [header]="header"
      [template]="customTemplate"
      [context]="context"
    ></ui-modal>
  `,
})
class CustomTemplateWrapperComponent {
  @ViewChild('customTemplate', { static: true })
  customTemplate!: TemplateRef<any>;
  @Input() header?: string;
  @Input() context?: any;
}

export const CustomTemplateModal: Story = {
  render: (args) => {
    return {
      component: CustomTemplateWrapperComponent,
      props: {
        header: args.header,
        context: args.context,
      },
    };
  },
  args: {
    header: 'Custom Modal',
    context: { message: 'This is custom content passed to the template.' },
  },
};
