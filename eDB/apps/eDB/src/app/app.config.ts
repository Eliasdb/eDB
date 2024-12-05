import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { UiNotificationToastComponent } from '@eDB/shared-ui';
import { AuthInterceptor, ErrorInterceptor } from '@eDB/shared-utils';
import {
  provideTanStackQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  ExperimentalService,
  ModalService,
  PlaceholderService,
} from 'carbon-components-angular';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideTanStackQuery(new QueryClient()),
    provideAnimations(),
    provideToastr({
      toastComponent: UiNotificationToastComponent,
      timeOut: 1000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

    provideHttpClient(
      withFetch(),
      withInterceptors([AuthInterceptor, ErrorInterceptor])
    ),

    ModalService,
    PlaceholderService,
    ExperimentalService,
  ],
};
