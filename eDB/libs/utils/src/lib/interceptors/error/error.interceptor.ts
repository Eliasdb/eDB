import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import {
  NotificationService,
  NotificationType,
} from 'carbon-components-angular';
import { catchError, Observable, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const injector = inject(Injector);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        const notificationService = injector.get(NotificationService); // Lazy injection
        const showToast = (
          type: NotificationType,
          title: string,
          subtitle: string,
          caption?: string,
        ) => {
          notificationService.showToast({
            type,
            title,
            subtitle,
            caption,
            duration: 5000,
            smart: true,
          });
        };

        switch (error.status) {
          case 400:
            showToast('error', 'Bad Request', 'Validation failed');
            break;
          case 401:
            showToast('error', 'Unauthorized', 'You are not authorized.');
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            showToast('error', 'Server Error', 'Internal server error.');
            break;
          default:
            showToast('error', 'Unexpected Error', 'Something went wrong.');
            break;
        }
      }
      return throwError(() => error);
    }),
  );
};
