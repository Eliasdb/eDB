import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiTitleComponent } from '@eDB/shared-ui';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@Component({
  selector: 'platform-register-page',
  imports: [UiTitleComponent, RegisterFormComponent],
  template: `
    <section class="register-form-page">
      <div class="register-page-content-wrapper">
        <!-- Left Side -->
        <section class="register-info-container">
          <div class="left-titles">
            <ui-title class="welcome-title" text="Welcome to eDB"></ui-title>
            <ui-title
              text="Create an account to access trials, demos and services."
              className="create-title"
            ></ui-title>
          </div>
        </section>

        <!-- Right Side -->
        <section class="register-form-container">
          <div class="right-titles">
            <ui-title
              text="Create an account"
              className="create-title"
            ></ui-title>
            <p class="already-text">
              Already have one?
              <a (click)="navigateToLogin()">Log in</a>.
            </p>
          </div>
          <platform-portal-register-form> </platform-portal-register-form>
        </section>
      </div>
    </section>
  `,
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  private router = inject(Router);

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
