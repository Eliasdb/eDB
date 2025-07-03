import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UiTextInputComponent } from '@edb/shared-ui';

@Component({
  selector: 'crm-add-company-form',
  standalone: true,
  imports: [ReactiveFormsModule, UiTextInputComponent],
  template: `
    <form class="space-y-4" [formGroup]="form">
      <ui-text-input label="Company" formControlName="company" />
    </form>
  `,
})
export class AddCompanyFormComponent {
  @Input() form!: FormGroup;
}
