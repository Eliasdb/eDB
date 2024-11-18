import { Component, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { UiTitleComponent } from '@e-db/ui';
import { RegisterFormComponent } from '../../../components/portal/register/register-form/register-form.component';

interface RegisterForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  company: FormControl<string>;
  country: FormControl<string>;
  state: FormControl<string>;
}

@Component({
  selector: 'platform-register-page',
  standalone: true,
  imports: [UiTitleComponent, RegisterFormComponent],
  template: `
    <div class="register-form-container">
      <div class="register-page-content">
        <!-- Left Side -->
        <div class="register-info">
          <div class="left-titles">
            <ui-title text="Welcome to eDB"></ui-title>
            <ui-title
              text="Create an account to access trials, demos and services."
            ></ui-title>
          </div>
        </div>

        <!-- Right Side -->
        <div class="register-form-section">
          <div class="right-titles">
            <ui-title
              text="Create an account"
              [className]="'custom-title-class'"
            ></ui-title>
            <p class="already-text">
              Already have one?
              <a (click)="navigateToLogin()">Log in</a>.
            </p>
          </div>

          <platform-portal-register-form></platform-portal-register-form>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./register.container.scss'],
})
export class RegisterContainer {
  private router = inject(Router);

  // Navigation to login page
  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
