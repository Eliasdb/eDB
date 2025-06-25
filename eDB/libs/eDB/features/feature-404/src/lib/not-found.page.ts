import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@eDB/shared-ui';
import { IconModule } from 'carbon-components-angular';

@Component({
  selector: 'platform-not-found-page',
  imports: [UiButtonComponent, IconModule],
  template: `
    <div
      class="min-h-screen flex flex-col justify-center items-center bg-white px-4 border-r"
    >
      <h1 class="text-5xl font-normal">404</h1>
      <img
        src="https://i.ibb.co/sqv5Cp2/undraw-void-3ggu.png"
        alt="Not found image"
        class="w-full max-w-[320px] my-4"
      />
      <p class="text-[1.6rem] text-center mb-4">
        The page you are looking for isn't here.
      </p>
      <ui-button
        variant="secondary"
        size="lg"
        icon="faHome"
        (buttonClick)="navigateToDashboard()"
        class="mt-5"
      >
        Back to dashboard
      </ui-button>
    </div>
  `,
  styles: [],
})
export class NotFoundComponent {
  private router = inject(Router);

  navigateToDashboard(): void {
    this.router.navigate(['/']);
  }
}
