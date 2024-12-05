import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  UiButtonComponent,
  UiPasswordInputComponent,
  UiTextInputComponent,
  UiTitleComponent,
} from '@eDB/shared-ui';
import { FormUtilsService } from '@eDB/shared-utils';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../../../services/auth-service/auth.service';
import { loginFormFields } from './login-form.config';

@Component({
  selector: 'platform-portal-login-form',
  standalone: true,
  imports: [
    CommonModule,
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
          <div *ngFor="let field of fieldDefinitions">
            <ui-text-input
              *ngIf="field.controlType === 'text'"
              [formControlName]="field.controlName"
              [label]="field.label"
              [invalid]="isFieldInvalid(field.controlName)"
              [invalidText]="getErrorMessage(field.controlName)"
            ></ui-text-input>

            <ui-password-input
              *ngIf="field.controlType === 'password'"
              [formControlName]="field.controlName"
              [label]="field.label"
              [invalid]="isFieldInvalid(field.controlName)"
              [invalidText]="getErrorMessage(field.controlName)"
            ></ui-password-input>
          </div>

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
          [variant]="'tertiary'"
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

  loginForm!: FormGroup;
  isLoading = false;
  isLoginError = false;

  // Define field definitions
  fieldDefinitions = loginFormFields;

  ngOnInit(): void {
    this.loginForm = this.formUtils.createFormGroup(loginFormFields);
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
          field.errorMessages
        )
      : '';
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.getRawValue();

      this.authService.login(credentials).subscribe({
        next: (response) => {
          if ('token' in response) {
            console.log('Login successful:', response);
            console.log(jwtDecode(response.token!));

            localStorage.setItem('token', response.token!);
            this.router.navigate(['/dashboard']);
          }
        },
        error: (error) => {
          console.error('Login failed:', error.message);
          if (error.errors) {
            console.error('Validation errors:', error.errors);
          }
        },
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
