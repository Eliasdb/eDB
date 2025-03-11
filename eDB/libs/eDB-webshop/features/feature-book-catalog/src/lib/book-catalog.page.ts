import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';

import { BooksService } from '@eDB-webshop/client-books';
import { BookParamService } from '@eDB-webshop/util-book-params';

import {
  BooksCollectionGridOverviewComponent,
  BooksCollectionListOverviewComponent,
  BooksFiltersComponent,
  BooksSortBarComponent,
} from './components/index';

import { LoadingStateComponent } from '@eDB-webshop/ui-webshop';

import { CommonModule } from '@angular/common';
import { UiLoadingSpinnerComponent } from '../../../../../shared/ui/src/lib/components/loading/loading-spinner.component';
import {
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
    CommonModule,
    UiLoadingSpinnerComponent,
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
            <section class="books-list">
              <!-- Books Query Results -->
              @if (booksInfiniteQuery.isSuccess(); as result) {
                <section class="w-full box-border">
                  @if (showList) {
                    <books-collection-list-overview
                      [books]="flattenedBooks() || []"
                    ></books-collection-list-overview>
                  } @else {
                    <books-collection-grid-overview
                      [books]="flattenedBooks() || []"
                    ></books-collection-grid-overview>
                  }
                </section>
              }
              @if (booksInfiniteQuery.isLoading()) {
                <books-loading-state></books-loading-state>
              }
              @if (booksInfiniteQuery.isError()) {
                <p>Error</p>
              }
            </section>

            <!-- Sentinel element for triggering fetch -->
            <div #scrollAnchor class="scroll-anchor">
              <!-- Optionally show a loading spinner/text when fetching next page -->
              <ng-container *ngIf="booksInfiniteQuery.isFetchingNextPage()">
                <p>Loading more...</p>
                <!-- Replace with your spinner component if available -->
                <ui-loading></ui-loading>
              </ng-container>
            </div>

            @if (booksInfiniteQuery.isLoading()) {
              <books-loading-state></books-loading-state>
            }
            @if (booksInfiniteQuery.isError()) {
              <p>Error</p>
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

  @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

  protected genre = this.bookParamService.genreSignal;
  protected query = this.bookParamService.querySignal;
  protected status = this.bookParamService.statusSignal;
  protected sort = this.bookParamService.sortSignal;

  public showList: boolean = false;

  protected booksInfiniteQuery = this.booksService.booksInfiniteQuery;

  // Flatten pages into a single array of books.
  protected flattenedBooks = computed(() => {
    const data = this.booksInfiniteQuery.data();
    console.log(data);
    console.log(data?.pages.flatMap((page) => page.data.items));

    return data ? data.pages.flatMap((page) => page.data.items) : [];
  });

  protected totalBooksCount = this.booksService.totalBooksCount;

  private updateEffect = effect(() => {
    const search = this.query();
    const genre = this.genre();
    const status = this.status();
    const sort = this.sort();

    this.booksService.updateQueryBooks({
      search,
      genre,
      status,
      sort,
    });
  });

  toggleShowList(state: boolean): void {
    this.showList = state;
  }

  protected onSearch(query: string) {
    this.bookParamService.navigate({
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

  ngAfterViewInit() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          !this.booksInfiniteQuery.isFetchingNextPage()
        ) {
          this.booksInfiniteQuery.fetchNextPage();
        }
      });
    });
    // Start observing the sentinel element.
    observer.observe(this.scrollAnchor.nativeElement);
  }
}
