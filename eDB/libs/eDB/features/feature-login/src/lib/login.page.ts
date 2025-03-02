import { Component } from '@angular/core';
import { LoginFormComponent } from './components/login-form/login-form.component';

@Component({
  selector: 'platform-login-page',
  imports: [LoginFormComponent],
  template: `
    <section
      class="w-full overflow-hidden bg-white h-auto min-h-[calc(100vh-3rem)] xl:h-[calc(100vh-3rem)]"
    >
      <div class="flex h-full justify-center xl:justify-start">
        <!-- Login Section -->
        <div
          class="w-full ml-0 mt-20 xl:flex-none xl:basis-[32%] xl:ml-28 xl:mt-24"
        >
          <platform-portal-login-form />
        </div>

        <!-- Intro Image Section (hidden on smaller screens) -->
        <div class="hidden xl:flex flex-1 items-end justify-start -ml-24">
          <img
            src="https://www.ibm.com/account/ibmidutil/login-ui/img/illustration-final.svg"
            alt="Abstract illustration."
            class="min-h-[850px] w-auto"
          />
        </div>
      </div>
    </section>
  `,
})
export class LoginPage {}
