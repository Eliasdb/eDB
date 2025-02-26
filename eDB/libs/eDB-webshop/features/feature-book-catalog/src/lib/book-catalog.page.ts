import { Component, computed, effect, inject } from '@angular/core';
import { BooksService } from '@eDB-webshop/client-books';
import { LoadingStateComponent } from '@eDB-webshop/ui-webshop';
import { BookParamService } from '@eDB-webshop/util-book-params';
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
            [value]="query()"
            [bookStatus]="status()"
            [activeGenre]="genre()"
            (search)="onSearch($event)"
            (filterGenre)="filterGenre($event)"
            (filterStatus)="filterStatus($event)"
            (clearFilters)="clearFilters()"
          />
          <section class="books">
            <books-sort-bar
              [showList]="showList"
              [bookCount]="totalBooksCount() || 0"
              [selectedSort]="sort() || 'title,asc'"
              (sort)="onSort($event)"
              (clickEvent)="toggleShowList($event)"
            />

            @if (booksQuery(); as result) {
              @if (result.isSuccess()) {
                <section class="collection-container">
                  @if (showList) {
                    <books-collection-list-overview [books]="books() || []" />
                  } @else {
                    <books-collection-grid-overview [books]="books() || []" />
                  }
                </section>

                <!-- <div class="pag-container"><paginator /></div> -->
              }
              @if (result.isLoading()) {
                <books-loading-state></books-loading-state>
              }
              @if (result.isError()) {
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
  protected author = this.bookParamService.authorSignal;
  protected genre = this.bookParamService.genreSignal;
  protected query = this.bookParamService.querySignal;
  protected status = this.bookParamService.statusSignal;
  protected sort = this.bookParamService.sortSignal;

  public showList: boolean = false;

  private updateEffect = effect(() => {
    const search = this.query();
    const author = this.author();
    const genre = this.genre();
    const status = this.status();
    const sort = this.sort();

    this.booksService.updateQueryBooks({
      search,
      author,
      genre,
      status,
      sort,
    });
  });

  protected booksQuery = computed(() => this.booksService.queryBooks);

  protected totalBooksCount = computed(() => {
    const result = this.booksQuery().data();
    return result ? result.data.count : 0;
  });

  protected books = computed(() => {
    const result = this.booksQuery().data();
    return result ? result.data.items : [];
  });

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

  protected onSort(sort: string) {
    this.bookParamService.navigate({ [SORT_QUERY_PARAM]: sort });
  }

  protected clearFilters() {
    this.bookParamService.clearParams();
  }
}
