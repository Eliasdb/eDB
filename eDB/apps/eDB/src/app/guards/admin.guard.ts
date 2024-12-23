import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from '@eDB/platform-services';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    const isAuthenticated = this.authService.isAuthenticated();
    const isAdmin = await firstValueFrom(this.authService.isAdmin()); // Convert Observable to boolean

    if (isAuthenticated && isAdmin) {
      return true;
    } else {
      // Optionally, redirect to unauthorized page or dashboard
      return this.router.createUrlTree(['/not-found']);
    }
  }
}
