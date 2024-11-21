// register-form.fields.ts
import { Validators } from '@angular/forms';
import { FieldDefinition } from '@e-db/utils';

export const loginFormFields: FieldDefinition[] = [
  {
    controlName: 'email',
    label: 'Email Address',
    controlType: 'text',
    validators: [Validators.required, Validators.email],
    errorMessages: {
      required: 'Email is required.',
      email: 'Please enter a valid email address.',
    },
  },
  {
    controlName: 'password',
    label: 'Password',
    controlType: 'password',
    validators: [Validators.required],
    errorMessages: {
      required: 'Password is required.',
    },
  },
];
