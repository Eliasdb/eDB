import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
  selector: 'app-login-form',
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
      <h2>Login</h2>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- Email input field -->
        <ui-text-input
          label="Email Address"
          placeholder="Enter your email"
          [formControl]="emailControl"
          [invalid]="emailControl.invalid && emailControl.touched"
        ></ui-text-input>

        <!-- Password input field -->
        <ui-password-input
          label="Password"
          placeholder="Enter your password"
          [formControl]="passwordControl"
          [invalid]="passwordControl.invalid && passwordControl.touched"
        ></ui-password-input>

        <!-- Submit button -->
        <ui-button
          [type]="'submit'"
          [disabled]="loginForm.invalid || isLoading"
        >
          Login
        </ui-button>

        <!-- Error message -->
        <div *ngIf="isLoginError" class="error-message">
          Invalid email or password.
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .login-form-container {
        width: 300px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
      }
      .error-message {
        color: red;
        font-size: 14px;
        margin-top: 10px;
      }
    `,
  ],
})
export class LoginFormComponent {
  loginForm: FormGroup<LoginForm>;
  isLoading = false;
  isLoginError = false;

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
}
