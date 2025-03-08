import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve token from sessionStorage
  const token = sessionStorage.getItem('access_token');

  if (token) {
    console.log('🔑 Using Token from sessionStorage:', token);
    const modifiedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(modifiedRequest);
  } else {
    console.warn('⚠️ No token in sessionStorage, sending request without it.');
    return next(req);
  }
};
