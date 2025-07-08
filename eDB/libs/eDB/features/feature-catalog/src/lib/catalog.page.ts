import { Component, inject } from '@angular/core';
import { CatalogService } from '@eDB/client-catalog';
import { UiComboboxComponent, UiTileComponent } from '@edb/shared-ui';
import {
  ListItem,
  NotificationModule,
  NotificationService,
  SkeletonModule,
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
  imports: [
    UiTileComponent,
    UiComboboxComponent,
    NotificationModule,
    SkeletonModule,
  ],
  providers: [NotificationService],
  template: `
    <section
      class="relative bg-slate-50 flex flex-col items-center min-h-screen pt-20 overflow-hidden"
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
        @if (isLoading()) {
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @for (_ of [1, 2, 3]; track _) {
              <ui-tile [loading]="true"></ui-tile>
            }
          </div>
        } @else if (catalog() && catalog().length > 0) {
          <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            @for (item of catalog(); track item.id) {
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
      </section>
    </section>
  `,
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

  onSubscribe(appId: number) {
    const item = this.catalog().find((i) => i.id === appId);
    const wasSubscribed = item?.isSubscribed ?? false;

    this.toggleSubscribeMutation.mutate(appId, {
      onSuccess: () => {
        if (wasSubscribed) {
          this.handleUnSubscriptionToggle();
          console.log('Unsubscribed from app with ID:', appId);
        } else {
          this.handleSubscriptionToggle();
          console.log('Subscribed to app with ID:', appId);
        }
      },
      onError: (error) => {
        console.error('Failed to toggle subscription', error);
      },
    });
  }

  private handleSubscriptionToggle(): void {
    this.notificationService.showNotification({
      type: 'success',
      title: 'Subscription',
      message: 'Successfully subscribed!',
      duration: 4000,
    });
  }

  private handleUnSubscriptionToggle(): void {
    this.notificationService.showNotification({
      type: 'error',
      title: 'Subscription',
      message: 'Successfully unsubscribed',
      duration: 4000,
    });
  }
}
