import { Injectable, computed, signal } from '@angular/core';
import { environment } from '@eDB/shared-env';
import Keycloak from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  private keycloak!: Keycloak;

  isAuthenticated = signal(false);
  tokenSignal = signal<string | null>(null);

  authState = computed(() => ({
    authenticated: this.isAuthenticated(),
    token: this.tokenSignal(),
  }));

  async init(
    extraOptions: Keycloak.KeycloakInitOptions = {}, // <-- just add this line
  ): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: `${environment.KC.url}`,
      realm: `${environment.KC.realm}`,
      clientId: `${environment.KC.clientId}`,
    });

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        ...extraOptions, // <-- forward anything passed in
      });

      this.isAuthenticated.set(authenticated);
      this.tokenSignal.set(this.keycloak.token ?? null);

      if (authenticated) {
        sessionStorage.setItem('access_token', this.keycloak.token || '');
        setInterval(async () => {
          if (this.keycloak.authenticated) {
            try {
              await this.keycloak.updateToken(60);
              localStorage.setItem('access_token', this.keycloak.token || '');
            } catch {
              console.log('Token refresh failed, logging out...');
              this.logout();
            }
          }
        }, 30000);
      }

      return true;
    } catch (err) {
      console.error('Keycloak init failed', err);
      return false;
    }
  }

  getToken(): Promise<string> {
    return this.tokenSignal()
      ? Promise.resolve(this.tokenSignal()!)
      : Promise.reject('No token');
  }

  getUserProfile(): Promise<Keycloak.KeycloakProfile> {
    return this.keycloak.loadUserProfile();
  }

  logout(): void {
    if (!this.keycloak) {
      console.warn('Keycloak not initialized?');
      return;
    }
    const target = window.location.href.split('#')[0]; // full page, minus any hash
    console.log('[logout] redirect →', target);

    this.keycloak.logout({ redirectUri: target });
    this.isAuthenticated.set(false);
    this.tokenSignal.set(null);
    sessionStorage.removeItem('access_token');
  }
}
