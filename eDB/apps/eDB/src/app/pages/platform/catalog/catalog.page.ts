import { Component, effect, inject } from '@angular/core';
import { UiTileComponent } from '@eDB/shared-ui';
import { CatalogItem } from '../../../models/catalog.model';
import { CatalogService } from '../../../services/catalog-service/catalog.service';

@Component({
  selector: 'platform-catalog',
  standalone: true,
  imports: [UiTileComponent],
  template: `
    <div class="catalog">
      <h3>Catalog</h3>
      @if (!isLoading) {
        @if (catalog) {
          <div class="catalog-tiles">
            @for (item of catalog; track item.id) {
              <ui-tile
                [title]="item.name"
                [description]="item.description"
                [tags]="item.tags"
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

  constructor() {
    effect(() => {
      this.catalog = this.catalogService.catalog();
      this.isLoading = this.catalogService.isLoading();
      this.error = this.catalogService.error();
    });
  }
}
