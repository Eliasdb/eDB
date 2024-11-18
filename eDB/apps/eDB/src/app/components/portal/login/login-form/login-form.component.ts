import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
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

interface LoginForm {
  email: FormControl<string>;
  password: FormControl<string>;
}

@Component({
  selector: 'platform-portal-login-form',
  standalone: true,
  imports: [
    UiTextInputComponent,
    UiPasswordInputComponent,
    UiButtonComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  template: `
    <div class="login-form-container">
      <section class="login-form-title">
        <h1>Log in to eDB</h1>
      </section>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <!-- Email input field -->
          <ui-text-input
            label="Email Address"
            placeholder="Enter your email"
            [size]="'lg'"
            [theme]="'dark'"
            [formControl]="emailControl"
            [invalid]="
              emailControl.invalid &&
              (emailControl.dirty || emailControl.touched)
            "
            [invalidText]="getEmailErrorMessage()"
          ></ui-text-input>

          <!-- Password input field -->
          <ui-password-input
            label="Password"
            placeholder="Enter your password"
            [formControl]="passwordControl"
            [theme]="'dark'"
            [invalid]="
              passwordControl.invalid &&
              (passwordControl.dirty || passwordControl.touched)
            "
            [invalidText]="getPasswordErrorMessage()"
          ></ui-password-input>

          <!-- Submit button -->
          <ui-button
            [type]="'submit'"
            [isExpressive]="true"
            [disabled]="isLoading"
            [fullWidth]="true"
            icon="faArrowRight"
            class="login-btn"
          >
            Login
          </ui-button>
        </div>
      </form>

      <section>
        <p>Don't have an account?</p>
        <ui-button
          [fullWidth]="true"
          [isExpressive]="true"
          icon="faPlus"
          [variant]="'tertiary'"
          (click)="navigateToRegister()"
        >
          Create one
        </ui-button>
      </section>
    </div>
  `,
  styleUrl: 'login-form.component.scss',
})
export class LoginFormComponent {
  loginForm: FormGroup<LoginForm>;
  isLoading = false;
  isLoginError = false;

  private router = inject(Router);

  get emailControl(): FormControl<string> {
    return this.loginForm.controls.email;
  }

  get passwordControl(): FormControl<string> {
    return this.loginForm.controls.password;
  }

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: this.fb.control('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: this.fb.control('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  getEmailErrorMessage(): string {
    const control = this.emailControl;
    if (control.hasError('required')) {
      return 'Email is required.';
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address.';
    }
    return '';
  }

  getPasswordErrorMessage(): string {
    const control = this.passwordControl;
    if (control.hasError('required')) {
      return 'Password is required.';
    }
    return '';
  }

  authService = inject(AuthService);

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const credentials = this.loginForm.getRawValue();

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful', response);
          // Handle successful login
        },
        error: (error) => {
          this.isLoading = false;
          this.isLoginError = true;
          console.error('Login failed', error);
        },
      });
    }
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }
}
