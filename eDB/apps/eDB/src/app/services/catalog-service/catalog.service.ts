import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { CatalogItem } from '../../models/catalog.model';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly apiUrl = 'http://localhost:9101/api/applications';

  // Signals for reactive state management
  catalog = signal<CatalogItem[] | null>(null);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {
    // Fetch catalog data on service initialization
    this.fetchCatalog();
  }

  fetchCatalog() {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<CatalogItem[]>(this.apiUrl).subscribe({
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
