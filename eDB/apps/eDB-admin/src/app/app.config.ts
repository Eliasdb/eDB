import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// import AddIcon from '@carbon/icons/es/add/16';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import {
  ExperimentalService,
  ModalService,
  NotificationDisplayService,
  NotificationService,
  PlaceholderService,
} from 'carbon-components-angular';
import { adminRemoteRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(adminRemoteRoutes),
    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withFetch()),
    // provideAnimations(),
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
