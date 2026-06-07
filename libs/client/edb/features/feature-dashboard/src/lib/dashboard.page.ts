import { Component, computed, inject, signal } from '@angular/core';
import { DashboardService } from '@eDB/client-dashboard';
import { UiDropdownComponent, UiSearchComponent } from '@edb/shared-ui';
import { I18nModule } from 'carbon-components-angular';
import { SubscriptionsCollectionContainer } from './components/subscription-collection/subscription-collection.container';

type DropdownItem = { content: string; selected: boolean };

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
            placeholder="Search apps"
            (valueChange)="updateSearch($event)"
            (clear)="clearSearch()"
          ></ui-search>
          <ui-dropdown
            class="w-full sm:basis-[calc(50%_-_1rem)] xl:basis-[calc(38.2%_-_1rem)]"
            [items]="tagFilterItems()"
            (selectionChange)="updateTagFilter($event)"
          ></ui-dropdown>
        </section>

        <!-- Subscriptions Container -->
        <section class="subscriptions-container">
          <platform-subscription-collection
            [subscriptions]="filteredSubscriptions()"
          ></platform-subscription-collection>
        </section>
      </div>
    </section>
  `,
  styleUrls: [],
})
export class DashboardPage {
  private dashboardService = inject(DashboardService);

  protected readonly searchTerm = signal('');
  protected readonly selectedTag = signal('All apps');
  protected readonly subscriptions = this.dashboardService.subscriptions;
  private readonly tags = this.dashboardService.tags;

  protected readonly tagFilterItems = computed<DropdownItem[]>(() => {
    const tags = this.tags().sort((a, b) => a.localeCompare(b));

    return ['All apps', ...tags].map((tag) => ({
      content: tag,
      selected: this.selectedTag() === tag,
    }));
  });

  protected readonly filteredSubscriptions = computed(() => {
    const search = this.searchTerm().trim().toLowerCase();
    const selectedTag = this.selectedTag();

    return this.subscriptions().filter((app) => {
      const matchesSearch =
        search.length === 0 ||
        [app.name, app.description, app.routePath, ...(app.tags ?? [])].some(
          (value) => value?.toLowerCase().includes(search),
        );

      const matchesTag =
        selectedTag === 'All apps' || (app.tags ?? []).includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  });

  protected updateSearch(value: string): void {
    this.searchTerm.set(value);
    this.dashboardService.setFilters(value, this.selectedTag());
  }

  protected clearSearch(): void {
    this.searchTerm.set('');
    this.dashboardService.setFilters('', this.selectedTag());
  }

  protected updateTagFilter(item: DropdownItem): void {
    this.selectedTag.set(item?.content || 'All apps');
    this.dashboardService.setFilters(this.searchTerm(), this.selectedTag());
  }
}
