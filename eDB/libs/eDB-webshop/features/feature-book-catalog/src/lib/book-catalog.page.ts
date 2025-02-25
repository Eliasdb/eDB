import { Component, inject } from '@angular/core';
import { BooksService } from '@eDB-webshop/client-books';
import { LoadingStateComponent } from '@eDB-webshop/ui-webshop';
import { BookParamService } from '@eDB-webshop/util-book-params';
import { filterSuccessResult } from '@ngneat/query';
import { combineLatest, map, shareReplay, switchMap } from 'rxjs';
import {
  BooksCollectionGridOverviewComponent,
  BooksCollectionListOverviewComponent,
  BooksFiltersComponent,
  BooksSortBarComponent,
} from './components/index';

import { CommonModule } from '@angular/common';
import {
  AUTHORS_QUERY_PARAM,
  GENRE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from './types/book-param.type';

@Component({
  standalone: true,
  imports: [
    BooksCollectionGridOverviewComponent,
    BooksCollectionListOverviewComponent,
    BooksFiltersComponent,
    BooksSortBarComponent,
    LoadingStateComponent,
    CommonModule,
  ],
  selector: 'books-container',
  template: `
    <section class="page">
      <section class="page-title w-full">
        <h2>Webshop</h2>
      </section>
      <section class="books-wrapper">
        <section class="books-container">
          <book-filters
            [value]="query$ | async"
            [bookStatus]="status$ | async"
            [activeGenre]="genre$ | async"
            (search)="onSearch($event)"
            (filterGenre)="filterGenre($event)"
            (filterStatus)="filterStatus($event)"
            (clearFilters)="clearFilters()"
          />
          <section class="books">
            <books-sort-bar
              [showList]="showList"
              [bookCount]="(totalBooksCount$ | async) || 0"
              [selectedSort]="(sort$ | async) || 'title,asc'"
              (sort)="sortBy($event)"
              (clickEvent)="toggleShowList($event)"
            />

            @if (booksResults$ | async; as result) {
              @if (result.isSuccess) {
                <section class="collection-container">
                  <books-collection-grid-overview
                    [books]="(books$ | async) || []"
                    *ngIf="!showList"
                  />
                  <books-collection-list-overview
                    *ngIf="showList"
                    [books]="(books$ | async) || []"
                  />
                </section>

                <!-- <div class="pag-container"><paginator /></div> -->
              }
              @if (result.isLoading) {
                <books-loading-state></books-loading-state>
              }
              @if (result.isError) {
                <p>Error</p>
              }
            }
          </section>
        </section>
      </section>
    </section>
  `,
  styleUrls: ['./book-catalog.page.scss'],
})
export class BooksCollectionContainer {
  private booksService = inject(BooksService);
  private bookParamService = inject(BookParamService);

  // protected books = inject(BooksService).getBooks();
  protected author$ = this.bookParamService.author$;
  protected genre$ = this.bookParamService.genre$;
  protected query$ = this.bookParamService.query$;
  protected status$ = this.bookParamService.status$;
  protected sort$ = this.bookParamService.sort$;

  public showList: boolean = false;

  protected booksResults$ = combineLatest([
    this.query$,
    // this.author$,
    this.genre$,
    this.status$,
    this.sort$,
    // whenever these change value, it will start a call
  ]).pipe(
    switchMap(
      ([search, genre, status, sort]) =>
        this.booksService.queryBooks({
          search,
          genre,
          status,
          sort,
        }).result$,
    ),
    shareReplay({ bufferSize: 1, refCount: false }),
  );

  protected totalBooksCount$ = this.booksResults$.pipe(
    filterSuccessResult(),
    map((res) => res.data.count),
  );

  protected books$ = this.booksResults$.pipe(
    // don't need to subscribe because async pipe does it
    filterSuccessResult(),
    map((res) => res.data?.items),
  );

  toggleShowList(state: boolean): void {
    this.showList = state;
  }

  protected onSearch(query: string) {
    this.bookParamService.navigate({
      [AUTHORS_QUERY_PARAM]: query,
      [SEARCH_QUERY_PARAM]: query,
    });
  }

  protected filterGenre(genre: string) {
    this.bookParamService.navigate({ [GENRE_QUERY_PARAM]: genre });
  }

  protected filterStatus(status: string) {
    this.bookParamService.navigate({ [STATUS_QUERY_PARAM]: status });
  }

  protected sortBy(sort: string) {
    this.bookParamService.navigate({ [SORT_QUERY_PARAM]: sort });
  }

  protected clearFilters() {
    this.bookParamService.clearParams();
  }
}
