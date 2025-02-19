// shell-app/src/app/home.component.ts
import { Component } from '@angular/core';
import { UiDropdownComponent, UiSearchComponent } from '@eDB/shared-ui';
import { SubscriptionsCollectionContainer } from './components/subscription-collection/subscription-collection.container';

@Component({
  selector: 'platform-dashboard',
  imports: [
    SubscriptionsCollectionContainer,
    UiSearchComponent,
    UiDropdownComponent,
  ],
  template: `<section class="home-page">
    <section class="wrapper">
      <section class="title">
        <h1>My products</h1>
      </section>

      <section class="toolbar-container">
        <ui-search></ui-search>
        <ui-dropdown></ui-dropdown>
      </section>
      <section class="subscriptions-container">
        <platform-subscription-collection></platform-subscription-collection>
      </section>
    </section>
  </section> `,
  styleUrl: 'dashboard.page.scss',
})
export class DashboardPage {}
