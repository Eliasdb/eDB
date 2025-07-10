import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '@eDB-webshop/shared-types';
import { environment } from '@eDB/shared-env';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BooksService {
  #http = inject(HttpClient);

  /** GET /books – returns the whole array */
  getBooks$(): Observable<Book[]> {
    return this.#http.get<Book[]>(`${environment.bookAPIUrl}/books`);
  }
}
