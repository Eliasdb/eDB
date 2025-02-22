import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@eDB-webshop/shared-env';
import {
  FavouriteBook,
  LogOut,
  RawApiDataUser,
  User,
} from '@eDB-webshop/shared-types';
import { injectMutation, injectQuery, injectQueryClient } from '@ngneat/query';
import { BehaviorSubject, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private currentUserSource = new BehaviorSubject<string | undefined | null>(
    undefined,
  );
  private currentTokenSource = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSource.asObservable();
  public currentToken$ = this.currentTokenSource.asObservable();
  private baseURL = environment.apiUrl;

  private http = inject(HttpClient);
  private query = injectQuery();
  private mutation = injectMutation();
  private queryClient = injectQueryClient();

  register(model: any) {
    return this.http.post<User>(this.baseURL + '/register', model).pipe(
      map((user: User) => {
        if (user.id && user.accessToken) {
          localStorage.setItem('user', JSON.stringify(user.userName));
          localStorage.setItem('token', JSON.stringify(user.accessToken));
          localStorage.setItem('id', JSON.stringify(user.id));
          this.currentUserSource.next(user.userName);
          this.currentTokenSource.next(user.accessToken);
          //   this.cartService.userId$.next(user.id);
        }
      }),
    );
  }

  login(model: any) {
    // pipe: does something with observable before subscribing
    return this.http.post<User>(this.baseURL + '/login', model).pipe(
      map((response: User) => {
        const user = response;
        console.log(response);

        if (user.id && user.accessToken) {
          localStorage.setItem('user', JSON.stringify(user.userName));
          localStorage.setItem('id', JSON.stringify(user.id));
          localStorage.setItem('token', JSON.stringify(user.accessToken));
          this.currentUserSource.next(user.userName);
          this.currentTokenSource.next(user.accessToken);
          //   this.cartService.userId$.next(user.id);
        }
      }),
    );
  }

  updateUser() {
    return this.mutation({
      mutationFn: (user: RawApiDataUser) =>
        this.http.put<RawApiDataUser>(
          `http://localhost:8000/api/v1/user`,
          user.data,
        ),
      onSuccess: () =>
        this.queryClient.invalidateQueries({ queryKey: ['USER_DETAILS'] }),
    });
  }

  getUserDetails() {
    return this.query({
      queryKey: ['USER_DETAILS'],
      queryFn: () => {
        return this.http
          .get<RawApiDataUser>(
            `http://localhost:8000/api/v1/user?includeFavourites=true`,
          )
          .pipe(map((response) => response.data));
      },
    });
  }

  public favouriteBook() {
    return this.mutation({
      mutationFn: (book: FavouriteBook) =>
        this.http.post<FavouriteBook>(
          `http://localhost:8000/api/v1/favourites`,
          book,
        ),
      onSuccess: () =>
        this.queryClient.invalidateQueries({ queryKey: ['USER_DETAILS'] }),
    });
  }

  public removeFromFavourites() {
    return this.mutation({
      mutationFn: (id: number) =>
        this.http.delete<FavouriteBook>(
          `http://localhost:8000/api/v1/favourites/${id}`,
        ),
      onSuccess: () =>
        this.queryClient.invalidateQueries({ queryKey: ['USER_DETAILS'] }),
    });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    this.currentUserSource.next(null);

    return this.http.get<LogOut>('http://localhost:8000/api/v1/logout').pipe(
      // projects what we are getting back from API
      map((response) => {
        return response;
      }),
    );
  }

  setCurrentUser(user: string) {
    this.currentUserSource.next(user);
  }

  setCurrentToken(token: string) {
    this.currentTokenSource.next(token);
  }
}
