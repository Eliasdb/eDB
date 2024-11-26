import { CommonModule } from '@angular/common';
import { Component, effect, inject } from '@angular/core';
import { CatalogItem } from '../../../models/catalog.model';
import { CatalogService } from '../../../services/catalog-service/catalog.service';

@Component({
  selector: 'platform-catalog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="catalog">
      <h1>Catalog</h1>
      <ng-container *ngIf="!isLoading; else loading">
        <ul *ngIf="catalog; else error">
          <li *ngFor="let item of catalog">
            <h3>{{ item.name }}</h3>
            <p>{{ item.description }}</p>
          </li>
        </ul>
      </ng-container>
      <ng-template #loading>
        <p>Loading catalog...</p>
      </ng-template>
      <ng-template #error>
        <p>Error loading catalog: {{ error }}</p>
      </ng-template>
    </div>
  `,
})
export class CatalogContainer {
  catalog: CatalogItem[] | null = null;
  isLoading = true;
  error: string | null = null;

  private catalogService = inject(CatalogService);

  constructor() {
    // Use effect within the constructor's injection context
    effect(() => {
      this.catalog = this.catalogService.catalog();
      this.isLoading = this.catalogService.isLoading();
      this.error = this.catalogService.error();
    });
  }
}
