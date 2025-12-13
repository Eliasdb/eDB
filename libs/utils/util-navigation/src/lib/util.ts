import { Injectable, inject } from '@angular/core';
import { NavigationEnd, Router, UrlTree } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NavigationLink, WEB_NAVIGATION_LINKS } from './navigation.config';

export interface NavigationLinkWithActive extends NavigationLink {
  isCurrentPage: boolean;
}

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private navigationLinksSubject = new BehaviorSubject<
    NavigationLinkWithActive[]
  >([]);
  navigationLinks$ = this.navigationLinksSubject.asObservable();

  private readonly router = inject(Router);

  constructor() {
    this.initializeNavigationLinks();

    // Update active state on every NavigationEnd event.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.updateCurrentPage());
  }

  private initializeNavigationLinks(): void {
    // Initialize links with isCurrentPage false.
    const initialLinks: NavigationLinkWithActive[] = WEB_NAVIGATION_LINKS.map(
      (link) => ({
        ...link,
        isCurrentPage: false,
      }),
    );
    this.navigationLinksSubject.next(initialLinks);
    // Update active page immediately.
    this.updateCurrentPage();
  }

  private updateCurrentPage(): void {
    const updatedLinks = this.navigationLinksSubject.value.map((link) => {
      const urlTree: UrlTree = this.router.createUrlTree(
        link.id === '' ? ['/'] : ['/', link.id],
      );
      const isActive = this.router.isActive(urlTree, {
        paths: 'exact',
        queryParams: 'exact',
        fragment: 'ignored',
        matrixParams: 'ignored',
      });
      return { ...link, isCurrentPage: isActive };
    });
    this.navigationLinksSubject.next(updatedLinks);
  }

  // Optional: expose a navigate method
  navigateTo(target: string): Promise<boolean> {
    return this.router.navigate([target]).then((result) => {
      this.updateCurrentPage();
      return result;
    });
  }
}
