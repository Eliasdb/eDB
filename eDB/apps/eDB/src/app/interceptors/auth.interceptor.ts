import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedRequest = req.clone({
    withCredentials: true,
  });
  return next(modifiedRequest);
};
