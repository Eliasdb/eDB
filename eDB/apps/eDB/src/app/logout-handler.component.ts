// apps/eDB/src/app/logout-handler.component.ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { KeycloakService } from '@eDB/client-auth';

@Component({
  selector: 'app-logout-handler',
  template: '', // No UI needed
  standalone: true,
})
export class LogoutHandlerComponent {
  private keycloak = inject(KeycloakService);
  private router = inject(Router);

  constructor() {
    this.keycloak.logout();
    this.router.navigate(['/login']); // or any landing page
  }
}
