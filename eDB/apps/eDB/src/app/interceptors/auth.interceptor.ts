import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve token from sessionStorage
  const token = localStorage.getItem('access_token');

  if (token) {
    console.log('🔑 Using Token from localStorage:', token);
    const modifiedRequest = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
    return next(modifiedRequest);
  } else {
    console.warn('⚠️ No token in localStorage, sending request without it.');
    return next(req);
  }
};
