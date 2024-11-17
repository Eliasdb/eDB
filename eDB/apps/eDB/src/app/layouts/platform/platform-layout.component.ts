import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiPlatformHeaderComponent } from '@e-db/ui';

@Component({
  selector: 'platform-layout',
  standalone: true,
  imports: [RouterModule, UiPlatformHeaderComponent],
  template: `
    <div class="platform-layout">
      <ui-platform-header></ui-platform-header>
      <main class="platform-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrl: 'platform-layout.component.scss',
})
export class PlatformLayoutComponent {}
