import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import AddIcon from '@carbon/icons/es/add/16';
import UserIcon from '@carbon/icons/es/user/16';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import { KeycloakService } from '@eDB/client-auth';
import {
  ExperimentalService,
  IconService,
  ModalService,
  NotificationDisplayService,
  NotificationService,
  PlaceholderService,
} from 'carbon-components-angular';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideAnimations(),

    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
    // provideHttpClient(withFetch()),
    NotificationService,
    ModalService,
    KeycloakService, // ✅ Register KeycloakService here
    ExperimentalService,
    NotificationDisplayService,
    PlaceholderService,
    {
      provide: IconService,
      useFactory: () => {
        const iconService = new IconService();
        iconService.registerAll([AddIcon, UserIcon]);
        return iconService;
      },
    },
  ],
};
