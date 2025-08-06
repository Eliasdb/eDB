import { Injectable, computed, signal } from '@angular/core';
import { environment } from '@eDB/shared-env';
import Keycloak, { KeycloakInitOptions, KeycloakProfile } from 'keycloak-js';

@Injectable({ providedIn: 'root' })
export class KeycloakService {
  /** Under‑the‑hood Keycloak instance */
  private keycloak!: Keycloak;

  /** Interval handle for the refresh loop (cleared on logout) */
  private refreshHandle: ReturnType<typeof setInterval> | null = null;

  /** --- Reactive auth state ------------------------------------------------ */
  private tokenSignal = signal<string | null>(null);
  isAuthenticated = signal(false);

  authState = computed(() => ({
    authenticated: this.isAuthenticated(),
    token: this.tokenSignal(),
  }));

  /** Centralised helper → keeps `tokenSignal` *and* storage in sync  */
  private setToken(token: string | null) {
    this.tokenSignal.set(token);
    // 👇 pick ONE store; we choose localStorage so it survives reloads
    localStorage.setItem('access_token', token ?? '');
  }

  /** Initialise KC and wire up refresh handling */
  async init(extraOptions: KeycloakInitOptions = {}): Promise<boolean> {
    this.keycloak = new Keycloak({
      url: environment.KC.url,
      realm: environment.KC.realm,
      clientId: environment.KC.clientId,
    });

    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false,
        pkceMethod: 'S256',
        ...extraOptions,
      });

      this.isAuthenticated.set(authenticated);
      this.setToken(this.keycloak.token ?? null);

      if (authenticated) {
        this.registerEventHandlers();
        this.scheduleRefreshLoop();
      }

      return authenticated;
    } catch (err) {
      console.error('[Keycloak] init failed', err);
      return false;
    }
  }

  /** Always returns a *fresh* access token (throws on failure) */
  async getFreshToken(): Promise<string> {
    if (!this.keycloak) throw new Error('Keycloak not initialised');
    try {
      await this.keycloak.updateToken(30); // refresh if <30 s remaining
      this.setToken(this.keycloak.token ?? null);
      return this.keycloak.token ?? '';
    } catch (err) {
      this.logout();
      throw err;
    }
  }

  getUserProfile(): Promise<KeycloakProfile> {
    return this.keycloak.loadUserProfile();
  }

  logout(): void {
    if (!this.keycloak) {
      console.warn('[Keycloak] logout called before init');
      return;
    }

    const redirectUri = window.location.href.split('#')[0];

    clearInterval(this.refreshHandle!);
    this.refreshHandle = null;
    this.isAuthenticated.set(false);
    this.setToken(null);

    this.keycloak.logout({ redirectUri });
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  /** Sets up an interval‑based refresh loop (background‑tab safe) */
  private scheduleRefreshLoop() {
    clearInterval(this.refreshHandle!);
    this.refreshHandle = setInterval(async () => {
      try {
        const refreshed = await this.keycloak.updateToken(70); // refresh if <70 s left
        if (refreshed) this.setToken(this.keycloak.token ?? null);
      } catch {
        console.warn('[Keycloak] token refresh failed → logging out…');
        this.logout();
      }
    }, 30_000);
  }

  /** Hook into KC’s own events so we don’t rely solely on setInterval */
  private registerEventHandlers() {
    this.keycloak.onTokenExpired = () => {
      this.keycloak
        .updateToken(0) // force refresh NOW
        .then(() => this.setToken(this.keycloak.token ?? null))
        .catch(() => this.logout());
    };

    this.keycloak.onAuthRefreshSuccess = () =>
      this.setToken(this.keycloak.token ?? null);
  }
}
