// import { HttpInterceptorFn } from '@angular/common/http';

// export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('token');

//   const modifiedRequest = token
//     ? req.clone({
//         setHeaders: { Authorization: `Bearer ${token}` },
//       })
//     : req;

//   return next(modifiedRequest);
// };

import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const modifiedRequest = req.clone({
    withCredentials: true, // ✅ Automatically include session cookies
  });

  return next(modifiedRequest);
};
