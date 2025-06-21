// libs/client-auth/src/lib/bootstrap-keycloak.ts
import { ApplicationConfig, importProvidersFrom, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { I18n, I18nModule, PlaceholderModule } from 'carbon-components-angular';
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
      importProvidersFrom(
        I18nModule,
        PlaceholderModule,
        // …any other Carbon NgModules you need
      ),
      { provide: I18n, useExisting: I18n },

      // and *also* manually re-provide the I18n token itself:

      // now all your original appConfig providers:
      ...(appConfig.providers ?? []),

      // finally your KeycloakService instance:
      { provide: KeycloakService, useValue: keycloakSvc },
    ],
  });
}
