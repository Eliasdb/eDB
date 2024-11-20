import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';
import { FieldDefinition } from '@e-db/utils';

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
      placeholder: 'Enter your email',
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
      placeholder: 'Enter your password',
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
      placeholder: 'Enter your first name',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'First name is required.',
      },
    },
    {
      controlName: 'lastName',
      label: 'Last Name',
      placeholder: 'Enter your last name',
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
      placeholder: 'Enter your country',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'Country is required.',
      },
    },
    {
      controlName: 'state',
      label: 'State/Province',
      placeholder: 'Enter your state or province',
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
      placeholder: 'Enter your company',
      controlType: 'text',
      validators: [Validators.required],
      errorMessages: {
        required: 'Company is required.',
      },
    },
    null, // Empty column
  ],
];
