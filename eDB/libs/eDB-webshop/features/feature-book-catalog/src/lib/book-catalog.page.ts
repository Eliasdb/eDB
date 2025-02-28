import { Component, computed, effect, inject } from '@angular/core';

import { BooksService } from '@eDB-webshop/client-books';
import { BookParamService } from '@eDB-webshop/util-book-params';

import {
  BooksCollectionGridOverviewComponent,
  BooksCollectionListOverviewComponent,
  BooksFiltersComponent,
  BooksSortBarComponent,
} from './components/index';

import { LoadingStateComponent } from '@eDB-webshop/ui-webshop';

import {
  AUTHORS_QUERY_PARAM,
  GENRE_QUERY_PARAM,
  SEARCH_QUERY_PARAM,
  SORT_QUERY_PARAM,
  STATUS_QUERY_PARAM,
} from './types/book-param.type';

@Component({
  imports: [
    BooksCollectionGridOverviewComponent,
    BooksCollectionListOverviewComponent,
    BooksFiltersComponent,
    BooksSortBarComponent,
    LoadingStateComponent,
  ],
  selector: 'books-container',
  template: `
    <section
      class="flex flex-col items-center mt-40 max-w-[90%] xl:max-w-[60%] mx-auto"
    >
      <!-- Page Title -->
      <section class="w-full">
        <h2>Webshop</h2>
      </section>

      <!-- Books Wrapper -->
      <section class="w-full">
        <section
          class="flex flex-col xl:flex-row mt-8 mb-60 gap-12 justify-between"
        >
          <!-- Filters Component -->
          <book-filters
            [value]="query()"
            [bookStatus]="status()"
            [activeGenre]="genre()"
            (search)="onSearch($event)"
            (filterGenre)="filterGenre($event)"
            (filterStatus)="filterStatus($event)"
            (clearFilters)="clearFilters()"
          ></book-filters>

          <!-- Books Section -->
          <section class="flex flex-col items-stretch">
            <!-- Sort Bar Component -->
            <books-sort-bar
              [showList]="showList"
              [bookCount]="totalBooksCount() || 0"
              [selectedSort]="sort() || 'title,asc'"
              (sort)="onSort($event)"
              (clickEvent)="toggleShowList($event)"
            ></books-sort-bar>

            <!-- Books Query Results -->
            @if (booksQuery(); as result) {
              @if (result.isSuccess()) {
                <section class="w-full box-border">
                  @if (showList) {
                    <books-collection-list-overview
                      [books]="books() || []"
                    ></books-collection-list-overview>
                  } @else {
                    <books-collection-grid-overview
                      [books]="books() || []"
                    ></books-collection-grid-overview>
                  }
                </section>
                <!-- Example paginator container: 
                <div class="mt-20">
                  <paginator class="bg-[#24262b]"></paginator>
                </div> -->
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
})
export class BooksCollectionContainer {
  private booksService = inject(BooksService);
  private bookParamService = inject(BookParamService);

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
