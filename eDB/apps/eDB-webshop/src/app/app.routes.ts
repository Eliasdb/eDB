import { Route } from '@angular/router';

export const routes: Route[] = [
  {
    path: 'books',
    loadChildren: () =>
      import('@eDB-webshop/feature-book-catalog').then(
        (m) => m.featureBookCatalogRoutes,
      ),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
