import { Component, inject } from '@angular/core';
import { CatalogService } from '@eDB/client-catalog';
import { UiComboboxComponent, UiTileComponent } from '@eDB/shared-ui';
import { ListItem, NotificationService } from 'carbon-components-angular';

@Component({
  selector: 'platform-catalog',
  imports: [UiTileComponent, UiComboboxComponent],
  template: `
    <section
      class="relative bg-white flex flex-col items-center min-h-screen pt-20  overflow-hidden"
    >
      <!-- Header & ComboBox -->
      <section
        class="relative z-10 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-6  bg-[#1f2937]"
      >
        <section>
          <h1 class="my-4 mt-8 text-3xl">Catalog</h1>
          <ui-combobox label="Filter by tags." [items]="items"></ui-combobox>
        </section>
      </section>

      <!-- Catalog tiles -->
      <section class="relative z-10 w-full mt-8 mb-16 px-6">
        @if (!isLoading()) {
          @if (catalog() && catalog().length > 0) {
            <div class=" grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <!-- Reserve first cell with an invisible tile for layout -->

              @for (item of catalog(); track item.name) {
                <ui-tile
                  [title]="item.name"
                  [description]="item.description"
                  [tags]="item.tags"
                  [id]="item.id"
                  [isSubscribed]="item.isSubscribed"
                  (subscribe)="onSubscribe($event)"
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
export class CatalogPage {
  private catalogService = inject(CatalogService);
  private notificationService = inject(NotificationService);

  protected items: ListItem[] = [
    {
      content: '.NET',
      selected: false,
    },
    {
      content: 'Angular',
      selected: false,
    },
    {
      content: 'React',
      selected: false,
    },
    {
      content: 'Postgres',
      selected: false,
    },
  ];

  protected catalog = this.catalogService.catalog;
  protected isLoading = this.catalogService.isLoading;
  protected error = this.catalogService.error;

  private toggleSubscribeMutation =
    this.catalogService.subscribeToApplicationMutation();

  trackByName(index: number, item: any): any {
    return item.name;
  }

  onSubscribe(appId: number) {
    this.toggleSubscribeMutation.mutate(appId, {
      onSuccess: () => {
        this.handleSubscriptionToggle(appId),
          console.log('Subscribed to app with ID:', appId);
      },
      onError: (error) => {
        console.error('Failed to subscribe', error);
      },
    });
  }

  private handleSubscriptionToggle(appId: number): void {
    this.notificationService.showNotification({
      type: 'success',
      title: 'Subscription',
      message: 'Succesful',
      duration: 4000,
    });
  }
}
