import { Component, inject } from '@angular/core';
import { CatalogService } from '@eDB/client-catalog';
import { UiComboboxComponent, UiTileComponent } from '@eDB/shared-ui';
import { ListItem, NotificationService } from 'carbon-components-angular';

@Component({
  selector: 'platform-catalog',
  standalone: true,
  imports: [UiTileComponent, UiComboboxComponent],
  template: `
    <section
      class="relative bg-white flex flex-col items-center min-h-screen pt-32 px-4 overflow-hidden"
    >
      <!-- Background Shapes for a futuristic look with breathing animation -->
      <!-- Neon rotated polygon -->
      <div
        class="absolute top-[-12rem] left-[-12rem] w-96 h-96 opacity-30 animate-pulse"
        style="background: linear-gradient(135deg, #0f62fe, #6f2da8); clip-path: polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%); transform: rotate(20deg);"
      ></div>
      <!-- Large neon circle -->
      <div
        class="absolute bottom-[-16rem] right-[-16rem] w-[36rem] h-[36rem] rounded-full opacity-20 animate-pulse"
        style="background: radial-gradient(circle, #0f62fe, #00d7c3, transparent);"
      ></div>
      <!-- Futuristic rotated rectangle -->
      <div
        class="absolute top-20 right-[-10rem] w-80 h-48 opacity-40 animate-pulse "
        style="background: linear-gradient(90deg, #da1e28, #0f62fe); transform: rotate(-15deg);"
      ></div>
      <!-- Neon diamond shape -->
      <div
        class="absolute bottom-24 left-[-8rem] w-64 h-64 opacity-40 animate-bounce"
        style="background: linear-gradient(135deg, #00d7c3, #0f62fe); transform: rotate(45deg);"
      ></div>
      <!-- Vertical neon stripe -->
      <div
        class="absolute top-0 right-0 h-full w-6 opacity-30 animate-bounce"
        style="background: linear-gradient(180deg, #f1c21b, transparent);"
      ></div>

      <!-- Header & ComboBox -->
      <section
        class="relative z-10 w-full max-w-[80rem] grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
      >
        <section class="">
          <h3 class="mb-4">Catalog</h3>
          <ui-combobox label="Filter by tags." [items]="items"></ui-combobox>
        </section>
        <div></div>
      </section>

      <!-- Catalog tiles -->
      <section class="relative z-10 w-full max-w-[80rem] mt-8 mb-16 ">
        @if (!isLoading()) {
          @if (catalog() && catalog().length > 0) {
            <div class=" grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 ">
              <!-- Reserve first cell with an invisible tile for layout -->
              <ui-tile
                title="hidden"
                description="hidden tile"
                class="hidden lg:block lg:invisible
"
              ></ui-tile>
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
