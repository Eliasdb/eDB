import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const webshopRoutes: Route[] = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: 'catalog',
        loadChildren: () =>
          import('@eDB-webshop/feature-book-catalog').then(
            (m) => m.featureBookCatalogRoutes,
          ),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('@eDB-webshop/feature-checkout').then(
            (m) => m.featureCheckoutRoutes,
          ),
      },
    ],
  },
];
