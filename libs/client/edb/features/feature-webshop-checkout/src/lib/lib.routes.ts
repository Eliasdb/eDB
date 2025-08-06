import { Route } from '@angular/router';

export const featureCheckoutRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/checkout.page').then((m) => m.CheckoutPageComponent),
  },
  {
    path: 'success',
    loadComponent: () =>
      import('./pages/checkout-success.page').then(
        (m) => m.CheckoutSuccessPageComponent,
      ),
  },
];
