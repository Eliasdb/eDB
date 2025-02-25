import { Route } from '@angular/router';

export const webshopRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@eDB-webshop/feature-book-catalog').then(
        (m) => m.featureBookCatalogRoutes,
      ),
  },
];
