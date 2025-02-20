import {
  UiButtonComponent,
  UiPasswordInputComponent,
  UiTextInputComponent,
} from '@eDB/shared-ui';

import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@eDB/client-auth';
import { FormUtilsService } from '@eDB/shared-utils';
import { NotificationService } from 'carbon-components-angular';

import { User } from '../../types/user.model';
import { registerFormFields } from './register-form.config';

@Component({
  selector: 'platform-portal-register-form',
  imports: [
    ReactiveFormsModule,
    UiTextInputComponent,
    UiPasswordInputComponent,
    UiButtonComponent,
  ],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
      <div class="form-group">
        @for (row of fieldRows; track row) {
          <div class="form-row">
            @for (field of row; track field?.controlName) {
              @if (field) {
                <div class="form-column">
                  @if (field.controlType === 'text') {
                    <ui-text-input
                      [formControlName]="field.controlName"
                      [label]="field.label"
                      [invalid]="isFieldInvalid(field.controlName)"
                      [invalidText]="getErrorMessage(field.controlName)"
                    ></ui-text-input>
                  } @else if (field.controlType === 'password') {
                    <ui-password-input
                      [formControlName]="field.controlName"
                      [label]="field.label"
                      [invalid]="isFieldInvalid(field.controlName)"
                      [invalidText]="getErrorMessage(field.controlName)"
                    ></ui-password-input>
                  }
                </div>
              }
            }
          </div>
        }

        <div class="form-row">
          <div class="form-column">
            <ui-button
              type="submit"
              [isExpressive]="true"
              [disabled]="registerForm.invalid || isSubmitting"
              [fullWidth]="true"
              [loading]="isSubmitting"
            >
              {{ isSubmitting ? 'Registering...' : 'Register' }}
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
  private formUtils = inject(FormUtilsService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  // The fieldRows are kept for template iteration.
  fieldRows = registerFormFields;

  // Create the FormGroup inline, flattening and filtering the 2D array.
  registerForm: FormGroup = this.formUtils.createFormGroup(
    this.fieldRows
      .flat()
      .filter((field): field is NonNullable<typeof field> => !!field),
  );

  registerMutation = this.authService.registerMutation();
  isSubmitting = this.registerMutation.isPending();

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isFieldInvalid(this.registerForm, controlName);
  }

  getErrorMessage(controlName: string): string {
    const field = this.fieldRows
      .flat()
      .find(
        (f): f is NonNullable<typeof f> => !!f && f.controlName === controlName,
      );
    return field
      ? this.formUtils.getErrorMessage(
          this.registerForm,
          controlName,
          field.errorMessages,
        )
      : '';
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const user: User = this.registerForm.getRawValue();
    const capitalizedFirstName = user.firstName
      ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)
      : 'user';

    this.registerMutation.mutate(user, {
      onSuccess: () => this.handleSuccess(capitalizedFirstName),
      onError: (error) => this.handleError(error),
    });
  }

  private handleSuccess(capitalizedFirstName: string): void {
    this.registerForm.reset();
    this.router.navigate(['auth/login']);
    this.notificationService.showNotification({
      type: 'success',
      title: 'You have been registered!',
      message: `Enjoy your stay, ${capitalizedFirstName}.`,
      duration: 5000,
      smart: true,
    });
    this.isSubmitting = false;
  }

  private handleError(error: any): void {
    this.notificationService.showNotification({
      type: 'error',
      title: 'Something went wrong.',
      message: error.error.message || 'An unexpected error occurred.',
      duration: 5000,
      smart: true,
    });
  }
}
