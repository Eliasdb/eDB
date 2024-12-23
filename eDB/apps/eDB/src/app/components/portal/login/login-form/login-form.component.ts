import {
  UiButtonComponent,
  UiPasswordInputComponent,
  UiTextInputComponent,
  UiTitleComponent,
} from '@eDB/shared-ui';

import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '@eDB/platform-services';
import { FormUtilsService } from '@eDB/shared-utils';
import { NotificationService } from 'carbon-components-angular';

import { Credentials, LoginResponse } from '@eDB/platform-models/auth.model';
import { loginFormFields } from './login-form.config';

@Component({
  selector: 'platform-portal-login-form',
  imports: [
    ReactiveFormsModule,
    UiTextInputComponent,
    UiPasswordInputComponent,
    UiButtonComponent,
    UiTitleComponent,
  ],
  template: `
    <div class="login-form-container">
      <section class="login-form-title">
        <ui-title text="Log in to eDB"></ui-title>
      </section>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          @for (field of fieldDefinitions; track field.controlName) {
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
          }

          <ui-button
            type="submit"
            icon="faArrowRight"
            class="login-btn"
            [isExpressive]="true"
            [fullWidth]="true"
            [disabled]="loginForm.invalid || isLoading"
            [loading]="isLoading"
          >
            {{ isLoading ? 'Logging in...' : 'Login' }}
          </ui-button>
        </div>
      </form>

      <section>
        <p>Don't have an account?</p>
        <ui-button
          icon="faPlus"
          [fullWidth]="true"
          [isExpressive]="true"
          variant="tertiary"
          (click)="navigateToRegister()"
        >
          Create one
        </ui-button>
      </section>
    </div>
  `,
  styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements OnInit {
  private formUtils = inject(FormUtilsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Inject ActivatedRoute
  private notificationService = inject(NotificationService);

  loginForm!: FormGroup;
  isLoading = false;

  fieldDefinitions = loginFormFields;

  private returnUrl: string = '/dashboard';

  loginMutation = this.authService.loginMutation();

  ngOnInit(): void {
    this.loginForm = this.formUtils.createFormGroup(loginFormFields);
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  isFieldInvalid(controlName: string): boolean {
    return this.formUtils.isFieldInvalid(this.loginForm, controlName);
  }

  getErrorMessage(controlName: string): string {
    const field = loginFormFields.find((f) => f.controlName === controlName);
    return field
      ? this.formUtils.getErrorMessage(
          this.loginForm,
          controlName,
          field.errorMessages,
        )
      : '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      const credentials: Credentials = this.loginForm.getRawValue();
      console.log(credentials);

      this.loginMutation.mutate(credentials, {
        onSuccess: (response: LoginResponse) => {
          this.authService.handleLogin(response.token);
          // Navigate to returnUrl after login
          this.router.navigateByUrl(this.returnUrl);

          // Show success notification
          this.notificationService.showToast({
            type: 'success',
            title: 'Success',
            subtitle: 'You have successfully logged in.',
            caption: `Welcome back!`,
            duration: 5000,
          });
          this.isLoading = false; // End submission
        },
        onError: (error: HttpErrorResponse) => {
          console.error('Login failed:', error.message);
          if (error.error && error.error.message) {
            console.error('Error message:', error.error.message);
          }

          this.isLoading = false; // End submission

          // Show error notification
          this.notificationService.showToast({
            type: 'error',
            title: 'Login Failed',
            subtitle: 'Unable to log in.',
            caption: error.error.message || 'An unexpected error occurred.',
            duration: 5000,
          });
        },
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
