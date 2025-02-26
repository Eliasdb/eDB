import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import AddIcon from '@carbon/icons/es/add/16';

import { AuthInterceptor } from '@eDB/shared-utils';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  ExperimentalService,
  ModalService,
  NotificationDisplayService,
  NotificationService,
  PlaceholderService,
} from 'carbon-components-angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withFetch(), withInterceptors([AuthInterceptor])),
    provideNoopAnimations(),
    NotificationService,
    ModalService,
    ExperimentalService,
    NotificationDisplayService,
    PlaceholderService,
    // {
    //   provide: IconService,
    //   useFactory: () => {
    //     const iconService = new IconService();
    //     iconService.registerAll([AddIcon]);
    //     return iconService;
    //   },
    // },
  ],
};
