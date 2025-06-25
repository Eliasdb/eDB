import { Component, inject } from '@angular/core';
import { CatalogService } from '@eDB/client-catalog';
import { UiComboboxComponent, UiTileComponent } from '@edb/shared-ui';
import {
  ListItem,
  NotificationModule,
  NotificationService,
} from 'carbon-components-angular';

interface CatalogItem {
  id: number;
  name: string;
  description: string;
  tags: string[];
  isSubscribed: boolean;
}

@Component({
  selector: 'lib-catalog', // ✅ fixed prefix
  standalone: true,
  imports: [UiTileComponent, UiComboboxComponent, NotificationModule],
  providers: [NotificationService],
  template: `
    <section
      class="relative bg-white flex flex-col items-center min-h-screen pt-20 overflow-hidden"
    >
      <section
        class="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-6 bg-[#1f2937]"
      >
        <section>
          <h1 class="my-4 mt-8 text-3xl text-white">Catalog</h1>
          <ui-combobox label="Filter by tags." [items]="items"></ui-combobox>
        </section>
      </section>

      <section class="relative z-10 w-full mt-8 mb-16 px-6">
        @if (!isLoading()) {
          @if (catalog() && catalog().length > 0) {
            <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              @for (item of catalog(); track item.name) {
                <ui-tile
                  [title]="item.name"
                  [description]="item.description"
                  [tags]="item.tags"
                  [id]="item.id"
                  [isSubscribed]="item.isSubscribed"
                  (subscribe)="onSubscribe(item.id)"
                ></ui-tile>
              }
            </div>
          } @else {
            <p class="text-white text-center">No catalog items found.</p>
          }
        } @else {
          <p class="text-gray-300 text-center">Loading catalog...</p>
        }
      </section>
    </section>
  `,
  styles: [],
})
export class CatalogPageComponent {
  private catalogService = inject(CatalogService);
  private notificationService = inject(NotificationService);

  protected items: ListItem[] = [
    { content: '.NET', selected: false },
    { content: 'Angular', selected: false },
    { content: 'React', selected: false },
    { content: 'Postgres', selected: false },
  ];

  protected catalog = this.catalogService.catalog;
  protected isLoading = this.catalogService.isLoading;
  protected error = this.catalogService.error;

  private toggleSubscribeMutation =
    this.catalogService.subscribeToApplicationMutation();

  trackByName(index: number, item: CatalogItem): number {
    return item.id;
  }

  onSubscribe(appId: number) {
    this.toggleSubscribeMutation.mutate(appId, {
      onSuccess: () => {
        this.handleSubscriptionToggle();
        console.log('Subscribed to app with ID:', appId);
      },
      onError: (error) => {
        console.error('Failed to subscribe', error);
      },
    });
  }

  private handleSubscriptionToggle(): void {
    this.notificationService.showNotification({
      type: 'success',
      title: 'Subscription',
      message: 'Successful',
      duration: 4000,
    });
  }
}
