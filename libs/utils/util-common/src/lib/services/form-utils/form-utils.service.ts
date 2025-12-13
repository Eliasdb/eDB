import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FieldDefinition } from '../../models/field-definition.model';

@Injectable({ providedIn: 'root' })
export class FormUtilsService {
  private readonly fb = inject(FormBuilder);

  // Create a form group dynamically
  createFormGroup(fields: FieldDefinition[]): FormGroup {
    const group = this.fb.group({});
    for (const field of fields) {
      group.addControl(
        field.controlName,
        this.fb.control('', {
          validators: field.validators,
          nonNullable: true,
        }),
      );
    }
    return group;
  }

  // Check if a field is invalid
  isFieldInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }

  // Get error message for a field
  getErrorMessage(
    form: FormGroup,
    controlName: string,
    errorMessages: { [key: string]: string },
  ): string {
    const control = form.get(controlName);
    if (control && control.errors) {
      for (const errorKey of Object.keys(control.errors)) {
        if (errorMessages[errorKey]) {
          return errorMessages[errorKey];
        }
      }
    }
    return '';
  }
}
