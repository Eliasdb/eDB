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
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated().pipe(
      take(1),
      map((isAuth) => {
        console.log('Auth state in guard:', isAuth);
        // If state is still unknown (null), default to false (logged out)
        if (isAuth === null) {
          return this.router.createUrlTree(['/login'], {
            queryParams: { returnUrl: state.url },
          });
        }
        return isAuth
          ? true
          : this.router.createUrlTree(['/login'], {
              queryParams: { returnUrl: state.url },
            });
      }),
    );
  }
}
