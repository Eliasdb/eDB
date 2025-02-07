// src/app/guards/login.guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '@eDB/client-auth';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
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
      take(1), // Takes the first emitted value and complete the observable
      map((isAuth) => {
        if (isAuth) {
          // If authenticated, redirect to dashboard
          return this.router.createUrlTree(['/dashboard']);
        } else {
          // If not authenticated, allow access to the route
          return true;
        }
      }),
    );
  }
}
