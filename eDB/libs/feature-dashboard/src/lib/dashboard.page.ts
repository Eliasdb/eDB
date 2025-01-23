// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { SubscriptionsCollectionContainer } from './components/subscription-collection/subscription-collection.container';

@Component({
  selector: 'platform-dashboard',
  imports: [SubscriptionsCollectionContainer],
  template: `<section class="home-page">
    <platform-subscription-collection></platform-subscription-collection>
  </section> `,
  styleUrl: 'dashboard.page.scss',
})
export class DashboardPage {}
