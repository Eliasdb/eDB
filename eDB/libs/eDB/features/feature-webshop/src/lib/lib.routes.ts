import { Route } from '@angular/router';
import { WebshopAppComponent } from './webshop.home.component';

export const featureWebshopRoutes: Route[] = [
  {
    path: '',
    component: WebshopAppComponent,
    children: [
      {
        path: '',
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
