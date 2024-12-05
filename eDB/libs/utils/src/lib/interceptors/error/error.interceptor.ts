import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error) {
        console.log(error);

        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelStateErrors = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateErrors.push(error.error.errors[key]);
                }
              }
              toastr.show('', 'Validation Error', {
                payload: {
                  type: 'toast',
                  notificationType: 'error',
                  title: 'Bad Request',
                  subtitle: 'Validation failed',
                  caption: modelStateErrors.flat().join(', '),
                },
              });
            } else {
              toastr.show('', 'Bad Request', {
                payload: {
                  type: 'toast',
                  notificationType: 'error',
                  title: 'Bad Request',
                  subtitle: error.error,
                },
              });
            }
            break;
          case 401:
            console.log('401');

            toastr.show('', 'Unauthorized', {
              payload: {
                type: 'toast',
                notificationType: 'error',
                title: 'Unauthorized',
                subtitle: 'You are not authorized to perform this action.',
              },
            });
            break;
          case 404:
            router.navigateByUrl('/not-found');
            break;
          case 500:
            toastr.show('', 'Server Error', {
              payload: {
                type: 'toast',
                notificationType: 'error',
                title: 'Server Error',
                subtitle: 'An internal server error occurred.',
              },
            });
            break;
          default:
            toastr.show('', 'Unexpected Error', {
              payload: {
                type: 'toast',
                notificationType: 'error',
                title: 'Unexpected Error',
                subtitle: 'Something went wrong.',
              },
            });
            break;
        }
      }
      return throwError(() => error);
    })
  );
};
