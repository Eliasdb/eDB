import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
// import AddIcon from '@carbon/icons/es/add/16';

import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';

import { provideAnimations } from '@angular/platform-browser/animations';
import {
  DropdownModule,
  ExperimentalService,
  I18nModule,
  ModalModule,
  ModalService,
  NotificationDisplayService,
  NotificationService,
  PlaceholderService,
} from 'carbon-components-angular';
import { remoteRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(remoteRoutes),
    provideTanStackQuery(new QueryClient()),
    provideHttpClient(withFetch()),
    provideAnimations(),
    NotificationService,
    ModalService,
    ExperimentalService,
    NotificationDisplayService,
    PlaceholderService,
    importProvidersFrom(
      I18nModule.forRoot({ translations: en }), // 👈 registers I18n service
      ModalModule,
      DropdownModule, // 👈 registers Dropdown providers
    ),
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
