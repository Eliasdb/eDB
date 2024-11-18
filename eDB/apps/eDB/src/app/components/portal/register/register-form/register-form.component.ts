import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  UiButtonComponent,
  UiPasswordInputComponent,
  UiTextInputComponent,
} from '@e-db/ui';
import { AuthService } from '../../../../services/auth.service';

interface FieldDefinition {
  controlName: string;
  label: string;
  placeholder: string;
  controlType: 'text' | 'password';
  validators: any[];
  errorMessages: { [key: string]: string };
}

@Component({
  selector: 'platform-portal-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiTextInputComponent,
    UiPasswordInputComponent,
    UiButtonComponent,
  ],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        <!-- Loop over fieldRows -->
        <div class="form-row" *ngFor="let row of fieldRows">
          <!-- Loop over fields in row -->
          <div class="form-column" *ngFor="let field of row">
            <ng-container *ngIf="field">
              <ui-text-input
                *ngIf="field.controlType === 'text'"
                [formControlName]="field.controlName"
                [label]="field.label"
                [placeholder]="field.placeholder"
                [invalid]="isFieldInvalid(field.controlName)"
                [invalidText]="
                  getErrorMessage(field.controlName, field.errorMessages)
                "
                [theme]="'dark'"
              ></ui-text-input>

              <ui-password-input
                *ngIf="field.controlType === 'password'"
                [formControlName]="field.controlName"
                [label]="field.label"
                [placeholder]="field.placeholder"
                [invalid]="isFieldInvalid(field.controlName)"
                [invalidText]="
                  getErrorMessage(field.controlName, field.errorMessages)
                "
                [theme]="'dark'"
              ></ui-password-input>
            </ng-container>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="form-row">
          <div class="form-column">
            <ui-button
              type="submit"
              [isExpressive]="true"
              [disabled]="isLoading"
              [fullWidth]="true"
              [variant]="'primary'"
            >
              Submit
            </ui-button>
          </div>
          <div class="form-column">
            <!-- Empty column -->
          </div>
        </div>
      </div>
    </form>
  `,
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  registerForm: FormGroup;
  isLoading = false;
  isRegisterError = false;

  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  // Field definitions
  fieldRows: (FieldDefinition | null)[][] = [
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
        validators: [Validators.required, Validators.minLength(6)],
        errorMessages: {
          required: 'Password is required.',
          minlength: 'Password must be at least 6 characters long.',
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

  constructor() {
    this.registerForm = this.fb.group({});
    this.initializeFormControls();
  }

  private initializeFormControls(): void {
    for (const row of this.fieldRows) {
      for (const field of row) {
        if (field) {
          this.registerForm.addControl(
            field.controlName,
            this.fb.control('', {
              validators: field.validators,
              nonNullable: true,
            })
          );
        }
      }
    }
  }
  isFieldInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control
      ? control.invalid && (control.dirty || control.touched)
      : false;
  }
  // Generic method for error messages
  getErrorMessage(
    controlName: string,
    errorMessages: { [key: string]: string }
  ): string {
    const control = this.registerForm.get(controlName);
    if (control && control.errors) {
      for (const errorKey of Object.keys(control.errors)) {
        if (errorMessages[errorKey]) {
          return errorMessages[errorKey];
        }
      }
    }
    return '';
  }

  // Form submission handler
  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const formData = this.registerForm.getRawValue();

      this.authService.login(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Registration successful', response);
          // Handle successful registration
        },
        error: (error) => {
          this.isLoading = false;
          this.isRegisterError = true;
          console.error('Registration failed', error);
        },
      });
    }
  }

  // Navigation to login page
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
