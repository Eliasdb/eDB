import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { KeycloakService } from '@eDB/client-auth';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private keycloakService = inject(KeycloakService);

  async canActivate(): Promise<boolean> {
    // Optionally wait for the next microtick.
    await Promise.resolve();
    const auth = this.keycloakService.isAuthenticated();
    console.log('AuthGuard (async) check, isAuthenticated:', auth);
    if (auth) {
      return true;
    } else {
      this.router.navigate(['/realms']);
      return false;
    }
  }
}
