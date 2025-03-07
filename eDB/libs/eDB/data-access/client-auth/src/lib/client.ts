import { Injectable, computed, signal } from '@angular/core';
import { environment } from '@eDB/shared-env';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root',
})
export class KeycloakService {
  private keycloak = new Keycloak({
    url: `${environment.KC.url}`, // Base URL; keycloak-js appends /realms/{realm}/… automatically.
    realm: `${environment.KC.realm}`,
    clientId: `${environment.KC.clientId}`,
  });

  // Signals to track authentication state and token
  isAuthenticated = signal<boolean>(false);
  tokenSignal = signal<string | null>(null);

  // A computed signal that returns an object representing the auth state
  authState = computed(() => ({
    authenticated: this.isAuthenticated(),
    token: this.tokenSignal(),
  }));

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required', // Forces login if not already authenticated.
        checkLoginIframe: false, // Disable iframe checking for local development.
        pkceMethod: 'S256', // Use PKCE (recommended for SPAs).
      });

      // Update signals with the current state.
      this.isAuthenticated.set(authenticated);
      console.log(this.isAuthenticated());

      console.log(this.keycloak.token);
      if (authenticated) {
        this.tokenSignal.set(this.keycloak.token ?? null);
      }

      // Automatically refresh the token every 30 seconds before expiration.
      setInterval(async () => {
        if (this.keycloak.authenticated) {
          try {
            await this.keycloak.updateToken(60); // Refresh if token will expire in 60s.
            this.tokenSignal.set(this.keycloak.token ?? null);
          } catch {
            this.logout();
          }
        }
      }, 30000);

      return true;
    } catch (error) {
      console.error('Keycloak initialization failed', error);
      return false;
    }
  }

  getToken(): Promise<string> {
    const token = this.tokenSignal();
    return token ? Promise.resolve(token) : Promise.reject('No token');
  }

  getUserProfile(): Promise<Keycloak.KeycloakProfile> {
    return this.keycloak.loadUserProfile();
  }

  logout(): void {
    this.keycloak.logout();
    // Reset signals on logout.
    this.isAuthenticated.set(false);
    this.tokenSignal.set(null);
  }
}
