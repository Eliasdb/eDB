// libs/client-auth/src/lib/bootstrap-keycloak.ts
import { ApplicationConfig, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { KeycloakService } from './client';

/**
 * Call this from *each* app’s main.ts.
 * It creates ONE KeycloakService, waits until it is ready,
 * then bootstraps the Angular application with that instance.
 */
export async function bootstrapWithKeycloak(
  rootComponent: Type<unknown>,
  appConfig: ApplicationConfig,
) {
  const keycloakSvc = new KeycloakService();

  const ok = await keycloakSvc.init({
    redirectUri: window.location.href, // <-- keeps page after *login*
  });

  if (!ok) {
    console.error('❌ Keycloak init failed – abort bootstrap');
    return;
  }

  await bootstrapApplication(rootComponent, {
    ...appConfig,
    providers: [
      ...(appConfig.providers ?? []),
      { provide: KeycloakService, useValue: keycloakSvc },
    ],
  });
}
