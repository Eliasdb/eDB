import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UiPlatformHeaderComponent } from '@eDB/shared-ui';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
  selector: 'platform-layout',
  standalone: true,
  imports: [RouterModule, UiPlatformHeaderComponent, CommonModule],
  template: `
    <div class="platform-layout">
      <ui-platform-header
        [name]="'My Platform'"
        [navigationLinks]="navigationLinks"
        [menuOptions]="menuOptions"
        (linkClick)="navigateTo($event)"
        (menuOptionSelected)="handleMenuOption($event)"
      ></ui-platform-header>
      <main class="platform-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styleUrls: ['platform.layout.scss'],
})
export class PlatformLayout implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  // Observable to track admin status
  isAdmin$: Observable<boolean> = this.authService.isAdmin();

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
    this.authService.getUserRole().subscribe((role) => {
      console.log('User role:', role);
    });
    this.isAdmin$.subscribe((isAdmin) => {
      if (isAdmin) {
        this.addAdminLinks();
      } else {
        this.removeAdminLinks();
      }
      this.updateCurrentPage();
    });
  }

  // Add admin links if the user is an admin
  private addAdminLinks(): void {
    if (!this.navigationLinks.find((link) => link.id === 'admin')) {
      this.navigationLinks.push({
        id: 'admin',
        label: 'Admin',
        isCurrentPage: false,
      });
    }

    if (!this.menuOptions.find((option) => option.id === 'admin')) {
      this.menuOptions.push({ id: 'admin', label: 'Admin' });
    }
  }

  // Remove admin links if the user is not an admin
  private removeAdminLinks(): void {
    this.navigationLinks = this.navigationLinks.filter(
      (link) => link.id !== 'admin'
    );

    this.menuOptions = this.menuOptions.filter(
      (option) => option.id !== 'admin'
    );
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
