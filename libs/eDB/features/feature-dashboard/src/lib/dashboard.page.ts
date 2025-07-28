import { Component } from '@angular/core';
import { UiDropdownComponent, UiSearchComponent } from '@edb/shared-ui';
import { I18nModule } from 'carbon-components-angular';
import { SubscriptionsCollectionContainer } from './components/subscription-collection/subscription-collection.container';

@Component({
  selector: 'platform-dashboard',
  imports: [
    SubscriptionsCollectionContainer,
    UiSearchComponent,
    UiDropdownComponent,
    I18nModule, // ✅ add this!
  ],
  template: `
    <section class="min-h-screen pt-[7rem] bg-slate-50">
      <div class="px-6 flex flex-col gap-8">
        <!-- Title Section -->
        <section class="title">
          <h1 class=" text-3xl text-[#1f2937] font-light">My apps</h1>
        </section>

        <!-- Toolbar Container -->
        <section
          class="toolbar-container flex flex-col sm:flex-row sm:items-center gap-8 w-full"
        >
          <ui-search
            class="w-full sm:basis-[calc(50%_-_1rem)] xl:basis-[calc(61.8%_-_1rem)]"
          ></ui-search>
          <ui-dropdown
            class="w-full sm:basis-[calc(50%_-_1rem)] xl:basis-[calc(38.2%_-_1rem)]"
          ></ui-dropdown>
        </section>

        <!-- Subscriptions Container -->
        <section class="subscriptions-container">
          <platform-subscription-collection></platform-subscription-collection>
        </section>
      </div>
    </section>
  `,
  styleUrls: [],
})
export class DashboardPage {}
