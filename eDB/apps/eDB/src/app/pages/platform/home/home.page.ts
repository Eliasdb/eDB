// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { SubscriptionsCollectionContainer } from '../../../components/platform/home/subscription-collection/subscription-collection.container';

@Component({
  selector: 'platform-home',
  imports: [SubscriptionsCollectionContainer],
  template: `<section class="home-page">
    <platform-subscription-collection></platform-subscription-collection>
  </section> `,
  styleUrl: 'home.page.scss',
})
export class HomePage {}
