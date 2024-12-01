import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { UiTileComponent } from '@eDB/shared-ui';
import { CatalogItem } from '../../../models/catalog.model';
import { CatalogService } from '../../../services/catalog-service/catalog.service';

@Component({
  selector: 'platform-catalog',
  standalone: true,
  imports: [CommonModule, UiTileComponent],
  template: `
    <div class="catalog">
      <h3>Catalog</h3>
      <ng-container *ngIf="!isLoading; else loading">
        <div class="catalog-tiles" *ngIf="catalog; else error">
          <ui-tile
            *ngFor="let item of catalog"
            [title]="item.name"
            [description]="item.description"
            [tags]="item.tags"
          ></ui-tile>
        </div>
      </ng-container>
      <ng-template #loading>
        <p>Loading catalog...</p>
      </ng-template>
      <ng-template #error>
        <p>Error loading catalog: {{ error }}</p>
      </ng-template>
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
