// src/app/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '@eDB/client-auth';
import { map, Observable, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.isAuthenticated().pipe(
      take(1), // Take first emitted value and complete
      map((isAuth) => {
        if (isAuth) {
          return true;
        } else {
          // Redirect to the login page with the return URL
          return this.router.createUrlTree(['/auth/login'], {
            queryParams: { returnUrl: state.url },
          });
        }
      }),
    );
  }
}
