// libs/client-auth/src/lib/bootstrap-keycloak.ts
import { ApplicationConfig, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { KeycloakService } from './client';

export async function bootstrapWithKeycloak(
  rootComponent: Type<unknown>,
  appConfig: ApplicationConfig,
) {
  const keycloakSvc = new KeycloakService();
  const ok = await keycloakSvc.init({
    redirectUri: window.location.href,
  });

  if (!ok) {
    console.error('❌ Keycloak init failed – abort bootstrap');
    return;
  }

  await bootstrapApplication(rootComponent, {
    // we don’t spread appConfig here because we want full control
    providers: [
      // bring in the NgModule‐level providers:
      // importProvidersFrom(),

      // …any other Carbon NgModules you need

      // now all your original appConfig providers:
      ...(appConfig.providers ?? []),

      // finally your KeycloakService instance:
      { provide: KeycloakService, useValue: keycloakSvc },
    ],
  });
}
