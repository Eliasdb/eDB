import { Route } from '@angular/router';
import { SingleBookPage } from './single-book.page';
import { WebshopAppComponent } from './webshop.home.component';

export const featureWebshopRoutes: Route[] = [
  {
    path: '',
    component: WebshopAppComponent,
    children: [
      {
        path: '',

        loadChildren: () =>
          import('@edb/feature-webshop-catalog').then(
            (m) => m.featureBookCatalogRoutes,
          ),
      },
      { path: 'books/:id', component: SingleBookPage },

      {
        path: 'checkout',
        loadChildren: () =>
          import('@edb/feature-webshop-checkout').then(
            (m) => m.featureCheckoutRoutes,
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('@edb/feature-webshop-orders').then(
            (m) => m.featureOrdersRoutes,
          ),
      },
    ],
  },
];
