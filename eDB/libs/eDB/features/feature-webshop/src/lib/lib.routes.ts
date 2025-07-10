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
          import('@eDB-webshop/feature-book-catalog').then(
            (m) => m.featureBookCatalogRoutes,
          ),
      },
      { path: 'books/:id', component: SingleBookPage },

      {
        path: 'checkout',
        loadChildren: () =>
          import('@eDB-webshop/feature-checkout').then(
            (m) => m.featureCheckoutRoutes,
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('@edb-webshop/feature-orders').then(
            (m) => m.featureOrdersRoutes,
          ),
      },
    ],
  },
];
