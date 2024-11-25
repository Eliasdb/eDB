// src/app/services/admin-service/admin.service.ts

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../models/paged-result.model';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:9101/api/admin/users'; // Consider using environment variables
  private http = inject(HttpClient);

  /**
   * Fetches a single page of users with pagination and sorting.
   * @param sortField The field to sort by.
   * @param sortDirection The direction of sorting: 'asc' or 'desc'.
   * @param pageNumber The page number to fetch.
   * @returns An Observable of PagedResult<UserProfile>.
   */
  fetchUsersPage(
    sortField: string = 'Id',
    sortDirection: 'asc' | 'desc' = 'desc',
    pageNumber: number = 1
  ): Observable<PagedResult<UserProfile>> {
    const url = `${this.apiUrl}?pageNumber=${pageNumber}&pageSize=15&sortField=${sortField}&sortDirection=${sortDirection}`;
    return this.http.get<PagedResult<UserProfile>>(url);
  }
}
