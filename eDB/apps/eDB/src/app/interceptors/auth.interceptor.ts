import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { KeycloakService } from '@eDB/client-auth';
import { catchError, from, switchMap } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const keycloakService = inject(KeycloakService);

  // You might want to skip certain endpoints, for example:
  // if (req.url.includes('/auth')) {
  //   return next(req);
  // }

  return from(keycloakService.getToken()).pipe(
    switchMap((token) => {
      if (token) {
        console.log('Token retrieved:', token);
      }
      const modifiedRequest = token
        ? req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
            // Uncomment the line below if you need to include cookies.
            // withCredentials: true,
          })
        : req;
      return next(modifiedRequest);
    }),
    catchError((error) => {
      console.error('Error retrieving token:', error);
      // Optionally, you can still let the request proceed without a token.
      return next(req);
    }),
  );
};
