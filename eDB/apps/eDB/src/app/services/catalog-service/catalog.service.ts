import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { CatalogItem } from '../../models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  // Signals for reactive state management
  catalog = signal<CatalogItem[] | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  http = inject(HttpClient);

  constructor() {
    // Fetch catalog data on service initialization
    this.fetchCatalog();
  }

  fetchCatalog() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http
      .get<CatalogItem[]>(`${environment.apiBaseUrl}/applications`)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            this.catalog.set(data);
            this.error.set(null);
          } else {
            this.catalog.set(null);
            this.error.set('Catalog is empty');
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          this.catalog.set(null);
          this.error.set('Error fetching catalog: ' + err.message);
          this.isLoading.set(false);
        },
      });
  }
}
