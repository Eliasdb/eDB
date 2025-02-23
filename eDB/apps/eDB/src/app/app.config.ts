import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import AddIcon from '@carbon/icons/es/add/16';
import UserIcon from '@carbon/icons/es/user/16';

import { AuthInterceptor, ErrorInterceptor } from '@eDB/shared-utils';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import {
  ExperimentalService,
  IconService,
  ModalService,
  NotificationDisplayService,
  NotificationService,
  PlaceholderService,
} from 'carbon-components-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
    ),

    provideTanStackQuery(new QueryClient()),
    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, ErrorInterceptor]),
    ),
    NotificationService,
    ModalService,
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
