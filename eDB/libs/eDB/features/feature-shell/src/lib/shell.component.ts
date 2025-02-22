import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
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
import { filter } from 'rxjs';

@Component({
  selector: 'app-shell',
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
          (isAuthenticated$ | async)
            ? isAdminApp()
              ? adminNavigationLinks
              : webNavigationLinks
            : []
        "
        [menuOptions]="(isAuthenticated$ | async) ? menuOptions : []"
        (linkClick)="navigateTo($event)"
        (menuOptionSelected)="handleMenuOption($event)"
        [isAdmin]="isAdmin$ | async"
      ></ui-platform-header>
      <main class="platform-content">
        <router-outlet></router-outlet>
        <cds-placeholder></cds-placeholder>
      </main>
      @if (!(isAuthenticated$ | async)) {
        <ui-portal-footer></ui-portal-footer>
      }
    </div>
  `,
  styleUrls: ['shell.component.scss'],
})
export class ShellComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  // Observables for authentication and admin status
  isAuthenticated$ = this.authService.isAuthenticated();
  isAdmin$ = this.authService.isAdmin();

  // Use a signal to store whether this instance is running as the admin app.
  // Initialized to false and updated in ngOnInit.
  isAdminApp = signal<boolean>(false);

  // Navigation links for admin and web apps.
  // For admin, we start with an empty array (to be filled later).
  adminNavigationLinks: {
    id: string;
    label: string;
    isCurrentPage: boolean;
  }[] = [];
  webNavigationLinks: { id: string; label: string; isCurrentPage: boolean }[] =
    [
      { id: 'dashboard', label: 'My eDB', isCurrentPage: false },
      { id: 'catalog', label: 'Catalog', isCurrentPage: false },
      { id: 'profile', label: 'Profile', isCurrentPage: false },
    ];

  // Define menu options (shared between environments)
  menuOptions = [
    { id: 'dashboard', label: 'My eDB' },
    { id: 'profile', label: 'Profile' },
    { id: 'catalog', label: 'Catalog' },
    { id: 'logout', label: 'Logout' },
  ];

  ngOnInit(): void {
    // Detect environment.
    const hostname = window.location.hostname;
    const port = window.location.port;
    if (hostname === 'localhost') {
      // Development: admin app on port 4300, web app on port 4200.
      this.isAdminApp.set(port === '4300');
    } else {
      // Production/Staging: assume admin app is served under /admin.
      this.isAdminApp.set(window.location.pathname.startsWith('/admin'));
    }

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateCurrentPage();
      });

    this.updateCurrentPage();
  }

  // Update current page status for the web navigation links.
  updateCurrentPage(): void {
    const currentRoute = this.router.url;
    if (!this.isAdminApp()) {
      this.webNavigationLinks = this.webNavigationLinks.map((link) => ({
        ...link,
        isCurrentPage: currentRoute.includes(link.id),
      }));
    }
  }

  // Navigate to a new route.
  navigateTo(target: string): void {
    this.router.navigate([target]).then(() => this.updateCurrentPage());
  }

  // Handle menu option selection.
  handleMenuOption(optionId: string): void {
    if (optionId === 'logout') {
      this.logout();
    } else {
      this.navigateTo(optionId);
    }
  }

  // Log out and navigate to the login page.
  private logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
