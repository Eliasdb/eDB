// libs/client-auth/src/lib/bootstrap-keycloak.ts
import { ApplicationConfig, importProvidersFrom, Type } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { I18nModule, PlaceholderModule } from 'carbon-components-angular';
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
      // import any NgModules you need (e.g. Carbon modules):
      importProvidersFrom(
        I18nModule,
        PlaceholderModule,
        // …if you had other standalone modules, bring them in here
      ),

      // then spread your host’s original providers:
      ...(appConfig.providers ?? []),

      // and finally your KeycloakService instance:
      { provide: KeycloakService, useValue: keycloakSvc },
    ],
  });
}
