import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiTitleComponent } from '@eDB/shared-ui';
import { RegisterFormComponent } from './components/register-form/register-form.component';

@Component({
  selector: 'platform-register-page',
  imports: [UiTitleComponent, RegisterFormComponent],
  template: `
    <section class="w-full">
      <div
        class="flex flex-col lg:flex-row h-auto lg:h-[calc(100vh-3rem)] overflow-x-hidden"
      >
        <!-- Left Side -->
        <section
          class="flex-1 flex flex-col py-16 px-4 relative bg-[url('https://i.ibb.co/GfZXxRh/lol2.webp')] bg-cover bg-[position:100%_20%] bg-fixed"
        >
          <!-- Gradient Overlay -->
          <div
            class="absolute inset-0 bg-gradient-to-b from-white to-[rgba(167,228,254,0.69)] z-10"
          ></div>
          <div class="relative z-20 max-w-lg">
            <ui-title
              text="Welcome to eDB"
              class="text-2xl font-bold"
            ></ui-title>
            <ui-title
              text="Create an account to access trials, demos and services."
              class="mt-4 text-lg"
            ></ui-title>
          </div>
        </section>

        <!-- Right Side -->
        <section class="flex-1 flex flex-col p-4 lg:py-16 lg:px-4 bg-white">
          <div class="mb-8">
            <ui-title
              text="Create an account"
              class="text-2xl font-bold"
            ></ui-title>
            <p class="mt-0 mb-6">
              Already have one?
              <a
                (click)="navigateToLogin()"
                class="text-[#0070c9] no-underline hover:underline cursor-pointer"
              >
                Log in </a
              >.
            </p>
          </div>
          <platform-portal-register-form></platform-portal-register-form>
        </section>
      </div>
    </section>
  `,
})
export class RegisterPage {
  private router = inject(Router);

  navigateToLogin(): void {
    this.router.navigate(['login']);
  }
}
