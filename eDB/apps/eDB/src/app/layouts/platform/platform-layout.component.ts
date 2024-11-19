import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UiPlatformHeaderComponent } from '@e-db/ui';

@Component({
  selector: 'platform-layout',
  standalone: true,
  imports: [RouterModule, UiPlatformHeaderComponent],
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
  styleUrls: ['platform-layout.component.scss'],
})
export class PlatformLayoutComponent {
  constructor(private router: Router) {}

  // Define navigation links
  navigationLinks = [
    { id: 'dashboard', label: 'My eDB', isCurrentPage: false },
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
      console.log('Logging out...');
      // Add your logout logic here
    } else {
      this.navigateTo(optionId);
    }
  }
}
