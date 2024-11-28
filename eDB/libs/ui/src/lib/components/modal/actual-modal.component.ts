import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModalModule } from 'carbon-components-angular';
import { Subject } from 'rxjs';
import { UiButtonComponent } from '../buttons/button/button.component';
import { UiTextInputComponent } from '../inputs/text-input/input.component';

@Component({
  selector: 'app-dynamic-modal',
  standalone: true,
  imports: [
    ModalModule,
    FormsModule,
    ReactiveFormsModule,
    UiTextInputComponent,
    UiButtonComponent,
  ],
  template: `
    <cds-modal [open]="true" [size]="'md'" (close)="onCancel()">
      <cds-modal-header [title]="'Add Application'"></cds-modal-header>
      <form [formGroup]="form">
        <ui-text-input
          label="Application Name"
          placeholder="Enter application name"
          formControlName="name"
        ></ui-text-input>

        <ui-text-input
          label="Description"
          placeholder="Enter application description"
          formControlName="description"
        ></ui-text-input>

        <ui-text-input
          label="Icon URL"
          placeholder="Enter icon URL"
          formControlName="iconUrl"
        ></ui-text-input>

        <ui-text-input
          label="Route Path"
          placeholder="Enter route path"
          formControlName="routePath"
        ></ui-text-input>

        <ui-text-input
          label="Tags (comma-separated)"
          placeholder="Enter tags"
          formControlName="tags"
        ></ui-text-input>
      </form>

      <cds-modal-footer>
        <ui-button variant="secondary" (buttonClick)="onCancel()">
          Cancel
        </ui-button>
        <ui-button
          variant="primary"
          [disabled]="form.invalid"
          (buttonClick)="onSave()"
        >
          Save
        </ui-button>
      </cds-modal-footer>
    </cds-modal>
  `,
})
export class DynamicModalComponent {
  @Input() data!: Subject<any>;

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
    this.data.complete(); // Signal that the modal was dismissed
  }

  onSave() {
    if (this.data) {
      const formValue = this.form.value;
      formValue.tags = formValue.tags
        .split(',')
        .map((tag: string) => tag.trim());
      this.data.next(formValue); // Emit the form data
    }
    this.onCancel();
  }
}
