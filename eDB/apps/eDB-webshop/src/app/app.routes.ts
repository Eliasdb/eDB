import { Route } from '@angular/router';
import { AppComponent } from './app.component';

export const webshopRoutes: Route[] = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('@eDB-webshop/feature-book-catalog').then(
            (m) => m.featureBookCatalogRoutes,
          ),
      },
    ],
  },
];
