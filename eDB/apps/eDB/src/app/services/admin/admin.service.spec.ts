import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { QueryClient } from '@tanstack/angular-query-experimental';
import { environment } from '../../environments/environment.prod';
import { PaginatedResponse } from '../../models/paged-result.model';
import { UserProfile } from '../../models/user.model';
import { AdminService } from './admin.service';

describe('AdminService', () => {
  let service: AdminService;
  let httpMock: HttpTestingController;
  let queryClient: QueryClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminService, QueryClient, provideHttpClientTesting],
    });
    service = TestBed.inject(AdminService);
    httpMock = TestBed.inject(HttpTestingController);
    queryClient = TestBed.inject(QueryClient);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('#queryAllUsers', () => {
    it('should fetch users with correct parameters', async () => {
      const mockResponse: PaginatedResponse<UserProfile> = {
        data: [
          {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            role: 'admin',
            state: 'active',
            country: '',
            company: '',
            displayName: '',
            preferredLanguage: '',
            title: '',
            address: '',
          },
          // Add more mock users as needed
        ],
        cursor: null,
      };

      const cursor = 10;
      const searchParam = 'John';
      const sortParam = 'firstname,asc';

      const promise = service.queryAllUsers(cursor, searchParam, sortParam);

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiAdminUrl}/users` &&
          request.params.get('cursor') === cursor.toString() &&
          request.params.get('search') === searchParam &&
          request.params.get('sort') === 'firstName,asc'
        );
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should handle cursor as a stringified JSON object', async () => {
      const mockResponse: PaginatedResponse<UserProfile> = {
        items: [],
        total: 0,
        cursor: null,
      };

      const cursorObj = { value: 'someValue', id: 5 };
      const cursor = JSON.stringify(cursorObj);

      const promise = service.queryAllUsers(cursor);

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiAdminUrl}/users` &&
          request.params.get('cursor') === JSON.stringify(cursorObj)
        );
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });

    it('should fallback to raw cursor if JSON parsing fails', async () => {
      const mockResponse: PaginatedResponse<UserProfile> = {
        items: [],
        total: 0,
        cursor: null,
      };

      const invalidCursor = 'invalid_json';

      const promise = service.queryAllUsers(invalidCursor);

      const req = httpMock.expectOne((request) => {
        return (
          request.url === `${environment.apiAdminUrl}/users` &&
          request.params.get('cursor') === invalidCursor
        );
      });

      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);

      const result = await promise;
      expect(result).toEqual(mockResponse);
    });
  });

  describe('#deleteUserMutation', () => {
    it('should delete a user and invalidate the users query', async () => {
      const userId = 1;

      const mutation = service.deleteUserMutation();
      const deletePromise = mutation.mutateAsync(userId);

      const req = httpMock.expectOne(
        `${environment.apiAdminUrl}/users/${userId}`,
      );
      expect(req.request.method).toBe('DELETE');
      req.flush(null);

      await deletePromise;

      // Check if the 'users' query has been invalidated
      // const isInvalidated = queryClient.isInvalidated(['users']);
      expect(isInvalidated).toBeTruthy();
    });
  });

  // Add more describe blocks for other methods as needed
});
