import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiTextInputComponent } from '@edb/shared-ui';

@Component({
  selector: 'crm-add-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, UiTextInputComponent /* other UI parts */],
  template: `
    <form class="space-y-4" [formGroup]="form">
      <ui-text-input label="Name" formControlName="name" />
      <ui-text-input label="Email" formControlName="email" />
      <ui-text-input label="Phone" formControlName="phone" />
      <ui-text-input label="Company" formControlName="company" />
      <ui-text-input label="Status" formControlName="status" />
    </form>
  `,
})
export class AddContactFormComponent {
  @Input() form!: FormGroup;
}
