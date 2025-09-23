// Angular
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

// Tanstack
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

// Carbon
import AddIcon from '@carbon/icons/es/add/16';
import UserIcon from '@carbon/icons/es/user/16';
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
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),
    provideZonelessChangeDetection(),
    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
    NotificationService,
    ModalService,
    ExperimentalService,
    NotificationDisplayService,
    PlaceholderService,
    {
      provide: IconService,
      useFactory: () => {
        const svc = new IconService();
        svc.registerAll([AddIcon, UserIcon]);
        return svc;
      },
    },
  ],
};
