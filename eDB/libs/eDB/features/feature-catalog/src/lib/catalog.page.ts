import { Component, effect, inject } from '@angular/core';
import { CatalogService } from '@eDB/client-catalog';
import { UiTileComponent } from '@eDB/shared-ui';
import { CatalogItem } from '../types/catalog.model';

@Component({
  selector: 'platform-catalog',
  imports: [UiTileComponent],
  template: `
    <div class="catalog">
      <h3>Catalog</h3>
      @if (!isLoading) {
        @if (catalog) {
          <div class="catalog-tiles">
            @for (item of catalog; track item.name) {
              <ui-tile
                [title]="item.name"
                [description]="item.description"
                [tags]="item.tags"
                [id]="item.id"
                (subscribe)="onSubscribe($event)"
              ></ui-tile>
            }
          </div>
        } @else {
          <p>Error loading catalog: {{ error }}</p>
        }
      } @else {
        <p>Loading catalog...</p>
      }
    </div>
  `,
  styleUrls: ['./catalog.page.scss'],
})
export class CatalogPage {
  catalog: (CatalogItem & { tags: any[] })[] | null = null;
  isLoading = true;
  error: string | null = null;

  private catalogService = inject(CatalogService);
  private subscribeMutation =
    this.catalogService.subscribeToApplicationMutation();

  constructor() {
    effect(() => {
      this.catalog = this.catalogService.catalog();
      this.isLoading = this.catalogService.isLoading();
      this.error = this.catalogService.error();
    });
  }

  onSubscribe(appId: number) {
    this.subscribeMutation.mutate(appId, {
      onSuccess: () => {
        console.log('Subscribed to app with ID:', appId);
      },
      onError: (error) => {
        console.error('Failed to subscribe', error);
      },
    });
  }
}
