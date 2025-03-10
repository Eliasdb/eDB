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

import { AuthService } from '@eDB/client-auth';
import { FormUtilsService } from '@eDB/shared-utils';
import { NotificationService } from 'carbon-components-angular';

import { Credentials, LoginResponse } from '../../types/auth.model';
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
        <ui-title text="Log in to eDB" fontSize="2rem"></ui-title>
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
      <section class="no-account">
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
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loginForm: FormGroup = this.formUtils.createFormGroup(loginFormFields);

  fieldDefinitions = loginFormFields;
  private returnUrl: string = '/dashboard';

  loginMutation = this.authService.loginMutation();
  isLoading = this.loginMutation.isPending();

  ngOnInit(): void {
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

      this.loginMutation.mutate(credentials, {
        onSuccess: (response: LoginResponse) =>
          this.handleLoginSuccess(response),
        onError: (error: HttpErrorResponse) => this.handleLoginError(error),
      });
    }
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.authService.handleLogin(response.token);
    this.router.navigateByUrl(this.returnUrl);
    this.notificationService.showNotification({
      type: 'success',
      title: 'Welcome back - ',
      message: 'You have successfully logged in.',
      duration: 4000,
    });
    this.isLoading = false;
  }

  private handleLoginError(error: HttpErrorResponse): void {
    this.isLoading = false;
    this.notificationService.showNotification({
      type: 'error',
      title: 'Login Failed - ',
      message: error.error.message || 'An unexpected error occurred.',
      duration: 4000,
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
