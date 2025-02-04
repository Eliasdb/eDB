import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '@eDB/client-auth';
import { firstValueFrom } from 'rxjs'; // Import firstValueFrom

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const isAuthenticated = await firstValueFrom(
      this.authService.isAuthenticated(),
    );
    const isAdmin = await firstValueFrom(this.authService.isAdmin()); // Convert Observable to boolean

    if (isAuthenticated && isAdmin) {
      return true;
    } else {
      console.log('console');

      // Optionally, redirect to unauthorized page or dashboard
      return this.router.createUrlTree(['/not-found']);
    }
  }
}
