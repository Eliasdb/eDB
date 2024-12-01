import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalModule, PlaceholderModule } from 'carbon-components-angular';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiTextAreaComponent } from '../inputs/text-area/text-area.component';
import { UiTextInputComponent } from '../inputs/text-input/input.component';

@Component({
  selector: 'ui-modal',
  standalone: true,
  imports: [
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    UiTextInputComponent,
    UiButtonComponent,
    PlaceholderModule,
    UiTextAreaComponent,
  ],
  template: `
    <cds-modal [open]="true" [size]="'md'" (close)="onCancel()">
      <cds-modal-header (closeSelect)="onCancel()">
        <h2 cdsModalHeaderLabel>Admin</h2>
        <h3 cdsModalHeaderHeading>{{ header }}</h3>
      </cds-modal-header>
      <form [formGroup]="form" class="form">
        <!-- form fields -->
        <ui-text-input
          label="Application Name"
          placeholder="Enter application name"
          formControlName="name"
          [theme]="'light'"
        ></ui-text-input>

        <section class="row-2">
          <ui-text-input
            label="Route path"
            placeholder="Enter routePath"
            formControlName="routePath"
            [theme]="'light'"
          ></ui-text-input>

          <ui-text-input
            label="Icon URL"
            placeholder="Enter icon URL"
            formControlName="iconUrl"
            [theme]="'light'"
          ></ui-text-input>
        </section>

        <ui-text-input
          label="Tags (comma-separated)"
          placeholder="Enter tags"
          formControlName="tags"
          [theme]="'light'"
        ></ui-text-input>

        <ui-textarea
          label="Description"
          placeholder="Enter application description"
          formControlName="description"
          [theme]="'light'"
        ></ui-textarea>
      </form>

      <cds-modal-footer>
        <ui-button
          variant="secondary"
          (buttonClick)="onCancel()"
          [fullWidth]="true"
          [size]="'sm'"
          [isExpressive]="true"
        >
          Cancel
        </ui-button>
        <ui-button
          variant="primary"
          [disabled]="form.invalid"
          (buttonClick)="onSave()"
          [fullWidth]="true"
          [isExpressive]="true"
          [size]="'sm'"
        >
          Save
        </ui-button>
      </cds-modal-footer>
    </cds-modal>
  `,
  styleUrl: 'actual-modal.component.scss',
})
export class UiModalComponent {
  @Input() header?: string = 'Add application';
  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      iconUrl: [''],
      routePath: [''],
      tags: [''],
    });
  }

  onCancel() {
    this.close.emit();
  }

  onSave() {
    const formValue = this.form.value;
    formValue.tags = formValue.tags.split(',').map((tag: string) => tag.trim());
    this.save.emit(formValue);
    this.onCancel();
  }
}
