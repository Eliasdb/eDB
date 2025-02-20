import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        switch (error.status) {
          case 401:
            // For unauthorized errors, navigate to the login page.
            router.navigateByUrl('/auth/login');
            break;
          case 404:
            // For 404, navigate to a not found page.
            router.navigateByUrl('/not-found');
            break;
          // For other errors, you might want to log them or handle them differently.
          default:
            break;
        }
      }
      return throwError(() => error);
    }),
  );
};
