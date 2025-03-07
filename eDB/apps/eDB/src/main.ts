import { bootstrapApplication } from '@angular/platform-browser';
import { KeycloakService } from '@eDB/client-auth';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

const keycloakService = new KeycloakService();

keycloakService.init().then((authenticated) => {
  if (authenticated) {
    console.log('✅ Keycloak authentication successful');
    bootstrapApplication(AppComponent, {
      ...appConfig,
      providers: [
        ...appConfig.providers,
        { provide: KeycloakService, useValue: keycloakService },
      ],
    }).catch((err) => console.error(err));
  } else {
    console.error('❌ Keycloak authentication failed');
  }
});
