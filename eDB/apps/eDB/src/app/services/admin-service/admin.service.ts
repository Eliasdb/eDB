// admin.service.ts

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { PaginatedResponse } from '../../models/paged-result.model';
import { UserProfile } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly apiUrl = 'http://localhost:9101/api/admin/users';
  private http = inject(HttpClient);

  /**
   * Maps frontend sortField to backend sortField.
   * @param sortField Frontend sort field.
   * @returns Backend sort field.
   */
  private mapSortFieldToBackend(sortField: string): string {
    const fieldMapping: { [key: string]: string } = {
      firstname: 'firstName',
      lastname: 'lastName',
      email: 'email',
      role: 'role',
      state: 'state',
      id: 'id',
    };
    return fieldMapping[sortField.toLowerCase()] || 'id';
  }

  /**
   * Fetches users with given parameters.
   * @param cursor Cursor for pagination (represents the last User's sort field value or a composite object).
   * @param searchParam Search query.
   * @param sortParam Sort parameters in the format "field,direction".
   * @returns Promise of PaginatedResponse.
   */
  async queryUsers(
    cursor: number | string | null,
    searchParam?: string,
    sortParam?: string
  ): Promise<PaginatedResponse<UserProfile>> {
    let params = new HttpParams();

    if (cursor !== null && cursor !== undefined) {
      if (typeof cursor === 'string') {
        try {
          const parsedCursor = JSON.parse(cursor);

          // Check if it's a composite cursor
          if (
            parsedCursor.value !== undefined &&
            parsedCursor.id !== undefined
          ) {
            params = params.set('cursor', parsedCursor.value);
            // params = params.set('cursorId', parsedCursor.id);
          } else {
            // Simple string cursor
            params = params.set('cursor', parsedCursor);
          }
        } catch (error) {
          console.error('Failed to parse cursor:', error);
          // Fallback to simple string cursor
          params = params.set('cursor', cursor);
        }
      } else {
        // Numeric cursor
        params = params.set('cursor', cursor.toString()); // Convert number to string
      }
    }

    if (searchParam && searchParam.trim() !== '') {
      params = params.set('search', searchParam.trim());
    }

    if (sortParam && sortParam.trim() !== '') {
      const [sortField, sortDirection] = sortParam.split(',');
      const backendSortField = this.mapSortFieldToBackend(sortField);
      const backendSortParam = `${backendSortField},${sortDirection}`;
      params = params.set('sort', backendSortParam);
    }

    console.log(`Fetching users with params: ${params.toString()}`);

    return lastValueFrom(
      this.http.get<PaginatedResponse<UserProfile>>(this.apiUrl, { params })
    );
  }
}
