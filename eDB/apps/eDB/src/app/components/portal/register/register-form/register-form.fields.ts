import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { FieldDefinition } from '@eDB/shared-utils';

// Custom Validator for Strong Password
export function strongPasswordValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value || '';
  const hasUppercase = /[A-Z]/.test(value);
  const hasLowercase = /[a-z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const isValidLength = value.length >= 8;

  if (
    !hasUppercase ||
    !hasLowercase ||
    !hasNumber ||
    !hasSpecialChar ||
    !isValidLength
  ) {
    return {
      strongPassword:
        'Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.',
    };
  }
  return null;
}

// Field Definitions
export const registerFormFields: (FieldDefinition | null)[][] = [
  [
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
      validators: [
        Validators.required,
        Validators.minLength(8),
        strongPasswordValidator,
      ],
      errorMessages: {
        required: 'Password is required.',
        minlength: 'Password must be at least 8 characters long.',
        strongPassword:
          'Password must include uppercase, lowercase, a number, and a special character.',
      },
    },
  ],
  [
    {
      controlName: 'firstName',
      label: 'First Name',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'First name is required.',
      },
    },
    {
      controlName: 'lastName',
      label: 'Last Name',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'Last name is required.',
      },
    },
  ],
  [
    {
      controlName: 'country',
      label: 'Country',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'Country is required.',
      },
    },
    {
      controlName: 'state',
      label: 'State/Province',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'State/Province is required.',
      },
    },
  ],
  [
    {
      controlName: 'company',
      label: 'Company',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'Company is required.',
      },
    },
    null, // Empty column
  ],
];
