import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@eDB/client-auth';
import {
  UiPlatformHeaderComponent,
  UiPortalFooterComponent,
} from '@eDB/shared-ui';
import {
  I18nModule,
  NotificationService,
  PlaceholderModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    PlaceholderModule,
    I18nModule,
    UiPlatformHeaderComponent,
    UiPortalFooterComponent,
    CommonModule,
  ],
  providers: [NotificationService],
  template: `
    <div class="platform-layout">
      <ui-platform-header
        [navigationLinks]="
          (authService.isAuthenticated() | async) ? navigationLinks : []
        "
        [menuOptions]="
          (authService.isAuthenticated() | async) ? menuOptions : []
        "
        (linkClick)="navigateTo($event)"
        (menuOptionSelected)="handleMenuOption($event)"
      ></ui-platform-header>
      <main class="platform-content">
        <router-outlet></router-outlet>
        <cds-placeholder></cds-placeholder>
      </main>
      <ui-portal-footer></ui-portal-footer>
    </div>
  `,
})
export class AppComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  // Observable to track admin status
  isAuthenticated$ = this.authService.isAuthenticated();

  // Define navigation links
  navigationLinks = [
    { id: 'dashboard', label: 'My eDB', isCurrentPage: false },
    { id: 'catalog', label: 'Catalog', isCurrentPage: false },
    { id: 'profile', label: 'Profile', isCurrentPage: false },
  ];

  // Define menu options
  menuOptions = [
    { id: 'dashboard', label: 'My eDB' },
    { id: 'profile', label: 'Profile' },
    { id: 'logout', label: 'Logout' },
  ];

  ngOnInit(): void {
    this.updateCurrentPage();
  }

  // Update current page status
  updateCurrentPage(): void {
    const currentRoute = this.router.url;
    this.navigationLinks = this.navigationLinks.map((link) => ({
      ...link,
      isCurrentPage: currentRoute.includes(link.id),
    }));
  }

  // Navigate to a new route
  navigateTo(target: string): void {
    this.router.navigate([target]).then(() => this.updateCurrentPage());
  }

  // Handle menu option selection
  handleMenuOption(optionId: string): void {
    if (optionId === 'logout') {
      this.logout();
    } else {
      this.navigateTo(optionId);
    }
  }

  // Log out and navigate to the login page
  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
